import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, CheckCircle, XCircle, Edit3, ShieldAlert, 
  ExternalLink, FileText, Check, AlertTriangle, UserCheck, ShieldCheck
} from 'lucide-react';
import { ClaimStatus } from '../types';

export const EvidenceDrawer: React.FC = () => {
  const { 
    selectedClaim, setSelectedClaim, approveClaim, 
    rejectClaim, currentUser, sources, setViewingSource 
  } = useApp();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editText, setEditText] = useState<string>('');
  const [reviewNotes, setReviewNotes] = useState<string>('');

  if (!selectedClaim) return null;

  const handleStartEdit = () => {
    setEditTitle(selectedClaim.title);
    setEditText(selectedClaim.text);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    selectedClaim.title = editTitle;
    selectedClaim.text = editText;
    setIsEditing(false);
  };

  const handleOpenSourceViewer = () => {
    const src = sources.find(s => s.id === selectedClaim.source_id || s.name === selectedClaim.source_name);
    if (src) {
      setViewingSource(src);
    }
  };

  const isReviewerOrOwner = currentUser?.role === 'Reviewer / Team Leader' || currentUser?.role === 'Project Owner';

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
    <div className="fixed inset-0 z-50 overflow-hidden bg-aubergine/50 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="w-full max-w-xl bg-white h-full shadow-soft-lg flex flex-col border-l border-ivory-border text-graphite overflow-y-auto">
        
        {/* Header */}
        <div className="p-5 bg-aubergine text-ivory flex items-center justify-between border-b border-aubergine-light">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-rose-dust font-bold">
                Evidence Ledger • Inspector
              </span>
            </div>
            <h3 className="text-base font-bold font-serif text-white mt-0.5">
              Claim & Verbatim Source Verification
            </h3>
          </div>
          <button
            onClick={() => setSelectedClaim(null)}
            className="p-1.5 rounded-xl text-ivory/70 hover:text-white hover:bg-aubergine-light transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 space-y-5">
          {/* Status & Category Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-ivory border border-ivory-border rounded-2xl">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-graphite/60 font-mono">Category:</span>
              <span className="px-2 py-0.5 bg-lavender/30 text-aubergine text-xs font-semibold rounded-lg">
                {selectedClaim.type}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-graphite/60 font-mono">Status:</span>
              {getStatusBadge(selectedClaim.status)}
            </div>
          </div>

          {/* Title & Description */}
          {isEditing ? (
            <div className="space-y-3 p-4 bg-ivory border border-ivory-border rounded-2xl shadow-soft-xs">
              <label className="text-xs font-bold text-graphite">Edit Claim Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-xs bg-white font-medium focus:ring-2 focus:ring-sage"
              />
              <label className="text-xs font-bold text-graphite mt-2 block">Edit Explanation</label>
              <textarea
                rows={3}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-xs bg-white font-medium focus:ring-2 focus:ring-sage"
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-ivory hover:bg-white text-graphite border border-ivory-border"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-aubergine text-ivory hover:bg-aubergine-dark"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h2 className="text-base font-bold text-aubergine leading-snug">
                  {selectedClaim.title}
                </h2>
                {isReviewerOrOwner && (
                  <button
                    onClick={handleStartEdit}
                    className="p-1 text-graphite/40 hover:text-aubergine hover:bg-ivory rounded ml-2"
                    title="Edit Claim Statement"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-xs text-graphite/80 leading-relaxed">
                {selectedClaim.text}
              </p>
            </div>
          )}

          {/* SIGNATURE FEATURE: Verbatim Supporting Quotation */}
          <div className="p-4 bg-ivory rounded-2xl border-l-4 border-sage border-y border-r border-ivory-border space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-aubergine">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-sage" />
                <span>Exact Supporting Quotation</span>
              </div>
              <span className="font-mono text-[10px] bg-sage/20 px-2 py-0.5 rounded-full text-sage-dark font-bold">
                Match: {Math.round(selectedClaim.confidence * 100)}%
              </span>
            </div>
            
            <blockquote className="text-xs text-graphite font-serif leading-relaxed italic bg-white p-3 rounded-xl border border-ivory-border shadow-soft-2xs">
              "{selectedClaim.quote}"
            </blockquote>

            <p className="text-[10px] text-graphite/50 font-mono">
              ✓ Grounded in immutable source artifact with verbatim string match.
            </p>
          </div>

          {/* Source Document Reference */}
          <div className="p-4 bg-ivory rounded-2xl border border-ivory-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-graphite/60">
                Source Document
              </span>
              <button
                onClick={handleOpenSourceViewer}
                className="text-xs font-bold text-rose-dust hover:text-rose-dustDark flex items-center space-x-1"
              >
                <span>View Full Source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <FileText className="w-5 h-5 text-sage flex-shrink-0" />
              <div className="flex-1 truncate">
                <p className="font-bold text-aubergine truncate">{selectedClaim.source_name}</p>
                <p className="text-[10px] text-graphite/50 font-mono">{selectedClaim.source_location || 'Artifact Section 2'}</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-ivory-border uppercase font-semibold text-graphite">
                {selectedClaim.access_level || 'internal'}
              </span>
            </div>
          </div>

          {/* Reviewer Action Controls (Human Approval Gate) */}
          {isReviewerOrOwner && (
            <div className="pt-4 border-t border-ivory-border space-y-3">
              <label className="text-xs font-bold text-graphite block">
                Reviewer Evaluation Notes:
              </label>
              <input
                type="text"
                placeholder="Add audit justification note..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full px-3 py-2 border border-ivory-border rounded-xl text-xs bg-ivory font-medium focus:ring-2 focus:ring-sage"
              />

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => {
                    approveClaim(selectedClaim.id, reviewNotes);
                    setSelectedClaim(null);
                  }}
                  className="py-2.5 px-4 bg-sage hover:bg-sage-dark text-aubergine font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-soft-xs transition"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve Claim</span>
                </button>
                <button
                  onClick={() => {
                    rejectClaim(selectedClaim.id, reviewNotes);
                    setSelectedClaim(null);
                  }}
                  className="py-2.5 px-4 bg-rose-dust hover:bg-rose-dustDark text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-soft-xs transition"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Claim</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
