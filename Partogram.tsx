import React, { useState, useEffect } from 'react';
import { LaborDataPoint } from '../types';
import { Button } from './Button';
import { AlertTriangle, Plus, RotateCcw, Clock, Info, CheckCircle2 } from 'lucide-react';
import { PatientRepository } from '../services/storageService';
import { AuditService } from '../services/auditService';

interface PartogramProps {
  onRequestTransfer?: () => void;
}

export const Partogram: React.FC<PartogramProps> = ({ onRequestTransfer }) => {
  const [activePhaseStart, setActivePhaseStart] = useState<number | null>(null);
  const [points, setPoints] = useState<LaborDataPoint[]>([]);
  const [selectedDilation, setSelectedDilation] = useState<number>(4);
  const [breachActionLine, setBreachActionLine] = useState(false);
  
  // Input State
  const [entryTime, setEntryTime] = useState<string>(''); 

  // Load from Storage on Mount
  useEffect(() => {
    const saved = PatientRepository.getPartogramState();
    if (saved.start) {
      setActivePhaseStart(saved.start);
      setPoints(saved.points);
      checkBreach(saved.points);
    }
    updateEntryTimeToNow();
  }, []);

  // Save to Storage on Change
  useEffect(() => {
    PatientRepository.savePartogramState({
      start: activePhaseStart,
      points: points
    });
  }, [activePhaseStart, points]);

  const updateEntryTimeToNow = () => {
    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5);
    setEntryTime(timeString);
  };

  // --- GRAPH CONSTANTS (0-10cm Scale) ---
  const WIDTH = 340;
  const HEIGHT = 400; // Taller to accommodate 0-10cm comfortably
  const PADDING = 40;
  const GRAPH_W = WIDTH - PADDING * 2;
  const GRAPH_H = HEIGHT - PADDING * 2;
  const MAX_HOURS = 10;
  const MAX_CM = 10;
  
  // Scales
  const scaleX = (hours: number) => PADDING + (hours / MAX_HOURS) * GRAPH_W;
  // Map 0 at bottom, 10 at top
  const scaleY = (cm: number) => PADDING + GRAPH_H - (cm / MAX_CM) * GRAPH_H;

  const checkBreach = (currentPoints: LaborDataPoint[]) => {
    const isBreach = currentPoints.some(p => {
        // Clinical Logic: Alert/Action lines only apply in Active Phase (>= 4cm)
        if (p.dilation < 4) return false;

        // Action Line Logic (Page 92):
        // Starts at 2 hours (relative to active phase start) at 4cm. Slope 1cm/hr.
        // Formula: AllowedHours = (Dilation - 4) + 2
        // If ActualHours > AllowedHours -> Breach
        const allowedHours = (p.dilation - 4) + 2;
        return p.hoursFromStart > allowedHours;
    });
    setBreachActionLine(isBreach);
  };

  const handleAddPlot = () => {
    if (!entryTime) return;

    const now = new Date();
    const [hours, minutes] = entryTime.split(':').map(Number);
    const plotDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    const timestamp = plotDate.getTime();
    
    let newStart = activePhaseStart;
    let newPoints = [...points];

    // Logic: Handling Retrospective Plotting
    // If we have no start time, OR the new point is earlier than current start
    // (and it's >= 4cm, assuming start of active phase tracked from first 4cm+ point? 
    // Actually, simple logic: The earliest plotted point defines T=0 for graph visual purposes)
    
    if (points.length === 0 || !newStart || timestamp < newStart) {
        newStart = timestamp;
        setActivePhaseStart(newStart);
        // Recalculate existing points relative to new start
        newPoints = newPoints.map(p => ({
            ...p,
            hoursFromStart: (p.time - timestamp) / (1000 * 60 * 60)
        }));
    }

    const hoursElapsed = (timestamp - newStart!) / (1000 * 60 * 60);

    const newPoint: LaborDataPoint = {
      dilation: selectedDilation,
      time: timestamp,
      hoursFromStart: hoursElapsed
    };

    newPoints.push(newPoint);
    newPoints.sort((a,b) => a.hoursFromStart - b.hoursFromStart);

    setPoints(newPoints);
    setActivePhaseStart(newStart);
    checkBreach(newPoints);
    
    AuditService.log('CLINICAL_ACTION', `Partogram Plot: ${selectedDilation}cm at ${hoursElapsed.toFixed(2)}hrs`);
  };

  const reset = () => {
    if(confirm("Clear current Partogram? This cannot be undone.")) {
        setPoints([]);
        setActivePhaseStart(null);
        setBreachActionLine(false);
        PatientRepository.clearPartogramState();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
      
      {/* 1. Header */}
      <div className="bg-slate-100 p-3 border-b border-slate-200 flex justify-between items-center shadow-sm z-10 shrink-0">
        <div>
            <h2 className="font-black text-slate-800 text-lg flex items-center gap-2">
                PARTOGRAM <span className="text-slate-500 text-[10px] uppercase font-bold bg-white px-2 py-0.5 rounded border border-slate-200">0-10cm View</span>
            </h2>
        </div>
        {points.length > 0 && (
            <button onClick={reset} className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded flex items-center gap-1 hover:bg-red-100 transition-colors">
                <RotateCcw size={12} /> CLEAR
            </button>
        )}
      </div>

      {/* 2. Graph Area */}
      <div className="flex-1 relative bg-slate-50 overflow-y-auto overflow-x-hidden flex flex-col items-center pt-4">
        <svg width={WIDTH} height={HEIGHT} className="bg-white shadow-sm border border-slate-200 rounded-lg shrink-0 mb-4">
            {/* Background Grid */}
            <rect x={PADDING} y={PADDING} width={GRAPH_W} height={GRAPH_H} fill="#ffffff" />
            
            {/* Latent Phase Shading (0-4cm) */}
            <rect 
                x={PADDING} 
                y={scaleY(4)} 
                width={GRAPH_W} 
                height={scaleY(0) - scaleY(4)} 
                fill="#f1f5f9" 
                opacity="0.6"
            />
            <text x={WIDTH/2} y={scaleY(2)} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#cbd5e1" transform={`rotate(0)`}>LATENT PHASE</text>

            {/* Grid Lines Vertical (Hours) */}
            {Array.from({ length: 11 }).map((_, i) => (
                <line 
                    key={`v-${i}`} 
                    x1={scaleX(i)} y1={PADDING} 
                    x2={scaleX(i)} y2={HEIGHT - PADDING} 
                    stroke="#e2e8f0" strokeWidth="1" 
                />
            ))}
            
            {/* Grid Lines Horizontal (CM) */}
            {Array.from({ length: 11 }).map((_, i) => {
                const isMajor = i === 4 || i === 10;
                return (
                    <line 
                        key={`h-${i}`} 
                        x1={PADDING} y1={scaleY(i)} 
                        x2={WIDTH - PADDING} y2={scaleY(i)} 
                        stroke={isMajor ? "#94a3b8" : "#f1f5f9"} 
                        strokeWidth={isMajor ? "2" : "1"} 
                        strokeDasharray={isMajor ? "0" : "4,4"}
                    />
                );
            })}

            {/* --- CLINICAL LINES (Only shown >= 4cm) --- */}
            <clipPath id="active-phase-clip">
                <rect x={PADDING} y={PADDING} width={GRAPH_W} height={scaleY(4) - PADDING} />
            </clipPath>

            <g clipPath="url(#active-phase-clip)">
                {/* ALERT LINE (Green/Teal Dotted) Starts (0h, 4cm) -> (6h, 10cm) */}
                <line 
                    x1={scaleX(0)} y1={scaleY(4)} 
                    x2={scaleX(6)} y2={scaleY(10)} 
                    stroke="#0d9488" strokeWidth="2" strokeDasharray="6,4" 
                />
                <text x={scaleX(4.8)} y={scaleY(9.2)} fill="#0d9488" fontSize="10" fontWeight="bold" transform={`rotate(-45 ${scaleX(4.8)} ${scaleY(9.2)})`}>ALERT</text>

                {/* ACTION LINE (Red Solid) Starts (2h, 4cm) -> (8h, 10cm) */}
                <line 
                    x1={scaleX(2)} y1={scaleY(4)} 
                    x2={scaleX(8)} y2={scaleY(10)} 
                    stroke="#dc2626" strokeWidth="3" 
                />
                <text x={scaleX(6.8)} y={scaleY(9.2)} fill="#dc2626" fontSize="10" fontWeight="black" transform={`rotate(-45 ${scaleX(6.8)} ${scaleY(9.2)})`}>ACTION</text>
            </g>

            {/* Data Points */}
            <polyline 
                points={points.map(p => `${scaleX(p.hoursFromStart)},${scaleY(p.dilation)}`).join(' ')} 
                fill="none" 
                stroke="#0f172a" 
                strokeWidth="3" 
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {points.map((p, i) => (
                <g key={i}>
                    <circle 
                        cx={scaleX(p.hoursFromStart)} 
                        cy={scaleY(p.dilation)} 
                        r={i === points.length - 1 ? 6 : 4} 
                        fill={p.dilation >= 4 && p.hoursFromStart > (p.dilation - 4 + 2) ? "#dc2626" : "#0f172a"}
                        stroke="white"
                        strokeWidth="2"
                    />
                    {/* Timestamp Label for latest point */}
                    {i === points.length - 1 && (
                         <text 
                            x={scaleX(p.hoursFromStart)} 
                            y={scaleY(p.dilation) - 12} 
                            textAnchor="middle" 
                            fontSize="11" 
                            fontWeight="bold"
                            fill="#0f172a"
                            className="bg-white"
                        >
                            {new Date(p.time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                        </text>
                    )}
                </g>
            ))}

            {/* Axes Labels */}
            <text x={WIDTH/2} y={HEIGHT - 10} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#64748b">HOURS IN LABOUR</text>
            <text x={12} y={HEIGHT/2} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#64748b" transform={`rotate(-90 12 ${HEIGHT/2})`}>CERVICAL DILATION (cm)</text>
            
            {/* Y Axis Numbers */}
            {[0,1,2,3,4,5,6,7,8,9,10].map(cm => (
                <text key={cm} x={PADDING - 10} y={scaleY(cm) + 4} fontSize="11" fontWeight={cm >= 4 ? "black" : "normal"} fill={cm >= 4 ? "#334155" : "#94a3b8"}>{cm}</text>
            ))}
             {/* X Axis Numbers */}
             {[0,1,2,3,4,5,6,7,8,9,10].map(h => (
                <text key={h} x={scaleX(h)} y={HEIGHT - PADDING + 15} fontSize="10" textAnchor="middle" fill="#94a3b8">{h}</text>
            ))}
        </svg>

        {/* Breach Overlay */}
        {breachActionLine && (
            <div className="absolute inset-0 bg-red-900/95 z-20 flex flex-col items-center justify-center text-white p-6 text-center animate-in fade-in zoom-in duration-300 backdrop-blur-sm">
                <div className="bg-white p-4 rounded-full mb-4 animate-bounce">
                    <AlertTriangle size={48} className="text-red-600" />
                </div>
                <h3 className="text-3xl font-black uppercase mb-2 tracking-tight">ACTION LINE CROSSED</h3>
                <p className="font-bold text-red-100 text-lg mb-6 leading-tight">Labour progress is dangerously slow.</p>
                
                <div className="bg-red-800 border border-red-700 p-4 rounded-xl w-full mb-6 text-left shadow-lg">
                    <p className="text-xs font-bold text-red-300 uppercase mb-2">IMPCG Page 92 Protocol:</p>
                    <ul className="list-disc pl-4 space-y-2 font-bold text-sm">
                        <li>Rule out Cephalo-Pelvic Disproportion (CPD).</li>
                        <li>Consider Oxytocin augmentation if CPD excluded.</li>
                        <li>Transfer to Hospital URGENTLY if at clinic.</li>
                        <li>Prepare for possible Caesarean Section.</li>
                    </ul>
                </div>

                <div className="flex gap-3 w-full">
                     <button 
                        onClick={() => setBreachActionLine(false)} 
                        className="flex-1 py-3 bg-transparent border-2 border-red-400/30 rounded-lg font-bold text-red-200 text-sm"
                    >
                        Dismiss
                    </button>
                    {onRequestTransfer && (
                        <button 
                            className="flex-[2] py-3 bg-white text-red-900 rounded-lg font-black text-sm shadow-xl active:scale-95 transition-transform"
                            onClick={() => { 
                                setBreachActionLine(false);
                                onRequestTransfer();
                            }}
                        >
                            INITIATE TRANSFER
                        </button>
                    )}
                </div>
            </div>
        )}
      </div>

      {/* 3. Controls */}
      <div className="p-4 bg-white border-t border-slate-200 space-y-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 shrink-0">
        
        {/* Time Input */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <Clock size={20} className="text-slate-500" />
            <div className="flex-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase block">Time of Observation</label>
                <input 
                    type="time" 
                    value={entryTime}
                    onChange={(e) => setEntryTime(e.target.value)}
                    className="bg-transparent font-mono font-bold text-xl text-slate-800 outline-none w-full p-0"
                />
            </div>
             <div className="text-[10px] text-right font-bold text-slate-400 leading-tight">
                {activePhaseStart ? `Start: ${new Date(activePhaseStart).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}` : 'New Session'}
            </div>
        </div>

        {/* Dilation Input (0-10cm) */}
        <div>
            <div className="flex justify-between items-end mb-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Cervical Dilation (cm)</label>
                <span className="text-2xl font-black text-slate-800 leading-none">{selectedDilation} <span className="text-sm font-bold text-slate-400">cm</span></span>
            </div>
            {/* Two rows for easier tapping: 0-4 and 5-10 */}
            <div className="grid grid-cols-6 gap-2 mb-2">
                 {[0,1,2,3,4].map(cm => (
                    <DilationBtn key={cm} cm={cm} selected={selectedDilation} onClick={setSelectedDilation} isLatent />
                 ))}
                 <div className="flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Latent</div>
            </div>
            <div className="grid grid-cols-6 gap-2">
                 {[5,6,7,8,9,10].map(cm => (
                    <DilationBtn key={cm} cm={cm} selected={selectedDilation} onClick={setSelectedDilation} />
                 ))}
            </div>
        </div>

        <Button fullWidth onClick={handleAddPlot} disabled={!entryTime}>
            <Plus size={20} strokeWidth={3} /> PLOT OBSERVATION
        </Button>
      </div>
    </div>
  );
};

const DilationBtn = ({ cm, selected, onClick, isLatent }: any) => (
    <button
        onClick={() => onClick(cm)}
        className={`h-12 rounded-lg font-black text-lg transition-all flex flex-col items-center justify-center ${
            selected === cm 
                ? 'bg-slate-900 text-white shadow-md ring-2 ring-slate-400 ring-offset-1' 
                : isLatent 
                    ? 'bg-slate-100 text-slate-500 border border-slate-200 hover:border-slate-300'
                    : 'bg-white text-slate-800 border-2 border-slate-200 hover:border-teal-400'
        }`}
    >
        {cm}
    </button>
);