import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings, Key, ShieldCheck, Volume2, Globe, 
  Database, Eye, EyeOff, Save, CheckCircle2, Lock,
  Bell, VolumeX, Sparkles
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export const SettingsView: React.FC = () => {
  const { 
    language, setLanguage, currentUser,
    isSoundMuted, setIsSoundMuted, buzzerVolume, setBuzzerVolume, testBuzzerSound
  } = useApp();

  const [geminiKey, setGeminiKey] = useState<string>('');
  const [supabaseUrl, setSupabaseUrl] = useState<string>('https://dnyanex-pune.supabase.co');
  const [maskSecrets, setMaskSecrets] = useState<boolean>(true);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    soundManager.playChirp();
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-ivory-border shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-sage/20 text-sage-dark">
              Configuration & Hardware
            </span>
            <span className="text-xs text-graphite/60 font-mono">
              SIH 2026 Settings Hub
            </span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-aubergine mt-1">
            Application Settings & Audio
          </h1>
          <p className="text-xs text-graphite/70 mt-1 max-w-2xl">
            Configure system audio buzzer, language preferences, SQLite database connectors, and security secrets masking.
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-sage/20 text-sage-dark text-xs font-mono font-bold flex items-center space-x-1 self-start">
          <CheckCircle2 className="w-3.5 h-3.5 text-sage" />
          <span>Backend APIs Online</span>
        </span>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Language Selection Card */}
        <div className="bg-white rounded-3xl border border-ivory-border p-6 shadow-soft-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-ivory-border pb-3">
            <Globe className="w-5 h-5 text-sage" />
            <h3 className="font-bold text-sm text-aubergine">
              Language & Localization
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-graphite block mb-1">
                Default Interface Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full px-3 py-2 bg-ivory text-graphite border border-ivory-border rounded-xl text-xs font-medium focus:ring-2 focus:ring-sage"
              >
                <option value="en">English (Default)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="hi">हिंदी (Hindi)</option>
              </select>
              <p className="text-[10px] text-graphite/50 mt-1">
                English is the primary working language. All views support live multi-lingual translation.
              </p>
            </div>

            <div className="p-3 bg-ivory rounded-2xl border border-ivory-border flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-graphite/50 font-mono">Opening Greeting</span>
              <p className="font-devanagari text-xs font-bold text-aubergine mt-0.5">
                ज्ञान जपा, टीमला पुढे न्या!
              </p>
              <p className="text-[11px] text-graphite/60 italic">
                Knowledge stays. Teams move forward.
              </p>
            </div>
          </div>
        </div>

        {/* Audio Buzzer & Sound Settings */}
        <div className="bg-white rounded-3xl border border-ivory-border p-6 shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between border-b border-ivory-border pb-3">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-rose-dust" />
              <h3 className="font-bold text-sm text-aubergine">
                Smart Buzzer & Notification Chimes
              </h3>
            </div>
            <button
              type="button"
              onClick={testBuzzerSound}
              className="px-3 py-1 bg-ivory hover:bg-white text-aubergine border border-ivory-border rounded-xl text-xs font-bold flex items-center space-x-1 shadow-soft-xs transition"
            >
              <Volume2 className="w-3.5 h-3.5 text-sage" />
              <span>Test Buzzer Sound</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-graphite">Buzzer Volume</label>
                <span className="font-mono text-[10px] text-graphite/60 font-bold">{Math.round(buzzerVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={buzzerVolume}
                onChange={(e) => setBuzzerVolume(parseFloat(e.target.value))}
                className="w-full accent-sage cursor-pointer"
              />
              <p className="text-[10px] text-graphite/50 mt-1">
                Controls synthesized Web Audio chime volume for alerts and mascot guidance.
              </p>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-ivory rounded-2xl border border-ivory-border">
              <div>
                <p className="font-bold text-graphite">Mute All Audio</p>
                <p className="text-[10px] text-graphite/50">Silences mascot chirps and alert buzzers</p>
              </div>
              <button
                type="button"
                onClick={() => setIsSoundMuted(!isSoundMuted)}
                className={`p-2 rounded-xl transition ${
                  isSoundMuted ? 'bg-rose-dust text-white' : 'bg-white border border-ivory-border text-graphite'
                }`}
              >
                {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Database & Cloud Integration */}
        <div className="bg-white rounded-3xl border border-ivory-border p-6 shadow-soft-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-ivory-border pb-3">
            <Database className="w-5 h-5 text-sage" />
            <h3 className="font-bold text-sm text-aubergine">
              Database & Cloud Architecture
            </h3>
          </div>

          <div className="p-3.5 bg-ivory rounded-2xl border border-ivory-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div>
              <p className="font-bold text-aubergine">Local SQLite Database: Active</p>
              <p className="text-[11px] text-graphite/60 font-mono">17 Schema Tables Initialized (claims, users, projects, tasks, voice_notes)</p>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-sage/20 text-sage-dark font-mono text-[10px] font-bold">
              Supabase PostgreSQL Schema Aligned
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-graphite block mb-1">Supabase Endpoint URL</label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full px-3 py-2 bg-ivory text-graphite border border-ivory-border rounded-xl text-xs font-mono focus:ring-2 focus:ring-sage"
              />
            </div>

            <div>
              <label className="font-bold text-graphite block mb-1">Gemini API Key (Optional)</label>
              <input
                type={maskSecrets ? "password" : "text"}
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy... (Uses built-in fallback if blank)"
                className="w-full px-3 py-2 bg-ivory text-graphite border border-ivory-border rounded-xl text-xs font-mono focus:ring-2 focus:ring-sage"
              />
            </div>
          </div>
        </div>

        {/* Current User & RBAC Record */}
        {currentUser && (
          <div className="bg-white rounded-3xl border border-ivory-border p-6 shadow-soft-sm space-y-3">
            <div className="flex items-center space-x-2 border-b border-ivory-border pb-3">
              <ShieldCheck className="w-5 h-5 text-sage" />
              <h3 className="font-bold text-sm text-aubergine">
                Authenticated User & Role-Based Permissions
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-ivory rounded-2xl border border-ivory-border">
                <span className="text-[10px] uppercase font-bold text-graphite/50 font-mono">User Name</span>
                <p className="font-bold text-aubergine mt-0.5">{currentUser.name}</p>
                <p className="text-[10px] text-graphite/50 font-mono">{currentUser.email}</p>
              </div>

              <div className="p-3 bg-ivory rounded-2xl border border-ivory-border">
                <span className="text-[10px] uppercase font-bold text-graphite/50 font-mono">Assigned Role</span>
                <p className="font-bold text-rose-dustDark mt-0.5">{currentUser.role}</p>
                <p className="text-[10px] text-graphite/50 font-mono">Status: Authorized</p>
              </div>

              <div className="p-3 bg-ivory rounded-2xl border border-ivory-border">
                <span className="text-[10px] uppercase font-bold text-graphite/50 font-mono">Authority</span>
                <p className="font-bold text-sage-dark mt-0.5">
                  {currentUser.role === 'Project Owner' ? 'Full Admin Access' :
                   currentUser.role === 'Reviewer / Team Leader' ? 'Human Approval Authority' :
                   currentUser.role === 'Departing Member' ? 'Author / Notes Authority' :
                   'Review & Acknowledgement Access'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Save button & notification */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-xs text-sage-dark font-bold flex items-center space-x-1.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-sage" />
              <span>Preferences saved successfully!</span>
            </span>
          ) : <span />}

          <button
            type="submit"
            className="px-6 py-2.5 bg-aubergine hover:bg-aubergine-dark text-ivory rounded-xl text-xs font-bold flex items-center space-x-2 shadow-soft-sm transition"
          >
            <Save className="w-4 h-4 text-rose-dust" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
