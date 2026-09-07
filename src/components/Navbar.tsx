import React from 'react';
import { Building } from '../types';
import { Building2, ShieldCheck, Download, UploadCloud, Sparkles, RefreshCw } from 'lucide-react';
import { GreenBDGLogo } from './GreenBDGLogo';

interface NavbarProps {
  buildings: Building[];
  selectedBuilding: Building;
  onSelectBuilding: (building: Building) => void;
  onOpenReportModal: () => void;
  onOpenIngestModal: () => void;
  onRefreshAssessment: () => void;
  isAssessing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  buildings,
  selectedBuilding,
  onSelectBuilding,
  onOpenReportModal,
  onOpenIngestModal,
  onRefreshAssessment,
  isAssessing,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#E2E8E4] text-[#1A2E22] shadow-[0_2px_10px_rgba(26,46,34,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Logo */}
          <div className="flex items-center gap-3">
            <GreenBDGLogo className="w-10 h-10 shadow-sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-[#1A2E22]">GreenBDG</span>
                <span className="text-[11px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#EAF5EE] text-[#166534] border border-[#CDE5D5]">
                  Africa Decarbonisation
                </span>
              </div>
              <p className="text-xs text-[#61776B] hidden sm:block">
                AI Energy & Decarbonisation Assessment Agent
              </p>
            </div>
          </div>

          {/* Building Switcher & RLS Context */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex items-center gap-2 bg-[#F8FAF8] border border-[#E2E8E4] rounded-xl px-3 py-1.5 text-sm text-[#1A2E22] hover:border-[#CBD8D0] transition-colors">
                <Building2 className="w-4 h-4 text-[#166534] shrink-0" />
                <select
                  aria-label="Select Target Building for Decarbonisation Assessment"
                  value={selectedBuilding.id}
                  onChange={(e) => {
                    const found = buildings.find((b) => b.id === e.target.value);
                    if (found) onSelectBuilding(found);
                  }}
                  className="bg-transparent text-[#1A2E22] text-xs sm:text-sm font-semibold focus:outline-none cursor-pointer pr-2"
                >
                  {buildings.map((b) => (
                    <option key={b.id} value={b.id} className="bg-white text-[#1A2E22]">
                      {b.name} ({b.grossFloorArea} m²)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* RLS Badge */}
            <div className="hidden lg:flex items-center gap-1.5 bg-[#F4F7F5] border border-[#E2E8E4] rounded-xl px-2.5 py-1.5 text-xs text-[#4A6053]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#166534]" />
              <span>Org RLS: <strong className="text-[#1A2E22] font-semibold">Bertha House</strong></span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onRefreshAssessment}
                disabled={isAssessing}
                title="Re-run AI Assessment against latest telemetry"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {isAssessing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 text-[#86EFAC]" />
                )}
                <span className="hidden sm:inline">{isAssessing ? 'Assessing...' : 'Run Assessment'}</span>
              </button>

              <button
                type="button"
                onClick={onOpenIngestModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F8FAF8] border border-[#E2E8E4] text-[#1A2E22] text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm"
                title="Simulate or upload interval smart meter data"
              >
                <UploadCloud className="w-4 h-4 text-[#61776B]" />
                <span className="hidden md:inline">Ingest Data</span>
              </button>

              <button
                type="button"
                onClick={onOpenReportModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F8FAF8] border border-[#E2E8E4] text-[#1A2E22] text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm"
                title="Export Executive Decarbonisation Brief"
              >
                <Download className="w-4 h-4 text-[#61776B]" />
                <span className="hidden md:inline">Export Brief</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
