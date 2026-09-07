import { AssessmentMetrics, ScenarioSimulationParams, ScenarioSimulationResult } from '../types';

export const ESKOM_EMISSION_FACTOR = 0.92; // kg CO2e per kWh for South African grid
export const AVERAGE_TARIFF_ZAR_PER_KWH = 2.70; // Blended ZAR / kWh for commercial users in Cape Town

export function calculateScope2Emissions(kwh: number, emissionFactor: number = ESKOM_EMISSION_FACTOR): number {
  return Number(((kwh * emissionFactor) / 1000).toFixed(2)); // in metric tonnes CO2e
}

export interface EUICalculationResult {
  eui: number | null; // null if daysMeasured < 30
  isPublishable: boolean; // false if below 30 days of data safeguard
  daysMeasured: number;
  label: string; // e.g. "annualised from 41 days" | "rolling 12m" | "insufficient data (<30 days)"
  annualisedKwh: number | null;
  rawEnergyKwh: number;
  grossFloorAreaM2: number;
  explanation: string;
}

/**
 * Calculates Energy Use Intensity (EUI in kWh/m²/yr) with proper annualisation:
 * EUI = (energy measured ÷ days measured) × 365 ÷ floor area
 * 
 * Two safeguards:
 * 1. Below 30 days of data, no EUI is published (returns null / isPublishable: false)
 * 2. If daysMeasured < 365, label reads "annualised from X days" instead of "rolling 12m"
 */
export function calculateEUI(
  energyMeasuredKwh: number,
  daysMeasured: number,
  grossFloorAreaM2: number
): EUICalculationResult {
  if (grossFloorAreaM2 <= 0) {
    return {
      eui: null,
      isPublishable: false,
      daysMeasured,
      label: 'invalid floor area',
      annualisedKwh: null,
      rawEnergyKwh: energyMeasuredKwh,
      grossFloorAreaM2,
      explanation: 'Gross floor area must be greater than 0 m².',
    };
  }

  // Safeguard 1: Below 30 days of data, publish no EUI at all
  if (daysMeasured < 30) {
    return {
      eui: null,
      isPublishable: false,
      daysMeasured,
      label: 'insufficient data (<30 days)',
      annualisedKwh: null,
      rawEnergyKwh: energyMeasuredKwh,
      grossFloorAreaM2,
      explanation: `Safeguard active: Only ${daysMeasured} days of telemetry recorded. A minimum of 30 days is required to avoid premature extrapolation.`,
    };
  }

  // Proper annualisation formula
  const annualisedKwh = (energyMeasuredKwh / daysMeasured) * 365;
  const eui = Number((annualisedKwh / grossFloorAreaM2).toFixed(1));

  // Safeguard 2: Label as "annualised from X days" vs "rolling 12m"
  const label = daysMeasured >= 365
    ? 'rolling 12m'
    : `annualised from ${daysMeasured} days`;

  return {
    eui,
    isPublishable: true,
    daysMeasured,
    label,
    annualisedKwh: Math.round(annualisedKwh),
    rawEnergyKwh: energyMeasuredKwh,
    grossFloorAreaM2,
    explanation: `(${formatNumber(energyMeasuredKwh)} kWh ÷ ${daysMeasured} days) × 365 ÷ ${formatNumber(grossFloorAreaM2)} m² = ${eui} kWh/m²/yr (${label})`,
  };
}

export function calculateBaseloadRatio(minKw: number, peakKw: number): number {
  if (peakKw <= 0) return 0;
  return Number(((minKw / peakKw) * 100).toFixed(1));
}

export function runScenarioSimulation(
  currentMetrics: AssessmentMetrics,
  floorAreaM2: number,
  params: ScenarioSimulationParams
): ScenarioSimulationResult {
  // Annualized baseline
  const baselineAnnualKwh = currentMetrics.totalCurrentKwh * 12;
  const baselineAnnualCo2Tonnes = (baselineAnnualKwh * ESKOM_EMISSION_FACTOR) / 1000;

  // 1. Solar PV Expansion savings (Cape Town average specific yield ~1,550 kWh/kWp/yr)
  const solarSavingsKwh = params.solarExpansionKwp * 1550;
  const solarCapex = params.solarExpansionKwp * 7800; // ~R7,800 per kWp installed

  // 2. BESS storage savings (peak shaving and time-of-use arbitrage ~300 cycles/yr * 0.85 efficiency)
  const bessAnnualSavingsKwh = params.bessCapacityKwh * 300 * 0.4; // peak arbitrage equivalent
  const bessCapex = params.bessCapacityKwh * 5200; // ~R5,200 per kWh storage capacity

  // 3. HVAC Setpoint adjustment (~4.5% cooling energy reduction per 1°C increase)
  const hvacAnnualKwh = baselineAnnualKwh * 0.53; // HVAC is ~53% of load
  const hvacSavingsKwh = hvacAnnualKwh * (params.hvacSetpointAdjustmentC * 0.045);
  const hvacCapex = 0; // Purely operational BMS setpoint adjustment

  // 4. LED Retrofit coverage (Lighting is ~12% of load, LED cuts 45% of lighting power)
  const lightingAnnualKwh = baselineAnnualKwh * 0.12;
  const ledSavingsKwh = lightingAnnualKwh * (params.ledRetrofitCoveragePercent / 100) * 0.45;
  const ledCapex = (params.ledRetrofitCoveragePercent / 100) * 28000;

  // 5. BMS Night Purge & Scheduling Setback
  const nightPurgeSavingsKwh = params.bmsNightPurgeEnabled ? baselineAnnualKwh * 0.065 : 0;
  const nightPurgeCapex = params.bmsNightPurgeEnabled ? 12000 : 0;

  // 6. Smart Submetering & AI Anomaly Detection (averages 5-8% savings through leak prevention)
  const submeteringSavingsKwh = params.smartSubmeteringEnabled ? baselineAnnualKwh * 0.055 : 0;
  const submeteringCapex = params.smartSubmeteringEnabled ? 18000 : 0;

  // Totals
  const totalAnnualSavingsKwh = Math.min(
    baselineAnnualKwh * 0.85, // Cap at 85% max theoretical reduction
    solarSavingsKwh + bessAnnualSavingsKwh + hvacSavingsKwh + ledSavingsKwh + nightPurgeSavingsKwh + submeteringSavingsKwh
  );

  const projectedAnnualKwh = Math.max(0, baselineAnnualKwh - totalAnnualSavingsKwh);
  const annualSavingsPercent = Number(((totalAnnualSavingsKwh / baselineAnnualKwh) * 100).toFixed(1));
  const projectedAnnualCo2Tonnes = Number(((projectedAnnualKwh * ESKOM_EMISSION_FACTOR) / 1000).toFixed(1));
  const co2ReductionTonnes = Number((baselineAnnualCo2Tonnes - projectedAnnualCo2Tonnes).toFixed(1));
  const projectedEui = Number((projectedAnnualKwh / floorAreaM2).toFixed(1));

  const totalCapexZar = solarCapex + bessCapex + hvacCapex + ledCapex + nightPurgeCapex + submeteringCapex;
  const annualCostSavingsZar = Number((totalAnnualSavingsKwh * AVERAGE_TARIFF_ZAR_PER_KWH).toFixed(0));
  const simplePaybackYears = annualCostSavingsZar > 0 ? Number((totalCapexZar / annualCostSavingsZar).toFixed(2)) : 0;

  // Net Zero 2030 target benchmark for Cape Town commercial buildings is ~35-45 kWh/m²/yr
  const netZeroTargetEui = 40.0;
  const netZero2030GapPercent = Number(Math.max(0, ((projectedEui - netZeroTargetEui) / netZeroTargetEui) * 100).toFixed(1));

  return {
    projectedAnnualKwh: Math.round(projectedAnnualKwh),
    baselineAnnualKwh: Math.round(baselineAnnualKwh),
    annualSavingsKwh: Math.round(totalAnnualSavingsKwh),
    annualSavingsPercent,
    projectedAnnualCo2Tonnes,
    baselineAnnualCo2Tonnes: Number(baselineAnnualCo2Tonnes.toFixed(1)),
    co2ReductionTonnes,
    projectedEui,
    totalCapexZar: Math.round(totalCapexZar),
    annualCostSavingsZar,
    simplePaybackYears,
    netZero2030GapPercent,
  };
}

export function formatZar(value: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);
}
