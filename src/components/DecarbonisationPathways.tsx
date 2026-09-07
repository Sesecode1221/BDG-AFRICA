import React from 'react';
import { ECMRecommendation } from '../types';
import { Leaf, DollarSign, Clock, TrendingUp, CheckCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { formatZar, formatNumber } from '../utils/carbonCalculators';

interface DecarbonisationPathwaysProps {
  ecms: ECMRecommendation[];
  onSelectEcmForSimulation: (ecm: ECMRecommendation) => void;
  onUpdateEcmStatus?: (ecmId: string, status: 'recommended' | 'in-review' | 'approved' | 'implemented') => void;
}

export const DecarbonisationPathways: React.FC<DecarbonisationPathwaysProps> = ({
  ecms,
  onSelectEcmForSimulation,
  onUpdateEcmStatus,
}) => {
  // Aggregate stats
  const totalCapex = ecms.reduce((acc, curr) => acc + curr.estimatedCapexZar, 0);
  const totalAnnualSavings = ecms.reduce((acc, curr) => acc + curr.annualCostSavingsZar, 0);
  const totalCo2Reduction = ecms.reduce((acc, curr) => acc + curr.annualCo2ReductionTonnes, 0);

  return (
    <div className="bg-white border border-[#E2E8E4] rounded-2xl p-5 sm:p-6 text-[#1A2E22] shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8E4] pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#1A2E22] flex items-center gap-2">
            <Leaf className="w-5 h-5 text-[#166534]" />
            <span>Decarbonisation Pathways & Energy Conservation Measures (ECMs)</span>
          </h3>
          <p className="text-xs text-[#61776B] mt-1">
            Prioritized capital and operational engineering interventions ranked by payback and carbon abatement
          </p>
        </div>

        {/* Aggregate KPI Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="bg-[#F8FAF8] border border-[#E2E8E4] px-3 py-1.5 rounded-xl shadow-xs">
            <span className="text-[#61776B] font-medium">Total Abatement: </span>
            <strong className="text-[#166534] font-mono font-bold">{totalCo2Reduction.toFixed(1)} tCO₂e/yr</strong>
          </div>
          <div className="bg-[#F8FAF8] border border-[#E2E8E4] px-3 py-1.5 rounded-xl shadow-xs">
            <span className="text-[#61776B] font-medium">Total Annual Savings: </span>
            <strong className="text-[#166534] font-mono font-bold">{formatZar(totalAnnualSavings)}/yr</strong>
          </div>
        </div>
      </div>

      {/* ECM Cards */}
      <div className="space-y-4">
        {ecms.map((ecm) => (
          <div
            key={ecm.id}
            className="bg-[#F8FAF8] border border-[#E2E8E4] rounded-xl p-5 hover:border-[#CBD8D0] shadow-sm transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded border ${
                    ecm.tier === 1
                      ? 'bg-[#EAF5EE] text-[#166534] border-[#CDE5D5]'
                      : ecm.tier === 2
                      ? 'bg-[#EFF6FF] text-[#1D4ED8] border-[#DBEAFE]'
                      : 'bg-[#F5F3FF] text-[#6D28D9] border-[#DDD6FE]'
                  }`}
                >
                  Tier {ecm.tier}: {ecm.category}
                </span>
                <span className="text-xs text-[#61776B] font-medium">
                  Target: <strong className="text-[#1A2E22]">{ecm.targetEquipment}</strong>
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-white text-[#4A6053] border border-[#E2E8E4] uppercase text-[10px] font-semibold">
                  Status: {ecm.status}
                </span>
              </div>

              <h4 className="font-bold text-base text-[#1A2E22]">{ecm.title}</h4>
              <p className="text-xs sm:text-sm text-[#4A6053] leading-relaxed">{ecm.description}</p>
            </div>

            {/* Metrics & Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-3 shrink-0">
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-[#E2E8E4] shadow-xs">
                  <div className="text-[10px] text-[#61776B] font-medium">CapEx</div>
                  <div className="font-bold text-[#1A2E22] font-mono mt-0.5">{formatZar(ecm.estimatedCapexZar)}</div>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-[#E2E8E4] shadow-xs">
                  <div className="text-[10px] text-[#61776B] font-medium">Annual Savings</div>
                  <div className="font-bold text-[#166534] font-mono mt-0.5">{formatZar(ecm.annualCostSavingsZar)}</div>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-[#E2E8E4] shadow-xs">
                  <div className="text-[10px] text-[#61776B] font-medium">CO₂ Abatement</div>
                  <div className="font-bold text-[#166534] font-mono mt-0.5">{ecm.annualCo2ReductionTonnes} t/yr</div>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-[#E2E8E4] shadow-xs">
                  <div className="text-[10px] text-[#61776B] font-medium">Payback</div>
                  <div className="font-bold text-[#D97706] font-mono mt-0.5">{ecm.paybackYears} yrs</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectEcmForSimulation(ecm)}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <span>Model in Scenario Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
