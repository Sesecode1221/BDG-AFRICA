import React from 'react';
import { SubmeterBreakdownData } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Layers, ArrowUpRight, ArrowDownRight, Wind, Server, Lightbulb, Plug, Coffee } from 'lucide-react';
import { formatNumber } from '../utils/carbonCalculators';

interface SubmeterBreakdownProps {
  submeters: SubmeterBreakdownData[];
}

export const SubmeterBreakdown: React.FC<SubmeterBreakdownProps> = ({ submeters }) => {
  const getIcon = (category: string) => {
    if (category.includes('HVAC')) return <Wind className="w-4 h-4 text-[#2563EB]" />;
    if (category.includes('Baseload')) return <Server className="w-4 h-4 text-[#7C3AED]" />;
    if (category.includes('Lighting')) return <Lightbulb className="w-4 h-4 text-[#D97706]" />;
    if (category.includes('Plug')) return <Plug className="w-4 h-4 text-[#166534]" />;
    return <Coffee className="w-4 h-4 text-[#EA580C]" />;
  };

  return (
    <div className="bg-white border border-[#E2E8E4] rounded-2xl p-5 sm:p-6 text-[#1A2E22] shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8E4] pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#1A2E22] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#166534]" />
            <span>End-Use Sub-Meter Disaggregation</span>
          </h3>
          <p className="text-xs text-[#61776B] mt-1">
            Verified circuit-level breakdown across 5 key electrical distribution boards
          </p>
        </div>
        <div className="text-xs font-mono text-[#4A6053] bg-[#F8FAF8] px-3 py-1.5 rounded-lg border border-[#E2E8E4]">
          Total Monthly: <strong className="text-[#1A2E22]">25,220 kWh</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Donut Chart */}
        <div className="lg:col-span-5 h-64 sm:h-72 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={submeters}
                dataKey="kwh"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={3}
              >
                {submeters.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }: any) => {
                  if (active && payload && payload.length) {
                    const data: SubmeterBreakdownData = payload[0].payload;
                    return (
                      <div className="bg-white border border-[#E2E8E4] rounded-xl p-3 text-xs text-[#1A2E22] shadow-xl">
                        <div className="font-bold text-sm text-[#1A2E22] mb-1">{data.category}</div>
                        <div className="text-[#166534] font-bold">{formatNumber(data.kwh)} kWh ({data.percentage}%)</div>
                        <div className="text-[#61776B] mt-0.5">Baseline: {formatNumber(data.baselineKwh)} kWh</div>
                        <div className={`mt-1 font-semibold ${data.deltaPercent > 0 ? 'text-[#B91C1C]' : 'text-[#166534]'}`}>
                          Delta: {data.deltaPercent > 0 ? '+' : ''}{data.deltaPercent}%
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Circuit Cards */}
        <div className="lg:col-span-7 space-y-3">
          {submeters.map((item) => (
            <div
              key={item.category}
              className="bg-[#F8FAF8] border border-[#E2E8E4] rounded-xl p-3.5 hover:border-[#CBD8D0] shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8E4] flex items-center justify-center shrink-0 shadow-xs">
                  {getIcon(item.category)}
                </div>
                <div>
                  <div className="font-bold text-sm text-[#1A2E22]">{item.category}</div>
                  <div className="text-xs text-[#61776B]">
                    Baseline: {formatNumber(item.baselineKwh)} kWh
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-right">
                  <div className="font-mono font-bold text-sm text-[#1A2E22]">
                    {formatNumber(item.kwh)} <span className="text-xs font-normal text-[#61776B]">kWh</span>
                  </div>
                  <div className="text-xs text-[#61776B]">{item.percentage}% of total</div>
                </div>

                <div
                  className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded font-mono ${
                    item.deltaPercent > 10
                      ? 'bg-[#FDF2F2] text-[#B91C1C] border border-[#FCD5D5]'
                      : item.deltaPercent > 0
                      ? 'bg-[#FEF9EE] text-[#9A6B15] border border-[#FCE7BA]'
                      : 'bg-[#EAF5EE] text-[#166534] border border-[#CDE5D5]'
                  }`}
                >
                  {item.deltaPercent > 0 ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  <span>{item.deltaPercent > 0 ? '+' : ''}{item.deltaPercent}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
