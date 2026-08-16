import { useMemo, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import DashboardLayout from "../components/DashboardLayout";
import PageHeader from "../components/PageHeader";
import PageSearchBar from "../components/PageSearchBar";
import FilterPanel from "../components/FilterPanel";
import MapLegend from "../components/MapLegend";
import AreaPopup from "../components/AreaPopup";
import EmptyState from "../components/EmptyState";
import { AREAS, DISEASES, SPECIALTIES, STATES } from "../data/mockData";
import { riskHex } from "../components/RiskBadge";
import type { FilterState } from "../types";
import { MapPinOff } from "lucide-react";

const DEFAULT_FILTERS: FilterState = {
  state: "All States",
  city: "All Areas",
  disease: "All Diseases",
  specialty: "All Specialties",
  riskLevel: "All",
};

const RISK_OPTIONS = ["All", "Low", "Medium", "High", "Critical"];

export default function InteractiveMap() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const cityOptions = useMemo(() => {
    const scoped =
      filters.state === "All States" ? AREAS : AREAS.filter((a) => a.state === filters.state);
    return ["All Areas", ...Array.from(new Set(scoped.map((a) => a.name))).sort()];
  }, [filters.state]);

  const filteredAreas = useMemo(() => {
    return AREAS.filter((a) => {
      if (filters.state !== "All States" && a.state !== filters.state) return false;
      if (filters.city !== "All Areas" && a.name !== filters.city) return false;
      if (filters.disease !== "All Diseases" && a.primaryDisease !== filters.disease) return false;
      if (filters.specialty !== "All Specialties" && a.primarySpecialty !== filters.specialty) return false;
      if (filters.riskLevel !== "All" && a.riskLevel !== filters.riskLevel.toLowerCase()) return false;
      return true;
    });
  }, [filters]);

  function handleChange(key: keyof FilterState, value: string) {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "state") next.city = "All Areas"; // reset dependent filter
      return next;
    });
  }

  function handleReset() {
    setFilters(DEFAULT_FILTERS);
  }

  const center: [number, number] = [37.5, -96];

  return (
    <DashboardLayout title="Explore Network" subtitle="Visualize provider availability, identify geographic access gaps, and pinpoint areas with the greatest network needs.">
      <PageHeader
        title="Provider Access & Risk Map"
        description="Visualize provider availability, identify geographic access gaps, and pinpoint areas with the greatest network needs."
        actions={<PageSearchBar />}
      />

      <div className="mb-4">
        <FilterPanel
          fields={[
            { key: "state", label: "State", options: ["All States", ...STATES] },
            { key: "city", label: "City / Area", options: cityOptions },
            { key: "disease", label: "Disease", options: ["All Diseases", ...DISEASES] },
            { key: "specialty", label: "Specialty", options: ["All Specialties", ...SPECIALTIES] },
            { key: "riskLevel", label: "Risk Level", options: RISK_OPTIONS },
          ]}
          values={filters}
          onChange={handleChange}
          onReset={handleReset}
          resultCount={filteredAreas.length}
        />
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-surface-border shadow-card">
        {filteredAreas.length === 0 ? (
          <EmptyState
            icon={MapPinOff}
            title="No areas match these filters"
            description="Try widening your filters — for example, choose a broader state or set risk level back to All."
            action={
              <button
                onClick={handleReset}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Reset filters
              </button>
            }
          />
        ) : (
          <div className="relative h-[600px] w-full">
            <MapContainer center={center} zoom={4} scrollWheelZoom className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredAreas.map((area) => (
                <CircleMarker
                  key={area.id}
                  center={[area.latitude, area.longitude]}
                  radius={9}
                  pathOptions={{
                    color: "#ffffff",
                    weight: 2,
                    fillColor: riskHex(area.riskLevel),
                    fillOpacity: 0.9,
                  }}
                >
                  <Popup>
                    <AreaPopup area={area} />
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
            <div className="pointer-events-none absolute bottom-4 left-4 z-[400]">
              <div className="pointer-events-auto">
                <MapLegend />
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
