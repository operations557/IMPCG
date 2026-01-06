import React, { useState, useEffect } from 'react';
import { Vitals, TriageColor } from '../types';
import { TRIAGE_THRESHOLDS } from '../constants';
import { Button } from './Button';
import { AlertTriangle, Save, RotateCcw, StickyNote, Calendar, Activity } from 'lucide-react';
import { PatientRepository } from '../services/storageService';
import { AuditService } from '../services/auditService';

export const Triage: React.FC = () => {
  const initialVitals: Vitals = {
    systolicBP: '',
    diastolicBP: '',
    heartRate: '',
    respiratoryRate: '',
    temperature: '',
    consciousness: 'ALERT'
  };

  const [vitals, setVitals] = useState<Vitals>(initialVitals);
  const [gestationalAge, setGestationalAge] = useState<number | ''>('');
  const [triageColor, setTriageColor] = useState<TriageColor | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  // Clinical Logic: Calculate MEOWS
  useEffect(() => {
    calculateTriage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vitals]);

  const validateInput = () => {
    // Clinical Safety Check: Impossible values
    if (typeof vitals.systolicBP === 'number' && typeof vitals.diastolicBP === 'number') {
      if (vitals.systolicBP < vitals.diastolicBP) {
        setWarning("Systolic BP cannot be lower than Diastolic.");
        return false;
      }
    }
    setWarning(null);
    return true;
  };

  const calculateTriage = () => {
    if (!validateInput()) {
        setTriageColor(null);
        return;
    }

    // Logic Check: Ensure we don't show "GREEN" for an empty form
    const hasData = Object.entries(vitals).some(([key, val]) => {
        if (key === 'consciousness') return val !== 'ALERT'; // Default is ALERT
        return val !== '';
    });

    if (!hasData) {
        setTriageColor(null);
        return;
    }

    const { systolicBP, diastolicBP, heartRate, respiratoryRate, temperature, consciousness } = vitals;

    // Default to Green
    let result = TriageColor.GREEN;

    // Check Red Triggers (Immediate Obstetric Review)
    if (consciousness !== 'ALERT') result = TriageColor.RED;
    else if (typeof systolicBP === 'number' && (systolicBP < TRIAGE_THRESHOLDS.SYSTOLIC_RED_LOW || systolicBP >= TRIAGE_THRESHOLDS.SYSTOLIC_RED_HIGH)) result = TriageColor.RED;
    else if (typeof diastolicBP === 'number' && diastolicBP >= TRIAGE_THRESHOLDS.DIASTOLIC_RED_HIGH) result = TriageColor.RED;
    else if (typeof heartRate === 'number' && (heartRate < TRIAGE_THRESHOLDS.HR_RED_LOW || heartRate >= TRIAGE_THRESHOLDS.HR_RED_HIGH)) result = TriageColor.RED;
    else if (typeof respiratoryRate === 'number' && (respiratoryRate < TRIAGE_THRESHOLDS.RR_RED_LOW || respiratoryRate >= TRIAGE_THRESHOLDS.RR_RED_HIGH)) result = TriageColor.RED;
    else if (typeof temperature === 'number' && (temperature < TRIAGE_THRESHOLDS.TEMP_RED_LOW || temperature >= TRIAGE_THRESHOLDS.TEMP_RED_HIGH)) result = TriageColor.RED;
    
    // Check Yellow Triggers (Logic simplified for PoC - usually ranges between Green/Red)
    else if (typeof heartRate === 'number' && (heartRate >= 100 && heartRate < 120)) result = TriageColor.YELLOW;
    else if (typeof systolicBP === 'number' && (systolicBP >= 140 && systolicBP < 160)) result = TriageColor.YELLOW;

    setTriageColor(result);
  };

  const handleInputChange = (field: keyof Vitals, value: string) => {
    const numValue = value === '' ? '' : parseFloat(value);
    setVitals(prev => ({ ...prev, [field]: numValue }));
  };

  const handleClear = () => {
      setVitals(initialVitals);
      setNotes('');
      setGestationalAge('');
      setWarning(null);
      AuditService.log('CLINICAL_ACTION', 'User cleared Triage form inputs');
  };

  const saveEncounter = () => {
    if (!triageColor) return;
    
    const record = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      vitals,
      triageResult: triageColor,
      notes: notes.trim(),
      synced: false,
      gestationalAgeWeeks: gestationalAge === '' ? undefined : gestationalAge
    };

    PatientRepository.savePatientRecord(record);

    AuditService.log(
      'TRIAGE_SAVED', 
      `Saved ${triageColor} encounter. BP:${vitals.systolicBP}/${vitals.diastolicBP}, GA:${gestationalAge || 'N/A'}`,
      record.id
    );

    alert("Encounter saved locally.");
    handleClear();
  };

  // Helper to detect physiological outliers
  const isOutOfRange = (val: number | '', min: number, max: number) => {
      if (val === '') return false;
      return val < min || val > max;
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className={`p-6 rounded-xl border-4 text-center transition-colors duration-300 ${
        triageColor === TriageColor.RED ? 'bg-red-100 border-red-600 text-red-900' :
        triageColor === TriageColor.YELLOW ? 'bg-yellow-100 border-yellow-500 text-yellow-900' :
        triageColor === TriageColor.GREEN ? 'bg-green-100 border-green-600 text-green-900' :
        'bg-slate-100 border-slate-300 text-slate-400'
      }`}>
        <h2 className="text-2xl font-black uppercase tracking-widest">
            {triageColor || "ENTER VITALS"}
        </h2>
        {triageColor === TriageColor.RED && <p className="font-bold mt-2">URGENT: NOTIFY DOCTOR</p>}
        {triageColor === TriageColor.YELLOW && <p className="font-bold mt-2">REPEAT VITALS IN 30 MIN</p>}
      </div>

      {warning && (
        <div className="bg-orange-100 p-4 rounded-lg flex items-center gap-3 text-orange-900 border border-orange-300">
            <AlertTriangle className="shrink-0" />
            <span className="font-medium text-sm">{warning}</span>
        </div>
      )}

      {/* GA Input Block */}
      <div className="space-y-1">
          <label className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
              <Calendar size={16} /> Gestational Age (Weeks)
          </label>
          <input 
              type="number" 
              inputMode="numeric"
              value={gestationalAge}
              onChange={(e) => setGestationalAge(e.target.value === '' ? '' : parseInt(e.target.value))}
              placeholder="e.g. 32"
              className="w-full h-14 text-xl font-mono font-bold px-4 rounded-lg border-2 border-slate-300 focus:ring-2 focus:ring-slate-400 outline-none transition-colors"
          />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Combined BP Input */}
        <div className="col-span-2 space-y-1">
            <label className="text-sm font-bold text-slate-500 uppercase flex justify-between items-center">
                <span>Blood Pressure (mmHg)</span>
                {/* Physiological Range Error */}
                {(isOutOfRange(vitals.systolicBP, 60, 250) || isOutOfRange(vitals.diastolicBP, 30, 150)) && 
                    <span className="text-red-500 text-[10px] font-bold bg-red-50 px-2 py-0.5 rounded">CHECK VALUES</span>
                }
            </label>
            <div className="flex items-center rounded-lg border-2 border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-slate-400 focus-within:border-slate-400">
                <input 
                    type="number" 
                    inputMode="decimal"
                    placeholder="120"
                    value={vitals.systolicBP}
                    onChange={(e) => handleInputChange('systolicBP', e.target.value)}
                    className="w-full h-16 text-2xl font-mono font-bold text-center outline-none bg-white placeholder:text-slate-200"
                />
                <div className="text-2xl text-slate-300 font-light px-2">/</div>
                <input 
                    type="number" 
                    inputMode="decimal"
                    placeholder="80"
                    value={vitals.diastolicBP}
                    onChange={(e) => handleInputChange('diastolicBP', e.target.value)}
                    className="w-full h-16 text-2xl font-mono font-bold text-center outline-none bg-white placeholder:text-slate-200"
                />
            </div>
        </div>

        <InputBlock label="Heart Rate" suffix="bpm" 
          value={vitals.heartRate} onChange={(v: string) => handleInputChange('heartRate', v)} 
          error={isOutOfRange(vitals.heartRate, 30, 200)}
        />
        <InputBlock label="Resp. Rate" suffix="/min" 
          value={vitals.respiratoryRate} onChange={(v: string) => handleInputChange('respiratoryRate', v)} 
          error={isOutOfRange(vitals.respiratoryRate, 8, 60)}
        />
        <InputBlock label="Temp" suffix="°C" step="0.1" 
          value={vitals.temperature} onChange={(v: string) => handleInputChange('temperature', v)} 
          error={isOutOfRange(vitals.temperature, 35, 42)}
        />
        
        <div className="col-span-2 space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase">Consciousness</label>
            <div className="grid grid-cols-4 gap-2">
                {(['ALERT', 'VOICE', 'PAIN', 'UNRESPONSIVE'] as const).map((level) => (
                    <button
                        key={level}
                        onClick={() => setVitals(prev => ({...prev, consciousness: level}))}
                        className={`h-12 rounded font-bold text-xs md:text-sm ${vitals.consciousness === level ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'}`}
                    >
                        {level[0]}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* NOTES FIELD */}
      <div className="space-y-1">
         <label className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
            <StickyNote size={16} /> Clinical Notes (Optional)
         </label>
         <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter patient complaints, observations, or specific actions taken..."
            className="w-full h-24 p-4 rounded-lg border-2 border-slate-300 focus:border-slate-400 outline-none text-slate-700 font-medium resize-none bg-white"
         />
      </div>

      <div className="flex gap-4 mt-2">
        <Button variant="outline" onClick={handleClear} className="flex-1">
            <RotateCcw size={20} /> Clear
        </Button>
        <Button variant="primary" onClick={saveEncounter} className="flex-[2]" disabled={!triageColor}>
            <Save size={20} /> Save Encounter
        </Button>
      </div>
    </div>
  );
};

const InputBlock = ({ label, suffix, value, onChange, step = "1", error = false }: any) => (
    <div className="space-y-1">
        <label className="text-sm font-bold text-slate-500 uppercase flex justify-between">
            {label}
            {error && <span className="text-red-500 text-[10px] bg-red-50 px-1 rounded">CHECK VALUE</span>}
        </label>
        <div className="relative">
            <input 
                type="number" 
                inputMode="decimal"
                step={step}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full h-16 text-2xl font-mono font-bold px-4 rounded-lg border-2 focus:ring-2 focus:ring-slate-400 outline-none transition-colors ${
                    error ? 'border-red-500 bg-red-50 text-red-900' : 'border-slate-300'
                }`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">{suffix}</span>
        </div>
    </div>
);