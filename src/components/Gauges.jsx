import React from 'react';
import { Gauge } from 'lucide-react';

export const Gauges = ({ telemetry }) => {
  const speed = telemetry?.speed !== undefined ? Math.round(telemetry.speed) : 0;
  const rpm = telemetry?.rpm !== undefined ? Math.round(telemetry.rpm) : 0;
  const gear = telemetry?.gear !== undefined ? telemetry.gear : 'N';
  const throttle = telemetry?.throttle !== undefined ? Math.round(telemetry.throttle) : 0;
  const brake = telemetry?.brake !== undefined ? Math.round(telemetry.brake) : 0;
  const steering = telemetry?.steering !== undefined ? Math.round(telemetry.steering) : 0;

  // Calculate Shift Lights (16 LEDs total)
  const shiftLightCount = 16;
  const minRpm = 6000;
  const maxRpm = 15000;
  const rpmPercent = Math.max(0, Math.min(100, ((rpm - minRpm) / (maxRpm - minRpm)) * 100));
  const activeLeds = Math.floor((rpmPercent / 100) * shiftLightCount);

  return (
    <div className="bg-[#121824] border border-[#1f293d] rounded-xl p-4 shadow-2xl">
      <div className="flex items-center justify-between border-b border-[#1f293d] pb-2.5 mb-4">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest">
            LIVE CAR INSTRUMENTATION
          </h2>
        </div>
        <span className="text-[11px] font-mono text-cyan-400 font-bold bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-500/40">
          10 Hz Real-Time Stream
        </span>
      </div>

      {/* RPM Shift Lights Bar */}
      <div className="mb-5 bg-[#0b0e14] p-3 rounded-xl border border-[#1f293d]">
        <div className="flex justify-between items-center text-xs font-mono mb-2">
          <span className="text-slate-300 font-bold tracking-wider">ENGINE RPM LIMIT</span>
          <span className={`font-mono text-base font-black ${rpm >= 14500 ? 'text-purple-400 animate-pulse' : 'text-emerald-400'}`}>
            {rpm.toLocaleString()} <span className="text-xs text-slate-400">RPM</span>
          </span>
        </div>

        <div className="flex gap-1 justify-between h-4">
          {Array.from({ length: shiftLightCount }).map((_, i) => {
            const isActive = i < activeLeds;
            let activeBg = 'bg-emerald-400 shadow-[0_0_10px_#00ff88]';
            if (i >= 5 && i < 10) activeBg = 'bg-yellow-400 shadow-[0_0_10px_#ffe600]';
            if (i >= 10 && i < 14) activeBg = 'bg-rose-500 shadow-[0_0_10px_#ff1801]';
            if (i >= 14) activeBg = 'bg-purple-500 shadow-[0_0_12px_#d000ff] animate-pulse';

            return (
              <div
                key={i}
                className={`flex-1 rounded-sm transition-all duration-75 ${
                  isActive ? activeBg : 'bg-slate-800/80 border border-slate-700/50'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Main Gauges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        
        {/* Speed Card */}
        <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#1f293d] flex flex-col justify-center items-center relative overflow-hidden shadow-inner">
          <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">
            SPEED
          </span>
          <div className="font-mono text-5xl font-black text-emerald-400 tracking-tight drop-shadow-[0_0_12px_rgba(0,255,136,0.5)]">
            {speed}
          </div>
          <span className="text-xs font-mono text-slate-400 font-bold mt-1">KM/H</span>

          {/* Speed Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden border border-slate-700">
            <div
              className="bg-emerald-400 h-full transition-all duration-100 shadow-[0_0_8px_#00ff88]"
              style={{ width: `${Math.min(100, (speed / 350) * 100)}%` }}
            />
          </div>
        </div>

        {/* Gear Card */}
        <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#1f293d] flex flex-col justify-center items-center relative shadow-inner">
          <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">
            GEAR
          </span>
          <div className="font-mono text-6xl font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(0,240,255,0.6)]">
            {gear}
          </div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">SEQUENTIAL 8-SPEED</span>
        </div>

        {/* Steering Angle */}
        <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#1f293d] flex flex-col justify-center items-center relative shadow-inner">
          <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">
            STEERING ANGLE
          </span>
          <div className="font-mono text-4xl font-black text-white flex items-center gap-1">
            {steering > 0 ? `+${steering}` : steering}°
          </div>
          
          <div className="w-12 h-12 rounded-full border-2 border-slate-700 flex items-center justify-center mt-2 relative">
            <div
              className="w-8 h-1 bg-cyan-400 rounded transition-transform duration-75 shadow-[0_0_8px_#00f0ff]"
              style={{ transform: `rotate(${steering}deg)` }}
            />
          </div>
        </div>

      </div>

      {/* Throttle & Brake Pedals */}
      <div className="grid grid-cols-2 gap-4 bg-[#0b0e14] p-4 rounded-xl border border-[#1f293d]">
        
        {/* Throttle Pedal Bar */}
        <div>
          <div className="flex justify-between items-center text-xs font-mono mb-1.5">
            <span className="text-emerald-400 font-extrabold tracking-wider">THROTTLE</span>
            <span className="text-emerald-400 font-mono font-black text-sm">{throttle}%</span>
          </div>
          <div className="w-full bg-slate-800/90 h-3.5 rounded-md overflow-hidden p-0.5 border border-slate-700">
            <div
              className="bg-emerald-400 h-full rounded-sm transition-all duration-75 shadow-[0_0_10px_#00ff88]"
              style={{ width: `${throttle}%` }}
            />
          </div>
        </div>

        {/* Brake Pedal Bar */}
        <div>
          <div className="flex justify-between items-center text-xs font-mono mb-1.5">
            <span className="text-rose-500 font-extrabold tracking-wider">BRAKE</span>
            <span className="text-rose-500 font-mono font-black text-sm">{brake}%</span>
          </div>
          <div className="w-full bg-slate-800/90 h-3.5 rounded-md overflow-hidden p-0.5 border border-slate-700">
            <div
              className="bg-rose-500 h-full rounded-sm transition-all duration-75 shadow-[0_0_10px_#ff1801]"
              style={{ width: `${brake}%` }}
            />
          </div>
        </div>

      </div>

    </div>
  );
};

export default Gauges;
