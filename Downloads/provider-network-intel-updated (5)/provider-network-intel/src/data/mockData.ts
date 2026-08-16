// ---------------------------------------------------------------------------
// Mock data layer for Provider Network Intelligence.
//
// This is the ONLY place raw demo data lives. Pages/components must never
// hard-code area records — they should import from here (or later, from
// src/services/api.ts once a real backend exists). This keeps the UI fully
// decoupled from the shape of any particular dataset.
// ---------------------------------------------------------------------------

import type {
  Area,
  DashboardMetrics,
  Disease,
  Recommendation,
  RecommendationSummary,
  RiskDistributionSlice,
  RiskLevel,
  Specialty,
  SpecialtyGapDatum,
  TrendPoint,
} from "../types";

// ---- lookups ---------------------------------------------------------------

export const SPECIALTIES: Specialty[] = [
  "Cardiology",
  "Oncology",
  "Neurology",
  "Endocrinology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Dermatology",
];

export const DISEASES: Disease[] = [
  "Diabetes",
  "Heart Disease",
  "Cancer",
  "Hypertension",
  "Chronic Kidney Disease",
  "Respiratory Disease",
];

export const STATES = [
  "Texas",
  "California",
  "Florida",
  "New York",
  "Georgia",
  "Ohio",
  "North Carolina",
  "Arizona",
  "Michigan",
  "Illinois",
];

function riskLevelFromScore(score: number): RiskLevel {
  if (score >= 85) return "critical";
  if (score >= 65) return "high";
  if (score >= 40) return "medium";
  return "low";
}

// ---- raw area seed data -----------------------------------------------------
// Coordinates are approximate real-world city locations so the map reads as
// geographically plausible. All names, populations, and scores are fictional.

interface AreaSeed {
  name: string;
  state: string;
  lat: number;
  lng: number;
  population: number;
  specialty: Specialty;
  disease: Disease;
  supply: number;
  riskScore: number;
  travelKm: number;
}

const AREA_SEEDS: AreaSeed[] = [
  { name: "Dallas North", state: "Texas", lat: 32.85, lng: -96.85, population: 250000, specialty: "Cardiology", disease: "Heart Disease", supply: 2, riskScore: 91, travelKm: 36.2 },
  { name: "Houston East", state: "Texas", lat: 29.76, lng: -95.2, population: 198000, specialty: "Oncology", disease: "Cancer", supply: 3, riskScore: 78, travelKm: 29.4 },
  { name: "Austin South", state: "Texas", lat: 30.22, lng: -97.75, population: 142500, specialty: "Endocrinology", disease: "Diabetes", supply: 4, riskScore: 58, travelKm: 18.6 },
  { name: "San Antonio West", state: "Texas", lat: 29.45, lng: -98.62, population: 176300, specialty: "Neurology", disease: "Hypertension", supply: 3, riskScore: 69, travelKm: 24.1 },
  { name: "Miami Gardens", state: "Florida", lat: 25.94, lng: -80.24, population: 210500, specialty: "Oncology", disease: "Cancer", supply: 2, riskScore: 87, travelKm: 33.5 },
  { name: "Orlando Central", state: "Florida", lat: 28.5, lng: -81.38, population: 165800, specialty: "Cardiology", disease: "Heart Disease", supply: 3, riskScore: 71, travelKm: 22.8 },
  { name: "Tampa Bay", state: "Florida", lat: 27.97, lng: -82.46, population: 188400, specialty: "Neurology", disease: "Respiratory Disease", supply: 4, riskScore: 54, travelKm: 16.9 },
  { name: "Jacksonville North", state: "Florida", lat: 30.42, lng: -81.66, population: 121600, specialty: "Pediatrics", disease: "Respiratory Disease", supply: 5, riskScore: 39, travelKm: 11.2 },
  { name: "Fresno Valley", state: "California", lat: 36.75, lng: -119.77, population: 231000, specialty: "Endocrinology", disease: "Diabetes", supply: 2, riskScore: 84, travelKm: 31.7 },
  { name: "Bakersfield East", state: "California", lat: 35.37, lng: -119.02, population: 154200, specialty: "Cardiology", disease: "Heart Disease", supply: 3, riskScore: 66, travelKm: 21.4 },
  { name: "Oakland Hills", state: "California", lat: 37.8, lng: -122.22, population: 118900, specialty: "Psychiatry", disease: "Hypertension", supply: 5, riskScore: 44, travelKm: 13.8 },
  { name: "Sacramento Delta", state: "California", lat: 38.58, lng: -121.49, population: 173500, specialty: "Orthopedics", disease: "Chronic Kidney Disease", supply: 4, riskScore: 57, travelKm: 19.1 },
  { name: "Bronx Heights", state: "New York", lat: 40.85, lng: -73.87, population: 264000, specialty: "Cardiology", disease: "Heart Disease", supply: 3, riskScore: 74, travelKm: 27.6 },
  { name: "Buffalo Riverside", state: "New York", lat: 42.89, lng: -78.88, population: 138700, specialty: "Oncology", disease: "Cancer", supply: 2, riskScore: 81, travelKm: 30.2 },
  { name: "Rochester Park", state: "New York", lat: 43.16, lng: -77.61, population: 109200, specialty: "Endocrinology", disease: "Diabetes", supply: 4, riskScore: 49, travelKm: 15.3 },
  { name: "Albany Hills", state: "New York", lat: 42.65, lng: -73.75, population: 96400, specialty: "Dermatology", disease: "Respiratory Disease", supply: 5, riskScore: 33, travelKm: 9.7 },
  { name: "Atlanta Southside", state: "Georgia", lat: 33.65, lng: -84.42, population: 219800, specialty: "Oncology", disease: "Cancer", supply: 2, riskScore: 87, travelKm: 34.8 },
  { name: "Savannah Coast", state: "Georgia", lat: 32.03, lng: -81.1, population: 87300, specialty: "Neurology", disease: "Hypertension", supply: 3, riskScore: 62, travelKm: 20.5 },
  { name: "Augusta Ridge", state: "Georgia", lat: 33.47, lng: -81.97, population: 101500, specialty: "Cardiology", disease: "Heart Disease", supply: 3, riskScore: 68, travelKm: 23.2 },
  { name: "North Carolina Piedmont", state: "North Carolina", lat: 35.79, lng: -80.79, population: 157200, specialty: "Orthopedics", disease: "Chronic Kidney Disease", supply: 4, riskScore: 52, travelKm: 17.4 },
  { name: "Charlotte Metro", state: "North Carolina", lat: 35.23, lng: -80.84, population: 246700, specialty: "Endocrinology", disease: "Diabetes", supply: 2, riskScore: 76, travelKm: 28.1 },
  { name: "Raleigh Trace", state: "North Carolina", lat: 35.78, lng: -78.64, population: 132900, specialty: "Psychiatry", disease: "Respiratory Disease", supply: 4, riskScore: 48, travelKm: 14.6 },
  { name: "Columbus Landing", state: "Ohio", lat: 39.96, lng: -83.0, population: 168500, specialty: "Cardiology", disease: "Heart Disease", supply: 3, riskScore: 65, travelKm: 20.9 },
  { name: "Cleveland Lakeside", state: "Ohio", lat: 41.5, lng: -81.69, population: 189600, specialty: "Oncology", disease: "Cancer", supply: 2, riskScore: 82, travelKm: 31.4 },
  { name: "Cincinnati Ridge", state: "Ohio", lat: 39.1, lng: -84.51, population: 114300, specialty: "Endocrinology", disease: "Diabetes", supply: 4, riskScore: 46, travelKm: 13.1 },
  { name: "Phoenix Desert", state: "Arizona", lat: 33.45, lng: -112.07, population: 227400, specialty: "Cardiology", disease: "Heart Disease", supply: 2, riskScore: 89, travelKm: 35.6 },
  { name: "Tucson Foothills", state: "Arizona", lat: 32.22, lng: -110.97, population: 128900, specialty: "Neurology", disease: "Hypertension", supply: 3, riskScore: 63, travelKm: 22.0 },
  { name: "Mesa Vista", state: "Arizona", lat: 33.42, lng: -111.83, population: 95600, specialty: "Pediatrics", disease: "Respiratory Disease", supply: 5, riskScore: 36, travelKm: 10.4 },
  { name: "Detroit Riverfront", state: "Michigan", lat: 42.33, lng: -83.05, population: 203800, specialty: "Oncology", disease: "Cancer", supply: 2, riskScore: 85, travelKm: 32.9 },
  { name: "Grand Rapids West", state: "Michigan", lat: 42.96, lng: -85.67, population: 112400, specialty: "Endocrinology", disease: "Diabetes", supply: 4, riskScore: 47, travelKm: 14.0 },
  { name: "Ann Arbor Central", state: "Michigan", lat: 42.28, lng: -83.74, population: 79200, specialty: "Dermatology", disease: "Respiratory Disease", supply: 5, riskScore: 29, travelKm: 8.3 },
  { name: "Chicago South Loop", state: "Illinois", lat: 41.79, lng: -87.63, population: 241900, specialty: "Cardiology", disease: "Heart Disease", supply: 3, riskScore: 72, travelKm: 25.7 },
  { name: "Springfield Prairie", state: "Illinois", lat: 39.8, lng: -89.65, population: 68500, specialty: "Orthopedics", disease: "Chronic Kidney Disease", supply: 3, riskScore: 55, travelKm: 18.0 },
  { name: "Peoria Junction", state: "Illinois", lat: 40.69, lng: -89.59, population: 74100, specialty: "Psychiatry", disease: "Hypertension", supply: 4, riskScore: 42, travelKm: 12.5 },
];

function seedToArea(seed: AreaSeed, index: number): Area {
  const id = `area-${index + 1}`;
  const riskLevel = riskLevelFromScore(seed.riskScore);
  const populationFactor = seed.population / 100000;
  const supplyGap = Math.max(0, 5 - seed.supply);
  const providersNeeded = Math.max(1, Math.round(supplyGap * (0.6 + populationFactor * 0.15)));

  const demandPressure = Math.min(100, Math.round(seed.riskScore * 0.95 + populationFactor));
  const providerShortage = Math.min(100, Math.round((5 - seed.supply) * 20 + 5));
  const travelDistanceFactor = Math.min(100, Math.round(seed.travelKm * 2.4));
  const utilization = Math.min(100, Math.round(seed.riskScore * 0.8 + supplyGap * 3));

  const networkAdequacyPct = Math.max(5, Math.min(95, Math.round(100 - seed.riskScore * 0.65)));

  const demandLevel = seed.riskScore >= 70 ? "high" : seed.riskScore >= 45 ? "medium" : "low";
  const expectedImpact = providersNeeded >= 3 ? "high" : providersNeeded === 2 ? "medium" : "low";

  return {
    id,
    name: seed.name,
    state: seed.state,
    latitude: seed.lat,
    longitude: seed.lng,
    population: seed.population,
    primarySpecialty: seed.specialty,
    primaryDisease: seed.disease,
    providerSupply: seed.supply,
    demandLevel,
    riskScore: seed.riskScore,
    riskLevel,
    accessGap: riskLevel,
    avgTravelDistanceKm: seed.travelKm,
    networkAdequacyPct,
    providersNeeded,
    recommendationConfidencePct: Math.min(97, Math.round(seed.riskScore * 1.0 + 4)),
    expectedImpact,
    riskFactors: {
      demandPressure,
      providerShortage,
      travelDistance: travelDistanceFactor,
      utilization,
    },
    lastUpdated: "2026-07-31",
  };
}

export const AREAS: Area[] = AREA_SEEDS.map(seedToArea);

export function getAreaById(id: string): Area | undefined {
  return AREAS.find((a) => a.id === id);
}

export function getAreaByName(name: string): Area | undefined {
  return AREAS.find((a) => a.name === name);
}

// ---- dashboard aggregates ----------------------------------------------------

export const DASHBOARD_METRICS: DashboardMetrics = {
  totalAreas: 1248,
  totalAreasTrendPct: 3.1,
  totalProviders: 18542,
  totalProvidersTrendPct: 4.6,
  highRiskAreas: 246,
  highRiskAreasTrendPct: 12,
  accessGapAreas: 512,
  accessGapAreasTrendPct: 6.8,
  avgTravelDistanceKm: 28.6,
  avgTravelDistanceTrendPct: -2.4,
};

export const RISK_DISTRIBUTION: RiskDistributionSlice[] = [
  { level: "low", label: "Low", areaCount: 640 },
  { level: "medium", label: "Medium", areaCount: 362 },
  { level: "high", label: "High", areaCount: 178 },
  { level: "critical", label: "Critical", areaCount: 68 },
];

export const SPECIALTY_GAPS: SpecialtyGapDatum[] = [
  { specialty: "Cardiology", areasWithGap: 128 },
  { specialty: "Oncology", areasWithGap: 98 },
  { specialty: "Endocrinology", areasWithGap: 76 },
  { specialty: "Neurology", areasWithGap: 61 },
  { specialty: "Orthopedics", areasWithGap: 47 },
  { specialty: "Pediatrics", areasWithGap: 34 },
];

export const ACCESS_GAP_TREND: TrendPoint[] = [
  { month: "Jan", accessGapAreas: 468 },
  { month: "Feb", accessGapAreas: 474 },
  { month: "Mar", accessGapAreas: 481 },
  { month: "Apr", accessGapAreas: 492 },
  { month: "May", accessGapAreas: 486 },
  { month: "Jun", accessGapAreas: 501 },
  { month: "Jul", accessGapAreas: 512 },
];

// Top critical areas for dashboard table — top N by riskScore.
export function getTopCriticalAreas(count = 5): Area[] {
  return [...AREAS].sort((a, b) => b.riskScore - a.riskScore).slice(0, count);
}

// ---- recommendations ----------------------------------------------------

export function getRecommendations(): Recommendation[] {
  return [...AREAS]
    .sort((a, b) => b.riskScore - a.riskScore)
    .map((area, i) => ({
      rank: i + 1,
      areaId: area.id,
      areaName: area.name,
      state: area.state,
      specialty: area.primarySpecialty,
      riskScore: area.riskScore,
      currentProviders: area.providerSupply,
      providersNeeded: area.providersNeeded,
      demand: area.demandLevel,
      avgTravelDistanceKm: area.avgTravelDistanceKm,
      expectedImpact: area.expectedImpact,
    }));
}

export const RECOMMENDATION_SUMMARY: RecommendationSummary = {
  criticalRecruitmentAreas: 24,
  totalProvidersRecommended: 67,
  highestRiskPct: 94,
  potentialAccessImprovementPct: 42,
};

// ---- what-if simulator ----------------------------------------------------

export function computeWhatIf(areaId: string, specialty: Specialty, providersToAdd: number) {
  const area = getAreaById(areaId);
  if (!area) return null;

  const currentRisk = area.riskScore;

  // Simple mock decay formula: each added provider reduces risk with
  // diminishing returns, floor of ~12 (never fully "solved" by this alone).
  const riskAt = (added: number) => {
    const decay = 1 - Math.exp(-added * 0.42);
    const reduction = (currentRisk - 12) * decay;
    return Math.max(12, Math.round(currentRisk - reduction));
  };

  const predictedRisk = riskAt(providersToAdd);
  const accessImprovementPct = Math.round(((currentRisk - predictedRisk) / currentRisk) * 100);
  const newProviderCount = area.providerSupply + providersToAdd;
  const predictedAccessGap = riskLevelFromScore(predictedRisk);
  const expectedImpact: "low" | "medium" | "high" =
    accessImprovementPct >= 40 ? "high" : accessImprovementPct >= 18 ? "medium" : "low";

  const curve = [0, 1, 2, 3, 4, 5].map((n) => ({
    providersAdded: n,
    predictedRiskScore: riskAt(n),
  }));

  return {
    areaId: area.id,
    areaName: area.name,
    state: area.state,
    specialty,
    currentProviders: area.providerSupply,
    providersToAdd,
    newProviderCount,
    currentRiskScore: currentRisk,
    predictedRiskScore: predictedRisk,
    accessImprovementPct,
    predictedAccessGap,
    expectedImpact,
    curve,
  };
}

