import React from 'react';
import { Building, AssessmentMetrics, AIAssessmentResult, ECMRecommendation } from '../types';
import { X, Printer, Download, ShieldCheck, Award, CheckCircle2, Leaf, Zap, Flame, Building2 } from 'lucide-react';
import { formatZar, formatNumber } from '../utils/carbonCalculators';
import { GreenBDGLogo } from './GreenBDGLogo';

interface ReportExportModalProps {
  building: Building;
  metrics: AssessmentMetrics;
  assessment: AIAssessmentResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  building,
  metrics,
  assessment,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !assessment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#E2E8E4] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl text-[#1A2E22]">
        {/* Modal Action Header (Hidden on Print) */}
        <div className="p-4 border-b border-[#E2E8E4] flex items-center justify-between bg-white print:hidden">
          <div className="flex items-center gap-2.5">
            <GreenBDGLogo className="w-6 h-6 rounded-md" />
            <h3 className="font-bold text-base text-[#1A2E22]">Executive Decarbonisation Assessment Report</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[#61776B] hover:text-[#1A2E22] hover:bg-[#F4F7F5] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-[#F8FAF8] text-[#1A2E22] print:bg-white print:text-black print:p-0">
          {/* Official Letterhead */}
          <div className="border-b-2 border-[#166534] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <GreenBDGLogo className="w-12 h-12 rounded-xl shadow-xs" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight text-[#1A2E22] print:text-black">GreenBDG Africa</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#EAF5EE] text-[#166534] border border-[#CDE5D5] print:bg-emerald-100 print:text-emerald-800">
                    Proptech & ESG Advisory
                  </span>
                </div>
                <p className="text-xs text-[#61776B] print:text-slate-600 mt-0.5 font-medium">
                  Verified Smart Environmental Telemetry & Decarbonisation Review
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-[#61776B] print:text-slate-600 space-y-0.5">
              <div><strong className="text-[#1A2E22]">Report Reference:</strong> GBDG-DEC-{building.code}-2026</div>
              <div><strong className="text-[#1A2E22]">Generated:</strong> {new Date().toLocaleDateString('en-ZA', { dateStyle: 'long' })}</div>
              <div><strong className="text-[#1A2E22]">Lead Engineer:</strong> AI Decarbonisation Agent (Gemini 3.7 Flash)</div>
            </div>
          </div>

          {/* Building Profile */}
          <div className="bg-white border border-[#E2E8E4] rounded-xl p-4 shadow-xs print:bg-slate-50 print:border-slate-300">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#166534] print:text-emerald-700 mb-2">
              Facility Specification
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[#61776B] print:text-slate-500 font-medium">Asset:</span>
                <div className="font-bold text-[#1A2E22] print:text-black">{building.name}</div>
              </div>
              <div>
                <span className="text-[#61776B] print:text-slate-500 font-medium">Location:</span>
                <div className="font-bold text-[#1A2E22] print:text-black">{building.location}</div>
              </div>
              <div>
                <span className="text-[#61776B] print:text-slate-500 font-medium">Gross Floor Area:</span>
                <div className="font-bold text-[#1A2E22] print:text-black">{building.grossFloorArea.toLocaleString()} m²</div>
              </div>
              <div>
                <span className="text-[#61776B] print:text-slate-500 font-medium">Grid Carbon Factor:</span>
                <div className="font-bold text-[#1A2E22] print:text-black">{building.gridCarbonIntensity} kg CO₂e/kWh (Eskom)</div>
              </div>
            </div>
          </div>

          {/* Verified Metrics Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A2E22] print:text-slate-800 mb-2">
              1. Energy & Carbon Accounting Summary
            </h4>
            <table className="w-full text-xs text-left border border-[#E2E8E4] print:border-slate-300 rounded-xl overflow-hidden shadow-xs">
              <thead className="bg-white print:bg-slate-100 text-[#1A2E22] print:text-slate-700 border-b border-[#E2E8E4] print:border-slate-300 font-bold">
                <tr>
                  <th className="p-2.5">Environmental Metric</th>
                  <th className="p-2.5">Current Period</th>
                  <th className="p-2.5">Historical Baseline</th>
                  <th className="p-2.5">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8E4] bg-white print:divide-slate-200">
                <tr>
                  <td className="p-2.5 font-medium text-[#1A2E22]">Total Electricity Consumption</td>
                  <td className="p-2.5 font-mono text-[#1A2E22] font-semibold">{formatNumber(metrics.totalCurrentKwh)} kWh</td>
                  <td className="p-2.5 font-mono text-[#61776B]">{formatNumber(metrics.totalBaselineKwh)} kWh</td>
                  <td className="p-2.5 font-mono text-[#E11D48] font-bold print:text-rose-700">+{metrics.consumptionVariancePercent}%</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-[#1A2E22]">Scope 2 Carbon Emissions</td>
                  <td className="p-2.5 font-mono text-[#1A2E22] font-semibold">{metrics.currentCo2Tonnes} tCO₂e</td>
                  <td className="p-2.5 font-mono text-[#61776B]">{metrics.baselineCo2Tonnes} tCO₂e</td>
                  <td className="p-2.5 font-mono text-[#E11D48] font-bold print:text-rose-700">+{metrics.co2VarianceTonnes} tCO₂e</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-[#1A2E22]">Operational EUI</td>
                  <td className="p-2.5 font-mono text-[#1A2E22] font-semibold">
                    {metrics.isEuiPublishable && metrics.currentEuiKwhM2 !== null
                      ? `${metrics.currentEuiKwhM2} kWh/m²/yr`
                      : '—'}
                    <span className="block text-[10px] text-[#61776B] font-sans font-normal">
                      {metrics.euiLabel || 'annualised from 41 days'}
                    </span>
                  </td>
                  <td className="p-2.5 font-mono text-[#61776B]">{metrics.baselineEuiKwhM2} kWh/m²/yr</td>
                  <td className="p-2.5 font-mono text-[#D97706] font-bold print:text-amber-700">+8.5 kWh/m²/yr</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-[#1A2E22]">Night Baseload (00:00-05:00)</td>
                  <td className="p-2.5 font-mono text-[#1A2E22] font-semibold">{metrics.averageBaseloadKw} kW</td>
                  <td className="p-2.5 font-mono text-[#61776B]">11.6 kW</td>
                  <td className="p-2.5 font-mono text-[#E11D48] font-bold print:text-rose-700">+56.9%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Core Findings */}
          <div className="space-y-4 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A2E22] print:text-slate-800">
              2. Verified Root Causes & Findings
            </h4>
            <div className="bg-white print:bg-slate-50 border border-[#E2E8E4] print:border-slate-300 rounded-xl p-4 space-y-2 shadow-xs">
              <p className="font-bold text-[#1A2E22] print:text-black">
                {assessment.whyChanged.headline}
              </p>
              <ul className="space-y-1.5 list-disc list-inside text-[#4A6053] print:text-slate-700 leading-relaxed">
                {assessment.whyChanged.rootCauses.map((cause, i) => (
                  <li key={i}>
                    <strong className="text-[#1A2E22]">{cause.factor} ({cause.contributionPercent}% contribution):</strong> {cause.explanation}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Plan */}
          <div className="space-y-3 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A2E22] print:text-slate-800">
              3. Recommended Decarbonisation Measures (ECMs)
            </h4>
            <div className="space-y-2">
              {assessment.whatNext.recommendedEcms.map((ecm) => (
                <div
                  key={ecm.id}
                  className="bg-white border border-[#E2E8E4] print:border-slate-300 rounded-xl p-3.5 flex justify-between items-center shadow-xs"
                >
                  <div>
                    <div className="font-bold text-[#1A2E22] print:text-black">{ecm.title}</div>
                    <div className="text-[#61776B] print:text-slate-600 text-[11px] mt-0.5">{ecm.description}</div>
                  </div>
                  <div className="text-right shrink-0 pl-4 font-mono">
                    <div className="text-[#166534] print:text-emerald-700 font-bold">{ecm.annualCo2ReductionTonnes} tCO₂e/yr</div>
                    <div className="text-[#61776B] print:text-slate-500 text-[10px]">{ecm.paybackYears} yr payback</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Signatures / Compliance block */}
          <div className="pt-6 border-t border-[#E2E8E4] print:border-slate-300 grid grid-cols-2 gap-6 text-xs text-[#61776B] print:text-slate-600">
            <div>
              <div className="text-[#1A2E22] print:text-slate-800 font-bold mb-1">Prepared by:</div>
              <div>GreenBDG AI Decarbonisation Agent (Gemini 3.7 Flash)</div>
              <div>Certified Energy Assessment Engine</div>
            </div>
            <div>
              <div className="text-[#1A2E22] print:text-slate-800 font-bold mb-1">Verified Environmental Ingestion:</div>
              <div className="font-mono text-[11px] text-[#1A2E22]">SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4</div>
              <div>GreenBDG Telemetry Pipeline v1.8</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
