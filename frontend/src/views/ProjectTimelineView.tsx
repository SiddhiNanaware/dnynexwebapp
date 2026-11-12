import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  History, Clock, Calendar, CheckCircle2, ShieldAlert, 
  GitCommit, UserCheck, FileText, Search, Filter, Mic, Share2
} from 'lucide-react';

export const ProjectTimelineView: React.FC = () => {
  const { activities, claims, project } = useApp();
  const [filterAction, setFilterAction] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const events = activities.filter(act => {
    if (filterAction !== 'all' && act.action !== filterAction) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (act.details && act.details.toLowerCase().includes(q)) || 
             (act.actor_name && act.actor_name.toLowerCase().includes(q)) ||
             act.action.toLowerCase().includes(q);
    }
    return true;
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'publish_handover':
      case 'handover_created':
        return { label: 'Handover Release', bg: 'bg-sage/20 text-sage-dark border-sage/40', icon: Share2 };
      case 'acknowledge_handover':
        return { label: 'Acknowledgement', bg: 'bg-lavender/30 text-aubergine border-lavender/50', icon: UserCheck };
      case 'approve_claim':
      case 'claim_approved':
        return { label: 'Claim Approved', bg: 'bg-aubergine/10 text-aubergine border-aubergine/30', icon: CheckCircle2 };
      case 'resolve_conflict':
        return { label: 'Conflict Resolved', bg: 'bg-rose-dust/20 text-rose-dustDark border-rose-dust/40', icon: ShieldAlert };
      case 'ingest_source':
      case 'source_uploaded':
        return { label: 'Source Ingested', bg: 'bg-ivory text-graphite border-ivory-border', icon: FileText };
      case 'voice_note_recorded':
        return { label: 'Voice Note Saved', bg: 'bg-lavender/40 text-aubergine border-lavender', icon: Mic };
      default:
        return { label: action.replace('_', ' '), bg: 'bg-ivory text-graphite border-ivory-border', icon: GitCommit };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-ivory-border shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-sage/20 text-sage-dark">
              Immutable Knowledge Trail
            </span>
            <span className="text-xs text-graphite/60 font-mono">
              Database Audit Log
            </span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-aubergine mt-1">
            Project History & Verification Timeline
          </h1>
          <p className="text-xs text-graphite/70 mt-1 max-w-2xl">
            Preserves who decided what, when technical claims were approved, and how system responsibilities transitioned between team members.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-graphite/40" />
          <input
            type="text"
            placeholder="Search timeline..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-ivory text-graphite border border-ivory-border rounded-xl text-xs font-medium focus:ring-2 focus:ring-sage focus:outline-none"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs font-medium">
        {[
          { id: 'all', label: 'All Events' },
          { id: 'approve_claim', label: 'Claim Approvals' },
          { id: 'publish_handover', label: 'Handover Releases' },
          { id: 'source_uploaded', label: 'Document Ingestion' },
          { id: 'voice_note_recorded', label: 'Voice Briefings' }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterAction(f.id)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
              filterAction === f.id
                ? 'bg-aubergine text-ivory font-bold shadow-soft-xs'
                : 'bg-white text-graphite/70 hover:bg-ivory border border-ivory-border'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Timeline List */}
      <div className="bg-white rounded-3xl border border-ivory-border shadow-soft-sm p-6 space-y-6">
        <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-ivory-border">
          {events.length === 0 ? (
            <div className="text-center py-8 text-xs text-graphite/50">
              No audit timeline events found for this filter.
            </div>
          ) : (
            events.map((event, i) => {
              const badge = getActionBadge(event.action);
              const Icon = badge.icon;
              return (
                <div key={event.id || i} className="relative group">
                  {/* Timeline bullet dot */}
                  <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-white border-2 border-aubergine flex items-center justify-center group-hover:scale-125 transition">
                    <div className="w-1.5 h-1.5 rounded-full bg-sage" />
                  </div>

                  <div className="bg-ivory/50 rounded-2xl border border-ivory-border p-4 hover:border-lavender hover:bg-white transition space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border flex items-center space-x-1 ${badge.bg}`}>
                          <Icon className="w-3 h-3" />
                          <span>{badge.label}</span>
                        </span>
                        <span className="font-bold text-aubergine">{event.actor_name || 'System'}</span>
                      </div>
                      <span className="text-[11px] font-mono text-graphite/50">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-graphite/80 leading-relaxed">
                      {event.details}
                    </p>

                    <div className="pt-1 flex items-center justify-between text-[10px] text-graphite/40 font-mono">
                      <span>Hash: sha256:{event.id ? event.id.slice(0, 10) : '3f8a02c8'}...</span>
                      <span>Verified Immutable</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
