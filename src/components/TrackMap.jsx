import React, { useContext, useMemo } from 'react';
import { TelemetryContext } from '../context/TelemetryContext';
import { MapPin } from 'lucide-react';
import { generateSmoothTrackPath, SVG_WAYPOINTS } from '../utils/trackWaypoints';

export const TrackMap = ({ telemetry }) => {
  const { allCarsTrackPositions, selectedDriverNumber } = useContext(TelemetryContext);

  // Computed once — smooth spline path instead of hand-coded Q/L string
  const trackPathD = useMemo(() => generateSmoothTrackPath(), []);

  return (
    <div className="bg-[#121824] border border-[#1f293d] rounded-xl p-4 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-[#1f293d] pb-2 mb-3">
        <h2 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400" /> MULTI-CAR LIVE CIRCUIT MAP (10 F1 CARS)
        </h2>
        <span className="text-[10px] font-mono text-cyan-400 font-bold">SILVERSTONE GP &bull; 5.891 KM</span>
      </div>

      <div className="flex-1 min-h-[280px] bg-[#0b0e14] rounded-lg border border-[#1f293d] p-2 relative flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 500 350" className="w-full h-full max-h-[320px]">
          <path d={trackPathD} fill="none" stroke="#1b2333" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" />
          <path d={trackPathD} fill="none" stroke="#121824" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <path d={trackPathD} fill="none" stroke="#334155" strokeWidth="2.5" strokeDasharray="8 8" />

          <circle cx="170" cy="190" r="5" fill="#00f0ff" />
          <text x="180" y="195" fill="#00f0ff" fontSize="11" fontFamily="monospace" fontWeight="bold">S1</text>

          <circle cx="370" cy="90" r="5" fill="#ffe600" />
          <text x="380" y="95" fill="#ffe600" fontSize="11" fontFamily="monospace" fontWeight="bold">S2</text>

          <circle cx="60" cy="290" r="5" fill="#ff1801" />
          <text x="30" y="310" fill="#ff1801" fontSize="11" fontFamily="monospace" fontWeight="bold">FINISH</text>

          {allCarsTrackPositions.map((car) => {
            const isSelected = car.driverNumber === selectedDriverNumber;
            const posX = Number.isNaN(car.x) ? 60 : car.x;
            const posY = Number.isNaN(car.y) ? 290 : car.y;

            return (
              <g
                key={car.driverNumber}
                transform={`translate(${posX}, ${posY})`}
                style={{ transition: 'transform 0.1s linear' }}
              >
                {isSelected && <circle r="16" className="fill-emerald-400/40 animate-ping" />}
                <circle
                  r={isSelected ? 8 : 5}
                  fill={car.teamColor || '#00ff88'}
                  stroke={isSelected ? '#ffffff' : '#000000'}
                  strokeWidth={isSelected ? 2.5 : 1}
                />
                <text
                  x="10" y="4"
                  fill={isSelected ? '#ffffff' : car.teamColor || '#94a3b8'}
                  fontSize={isSelected ? '12' : '9'}
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  fontFamily="monospace"
                >
                  #{car.driverNumber}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="absolute bottom-2 left-2 bg-[#121824]/90 backdrop-blur border border-[#1f293d] p-2.5 rounded-lg text-[10px] font-mono text-slate-300 shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>TRACKING: <strong className="text-white">CAR #{selectedDriverNumber}</strong></span>
          </div>
          <div className="mt-0.5">GPS: <span className="text-cyan-400">{telemetry?.latitude || 52.0786}, {telemetry?.longitude || -1.0169}</span></div>
          <div>DIST: <span className="text-emerald-400">{Math.round((telemetry?.distance || 0) % 5891)}m</span></div>
        </div>
      </div>
    </div>
  );
};

export default TrackMap;
