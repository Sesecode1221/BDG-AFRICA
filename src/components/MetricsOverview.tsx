import React from 'react';
import { AssessmentMetrics } from '../types';
import { Zap, Flame, Gauge, Sun, Activity, Moon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatNumber } from '../utils/carbonCalculators';

interface MetricsOverviewProps {
  metrics: AssessmentMetrics;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {/* 1. Total Consumption */}
      <div className="bg-white border border-[#E2E8E4] rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-[#CBD8D0] shadow-sm transition-all">
        <div className="flex items-center justify-between text-[#61776B] mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider">Total Grid Energy</span>
          <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold text-[#1A2E22] tracking-tight font-mono">
            {formatNumber(metrics.totalCurrentKwh)} <span className="text-xs font-medium text-[#61776B]">kWh</span>
          </div>
          <div className="flex items-center gap-1 mt-1.5 text-xs text-[#B91C1C]">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span className="font-bold">+{metrics.consumptionVariancePercent}%</span>
            <span className="text-[#61776B] font-normal">vs baseline</span>
          </div>
        </div>
      </div>

      {/* 2. Scope 2 Carbon */}
      <div className="bg-white border border-[#E2E8E4] rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-[#CBD8D0] shadow-sm transition-all">
        <div className="flex items-center justify-between text-[#61776B] mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider">Scope 2 Carbon</span>
          <div className="w-8 h-8 rounded-xl bg-[#FDF2F2] text-[#DC2626] flex items-center justify-center">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold text-[#1A2E22] tracking-tight font-mono">
            {metrics.currentCo2Tonnes} <span className="text-xs font-medium text-[#61776B]">tCO₂e</span>
          </div>
          <div className="flex items-center gap-1 mt-1.5 text-xs text-[#B91C1C]">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span className="font-bold">+{metrics.co2VarianceTonnes} tCO₂e</span>
            <span className="text-[#61776B] font-normal">delta</span>
          </div>
        </div>
      </div>

      {/* 3. Energy Use Intensity (EUI) */}
      <div className="bg-white border border-[#E2E8E4] rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-[#CBD8D0] shadow-sm transition-all group relative">
        <div className="flex items-center justify-between text-[#61776B] mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider">Operational EUI</span>
          <div className="w-8 h-8 rounded-xl bg-[#FEF9EE] text-[#D97706] flex items-center justify-center">
            <Gauge className="w-4 h-4" />
          </div>
        </div>
        <div>
          {metrics.isEuiPublishable && metrics.currentEuiKwhM2 !== null ? (
            <>
              <div className="text-xl sm:text-2xl font-bold text-[#1A2E22] tracking-tight font-mono">
                {metrics.currentEuiKwhM2} <span className="text-xs font-medium text-[#61776B]">kWh/m²/yr</span>
              </div>
              <div className="flex items-center gap-1 mt-1.5 text-xs text-[#9A6B15]">
                <span className="font-semibold">{metrics.euiLabel || 'annualised from 41 days'}</span>
              </div>
            </>
          ) : (
            <>
              <div className="text-xl sm:text-2xl font-bold text-[#61776B] tracking-tight font-mono">
                — <span className="text-xs font-medium text-[#61776B]">kWh/m²/yr</span>
              </div>
              <div className="flex items-center gap-1 mt-1.5 text-xs text-[#DC2626]">
                <span className="font-semibold">Insufficient data (&lt;30 days)</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 4. Solar Generation */}
      <div className="bg-white border border-[#E2E8E4] rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-[#CBD8D0] shadow-sm transition-all">
        <div className="flex items-center justify-between text-[#61776B] mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider">Rooftop Solar</span>
          <div className="w-8 h-8 rounded-xl bg-[#EAF5EE] text-[#166534] flex items-center justify-center">
            <Sun className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold text-[#1A2E22] tracking-tight font-mono">
            {formatNumber(metrics.solarGenerationKwh)} <span className="text-xs font-medium text-[#61776B]">kWh</span>
          </div>
          <div className="flex items-center gap-1 mt-1.5 text-xs text-[#166534]">
            <span className="font-bold">{metrics.solarSelfConsumptionPercent}%</span>
            <span className="text-[#61776B] font-normal">self-consumed</span>
          </div>
        </div>
      </div>

      {/* 5. Peak Demand */}
      <div className="bg-white border border-[#E2E8E4] rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-[#CBD8D0] shadow-sm transition-all">
        <div className="flex items-center justify-between text-[#61776B] mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider">Peak Demand</span>
          <div className="w-8 h-8 rounded-xl bg-[#FAF5FF] text-[#9333EA] flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold text-[#1A2E22] tracking-tight font-mono">
            {metrics.peakDemandKva} <span className="text-xs font-medium text-[#61776B]">kVA</span>
          </div>
          <div className="flex items-center gap-1 mt-1.5 text-xs text-[#B91C1C]">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span className="font-bold">+13.7 kVA</span>
            <span className="text-[#61776B] font-normal">ratchet risk</span>
          </div>
        </div>
      </div>

      {/* 6. Night Baseload */}
      <div className="bg-white border border-[#E2E8E4] rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-[#CBD8D0] shadow-sm transition-all">
        <div className="flex items-center justify-between text-[#61776B] mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider">Night Baseload</span>
          <div className="w-8 h-8 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center">
            <Moon className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold text-[#1A2E22] tracking-tight font-mono">
            {metrics.averageBaseloadKw} <span className="text-xs font-medium text-[#61776B]">kW</span>
          </div>
          <div className="flex items-center gap-1 mt-1.5 text-xs text-[#B91C1C]">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span className="font-bold">+57% creep</span>
            <span className="text-[#61776B] font-normal">(18.2 kW)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
