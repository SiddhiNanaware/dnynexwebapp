import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  FolderKanban, CheckSquare, Clock, ArrowRight, 
  UploadCloud, Bot, History, HelpCircle, Plus, 
  ShieldCheck, FileText, CheckCircle2, AlertCircle, Sparkles 
} from 'lucide-react';

export const OverviewDashboard: React.FC = () => {
  const { 
    project, projects, tasks, claims, activities, 
    setActiveTab, setSelectedClaim, currentUser, language 
  } = useApp();

  const pendingTasks = tasks.filter(t => t.status !== 'Completed');
  const pendingReviews = claims.filter(c => c.status === 'Pending Review');
  const verifiedDecisions = claims.filter(c => c.type === 'Decisions');

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      
      {/* 1. Welcome Message & Project Headline */}
      <div className="relative rounded-3xl bg-gradient-to-r from-aubergine via-aubergine-light to-aubergine text-ivory p-6 sm:p-8 shadow-soft-md border border-aubergine-light overflow-hidden">
        {/* Subtle decorative Pune silhouette pattern */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none w-80 h-80">
          <svg viewBox="0 0 200 200" fill="#B8AECF">
            <polygon points="100,10 120,70 185,75 135,115 150,180 100,140 50,180 65,115 15,75 80,70" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full bg-sage/20 text-sage">
                {currentUser?.role || 'Project Lead'} Perspective
              </span>
              <span className="text-xs text-ivory-dark/70 font-mono">
                SIH 2026 • Team MahaMinds
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-devanagari text-ivory">
              Welcome back, {currentUser?.name || 'Engineer'}!
            </h1>
            <p className="text-xs sm:text-sm text-ivory-dark/90 leading-relaxed">
              {project.name}: {project.tagline}
            </p>
          </div>

          {/* Handover Readiness Pill */}
          <div className="bg-aubergine-dark/90 border border-lavender/30 rounded-2xl p-4 flex items-center space-x-4 shadow-soft-sm">
            <div className="text-center">
              <p className="text-[10px] font-mono uppercase tracking-wider text-rose-dust font-bold">
                Readiness Score
              </p>
              <p className="text-3xl font-extrabold text-ivory mt-0.5 font-mono">
                {project.handover_readiness_score}%
              </p>
            </div>
            <div className="h-10 w-px bg-aubergine-light" />
            <div>
              <p className="text-xs font-bold text-sage">Verified Knowledge</p>
              <p className="text-[11px] text-ivory-dark/70 mt-0.5">
                {claims.filter(c => c.status === 'Approved').length} claims verified
              </p>
              <button
                onClick={() => setActiveTab('Handover')}
                className="text-[11px] font-bold text-rose-dust hover:underline mt-1 flex items-center space-x-1"
              >
                <span>View Handover</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Quick Actions: 4 Prominent Buttons (Section 8 Requirement) */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-graphite/60 font-mono">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveTab('My Projects')}
            className="p-4 rounded-2xl bg-white border border-ivory-border shadow-soft-sm hover:border-sage hover:shadow-soft-md transition text-left group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-sage/15 text-sage-dark flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-aubergine">Create Project</h4>
              <p className="text-[11px] text-graphite/60 mt-0.5">Start new handover dossier</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('Documents')}
            className="p-4 rounded-2xl bg-white border border-ivory-border shadow-soft-sm hover:border-sage hover:shadow-soft-md transition text-left group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-lavender/25 text-aubergine flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-aubergine">Upload Document</h4>
              <p className="text-[11px] text-graphite/60 mt-0.5">Add spec or meeting notes</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('AI Assistant')}
            className="p-4 rounded-2xl bg-white border border-ivory-border shadow-soft-sm hover:border-sage hover:shadow-soft-md transition text-left group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-dust/20 text-rose-dustDark flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-aubergine">Ask DnyanPakshi</h4>
              <p className="text-[11px] text-graphite/60 mt-0.5">Query verified facts with citations</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('Project History')}
            className="p-4 rounded-2xl bg-white border border-ivory-border shadow-soft-sm hover:border-sage hover:shadow-soft-md transition text-left group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-aubergine/10 text-aubergine flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-aubergine">View History</h4>
              <p className="text-[11px] text-graphite/60 mt-0.5">Inspect audit trail timeline</p>
            </div>
          </button>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1: 2. My Projects & 6. Project Progress */}
        <div className="space-y-6">
          {/* 2. My Projects Card */}
          <div 
            onClick={() => setActiveTab('My Projects')}
            className="modern-card p-5 cursor-pointer space-y-4"
          >
            <div className="flex items-center justify-between border-b border-ivory-border pb-3">
              <div className="flex items-center space-x-2">
                <FolderKanban className="w-4 h-4 text-sage-dark" />
                <h3 className="font-bold text-sm text-aubergine">My Projects</h3>
              </div>
              <span className="text-[11px] text-rose-dust font-bold hover:underline">Manage →</span>
            </div>
            
            <p className="text-xs text-graphite/70">View and manage your active handover projects.</p>

            <div className="p-3 bg-ivory/60 rounded-xl border border-ivory-border space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-aubergine">{project.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sage/20 text-sage-dark font-bold">
                  {project.status}
                </span>
              </div>
              <p className="text-[11px] text-graphite/60 truncate">{project.tagline}</p>
            </div>
          </div>

          {/* 6. Project Progress */}
          <div 
            onClick={() => setActiveTab('Analytics')}
            className="modern-card p-5 cursor-pointer space-y-4"
          >
            <div className="flex items-center justify-between border-b border-ivory-border pb-3">
              <h3 className="font-bold text-sm text-aubergine">Project Progress</h3>
              <span className="text-xs font-mono font-bold text-sage-dark">
                {project.handover_readiness_score}% Complete
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1 font-medium">
                  <span className="text-graphite">Documentation & Sources</span>
                  <span className="font-mono text-sage-dark">100%</span>
                </div>
                <div className="w-full h-2 bg-ivory rounded-full overflow-hidden">
                  <div className="h-full bg-sage rounded-full" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1 font-medium">
                  <span className="text-graphite">Human Approval Gate</span>
                  <span className="font-mono text-lavender-dark">85%</span>
                </div>
                <div className="w-full h-2 bg-ivory rounded-full overflow-hidden">
                  <div className="h-full bg-lavender-dark rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1 font-medium">
                  <span className="text-graphite">Task Handoff Transfer</span>
                  <span className="font-mono text-rose-dust">75%</span>
                </div>
                <div className="w-full h-2 bg-ivory rounded-full overflow-hidden">
                  <div className="h-full bg-rose-dust rounded-full" style={{ width: '75%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: 3. Pending Tasks & 5. Pending Reviews */}
        <div className="space-y-6">
          {/* 3. Pending Tasks */}
          <div className="modern-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-ivory-border pb-3">
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-4 h-4 text-rose-dust" />
                <h3 className="font-bold text-sm text-aubergine">Pending Tasks ({pendingTasks.length})</h3>
              </div>
              <span className="text-xs text-graphite/50 font-mono">Assigned</span>
            </div>

            <div className="space-y-2.5">
              {pendingTasks.slice(0, 3).map((task) => (
                <div 
                  key={task.id}
                  className="p-3 rounded-xl bg-ivory/50 border border-ivory-border space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-aubergine">{task.title}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-dust/20 text-rose-dust font-bold">
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-graphite/70 line-clamp-1">{task.description}</p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-graphite/50 font-mono">
                    <span>Lead: <strong>{task.assigned_to || 'Unassigned'}</strong></span>
                    <span>Due: {task.due_date || 'Nov 20'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Pending Reviews */}
          <div 
            onClick={() => setActiveTab('Knowledge Ledger')}
            className="modern-card p-5 cursor-pointer space-y-4"
          >
            <div className="flex items-center justify-between border-b border-ivory-border pb-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-lavender-dark" />
                <h3 className="font-bold text-sm text-aubergine">
                  Pending Reviews ({pendingReviews.length})
                </h3>
              </div>
              <span className="text-xs text-sage-dark font-bold hover:underline">Review Ledger →</span>
            </div>

            <p className="text-xs text-graphite/70">Check claims waiting for reviewer approval.</p>

            <div className="space-y-2">
              {pendingReviews.slice(0, 2).map((c) => (
                <div
                  key={c.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedClaim(c);
                  }}
                  className="p-3 bg-ivory/60 hover:bg-ivory rounded-xl border border-ivory-border space-y-1 transition text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-aubergine truncate">{c.title}</span>
                    <span className="text-[10px] font-mono text-rose-dust font-bold">Inspect</span>
                  </div>
                  <p className="text-[11px] text-graphite/60 italic line-clamp-1">"{c.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 3: 4. Recent Activity & 8. Help and Support */}
        <div className="space-y-6">
          {/* 4. Recent Activity */}
          <div 
            onClick={() => setActiveTab('Project History')}
            className="modern-card p-5 cursor-pointer space-y-4"
          >
            <div className="flex items-center justify-between border-b border-ivory-border pb-3">
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4 text-aubergine" />
                <h3 className="font-bold text-sm text-aubergine">Recent Activity</h3>
              </div>
              <span className="text-xs text-rose-dust font-bold hover:underline">Timeline →</span>
            </div>

            <div className="space-y-3 text-xs">
              {activities.slice(0, 4).map((act) => (
                <div key={act.id} className="flex items-start space-x-2.5">
                  <span className="w-2 h-2 rounded-full bg-sage mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-aubergine leading-snug">{act.action}</p>
                    <p className="text-[11px] text-graphite/70 line-clamp-1">{act.details}</p>
                    <span className="text-[10px] font-mono text-graphite/50">
                      {act.actor_name} • {new Date(act.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 8. Help and Support Card */}
          <div 
            onClick={() => setActiveTab('Help')}
            className="modern-card p-5 cursor-pointer bg-gradient-to-br from-ivory to-white border-2 border-sage/30 space-y-3"
          >
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-sage/20 text-sage-dark">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-aubergine">Help and Support</h3>
                <p className="text-[11px] text-graphite/60">New to DNYANEX? Get step-by-step guidance.</p>
              </div>
            </div>

            <p className="text-xs text-graphite/80 leading-relaxed">
              Learn how to extract claims, verify quotations, resolve discrepancies, and download formal handover dossiers.
            </p>

            <span className="text-xs font-bold text-sage-dark flex items-center space-x-1 pt-1">
              <span>Open Help Centre & FAQ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
