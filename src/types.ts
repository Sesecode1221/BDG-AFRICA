export interface Building {
  id: string;
  name: string;
  code: string;
  organization: string;
  location: string;
  climateZone: string;
  grossFloorArea: number; // m²
  occupancyCapacity: number;
  buildingType: string;
  certificationTarget: string; // e.g. "EDGE Advanced / Net Zero Carbon"
  solarCapacityKwp: number; // kWp
  gridCarbonIntensity: number; // kg CO2e / kWh (e.g. 0.92 for SA Eskom grid)
  tariffName: string; // e.g. "City of Cape Town - MV Time-of-Use"
  reportingPeriod: {
    current: string;
    baseline: string;
  };
}

export interface IntervalPoint {
  time: string; // "00:00", "00:30", etc.
  timestamp: string;
  currentKwh: number;
  baselineKwh: number;
  solarGenKwh: number;
  netGridKwh: number;
  outdoorTempC: number;
  hvacKwh: number;
  baseloadKwh: number;
  lightingKwh: number;
  plugLoadKwh: number;
  isAnomaly?: boolean;
  anomalyReason?: string;
}

export interface DayMetric {
  date: string;
  dayOfWeek: string;
  totalKwh: number;
  baselineKwh: number;
  solarKwh: number;
  peakDemandKva: number;
  avgTempC: number;
  cdd: number; // cooling degree days
  hdd: number; // heating degree days
  baseloadRatio: number;
  anomalyDetected: boolean;
  anomalyNote?: string;
}

export interface SubmeterBreakdownData {
  category: string;
  kwh: number;
  percentage: number;
  baselineKwh: number;
  deltaPercent: number;
  color: string;
}

export interface AnomalyItem {
  id: string;
  timestamp: string;
  equipment: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  estimatedWasteKwh: number;
  estimatedCostZar: number;
  potentialCause: string;
  recommendedAction: string;
}

export interface ECMRecommendation {
  id: string;
  title: string;
  category: 'Operational / Zero-CapEx' | 'Low-CapEx Upgrade' | 'Capital Decarbonisation';
  tier: 1 | 2 | 3;
  description: string;
  annualKwhSavings: number;
  annualCostSavingsZar: number;
  annualCo2ReductionTonnes: number;
  estimatedCapexZar: number;
  paybackYears: number;
  roiPercent: number;
  targetEquipment: string;
  status: 'recommended' | 'in-review' | 'approved' | 'implemented';
}

export interface AssessmentMetrics {
  totalCurrentKwh: number;
  totalBaselineKwh: number;
  consumptionVarianceKwh: number;
  consumptionVariancePercent: number;
  daysMeasured: number; // e.g. 41 days since online 9 July 2026
  rawMeasuredEnergyKwh: number; // 17,832 kWh
  isEuiPublishable: boolean; // false if daysMeasured < 30
  euiLabel: string; // e.g. "annualised from 41 days" vs "rolling 12m" vs "insufficient data (<30 days)"
  currentEuiKwhM2: number | null; // kWh/m²/yr (null if <30 days)
  baselineEuiKwhM2: number;
  currentCo2Tonnes: number;
  baselineCo2Tonnes: number;
  co2VarianceTonnes: number;
  solarGenerationKwh: number;
  solarSelfConsumptionPercent: number;
  peakDemandKva: number;
  peakDemandBaselineKva: number;
  averageBaseloadKw: number;
  baseloadPercentage: number;
  weatherCorrectedDeltaPercent: number;
  coolingDegreeDays: number;
  heatingDegreeDays: number;
}

export interface AIAssessmentResult {
  generatedAt: string;
  model: string;
  executiveSummary: string;
  confidenceScore: number;
  
  // 1. What Changed?
  whatChanged: {
    headline: string;
    keyObservations: string[];
    varianceAnalysis: {
      metric: string;
      currentValue: string;
      baselineValue: string;
      delta: string;
      direction: 'increase' | 'decrease' | 'neutral';
      severity: 'positive' | 'warning' | 'alert' | 'neutral';
      context: string;
    }[];
    anomaliesSummary: string;
  };

  // 2. Why Might It Have Changed?
  whyChanged: {
    headline: string;
    rootCauses: {
      factor: string; // e.g. "Weather & Thermal Load", "BMS Scheduling Drift", "Baseload & Server Room"
      likelihood: 'High' | 'Medium' | 'Low';
      contributionPercent: number;
      explanation: string;
      verifiedEvidence: string;
    }[];
    weatherImpactAnalysis: string;
    operationalScheduleFindings: string;
  };

  // 3. What Should We Investigate Next?
  whatNext: {
    headline: string;
    immediateInvestigations: {
      priority: 'Immediate (24-48h)' | 'Short Term (1-2 wks)' | 'Medium Term (1 mo)';
      action: string;
      responsibleTeam: string;
      expectedOutcome: string;
    }[];
    recommendedEcms: ECMRecommendation[];
    netZeroRoadmapImpact: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  citations?: string[];
  suggestedFollowups?: string[];
}

export interface ScenarioSimulationParams {
  solarExpansionKwp: number;
  bessCapacityKwh: number;
  hvacSetpointAdjustmentC: number;
  ledRetrofitCoveragePercent: number;
  bmsNightPurgeEnabled: boolean;
  smartSubmeteringEnabled: boolean;
}

export interface ScenarioSimulationResult {
  projectedAnnualKwh: number;
  baselineAnnualKwh: number;
  annualSavingsKwh: number;
  annualSavingsPercent: number;
  projectedAnnualCo2Tonnes: number;
  baselineAnnualCo2Tonnes: number;
  co2ReductionTonnes: number;
  projectedEui: number;
  totalCapexZar: number;
  annualCostSavingsZar: number;
  simplePaybackYears: number;
  netZero2030GapPercent: number;
}
