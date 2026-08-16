// ---------------------------------------------------------------------------
// Future API service layer.
//
// Every function below currently resolves from the local mock data layer
// (src/data/mockData.ts) wrapped in a Promise, so call sites already use the
// same async shape they will use once a real FastAPI backend exists.
//
// To connect the real backend later:
//   1. Replace the function body with a fetch() call to the FastAPI route.
//   2. Keep the return type identical — pages depend on these types only,
//      never on mock-data internals.
//   3. Remove the artificial delay() calls.
//
// Example of what a wired-up version will look like:
//
//   export async function getDashboardData(): Promise<DashboardMetrics> {
//     const res = await fetch(`${API_BASE_URL}/dashboard`);
//     if (!res.ok) throw new Error("Failed to load dashboard metrics");
//     return res.json();
//   }
// ---------------------------------------------------------------------------

import type {
  Area,
  DashboardMetrics,
  Recommendation,
  RecommendationSummary,
  RiskDistributionSlice,
  Specialty,
  SpecialtyGapDatum,
  TrendPoint,
  WhatIfResult,
} from "../types";
import {
  ACCESS_GAP_TREND,
  AREAS,
  DASHBOARD_METRICS,
  RECOMMENDATION_SUMMARY,
  RISK_DISTRIBUTION,
  SPECIALTY_GAPS,
  computeWhatIf,
  getAreaById,
  getRecommendations,
  getTopCriticalAreas,
} from "../data/mockData";

// Base URL the real backend will eventually be served from.
// Not used yet — kept here so it's obvious where to wire things up.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

function delay<T>(value: T, ms = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getDashboardData(): Promise<{
  metrics: DashboardMetrics;
  riskDistribution: RiskDistributionSlice[];
  specialtyGaps: SpecialtyGapDatum[];
  trend: TrendPoint[];
  topCriticalAreas: Area[];
}> {
  return delay({
    metrics: DASHBOARD_METRICS,
    riskDistribution: RISK_DISTRIBUTION,
    specialtyGaps: SPECIALTY_GAPS,
    trend: ACCESS_GAP_TREND,
    topCriticalAreas: getTopCriticalAreas(5),
  });
}

export async function getAreas(): Promise<Area[]> {
  return delay(AREAS);
}

export async function getAreaDetails(areaId: string): Promise<Area | null> {
  return delay(getAreaById(areaId) ?? null);
}

export async function getRecommendationsData(): Promise<{
  summary: RecommendationSummary;
  items: Recommendation[];
}> {
  return delay({ summary: RECOMMENDATION_SUMMARY, items: getRecommendations() });
}

export async function getWhatIfPrediction(
  areaId: string,
  specialty: Specialty,
  providersAdded: number
): Promise<WhatIfResult | null> {
  return delay(computeWhatIf(areaId, specialty, providersAdded) as WhatIfResult | null, 150);
}
