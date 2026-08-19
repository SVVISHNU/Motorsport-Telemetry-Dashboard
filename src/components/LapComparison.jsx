import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { GitCompare, Layers } from 'lucide-react';

export const LapComparison = ({ activeSession, laps }) => {
  const [selectedLapA, setSelectedLapA] = useState('');
  const [selectedLapB, setSelectedLapB] = useState('');
  const [telemetryA, setTelemetryA] = useState([]);
  const [telemetryB, setTelemetryB] = useState([]);
  const [combinedData, setCombinedData] = useState([]);

  useEffect(() => {
    if (laps && laps.length >= 2) {
      setSelectedLapA(laps[0].lapNumber.toString());
      setSelectedLapB(laps[laps.length - 1].lapNumber.toString());
    } else if (laps && laps.length === 1) {
      setSelectedLapA(laps[0].lapNumber.toString());
    }
  }, [laps]);

  useEffect(() => {
    if (!activeSession || !selectedLapA) return;

    const fetchLapData = async () => {
      try {
        const resA = await axios.get(`/api/telemetry/${activeSession._id}/lap/${selectedLapA}`);
        setTelemetryA(resA.data);

        let dataB = [];
        if (selectedLapB) {
          const resB = await axios.get(`/api/telemetry/${activeSession._id}/lap/${selectedLapB}`);
          dataB = resB.data;
          setTelemetryB(dataB);
        }

        // Align telemetry arrays by distance
        const combined = resA.data.map((item, idx) => {
          const matchingB = dataB[idx] || {};
          return {
            distance: Math.round(item.distance % 5891),
            speedA: item.speed,
            speedB: matchingB.speed || null
          };
        });

        setCombinedData(combined);
      } catch (err) {
        console.error('[LapComparison] Error fetching lap telemetry:', err.message);
      }
    };

    fetchLapData();
  }, [activeSession, selectedLapA, selectedLapB]);

  return (
    <div className="bg-[#121824] border border-[#1f293d] rounded-xl p-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f293d] pb-3 mb-4">
        <h2 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-cyan-400" /> DUAL-LAP SPEED TRACE COMPARISON
        </h2>

        {/* Lap Selectors */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400 font-bold">Lap A:</span>
            <select
              value={selectedLapA}
              onChange={(e) => setSelectedLapA(e.target.value)}
              className="bg-[#0b0e14] border border-[#1f293d] text-slate-200 text-xs font-mono rounded px-2 py-1 focus:outline-none focus:border-cyan-500"
            >
              {laps.map(l => (
                <option key={l.lapNumber} value={l.lapNumber}>
                  Lap {l.lapNumber} ({l.lapTime}s)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-purple-400 font-bold">Lap B:</span>
            <select
              value={selectedLapB}
              onChange={(e) => setSelectedLapB(e.target.value)}
              className="bg-[#0b0e14] border border-[#1f293d] text-slate-200 text-xs font-mono rounded px-2 py-1 focus:outline-none focus:border-purple-500"
            >
              {laps.map(l => (
                <option key={l.lapNumber} value={l.lapNumber}>
                  Lap {l.lapNumber} ({l.lapTime}s)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="h-80 w-full">
        {combinedData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={combinedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" opacity={0.5} />
              <XAxis dataKey="distance" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
              <YAxis domain={[0, 360]} stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
              
              <Tooltip
                contentStyle={{ backgroundColor: '#0b0e14', borderColor: '#1f293d', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                labelStyle={{ color: '#94a3b8' }}
              />

              <Line type="monotone" dataKey="speedA" stroke="#00f0ff" strokeWidth={2} dot={false} name={`Lap ${selectedLapA} Speed (km/h)`} />
              <Line type="monotone" dataKey="speedB" stroke="#d000ff" strokeWidth={2} dot={false} name={`Lap ${selectedLapB} Speed (km/h)`} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 font-mono text-xs">
            Select two laps above to visualize telemetry comparison trace.
          </div>
        )}
      </div>
    </div>
  );
};

export default LapComparison;
