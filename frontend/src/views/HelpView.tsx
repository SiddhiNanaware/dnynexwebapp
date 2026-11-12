import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  HelpCircle, ChevronDown, ChevronUp, BookOpen, 
  ShieldCheck, Mic, Bell, Bot, Sparkles, FileText, 
  ArrowRight, CheckCircle2, MessageSquare
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const HelpView: React.FC = () => {
  const { setActiveTab } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const faqs: FAQItem[] = [
    {
      category: 'Product & Purpose',
      question: 'What core problem does DNYANEX solve for engineering teams?',
      answer: 'When a senior engineer or team member departs, up to 70% of undocumented contextual knowledge—architectural decisions, unresolved technical debts, vendor credentials, and edge case workarounds—is permanently lost. DNYANEX automates the extraction, verification, and human-in-the-loop sign-off of project knowledge so incoming engineers can onboard without repeatedly disturbing the departing member.'
    },
    {
      category: 'Truth & Verification',
      question: 'How does DNYANEX prevent AI hallucination in knowledge handovers?',
      answer: 'Unlike generic LLMs that synthesize plausible fiction, DNYANEX enforces an immutable Evidence Grounding contract: every claim in the Knowledge Ledger MUST be backed by a verbatim quote linked to an ingested source document (with file name and chunk index). If no document supports a query, DnyanPakshi AI explicitly expresses honest doubt rather than guessing.'
    },
    {
      category: 'AI Mascot & Notes',
      question: 'How does the DnyanPakshi AI Companion and Voice Notes feature work?',
      answer: 'DnyanPakshi (the Knowledge Messenger) is an interactive AI assistant featuring 5 visual states (idle, listening, thinking, talking, response). It supports Web Speech API speech-to-text recording, text-to-speech spoken readouts, and dedicated "DnyanPakshi Voice Notes" where engineers can verbally record handover briefings that are transcribed and saved directly into the SQLite database.'
    },
    {
      category: 'Audio & Alerts',
      question: 'What is the Notification Buzzer and how is it controlled?',
      answer: 'DNYANEX integrates a synthesized Web Audio API buzzer chime that alerts teams when urgent conflicts or unreviewed claims are detected. It operates strictly after user interaction (never autoplays loudly) and includes mute toggles and volume sliders in both the top navigation bar and Settings.'
    },
    {
      category: 'Security & Roles',
      question: 'What are the 4 Role-Based Access Control (RBAC) levels?',
      answer: '1. Project Owner (Siddhi Nanaware): Oversees project scope, edits member roles, creates projects. 2. Reviewer / Team Leader (Mhd Zahur Rizvi): Has human approval authority over claims, arbitrates conflicting statements, gates publishing. 3. Departing Member (Parineeta Meshram): Records voice notes, uploads architectural specs, marks tasks. 4. Incoming Member (Sonakshi Nazarkar): Reads approved dossiers, queries AI, and submits digital receipt acknowledgements.'
    },
    {
      category: 'Analytics & SPOF',
      question: 'How does the Single Point of Failure (SPOF) detector protect projects?',
      answer: 'The system computes the concentration of undocumented or critical subsystem tasks assigned to departing personnel. If a single departing engineer holds more than 40% of critical logic, the dashboard triggers high-risk continuity alerts and recommends immediate transfer target assignment.'
    }
  ];

  const filteredFaqs = faqs.filter(f => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q) || f.category.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-ivory-border shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-sage/20 text-sage-dark">
              Documentation & User Guide
            </span>
            <span className="text-xs text-graphite/60 font-mono">
              SIH 2026 Hackathon Companion
            </span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-aubergine mt-1">
            Help Centre & Knowledge Base
          </h1>
          <p className="text-xs text-graphite/70 mt-1 max-w-2xl">
            Step-by-step guidance on running evidence-backed handovers, verifying claims, recording voice notes, and setting up role permissions.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('AI Assistant')}
          className="px-4 py-2.5 bg-aubergine hover:bg-aubergine-dark text-ivory rounded-xl text-xs font-bold flex items-center space-x-2 shadow-soft-sm transition"
        >
          <Bot className="w-4 h-4 text-rose-dust" />
          <span>Ask DnyanPakshi Directly</span>
        </button>
      </div>

      {/* 5-Step Workflow Cards */}
      <div className="bg-white p-6 rounded-3xl border border-ivory-border shadow-soft-sm space-y-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-sage" />
          <h3 className="text-sm font-bold text-aubergine">
            How DNYANEX Works: 5-Stage Handover Protocol
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          {[
            { step: '01', title: 'Upload Sources', desc: 'Ingest PRs, specs, and retros with secret masking.', tab: 'Documents' },
            { step: '02', title: 'Extract Claims', desc: 'Break text into 9 categories backed by exact quotes.', tab: 'Knowledge Ledger' },
            { step: '03', title: 'Human Approval', desc: 'Reviewer verifies claims & resolves conflicting statements.', tab: 'Knowledge Ledger' },
            { step: '04', title: 'Record Voice Notes', desc: 'Departing lead records verbal nuances & tips.', tab: 'Voice Notes' },
            { step: '05', title: 'Digital Sign-Off', desc: 'Incoming engineer reviews dossier & acknowledges receipt.', tab: 'Handover' }
          ].map((s) => (
            <div 
              key={s.step}
              onClick={() => setActiveTab(s.tab)}
              className="p-3.5 bg-ivory rounded-2xl border border-ivory-border hover:border-lavender hover:bg-white transition cursor-pointer group space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-rose-dust">{s.step}</span>
                <ArrowRight className="w-3 h-3 text-graphite/30 group-hover:text-aubergine transition transform group-hover:translate-x-0.5" />
              </div>
              <p className="text-xs font-bold text-aubergine group-hover:text-rose-dustDark transition">{s.title}</p>
              <p className="text-[11px] text-graphite/60 leading-tight">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="bg-white p-6 rounded-3xl border border-ivory-border shadow-soft-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ivory-border pb-4">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-sage" />
            <h3 className="text-sm font-bold text-aubergine">
              Frequently Asked Questions (Hackathon Jury Guide)
            </h3>
          </div>

          <input
            type="text"
            placeholder="Search questions or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3.5 py-1.5 bg-ivory text-graphite border border-ivory-border rounded-xl text-xs font-medium focus:ring-2 focus:ring-sage w-full sm:w-64"
          />
        </div>

        <div className="space-y-3 pt-1">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={faq.question}
                className="rounded-2xl border border-ivory-border bg-ivory/40 overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between space-x-3 hover:bg-ivory/80 transition"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-lavender/30 text-aubergine font-bold">
                      {faq.category}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-aubergine">{faq.question}</span>
                  </div>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-graphite/60 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-graphite/60 flex-shrink-0" />}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-graphite/80 leading-relaxed border-t border-ivory-border/50 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
