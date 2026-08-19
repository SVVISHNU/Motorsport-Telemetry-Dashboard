import React, { useContext } from 'react';
import { TelemetryContext, OFFICIAL_F1_DRIVERS } from '../context/TelemetryContext';
import Gauges from '../components/Gauges';
import TelemetryChart from '../components/TelemetryChart';
import TrackMap from '../components/TrackMap';
import LapTimeTable from '../components/LapTimeTable';
import AlertsPanel from '../components/AlertsPanel';
import LapComparison from '../components/LapComparison';
import { Thermometer, Cloud, ShieldCheck, Flag } from 'lucide-react';

export const DashboardPage = ({ activeTab }) => {
  const { liveTelemetry, telemetryHistory, selectedDriverNumber, activeSession, laps, alerts } = useContext(TelemetryContext);

  const selectedDriver = OFFICIAL_F1_DRIVERS.find(d => d.number === selectedDriverNumber) || OFFICIAL_F1_DRIVERS[0];

  return (
    <div className="w-full space-y-4 px-2 md:px-4 py-2">
      
      {/* Session Metadata Banner */}
      <div className="bg-[#121824] border border-[#1f293d] rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center font-mono font-black text-2xl text-white shadow-lg border border-white/20"
            style={{ backgroundColor: selectedDriver.color }}
          >
            #{selectedDriver.number}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-mono text-lg font-black text-slate-100">{selectedDriver.name}</h2>
              <span
                className="text-[11px] font-mono px-2.5 py-0.5 rounded-md font-extrabold border"
                style={{
                  backgroundColor: `${selectedDriver.color}20`,
                  color: selectedDriver.color,
                  borderColor: `${selectedDriver.color}60`
                }}
              >
                {selectedDriver.team}
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 flex items-center gap-4 mt-1">
              <span>CIRCUIT: <strong className="text-slate-200">Silverstone Grand Prix</strong></span>
              <span>RECORD: <strong className="text-purple-400">1:27.097 (L. Hamilton)</strong></span>
            </p>
          </div>
        </div>

        {/* Real Track Environmental Telemetry */}
        <div className="flex items-center gap-3 text-xs font-mono text-slate-300 flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#0b0e14] px-3 py-1.5 rounded-lg border border-[#1f293d]">
            <Thermometer className="w-3.5 h-3.5 text-rose-400" />
            <span>TRACK TEMP: <strong className="text-rose-400">42°C</strong></span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#0b0e14] px-3 py-1.5 rounded-lg border border-[#1f293d]">
            <Cloud className="w-3.5 h-3.5 text-cyan-400" />
            <span>AIR: <strong className="text-cyan-400">28°C (Dry)</strong></span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#0b0e14] px-3 py-1.5 rounded-lg border border-[#1f293d]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>DRS: <strong className="text-emerald-400">ENABLED</strong></span>
          </div>
        </div>
      </div>

      {/* Main Views */}
      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <Gauges telemetry={liveTelemetry} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8">
              <TelemetryChart telemetryHistory={telemetryHistory} />
            </div>
            <div className="lg:col-span-4">
              <TrackMap telemetry={liveTelemetry} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8">
              <LapTimeTable laps={laps} />
            </div>
            <div className="lg:col-span-4">
              <AlertsPanel alerts={alerts} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'laps' && (
        <div className="space-y-4">
          <LapTimeTable laps={laps} />
          <AlertsPanel alerts={alerts} />
        </div>
      )}

      {activeTab === 'compare' && (
        <div className="space-y-4">
          <LapComparison activeSession={activeSession} laps={laps} />
          <LapTimeTable laps={laps} />
        </div>
      )}

    </div>
  );
};

export default DashboardPage;
