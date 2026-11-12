import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, 
  Sparkles, AlertCircle, CheckCircle2, UserCheck
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { loginAsDemoUser, setCurrentUser } = useApp();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg("Please enter both username and password.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const success = await loginAsDemoUser(username.trim());
    setIsLoading(false);
    if (!success) {
      setErrorMsg("Invalid username or password. You can also use the One-Click Judge Demo Login buttons below.");
    }
  };

  const handleJudgeDemoClick = async (demoUser: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    await loginAsDemoUser(demoUser);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-pune-subtle flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Background ambient decorative shapes */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-sage/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-lavender/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative w-full max-w-md bg-white border border-ivory-border rounded-3xl shadow-soft-lg p-6 sm:p-8 z-10 space-y-6 animate-fade-in">
        
        {/* Brand Header & Prompt Section 1 Requirement */}
        <div className="text-center space-y-2">
          {/* Logo badge */}
          <div className="w-14 h-14 mx-auto rounded-2xl bg-aubergine text-ivory flex items-center justify-center shadow-aubergine-glow border border-lavender/40">
            <svg viewBox="0 0 40 40" className="w-9 h-9" fill="none">
              <circle cx="20" cy="20" r="18" fill="#292337" />
              <path d="M12 28 C16 16, 24 16, 28 28 Z" fill="#D58C96" />
              <circle cx="23" cy="17" r="4" fill="#F7F5F0" />
              <circle cx="24" cy="16.5" r="1.8" fill="#292337" />
              <path d="M27 17 L32 19 L27 21 Z" fill="#91A997" />
              <path d="M14 28 Q20 23 26 28" stroke="#F7F5F0" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <div className="flex items-center justify-center space-x-2 pt-1">
            <span className="font-serif tracking-wider font-extrabold text-2xl text-aubergine">
              DNYAN<span className="text-rose-dust">EX</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sage/15 text-sage-dark font-bold">
              v3.0
            </span>
          </div>

          {/* Section 1 Mandatory Opening Sentence & Tagline */}
          <div className="py-2 px-3 rounded-2xl bg-ivory/80 border border-ivory-border space-y-0.5">
            <p className="font-devanagari text-base font-bold text-aubergine tracking-wide">
              ज्ञान जपा, टीमला पुढे न्या!
            </p>
            <p className="text-xs text-graphite/70 font-medium">
              Knowledge stays. Teams move forward.
            </p>
          </div>

          <h2 className="text-lg font-bold text-graphite pt-1">
            Welcome back!
          </h2>
          <p className="text-xs text-graphite/60">
            Sign in to continue your knowledge journey.
          </p>
        </div>

        {/* Error message callout */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-dust/15 border border-rose-dust/40 text-rose-dustDark text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-graphite block mb-1">
              Username or Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-graphite/40 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. siddhi or sonakshi"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-ivory text-graphite border border-ivory-border rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-sage focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-graphite block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-graphite/40 absolute left-3.5 top-3" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-ivory text-graphite border border-ivory-border rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-sage focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-graphite/40 hover:text-graphite transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center space-x-2 cursor-pointer text-graphite/80">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-sage focus:ring-sage"
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => alert("Password reset token dispatched to authorized administrator email.")}
              className="text-rose-dust hover:underline font-medium"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-aubergine hover:bg-aubergine-dark text-ivory font-bold rounded-xl text-xs sm:text-sm shadow-soft-md flex items-center justify-center space-x-2 transition disabled:opacity-50"
          >
            {isLoading ? (
              <span className="font-mono text-xs animate-pulse">Authenticating with Database...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 text-rose-dust" />
              </>
            )}
          </button>
        </form>

        {/* Section 5 Requirement: Demo Login for Hackathon Judges */}
        <div className="pt-4 border-t border-ivory-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-graphite/70">
              Judge Quick Access (Demo Login)
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sage/20 text-sage-dark font-bold">
              1-Click Sign-in
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleJudgeDemoClick('siddhi')}
              className="p-2.5 rounded-xl border border-ivory-border bg-ivory/60 hover:bg-white hover:border-sage transition text-left space-y-0.5 group"
            >
              <p className="font-bold text-graphite group-hover:text-aubergine">Siddhi Nanaware</p>
              <p className="text-[10px] font-mono text-rose-dust font-semibold">Project Owner</p>
            </button>

            <button
              type="button"
              onClick={() => handleJudgeDemoClick('zahur')}
              className="p-2.5 rounded-xl border border-ivory-border bg-ivory/60 hover:bg-white hover:border-sage transition text-left space-y-0.5 group"
            >
              <p className="font-bold text-graphite group-hover:text-aubergine">Mhd Zahur Rizvi</p>
              <p className="text-[10px] font-mono text-sage-dark font-semibold">Reviewer Desk</p>
            </button>

            <button
              type="button"
              onClick={() => handleJudgeDemoClick('sonakshi')}
              className="p-2.5 rounded-xl border border-ivory-border bg-ivory/60 hover:bg-white hover:border-sage transition text-left space-y-0.5 group"
            >
              <p className="font-bold text-graphite group-hover:text-aubergine">Sonakshi Nazarkar</p>
              <p className="text-[10px] font-mono text-lavender-dark font-semibold">Incoming Member</p>
            </button>

            <button
              type="button"
              onClick={() => handleJudgeDemoClick('parineeta')}
              className="p-2.5 rounded-xl border border-ivory-border bg-ivory/60 hover:bg-white hover:border-sage transition text-left space-y-0.5 group"
            >
              <p className="font-bold text-graphite group-hover:text-aubergine">Parineeta Meshram</p>
              <p className="text-[10px] font-mono text-graphite/60 font-semibold">Departing Member</p>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-2 text-center text-[11px] text-graphite/60 font-mono">
          Smart Innovation Hackathon 2026 • Team MahaMinds
        </div>
      </div>
    </div>
  );
};
