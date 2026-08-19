import React from 'react';

export const LiveStatusBadge = ({ isLive }) => {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-bold tracking-wider ${
      isLive 
        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/50 shadow-[0_0_12px_rgba(0,255,136,0.3)]' 
        : 'bg-rose-950/60 text-rose-400 border-rose-500/40'
    }`}>
      <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse-live shadow-[0_0_8px_#00ff88]' : 'bg-rose-500'}`} />
      <span>{isLive ? 'LIVE ●' : 'OFFLINE'}</span>
    </div>
  );
};

export default LiveStatusBadge;
