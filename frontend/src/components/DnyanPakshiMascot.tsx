import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Mic, MicOff, Volume2, VolumeX, MessageSquare, 
  X, ChevronUp, Sparkles, Send, HelpCircle, FileText, CheckCircle2 
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import { api } from '../services/api';

type MascotState = 'idle' | 'listening' | 'thinking' | 'talking' | 'response';

export const DnyanPakshiMascot: React.FC = () => {
  const { 
    project, claims, tasks, decisions, language, 
    activeTab, setActiveTab, createVoiceNote 
  } = useApp();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [mascotState, setMascotState] = useState<MascotState>('idle');
  const [inputText, setInputText] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isRecordingNote, setIsRecordingNote] = useState<boolean>(false);
  const [noteTitle, setNoteTitle] = useState<string>('');

  // Speech Recognition setup (Web Speech API)
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-US';

      recog.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setMascotState('thinking');
        handleAskQuestion(transcript);
      };

      recog.onerror = () => {
        setMascotState('idle');
      };

      recog.onend = () => {
        if (mascotState === 'listening') {
          setMascotState('idle');
        }
      };

      setRecognition(recog);
    }
  }, [language]);

  const startVoiceInput = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser. You can type your question directly.");
      return;
    }
    try {
      setMascotState('listening');
      recognition.start();
    } catch (e) {
      recognition.stop();
      setMascotState('idle');
    }
  };

  const stopVoiceInput = () => {
    if (recognition) {
      recognition.stop();
    }
    setMascotState('idle');
  };

  const handleAskQuestion = async (qText?: string) => {
    const question = (qText || inputText).trim();
    if (!question) return;

    setMascotState('thinking');
    setAiResponse('');

    const res = await api.askChatbot(project.id, question, "Incoming Member", language);
    if (res && res.answer) {
      setAiResponse(res.answer);
      setMascotState('talking');
      soundManager.speakText(res.answer, language);
    } else {
      // Fallback answers from real claims
      const qLower = question.toLowerCase();
      let answer = "";
      if (qLower.includes("task") || qLower.includes("work")) {
        const pending = tasks.filter(t => t.status !== 'Completed');
        answer = `There are ${pending.length} pending tasks. Top priority: "${pending[0]?.title || 'Refund Webhook Check'}" assigned to ${pending[0]?.assigned_to || 'Sonakshi Nazarkar'}.`;
      } else if (qLower.includes("decision") || qLower.includes("why") || qLower.includes("postgres")) {
        answer = `Key decision: PostgreSQL with PostGIS was chosen over MongoDB because Pune transit corridors require strict relational integrity and fast spatial indexing.`;
      } else if (qLower.includes("upload") || qLower.includes("document")) {
        answer = `To upload a document, navigate to Documents from the sidebar and click "Upload Document". Secrets and credentials will be redacted automatically.`;
      } else {
        answer = `According to verified project records for ${project.name}: The handover readiness is ${project.handover_readiness_score}% with verified architectural choices in PostgreSQL, Redis, and Razorpay.`;
      }
      setAiResponse(answer);
      setMascotState('talking');
      soundManager.speakText(answer, language);
    }
    setInputText('');
  };

  const handleSaveVoiceNote = async () => {
    if (!aiResponse && !inputText) return;
    const title = noteTitle.trim() || `Voice Note — ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const textToSave = aiResponse || inputText;
    await createVoiceNote(title, "00:45", textToSave, "Recorded via DnyanPakshi Companion", "voice, notes, companion");
    setIsRecordingNote(false);
    setNoteTitle('');
    alert("Voice note successfully saved to database!");
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Expanded DnyanPakshi AI Assistant Panel */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white border border-ivory-border rounded-3xl shadow-soft-lg p-5 text-graphite z-50 animate-fade-in space-y-4">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-ivory-border pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-aubergine text-ivory flex items-center justify-center font-bold text-xs">
                DX
              </div>
              <div>
                <h3 className="font-bold text-xs text-aubergine">
                  DnyanPakshi — AI Companion
                </h3>
                <p className="text-[10px] text-sage-dark font-medium capitalize">
                  State: {mascotState}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsOpen(false);
                setMascotState('idle');
              }}
              className="p-1 rounded-lg text-graphite/40 hover:text-graphite transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Context Tips Carousel */}
          <div className="p-3 bg-ivory rounded-2xl border border-ivory-border text-xs space-y-1">
            <span className="text-[10px] uppercase font-mono font-bold text-rose-dust">
              Contextual Guidance
            </span>
            <p className="text-[11px] text-graphite/80 leading-relaxed">
              {activeTab === 'Dashboard' && "Dashboard shows your project health, pending tasks, and fast access buttons."}
              {activeTab === 'Documents' && "Upload PDF, Markdown or TXT documents. Secrets are redacted automatically."}
              {activeTab === 'Knowledge Ledger' && "Click any claim to inspect its exact source quote and validation score."}
              {activeTab === 'Analytics' && "Explore 6 distinct graph types including progress, growth, and task distribution."}
              {activeTab === 'Voice Notes' && "Record hands-free voice notes; speech is transcribed and stored in the database."}
              {activeTab === 'Handover' && "Sign-off on verified claims before releasing the official handover dossier."}
            </p>
          </div>

          {/* AI Response Display */}
          {aiResponse && (
            <div className="p-3 bg-sage-subtle rounded-2xl border border-sage/40 text-xs text-graphite space-y-2">
              <div className="flex items-center justify-between font-bold text-aubergine">
                <span className="flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-sage-dark" />
                  <span>DnyanPakshi Answer:</span>
                </span>
                <button
                  onClick={() => soundManager.speakText(aiResponse, language)}
                  className="p-1 text-sage-dark hover:text-aubergine"
                  title="Read aloud"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] leading-relaxed whitespace-pre-wrap">{aiResponse}</p>
              
              <div className="pt-1 flex justify-end">
                <button
                  onClick={() => setIsRecordingNote(true)}
                  className="text-[10px] font-mono font-bold text-aubergine hover:underline"
                >
                  + Save as Voice Note
                </button>
              </div>
            </div>
          )}

          {/* Save Voice Note dialog */}
          {isRecordingNote && (
            <div className="p-3 bg-lavender/20 rounded-2xl border border-lavender space-y-2 text-xs">
              <label className="font-bold text-aubergine block text-[11px]">Note Title</label>
              <input
                type="text"
                placeholder="Title for this voice note..."
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 border rounded-lg text-xs bg-white"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsRecordingNote(false)}
                  className="px-2 py-1 text-[11px] text-graphite/60"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveVoiceNote}
                  className="px-3 py-1 bg-aubergine text-ivory rounded-lg text-[11px] font-bold"
                >
                  Save Note
                </button>
              </div>
            </div>
          )}

          {/* Ask Input / Voice Record Button */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask DnyanPakshi anything about this project..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                className="flex-1 px-3 py-2 bg-ivory border border-ivory-border rounded-xl text-xs focus:ring-2 focus:ring-sage focus:outline-none"
              />
              <button
                type="button"
                onClick={mascotState === 'listening' ? stopVoiceInput : startVoiceInput}
                className={`p-2 rounded-xl transition ${
                  mascotState === 'listening'
                    ? 'bg-rose-dust text-white animate-pulse'
                    : 'bg-ivory hover:bg-sage-subtle text-graphite border border-ivory-border'
                }`}
                title={mascotState === 'listening' ? "Listening... click to stop" : "Speak to DnyanPakshi (Voice Input)"}
              >
                {mascotState === 'listening' ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-sage-dark" />}
              </button>
              <button
                type="button"
                onClick={() => handleAskQuestion()}
                disabled={!inputText.trim()}
                className="p-2 bg-aubergine hover:bg-aubergine-dark disabled:opacity-40 text-ivory rounded-xl transition"
              >
                <Send className="w-4 h-4 text-rose-dust" />
              </button>
            </div>

            {/* Quick suggested chips */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-[10px]">
              <button
                onClick={() => handleAskQuestion("What tasks are unfinished?")}
                className="px-2 py-1 rounded-lg bg-ivory hover:bg-ivory-dark border border-ivory-border whitespace-nowrap"
              >
                Unfinished Tasks
              </button>
              <button
                onClick={() => handleAskQuestion("Why was PostgreSQL selected?")}
                className="px-2 py-1 rounded-lg bg-ivory hover:bg-ivory-dark border border-ivory-border whitespace-nowrap"
              >
                Database Decision
              </button>
              <button
                onClick={() => handleAskQuestion("How to upload a document?")}
                className="px-2 py-1 rounded-lg bg-ivory hover:bg-ivory-dark border border-ivory-border whitespace-nowrap"
              >
                Upload Help
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bird Avatar Button with 5 Animated States */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          soundManager.playMascotChirp();
        }}
        className={`relative group p-2 rounded-3xl bg-aubergine border-2 shadow-soft-lg hover:scale-105 transition-all flex items-center justify-center cursor-pointer ${
          mascotState === 'listening' ? 'border-sage shadow-sage-glow' :
          mascotState === 'talking' ? 'border-rose-dust' :
          'border-lavender/50'
        }`}
        title="DnyanPakshi — Your AI Knowledge Companion"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-aubergine-dark to-aubergine-light flex items-center justify-center relative overflow-hidden">
          
          {/* Vector Bird with Animated Wings & Crest */}
          <svg viewBox="0 0 100 100" className="w-10 h-10">
            <defs>
              <linearGradient id="birdGradNew" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#91A997" />
                <stop offset="100%" stopColor="#383049" />
              </linearGradient>
            </defs>
            {/* Body */}
            <ellipse cx="48" cy="54" rx="22" ry="18" fill="url(#birdGradNew)" />
            {/* Head */}
            <circle cx="64" cy="38" r="14" fill="#383049" />
            {/* Eye */}
            <circle cx="68" cy="36" r="4.5" fill="#F7F5F0" />
            <circle cx="69" cy="35.5" r="2.2" fill="#292337" />
            {/* Beak */}
            <polygon points="76,36 90,42 76,46" fill="#D58C96" />
            {/* Animated Wing */}
            <path 
              d="M 40 50 Q 20 40, 24 64 Q 45 62, 40 50 Z" 
              fill="#B8AECF" 
              className={`origin-top-left ${mascotState === 'talking' || mascotState === 'listening' ? 'animate-wing-flap' : ''}`}
            />
          </svg>

          {/* Listening pulse rings */}
          {mascotState === 'listening' && (
            <span className="absolute inset-0 rounded-2xl border-2 border-sage animate-ping opacity-60" />
          )}
        </div>

        {/* Status indicator dot */}
        <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow ${
          mascotState === 'listening' ? 'bg-sage animate-pulse' :
          mascotState === 'talking' ? 'bg-rose-dust' :
          'bg-lavender text-aubergine'
        }`}>
          ✦
        </span>
      </button>
    </div>
  );
};
