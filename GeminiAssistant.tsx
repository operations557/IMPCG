import React, { useState } from 'react';
import { SearchService } from '../services/searchService';
import { GuidelineChunk } from '../data/guidelineContent';
import { Button } from './Button';
import { Search, BookOpen, AlertTriangle, FileText, X } from 'lucide-react';
import { AuditService } from '../services/auditService';

export const GeminiAssistant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GuidelineChunk[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    
    if (val.trim().length > 1) {
      const hits = SearchService.search(val);
      setResults(hits);
      setHasSearched(true);
      
      // Debounce logic would be better here in prod, but for PoC simple log
      if (hits.length > 0 && val.length > 3) {
         // Only log 'meaningful' searches to avoid spamming log on every keystroke
         // For PoC, we will log when the user stops typing or explicit action, 
         // but here we will log only if it finds results to simulate 'viewing' a protocol list
      }
    } else {
      setResults([]);
      setHasSearched(false);
    }
  };

  const logView = (item: GuidelineChunk) => {
      AuditService.log('VIEW_PROTOCOL', `User viewed protocol: ${item.title} (Page ${item.page})`);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* 1. Sticky Search Header */}
      <div className="p-4 bg-white shadow-sm border-b border-slate-200 z-10 sticky top-0">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
                type="text" 
                value={query}
                onChange={handleSearch}
                placeholder="Search protocols (e.g. 'PPH', 'Magnesium')..."
                className="w-full h-12 pl-10 pr-10 rounded-lg bg-slate-100 border-2 border-transparent focus:bg-white focus:border-teal-500 outline-none font-bold text-lg transition-all"
                autoFocus
            />
            {query && (
                <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 p-1">
                    <X size={18} />
                </button>
            )}
        </div>
      </div>

      {/* 2. Results Area */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {!hasSearched ? (
            // Empty State / Suggestions
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 space-y-4 opacity-70">
                <BookOpen size={48} strokeWidth={1.5} />
                <p className="font-bold text-center">Type to search the 2024 Guidelines</p>
                <div className="flex flex-wrap justify-center gap-2">
                    {['Eclampsia', 'PPH', 'Sepsis', 'Oxytocin'].map(tag => (
                        <button 
                            key={tag}
                            onClick={() => {
                                setQuery(tag);
                                handleSearch({ target: { value: tag } } as any);
                                AuditService.log('VIEW_PROTOCOL', `Quick tag search: ${tag}`);
                            }}
                            className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-bold hover:bg-slate-300"
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        ) : results.length === 0 ? (
            // No Results State
            <div className="text-center py-10">
                <p className="text-slate-500 font-bold mb-2">No guidelines found for "{query}"</p>
                <p className="text-xs text-slate-400">Try broader terms like "Bleeding" or "BP".</p>
            </div>
        ) : (
            // Result List
            <div className="space-y-4">
                {results.map((item) => (
                    <div 
                        key={item.id} 
                        className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 active:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => logView(item)}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-teal-900 text-lg leading-tight w-3/4">
                                {item.title}
                            </h3>
                            <span className="bg-slate-100 text-slate-600 text-xs font-black px-2 py-1 rounded uppercase flex items-center gap-1">
                                <FileText size={12} /> Pg {item.page}
                            </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed text-sm border-l-4 border-teal-500 pl-3 py-1">
                            {item.content}
                        </p>
                        <div className="mt-3 flex gap-2">
                            {item.tags.slice(0,3).map(tag => (
                                <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* 3. Safety Disclaimer Footer */}
      <div className="bg-yellow-50 border-t border-yellow-200 p-3 text-center absolute bottom-0 w-full shrink-0 z-20">
        <p className="text-[10px] text-yellow-800 font-bold uppercase tracking-wide flex items-center justify-center gap-2">
            <AlertTriangle size={12} />
            AI Assistant - Verify with Official Clinical Guidelines
        </p>
      </div>
    </div>
  );
};