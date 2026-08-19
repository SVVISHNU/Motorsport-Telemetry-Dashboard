import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';

export const TelemetryChart = ({ telemetryHistory }) => {
  const [visibleSeries, setVisibleSeries] = useState({
    speed: true,
    rpm: true,
    throttle: true,
    brake: true
  });

  const toggleSeries = (key) => {
    setVisibleSeries(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Format history data smoothly
  const formattedData = (telemetryHistory || []).map((t, idx) => {
    const timeLabel = t.timestamp
      ? new Date(t.timestamp).toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' })
      : `${idx}s`;

    return {
      index: idx + 1,
      time: timeLabel,
      speed: Math.round(t.speed || 0),
      rpm: Math.round(t.rpm || 0),
      throttle: Math.round(t.throttle || 0),
      brake: Math.round(t.brake || 0)
    };
  });

  return (
    <div className="bg-[#121824] border border-[#1f293d] rounded-xl p-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1f293d] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest">
            REAL-TIME TELEMETRY TRACES
          </h2>
        </div>

        {/* Series Filter Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => toggleSeries('speed')}
            className={`px-3 py-1 rounded-md text-xs font-mono font-bold border transition ${
              visibleSeries.speed ? 'bg-cyan-950/90 text-cyan-400 border-cyan-500/60 shadow-[0_0_8px_rgba(0,240,255,0.3)]' : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            ● Speed (km/h)
          </button>
          <button
            onClick={() => toggleSeries('rpm')}
            className={`px-3 py-1 rounded-md text-xs font-mono font-bold border transition ${
              visibleSeries.rpm ? 'bg-emerald-950/90 text-emerald-400 border-emerald-500/60 shadow-[0_0_8px_rgba(0,255,136,0.3)]' : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            ● RPM
          </button>
          <button
            onClick={() => toggleSeries('throttle')}
            className={`px-3 py-1 rounded-md text-xs font-mono font-bold border transition ${
              visibleSeries.throttle ? 'bg-yellow-950/90 text-yellow-400 border-yellow-500/60 shadow-[0_0_8px_rgba(255,230,0,0.3)]' : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            ● Throttle %
          </button>
          <button
            onClick={() => toggleSeries('brake')}
            className={`px-3 py-1 rounded-md text-xs font-mono font-bold border transition ${
              visibleSeries.brake ? 'bg-rose-950/90 text-rose-400 border-rose-500/60 shadow-[0_0_8px_rgba(255,24,1,0.3)]' : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            ● Brake %
          </button>
        </div>
      </div>

      <div className="h-72 w-full">
        {formattedData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" opacity={0.6} />
              
              {/* Monotonically increasing Time X-Axis with preserveStartEnd */}
              <XAxis
                dataKey="time"
                stroke="#64748b"
                interval="preserveStartEnd"
                minTickGap={45}
                tick={{ fontSize: 10, fontFamily: 'monospace', fill: '#94a3b8' }}
              />
              
              {/* Y-Axis 1: Speed (km/h) */}
              <YAxis
                yAxisId="speed"
                domain={[0, 360]}
                stroke="#00f0ff"
                tick={{ fontSize: 10, fontFamily: 'monospace', fill: '#00f0ff' }}
              />
              
              {/* Y-Axis 2: RPM */}
              <YAxis
                yAxisId="rpm"
                orientation="right"
                domain={[0, 16000]}
                stroke="#00ff88"
                tick={{ fontSize: 10, fontFamily: 'monospace', fill: '#00ff88' }}
              />

              <YAxis yAxisId="pedals" hide domain={[0, 100]} />
              
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0b0e14',
                  borderColor: '#1f293d',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  color: '#e2e8f0'
                }}
                labelStyle={{ color: '#00ff88', fontWeight: 'bold' }}
              />

              {visibleSeries.speed && (
                <Line
                  yAxisId="speed"
                  type="monotone"
                  dataKey="speed"
                  stroke="#00f0ff"
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive={false}
                  name="Speed (km/h)"
                />
              )}
              {visibleSeries.rpm && (
                <Line
                  yAxisId="rpm"
                  type="monotone"
                  dataKey="rpm"
                  stroke="#00ff88"
                  strokeWidth={1.8}
                  dot={false}
                  isAnimationActive={false}
                  name="Engine RPM"
                />
              )}
              {visibleSeries.throttle && (
                <Line
                  yAxisId="pedals"
                  type="monotone"
                  dataKey="throttle"
                  stroke="#ffe600"
                  strokeWidth={1.8}
                  dot={false}
                  isAnimationActive={false}
                  name="Throttle (%)"
                />
              )}
              {visibleSeries.brake && (
                <Line
                  yAxisId="pedals"
                  type="monotone"
                  dataKey="brake"
                  stroke="#ff1801"
                  strokeWidth={1.8}
                  dot={false}
                  isAnimationActive={false}
                  name="Brake (%)"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 font-mono text-xs">
            Awaiting live telemetry stream...
          </div>
        )}
      </div>
    </div>
  );
};

export default TelemetryChart;
