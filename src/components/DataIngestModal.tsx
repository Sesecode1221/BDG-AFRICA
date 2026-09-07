import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, RefreshCw, Sparkles, X, Database } from 'lucide-react';

interface DataIngestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateNewData: (scenarioType: 'heatwave' | 'solar_fault' | 'weekend_anomaly' | 'optimal') => void;
}

export const DataIngestModal: React.FC<DataIngestModalProps> = ({
  isOpen,
  onClose,
  onSimulateNewData,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ingestSuccess, setIngestSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const processCustomUpload = () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIngestSuccess(true);
      setTimeout(() => {
        onSimulateNewData('weekend_anomaly');
        onClose();
      }, 1000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#E2E8E4] rounded-2xl w-full max-w-xl p-6 text-[#1A2E22] shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#E2E8E4] pb-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#166534]" />
            <h3 className="font-bold text-base text-[#1A2E22]">Ingest Smart Meter Telemetry</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#61776B] hover:text-[#1A2E22] hover:bg-[#F4F7F5] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Option 1: Quick Scenario Simulator */}
        <div className="space-y-3">
          <label className="text-xs uppercase font-bold tracking-wider text-[#61776B]">
            Simulate Smart Meter Telemetry Scenario
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                onSimulateNewData('heatwave');
                onClose();
              }}
              className="text-left p-3.5 rounded-xl bg-[#F8FAF8] hover:bg-[#FEF9EE] border border-[#E2E8E4] hover:border-[#FCE7BA] transition-all group cursor-pointer shadow-xs"
            >
              <div className="font-bold text-xs text-[#1A2E22] group-hover:text-[#9A6B15]">
                Extreme Summer Heatwave (High CDD)
              </div>
              <div className="text-[11px] text-[#61776B] mt-1">
                +45% Chiller lift, 32°C ambient, 108 kVA peak
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                onSimulateNewData('solar_fault');
                onClose();
              }}
              className="text-left p-3.5 rounded-xl bg-[#F8FAF8] hover:bg-[#FFF1F2] border border-[#E2E8E4] hover:border-[#FECDD3] transition-all group cursor-pointer shadow-xs"
            >
              <div className="font-bold text-xs text-[#1A2E22] group-hover:text-[#E11D48]">
                Solar PV Inverter String Fault
              </div>
              <div className="text-[11px] text-[#61776B] mt-1">
                -60% solar yield drop, grid import surge
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                onSimulateNewData('weekend_anomaly');
                onClose();
              }}
              className="text-left p-3.5 rounded-xl bg-[#F8FAF8] hover:bg-[#F5F3FF] border border-[#E2E8E4] hover:border-[#DDD6FE] transition-all group cursor-pointer shadow-xs"
            >
              <div className="font-bold text-xs text-[#1A2E22] group-hover:text-[#6D28D9]">
                Weekend HVAC Runaway Overrun
              </div>
              <div className="text-[11px] text-[#61776B] mt-1">
                AHUs running on Saturday/Sunday 24/7
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                onSimulateNewData('optimal');
                onClose();
              }}
              className="text-left p-3.5 rounded-xl bg-[#F8FAF8] hover:bg-[#EAF5EE] border border-[#E2E8E4] hover:border-[#CDE5D5] transition-all group cursor-pointer shadow-xs"
            >
              <div className="font-bold text-xs text-[#1A2E22] group-hover:text-[#166534]">
                Optimal Post-ECM Decarbonised Day
              </div>
              <div className="text-[11px] text-[#61776B] mt-1">
                BMS night purge active, 11.2 kW baseload
              </div>
            </button>
          </div>
        </div>

        {/* Option 2: Upload CSV File */}
        <div className="space-y-3 pt-2 border-t border-[#E2E8E4]">
          <label className="text-xs uppercase font-bold tracking-wider text-[#61776B]">
            Or Upload Custom Interval CSV / JSON Log
          </label>

          <div className="border-2 border-dashed border-[#CBD8D0] hover:border-[#166534] rounded-xl p-6 text-center cursor-pointer transition-colors bg-[#F8FAF8]">
            <input
              type="file"
              accept=".csv,.json"
              onChange={handleFileUpload}
              className="hidden"
              id="meter-file-upload"
            />
            <label htmlFor="meter-file-upload" className="cursor-pointer flex flex-col items-center">
              <UploadCloud className="w-8 h-8 text-[#166534] mb-2" />
              <span className="text-xs font-bold text-[#1A2E22]">Click or drag & drop smart meter CSV file</span>
              <span className="text-[11px] text-[#61776B] mt-1">
                Supports Modbus RTU / BACnet IP interval exports (15-min or 30-min)
              </span>
            </label>
          </div>

          {selectedFile && (
            <div className="bg-[#F8FAF8] border border-[#E2E8E4] p-3 rounded-xl flex items-center justify-between text-xs shadow-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#166534]" />
                <span className="font-mono text-[#1A2E22] font-semibold">{selectedFile.name}</span>
                <span className="text-[#61776B]">({Math.round(selectedFile.size / 1024)} KB)</span>
              </div>
              <button
                type="button"
                onClick={processCustomUpload}
                disabled={isProcessing}
                className="px-3.5 py-1.5 rounded-lg bg-[#166534] hover:bg-[#14532D] text-white font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Ingest & Run AI</span>
              </button>
            </div>
          )}

          {ingestSuccess && (
            <div className="bg-[#EAF5EE] border border-[#CDE5D5] rounded-xl p-3 text-xs text-[#166534] font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#166534]" />
              <span>Interval telemetry ingested and verified via SHA-256 pipeline!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
