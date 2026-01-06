import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PPH_DATA, PPHProtocolItem } from '../data/pphProtocols';
import { Search, AlertTriangle, Syringe, FileText, Activity, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

export const DrugReference: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const listRef = useRef<HTMLDivElement>(null);
  
  const ITEMS_PER_PAGE = 15;

  // Filter only items categorized as 'Emergency Drug'
  const allDrugs = useMemo(() => {
    return PPH_DATA.filter(item => 
        item.category === 'Emergency Drug' &&
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
    listRef.current?.scrollTo({ top: 0 });
  }, [searchTerm]);

  // Scroll to top on page change
  useEffect(() => {
    listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const totalPages = Math.ceil(allDrugs.length / ITEMS_PER_PAGE);
  
  const paginatedDrugs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return allDrugs.slice(start, start + ITEMS_PER_PAGE);
  }, [allDrugs, currentPage]);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Header */}
      <div className="p-4 bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm space-y-3">
        <div>
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Syringe className="text-teal-600" size={28} /> 
                EMERGENCY DRUGS
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-9">
                Quick Reference Dosage Guide
            </p>
        </div>
        
        {/* Search */}
        <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-teal-500 transition-colors" />
            <input 
                type="text" 
                placeholder="Search drugs (e.g. Oxytocin)..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-14 pl-10 pr-10 rounded-xl bg-slate-100 border-2 border-transparent focus:bg-white focus:border-teal-500 outline-none font-bold text-lg transition-all text-slate-900 placeholder:text-slate-400 shadow-inner"
            />
             {searchTerm && (
                <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 active:scale-90 transition-transform"
                >
                    <X size={20} />
                </button>
            )}
        </div>
      </div>

      {/* List */}
      <div 
        ref={listRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 scroll-smooth"
      >
         {paginatedDrugs.length === 0 ? (
             <div className="text-center py-12 opacity-50 flex flex-col items-center animate-in fade-in zoom-in duration-300">
                <div className="bg-slate-200 p-6 rounded-full mb-4">
                    <Syringe size={32} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-600">No drugs found</h3>
                <p className="text-sm text-slate-400">Try adjusting your search</p>
             </div>
         ) : (
             <>
                 {paginatedDrugs.map((drug, idx) => (
                     <DrugCard key={drug.id} drug={drug} index={idx} />
                 ))}

                 {/* Pagination Controls */}
                 {totalPages > 1 && (
                     <div className="flex items-center justify-between pt-6 pb-2">
                         <Button 
                            variant="outline" 
                            onClick={handlePrev} 
                            disabled={currentPage === 1}
                            className="w-32 text-sm h-12"
                         >
                            <ChevronLeft size={18} /> Prev
                         </Button>
                         
                         <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                             Page {currentPage} / {totalPages}
                         </span>
                         
                         <Button 
                            variant="outline" 
                            onClick={handleNext} 
                            disabled={currentPage === totalPages}
                            className="w-32 text-sm h-12"
                         >
                            Next <ChevronRight size={18} />
                         </Button>
                     </div>
                 )}
             </>
         )}
      </div>
    </div>
  );
};

const DrugCard = ({ drug, index }: { drug: PPHProtocolItem, index: number }) => (
    <div 
        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-500"
        style={{ animationDelay: `${index * 50}ms` }}
    >
        {/* Card Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-start">
            <div className="flex-1">
                <h3 className="font-black text-lg text-slate-900 leading-tight mb-1">{drug.title}</h3>
                {drug.pdf_ref && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase bg-white px-2 py-0.5 rounded border border-slate-200">
                        <FileText size={10} /> {drug.pdf_ref}
                    </span>
                )}
            </div>
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 shrink-0 ml-2">
                <Syringe size={20} />
            </div>
        </div>
        
        <div className="p-5 space-y-5">
            {/* DOSAGE */}
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                    <Activity size={40} />
                </div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-wider mb-1">Standard Dosage</p>
                <p className="text-blue-900 font-black text-lg leading-tight font-mono">
                    {drug.dosage_iv || "Refer to protocol"}
                </p>
                {drug.rate && (
                    <div className="mt-2 pt-2 border-t border-blue-100">
                        <p className="text-[10px] font-bold text-blue-400 uppercase">Rate</p>
                        <p className="text-blue-800 font-bold text-sm">{drug.rate}</p>
                    </div>
                )}
            </div>

            {/* INDICATIONS */}
            {drug.indications && drug.indications.length > 0 && (
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Indications</p>
                    <div className="flex flex-wrap gap-2">
                        {drug.indications.map((ind, i) => (
                            <span key={i} className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200">
                                {ind}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* WARNINGS */}
            {drug.warning && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg flex gap-3">
                    <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
                    <div>
                        <p className="text-[10px] font-black text-red-400 uppercase">Critical Warning</p>
                        <p className="text-sm font-bold text-red-900 leading-snug">{drug.warning}</p>
                    </div>
                </div>
            )}
        </div>
    </div>
);