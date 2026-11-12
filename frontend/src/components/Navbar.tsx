import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, Volume2, VolumeX, LogOut, HelpCircle, 
  ChevronDown, CheckCircle2, Shield, User, X, Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentUser, logout, language, setLanguage, 
    notifications, markNotificationRead, clearNotifications,
    isSoundMuted, setIsSoundMuted, testBuzzerSound,
    setActiveTab, project 
  } = useApp();

  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <header className="sticky top-0 z-40 bg-aubergine text-ivory border-b border-aubergine-light shadow-soft-md">
      {/* Top Pune Heritage Skyline Accent Line */}
      <div className="h-0.5 bg-gradient-to-r from-rose-dust via-lavender to-sage" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Product Identity */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('Dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-aubergine-dark border border-lavender/40 flex items-center justify-center shadow-soft-sm">
            <svg viewBox="0 0 36 36" className="w-7 h-7" fill="none">
              <circle cx="18" cy="18" r="16" fill="#1D1827" />
              <path d="M10 24 C14 14, 22 14, 26 24 Z" fill="#D58C96" />
              <circle cx="21" cy="15" r="4" fill="#F7F5F0" />
              <circle cx="22" cy="14" r="1.5" fill="#292337" />
              <path d="M25 15 L29 17 L25 19 Z" fill="#91A997" />
              <path d="M12 24 Q18 20 24 24" stroke="#F7F5F0" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif tracking-wider font-extrabold text-xl text-ivory">
                DNYAN<span className="text-rose-dust">EX</span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-lavender/20 text-lavender font-bold">
                MahaMinds
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-ivory-dark/70 font-medium">
              Knowledge stays. Teams move forward.
            </p>
          </div>
        </div>

        {/* Center: Current Project Readiness Pill */}
        <div className="hidden lg:flex items-center space-x-3 bg-aubergine-dark px-3.5 py-1.5 rounded-xl border border-aubergine-light text-xs">
          <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
          <span className="text-ivory font-medium truncate max-w-[200px]">{project.name}</span>
          <div className="h-3.5 w-px bg-aubergine-light" />
          <span className="text-ivory-dark/60">Readiness:</span>
          <span className="font-bold text-rose-dust">{project.handover_readiness_score}%</span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Audio / Buzzer Control */}
          <div className="flex items-center space-x-1 bg-aubergine-dark rounded-xl p-1 border border-aubergine-light">
            <button
              onClick={() => setIsSoundMuted(!isSoundMuted)}
              className="p-1.5 rounded-lg hover:bg-aubergine text-ivory-dark/80 hover:text-ivory transition"
              title={isSoundMuted ? "Unmute Sound" : "Mute Sound"}
            >
              {isSoundMuted ? <VolumeX className="w-4 h-4 text-graphite/40" /> : <Volume2 className="w-4 h-4 text-sage" />}
            </button>
            <button
              onClick={testBuzzerSound}
              className="hidden sm:inline text-[10px] font-mono px-2 py-0.5 rounded bg-aubergine text-ivory-dark/70 hover:text-ivory hover:bg-aubergine-light transition"
              title="Test Notification Chime"
            >
              Test Buzzer
            </button>
          </div>

          {/* Language Switcher (ENGLISH DEFAULT per instruction!) */}
          <div className="flex items-center bg-aubergine-dark rounded-xl p-0.5 border border-aubergine-light text-xs font-semibold">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-lg transition ${language === 'en' ? 'bg-sage text-aubergine font-bold' : 'text-ivory-dark/70 hover:text-white'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('mr')}
              className={`px-2 py-1 rounded-lg transition ${language === 'mr' ? 'bg-lavender text-aubergine font-bold' : 'text-ivory-dark/70 hover:text-white'}`}
            >
              मराठी
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-1 rounded-lg transition ${language === 'hi' ? 'bg-rose-dust text-aubergine font-bold' : 'text-ivory-dark/70 hover:text-white'}`}
            >
              हिंदी
            </button>
          </div>

          {/* Smart Alerts Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-aubergine-dark hover:bg-aubergine border border-aubergine-light text-ivory transition relative"
              title="DNYANEX Smart Alerts"
            >
              <Bell className="w-4 h-4 text-ivory-dark" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-dust text-white flex items-center justify-center text-[10px] font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-ivory-border shadow-soft-lg text-graphite p-4 z-50 animate-fade-in space-y-3">
                <div className="flex items-center justify-between border-b border-ivory-border pb-2">
                  <div className="flex items-center space-x-1.5">
                    <Bell className="w-4 h-4 text-aubergine" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-aubergine">
                      DNYANEX Smart Alerts
                    </h4>
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-[11px] text-graphite/60 hover:text-rose-dust font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-graphite/50 text-center py-4">No notifications.</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                          n.is_read 
                            ? 'bg-ivory/50 border-ivory-border text-graphite/70' 
                            : 'bg-sage-subtle border-sage/40 text-graphite shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-aubergine">{n.title}</span>
                          {n.is_urgent && (
                            <span className="text-[9px] font-mono px-1 rounded bg-rose-dust text-white font-bold">
                              URGENT
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-graphite/80 leading-snug">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Help Button */}
          <button
            onClick={() => setActiveTab('Help')}
            className="p-2 rounded-xl bg-aubergine-dark hover:bg-aubergine border border-aubergine-light text-ivory transition"
            title="DNYANEX Help Centre"
          >
            <HelpCircle className="w-4 h-4 text-ivory-dark" />
          </button>

          {/* User Profile & Logout */}
          {currentUser && (
            <div className="flex items-center space-x-2 pl-1 border-l border-aubergine-light">
              <div className="w-8 h-8 rounded-xl bg-lavender text-aubergine font-bold text-xs flex items-center justify-center font-mono">
                {currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-ivory leading-tight">{currentUser.name}</p>
                <p className="text-[10px] text-rose-dust font-medium leading-tight">{currentUser.role.split(' ')[0]}</p>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-ivory-dark/60 hover:text-rose-dust transition ml-1"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
