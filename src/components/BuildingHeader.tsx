import React from 'react';
import { Building, AssessmentMetrics } from '../types';
import { MapPin, Sun, Zap, CheckCircle2, Award, Calendar, Layers } from 'lucide-react';

interface BuildingHeaderProps {
  building: Building;
  metrics: AssessmentMetrics;
  activeTab: 'assessment' | 'intervals' | 'submeters' | 'anomalies' | 'ecms' | 'scenario';
  onTabChange: (tab: 'assessment' | 'intervals' | 'submeters' | 'anomalies' | 'ecms' | 'scenario') => void;
  anomalyCount: number;
}

export const BuildingHeader: React.FC<BuildingHeaderProps> = ({
  building,
  metrics,
  activeTab,
  onTabChange,
  anomalyCount,
}) => {
  return (
    <div className="bg-white border-b border-[#E2E8E4] pt-6 pb-2 text-[#1A2E22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Info row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-[#EAF5EE] text-[#166534] border border-[#CDE5D5]">
                {building.code}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-lg bg-[#F4F7F5] text-[#4A6053] border border-[#E2E8E4] font-medium">
                {building.buildingType}
              </span>
              <span className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-lg bg-[#FEF9EE] text-[#9A6B15] border border-[#FCE7BA] font-semibold">
                <Award className="w-3.5 h-3.5 text-[#B45309]" />
                {building.certificationTarget}
              </span>
              <span className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-lg bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                Verified Smart Telemetry
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A2E22] flex items-center gap-2">
              {building.name}
            </h1>

            <div className="flex flex-wrap items-center gap-y-1.5 gap-x-5 mt-2.5 text-xs sm:text-sm text-[#4A6053]">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#61776B]" />
                {building.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#61776B]" />
                {building.grossFloorArea.toLocaleString()} m² GFA
              </span>
              <span className="flex items-center gap-1.5 font-medium text-[#B45309]">
                <Sun className="w-4 h-4 text-[#F59E0B]" />
                {building.solarCapacityKwp} kWp Rooftop Solar
              </span>
              <span className="flex items-center gap-1.5 font-medium text-[#166534]">
                <Zap className="w-4 h-4 text-[#16A34A]" />
                {building.gridCarbonIntensity} kg CO₂e/kWh (Eskom)
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#61776B]" />
                {building.reportingPeriod.current}
              </span>
            </div>
          </div>

          {/* Quick Target Box */}
          <div className="flex items-center gap-3 bg-[#F8FAF8] border border-[#E2E8E4] rounded-2xl p-3.5 sm:px-4.5 shadow-sm">
            <div className="text-right">
              <div className="text-xs text-[#61776B] font-medium">
                {metrics.isEuiPublishable ? metrics.euiLabel : 'Data Status'}
              </div>
              <div className="flex items-baseline justify-end gap-1.5 mt-0.5">
                <span className="text-xl font-bold text-[#B45309] font-mono">
                  {metrics.isEuiPublishable && metrics.currentEuiKwhM2 !== null ? metrics.currentEuiKwhM2 : '—'}
                </span>
                <span className="text-xs text-[#61776B]">/ 40.0 kWh/m²/yr</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#FEF9EE] border border-[#FCE7BA] flex items-center justify-center text-[#9A6B15] font-bold text-xs">
              {metrics.isEuiPublishable ? '72.7' : 'N/A'}
            </div>
          </div>
        </div>

        {/* View Navigation Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 mt-6 overflow-x-auto no-scrollbar border-t border-[#E2E8E4] pt-3">
          <button
            type="button"
            onClick={() => onTabChange('assessment')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'assessment'
                ? 'bg-[#166534] text-white shadow-sm'
                : 'text-[#4A6053] hover:text-[#1A2E22] hover:bg-[#F4F7F5]'
            }`}
          >
            <span>AI Assessment (3-Pillars)</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('intervals')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'intervals'
                ? 'bg-[#166534] text-white shadow-sm'
                : 'text-[#4A6053] hover:text-[#1A2E22] hover:bg-[#F4F7F5]'
            }`}
          >
            <span>Interval Telemetry & Solar</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('submeters')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'submeters'
                ? 'bg-[#166534] text-white shadow-sm'
                : 'text-[#4A6053] hover:text-[#1A2E22] hover:bg-[#F4F7F5]'
            }`}
          >
            <span>Sub-Meter End Use</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('anomalies')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'anomalies'
                ? 'bg-[#166534] text-white shadow-sm'
                : 'text-[#4A6053] hover:text-[#1A2E22] hover:bg-[#F4F7F5]'
            }`}
          >
            <span>Verified Anomalies</span>
            {anomalyCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#FDF2F2] text-[#B91C1C] border border-[#FCD5D5] text-[10px] flex items-center justify-center font-bold">
                {anomalyCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange('ecms')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'ecms'
                ? 'bg-[#166534] text-white shadow-sm'
                : 'text-[#4A6053] hover:text-[#1A2E22] hover:bg-[#F4F7F5]'
            }`}
          >
            <span>Decarbonisation ECMs</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('scenario')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'scenario'
                ? 'bg-[#166534] text-white shadow-sm'
                : 'text-[#4A6053] hover:text-[#1A2E22] hover:bg-[#F4F7F5]'
            }`}
          >
            <span>Net-Zero Scenario Modeler</span>
          </button>
        </div>
      </div>
    </div>
  );
};
