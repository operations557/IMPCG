import React, { useState } from 'react';
import { Button } from './Button';
import { RiskLevel } from '../types';
import { AlertTriangle, ShieldCheck, Thermometer, Calendar } from 'lucide-react';
import { AuditService } from '../services/auditService';
import { MomConnect } from './MomConnect';

export const BancRisk: React.FC = () => {
  const [systolic, setSystolic] = useState<string>('');
  const [diastolic, setDiastolic] = useState<string>('');
  const [protein, setProtein] = useState<number>(0); // 0=Neg, 1=1+, 2=2+, 3=3+
  const [gestationalAge, setGestationalAge] = useState<string>('');
  const [risk, setRisk] = useState<RiskLevel | null>(null);

  // --- Clinical Logic Engine ---
  const calculateRisk = () => {
    const sys = parseInt(systolic);
    const dia = parseInt(diastolic);
    const ga = parseInt(gestationalAge);

    if (isNaN(sys) || isNaN(dia)) return;

    let calculatedRisk = RiskLevel.LOW;

    // Strict Guidelines Logic
    if (sys >= 160 || dia >= 110) {
      calculatedRisk = RiskLevel.CRITICAL;
    } else if ((sys >= 140 || dia >= 90) && protein >= 2) {
      calculatedRisk = RiskLevel.HIGH; // Pre-Eclampsia
    } else {
      calculatedRisk = RiskLevel.LOW;
    }

    setRisk(calculatedRisk);

    // Audit Log
    AuditService.log(
        'RISK_ASSESSMENT', 
        `Calculated BANC Risk: ${calculatedRisk}. Inputs: BP ${sys}/${dia}, Protein ${protein}+, GA: ${isNaN(ga) ? 'Unspecified' : ga + 'w'}`
    );
  };

  const getRiskUI = () => {
    switch (risk) {
      case RiskLevel.CRITICAL:
        return {
          bg: 'bg-red-600',
          title: 'SEVERE HYPERTENSION / ECLAMPSIA RISK',
          action: 'START MAGNESIUM SULPHATE',
          icon: <AlertTriangle className="w-12 h-12 text-white" />
        };
      case RiskLevel.HIGH:
        return {
          bg: 'bg-orange-500',
          title: 'POSSIBLE PRE-ECLAMPSIA',
          action: 'REFER TO HOSPITAL TODAY',
          icon: <AlertTriangle className="w-12 h-12 text-white" />
        };
      case RiskLevel.LOW:
        return {
          bg: 'bg-green-600',
          title: 'ROUTINE ANC',
          action: 'CONTINUE STANDARD CARE',
          icon: <ShieldCheck className="w-12 h-12 text-white" />
        };
      default:
        return null;
    }
  };

  const riskUI = getRiskUI();

  return (
    <div className="p-4 flex flex-col h-full bg-slate-50 overflow-y-auto">
       <div className="mb-6">
        <h2 className="text-2xl font-black text-slate-800">BANC Plus</h2>
        <p className="text-slate-500 font-bold">Hypertension Risk Assessment</p>
       </div>

       {/* MomConnect Integration */}
       <MomConnect />

       {/* Form */}
       <div className="space-y-4 mb-8">
         {/* Gestational Age */}
         <div className="space-y-1">
             <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                 <Calendar size={12} /> Gestational Age (Weeks)
             </label>
             <input 
                 type="number" 
                 value={gestationalAge} 
                 onChange={(e) => setGestationalAge(e.target.value)}
                 className="w-full h-14 border-2 border-slate-300 rounded-lg px-4 text-2xl font-bold font-mono focus:border-teal-600 outline-none"
                 placeholder="e.g. 28"
             />
         </div>

         <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Systolic</label>
                <input 
                    type="number" 
                    value={systolic} 
                    onChange={(e) => setSystolic(e.target.value)}
                    className="w-full h-14 border-2 border-slate-300 rounded-lg px-4 text-2xl font-bold font-mono focus:border-teal-600 outline-none"
                    placeholder="120"
                />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Diastolic</label>
                <input 
                    type="number" 
                    value={diastolic} 
                    onChange={(e) => setDiastolic(e.target.value)}
                    className="w-full h-14 border-2 border-slate-300 rounded-lg px-4 text-2xl font-bold font-mono focus:border-teal-600 outline-none"
                    placeholder="80"
                />
            </div>
         </div>

         <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Urine Protein Dipstick</label>
            <div className="flex gap-2">
                {[0, 1, 2, 3].map((val) => (
                    <button
                        key={val}
                        onClick={() => setProtein(val)}
                        className={`flex-1 h-12 rounded-lg font-bold border-2 transition-all ${
                            protein === val 
                                ? 'bg-teal-700 text-white border-teal-700' 
                                : 'bg-white text-slate-600 border-slate-300'
                        }`}
                    >
                        {val === 0 ? 'NEG' : `${val}+`}
                    </button>
                ))}
            </div>
         </div>

         <Button fullWidth onClick={calculateRisk}>CALCULATE RISK</Button>
       </div>

       {/* Result Card */}
       {riskUI && (
        <div className={`rounded-xl p-6 text-white shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500 ${riskUI.bg}`}>
            <div className="flex justify-center mb-4">{riskUI.icon}</div>
            <h3 className="text-center font-black text-xl leading-tight mb-2 uppercase">{riskUI.title}</h3>
            <div className="bg-white/20 rounded-lg p-3 text-center mt-4 backdrop-blur-sm">
                <p className="font-bold text-sm opacity-80 uppercase mb-1">Recommended Action</p>
                <p className="font-black text-lg">{riskUI.action}</p>
            </div>
        </div>
       )}
    </div>
  );
};