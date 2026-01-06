import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { PPHSession } from '../types';
import { PatientRepository } from '../services/storageService';
import { AuditService } from '../services/auditService';
import { Play, CheckSquare, Clock, AlertOctagon, Syringe, HandMetal, Droplet, Trash2, ArchiveRestore } from 'lucide-react';

const MAX_SESSION_AGE_MS = 12 * 60 * 60 * 1000; // 12 Hours

export const PPHManager: React.FC = () => {
  // State to track if we have attempted to load from storage
  // Prevents the initial empty state from overwriting a saved session
  const [isInitialized, setIsInitialized] = useState(false);
  const [pendingSession, setPendingSession] = useState<PPHSession | null>(null);

  const [session, setSession] = useState<PPHSession>({
    isActive: false,
    startTime: null,
    medsAdministered: [],
    isRefractory: false,
  });

  const [elapsed, setElapsed] = useState(0);

  // 1. RESUME LOGIC (Run Once on Mount)
  useEffect(() => {
    const saved = PatientRepository.getPPHState();
    
    if (saved && saved.isActive && saved.startTime) {
      const now = Date.now();
      const diff = now - saved.startTime;

      if (diff < MAX_SESSION_AGE_MS) {
        // Valid Session found - PROMPT USER
        setPendingSession(saved);
      } else {
        // Stale Session: Clear to prevent confusion
        PatientRepository.clearPPHState();
        AuditService.log('CLINICAL_ACTION', 'Stale PPH Session (>12h) detected and cleared.');
        setIsInitialized(true);
      }
    } else {
        setIsInitialized(true);
    }
  }, []);

  const confirmResume = () => {
    if (pendingSession && pendingSession.startTime) {
        const now = Date.now();
        const diff = now - pendingSession.startTime;
        setSession(pendingSession);
        setElapsed(Math.floor(diff / 1000));
        AuditService.log('CLINICAL_ACTION', `PPH Timer RESUMED from storage by user. Elapsed: ${Math.floor(diff/1000)}s`);
        setPendingSession(null);
        setIsInitialized(true);
    }
  };

  const discardSession = () => {
    PatientRepository.clearPPHState();
    setPendingSession(null);
    setIsInitialized(true);
    AuditService.log('CLINICAL_ACTION', 'User DISCARDED previous PPH session.');
  };

  // 2. TIMER LOGIC
  useEffect(() => {
    let interval: number;
    if (session.isActive && session.startTime) {
      interval = window.setInterval(() => {
        const now = Date.now();
        const seconds = Math.floor((now - session.startTime!) / 1000);
        setElapsed(seconds);
        
        // Logic Hook: 15 minutes = 900 seconds
        if (seconds > 900 && !session.isRefractory) {
           setSession(prev => ({...prev, isRefractory: true}));
           AuditService.log('CLINICAL_ACTION', 'PPH designated as REFRACTORY (Time > 15mins). Escalation required.');
        }
      }, 1000);
    } else {
      setElapsed(0);
    }
    return () => clearInterval(interval);
  }, [session.isActive, session.startTime, session.isRefractory]);

  // 3. PERSISTENCE LOGIC
  // Save state on every change to ensure reliability if app closes or unmounts.
  useEffect(() => {
    // CRITICAL: Do not write to storage until we have attempted to load.
    if (!isInitialized) return;

    if (session.isActive) {
        PatientRepository.savePPHState(session);
    } else {
        // Only clear if we explicitly ended it (startTime is null)
        if (session.startTime === null) {
            PatientRepository.clearPPHState();
        }
    }
  }, [session, isInitialized]);

  const startPPH = () => {
    AuditService.log('CLINICAL_ACTION', 'PPH Emergency Protocol STARTED');
    setSession({
      isActive: true,
      startTime: Date.now(),
      medsAdministered: [],
      isRefractory: false,
    });
  };

  const endPPH = () => {
    if (confirm("End Emergency Session? This will reset the timer.")) {
        AuditService.log('CLINICAL_ACTION', `PPH Protocol ENDED. Duration: ${elapsed}s. Meds given: ${session.medsAdministered.join(', ')}`);
        setSession({ isActive: false, startTime: null, medsAdministered: [], isRefractory: false });
        setElapsed(0);
        // Persistence effect will handle clearing storage
    }
  };

  const toggleMed = (med: string) => {
    setSession(prev => {
        const wasChecked = prev.medsAdministered.includes(med);
        const meds = wasChecked
            ? prev.medsAdministered.filter(m => m !== med)
            : [...prev.medsAdministered, med];
        
        // Audit log the change
        if (!wasChecked) {
            AuditService.log('CLINICAL_ACTION', `Action Completed: ${med} administered/done.`);
        }

        return { ...prev, medsAdministered: meds };
    });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // --- UI: Resume Confirmation Modal ---
  if (pendingSession) {
      const minutesAgo = pendingSession.startTime ? Math.floor((Date.now() - pendingSession.startTime) / 60000) : 0;
      return (
          <div className="absolute inset-0 z-50 bg-slate-900/90 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
                  <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                      <ArchiveRestore className="w-8 h-8 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-2">Resume Session?</h3>
                  <p className="text-slate-600 font-medium mb-6">
                      A previous PPH session was found. Resume it?
                      <br/>
                      <span className="text-xs text-slate-400 font-bold mt-2 block">Started {minutesAgo} minutes ago</span>
                  </p>
                  <div className="flex flex-col gap-3">
                      <Button variant="success" fullWidth onClick={confirmResume}>
                          <Play size={20} /> RESUME
                      </Button>
                      <Button variant="ghost" fullWidth onClick={discardSession} className="text-red-600 hover:bg-red-50">
                          <Trash2 size={20} /> Decline & New Session
                      </Button>
                  </div>
              </div>
          </div>
      );
  }

  // --- UI: Loading State ---
  if (!isInitialized) {
      return <div className="h-full bg-slate-50" />; // Prevent flash of content
  }

  // --- UI: Idle State ---
  if (!session.isActive) {
    return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-8 bg-slate-50 animate-in fade-in duration-300">
            <div className="bg-red-100 p-8 rounded-full shadow-inner">
                <Clock className="w-20 h-20 text-red-600" />
            </div>
            <div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">PPH EMERGENCY</h2>
                <p className="text-slate-500 font-medium">Start the timer immediately upon diagnosis of excessive bleeding.</p>
            </div>
            <Button variant="danger" fullWidth className="h-20 text-2xl shadow-xl shadow-red-200" onClick={startPPH}>
                START PROTOCOL
            </Button>
        </div>
    );
  }

  // --- UI: Active State ---
  return (
    <div className={`flex flex-col h-full transition-colors duration-1000 ${session.isRefractory ? 'bg-red-600' : 'bg-slate-50'}`}>
        
        {/* Timer Display */}
        <div className={`p-6 pb-8 flex justify-between items-center shadow-md z-10 ${session.isRefractory ? 'bg-red-700 text-white' : 'bg-white text-slate-900'}`}>
            <div>
                <p className={`font-bold text-xs uppercase ${session.isRefractory ? 'text-red-200' : 'text-slate-400'}`}>Elapsed Time</p>
                <div className={`text-6xl font-mono font-black tracking-tighter leading-none ${session.isRefractory ? 'text-white animate-pulse' : 'text-slate-800'}`}>
                    {formatTime(elapsed)}
                </div>
            </div>
            <Button 
                variant={session.isRefractory ? "outline" : "outline"} 
                onClick={endPPH}
                className={session.isRefractory ? 'border-white text-white hover:bg-white/20' : ''}
            >
                STOP
            </Button>
        </div>

        {/* Refractory Warning */}
        {session.isRefractory && (
            <div className="bg-yellow-400 text-black font-black text-center py-3 text-lg animate-bounce sticky top-0 z-20 shadow-md flex items-center justify-center gap-2">
                <AlertOctagon /> REFRACTORY PPH - PREPARE TRANSFER
            </div>
        )}

        {/* E-MOTIVE Action Wizard */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div className={`bg-white rounded-xl p-5 shadow-sm border-l-8 ${session.isRefractory ? 'border-slate-800' : 'border-teal-500'}`}>
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                    <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-sm">PHASE 1</span> 
                    E-MOTIVE ACTIONS
                </h3>
                
                <div className="space-y-3">
                    <CheckboxItem 
                        label="Uterine Massage" 
                        icon={<HandMetal size={20} />} 
                        checked={session.medsAdministered.includes('Massage')} 
                        onChange={() => toggleMed('Massage')} 
                    />
                    <CheckboxItem 
                        label="Oxytocin 10 IU IM/IV" 
                        icon={<Syringe size={20} />} 
                        checked={session.medsAdministered.includes('Oxytocin')} 
                        onChange={() => toggleMed('Oxytocin')} 
                    />
                    <CheckboxItem 
                        label="Tranexamic Acid (TXA) 1g" 
                        icon={<Droplet size={20} />} 
                        checked={session.medsAdministered.includes('TXA')} 
                        onChange={() => toggleMed('TXA')} 
                    />
                    <CheckboxItem 
                        label="Empty Bladder" 
                        icon={<div className="w-5 font-bold text-center">E</div>} 
                        checked={session.medsAdministered.includes('EmptyBladder')} 
                        onChange={() => toggleMed('EmptyBladder')} 
                    />
                </div>
            </div>

             <div className="bg-slate-100 rounded-xl p-5 border border-slate-200">
                <h3 className="font-bold text-slate-500 text-sm uppercase mb-3">Secondary Measures</h3>
                 <div className="space-y-3">
                    <CheckboxItem 
                        label="IV Access (2x 16G)" 
                        checked={session.medsAdministered.includes('IV')} 
                        onChange={() => toggleMed('IV')} 
                    />
                    <CheckboxItem 
                        label="Carbetocin / Ergometrine" 
                        checked={session.medsAdministered.includes('Ergo')} 
                        onChange={() => toggleMed('Ergo')} 
                    />
                </div>
             </div>
        </div>
    </div>
  );
};

const CheckboxItem = ({ label, icon, checked, onChange }: any) => (
    <button 
        onClick={onChange}
        className={`w-full p-4 rounded-lg border-2 flex items-center gap-4 transition-all ${
            checked 
                ? 'bg-teal-50 border-teal-600 text-teal-900' 
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
        }`}
    >
        <div className={`w-8 h-8 rounded flex items-center justify-center border-2 transition-colors ${
            checked ? 'bg-teal-600 border-teal-600' : 'bg-transparent border-slate-300'
        }`}>
            {checked && <CheckSquare className="text-white w-5 h-5" />}
        </div>
        {icon && <div className={checked ? 'text-teal-700' : 'text-slate-400'}>{icon}</div>}
        <span className="font-bold text-lg text-left">{label}</span>
    </button>
);