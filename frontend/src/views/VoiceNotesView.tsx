import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { VoiceNote } from '../types';
import { 
  Mic, MicOff, Search, Trash2, Edit3, Save, 
  Sparkles, Clock, Tag, Play, CheckCircle2, Plus, Volume2
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export const VoiceNotesView: React.FC = () => {
  const { voiceNotes, createVoiceNote, deleteVoiceNote, project, language } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [transcriptText, setTranscriptText] = useState<string>('');
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteTags, setNoteTags] = useState<string>('handoff, architecture');
  const [noteKeyTakeaways, setNoteKeyTakeaways] = useState<string>('');
  
  // Speech Recognition
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-US';

      recog.onresult = (event: any) => {
        let current = '';
        for (let i = 0; i < event.results.length; i++) {
          current += event.results[i][0].transcript + ' ';
        }
        setTranscriptText(current);
      };

      setRecognition(recog);
    }
  }, [language]);

  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = () => {
    if (!recognition) {
      alert("Microphone recognition is not enabled in this browser. You can type your transcript manually.");
      setIsRecording(true);
      return;
    }
    try {
      setTranscriptText('');
      recognition.start();
      setIsRecording(true);
    } catch (e) {
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsRecording(false);
  };

  const handleSaveNote = async () => {
    if (!transcriptText.trim()) return;
    const mins = Math.floor(recordingSeconds / 60);
    const secs = recordingSeconds % 60;
    const durationStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    await createVoiceNote(
      noteTitle.trim() || `Handoff Briefing (${new Date().toLocaleDateString()})`,
      durationStr === '00:00' ? '01:15' : durationStr,
      transcriptText.trim(),
      noteKeyTakeaways.trim() || "Captured during project handover session",
      noteTags.trim() || "handoff"
    );

    // Reset form
    setTranscriptText('');
    setNoteTitle('');
    setNoteKeyTakeaways('');
  };

  const filteredNotes = voiceNotes.filter(n => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return n.title.toLowerCase().includes(q) || 
           n.transcript.toLowerCase().includes(q) || 
           (n.tags && n.tags.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-ivory-border shadow-soft-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-lavender/25 text-aubergine">
              DnyanPakshi Voice System
            </span>
          </div>
          <h1 className="text-2xl font-bold font-devanagari text-aubergine mt-1">
            DnyanPakshi Notes (Interactive Voice Notes)
          </h1>
          <p className="text-xs text-graphite/60 mt-1">
            Record verbal handoff instructions, transcribe speech into text, and persist notes in the database.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-graphite/40 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search voice notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-ivory border border-ivory-border rounded-xl text-xs font-medium focus:ring-2 focus:ring-sage focus:outline-none"
          />
        </div>
      </div>

      {/* Voice Recorder Studio Card */}
      <div className="bg-white rounded-3xl border border-ivory-border p-6 shadow-soft-sm space-y-4">
        <div className="flex items-center justify-between border-b border-ivory-border pb-3">
          <div className="flex items-center space-x-2">
            <Mic className={`w-5 h-5 ${isRecording ? 'text-rose-dust animate-pulse' : 'text-sage-dark'}`} />
            <h3 className="font-bold text-sm text-aubergine">
              {isRecording ? "Listening to Voice Handoff..." : "Record New Voice Note"}
            </h3>
          </div>
          {isRecording && (
            <span className="font-mono text-xs font-bold text-rose-dust bg-rose-dust/10 px-2.5 py-1 rounded-full animate-pulse">
              {Math.floor(recordingSeconds / 60).toString().padStart(2, '0')}:{(recordingSeconds % 60).toString().padStart(2, '0')}
            </span>
          )}
        </div>

        {/* Input fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-graphite block mb-1">Note Title</label>
            <input
              type="text"
              placeholder="e.g. Telemetry Queue Handoff with Sonakshi"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              className="w-full px-3 py-2 bg-ivory border border-ivory-border rounded-xl text-xs font-medium focus:ring-2 focus:ring-sage focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-graphite block mb-1">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="telemetry, webhook, sprint24"
              value={noteTags}
              onChange={(e) => setNoteTags(e.target.value)}
              className="w-full px-3 py-2 bg-ivory border border-ivory-border rounded-xl text-xs font-medium focus:ring-2 focus:ring-sage focus:outline-none"
            />
          </div>
        </div>

        {/* Live Transcript Area */}
        <div className="space-y-1 text-xs">
          <label className="font-bold text-graphite block">
            Speech-to-Text Transcript (Editable)
          </label>
          <textarea
            rows={4}
            placeholder={isRecording ? "Speak into your microphone now..." : "Transcribed text will appear here. You can also type directly..."}
            value={transcriptText}
            onChange={(e) => setTranscriptText(e.target.value)}
            className="w-full p-3 bg-ivory border border-ivory-border rounded-xl text-xs font-mono leading-relaxed focus:ring-2 focus:ring-sage focus:outline-none"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center space-x-2">
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                className="px-4 py-2 bg-sage hover:bg-sage-dark text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-soft-sm transition"
              >
                <Mic className="w-4 h-4" />
                <span>Start Microphone</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="px-4 py-2 bg-rose-dust hover:bg-rose-dustDark text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-soft-sm transition animate-pulse"
              >
                <MicOff className="w-4 h-4" />
                <span>Stop Recording</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleSaveNote}
            disabled={!transcriptText.trim()}
            className="px-5 py-2 bg-aubergine hover:bg-aubergine-dark disabled:opacity-40 text-ivory rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-soft-sm transition"
          >
            <Save className="w-4 h-4 text-rose-dust" />
            <span>Save to Database</span>
          </button>
        </div>
      </div>

      {/* Saved Voice Notes History Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-graphite/60 font-mono">
            Saved Note History ({filteredNotes.length})
          </h3>
          <span className="text-[11px] font-mono text-graphite/40">Database Persisted</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="modern-card p-5 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sage/20 text-sage-dark">
                      {note.audio_duration}
                    </span>
                    <span className="text-[10px] text-graphite/40 font-mono">
                      {new Date(note.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => soundManager.speakText(note.transcript, language)}
                      className="p-1 text-sage-dark hover:text-aubergine"
                      title="Read Note Aloud"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteVoiceNote(note.id)}
                      className="p-1 text-graphite/40 hover:text-rose-dust"
                      title="Delete Note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-aubergine leading-snug">
                  {note.title}
                </h4>

                <p className="text-xs text-graphite/80 leading-relaxed font-mono bg-ivory/60 p-2.5 rounded-xl border border-ivory-border">
                  "{note.transcript}"
                </p>

                {note.notes && (
                  <p className="text-[11px] text-graphite/60 italic">
                    Key note: {note.notes}
                  </p>
                )}
              </div>

              {note.tags && (
                <div className="pt-2 border-t border-ivory-border flex items-center space-x-1.5 text-[10px] font-mono text-lavender-dark">
                  <Tag className="w-3 h-3 text-lavender-dark" />
                  <span>{note.tags}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
