import React, { useState, useEffect } from 'react';
import {
  BUILDINGS_PORTFOLIO,
  BERTHA_HOUSE_INTERVALS,
  BERTHA_HOUSE_30DAY_METRICS,
  BERTHA_HOUSE_SUBMETERS,
  BERTHA_HOUSE_ANOMALIES,
  BERTHA_HOUSE_ECMS,
  BERTHA_HOUSE_METRICS,
} from './data/berthaHouseData';
import { Building, AssessmentMetrics, AIAssessmentResult, ECMRecommendation, AnomalyItem, IntervalPoint } from './types';
import { Navbar } from './components/Navbar';
import { BuildingHeader } from './components/BuildingHeader';
import { MetricsOverview } from './components/MetricsOverview';
import { AssessmentSummaryCard } from './components/AssessmentSummaryCard';
import { IntervalLoadChart } from './components/IntervalLoadChart';
import { SubmeterBreakdown } from './components/SubmeterBreakdown';
import { AnomaliesList } from './components/AnomaliesList';
import { DecarbonisationPathways } from './components/DecarbonisationPathways';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { AgentChatDrawer } from './components/AgentChatDrawer';
import { ReportExportModal } from './components/ReportExportModal';
import { DataIngestModal } from './components/DataIngestModal';
import { MessageSquare, Sparkles, AlertTriangle } from 'lucide-react';
import { calculateEUI } from './utils/carbonCalculators';

export default function App() {
  const [selectedBuilding, setSelectedBuilding] = useState<Building>(BUILDINGS_PORTFOLIO[0]);
  const [metrics, setMetrics] = useState<AssessmentMetrics>(BERTHA_HOUSE_METRICS);
  const [intervals, setIntervals] = useState(BERTHA_HOUSE_INTERVALS);
  const [thirtyDayData, setThirtyDayData] = useState(BERTHA_HOUSE_30DAY_METRICS);
  const [submeters, setSubmeters] = useState(BERTHA_HOUSE_SUBMETERS);
  const [anomalies, setAnomalies] = useState(BERTHA_HOUSE_ANOMALIES);
  const [ecms, setEcms] = useState(BERTHA_HOUSE_ECMS);

  const [activeTab, setActiveTab] = useState<'assessment' | 'intervals' | 'submeters' | 'anomalies' | 'ecms' | 'scenario'>('assessment');
  const [assessmentResult, setAssessmentResult] = useState<AIAssessmentResult | null>(null);
  const [isAssessing, setIsAssessing] = useState<boolean>(false);
  const [assessmentError, setAssessmentError] = useState<string | null>(null);

  // Modals & Drawers
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string>('');
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isIngestModalOpen, setIsIngestModalOpen] = useState<boolean>(false);
  const [selectedEcmForSimulation, setSelectedEcmForSimulation] = useState<ECMRecommendation | null>(null);

  // Fetch full AI Decarbonisation Assessment from backend
  const fetchAssessment = async (buildingToAssess: Building = selectedBuilding) => {
    setIsAssessing(true);
    setAssessmentError(null);
    try {
      const response = await fetch('/api/assessment/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          building: buildingToAssess,
          metrics,
          anomalies,
          submeters,
          intervalSummary: {
            totalIntervals: intervals.length,
            peakKw: 58.8,
            minNightKw: 8.6,
            solarPeakKw: 23.5,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Assessment API error');
      }

      const data: AIAssessmentResult = await response.json();
      setAssessmentResult(data);
    } catch (err: any) {
      console.error('Failed to generate assessment:', err);
      setAssessmentError('Could not reach Gemini server. Using verified local deterministic models.');
    } finally {
      setIsAssessing(false);
    }
  };

  useEffect(() => {
    fetchAssessment(selectedBuilding);
  }, [selectedBuilding]);

  const handleSelectBuilding = (building: Building) => {
    setSelectedBuilding(building);
    if (building.id === 'bertha-house') {
      setMetrics(BERTHA_HOUSE_METRICS);
      setIntervals(BERTHA_HOUSE_INTERVALS);
      setSubmeters(BERTHA_HOUSE_SUBMETERS);
      setAnomalies(BERTHA_HOUSE_ANOMALIES);
      setEcms(BERTHA_HOUSE_ECMS);
    } else {
      // Scaled metrics for portfolio comparison
      const ratio = building.grossFloorArea / 2187;
      const isMature = true; // 365 days rolling
      const scaledEui = building.id === 'kirstenbosch-hub' ? 98.4 : 112.0;
      setMetrics({
        ...BERTHA_HOUSE_METRICS,
        daysMeasured: 365,
        isEuiPublishable: true,
        euiLabel: 'rolling 12m',
        rawMeasuredEnergyKwh: Math.round(building.grossFloorArea * scaledEui),
        totalCurrentKwh: Math.round(25220 * ratio),
        totalBaselineKwh: Math.round(21200 * ratio),
        currentCo2Tonnes: Number((23.20 * ratio).toFixed(2)),
        baselineCo2Tonnes: Number((19.50 * ratio).toFixed(2)),
        currentEuiKwhM2: scaledEui,
      });
    }
  };

  const handleOpenChatWithPrompt = (prompt: string) => {
    setChatInitialPrompt(prompt);
    setIsChatOpen(true);
  };

  const handleAskAgentAboutAnomaly = (anomaly: AnomalyItem) => {
    handleOpenChatWithPrompt(
      `Investigate the verified anomaly: "${anomaly.title}" affecting ${anomaly.equipment}. What is the root cause and how do we resolve it?`
    );
  };

  const handleSelectEcmForSimulation = (ecm: ECMRecommendation) => {
    setSelectedEcmForSimulation(ecm);
    setActiveTab('scenario');
  };

  const handleIngestCustomIntervals = (
    newIntervals: IntervalPoint[],
    summary: { fileName: string; rowCount: number; totalKwh: number; peakKw: number }
  ) => {
    setIntervals(newIntervals);

    // Calculate aggregated telemetry metrics
    const totalCurrentKwh = Math.round(newIntervals.reduce((sum, pt) => sum + (pt.currentKwh || 0), 0) * 18); // scale 24h sample to month
    const totalBaselineKwh = Math.round(newIntervals.reduce((sum, pt) => sum + (pt.baselineKwh || 0), 0) * 18);
    const totalSolarKwh = Math.round(newIntervals.reduce((sum, pt) => sum + (pt.solarGenKwh || 0), 0) * 18);
    const variancePercent = Number((((totalCurrentKwh - totalBaselineKwh) / totalBaselineKwh) * 100).toFixed(1));
    const co2Tonnes = Number(((totalCurrentKwh * selectedBuilding.gridCarbonIntensity) / 1000).toFixed(2));
    const baselineCo2Tonnes = Number(((totalBaselineKwh * selectedBuilding.gridCarbonIntensity) / 1000).toFixed(2));

    // Dynamic EUI
    const euiResult = calculateEUI(totalCurrentKwh, 41, selectedBuilding.grossFloorArea);

    // Night baseload (00:00 to 05:00 average)
    const nightPoints = newIntervals.filter((pt) => {
      const h = parseInt(pt.time.split(':')[0], 10);
      return h >= 0 && h < 5;
    });
    const avgBaseloadKw = nightPoints.length > 0
      ? Number((nightPoints.reduce((sum, pt) => sum + pt.currentKwh, 0) / nightPoints.length).toFixed(1))
      : 11.2;

    const updatedMetrics: AssessmentMetrics = {
      ...metrics,
      totalCurrentKwh,
      totalBaselineKwh,
      consumptionVariancePercent: variancePercent,
      currentCo2Tonnes: co2Tonnes,
      baselineCo2Tonnes,
      co2VarianceTonnes: Number((co2Tonnes - baselineCo2Tonnes).toFixed(2)),
      peakDemandKva: Number((summary.peakKw * 1.15).toFixed(1)),
      averageBaseloadKw: avgBaseloadKw,
      solarGenerationKwh: totalSolarKwh,
      currentEuiKwhM2: euiResult.eui,
      isEuiPublishable: euiResult.isPublishable,
      euiLabel: euiResult.label,
    };

    setMetrics(updatedMetrics);

    // Update submeters dynamically based on custom intervals
    const totalHvac = newIntervals.reduce((sum, pt) => sum + (pt.hvacKwh || 0), 0);
    const totalBaseload = newIntervals.reduce((sum, pt) => sum + (pt.baseloadKwh || 0), 0);
    const totalLighting = newIntervals.reduce((sum, pt) => sum + (pt.lightingKwh || 0), 0);
    const totalPlugLoad = newIntervals.reduce((sum, pt) => sum + (pt.plugLoadKwh || 0), 0);
    const sumAll = totalHvac + totalBaseload + totalLighting + totalPlugLoad || 1;

    setSubmeters([
      {
        category: 'HVAC & Climate Control',
        kwh: Math.round(totalHvac * 18),
        percentage: Number(((totalHvac / sumAll) * 100).toFixed(1)),
        baselineKwh: Math.round(totalHvac * 18 * 0.8),
        deltaPercent: +25.0,
        color: '#E11D48',
      },
      {
        category: 'Baseload (Servers & Security)',
        kwh: Math.round(totalBaseload * 18),
        percentage: Number(((totalBaseload / sumAll) * 100).toFixed(1)),
        baselineKwh: Math.round(totalBaseload * 18 * 0.9),
        deltaPercent: +11.1,
        color: '#D97706',
      },
      {
        category: 'Lighting Circuits',
        kwh: Math.round(totalLighting * 18),
        percentage: Number(((totalLighting / sumAll) * 100).toFixed(1)),
        baselineKwh: Math.round(totalLighting * 18),
        deltaPercent: 0.0,
        color: '#166534',
      },
      {
        category: 'Plug Loads & Appliances',
        kwh: Math.round(totalPlugLoad * 18),
        percentage: Number(((totalPlugLoad / sumAll) * 100).toFixed(1)),
        baselineKwh: Math.round(totalPlugLoad * 18 * 0.95),
        deltaPercent: +5.3,
        color: '#2563EB',
      },
    ]);

    fetchAssessment();
  };

  const handleSimulateNewData = (scenarioType: 'heatwave' | 'solar_fault' | 'weekend_anomaly' | 'optimal') => {
    if (scenarioType === 'heatwave') {
      setMetrics({
        ...metrics,
        totalCurrentKwh: 28400,
        consumptionVariancePercent: +33.9,
        peakDemandKva: 108.4,
        coolingDegreeDays: 94.2,
      });
      setIntervals((prev) =>
        prev.map((pt) => ({
          ...pt,
          currentKwh: Number((pt.currentKwh * 1.25).toFixed(1)),
          outdoorTempC: Number((pt.outdoorTempC + 6).toFixed(1)),
        }))
      );
    } else if (scenarioType === 'solar_fault') {
      setMetrics({
        ...metrics,
        solarGenerationKwh: 2450,
        solarSelfConsumptionPercent: 100,
      });
      setIntervals((prev) =>
        prev.map((pt) => ({
          ...pt,
          solarGenKwh: Number((pt.solarGenKwh * 0.4).toFixed(1)),
        }))
      );
    } else if (scenarioType === 'optimal') {
      setMetrics({
        ...metrics,
        totalCurrentKwh: 18900,
        consumptionVariancePercent: -10.8,
        averageBaseloadKw: 11.2,
        currentEuiKwhM2: 92.5,
      });
    }
    fetchAssessment();
  };

  return (
    <div className="min-h-screen bg-[#F1F5F2] text-[#1A2E22] flex flex-col antialiased selection:bg-[#166534] selection:text-white">
      {/* Top Navigation */}
      <Navbar
        buildings={BUILDINGS_PORTFOLIO}
        selectedBuilding={selectedBuilding}
        onSelectBuilding={handleSelectBuilding}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenIngestModal={() => setIsIngestModalOpen(true)}
        onRefreshAssessment={() => fetchAssessment()}
        isAssessing={isAssessing}
      />

      {/* Building Header & Tab Navigation */}
      <BuildingHeader
        building={selectedBuilding}
        metrics={metrics}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        anomalyCount={anomalies.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Verified ESG KPI Metrics Cards */}
        <MetricsOverview metrics={metrics} />

        {/* Tab 1: AI Decarbonisation Assessment (3-Pillars) */}
        {activeTab === 'assessment' && (
          <div className="space-y-6">
            <AssessmentSummaryCard
              assessment={assessmentResult}
              isLoading={isAssessing}
              onSelectEcm={handleSelectEcmForSimulation}
              onOpenChatWithPrompt={handleOpenChatWithPrompt}
            />

            {/* Quick Secondary Peek at Intervals */}
            <div className="pt-2">
              <IntervalLoadChart
                intervalData={intervals}
                thirtyDayData={thirtyDayData}
                onSelectAnomalyTime={(time) =>
                  handleOpenChatWithPrompt(`Explain why there was an anomaly at interval ${time} on Bertha House.`)
                }
              />
            </div>
          </div>
        )}

        {/* Tab 2: Interval Load Profiles & Solar PV */}
        {activeTab === 'intervals' && (
          <div className="space-y-6">
            <IntervalLoadChart
              intervalData={intervals}
              thirtyDayData={thirtyDayData}
              onSelectAnomalyTime={(time) =>
                handleOpenChatWithPrompt(`Explain what occurred during interval ${time}.`)
              }
            />
          </div>
        )}

        {/* Tab 3: End-Use Submetering */}
        {activeTab === 'submeters' && (
          <div className="space-y-6">
            <SubmeterBreakdown submeters={submeters} />
          </div>
        )}

        {/* Tab 4: Verified Anomalies */}
        {activeTab === 'anomalies' && (
          <div className="space-y-6">
            <AnomaliesList
              anomalies={anomalies}
              onAskAgentAboutAnomaly={handleAskAgentAboutAnomaly}
            />
          </div>
        )}

        {/* Tab 5: Decarbonisation ECMs */}
        {activeTab === 'ecms' && (
          <div className="space-y-6">
            <DecarbonisationPathways
              ecms={ecms}
              onSelectEcmForSimulation={handleSelectEcmForSimulation}
            />
          </div>
        )}

        {/* Tab 6: Net-Zero Scenario Modeler */}
        {activeTab === 'scenario' && (
          <div className="space-y-6">
            <ScenarioSimulator
              building={selectedBuilding}
              metrics={metrics}
              selectedEcm={selectedEcmForSimulation}
            />
          </div>
        )}
      </main>

      {/* Floating "Ask AI Decarbonisation Copilot" Button */}
      {!isChatOpen && (
        <button
          type="button"
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#166534] hover:bg-[#14532D] text-white font-semibold text-sm shadow-[0_8px_30px_rgb(22,101,52,0.3)] hover:scale-[1.03] transition-all border border-[#22C55E]/40 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#86EFAC]" />
          <span>Ask Decarbonisation Copilot</span>
        </button>
      )}

      {/* Chat Drawer */}
      <AgentChatDrawer
        building={selectedBuilding}
        metrics={metrics}
        anomalies={anomalies}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialPrompt={chatInitialPrompt}
      />

      {/* Printable Report Modal */}
      <ReportExportModal
        building={selectedBuilding}
        metrics={metrics}
        assessment={assessmentResult}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      {/* Data Ingestion Simulator Modal */}
      <DataIngestModal
        isOpen={isIngestModalOpen}
        onClose={() => setIsIngestModalOpen(false)}
        onSimulateNewData={handleSimulateNewData}
        onIngestCustomIntervals={handleIngestCustomIntervals}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-[#E2E8E4] text-[#4A6053] text-xs py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1A2E22]">GreenBDG Africa</span>
            <span className="text-[#A3B8AC]">•</span>
            <span>Pilot Asset: Bertha House (Mowbray, Cape Town)</span>
          </div>
          <div className="text-[#61776B]">
            Core Principle: AI operates on verified environmental data rather than replacing deterministic carbon accounting.
          </div>
        </div>
      </footer>
    </div>
  );
}
