import React, { useMemo, useState } from 'react';
import { ArrowLeft, FileText } from 'lucide-react';

type Props = {
  initialPage?: number;
  onBack: () => void;
};

export const GuidelinesPdfViewer: React.FC<Props> = ({ initialPage = 1, onBack }) => {
  const [page, setPage] = useState<number>(Math.max(1, Math.floor(initialPage || 1)));

  const src = useMemo(() => {
    // Many PDF viewers support #page=N
    return `/IMPCG_2024.pdf#page=${page}`;
  }, [page]);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-white/95 backdrop-blur-sm sticky top-0 z-20 shadow-sm">
        <button
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">IMPCG 2024</p>
          <h2 className="font-black text-slate-800 text-sm leading-tight truncate flex items-center gap-2">
            <FileText size={16} className="text-teal-600" /> Full PDF
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold text-slate-500" htmlFor="pdfPage">
            Page
          </label>
          <input
            id="pdfPage"
            inputMode="numeric"
            value={page}
            onChange={(e) => {
              const n = parseInt(e.target.value || '1', 10);
              setPage(Number.isFinite(n) ? Math.max(1, n) : 1);
            }}
            className="w-20 h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      <div className="flex-1 bg-slate-100">
        <iframe
          title="IMPCG 2024 PDF"
          src={src}
          className="w-full h-full"
        />
      </div>

      <div className="p-3 text-[10px] text-slate-500 bg-white border-t border-slate-200">
        This is a pilot viewer for the official IMPCG 2024 PDF. Use clinical judgement and local protocols.
      </div>
    </div>
  );
};
