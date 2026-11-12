import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ClaimCategory, ClaimStatus, Claim } from '../types';
import { 
  BookMarked, Filter, Search, CheckCircle2, AlertTriangle, 
  HelpCircle, ShieldAlert, ArrowUpRight, ShieldCheck, Lock,
  Check, X, FileText, User
} from 'lucide-react';

const ALL_CATEGORIES: ClaimCategory[] = [
  'Decisions',
  'Responsibilities and owners',
  'Unfinished work',
  'Dependencies',
  'Risks',
  'Blockers',
  'Recurring problems',
  'Open questions',
  'Next actions'
];

const ALL_STATUSES: (ClaimStatus | 'All')[] = [
  'All',
  'Approved',
  'Verified',
  'Pending Review',
  'Conflicting',
  'Missing Evidence'
];

export const KnowledgeLedgerView: React.FC = () => {
  const { roleFilteredClaims, setSelectedClaim, currentUser, approveClaim, rejectClaim } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<ClaimCategory | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<ClaimStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const canApprove = currentUser?.role === 'Reviewer / Team Leader' || currentUser?.role === 'Project Owner';

  const filtered = roleFilteredClaims.filter(c => {
    if (selectedCategory !== 'All' && c.type !== selectedCategory) return false;
    if (selectedStatus !== 'All' && c.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = c.title.toLowerCase().includes(q) || 
                    c.text.toLowerCase().includes(q) || 
                    c.quote.toLowerCase().includes(q) ||
                    (c.source_name && c.source_name.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const getStatusBadge = (status: ClaimStatus) => {
    const map: Record<ClaimStatus, string> = {
      Approved: 'bg-sage/20 text-sage-dark border-sage/40',
      Verified: 'bg-aubergine/10 text-aubergine border-aubergine/30',
      'Pending Review': 'bg-lavender/30 text-aubergine border-lavender/50',
      Conflicting: 'bg-rose-dust/20 text-rose-dustDark border-rose-dust/40',
      'Missing Evidence': 'bg-aubergine-dark/10 text-graphite border-graphite/30',
      Inferred: 'bg-ivory text-graphite border-ivory-border',
      Rejected: 'bg-rose-dust/30 text-rose-dustDark border-rose-dust'
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${map[status] || 'bg-ivory'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-ivory-border shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-sage/20 text-sage-dark">
              Verifiable Evidence Ledger
            </span>
            <span className="text-xs font-mono text-graphite/60">
              Role: {currentUser?.role || 'Guest'}
            </span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-aubergine mt-1">
            Knowledge Ledger (Evidence-Backed Claims)
          </h1>
          <p className="text-xs text-graphite/70 mt-1 max-w-2xl">
            Atomic knowledge units extracted from source documents, verified against verbatim citations, and validated by human engineering reviewers.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-ivory p-3 rounded-2xl border border-ivory-border flex-shrink-0">
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-graphite/50 font-mono">Ledger Items</p>
            <p className="text-lg font-bold text-aubergine">{roleFilteredClaims.length}</p>
          </div>
          <div className="h-6 w-px bg-ivory-border" />
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-graphite/50 font-mono">Approved</p>
            <p className="text-lg font-bold text-sage-dark">
              {roleFilteredClaims.filter(c => c.status === 'Approved').length}
            </p>
          </div>
        </div>
      </div>

      {/* 9 Category Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs font-medium">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
            selectedCategory === 'All' 
              ? 'bg-aubergine text-ivory font-bold shadow-soft-xs' 
              : 'bg-white text-graphite/70 hover:bg-ivory border border-ivory-border'
          }`}
        >
          All Categories ({roleFilteredClaims.length})
        </button>

        {ALL_CATEGORIES.map((cat) => {
          const count = roleFilteredClaims.filter(c => c.type === cat).length;
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                isSelected 
                  ? 'bg-aubergine text-ivory font-bold shadow-soft-xs' 
                  : 'bg-white text-graphite/70 hover:bg-ivory border border-ivory-border'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Chips */}
        <div className="flex items-center space-x-1.5 bg-ivory p-1.5 rounded-2xl border border-ivory-border text-xs font-medium overflow-x-auto">
          {ALL_STATUSES.map((stat) => (
            <button
              key={stat}
              onClick={() => setSelectedStatus(stat)}
              className={`px-2.5 py-1 rounded-xl whitespace-nowrap transition ${
                selectedStatus === stat 
                  ? 'bg-aubergine text-ivory font-bold shadow-soft-xs' 
                  : 'text-graphite/60 hover:text-aubergine'
              }`}
            >
              {stat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-graphite/40 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search claim, quote, source..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white text-graphite border border-ivory-border rounded-xl text-xs font-medium focus:ring-2 focus:ring-sage focus:outline-none"
          />
        </div>
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-ivory-border p-12 text-center space-y-2">
            <BookMarked className="w-8 h-8 text-graphite/30 mx-auto" />
            <p className="text-sm font-bold text-graphite">No knowledge claims match your filter criteria.</p>
            <p className="text-xs text-graphite/50">Try selecting another category or clearing your search query.</p>
          </div>
        ) : (
          filtered.map((claim) => (
            <div 
              key={claim.id}
              className="bg-white rounded-3xl border border-ivory-border p-5 shadow-soft-xs hover:shadow-soft-sm hover:border-lavender transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-lavender/25 text-aubergine font-bold">
                      {claim.type}
                    </span>
                    {getStatusBadge(claim.status)}
                    <span className="text-[10px] font-mono text-graphite/50">
                      ID: {claim.id}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-aubergine">
                    {claim.title}
                  </h3>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  {canApprove && claim.status !== 'Approved' && (
                    <button
                      onClick={() => approveClaim(claim.id)}
                      className="px-3 py-1.5 bg-sage hover:bg-sage-dark text-aubergine rounded-xl text-xs font-bold flex items-center space-x-1 shadow-soft-xs transition"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedClaim(claim)}
                    className="px-3 py-1.5 bg-ivory hover:bg-white text-aubergine border border-ivory-border rounded-xl text-xs font-bold flex items-center space-x-1 shadow-soft-xs transition"
                  >
                    <span>Inspect Evidence</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-sage" />
                  </button>
                </div>
              </div>

              {/* Claim Description Text */}
              <p className="text-xs text-graphite/80 leading-relaxed">
                {claim.text}
              </p>

              {/* Verbatim Quote Box */}
              {claim.quote && (
                <div className="p-3.5 bg-ivory rounded-2xl border-l-4 border-sage border-y border-r border-ivory-border space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-graphite/60">
                    <span className="font-bold flex items-center space-x-1">
                      <FileText className="w-3 h-3 text-sage" />
                      <span>Verbatim Source Quotation:</span>
                    </span>
                    <span className="text-sage-dark font-semibold truncate max-w-xs">{claim.source_name}</span>
                  </div>
                  <blockquote className="text-xs italic text-graphite/90 font-serif leading-relaxed">
                    "{claim.quote}"
                  </blockquote>
                </div>
              )}

              {/* Metadata footer */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-graphite/50 border-t border-ivory-border font-mono">
                <div className="flex items-center space-x-4">
                  {claim.assigned_owner && (
                    <span className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-graphite/40" />
                      <span>Owner: <strong className="text-graphite">{claim.assigned_owner}</strong></span>
                    </span>
                  )}
                  {claim.verified_by && (
                    <span className="flex items-center space-x-1 text-sage-dark">
                      <ShieldCheck className="w-3.5 h-3.5 text-sage" />
                      <span>Verified By: {claim.verified_by}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <span>Confidence: {(claim.confidence * 100).toFixed(0)}%</span>
                  {claim.uncertainty_flag && (
                    <span className="text-rose-dust font-bold flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Uncertainty Flagged</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
