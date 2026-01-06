import React, { useState, useMemo } from 'react';
import { PPH_DATA, PPHProtocolItem } from '../data/pphProtocols';
import { Search, ClipboardList, AlertOctagon, FileText, X, CheckSquare } from 'lucide-react';

export const ProtocolsIndex: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter for Protocols and Procedures only (Drugs are in DrugReference)
  const protocols = useMemo(() => {
    return PPH_DATA.filter(item => 
      (item.category === 'Protocol' || item.category === 'Procedure') &&
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Header */}
      <div className="p-4 bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm space-y-3">
        <div>
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <ClipboardList className="text-teal-600" size={28} /> 
            CLINICAL PROTOCOLS
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-9">
            Standard Operating Procedures
            </p>
        </div>
        
        {/* Search Input */}
        <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-teal-500 transition-colors" />
            <input 
                type="text" 
                placeholder="Filter protocols (e.g. 'Inversion')..." 
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 scroll-smooth">
        {protocols.length === 0 ? (
             <div className="text-center py-12 opacity-50 flex flex-col items-center animate-in fade-in zoom-in duration-300">
                <div className="bg-slate-200 p-6 rounded-full mb-4">
                    <ClipboardList size={32} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-600">No protocols found</h3>
                <p className="text-sm text-slate-400">Try adjusting your search terms</p>
             </div>
        ) : (
            protocols.map((protocol, idx) => (
                <ProtocolCard key={protocol.id} data={protocol} index={idx} />
            ))
        )}

        <div className="p-4 text-center text-slate-300 text-[10px] font-black uppercase tracking-widest pt-8">
            IMPCG 2024 • Clinical Reference
        </div>
      </div>
    </div>
  );
};

const ProtocolCard: React.FC<{ data: PPHProtocolItem, index: number }> = ({ data, index }) => {
    return (
        <div 
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Card Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-start">
                <div className="flex-1">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded mb-2 inline-block border ${
                        data.category === 'Protocol' ? 'bg-teal-100 text-teal-800 border-teal-200' : 'bg-indigo-100 text-indigo-800 border-indigo-200'
                    }`}>
                        {data.category}
                    </span>
                    <h3 className="font-black text-lg text-slate-900 leading-tight pr-4">
                        {data.title}
                    </h3>
                </div>
                {data.pdf_ref && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-2 py-1 rounded shrink-0">
                        <FileText size={10} /> {data.pdf_ref}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 space-y-5">
                
                {/* Warning Alert */}
                {data.warning && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg flex items-start gap-3">
                        <AlertOctagon className="text-red-500 w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[10px] font-black text-red-400 uppercase mb-0.5">Critical Warning</p>
                            <p className="text-sm text-red-900 font-bold leading-snug">{data.warning}</p>
                        </div>
                    </div>
                )}

                {/* Indications (Defensive check, though mostly for drugs) */}
                {data.indications && data.indications.length > 0 && (
                     <div>
                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Indications</p>
                        <div className="flex flex-wrap gap-2">
                            {data.indications.map((ind, i) => (
                                <span key={i} className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200">
                                    {ind}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Steps List */}
                {data.steps && data.steps.length > 0 && (
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-1">
                            <CheckSquare size={12} /> Management Steps
                        </p>
                        <div className="space-y-3">
                            {data.steps.map((step, idx) => (
                                <div key={idx} className="flex gap-4 items-start text-sm text-slate-700 font-medium group">
                                    <div className="mt-0.5 w-6 h-6 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 border border-slate-200 group-hover:bg-teal-500 group-hover:text-white group-hover:border-teal-500 transition-colors">
                                        {idx + 1}
                                    </div>
                                    <span className="leading-relaxed border-b border-slate-50 pb-2 w-full">{step.replace(/^\d+\.\s*/, '')}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};