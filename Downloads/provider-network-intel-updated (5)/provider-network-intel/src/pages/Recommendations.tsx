import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpDown, Lightbulb, Target, Users2, TrendingUp } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import PageHeader from "../components/PageHeader";
import PageSearchBar from "../components/PageSearchBar";
import ChartCard from "../components/ChartCard";
import KpiCard from "../components/KpiCard";
import DataTable, { type DataTableColumn } from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import LoadingState from "../components/LoadingState";
import FilterPanel from "../components/FilterPanel";
import { getRecommendationsData } from "../services/api";
import { useSelectedArea } from "../context/SelectedAreaContext";
import { SPECIALTIES, STATES } from "../data/mockData";
import type { FilterState, Recommendation, RecommendationSummary } from "../types";

type SortKey = "riskScore" | "providersNeeded" | "avgTravelDistanceKm";

const IMPACT_TONE = { low: "warning", medium: "warning", high: "positive" } as const;
const DEMAND_TONE = { low: "neutral", medium: "warning", high: "negative" } as const;

export default function Recommendations() {
  const navigate = useNavigate();
  const { setSelectedAreaId } = useSelectedArea();

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<RecommendationSummary | null>(null);
  const [items, setItems] = useState<Recommendation[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("riskScore");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [filters, setFilters] = useState<Pick<FilterState, "state" | "specialty">>({
    state: "All States",
    specialty: "All Specialties",
  });

  useEffect(() => {
    getRecommendationsData().then((data) => {
      setSummary(data.summary);
      setItems(data.items);
      setLoading(false);
    });
  }, []);

  const filteredSorted = useMemo(() => {
    let rows = items;
    if (filters.state !== "All States") rows = rows.filter((r) => r.state === filters.state);
    if (filters.specialty !== "All Specialties") rows = rows.filter((r) => r.specialty === filters.specialty);
    rows = [...rows].sort((a, b) => (sortDir === "desc" ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]));
    return rows;
  }, [items, filters, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function goToArea(areaId: string) {
    setSelectedAreaId(areaId);
    navigate("/area-insights");
  }

  function goToSimulate(areaId: string) {
    setSelectedAreaId(areaId);
    navigate("/what-if");
  }

  const sortHeader = (label: string, key: SortKey) => (
    <button onClick={() => toggleSort(key)} className="flex items-center gap-1 hover:text-navy-900">
      {label}
      <ArrowUpDown className="h-3 w-3" />
    </button>
  );

  const columns: DataTableColumn<Recommendation>[] = [
    { key: "rank", header: "Rank", render: (r) => `#${filteredSorted.indexOf(r) + 1}`, widthClass: "w-14" },
    { key: "area", header: "Area", render: (r) => <span className="font-semibold">{r.areaName}</span> },
    { key: "state", header: "State", render: (r) => r.state },
    { key: "specialty", header: "Specialty", render: (r) => r.specialty },
    { key: "riskScore", header: sortHeader("Risk Score", "riskScore"), render: (r) => `${r.riskScore}%` },
    { key: "currentProviders", header: "Current Providers", render: (r) => r.currentProviders },
    {
      key: "providersNeeded",
      header: sortHeader("Providers Needed", "providersNeeded"),
      render: (r) => <span className="font-semibold">{r.providersNeeded}</span>,
    },
    {
      key: "demand",
      header: "Demand",
      render: (r) => <StatusBadge label={cap(r.demand)} tone={DEMAND_TONE[r.demand]} />,
    },
    {
      key: "travel",
      header: sortHeader("Travel Distance", "avgTravelDistanceKm"),
      render: (r) => `${r.avgTravelDistanceKm} km`,
    },
    {
      key: "impact",
      header: "Expected Impact",
      render: (r) => <StatusBadge label={cap(r.expectedImpact)} tone={IMPACT_TONE[r.expectedImpact]} />,
    },
    {
      key: "action",
      header: "Action",
      align: "right",
      render: (r) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => goToArea(r.areaId)}
            className="rounded-md border border-brand-200 px-3 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-50"
          >
            View
          </button>
          <button
            onClick={() => goToSimulate(r.areaId)}
            className="rounded-md bg-navy-900 px-3 py-1 text-xs font-semibold text-white hover:bg-navy-800"
          >
            Simulate
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout title="Recommendations" subtitle="Where to recruit providers next">
      <PageHeader
        eyebrow="Recruitment Strategy"
        title="Provider Recruitment Recommendations"
        description="Prioritized list of areas and specialties where adding providers will have the greatest impact on access."
        actions={<PageSearchBar />}
      />

      {loading || !summary ? (
        <LoadingState label="Loading recommendations..." />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              icon={Target}
              label="Critical Recruitment Areas"
              value={String(summary.criticalRecruitmentAreas)}
              helperText="Requiring immediate action"
              accent="risk"
            />
            <KpiCard
              icon={Users2}
              label="Total Providers Recommended"
              value={String(summary.totalProvidersRecommended)}
              helperText="Across all flagged areas"
            />
            <KpiCard
              icon={TrendingUp}
              label="Highest Risk"
              value={`${summary.highestRiskPct}%`}
              helperText="Top-priority area"
              accent="risk"
            />
            <KpiCard
              icon={Lightbulb}
              label="Potential Access Improvement"
              value={`${summary.potentialAccessImprovementPct}%`}
              helperText="If recommendations are applied"
            />
          </div>

          <FilterPanel
            fields={[
              { key: "state", label: "State", options: ["All States", ...STATES] },
              { key: "specialty", label: "Specialty", options: ["All Specialties", ...SPECIALTIES] },
            ]}
            values={{ ...filters, city: "", disease: "", riskLevel: "" }}
            onChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value } as typeof prev))}
            onReset={() => setFilters({ state: "All States", specialty: "All Specialties" })}
            resultCount={filteredSorted.length}
          />

          <ChartCard title="Recruitment Priority Table" subtitle="Sorted by risk score by default — click a column to re-sort">
            <DataTable columns={columns} rows={filteredSorted} getRowKey={(r) => r.areaId} />
          </ChartCard>
        </div>
      )}
    </DashboardLayout>
  );
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
