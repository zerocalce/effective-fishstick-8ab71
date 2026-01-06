import React, { useState, useEffect } from 'react';
import { Mail, Lock, Loader2, Cpu, ShieldCheck, CheckCircle2, Copy, Info, AlertCircle } from 'lucide-react';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface LoginProps {
  onLogin: (user: User, token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('math-smite-lance@duck.com');
  const [password, setPassword] = useState('lance@duck.com');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // Basic analytics tracking
  useEffect(() => {
    console.log('[Analytics] Login page viewed');
  }, []);

  const trackEvent = (eventName: string, data?: Record<string, unknown>) => {
    console.log(`[Analytics] Event: ${eventName}`, data);
  };

  const handleCopy = (text: string, type: 'email' | 'password') => {
    navigator.clipboard.writeText(text);
    setCopySuccess(type);
    trackEvent('credentials_copied', { type });
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    trackEvent('login_attempt', { email });

    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
      
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      trackEvent('login_success', { userId: response.data.user.id });
      onLogin(response.data.user, response.data.accessToken);
    } catch (err: unknown) {
      let errorMsg = 'Failed to login. Please try again.';
      
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        if (axiosError.response?.data?.error) {
          errorMsg = axiosError.response.data.error;
        }
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
      trackEvent('login_failure', { error: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md z-10 space-y-8">
        {/* Branding */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-4 bg-blue-600/10 rounded-3xl mb-6 border border-blue-500/20 shadow-inner">
            <Cpu className="text-blue-500" size={40} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-3">CYNOMESH</h1>
          <p className="text-slate-400 font-medium">Autonomous Agent IDE</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Progress bar for loading */}
          {isLoading && (
            <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
              <div className="h-full bg-blue-500 animate-[loading_1.5s_ease-in-out_infinite]" style={{ width: '30%' }} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="font-bold">Login Failed</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-700 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  placeholder="demo@demo.demo"
                  required
                  aria-label="Email Address"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label htmlFor="password" className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                <button 
                  type="button" 
                  onClick={() => trackEvent('forgot_password_clicked')}
                  className="text-xs text-blue-500 hover:text-blue-400 font-bold transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-700 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  placeholder="••••••••"
                  required
                  aria-label="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-slate-700 rounded-md bg-slate-950 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-white scale-0 peer-checked:scale-100 transition-transform" />
                  </div>
                </div>
                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
              </label>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.98] disabled:bg-slate-800 disabled:opacity-50 disabled:active:scale-100 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span className="tracking-tight">SECURELY SIGNING IN...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="tracking-tight uppercase">Enter Sandbox</span>
                </>
              )}
            </button>
          </form>

          {/* Admin Credentials Section */}
          <div className="mt-8 pt-8 border-t border-slate-800/60">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-blue-500/10 rounded-lg">
                <ShieldCheck size={14} className="text-blue-500" />
              </div>
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest">Admin Access</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3">
                <div className="flex items-center justify-between p-2 bg-slate-950/40 border border-slate-800/40 rounded-lg group hover:border-slate-700 transition-colors mb-2">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Email</span>
                    <span className="text-xs text-slate-300 font-mono">herocalze11@gmail.com</span>
                  </div>
                  <button 
                    onClick={() => handleCopy('herocalze11@gmail.com', 'email')}
                    className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-all"
                  >
                    {copySuccess === 'email' ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-950/40 border border-slate-800/40 rounded-lg group hover:border-slate-700 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Password</span>
                    <span className="text-xs text-slate-300 font-mono">Milk2026</span>
                  </div>
                  <button 
                    onClick={() => handleCopy('Milk2026', 'password')}
                    className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-all"
                  >
                    {copySuccess === 'password' ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-slate-500 text-xs">
          Secure connection encrypted with 256-bit AES.<br />
          © 2026 AI Studio IDE by <a href="http://localhost:5173/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Aldrin Reyes</a>. All rights reserved.
        </p>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
};

export default Login;
