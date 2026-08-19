import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { TelemetryProvider } from './context/TelemetryContext';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <AuthProvider>
      <TelemetryProvider>
        <div className="w-full min-h-screen bg-[#0b0e14] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <main className="flex-1 w-full p-2 md:p-4">
            <DashboardPage activeTab={activeTab} />
          </main>

          <footer className="bg-[#0b0e14] border-t border-[#1f293d] py-2 px-6 text-center text-[11px] font-mono text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>F1 TELEMETRY SYSTEM v1.0.0 &bull; HIGH-FREQUENCY REAL-TIME FEED</span>
            <span>EXPRESS + MONGO DB + REACT + SOCKET.IO</span>
          </footer>
        </div>
      </TelemetryProvider>
    </AuthProvider>
  );
}

export default App;
