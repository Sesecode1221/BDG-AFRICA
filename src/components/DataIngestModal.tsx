import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, RefreshCw, Sparkles, X, Database, Download } from 'lucide-react';
import { IntervalPoint } from '../types';

interface DataIngestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateNewData: (scenarioType: 'heatwave' | 'solar_fault' | 'weekend_anomaly' | 'optimal') => void;
  onIngestCustomIntervals?: (intervals: IntervalPoint[], summary: { fileName: string; rowCount: number; totalKwh: number; peakKw: number }) => void;
}

export const DataIngestModal: React.FC<DataIngestModalProps> = ({
  isOpen,
  onClose,
  onSimulateNewData,
  onIngestCustomIntervals,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ingestSuccess, setIngestSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [parsedSummary, setParsedSummary] = useState<{ rowCount: number; totalKwh: number; peakKw: number } | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setErrorMessage(null);
      setIngestSuccess(false);
      setParsedSummary(null);
    }
  };

  const parseCsvText = (text: string): IntervalPoint[] => {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) {
      throw new Error('CSV file contains no data rows.');
    }

    const header = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const timeIdx = header.findIndex((h) => h === 'time');
    const timestampIdx = header.findIndex((h) => h === 'timestamp');
    const currentKwhIdx = header.findIndex((h) => h === 'currentkwh' || h === 'kwh' || h === 'consumptionkwh');
    const baselineKwhIdx = header.findIndex((h) => h === 'baselinekwh' || h === 'baseline');
    const solarGenIdx = header.findIndex((h) => h === 'solargenkwh' || h === 'solarkwh' || h === 'solar');
    const tempIdx = header.findIndex((h) => h === 'outdoortempc' || h === 'tempc' || h === 'temp');
    const hvacIdx = header.findIndex((h) => h === 'hvackwh' || h === 'hvac');
    const baseloadIdx = header.findIndex((h) => h === 'baseloadkwh' || h === 'baseload');
    const lightingIdx = header.findIndex((h) => h === 'lightingkwh' || h === 'lighting');
    const plugLoadIdx = header.findIndex((h) => h === 'plugloadkwh' || h === 'plugload');

    if (currentKwhIdx === -1) {
      throw new Error('CSV must contain a "currentKwh" or "kwh" column.');
    }

    const points: IntervalPoint[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const cols = line.split(',').map((c) => c.trim());

      const rawTime = timeIdx !== -1 && cols[timeIdx] ? cols[timeIdx] : `Interval ${i}`;
      const rawTimestamp = timestampIdx !== -1 && cols[timestampIdx] ? cols[timestampIdx] : new Date().toISOString();
      const currentKwh = parseFloat(cols[currentKwhIdx]) || 0;
      const baselineKwh = baselineKwhIdx !== -1 ? parseFloat(cols[baselineKwhIdx]) || currentKwh * 0.85 : currentKwh * 0.85;
      const solarGenKwh = solarGenIdx !== -1 ? parseFloat(cols[solarGenIdx]) || 0 : 0;
      const outdoorTempC = tempIdx !== -1 ? parseFloat(cols[tempIdx]) || 18.5 : 18.5;
      const hvacKwh = hvacIdx !== -1 ? parseFloat(cols[hvacIdx]) || currentKwh * 0.52 : currentKwh * 0.52;
      const baseloadKwh = baseloadIdx !== -1 ? parseFloat(cols[baseloadIdx]) || currentKwh * 0.18 : currentKwh * 0.18;
      const lightingKwh = lightingIdx !== -1 ? parseFloat(cols[lightingIdx]) || currentKwh * 0.14 : currentKwh * 0.14;
      const plugLoadKwh = plugLoadIdx !== -1 ? parseFloat(cols[plugLoadIdx]) || currentKwh * 0.12 : currentKwh * 0.12;

      points.push({
        time: rawTime,
        timestamp: rawTimestamp,
        currentKwh: Number(currentKwh.toFixed(1)),
        baselineKwh: Number(baselineKwh.toFixed(1)),
        solarGenKwh: Number(solarGenKwh.toFixed(1)),
        netGridKwh: Number(Math.max(0, currentKwh - solarGenKwh).toFixed(1)),
        outdoorTempC: Number(outdoorTempC.toFixed(1)),
        hvacKwh: Number(hvacKwh.toFixed(1)),
        baseloadKwh: Number(baseloadKwh.toFixed(1)),
        lightingKwh: Number(lightingKwh.toFixed(1)),
        plugLoadKwh: Number(plugLoadKwh.toFixed(1)),
        isAnomaly: currentKwh > baselineKwh * 1.35,
        anomalyReason: currentKwh > baselineKwh * 1.35 ? 'Load +35% above calibrated baseline model' : undefined,
      });
    }

    return points;
  };

  const processCustomUpload = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const text = await selectedFile.text();
      let intervals: IntervalPoint[] = [];

      if (selectedFile.name.endsWith('.json')) {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          intervals = parsed;
        } else if (parsed.intervals && Array.isArray(parsed.intervals)) {
          intervals = parsed.intervals;
        } else {
          throw new Error('JSON file must be an array of intervals or contain an "intervals" array.');
        }
      } else {
        intervals = parseCsvText(text);
      }

      if (intervals.length === 0) {
        throw new Error('No valid interval telemetry rows could be parsed.');
      }

      const totalKwh = Math.round(intervals.reduce((acc, pt) => acc + (pt.currentKwh || 0), 0));
      const peakKw = Math.max(...intervals.map((pt) => pt.currentKwh || 0));

      setParsedSummary({
        rowCount: intervals.length,
        totalKwh,
        peakKw,
      });
      setIsProcessing(false);
      setIngestSuccess(true);

      setTimeout(() => {
        if (onIngestCustomIntervals) {
          onIngestCustomIntervals(intervals, {
            fileName: selectedFile.name,
            rowCount: intervals.length,
            totalKwh,
            peakKw,
          });
        } else {
          onSimulateNewData('weekend_anomaly');
        }
        onClose();
      }, 1200);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'Failed to parse telemetry file.');
    }
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
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase font-bold tracking-wider text-[#61776B]">
              Upload Custom Interval CSV / JSON Log
            </label>
            <a
              href="/mock_smart_meter_telemetry.csv"
              download="mock_smart_meter_telemetry.csv"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#166534] hover:underline"
              title="Download 24-hr sample CSV to test ingestion"
            >
              <Download className="w-3 h-3" />
              <span>Download Sample CSV</span>
            </a>
          </div>

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
                Supports standard Modbus RTU / BACnet IP interval exports (15-min or 30-min)
              </span>
            </label>
          </div>

          {errorMessage && (
            <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-xl p-3 text-xs text-[#E11D48] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

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
                className="px-3.5 py-1.5 rounded-lg bg-[#166534] hover:bg-[#14532D] text-white font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Ingest & Run AI</span>
              </button>
            </div>
          )}

          {ingestSuccess && parsedSummary && (
            <div className="bg-[#EAF5EE] border border-[#CDE5D5] rounded-xl p-3 text-xs text-[#166534] font-medium space-y-1">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#166534]" />
                <span>Successfully Ingested {parsedSummary.rowCount} Intervals</span>
              </div>
              <div className="text-[11px] text-[#4A6053] pl-6">
                Total Measured Energy: <strong>{parsedSummary.totalKwh.toLocaleString()} kWh</strong> • Peak Load: <strong>{parsedSummary.peakKw} kW</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
