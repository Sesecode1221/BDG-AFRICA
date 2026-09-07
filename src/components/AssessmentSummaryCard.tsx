import React, { useState } from 'react';
import { AIAssessmentResult, ECMRecommendation } from '../types';
import { Sparkles, HelpCircle, AlertTriangle, CheckCircle2, TrendingUp, Cpu, ThermometerSun, ShieldAlert, ArrowRight, Clock, Target, DollarSign, Leaf } from 'lucide-react';
import { formatZar, formatNumber } from '../utils/carbonCalculators';

interface AssessmentSummaryCardProps {
  assessment: AIAssessmentResult | null;
  isLoading: boolean;
  onSelectEcm: (ecm: ECMRecommendation) => void;
  onOpenChatWithPrompt: (prompt: string) => void;
}

export const AssessmentSummaryCard: React.FC<AssessmentSummaryCardProps> = ({
  assessment,
  isLoading,
  onSelectEcm,
  onOpenChatWithPrompt,
}) => {
  const [activeSection, setActiveSection] = useState<'all' | 'what' | 'why' | 'next'>('all');

  if (isLoading) {
    return (
      <div className="bg-white border border-[#E2E8E4] rounded-2xl p-8 text-center text-[#1A2E22] shadow-sm">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#EAF5EE] border border-[#CDE5D5] text-[#166534] mb-4 animate-pulse">
          <Sparkles className="w-8 h-8 animate-spin" />
        </div>
        <h3 className="text-xl font-bold text-[#1A2E22] mb-2">Analyzing Verified Telemetry with Gemini 3.7 Flash</h3>
        <p className="text-sm text-[#61776B] max-w-md mx-auto">
          Correlating 1,440 smart interval meter points, weather degree days, sub-meter circuits, and Eskom grid carbon factors for Bertha House...
        </p>
      </div>
    );
  }

  if (!assessment) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Executive Header Card */}
      <div className="bg-white border border-[#E2E8E4] rounded-2xl p-6 text-[#1A2E22] shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E2E8E4] pb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-[#EAF5EE] text-[#166534] border border-[#CDE5D5]">
                <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
                Gemini 3.7 Flash Assessment
              </span>
              <span className="text-xs text-[#61776B]">
                Model Confidence: <strong className="text-[#166534] font-bold">{assessment.confidenceScore}%</strong>
              </span>
              <span className="text-xs text-[#A3B8AC]">•</span>
              <span className="text-xs text-[#61776B]">
                Deterministic Environmental Grounding
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A2E22] tracking-tight">
              Decarbonisation & Performance Review
            </h2>
          </div>

          {/* Section Filter Pills */}
          <div className="flex items-center gap-1 bg-[#F4F7F5] p-1 rounded-xl border border-[#E2E8E4]">
            <button
              type="button"
              onClick={() => setActiveSection('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeSection === 'all' ? 'bg-[#166534] text-white shadow-sm' : 'text-[#4A6053] hover:text-[#1A2E22]'
              }`}
            >
              Full Review
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('what')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeSection === 'what' ? 'bg-[#166534] text-white shadow-sm' : 'text-[#4A6053] hover:text-[#1A2E22]'
              }`}
            >
              1. What Changed
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('why')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeSection === 'why' ? 'bg-[#166534] text-white shadow-sm' : 'text-[#4A6053] hover:text-[#1A2E22]'
              }`}
            >
              2. Why It Changed
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('next')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeSection === 'next' ? 'bg-[#166534] text-white shadow-sm' : 'text-[#4A6053] hover:text-[#1A2E22]'
              }`}
            >
              3. Next Actions
            </button>
          </div>
        </div>

        {/* Executive Summary Paragraph */}
        <div className="mt-4 bg-[#F8FAF8] border border-[#E2E8E4] rounded-xl p-4 text-sm text-[#1A2E22] leading-relaxed">
          <p className="font-normal">
            <strong className="text-[#166534] font-bold">Executive Finding: </strong>
            {assessment.executiveSummary}
          </p>
        </div>
      </div>

      {/* PILLAR 1: WHAT CHANGED? */}
      {(activeSection === 'all' || activeSection === 'what') && (
        <div className="bg-white border border-[#E2E8E4] rounded-2xl p-6 text-[#1A2E22] shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-[#E2E8E4] pb-4">
            <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB] font-bold text-base">
              1
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#2563EB]">Pillar One</span>
              <h3 className="text-lg sm:text-xl font-bold text-[#1A2E22]">
                What Changed in the Building's Energy Performance?
              </h3>
            </div>
          </div>

          <div className="bg-[#EFF6FF]/60 border border-[#BFDBFE] rounded-xl p-4">
            <h4 className="text-sm font-bold text-[#1E3A8A] mb-2">
              {assessment.whatChanged.headline}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#1E293B]">
              {assessment.whatChanged.keyObservations.map((obs, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#2563EB] font-bold mt-0.5">•</span>
                  <span>{obs}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Variance Matrix Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#61776B] mb-3">
              Deterministic Variance Analysis vs Historical Baseline
            </h4>
            <div className="overflow-x-auto rounded-xl border border-[#E2E8E4]">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#F8FAF8] text-[#4A6053] font-bold border-b border-[#E2E8E4]">
                  <tr>
                    <th className="p-3">Performance Metric</th>
                    <th className="p-3">Current Period</th>
                    <th className="p-3">Baseline</th>
                    <th className="p-3">Variance (Delta)</th>
                    <th className="p-3 hidden md:table-cell">Engineering Context</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8E4] text-[#1A2E22]">
                  {assessment.whatChanged.varianceAnalysis.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#F8FAF8] transition-colors">
                      <td className="p-3 font-semibold text-[#1A2E22]">{item.metric}</td>
                      <td className="p-3 font-mono font-medium">{item.currentValue}</td>
                      <td className="p-3 font-mono text-[#61776B]">{item.baselineValue}</td>
                      <td className="p-3 font-mono font-semibold">
                        <span
                          className={`px-2.5 py-0.5 rounded-md font-bold text-xs ${
                            item.severity === 'alert'
                              ? 'bg-[#FDF2F2] text-[#B91C1C] border border-[#FCD5D5]'
                              : item.severity === 'warning'
                              ? 'bg-[#FEF9EE] text-[#9A6B15] border border-[#FCE7BA]'
                              : 'bg-[#EAF5EE] text-[#166534] border border-[#CDE5D5]'
                          }`}
                        >
                          {item.delta}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-[#61776B] hidden md:table-cell">{item.context}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#F8FAF8] border border-[#E2E8E4] rounded-xl p-3.5 text-xs text-[#4A6053]">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#D97706] shrink-0" />
              <span>{assessment.whatChanged.anomaliesSummary}</span>
            </div>
            <button
              type="button"
              onClick={() => onOpenChatWithPrompt("Explain the variance in Bertha House's night baseload and peak demand in detail.")}
              className="text-[#166534] hover:text-[#14532D] font-bold whitespace-nowrap flex items-center gap-1 cursor-pointer"
            >
              Ask Agent about variances <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* PILLAR 2: WHY MIGHT IT HAVE CHANGED? */}
      {(activeSection === 'all' || activeSection === 'why') && (
        <div className="bg-white border border-[#E2E8E4] rounded-2xl p-6 text-[#1A2E22] shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-[#E2E8E4] pb-4">
            <div className="w-9 h-9 rounded-xl bg-[#FAF5FF] border border-[#DDD6FE] flex items-center justify-center text-[#7C3AED] font-bold text-base">
              2
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#7C3AED]">Pillar Two</span>
              <h3 className="text-lg sm:text-xl font-bold text-[#1A2E22]">
                Why Might It Have Changed? (Root Cause Hypotheses)
              </h3>
            </div>
          </div>

          <p className="text-sm text-[#4A6053] font-medium">
            {assessment.whyChanged.headline}
          </p>

          {/* Root Cause Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assessment.whyChanged.rootCauses.map((cause, idx) => (
              <div
                key={idx}
                className="bg-[#F8FAF8] border border-[#E2E8E4] rounded-xl p-4 flex flex-col justify-between hover:border-[#CBD8D0] shadow-sm transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-[#FAF5FF] text-[#6D28D9] border border-[#DDD6FE]">
                      Likelihood: {cause.likelihood}
                    </span>
                    <span className="text-xs font-bold text-[#9A6B15] font-mono">
                      {cause.contributionPercent}% variance share
                    </span>
                  </div>

                  <h5 className="font-bold text-sm text-[#1A2E22] mb-2">{cause.factor}</h5>
                  <p className="text-xs text-[#4A6053] leading-relaxed mb-3">{cause.explanation}</p>
                </div>

                <div className="mt-2 pt-3 border-t border-[#E2E8E4] text-[11px] text-[#61776B]">
                  <strong className="text-[#1A2E22]">Verified Evidence: </strong>
                  {cause.verifiedEvidence}
                </div>
              </div>
            ))}
          </div>

          {/* Weather vs Operations Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-[#F8FAF8] border border-[#E2E8E4] rounded-xl p-4 text-xs sm:text-sm shadow-sm">
              <div className="flex items-center gap-2 text-[#9A6B15] font-bold mb-1.5">
                <ThermometerSun className="w-4 h-4 text-[#D97706]" />
                <span>Weather & Thermal Load Regression</span>
              </div>
              <p className="text-[#4A6053] leading-relaxed">
                {assessment.whyChanged.weatherImpactAnalysis}
              </p>
            </div>

            <div className="bg-[#F8FAF8] border border-[#E2E8E4] rounded-xl p-4 text-xs sm:text-sm shadow-sm">
              <div className="flex items-center gap-2 text-[#1D4ED8] font-bold mb-1.5">
                <Clock className="w-4 h-4 text-[#2563EB]" />
                <span>Operational Schedule & Overrides</span>
              </div>
              <p className="text-[#4A6053] leading-relaxed">
                {assessment.whyChanged.operationalScheduleFindings}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PILLAR 3: WHAT SHOULD WE INVESTIGATE NEXT? */}
      {(activeSection === 'all' || activeSection === 'next') && (
        <div className="bg-white border border-[#E2E8E4] rounded-2xl p-6 text-[#1A2E22] shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-[#E2E8E4] pb-4">
            <div className="w-9 h-9 rounded-xl bg-[#EAF5EE] border border-[#CDE5D5] flex items-center justify-center text-[#166534] font-bold text-base">
              3
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#166534]">Pillar Three</span>
              <h3 className="text-lg sm:text-xl font-bold text-[#1A2E22]">
                What Should We Investigate Next & Recommended Actions?
              </h3>
            </div>
          </div>

          {/* Immediate 24h-48h Facility Investigations */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#61776B] mb-3 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#166534]" />
              <span>Immediate Facility Engineering Next Steps</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {assessment.whatNext.immediateInvestigations.map((inv, idx) => (
                <div
                  key={idx}
                  className="bg-[#F8FAF8] border border-[#E2E8E4] rounded-xl p-3.5 text-xs text-[#4A6053] space-y-1.5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                        inv.priority.includes('Immediate')
                          ? 'bg-[#FDF2F2] text-[#B91C1C] border border-[#FCD5D5]'
                          : 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]'
                      }`}
                    >
                      {inv.priority}
                    </span>
                    <span className="text-[#61776B] text-[11px] font-medium">{inv.responsibleTeam}</span>
                  </div>
                  <div className="font-bold text-[#1A2E22] text-sm">{inv.action}</div>
                  <div className="text-[#61776B]">
                    <strong className="text-[#166534]">Expected Outcome:</strong> {inv.expectedOutcome}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decarbonisation Energy Conservation Measures (ECMs) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#61776B] flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-[#166534]" />
                <span>Modeled Decarbonisation Measures (ECMs) with Scope 2 Abatement</span>
              </h4>
              <span className="text-xs text-[#61776B] font-medium hidden sm:inline">
                Click any ECM to model in Scenario Simulator
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assessment.whatNext.recommendedEcms.map((ecm) => (
                <div
                  key={ecm.id}
                  onClick={() => onSelectEcm(ecm)}
                  className="group bg-[#F8FAF8] hover:bg-[#F0F5F2] border border-[#E2E8E4] hover:border-[#166534]/50 rounded-xl p-4.5 transition-all cursor-pointer flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          ecm.tier === 1
                            ? 'bg-[#EAF5EE] text-[#166534] border border-[#CDE5D5]'
                            : ecm.tier === 2
                            ? 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]'
                            : 'bg-[#FAF5FF] text-[#6D28D9] border border-[#DDD6FE]'
                        }`}
                      >
                        Tier {ecm.tier}: {ecm.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#166534]">
                        {ecm.paybackYears} yr payback
                      </span>
                    </div>

                    <h5 className="font-bold text-sm text-[#1A2E22] group-hover:text-[#166534] transition-colors mb-1.5">
                      {ecm.title}
                    </h5>
                    <p className="text-xs text-[#4A6053] leading-relaxed mb-3">
                      {ecm.description}
                    </p>
                  </div>

                  {/* Financial & Carbon Metrics Grid */}
                  <div className="pt-3 border-t border-[#E2E8E4] grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-white border border-[#E2E8E4] p-2 rounded-lg">
                      <div className="text-[10px] text-[#61776B] font-medium">CapEx</div>
                      <div className="font-bold text-[#1A2E22] font-mono">{formatZar(ecm.estimatedCapexZar)}</div>
                    </div>
                    <div className="bg-white border border-[#E2E8E4] p-2 rounded-lg">
                      <div className="text-[10px] text-[#61776B] font-medium">Annual Savings</div>
                      <div className="font-bold text-[#166534] font-mono">{formatZar(ecm.annualCostSavingsZar)}/yr</div>
                    </div>
                    <div className="bg-white border border-[#E2E8E4] p-2 rounded-lg">
                      <div className="text-[10px] text-[#61776B] font-medium">CO₂ Abatement</div>
                      <div className="font-bold text-[#166534] font-mono">{ecm.annualCo2ReductionTonnes} tCO₂e/yr</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2030 Net-Zero Roadmap Callout */}
          <div className="bg-[#EAF5EE] border border-[#CDE5D5] rounded-xl p-4 text-xs sm:text-sm text-[#1A2E22]">
            <div className="flex items-center gap-2 text-[#166534] font-bold mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>2030 Net-Zero Carbon Trajectory Alignment</span>
            </div>
            <p className="leading-relaxed text-[#4A6053]">
              {assessment.whatNext.netZeroRoadmapImpact}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
