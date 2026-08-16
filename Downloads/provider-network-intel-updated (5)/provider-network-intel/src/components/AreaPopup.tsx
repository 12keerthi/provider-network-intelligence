import { useNavigate } from "react-router-dom";
import type { Area } from "../types";
import RiskBadge from "./RiskBadge";
import { useSelectedArea } from "../context/SelectedAreaContext";

interface AreaPopupProps {
  area: Area;
}

export default function AreaPopup({ area }: AreaPopupProps) {
  const navigate = useNavigate();
  const { setSelectedAreaId } = useSelectedArea();

  return (
    <div className="p-4">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-navy-900">{area.name}</p>
          <p className="text-xs text-slate-400">{area.state}</p>
        </div>
        <RiskBadge level={area.riskLevel} size="sm" />
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-y-2 text-xs">
        <dt className="text-slate-400">Population</dt>
        <dd className="text-right font-semibold text-navy-900">{area.population.toLocaleString()}</dd>
        <dt className="text-slate-400">Specialty</dt>
        <dd className="text-right font-semibold text-navy-900">{area.primarySpecialty}</dd>
        <dt className="text-slate-400">Providers</dt>
        <dd className="text-right font-semibold text-navy-900">{area.providerSupply}</dd>
        <dt className="text-slate-400">Risk Score</dt>
        <dd className="text-right font-semibold text-navy-900">{area.riskScore}%</dd>
        <dt className="text-slate-400">Access Gap</dt>
        <dd className="text-right font-semibold capitalize text-navy-900">{area.accessGap}</dd>
      </dl>
      <button
        type="button"
        onClick={() => {
          setSelectedAreaId(area.id);
          navigate("/area-insights");
        }}
        className="mt-4 w-full rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white hover:bg-brand-700"
      >
        View Details
      </button>
    </div>
  );
}
