import React, { useState } from 'react';
import { IntervalPoint, DayMetric } from '../types';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { Sun, Zap, Thermometer, AlertCircle, Calendar, Clock, BarChart3 } from 'lucide-react';

interface IntervalLoadChartProps {
  intervalData: IntervalPoint[];
  thirtyDayData: DayMetric[];
  onSelectAnomalyTime?: (time: string) => void;
}

export const IntervalLoadChart: React.FC<IntervalLoadChartProps> = ({
  intervalData,
  thirtyDayData,
  onSelectAnomalyTime,
}) => {
  const [viewMode, setViewMode] = useState<'24h' | '30d'>('24h');
  const [showSolar, setShowSolar] = useState<boolean>(true);
  const [showTemp, setShowTemp] = useState<boolean>(true);
  const [showBaseline, setShowBaseline] = useState<boolean>(true);

  return (
    <div className="bg-white border border-[#E2E8E4] rounded-2xl p-5 sm:p-6 text-[#1A2E22] shadow-sm space-y-4">
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8E4] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-[#1A2E22] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#166534]" />
              <span>Smart Meter Interval Telemetry</span>
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EAF5EE] text-[#166534] border border-[#CDE5D5] font-semibold">
              Verified 30-min intervals
            </span>
          </div>
          <p className="text-xs text-[#61776B] mt-1">
            {viewMode === '24h'
              ? 'Representative 24-hour diurnal profile: Grid Import, Rooftop Solar PV, HVAC & Baseload creep'
              : '30-Day Historical Consumption, Solar Yield & Cooling Degree Days (CDD)'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-[#F4F7F5] p-1 rounded-xl border border-[#E2E8E4] text-xs">
            <button
              type="button"
              onClick={() => setViewMode('24h')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                viewMode === '24h' ? 'bg-[#166534] text-white shadow-sm' : 'text-[#4A6053] hover:text-[#1A2E22]'
              }`}
            >
              24-Hour Profile
            </button>
            <button
              type="button"
              onClick={() => setViewMode('30d')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                viewMode === '30d' ? 'bg-[#166534] text-white shadow-sm' : 'text-[#4A6053] hover:text-[#1A2E22]'
              }`}
            >
              30-Day Trend
            </button>
          </div>
        </div>
      </div>

      {/* Layer Toggles */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-[#4A6053]">
        <label className="flex items-center gap-1.5 cursor-pointer bg-[#F8FAF8] px-2.5 py-1 rounded-lg border border-[#E2E8E4] hover:border-[#CBD8D0]">
          <input
            type="checkbox"
            checked={showBaseline}
            onChange={(e) => setShowBaseline(e.target.checked)}
            className="rounded border-[#CBD8D0] text-[#166534] focus:ring-0 cursor-pointer"
          />
          <span className="text-[#61776B] font-medium">Baseline Curve</span>
        </label>

        <label className="flex items-center gap-1.5 cursor-pointer bg-[#F8FAF8] px-2.5 py-1 rounded-lg border border-[#E2E8E4] hover:border-[#CBD8D0]">
          <input
            type="checkbox"
            checked={showSolar}
            onChange={(e) => setShowSolar(e.target.checked)}
            className="rounded border-[#CBD8D0] text-[#F59E0B] focus:ring-0 cursor-pointer"
          />
          <span className="text-[#9A6B15] font-medium">Rooftop Solar Yield</span>
        </label>

        <label className="flex items-center gap-1.5 cursor-pointer bg-[#F8FAF8] px-2.5 py-1 rounded-lg border border-[#E2E8E4] hover:border-[#CBD8D0]">
          <input
            type="checkbox"
            checked={showTemp}
            onChange={(e) => setShowTemp(e.target.checked)}
            className="rounded border-[#CBD8D0] text-[#DC2626] focus:ring-0 cursor-pointer"
          />
          <span className="text-[#B91C1C] font-medium">Ambient Temperature / CDD</span>
        </label>

        <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#61776B] ml-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] inline-block animate-ping"></span>
          <span>Red markers denote verified anomalies</span>
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className="h-80 sm:h-96 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === '24h' ? (
            <ComposedChart data={intervalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8E4" />
              <XAxis dataKey="time" stroke="#61776B" fontSize={11} tickLine={false} />
              <YAxis
                yAxisId="left"
                stroke="#61776B"
                fontSize={11}
                tickLine={false}
                unit=" kW"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#DC2626"
                fontSize={11}
                tickLine={false}
                unit="°C"
                domain={[8, 32]}
              />
              <Tooltip content={<Custom24hTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />

              {/* Baseload Reference Line */}
              <ReferenceLine
                yAxisId="left"
                y={11.6}
                stroke="#6D28D9"
                strokeDasharray="4 4"
                label={{ value: 'Target Baseload (11.6 kW)', fill: '#6D28D9', fontSize: 10, position: 'insideTopLeft' }}
              />

              {/* Peak Shaving Reference Line */}
              <ReferenceLine
                yAxisId="left"
                y={85}
                stroke="#DC2626"
                strokeDasharray="3 3"
                label={{ value: 'kVA Demand Limit (85 kVA)', fill: '#DC2626', fontSize: 10, position: 'insideTopRight' }}
              />

              {/* Solar Area */}
              {showSolar && (
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="solarGenKwh"
                  name="Solar PV Generation (kW)"
                  fill="#F59E0B"
                  fillOpacity={0.25}
                  stroke="#F59E0B"
                  strokeWidth={2}
                />
              )}

              {/* Baseline Line */}
              {showBaseline && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="baselineKwh"
                  name="Baseline Load (kW)"
                  stroke="#94A3B8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              )}

              {/* Current Period Load */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="currentKwh"
                name="Current Period Load (kW)"
                stroke="#166534"
                strokeWidth={2.5}
                dot={(props: any) => {
                  if (props.payload.isAnomaly) {
                    return (
                      <circle
                        key={props.key}
                        cx={props.cx}
                        cy={props.cy}
                        r={5}
                        fill="#DC2626"
                        stroke="#fff"
                        strokeWidth={1.5}
                        className="cursor-pointer"
                        onClick={() => onSelectAnomalyTime && onSelectAnomalyTime(props.payload.time)}
                      />
                    );
                  }
                  return null;
                }}
              />

              {/* Temperature Line */}
              {showTemp && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="outdoorTempC"
                  name="Outdoor Temperature (°C)"
                  stroke="#DC2626"
                  strokeWidth={1.5}
                  dot={false}
                />
              )}
            </ComposedChart>
          ) : (
            <ComposedChart data={thirtyDayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8E4" />
              <XAxis dataKey="date" stroke="#61776B" fontSize={10} tickFormatter={(val) => val.slice(5)} />
              <YAxis yAxisId="left" stroke="#61776B" fontSize={11} unit=" kWh" />
              <YAxis yAxisId="right" orientation="right" stroke="#DC2626" fontSize={11} unit=" CDD" />
              <Tooltip content={<Custom30dTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />

              <Bar yAxisId="left" dataKey="totalKwh" name="Daily Grid Energy (kWh)" fill="#166534" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="left" dataKey="solarKwh" name="Daily Solar Yield (kWh)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              <Line yAxisId="left" type="monotone" dataKey="baselineKwh" name="Baseline Daily (kWh)" stroke="#94A3B8" strokeDasharray="4 4" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="cdd" name="Cooling Degree Days (CDD)" stroke="#DC2626" strokeWidth={2} dot={false} />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Telemetry Highlights Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="bg-[#F8FAF8] border border-[#E2E8E4] rounded-xl p-3.5 text-xs shadow-sm">
          <div className="text-[#61776B] font-medium">Night-time Window (00:00 - 05:00)</div>
          <div className="text-[#1A2E22] font-bold mt-0.5">Average Load: 8.8 kW (Target 5.4 kW)</div>
          <div className="text-[#B91C1C] font-semibold mt-0.5">+63% parasite power draw detected</div>
        </div>

        <div className="bg-[#F8FAF8] border border-[#E2E8E4] rounded-xl p-3.5 text-xs shadow-sm">
          <div className="text-[#61776B] font-medium">Solar Production Peak (12:00)</div>
          <div className="text-[#1A2E22] font-bold mt-0.5">23.5 kW clean generation</div>
          <div className="text-[#166534] font-semibold mt-0.5">Displaced 40.0% of total building peak</div>
        </div>

        <div className="bg-[#F8FAF8] border border-[#E2E8E4] rounded-xl p-3.5 text-xs shadow-sm">
          <div className="text-[#61776B] font-medium">Evening Setback Anomaly (18:00 - 21:00)</div>
          <div className="text-[#1A2E22] font-bold mt-0.5">HVAC Chiller overrun: 14.8 kW</div>
          <div className="text-[#9A6B15] font-semibold mt-0.5">High tariff rate window (R3.40/kWh)</div>
        </div>
      </div>
    </div>
  );
};

function Custom24hTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const data: IntervalPoint = payload[0].payload;
    return (
      <div className="bg-white border border-[#E2E8E4] rounded-xl p-3 text-xs text-[#1A2E22] shadow-xl space-y-1.5 max-w-xs">
        <div className="font-bold text-sm text-[#166534] flex items-center justify-between">
          <span>Time: {data.time}</span>
          <span className="text-[#61776B] font-normal">{data.outdoorTempC}°C</span>
        </div>
        <div className="border-t border-[#E2E8E4] pt-1 space-y-1">
          <div className="flex justify-between">
            <span className="text-[#61776B]">Current Load:</span>
            <span className="font-bold text-[#1A2E22]">{data.currentKwh} kW</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#61776B]">Baseline Load:</span>
            <span className="font-semibold text-[#4A6053]">{data.baselineKwh} kW</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#9A6B15]">Solar Yield:</span>
            <span className="font-bold text-[#D97706]">{data.solarGenKwh} kW</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#1D4ED8]">HVAC Sub-load:</span>
            <span className="font-bold text-[#2563EB]">{data.hvacKwh} kW</span>
          </div>
        </div>

        {data.isAnomaly && (
          <div className="mt-2 pt-2 border-t border-[#FCD5D5] bg-[#FDF2F2] p-2 rounded text-[#B91C1C] text-[11px] flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#DC2626]" />
            <div>
              <strong className="font-bold">Anomaly Flag: </strong>
              {data.anomalyReason}
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
}

function Custom30dTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const data: DayMetric = payload[0].payload;
    return (
      <div className="bg-white border border-[#E2E8E4] rounded-xl p-3 text-xs text-[#1A2E22] shadow-xl space-y-1 max-w-xs">
        <div className="font-bold text-sm text-[#166534]">
          {data.date} ({data.dayOfWeek})
        </div>
        <div className="flex justify-between">
          <span className="text-[#61776B]">Total Consumption:</span>
          <span className="font-bold text-[#1A2E22]">{data.totalKwh} kWh</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#9A6B15]">Solar Generation:</span>
          <span className="font-bold text-[#D97706]">{data.solarKwh} kWh</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#6D28D9]">Peak Demand:</span>
          <span className="font-bold text-[#7C3AED]">{data.peakDemandKva} kVA</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#B91C1C]">Cooling Degree Days:</span>
          <span className="font-bold text-[#DC2626]">{data.cdd} CDD</span>
        </div>
        {data.anomalyDetected && (
          <div className="mt-1 text-[11px] text-[#9A6B15] bg-[#FEF9EE] border border-[#FCE7BA] p-1.5 rounded font-medium">
            {data.anomalyNote}
          </div>
        )}
      </div>
    );
  }
  return null;
}
