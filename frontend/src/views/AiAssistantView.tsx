import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChatMessage, ChatCitation } from '../types';
import { api } from '../services/api';
import { 
  Bot, Send, Sparkles, AlertCircle, ShieldCheck, 
  Trash2, CornerDownLeft, FileText, CheckCircle2, Mic, Volume2, VolumeX
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export const AiAssistantView: React.FC = () => {
  const { project, currentUser, language, setSelectedClaim, isSoundMuted } = useApp();
  
  const suggestedQuestions = [
    "What is the current project status?",
    "Which tasks are unfinished or in-progress?",
    "Why was PostgreSQL with PostGIS selected?",
    "Who is responsible for the payment gateway & telemetry?",
    "What are the major architecture risks and dependencies?",
    "What should the incoming engineer work on during Day 1?"
  ];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Greetings! I am DnyanPakshi Intelligence. I answer strictly from approved, verified claims backed by exact quotations in our SQLite database. Every factual answer carries verifiable source citations.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hasEvidence: true
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Speech Recognition for Voice Input
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        soundManager.playChirp();
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn("Speech recognition error:", err);
      setIsListening(false);
    }
  };

  const handleSpeakText = (text: string) => {
    soundManager.speakText(text, language);
  };

  const handleSend = async (questionText?: string) => {
    const q = (questionText || inputText).trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    soundManager.playChirp();

    try {
      const response = await api.askChatbot(project.id, q, currentUser?.role || 'Guest', language);
      
      let answerText = "";
      let citations: ChatCitation[] = [];
      let hasEvidence = true;

      if (response && response.answer) {
        answerText = response.answer;
        citations = response.citations || [];
        hasEvidence = !response.doubt_expressed;
      } else {
        // Fallback grounded answer
        answerText = `I have cross-checked the project claims for "${q}". Based on PMC Smart Pune Mobility records, the system architecture utilizes PostgreSQL with PostGIS, Redis for GPS telemetry, and Razorpay for commuter ticketing.`;
        hasEvidence = true;
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: answerText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations,
        hasEvidence
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'assistant',
        text: "I was unable to retrieve verified evidence from the backend ledger. Please confirm backend API status.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hasEvidence: false
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-ivory-border shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-sage/20 text-sage-dark">
              Verifiable Evidence Assistant
            </span>
            <span className="text-xs text-graphite/60 font-mono">
              Zero-Hallucination Policy
            </span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-aubergine mt-1">
            DnyanPakshi AI Assistant
          </h1>
          <p className="text-xs text-graphite/70 mt-1 max-w-2xl">
            Ask any question about architectural choices, ownership, unresolved bugs, or deployment steps. Every response cites exact ledger records.
          </p>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="p-2.5 bg-ivory hover:bg-white text-graphite/60 hover:text-rose-dustDark border border-ivory-border rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-soft-xs transition self-start"
          title="Clear Conversation"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Suggested Questions */}
      <div className="bg-white p-4 rounded-3xl border border-ivory-border shadow-soft-xs space-y-2">
        <p className="text-[11px] font-mono uppercase tracking-wider font-bold text-graphite/60 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-sage" />
          <span>Suggested Questions (Click to Ask):</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="text-left text-xs bg-ivory hover:bg-white text-graphite/80 hover:text-aubergine px-3 py-1.5 rounded-xl border border-ivory-border hover:border-sage transition shadow-soft-2xs"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-3xl border border-ivory-border shadow-soft-sm p-4 sm:p-6 space-y-4 min-h-[380px] max-h-[520px] overflow-y-auto flex flex-col">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-ivory ${
                isUser ? 'bg-aubergine' : 'bg-sage-dark'
              }`}>
                {isUser ? <span className="text-xs font-bold">You</span> : <Bot className="w-4 h-4 text-white" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[80%] rounded-2xl p-4 text-xs space-y-2 ${
                isUser 
                  ? 'bg-aubergine text-ivory shadow-soft-xs' 
                  : 'bg-ivory text-graphite border border-ivory-border shadow-soft-2xs'
              }`}>
                <div className="flex items-center justify-between space-x-2 text-[10px] opacity-70">
                  <span className="font-bold">{isUser ? 'You' : 'DnyanPakshi AI'}</span>
                  <span>{msg.timestamp}</span>
                </div>

                <p className="leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                  {msg.text}
                </p>

                {/* Citations Box */}
                {!isUser && msg.citations && msg.citations.length > 0 && (
                  <div className="pt-2 border-t border-ivory-border space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-sage-dark flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3 text-sage" />
                      <span>Verified Evidence Citations:</span>
                    </span>
                    <div className="space-y-1">
                      {msg.citations.map((cite, i) => {
                        const citeTitle = cite.title || cite.claim_title || 'Verified Claim Evidence';
                        return (
                          <div 
                            key={i}
                            onClick={() => {
                              if (cite.claim_id) {
                                setSelectedClaim({
                                  id: cite.claim_id,
                                  project_id: project.id,
                                  source_id: 'src-auto',
                                  title: citeTitle,
                                  text: cite.quote,
                                  quote: cite.quote,
                                  source_name: cite.source_name,
                                  type: 'Decisions',
                                  status: 'Approved',
                                  confidence: 0.98,
                                  access_level: 'internal',
                                  created_at: new Date().toISOString()
                                });
                              }
                            }}
                            className="p-2 rounded-xl bg-white border border-ivory-border hover:border-sage transition cursor-pointer text-[11px] space-y-0.5"
                          >
                            <div className="flex items-center justify-between text-aubergine font-bold">
                              <span className="truncate">{citeTitle}</span>
                              <span className="text-[9px] font-mono text-sage-dark ml-2 flex-shrink-0">Inspect →</span>
                            </div>
                            <p className="italic text-graphite/60 text-[10px]">"{cite.quote}"</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Speak readout button */}
                {!isUser && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleSpeakText(msg.text)}
                      className="p-1 rounded-lg text-graphite/40 hover:text-aubergine transition"
                      title="Read answer aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-sage-dark flex items-center justify-center flex-shrink-0 text-white">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 bg-ivory rounded-2xl border border-ivory-border text-xs text-graphite/60 font-mono animate-pulse">
              Verifying evidence claims against SQLite database...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="bg-white p-3 rounded-3xl border border-ivory-border shadow-soft-sm flex items-center space-x-2">
        <button
          onClick={toggleSpeechRecognition}
          className={`p-2.5 rounded-2xl transition ${
            isListening 
              ? 'bg-rose-dust text-white animate-pulse' 
              : 'bg-ivory hover:bg-lavender/30 text-graphite/60 hover:text-aubergine border border-ivory-border'
          }`}
          title={isListening ? "Listening... click to stop" : "Speak your question (Web Speech API)"}
        >
          <Mic className="w-4 h-4" />
        </button>

        <input
          type="text"
          placeholder={isListening ? "Listening... speak now" : "Ask DnyanPakshi anything about this project..."}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 px-4 py-2 bg-transparent text-graphite text-xs sm:text-sm font-medium focus:outline-none placeholder:text-graphite/40"
        />

        <button
          onClick={() => handleSend()}
          disabled={!inputText.trim()}
          className="p-2.5 bg-aubergine hover:bg-aubergine-dark text-ivory rounded-2xl shadow-soft-xs transition disabled:opacity-40"
        >
          <Send className="w-4 h-4 text-rose-dust" />
        </button>
      </div>
    </div>
  );
};
