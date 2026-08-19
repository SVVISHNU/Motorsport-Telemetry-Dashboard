import React from 'react';
import { AlertTriangle, Info, Bell, CheckCircle } from 'lucide-react';

export const AlertsPanel = ({ alerts }) => {
  return (
    <div className="bg-[#121824] border border-[#1f293d] rounded-xl p-4 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-[#1f293d] pb-2 mb-3">
        <h2 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
          <Bell className="w-4 h-4 text-yellow-400" /> REAL-TIME ALERTS & EVENTS
        </h2>
        <span className="text-[10px] font-mono text-slate-400">ENGINEERING LOG</span>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[220px] space-y-2 pr-1">
        {alerts && alerts.length > 0 ? (
          alerts.map((alert) => {
            let borderBg = 'border-slate-800 bg-[#0b0e14] text-slate-300';
            let icon = <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />;

            if (alert.type === 'warning') {
              borderBg = 'border-yellow-500/40 bg-yellow-950/20 text-yellow-300';
              icon = <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />;
            } else if (alert.type === 'purple') {
              borderBg = 'border-purple-500/40 bg-purple-950/20 text-purple-300';
              icon = <CheckCircle className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />;
            } else if (alert.type === 'green') {
              borderBg = 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300';
              icon = <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />;
            }

            return (
              <div
                key={alert.id}
                className={`p-2 rounded border text-xs font-mono flex items-center justify-between gap-2 transition ${borderBg}`}
              >
                <div className="flex items-center gap-2">
                  {icon}
                  <span className="text-[11px]">{alert.message}</span>
                </div>
                <span className="text-[9px] text-slate-500">{alert.timestamp}</span>
              </div>
            );
          })
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 font-mono text-xs p-6 text-center">
            All telemetry systems operating within normal parameters.
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;
