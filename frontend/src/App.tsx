import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DnyanPakshiMascot } from './components/DnyanPakshiMascot';
import { EvidenceDrawer } from './components/EvidenceDrawer';
import { SourceHighlightModal } from './components/SourceHighlightModal';
import { LoginScreen } from './components/LoginScreen';

// 11 Core Navigation Views
import { OverviewDashboard } from './views/OverviewDashboard';
import { ProjectsView } from './views/ProjectsView';
import { DocumentsView } from './views/DocumentsView';
import { KnowledgeLedgerView } from './views/KnowledgeLedgerView';
import { AiAssistantView } from './views/AiAssistantView';
import { VoiceNotesView } from './views/VoiceNotesView';
import { ProjectTimelineView } from './views/ProjectTimelineView';
import { AnalyticsView } from './views/AnalyticsView';
import { HandoverWorkspaceView } from './views/HandoverWorkspaceView';
import { HelpView } from './views/HelpView';
import { SettingsView } from './views/SettingsView';

const MainLayout: React.FC = () => {
  const { currentUser, activeTab, setActiveTab } = useApp();

  // If user is not authenticated, show the LoginScreen first
  if (!currentUser) {
    return <LoginScreen />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'Dashboard':
      case 'Overview':
        return <OverviewDashboard />;
      case 'My Projects':
      case 'Projects':
        return <ProjectsView />;
      case 'Documents':
      case 'Evidence Explorer':
        return <DocumentsView />;
      case 'Knowledge Ledger':
        return <KnowledgeLedgerView />;
      case 'AI Assistant':
        return <AiAssistantView />;
      case 'Voice Notes':
        return <VoiceNotesView />;
      case 'Project History':
      case 'Project Timeline':
        return <ProjectTimelineView />;
      case 'Analytics':
        return <AnalyticsView />;
      case 'Handover':
      case 'Handover Workspace':
        return <HandoverWorkspaceView />;
      case 'Help':
      case 'Help & FAQ':
        return <HelpView />;
      case 'Settings':
        return <SettingsView />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-pune-subtle flex flex-col text-graphite antialiased selection:bg-rose-dust selection:text-white">
      {/* Global Navbar */}
      <Navbar />

      {/* Opening Welcome Ribbon - Displaying ONLY this Marathi sentence and English tagline per Section 1 */}
      <div className="bg-white/80 border-b border-ivory-border backdrop-blur-sm px-4 sm:px-6 py-2 flex flex-col sm:flex-row items-center justify-between text-xs gap-1 z-20">
        <div className="flex items-center space-x-2">
          <span className="font-devanagari font-bold text-aubergine text-xs sm:text-sm tracking-wide">
            ज्ञान जपा, टीमला पुढे न्या!
          </span>
          <span className="text-graphite/40 font-mono text-[10px] hidden sm:inline">•</span>
          <span className="text-graphite/70 text-xs font-medium">
            Knowledge stays. Teams move forward.
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[11px] text-graphite/60 font-mono">
          <span>Smart Innovation Hackathon 2026</span>
          <span>•</span>
          <span className="font-bold text-aubergine">Team MahaMinds</span>
        </div>
      </div>

      {/* Authenticated Workspace Shell */}
      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Sidebar with 11 Navigation Items */}
        <Sidebar />

        {/* Main Workspace Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-ivory/30">
          <div className="max-w-7xl mx-auto space-y-4">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* DnyanPakshi AI Mascot (5 States, Web Speech Voice Recognition & TTS Readout) */}
      <DnyanPakshiMascot />

      {/* Signature Feature: Evidence Drawer Side-over */}
      <EvidenceDrawer />

      {/* Verbatim Source Highlight Modal */}
      <SourceHighlightModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;
