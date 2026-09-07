import React, { useState, useMemo } from 'react';
import { Building, AssessmentMetrics, ScenarioSimulationParams, ECMRecommendation } from '../types';
import { runScenarioSimulation, formatZar, formatNumber } from '../utils/carbonCalculators';
import { Sliders, Sun, BatteryCharging, Thermometer, Lightbulb, Moon, ShieldCheck, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface ScenarioSimulatorProps {
  building: Building;
  metrics: AssessmentMetrics;
  selectedEcm?: ECMRecommendation | null;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  building,
  metrics,
  selectedEcm,
}) => {
  const [params, setParams] = useState<ScenarioSimulationParams>({
    solarExpansionKwp: 35,
    bessCapacityKwh: 60,
    hvacSetpointAdjustmentC: 1.5,
    ledRetrofitCoveragePercent: 80,
    bmsNightPurgeEnabled: true,
    smartSubmeteringEnabled: true,
  });

  // Calculate live results deterministically
  const results = useMemo(() => {
    return runScenarioSimulation(metrics, building.grossFloorArea, params);
  }, [metrics, building.grossFloorArea, params]);

  const presetBalancedNetZero = () => {
    setParams({
      solarExpansionKwp: 45,
      bessCapacityKwh: 80,
      hvacSetpointAdjustmentC: 1.5,
      ledRetrofitCoveragePercent: 100,
      bmsNightPurgeEnabled: true,
      smartSubmeteringEnabled: true,
    });
  };

  const presetZeroCapExOnly = () => {
    setParams({
      solarExpansionKwp: 0,
      bessCapacityKwh: 0,
      hvacSetpointAdjustmentC: 2.0,
      ledRetrofitCoveragePercent: 0,
      bmsNightPurgeEnabled: true,
      smartSubmeteringEnabled: true,
    });
  };

  const presetSolarFocus = () => {
    setParams({
      solarExpansionKwp: 60,
      bessCapacityKwh: 100,
      hvacSetpointAdjustmentC: 1.0,
      ledRetrofitCoveragePercent: 50,
      bmsNightPurgeEnabled: true,
      smartSubmeteringEnabled: true,
    });
  };

  return (
    <div className="bg-white border border-[#E2E8E4] rounded-2xl p-5 sm:p-6 text-[#1A2E22] shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8E4] pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#1A2E22] flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#166534]" />
            <span>Interactive Net-Zero Decarbonisation Modeler</span>
          </h3>
          <p className="text-xs text-[#61776B] mt-1">
            Simulate combinations of capital retrofits and operational BMS measures against 2030 Net Zero Carbon benchmarks
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-xs text-[#61776B] font-medium mr-1 hidden sm:inline">Presets:</span>
          <button
            type="button"
            onClick={presetBalancedNetZero}
            className="px-3 py-1.5 rounded-lg bg-[#EAF5EE] hover:bg-[#D8EDE0] text-xs font-bold text-[#166534] border border-[#CDE5D5] transition-colors cursor-pointer"
          >
            Net-Zero 2030
          </button>
          <button
            type="button"
            onClick={presetZeroCapExOnly}
            className="px-3 py-1.5 rounded-lg bg-[#EFF6FF] hover:bg-[#DBEAFE] text-xs font-bold text-[#1D4ED8] border border-[#DBEAFE] transition-colors cursor-pointer"
          >
            Zero-CapEx BMS
          </button>
          <button
            type="button"
            onClick={presetSolarFocus}
            className="px-3 py-1.5 rounded-lg bg-[#FEF9EE] hover:bg-[#FDF0D5] text-xs font-bold text-[#9A6B15] border border-[#FCE7BA] transition-colors cursor-pointer"
          >
            Solar + BESS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders & Controls */}
        <div className="lg:col-span-7 space-y-5">
          {/* Slider 1: Solar PV Expansion */}
          <div className="bg-[#F8FAF8] border border-[#E2E8E4] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="flex items-center gap-2 text-[#9A6B15] font-bold">
                <Sun className="w-4 h-4 text-[#D97706]" />
                Rooftop Solar PV Expansion
              </span>
              <span className="font-mono font-bold text-[#1A2E22] bg-white px-2.5 py-0.5 rounded border border-[#E2E8E4] shadow-xs">
                +{params.solarExpansionKwp} kWp (Total: {building.solarCapacityKwp + params.solarExpansionKwp} kWp)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={params.solarExpansionKwp}
              onChange={(e) => setParams({ ...params, solarExpansionKwp: Number(e.target.value) })}
              className="w-full accent-[#166534] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#61776B] font-medium">
              <span>0 kWp</span>
              <span>45 kWp (Standard)</span>
              <span>90 kWp (Full Roof)</span>
            </div>
          </div>

          {/* Slider 2: BESS Battery Storage */}
          <div className="bg-[#F8FAF8] border border-[#E2E8E4] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="flex items-center gap-2 text-[#6D28D9] font-bold">
                <BatteryCharging className="w-4 h-4 text-[#7C3AED]" />
                BESS Battery Energy Storage
              </span>
              <span className="font-mono font-bold text-[#1A2E22] bg-white px-2.5 py-0.5 rounded border border-[#E2E8E4] shadow-xs">
                {params.bessCapacityKwh} kWh LiFePO4
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="150"
              step="10"
              value={params.bessCapacityKwh}
              onChange={(e) => setParams({ ...params, bessCapacityKwh: Number(e.target.value) })}
              className="w-full accent-[#166534] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#61776B] font-medium">
              <span>0 kWh</span>
              <span>60 kWh</span>
              <span>150 kWh (Microgrid)</span>
            </div>
          </div>

          {/* Slider 3: HVAC Setpoint Adjustment */}
          <div className="bg-[#F8FAF8] border border-[#E2E8E4] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="flex items-center gap-2 text-[#1D4ED8] font-bold">
                <Thermometer className="w-4 h-4 text-[#2563EB]" />
                HVAC Thermostat Setpoint Setback
              </span>
              <span className="font-mono font-bold text-[#1A2E22] bg-white px-2.5 py-0.5 rounded border border-[#E2E8E4] shadow-xs">
                +{params.hvacSetpointAdjustmentC}°C (Comfort Setpoint: {21.5 + params.hvacSetpointAdjustmentC}°C)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="0.5"
              value={params.hvacSetpointAdjustmentC}
              onChange={(e) => setParams({ ...params, hvacSetpointAdjustmentC: Number(e.target.value) })}
              className="w-full accent-[#166534] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#61776B] font-medium">
              <span>0°C (Unadjusted 21.5°C)</span>
              <span>+1.5°C (Eco 23.0°C)</span>
              <span>+3.0°C (24.5°C ASHRAE Standard)</span>
            </div>
          </div>

          {/* Slider 4: LED Retrofit Coverage */}
          <div className="bg-[#F8FAF8] border border-[#E2E8E4] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="flex items-center gap-2 text-[#166534] font-bold">
                <Lightbulb className="w-4 h-4 text-[#166534]" />
                LED & Smart Daylight Harvesting
              </span>
              <span className="font-mono font-bold text-[#1A2E22] bg-white px-2.5 py-0.5 rounded border border-[#E2E8E4] shadow-xs">
                {params.ledRetrofitCoveragePercent}% Retrofitted
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={params.ledRetrofitCoveragePercent}
              onChange={(e) => setParams({ ...params, ledRetrofitCoveragePercent: Number(e.target.value) })}
              className="w-full accent-[#166534] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#61776B] font-medium">
              <span>0% (Existing)</span>
              <span>50% (Common areas)</span>
              <span>100% (Entire Facility)</span>
            </div>
          </div>

          {/* Operational Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center justify-between bg-[#F8FAF8] border border-[#E2E8E4] rounded-xl p-3.5 cursor-pointer hover:border-[#CBD8D0] transition-all">
              <div className="flex items-center gap-2.5">
                <Moon className="w-4 h-4 text-[#6D28D9]" />
                <div>
                  <div className="text-xs font-bold text-[#1A2E22]">BMS Night Purge & 17:30 Lock</div>
                  <div className="text-[11px] text-[#61776B]">Eliminates evening runaway overrides</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={params.bmsNightPurgeEnabled}
                onChange={(e) => setParams({ ...params, bmsNightPurgeEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-[#166534] focus:ring-0 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between bg-[#F8FAF8] border border-[#E2E8E4] rounded-xl p-3.5 cursor-pointer hover:border-[#CBD8D0] transition-all">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#166534]" />
                <div>
                  <div className="text-xs font-bold text-[#1A2E22]">Smart Sub-metering AI Alerts</div>
                  <div className="text-[11px] text-[#61776B]">CRAC setpoint & leak alarms</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={params.smartSubmeteringEnabled}
                onChange={(e) => setParams({ ...params, smartSubmeteringEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-[#166534] focus:ring-0 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Right Column: Projected Impact Card */}
        <div className="lg:col-span-5 bg-[#F8FAF8] border border-[#E2E8E4] rounded-2xl p-5 flex flex-col justify-between space-y-5 shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-[#E2E8E4] pb-3">
              <span className="text-xs uppercase font-bold text-[#166534] tracking-wider">
                Simulated Decarbonisation Impact
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EAF5EE] text-[#166534] border border-[#CDE5D5] font-bold font-mono">
                {results.annualSavingsPercent}% reduction
              </span>
            </div>

            {/* EUI Target Benchmark Gauge */}
            <div className="bg-white rounded-xl p-4 border border-[#E2E8E4] shadow-xs space-y-2 mb-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-[#61776B] font-medium">Projected EUI:</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-[#166534] font-mono">{results.projectedEui}</span>
                  <span className="text-xs text-[#61776B]">kWh/m²/yr</span>
                </div>
              </div>

              {/* Progress bar towards Net Zero benchmark (40.0 kWh/m²/yr) */}
              <div className="space-y-1">
                <div className="w-full h-2.5 bg-[#E2E8E4] rounded-full overflow-hidden flex">
                  <div
                    className={`h-full transition-all duration-500 ${
                      results.projectedEui <= 45 ? 'bg-[#166534]' : 'bg-[#D97706]'
                    }`}
                    style={{
                      width: `${Math.min(100, (40 / Math.max(1, results.projectedEui)) * 100)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#61776B]">
                  <span>Current: {metrics.currentEuiKwhM2 ?? '—'} ({metrics.euiLabel || 'annualised from 41 days'})</span>
                  <span className="text-[#166534] font-bold">Net Zero Target: 40.0</span>
                </div>
              </div>

              {results.projectedEui <= 45 ? (
                <div className="flex items-center gap-1.5 text-xs text-[#166534] font-semibold pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Eligible for EDGE Net Zero & GBCSA Net Zero Carbon!</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-[#9A6B15] font-semibold pt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Gap to Net Zero Carbon: {results.netZero2030GapPercent}%</span>
                </div>
              )}
            </div>

            {/* Metrics List */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between bg-white p-2.5 rounded-xl border border-[#E2E8E4] shadow-xs">
                <span className="text-[#61776B] font-medium">Annual Energy Abated:</span>
                <span className="font-mono font-bold text-[#1A2E22]">
                  {formatNumber(results.annualSavingsKwh)} kWh/yr
                </span>
              </div>

              <div className="flex justify-between bg-white p-2.5 rounded-xl border border-[#E2E8E4] shadow-xs">
                <span className="text-[#61776B] font-medium">Scope 2 CO₂ Abated:</span>
                <span className="font-mono font-bold text-[#166534]">
                  {results.co2ReductionTonnes} tCO₂e/yr (vs {results.baselineAnnualCo2Tonnes} baseline)
                </span>
              </div>

              <div className="flex justify-between bg-white p-2.5 rounded-xl border border-[#E2E8E4] shadow-xs">
                <span className="text-[#61776B] font-medium">Total Investment (CapEx):</span>
                <span className="font-mono font-bold text-[#1A2E22]">
                  {formatZar(results.totalCapexZar)}
                </span>
              </div>

              <div className="flex justify-between bg-white p-2.5 rounded-xl border border-[#E2E8E4] shadow-xs">
                <span className="text-[#61776B] font-medium">Annual Utility Cost Savings:</span>
                <span className="font-mono font-bold text-[#166534]">
                  {formatZar(results.annualCostSavingsZar)}/yr
                </span>
              </div>

              <div className="flex justify-between bg-white p-2.5 rounded-xl border border-[#E2E8E4] shadow-xs">
                <span className="text-[#61776B] font-medium">Simple Payback Period:</span>
                <span className="font-mono font-bold text-[#D97706]">
                  {results.simplePaybackYears} Years
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E2E8E4] text-[11px] text-[#61776B]">
            *Modeled on City of Cape Town MV Time-of-Use tariff structure and Eskom standard emission factor (0.92 kg CO₂e/kWh).
          </div>
        </div>
      </div>
    </div>
  );
};
