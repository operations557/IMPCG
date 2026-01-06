import React, { useEffect, useState } from 'react';
import { TabView, PatientRecord, TriageColor } from '../types';
import { PatientRepository, PatientStats } from '../services/storageService';
import { AlertTriangle, PlusCircle, BookOpen, Activity, Search, ClipboardList, TrendingUp, Pill } from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: TabView) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<PatientStats>({ highRisk: 0, lowRisk: 0, total: 0 });
  const [recentPatients, setRecentPatients] = useState<PatientRecord[]>([]);

  useEffect(() => {
    // Load data on mount
    setStats(PatientRepository.getStats());
    setRecentPatients(PatientRepository.getAllRecords().slice(0, 3)); // Get top 3
  }, []);

  return (
    <div className="h-full flex flex-col p-4 gap-4">
      {/* 1. Critical Emergency Card - Top 25% */}
      <button 
        onClick={() => onNavigate('PPH')}
        className="flex-[0.3] bg-red-600 rounded-2xl p-6 shadow-lg shadow-red-200 active:scale-98 transition-transform flex flex-col justify-center items-center text-white relative overflow-hidden group"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-red-400/30 animate-pulse" />
        <AlertTriangle className="w-12 h-12 mb-2 group-hover:scale-110 transition-transform" />
        <h2 className="text-2xl font-black uppercase tracking-tight text-center leading-none">
          EMERGENCY
        </h2>
        <p className="font-bold text-red-100 mt-1 text-xs uppercase tracking-widest">PPH / Eclampsia</p>
      </button>

      {/* 2. Shift Statistics (New) */}
      <div className="flex gap-3 h-24">
        <div className="flex-1 bg-white rounded-xl border border-slate-200 p-3 flex flex-col justify-center items-center shadow-sm">
            <span className="text-3xl font-black text-slate-800">{stats.total}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Patients</span>
        </div>
        <div className="flex-1 bg-white rounded-xl border border-slate-200 p-3 flex flex-col justify-center items-center shadow-sm relative overflow-hidden">
            {stats.highRisk > 0 && <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full m-2 animate-pulse" />}
            <span className={`text-3xl font-black ${stats.highRisk > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {stats.highRisk}
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-400">High Risk</span>
        </div>
      </div>

      {/* 3. Primary Actions Grid */}
      <div className="grid grid-cols-2 gap-3 shrink-0">
        <ActionButton 
            onClick={() => onNavigate('BANC')} 
            icon={<PlusCircle size={24} />} 
            label="BANC Plus" 
            subLabel="Risk Calc"
            colorClass="text-teal-700 bg-teal-100"
        />
        <ActionButton 
            onClick={() => onNavigate('TRIAGE')} 
            icon={<Activity size={24} />} 
            label="MEOWS" 
            subLabel="Triage"
            colorClass="text-indigo-700 bg-indigo-100"
        />
        <ActionButton 
            onClick={() => onNavigate('DRUGS')} 
            icon={<Pill size={24} />} 
            label="Drugs" 
            subLabel="Dosages"
            colorClass="text-blue-700 bg-blue-100"
        />
         <ActionButton 
            onClick={() => onNavigate('AI_ASSISTANT')} 
            icon={<Search size={24} />} 
            label="Guidelines" 
            subLabel="Search"
            colorClass="text-purple-700 bg-purple-100"
        />
        <div className="col-span-2">
            <ActionButton 
                onClick={() => onNavigate('CANCER')} 
                icon={<Activity size={24} />} 
                label="Oncology" 
                subLabel="Cancer Management (Ch 27)"
                colorClass="text-pink-700 bg-pink-100"
            />
        </div>
      </div>

      {/* 4. Recent Patients List (Offline Data) */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                <ClipboardList size={16} /> RECENT ACTIVITY
            </h3>
            <button onClick={() => onNavigate('HISTORY')} className="text-xs font-bold text-teal-600 uppercase">View All</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {recentPatients.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <BookOpen size={24} className="mb-2 opacity-50" />
                    <p className="text-xs font-bold">No recent patients</p>
                </div>
            ) : (
                recentPatients.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-slate-700 text-sm">
                                    {new Date(p.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                                {p.triageResult === TriageColor.RED && (
                                    <span className="bg-red-100 text-red-800 text-[10px] font-bold px-1.5 py-0.5 rounded">CRITICAL</span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                                BP: {p.vitals.systolicBP}/{p.vitals.diastolicBP} • HR: {p.vitals.heartRate}
                            </p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${
                            p.triageResult === TriageColor.RED ? 'bg-red-500' :
                            p.triageResult === TriageColor.YELLOW ? 'bg-yellow-400' :
                            'bg-green-500'
                        }`} />
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ onClick, icon, label, subLabel, colorClass }: any) => (
    <button 
        onClick={onClick}
        className="bg-white rounded-xl p-3 shadow-sm border border-slate-200 active:bg-slate-50 flex items-center gap-3 text-left w-full"
    >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
            {icon}
        </div>
        <div>
            <h3 className="font-bold text-slate-800 text-sm leading-tight">{label}</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase">{subLabel}</p>
        </div>
    </button>
);