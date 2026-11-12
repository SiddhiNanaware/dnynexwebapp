import React from 'react';
import { useApp } from '../context/AppContext';
import { X, FileText, Lock, Globe, Shield, Download } from 'lucide-react';

export const SourceHighlightModal: React.FC = () => {
  const { viewingSource, setViewingSource, selectedClaim } = useApp();

  if (!viewingSource) return null;

  const quoteToHighlight = selectedClaim ? selectedClaim.quote : '';

  // Render text with highlighted quotation
  const renderHighlightedContent = () => {
    if (!quoteToHighlight || !viewingSource.content || !viewingSource.content.includes(quoteToHighlight)) {
      return (
        <pre className="font-mono text-xs whitespace-pre-wrap leading-relaxed text-graphite">
          {viewingSource.content || "Empty document"}
        </pre>
      );
    }

    const parts = viewingSource.content.split(quoteToHighlight);
    return (
      <div className="font-mono text-xs whitespace-pre-wrap leading-relaxed text-graphite">
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            {part}
            {i < parts.length - 1 && (
              <mark className="bg-sage/30 text-aubergine font-bold px-1.5 py-0.5 rounded border border-sage/50">
                {quoteToHighlight}
              </mark>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-aubergine/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-4xl bg-white border border-ivory-border rounded-3xl shadow-soft-lg flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-aubergine text-ivory flex items-center justify-between border-b border-aubergine-light">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-aubergine-dark rounded-xl text-rose-dust">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-md">{viewingSource.name}</h3>
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                  viewingSource.access_level === 'confidential' ? 'bg-rose-dust/30 text-rose-dust' : 'bg-sage/20 text-sage-dark'
                }`}>
                  {viewingSource.access_level}
                </span>
              </div>
              <p className="text-[11px] text-ivory/60 font-mono">
                Uploaded by {viewingSource.uploaded_by || 'Siddhi Nanaware'} • {new Date(viewingSource.uploaded_at || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => setViewingSource(null)}
            className="p-1.5 text-ivory/60 hover:text-white rounded-xl hover:bg-aubergine-light transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highlight notification bar */}
        {quoteToHighlight && (
          <div className="bg-sage/15 border-b border-sage/30 px-4 py-2 flex items-center justify-between text-xs text-sage-dark font-medium">
            <span>Highlighting claim evidence in source text:</span>
            <span className="font-mono text-[11px] truncate max-w-md italic">
              "{quoteToHighlight.slice(0, 70)}..."
            </span>
          </div>
        )}

        {/* Content viewer */}
        <div className="p-6 overflow-y-auto flex-1 bg-ivory/40">
          <div className="p-4 bg-white border border-ivory-border rounded-2xl shadow-soft-2xs overflow-x-auto">
            {renderHighlightedContent()}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-ivory-border flex items-center justify-between text-xs text-graphite/60">
          <span className="font-mono text-[11px]">Size: {viewingSource.size_bytes || 3200} bytes • Chunks: {viewingSource.chunks_count || 4}</span>
          <button
            onClick={() => setViewingSource(null)}
            className="px-4 py-1.5 bg-aubergine text-ivory rounded-xl font-bold hover:bg-aubergine-dark transition"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
