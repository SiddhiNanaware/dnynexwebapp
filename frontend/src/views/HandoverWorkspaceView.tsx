import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Share2, ShieldCheck, Download, CheckCircle, 
  Award, FileText, AlertTriangle, Send, Sparkles, Printer, UserCheck, CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';

export const HandoverWorkspaceView: React.FC = () => {
  const { 
    project, currentUser, claims, conflicts, handovers, 
    publishHandover, acknowledgeHandover, acknowledgements 
  } = useApp();

  const [summaryInput, setSummaryInput] = useState<string>(
    "Complete verified knowledge transfer approved by project review board. Covers PostgreSQL routing architecture, MSRTC telemetry credentials, and active refund webhook checks."
  );
  const [ackNotes, setAckNotes] = useState<string>('');
  const [publishError, setPublishError] = useState<string | null>(null);

  const latestHandover = handovers[0] || {
    id: "hnd-v1",
    version: 1,
    title: "Official Handover Release v1.0 — Smart Pune Mobility",
    status: "Published",
    published_by: "Mhd Zahur Rizvi (Reviewer)",
    created_at: "2026-11-10T16:00:00Z",
    summary: "Production handover release approved by project owner Siddhi Nanaware. All critical Swargate BRTS telemetry and Razorpay ticketing claims verified against source specs."
  };

  const unresolvedConflicts = conflicts.filter(c => c.status === 'unresolved');
  const approvedClaims = claims.filter(c => c.status === 'Approved');

  const isReviewerOrOwner = currentUser?.role === 'Reviewer / Team Leader' || currentUser?.role === 'Project Owner';
  const isIncoming = currentUser?.role === 'Incoming Member';
  const hasAcknowledged = acknowledgements.some(a => a.handover_id === latestHandover?.id);

  const handlePublish = async () => {
    try {
      setPublishError(null);
      await publishHandover(summaryInput, [
        "Day 1: Setup local Docker with PostGIS extensions & verify database migrations",
        "Day 2: Pair with departing lead on Razorpay refund webhook signature validation",
        "Day 3: Review MSRTC telemetry contract renewal terms with Project Owner Siddhi Nanaware",
        "Day 4: Implement Redis queue retry buffer for Shivajinagar Wi-Fi dropouts",
        "Day 5: Verify staging corridor feeds and submit handover receipt acknowledgement"
      ]);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      soundManager.playChirp();
    } catch (e: any) {
      setPublishError(e.message || "Failed to publish handover");
    }
  };

  const handleAcknowledge = async () => {
    if (!latestHandover) return;
    await acknowledgeHandover(latestHandover.id, ackNotes || "Confirmed receipt and review of handover dossier.");
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });
    setAckNotes('');
    soundManager.playChirp();
  };

  const handleExportPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-ivory-border shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-sage/20 text-sage-dark">
              Transfer Gate & Certification
            </span>
            <span className="text-xs font-mono text-graphite/60">
              Role: {currentUser?.role || 'Guest'}
            </span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-aubergine mt-1">
            Knowledge Handover Workspace
          </h1>
          <p className="text-xs text-graphite/70 mt-1 max-w-2xl">
            Human-approved transfer dossier generation. Verifies claim coverage, conflict arbitration, and incoming member digital sign-off.
          </p>
        </div>

        <button
          onClick={handleExportPrint}
          className="px-4 py-2.5 bg-ivory hover:bg-white text-aubergine border border-ivory-border rounded-xl text-xs font-bold flex items-center space-x-2 shadow-soft-xs transition self-start"
        >
          <Printer className="w-4 h-4 text-sage" />
          <span>Export Handover PDF</span>
        </button>
      </div>

      {/* Verification Gate Checklist Card */}
      <div className="bg-white p-6 rounded-3xl border border-ivory-border shadow-soft-sm space-y-4">
        <div className="flex items-center justify-between border-b border-ivory-border pb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-sage" />
            <h3 className="text-sm font-bold text-aubergine">
              Pre-Handover Verification Gate
            </h3>
          </div>
          <span className="text-xs font-mono text-sage-dark font-bold">
            Readiness Score: {project.handover_readiness_score || 85}%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-ivory rounded-2xl border border-ivory-border space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-aubergine">Approved Claims</span>
              <CheckCircle2 className="w-4 h-4 text-sage" />
            </div>
            <p className="text-graphite/60">{approvedClaims.length} verified items ready for transfer</p>
          </div>

          <div className="p-3.5 bg-ivory rounded-2xl border border-ivory-border space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-aubergine">Target Transferee</span>
              <CheckCircle2 className="w-4 h-4 text-sage" />
            </div>
            <p className="text-graphite/60">Sonakshi Nazarkar assigned as Incoming Lead</p>
          </div>

          <div className="p-3.5 bg-ivory rounded-2xl border border-ivory-border space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-aubergine">Discrepancy Status</span>
              {unresolvedConflicts.length === 0 ? (
                <CheckCircle2 className="w-4 h-4 text-sage" />
              ) : (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-dust/20 text-rose-dustDark font-bold">
                  {unresolvedConflicts.length} Warning
                </span>
              )}
            </div>
            <p className="text-graphite/60">
              {unresolvedConflicts.length === 0 
                ? "All conflicting statements reconciled" 
                : "1 launch date discrepancy pending reviewer waiver"}
            </p>
          </div>
        </div>

        {/* Publish Action for Reviewer / Owner */}
        {isReviewerOrOwner && (
          <div className="pt-3 border-t border-ivory-border space-y-3">
            <label className="text-xs font-bold text-graphite block">
              Handover Release Notes & Executive Summary:
            </label>
            <textarea
              rows={2}
              value={summaryInput}
              onChange={(e) => setSummaryInput(e.target.value)}
              className="w-full px-3.5 py-2 bg-ivory text-graphite border border-ivory-border rounded-xl text-xs font-medium focus:ring-2 focus:ring-sage"
            />
            {publishError && (
              <p className="text-xs text-rose-dust font-bold">{publishError}</p>
            )}
            <button
              onClick={handlePublish}
              className="px-5 py-2.5 bg-aubergine hover:bg-aubergine-dark text-ivory rounded-xl text-xs font-bold flex items-center space-x-2 shadow-soft-sm transition"
            >
              <Share2 className="w-4 h-4 text-rose-dust" />
              <span>Publish Official Handover Release</span>
            </button>
          </div>
        )}
      </div>

      {/* Active Handover Dossier Display */}
      {latestHandover && (
        <div className="bg-white p-6 rounded-3xl border border-ivory-border shadow-soft-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-ivory-border pb-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sage/20 text-sage-dark font-bold">
                  Release v{latestHandover.version || '1.0'}
                </span>
                <span className="text-xs font-mono text-graphite/50">
                  Published on {new Date(latestHandover.created_at || Date.now()).toLocaleDateString()}
                </span>
              </div>
              <h2 className="text-xl font-bold text-aubergine">
                {latestHandover.title || "Smart Pune Mobility Knowledge Transfer Dossier"}
              </h2>
            </div>
            <span className="text-xs font-mono bg-ivory px-3 py-1 rounded-xl text-graphite border border-ivory-border">
              Signatory: {latestHandover.published_by || "Mhd Zahur Rizvi"}
            </span>
          </div>

          <p className="text-xs text-graphite/80 leading-relaxed">
            {latestHandover.summary}
          </p>

          {/* Onboarding Runbook */}
          <div className="p-4 bg-ivory rounded-2xl border border-ivory-border space-y-3">
            <h4 className="text-xs font-bold text-aubergine uppercase tracking-wider font-mono flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-sage" />
              <span>Recommended 5-Day Onboarding Protocol:</span>
            </h4>
            <div className="space-y-2 text-xs">
              {[
                { day: 'Day 1', text: 'Setup local Docker with PostGIS extensions & verify database migrations' },
                { day: 'Day 2', text: 'Pair with departing lead Parineeta Meshram on Razorpay refund webhook signature validation' },
                { day: 'Day 3', text: 'Review MSRTC telemetry contract renewal terms with Project Owner Siddhi Nanaware' },
                { day: 'Day 4', text: 'Implement Redis queue retry buffer for Shivajinagar Wi-Fi dropouts' },
                { day: 'Day 5', text: 'Verify staging corridor feeds and submit handover receipt acknowledgement' }
              ].map((step, idx) => (
                <div key={idx} className="flex items-start space-x-2.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lavender/30 text-aubergine font-bold flex-shrink-0">
                    {step.day}
                  </span>
                  <span className="text-graphite/80">{step.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Incoming Member Acknowledgement Section */}
          <div className="pt-3 border-t border-ivory-border space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-aubergine flex items-center space-x-1.5">
                <UserCheck className="w-4 h-4 text-sage" />
                <span>Incoming Member Receipt Sign-Off</span>
              </h4>
              {hasAcknowledged && (
                <span className="text-xs font-mono text-sage-dark font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4 text-sage" />
                  <span>Acknowledged & Signed</span>
                </span>
              )}
            </div>

            {!hasAcknowledged ? (
              <div className="space-y-3">
                <p className="text-xs text-graphite/60">
                  By clicking acknowledge, the incoming team member (Sonakshi Nazarkar) confirms they have reviewed all architecture decisions, unfinished tasks, credentials, and risks.
                </p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Optional sign-off notes or questions..."
                    value={ackNotes}
                    onChange={(e) => setAckNotes(e.target.value)}
                    className="flex-1 px-3.5 py-2 bg-ivory text-graphite border border-ivory-border rounded-xl text-xs font-medium focus:ring-2 focus:ring-sage"
                  />
                  <button
                    onClick={handleAcknowledge}
                    className="px-4 py-2 bg-sage hover:bg-sage-dark text-aubergine font-bold rounded-xl text-xs shadow-soft-xs transition flex items-center space-x-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Acknowledge Handover Receipt</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-sage/15 rounded-xl border border-sage/30 text-xs text-sage-dark flex items-center justify-between">
                <span>Handover officially signed and accepted by Sonakshi Nazarkar. Knowledge transfer complete!</span>
                <span className="font-mono text-[10px]">Tamper-Proof Logged</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
