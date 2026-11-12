import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Source } from '../types';
import { 
  FileText, UploadCloud, GitBranch, Lock, Globe, 
  ShieldCheck, Eye, CheckCircle2, AlertCircle, Sparkles, Plus, X, Search
} from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const { sources, setViewingSource, uploadDocument, currentUser } = useApp();
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [docName, setDocName] = useState<string>('');
  const [docType, setDocType] = useState<string>('markdown');
  const [docContent, setDocContent] = useState<string>('');
  const [accessLevel, setAccessLevel] = useState<string>('internal');
  const [activeTab, setActiveTab] = useState<'all' | 'markdown' | 'txt' | 'github'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const isIncoming = currentUser?.role === 'Incoming Member';

  const filteredSources = sources.filter(s => {
    // Permission check: Incoming cannot see confidential sources
    if (isIncoming && s.access_level === 'confidential') return false;
    if (activeTab !== 'all' && s.type !== activeTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return s.name.toLowerCase().includes(q) || (s.content && s.content.toLowerCase().includes(q));
    }
    return true;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocName(file.name);
    const ext = file.name.split('.').pop()?.toLowerCase() || 'txt';
    setDocType(ext);

    const reader = new FileReader();
    reader.onload = (event) => {
      setDocContent(event.target?.result as string || '');
      setShowUploadModal(true);
    };
    reader.readAsText(file);
  };

  const handleSaveDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim() || !docContent.trim()) return;
    await uploadDocument(docName.trim(), docType, docContent.trim(), accessLevel);
    setShowUploadModal(false);
    setDocName('');
    setDocContent('');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-ivory-border shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-sage/20 text-sage-dark">
              Ingestion & Verification Pipeline
            </span>
            <span className="text-xs text-graphite/60 font-mono">
              Verbatim Evidence Foundation
            </span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-aubergine mt-1">
            Project Documents & Evidence Sources
          </h1>
          <p className="text-xs text-graphite/70 mt-1 max-w-2xl">
            Ingest architecture specifications, sprint retrospectives, Git pull requests, and API contracts. Automatic secret redaction and semantic chunk indexing enabled.
          </p>
        </div>

        {/* Upload Buttons */}
        <div className="flex items-center space-x-3">
          <label className="cursor-pointer px-4 py-2.5 bg-aubergine hover:bg-aubergine-dark text-ivory rounded-xl text-xs font-bold flex items-center space-x-2 shadow-soft-sm transition">
            <UploadCloud className="w-4 h-4 text-rose-dust" />
            <span>Upload Document</span>
            <input type="file" accept=".txt,.md,.markdown,.csv,.json" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Type Tabs */}
        <div className="flex items-center space-x-1.5 bg-ivory p-1.5 rounded-2xl border border-ivory-border text-xs font-semibold">
          {[
            { id: 'all', label: 'All Formats' },
            { id: 'markdown', label: 'Markdown (.md)' },
            { id: 'txt', label: 'Plain Text (.txt)' },
            { id: 'github', label: 'GitHub PRs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl transition ${
                activeTab === tab.id 
                  ? 'bg-aubergine text-ivory shadow-soft-xs font-bold' 
                  : 'text-graphite/60 hover:text-aubergine'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-graphite/40 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white text-graphite border border-ivory-border rounded-xl text-xs font-medium focus:ring-2 focus:ring-sage focus:outline-none"
          />
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSources.map((source) => (
          <div
            key={source.id}
            className="bg-white rounded-3xl border border-ivory-border p-5 shadow-soft-xs hover:shadow-soft-sm hover:border-lavender transition space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-xl bg-ivory border border-ivory-border text-aubergine">
                  {source.type === 'github' ? <GitBranch className="w-5 h-5 text-rose-dust" /> : <FileText className="w-5 h-5 text-sage" />}
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                    source.access_level === 'confidential' ? 'bg-rose-dust/20 text-rose-dustDark' : 'bg-sage/20 text-sage-dark'
                  }`}>
                    {source.access_level}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm text-aubergine truncate" title={source.name}>
                  {source.name}
                </h3>
                <p className="text-[11px] text-graphite/50 font-mono mt-0.5">
                  {source.chunks_count || 4} chunks indexed • {Math.round((source.size_bytes || 2400) / 1024 * 10) / 10} KB
                </p>
              </div>

              <div className="p-3 rounded-xl bg-ivory/60 border border-ivory-border text-xs text-graphite/70 line-clamp-3 font-mono text-[11px]">
                {source.content ? source.content.slice(0, 150) + "..." : "No preview text available."}
              </div>
            </div>

            <div className="pt-3 border-t border-ivory-border flex items-center justify-between text-xs">
              <span className="text-[10px] text-graphite/50 font-mono">
                By: {source.uploaded_by || 'Siddhi Nanaware'}
              </span>
              <button
                onClick={() => setViewingSource(source)}
                className="px-3 py-1.5 bg-ivory hover:bg-white text-aubergine border border-ivory-border rounded-xl text-xs font-bold flex items-center space-x-1 shadow-soft-xs transition"
              >
                <Eye className="w-3.5 h-3.5 text-sage" />
                <span>Inspect Chunks</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-aubergine/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-soft-lg border border-ivory-border space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-ivory-border pb-3">
              <div className="flex items-center space-x-2">
                <UploadCloud className="w-5 h-5 text-rose-dust" />
                <h3 className="font-bold text-sm text-aubergine">Document Ingestion Pipeline</h3>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="text-graphite/40 hover:text-graphite">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDoc} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-graphite block mb-1">Document Title / File Name</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. Swargate_Corridor_Spec.md"
                  className="w-full px-3 py-2 bg-ivory text-graphite border border-ivory-border rounded-xl text-xs font-medium focus:ring-2 focus:ring-sage"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-graphite block mb-1">Format Type</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full px-3 py-2 bg-ivory text-graphite border border-ivory-border rounded-xl text-xs font-medium focus:ring-2 focus:ring-sage"
                  >
                    <option value="markdown">Markdown (.md)</option>
                    <option value="txt">Plain Text (.txt)</option>
                    <option value="github">GitHub PR/Issue</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-graphite block mb-1">Access Level (RBAC)</label>
                  <select
                    value={accessLevel}
                    onChange={(e) => setAccessLevel(e.target.value)}
                    className="w-full px-3 py-2 bg-ivory text-graphite border border-ivory-border rounded-xl text-xs font-medium focus:ring-2 focus:ring-sage"
                  >
                    <option value="internal">Internal (All Team)</option>
                    <option value="confidential">Confidential (Owner/Reviewer)</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-graphite">Content Payload</label>
                  <span className="text-[10px] font-mono text-sage-dark font-bold flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-sage" />
                    <span>Auto-Redacting API Tokens</span>
                  </span>
                </div>
                <textarea
                  rows={6}
                  required
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  placeholder="Paste or review raw markdown / text content..."
                  className="w-full px-3 py-2 bg-ivory text-graphite border border-ivory-border rounded-xl text-xs font-mono focus:ring-2 focus:ring-sage"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-ivory-border">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3.5 py-2 text-xs font-bold text-graphite/70 hover:bg-ivory rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-aubergine hover:bg-aubergine-dark text-ivory rounded-xl shadow-soft-sm transition"
                >
                  Confirm Ingestion & Index Chunks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
