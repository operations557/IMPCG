import React, { useState, useMemo, useEffect } from 'react';
import { GUIDELINE_DATA, GuidelineChunk } from '../data/guidelineContent';
import { Book, ChevronRight, FileText, Search, X, ArrowLeft, ArrowRight, List } from 'lucide-react';
import { GuidelinesPdfViewer } from './GuidelinesPdfViewer';

export const GuidelinesIndex: React.FC = () => {
  const [selectedChunkId, setSelectedChunkId] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [showPdf, setShowPdf] = useState(false);
  const [pdfPage, setPdfPage] = useState(1);

  if (showPdf) {
    return <GuidelinesPdfViewer initialPage={pdfPage} onBack={() => setShowPdf(false)} />;
  }

  // Filter only Chapters and Annexures for the "Book" view
  // Protocol items are handled in a different screen usually, but they are in the same data file.
  // We filter by ID convention 'chap-' or 'annex-'.
  const documentStructure = useMemo(() => 
    GUIDELINE_DATA.filter(c => c.id.startsWith('chap') || c.id.startsWith('annex')),
  []);

  // Search Logic
  const filteredList = useMemo(() => {
    if (!filter) return documentStructure;
    const lower = filter.toLowerCase();
    return documentStructure.filter(c => 
        c.title.toLowerCase().includes(lower) || 
        c.content.toLowerCase().includes(lower) ||
        // Explicit check against tags array
        (c.tags && c.tags.some(t => t.toLowerCase().includes(lower)))
    );
  }, [filter, documentStructure]);

  const activeChunk = useMemo(() => 
    documentStructure.find(c => c.id === selectedChunkId),
  [selectedChunkId, documentStructure]);

  // Sequential Navigation Logic
  const { prevChunk, nextChunk } = useMemo(() => {
    if (!activeChunk) return { prevChunk: null, nextChunk: null };
    const idx = documentStructure.findIndex(c => c.id === activeChunk.id);
    return {
        prevChunk: idx > 0 ? documentStructure[idx - 1] : null,
        nextChunk: idx < documentStructure.length - 1 ? documentStructure[idx + 1] : null
    };
  }, [activeChunk, documentStructure]);

  // Auto-scroll to top on chapter change
  useEffect(() => {
    if (selectedChunkId) {
        document.getElementById('reader-top')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChunkId]);

  // --- READER VIEW ---
  if (selectedChunkId && activeChunk) {
    // Parse topics from the content string (format "Topics: A, B, C")
    const cleanContent = activeChunk.content.replace(/^Topics:\s*/i, '');
    const topics = cleanContent.split(',').map(t => t.trim()).filter(t => t.length > 0);

    return (
        <div className="flex flex-col h-full bg-white relative animate-in slide-in-from-right duration-300">
            {/* Reader Header */}
            <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-white/95 backdrop-blur-sm sticky top-0 z-20 shadow-sm">
                <button 
                    onClick={() => setSelectedChunkId(null)} 
                    className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
                    aria-label="Back to Index"
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">IMPCG 2024</p>
                    <h2 className="font-black text-slate-800 text-sm leading-tight truncate">{activeChunk.title}</h2>
                </div>
                <div className="bg-slate-100 px-2 py-1 rounded text-[10px] font-bold text-slate-500 whitespace-nowrap border border-slate-200">
                    Pg {activeChunk.page}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 pb-32 bg-white" id="reader-top">
                <div className="max-w-prose mx-auto">
                    <h1 className="text-2xl font-black text-teal-900 mb-6 leading-tight border-b-4 border-teal-500 pb-4 inline-block">
                        {activeChunk.title}
                    </h1>
                    
                    <div className="prose prose-slate prose-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <List size={16} className="text-slate-400" />
                            <h3 className="uppercase text-xs font-bold text-slate-500 tracking-widest">
                                Chapter Topics
                            </h3>
                        </div>

                        <ul className="space-y-4 pl-0 list-none">
                            {topics.map((topic, i) => (
                                <li key={i} className="flex gap-4 text-slate-800 font-medium text-lg leading-relaxed group">
                                    <span className="w-6 h-6 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 group-hover:bg-teal-100 transition-colors">
                                        {i + 1}
                                    </span>
                                    <span className="group-hover:text-teal-900 transition-colors border-b border-transparent group-hover:border-teal-100">
                                        {topic}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        
                        <div className="mt-12 p-5 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg text-yellow-900 text-sm">
                            <span className="font-bold block mb-1 flex items-center gap-2">
                                <FileText size={14} /> Full Reference Available
                            </span>
                            <p className="opacity-90">
                                Refer to the official PDF <strong>(Page {activeChunk.page})</strong> for detailed flowcharts, medication dosages, and legal frameworks referenced in this section.
                            </p>

                            <button
                                onClick={() => {
                                    setPdfPage(activeChunk.page || 1);
                                    setShowPdf(true);
                                }}
                                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-teal-700 px-3 py-2 text-xs font-bold text-white hover:bg-teal-800 transition-colors"
                            >
                                <FileText size={14} /> Open PDF at page {activeChunk.page}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Footer */}
            <div className="absolute bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
                <button 
                    onClick={() => prevChunk && setSelectedChunkId(prevChunk.id)}
                    disabled={!prevChunk}
                    className="flex-1 h-14 flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 font-bold text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98]"
                >
                    <ArrowLeft size={18} /> Prev
                </button>
                <button 
                    onClick={() => nextChunk && setSelectedChunkId(nextChunk.id)}
                    disabled={!nextChunk}
                    className="flex-[2] h-14 flex items-center justify-center gap-2 rounded-xl bg-teal-700 text-white font-bold shadow-lg shadow-teal-200 disabled:opacity-50 disabled:shadow-none hover:bg-teal-800 transition-all active:scale-[0.98]"
                >
                    Next Chapter <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
  }

  // --- INDEX LIST VIEW ---
  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header with Search */}
      <div className="p-4 bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm space-y-3">
        <div>
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Book className="text-teal-600" /> 
            IMPCG 2024
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-8">
            Digital Document Browser
            </p>
        </div>

        <button
            onClick={() => { setPdfPage(1); setShowPdf(true); }}
            className="w-full h-12 rounded-xl bg-teal-700 text-white font-black shadow-lg shadow-teal-200 hover:bg-teal-800 transition-colors flex items-center justify-center gap-2"
        >
            <FileText size={16} /> Open full official PDF
        </button>
        
        {/* Search Input */}
        <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-teal-500 transition-colors" />
            <input 
                type="text" 
                placeholder="Find chapter or topic..." 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full h-12 pl-10 pr-10 rounded-xl bg-slate-100 border-2 border-transparent focus:bg-white focus:border-teal-500 outline-none text-base font-bold transition-all text-slate-900 placeholder:text-slate-400 shadow-inner"
            />
            {filter && (
                <button 
                    onClick={() => setFilter('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                    <X size={16} />
                </button>
            )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredList.length === 0 ? (
             <div className="text-center py-12 opacity-50 flex flex-col items-center animate-in fade-in zoom-in duration-300">
                <div className="bg-slate-200 p-6 rounded-full mb-4">
                    <Search size={32} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-600">No chapters found</h3>
                <p className="text-sm text-slate-400">Try adjusting your search terms</p>
             </div>
        ) : (
            filteredList.map((chapter, idx) => (
                <button 
                    key={chapter.id} 
                    onClick={() => setSelectedChunkId(chapter.id)}
                    className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center justify-between text-left active:scale-[0.98] transition-all hover:border-teal-400 hover:shadow-md group relative overflow-hidden"
                    style={{ animationDelay: `${idx * 50}ms` }}
                >
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center font-black text-sm group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors shrink-0 border border-slate-200 group-hover:border-teal-200">
                            {chapter.id.replace('chap-', '').replace('annex-', 'A')}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2 group-hover:text-teal-900 transition-colors">
                                {chapter.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                    <FileText size={10} /> PG {chapter.page}
                                </span>
                                {chapter.tags.length > 0 && (
                                    <span className="text-[10px] text-slate-400 font-bold truncate max-w-[150px]">
                                        • {chapter.tags.slice(0, 2).join(', ')}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <ChevronRight className="text-slate-300 group-hover:text-teal-500 transition-colors shrink-0 relative z-10" />
                    
                    {/* Hover Effect Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-teal-50/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </button>
            ))
        )}
        <div className="h-10" />
      </div>
    </div>
  );
};