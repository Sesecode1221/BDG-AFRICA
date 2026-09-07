import React from 'react';
import { AnomalyItem } from '../types';
import { ShieldAlert, AlertTriangle, Clock, Wrench, DollarSign, Zap, MessageSquare } from 'lucide-react';
import { formatZar, formatNumber } from '../utils/carbonCalculators';

interface AnomaliesListProps {
  anomalies: AnomalyItem[];
  onAskAgentAboutAnomaly: (anomaly: AnomalyItem) => void;
}

export const AnomaliesList: React.FC<AnomaliesListProps> = ({
  anomalies,
  onAskAgentAboutAnomaly,
}) => {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-[#FDF2F2] text-[#B91C1C] border-[#FCD5D5]';
      case 'high':
        return 'bg-[#FFF7ED] text-[#C2410C] border-[#FFEDD5]';
      case 'medium':
        return 'bg-[#FEF9EE] text-[#9A6B15] border-[#FCE7BA]';
      default:
        return 'bg-[#EFF6FF] text-[#1D4ED8] border-[#DBEAFE]';
    }
  };

  return (
    <div className="bg-white border border-[#E2E8E4] rounded-2xl p-5 sm:p-6 text-[#1A2E22] shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8E4] pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#1A2E22] flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#DC2626]" />
            <span>Verified Operational & Telemetry Anomalies</span>
          </h3>
          <p className="text-xs text-[#61776B] mt-1">
            Automated outlier detection flagging abnormal baseline deviations and high-tariff waste
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FDF2F2] text-[#B91C1C] border border-[#FCD5D5] self-start sm:self-auto">
          {anomalies.length} Active Events Flagged
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {anomalies.map((anom) => (
          <div
            key={anom.id}
            className="bg-[#F8FAF8] border border-[#E2E8E4] rounded-xl p-4 flex flex-col justify-between hover:border-[#CBD8D0] shadow-sm transition-all space-y-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded border ${getSeverityBadge(anom.severity)}`}>
                  {anom.severity} Severity
                </span>
                <span className="text-xs text-[#61776B] flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-[#A3B8AC]" />
                  {anom.timestamp}
                </span>
              </div>

              <h4 className="font-bold text-sm text-[#1A2E22] mb-1">{anom.title}</h4>
              <div className="text-xs text-[#166534] font-semibold mb-2">{anom.equipment}</div>
              <p className="text-xs text-[#4A6053] leading-relaxed">{anom.description}</p>
            </div>

            {/* Waste Metrics & Cause */}
            <div className="bg-white rounded-xl p-3 text-xs space-y-2 border border-[#E2E8E4] shadow-xs">
              <div className="flex items-center justify-between text-[#4A6053]">
                <span className="flex items-center gap-1 text-[#61776B]">
                  <Zap className="w-3.5 h-3.5 text-[#D97706]" />
                  Estimated Waste:
                </span>
                <span className="font-mono font-bold text-[#1A2E22]">
                  {formatNumber(anom.estimatedWasteKwh)} kWh/mo (~{formatZar(anom.estimatedCostZar)}/mo)
                </span>
              </div>

              <div className="text-[11px] text-[#61776B] pt-1.5 border-t border-[#E2E8E4]">
                <strong className="text-[#1A2E22]">Potential Cause: </strong>
                {anom.potentialCause}
              </div>

              <div className="text-[11px] text-[#166534] pt-1">
                <strong className="text-[#14532D]">Action: </strong>
                {anom.recommendedAction}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onAskAgentAboutAnomaly(anom)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white hover:bg-[#F4F7F5] border border-[#E2E8E4] text-xs font-semibold text-[#1A2E22] transition-colors cursor-pointer shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#166534]" />
              <span>Consult Agent on this Anomaly</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
