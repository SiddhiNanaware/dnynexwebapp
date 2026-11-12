import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, FolderKanban, FileText, BookMarked, 
  Bot, Mic, History, BarChart3, Share2, HelpCircle, 
  Settings, ChevronLeft, ChevronRight, Sparkles 
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, claims, voiceNotes, language } = useApp();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const pendingClaimsCount = claims.filter(c => c.status === 'Pending Review').length;

  const navItems = [
    { id: 'Dashboard', icon: LayoutDashboard, labelEn: 'Dashboard', labelMr: 'डॅशबोर्ड', labelHi: 'डैशबोर्ड' },
    { id: 'My Projects', icon: FolderKanban, labelEn: 'My Projects', labelMr: 'माझे प्रकल्प', labelHi: 'मेरे प्रोजेक्ट्स' },
    { id: 'Documents', icon: FileText, labelEn: 'Documents', labelMr: 'दस्तऐवज', labelHi: 'दस्तावेज़' },
    { 
      id: 'Knowledge Ledger', 
      icon: BookMarked, 
      labelEn: 'Knowledge Ledger', 
      labelMr: 'ज्ञान नोंदवही', 
      labelHi: 'ज्ञान बहीखाता',
      badge: pendingClaimsCount > 0 ? pendingClaimsCount : undefined,
      badgeColor: 'bg-rose-dust text-white'
    },
    { id: 'AI Assistant', icon: Bot, labelEn: 'AI Assistant', labelMr: 'AI सहाय्यक', labelHi: 'AI सहायक' },
    { 
      id: 'Voice Notes', 
      icon: Mic, 
      labelEn: 'Voice Notes', 
      labelMr: 'व्हॉइस नोट्स', 
      labelHi: 'वॉइस नोट्स',
      badge: voiceNotes.length > 0 ? voiceNotes.length : undefined,
      badgeColor: 'bg-lavender text-aubergine'
    },
    { id: 'Project History', icon: History, labelEn: 'Project History', labelMr: 'प्रकल्प इतिहास', labelHi: 'इतिहास' },
    { id: 'Analytics', icon: BarChart3, labelEn: 'Analytics', labelMr: 'विश्लेषण', labelHi: 'विश्लेषण' },
    { id: 'Handover', icon: Share2, labelEn: 'Handover', labelMr: 'हस्तांतरण', labelHi: 'हस्तांतरण' },
    { id: 'Help', icon: HelpCircle, labelEn: 'Help & FAQ', labelMr: 'मदत व सहाय्य', labelHi: 'सहायता' },
    { id: 'Settings', icon: Settings, labelEn: 'Settings', labelMr: 'सेटिंग्ज', labelHi: 'सेटिंग्स' },
  ];

  const getLabel = (item: typeof navItems[0]) => {
    if (language === 'mr') return item.labelMr;
    if (language === 'hi') return item.labelHi;
    return item.labelEn;
  };

  return (
    <aside 
      className={`relative bg-aubergine text-ivory transition-all duration-300 ease-in-out border-r border-aubergine-light flex flex-col flex-shrink-0 z-30 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 bg-aubergine-dark border border-aubergine-light text-ivory-dark hover:text-white rounded-full p-1 shadow-soft-sm z-40 transition"
        title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Nav items list */}
      <div className="flex-1 py-4 overflow-y-auto px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={collapsed ? getLabel(item) : undefined}
              className={`w-full flex items-center rounded-xl transition-all duration-200 group relative ${
                collapsed ? 'justify-center py-2.5 px-0' : 'px-3.5 py-2.5 space-x-3'
              } ${
                isActive
                  ? 'bg-sage text-aubergine font-bold shadow-soft-sm'
                  : 'text-ivory-dark/80 hover:bg-aubergine-light/60 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 transition-transform ${isActive ? 'scale-110 text-aubergine' : 'group-hover:scale-110'}`} />

              {!collapsed && (
                <div className="flex-1 text-left flex items-center justify-between text-xs tracking-wide">
                  <span className="truncate">{getLabel(item)}</span>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ml-1.5 ${item.badgeColor || 'bg-aubergine-dark text-ivory'}`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              )}

              {/* Tooltip on collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1 bg-aubergine-dark text-ivory text-xs rounded-lg shadow-soft-md border border-aubergine-light whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 font-medium">
                  {getLabel(item)}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Hackathon Pill */}
      {!collapsed ? (
        <div className="p-3 border-t border-aubergine-light bg-aubergine-dark/70 text-[11px] text-ivory-dark/60">
          <div className="flex items-center space-x-1.5">
            <span className="font-bold text-rose-dust">DNYANEX</span>
            <span>•</span>
            <span className="truncate">SIH 2026</span>
          </div>
          <p className="text-[10px] text-ivory-dark/40 font-mono mt-0.5">Team MahaMinds</p>
        </div>
      ) : (
        <div className="p-2 border-t border-aubergine-light text-center text-[10px] text-rose-dust font-bold font-serif">
          DX
        </div>
      )}
    </aside>
  );
};
