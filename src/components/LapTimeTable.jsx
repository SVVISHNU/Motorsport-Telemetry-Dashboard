import React, { useContext } from 'react';
import { TelemetryContext, OFFICIAL_F1_DRIVERS } from '../context/TelemetryContext';
import { Flag, Award, Zap } from 'lucide-react';

export const LapTimeTable = ({ laps }) => {
  const { selectedDriverNumber } = useContext(TelemetryContext);

  if (!laps || laps.length === 0) {
    return (
      <div className="bg-[#121824] border border-[#1f293d] rounded-xl p-6 text-center font-mono text-xs text-slate-400">
        <div className="flex items-center justify-center gap-2 mb-2 text-slate-300">
          <Flag className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="font-bold">LIVE LAP TIMING FEED ACTIVE</span>
        </div>
        Recording live lap sector split times for F1 Grid...
      </div>
    );
  }

  // Filter or prioritize selected driver's laps, or display grid laps
  const filteredLaps = laps.filter(l => !l.driverNumber || l.driverNumber === selectedDriverNumber);
  const displayLaps = filteredLaps.length > 0 ? filteredLaps : laps;

  const bestS1 = Math.min(...displayLaps.map(l => l.sector1 || 999));
  const bestS2 = Math.min(...displayLaps.map(l => l.sector2 || 999));
  const bestS3 = Math.min(...displayLaps.map(l => l.sector3 || 999));

  return (
    <div className="bg-[#121824] border border-[#1f293d] rounded-xl p-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-[#1f293d] pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Flag className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest">
            LAP TIMES & SECTOR SPLIT ANALYSIS
          </h2>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
          {displayLaps.length} Laps Recorded
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-[#1f293d] text-slate-400 uppercase text-[10px]">
              <th className="py-2 px-3">Driver</th>
              <th className="py-2 px-3">Lap</th>
              <th className="py-2 px-3">Lap Time</th>
              <th className="py-2 px-3">Sector 1</th>
              <th className="py-2 px-3">Sector 2</th>
              <th className="py-2 px-3">Sector 3</th>
              <th className="py-2 px-3">Top Speed</th>
              <th className="py-2 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1f293d]">
            {displayLaps.map((lap) => {
              const driverObj = OFFICIAL_F1_DRIVERS.find(d => d.number === lap.driverNumber) || { name: lap.driverName || 'Driver', number: lap.driverNumber || 1, color: '#00ff88' };
              const isBestS1 = lap.sector1 === bestS1;
              const isBestS2 = lap.sector2 === bestS2;
              const isBestS3 = lap.sector3 === bestS3;

              return (
                <tr
                  key={lap._id || `${lap.driverNumber}-${lap.lapNumber}`}
                  className={`hover:bg-[#182030] transition ${
                    lap.isSessionBest ? 'bg-purple-950/30' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 font-bold text-slate-200 flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: driverObj.color }}
                    />
                    <span>#{driverObj.number} {driverObj.name.split(' ')[1]}</span>
                  </td>

                  <td className="py-2.5 px-3 font-bold text-slate-300">
                    #{lap.lapNumber}
                  </td>
                  
                  <td className={`py-2.5 px-3 font-extrabold ${
                    lap.isSessionBest ? 'text-purple-400 drop-shadow-[0_0_8px_#d000ff]' : 'text-slate-100'
                  }`}>
                    {lap.lapTime}s
                  </td>

                  <td className={`py-2.5 px-3 ${isBestS1 ? 'text-purple-400 font-bold' : 'text-slate-300'}`}>
                    {lap.sector1}s
                  </td>

                  <td className={`py-2.5 px-3 ${isBestS2 ? 'text-purple-400 font-bold' : 'text-slate-300'}`}>
                    {lap.sector2}s
                  </td>

                  <td className={`py-2.5 px-3 ${isBestS3 ? 'text-purple-400 font-bold' : 'text-slate-300'}`}>
                    {lap.sector3}s
                  </td>

                  <td className="py-2.5 px-3 text-cyan-400 font-semibold">
                    {lap.topSpeed} km/h
                  </td>

                  <td className="py-2.5 px-3">
                    {lap.isSessionBest ? (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded border border-purple-500/40">
                        <Award className="w-3 h-3 text-purple-400" /> SESSION BEST
                      </span>
                    ) : lap.isPersonalBest ? (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">
                        <Zap className="w-3 h-3 text-emerald-400" /> PERSONAL BEST
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">VALID</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LapTimeTable;
