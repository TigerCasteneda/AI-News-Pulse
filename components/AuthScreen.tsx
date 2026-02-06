
import React, { useState } from 'react';
import { Cpu, Mail, User, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthScreenProps {
  onRegister: (user: UserType) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email) return;
    setIsSubmitting(true);
    // Simulate network delay
    setTimeout(() => {
      onRegister({ username, email });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative animate-in fade-in zoom-in duration-700">
        <div className="glass-effect p-8 rounded-3xl shadow-2xl border border-slate-800">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-xl shadow-blue-900/40 mb-4 animate-bounce">
              <Cpu size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-2">
              AI NEWS <span className="text-blue-500">PULSE</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2 font-medium">
              Access the Intelligence Terminal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                <User size={12} /> Operator Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: Ghost_Operator"
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-700 focus:outline-none focus:border-blue-600/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                <Mail size={12} /> Contact Node (Email)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@intelligence.pulse"
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-700 focus:outline-none focus:border-blue-600/50 transition-all"
              />
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  AUTHENTICATING...
                </div>
              ) : (
                <>
                  INITIALIZE SESSION <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <div className="flex items-center justify-center gap-2 text-slate-500 text-[10px] font-mono uppercase tracking-[0.2em]">
              <Shield size={10} /> Secure Encryption v4.2
            </div>
          </div>
        </div>
        
        <p className="mt-6 text-center text-slate-600 text-xs flex items-center justify-center gap-2">
          <Sparkles size={12} /> Tracking breakthroughs in real-time
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
