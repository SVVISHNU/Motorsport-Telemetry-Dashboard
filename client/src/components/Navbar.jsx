import React, { useContext } from 'react';
import { TelemetryContext, OFFICIAL_F1_DRIVERS } from '../context/TelemetryContext';
import { AuthContext } from '../context/AuthContext';
import LiveStatusBadge from './LiveStatusBadge';
import { Activity, Flag, BarChart2, Download } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { isConnected, activeSession, selectedDriverNumber, setSelectedDriverNumber } = useContext(TelemetryContext);

  const handleExportCSV = () => {
    if (!activeSession) return alert('No active session selected');
    window.open(`/api/telemetry/${activeSession._id}/export/csv`, '_blank');
  };

  return (
    <header className="bg-[#0b0e14]/95 backdrop-blur border-b border-[#1f293d] sticky top-0 z-50 px-4 md:px-6 py-2.5 w-full">
      <div className="w-full flex flex-col xl:flex-row items-center justify-between gap-3">
        
        {/* Brand Title & Live Status */}
        <div className="flex items-center gap-4 w-full xl:w-auto justify-between xl:justify-start">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-emerald-500 to-cyan-400 p-2 rounded-lg text-black shadow-[0_0_15px_rgba(0,255,136,0.4)]">
              <Activity className="w-5 h-5 font-bold" />
            </div>
            <div>
              <h1 className="font-mono text-lg font-black tracking-wider bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                APEX TELEMETRY
              </h1>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                F1 Engineering Multi-Car Feed
              </p>
            </div>
          </div>
          <LiveStatusBadge isLive={isConnected} />
        </div>

        {/* 10 F1 Drivers & Teams Selector Bar */}
        <div className="flex items-center gap-1.5 bg-[#121824] p-1.5 rounded-xl border border-[#1f293d] overflow-x-auto max-w-full no-scrollbar">
          <span className="text-[10px] font-mono text-slate-400 font-bold px-2 uppercase tracking-wider hidden sm:inline flex-shrink-0">
            F1 GRID (10 CARS):
          </span>
          {OFFICIAL_F1_DRIVERS.map((driver) => {
            const isSelected = selectedDriverNumber === driver.number;
            return (
              <button
                key={driver.number}
                onClick={() => setSelectedDriverNumber(driver.number)}
                className={`flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all duration-150 whitespace-nowrap flex-shrink-0 ${
                  isSelected
                    ? 'bg-[#182030] text-white border shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#182030]/60 border border-transparent'
                }`}
                style={{
                  borderColor: isSelected ? driver.color : 'transparent',
                  boxShadow: isSelected ? `0 0 10px ${driver.color}60` : 'none'
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                  style={{ backgroundColor: driver.color }}
                />
                <span>#{driver.number} {driver.name.split(' ')[1]}</span>
              </button>
            );
          })}
        </div>

        {/* View Navigation Tabs & CSV Export */}
        <div className="flex items-center gap-3 w-full xl:w-auto justify-end">
          <nav className="flex items-center gap-1 bg-[#121824] p-1 rounded-lg border border-[#1f293d]">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium transition ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> Dashboard
            </button>

            <button
              onClick={() => setActiveTab('laps')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium transition ${
                activeTab === 'laps'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flag className="w-3.5 h-3.5" /> Laps
            </button>

            <button
              onClick={() => setActiveTab('compare')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium transition ${
                activeTab === 'compare'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" /> Compare
            </button>
          </nav>

          <button
            onClick={handleExportCSV}
            title="Export Session CSV Telemetry"
            className="flex items-center gap-1.5 bg-[#182030] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono px-3 py-1.5 rounded-lg transition"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" /> Export CSV
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
