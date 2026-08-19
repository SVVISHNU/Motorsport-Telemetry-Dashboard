import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Activity, Lock, Mail, User, Shield } from 'lucide-react';

export const LoginPage = ({ onClose }) => {
  const { login, register } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await register(username, email, password, 'engineer');
      } else {
        await login(email, password);
      }
      if (onClose) onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#121824] border border-[#1f293d] w-full max-w-md p-6 rounded-2xl shadow-2xl relative">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 mb-3 shadow-[0_0_15px_rgba(0,255,136,0.3)]">
            <Activity className="w-6 h-6" />
          </div>
          <h2 className="font-mono text-xl font-black text-slate-100 uppercase tracking-wider">
            {isRegister ? 'Engineer Registration' : 'Engineering Portal Login'}
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Motorsport Real-time Telemetry Authentication
          </p>
        </div>

        {error && (
          <div className="bg-rose-950/60 border border-rose-500/50 text-rose-300 px-3 py-2 rounded text-xs font-mono mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. TelemetryLead"
                  className="w-full bg-[#0b0e14] border border-[#1f293d] rounded pl-9 pr-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="engineer@motorsport.com"
                className="w-full bg-[#0b0e14] border border-[#1f293d] rounded pl-9 pr-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0b0e14] border border-[#1f293d] rounded pl-9 pr-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-extrabold text-xs py-2.5 rounded shadow-[0_0_15px_rgba(0,255,136,0.4)] transition"
          >
            {isRegister ? 'CREATE ACCOUNT' : 'AUTHENTICATE & ACCESS'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs font-mono text-cyan-400 hover:underline"
          >
            {isRegister ? 'Already have credentials? Log In' : 'Need new engineer access? Register here'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
