import React, { useEffect, useState } from 'react';
import { PatientRepository } from '../services/storageService';
import { AuditService } from '../services/auditService';
import { PatientRecord, TriageColor } from '../types';
import { Share2, Eye, ArrowLeft, Clock, Activity, StickyNote, Share, CloudCheck, CloudUpload } from 'lucide-react';
import { Button } from './Button';

interface HistoryProps {
  onRefer?: (record: PatientRecord) => void;
}

export const History: React.FC<HistoryProps> = ({ onRefer }) => {
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [viewingRecord, setViewingRecord] = useState<PatientRecord | null>(null);

  useEffect(() => {
    setPatients(PatientRepository.getAllRecords());
  }, []);

  const handleShare = async (record: PatientRecord) => {
    const time = new Date(record.timestamp).toLocaleString();
    const v = record.vitals;
    
    const bp = (v.systolicBP && v.diastolicBP) ? `${v.systolicBP}/${v.diastolicBP} mmHg` : 'MISSING';
    const hr = v.heartRate ? `${v.heartRate} bpm` : 'MISSING';
    const rr = v.respiratoryRate ? `${v.respiratoryRate} /min` : 'MISSING';
    const temp = v.temperature ? `${v.temperature} °C` : 'MISSING';
    const avpu = v.consciousness;

    let assessment = "Routine referral.";
    if (record.triageResult === TriageColor.RED) {
      assessment = "CRITICAL: Patient exhibits signs of hemodynamic instability or severe distress.";
    } else if (record.triageResult === TriageColor.YELLOW) {
      assessment = "URGENT: Abnormal vitals detected requiring medical review.";
    }

    let recommendation = "Review at District Hospital.";
    if (record.triageResult === TriageColor.RED) {
      recommendation = "URGENT AMBULANCE TRANSFER REQUIRED. Please accept patient for stabilization.";
    }

    const text = `**URGENT REFERRAL NOTE**
Time: ${time}

SITUATION:
Classification: ${record.triageResult} (${record.triageResult === 'RED' ? 'CRITICAL' : 'Observation'})

VITALS:
BP: ${bp}
HR: ${hr}
RR: ${rr}
Temp: ${temp}
Consciousness: ${avpu}

ASSESSMENT:
${assessment}

RECOMMENDATION:
${recommendation}`;

    if (navigator.share) {
        try {
            await navigator.share({
                title: 'IMPCG Patient Referral',
                text: text,
            });
            AuditService.log('CLINICAL_ACTION', `Shared referral note for Patient ${record.id}`, record.id);
        } catch (err) {
            console.log('Share failed', err);
        }
    } else {
        navigator.clipboard.writeText(text);
        AuditService.log('CLINICAL_ACTION', `Copied referral note for Patient ${record.id}`, record.id);
        alert("Referral note copied to clipboard.");
    }
  };

  // --- DETAIL VIEW ---
  if (viewingRecord) {
    const { vitals, triageResult, timestamp, notes, synced } = viewingRecord;
    
    const colorStyles = 
        triageResult === TriageColor.RED ? 'bg-red-100 text-red-900 border-red-200' :
        triageResult === TriageColor.YELLOW ? 'bg-yellow-100 text-yellow-900 border-yellow-200' :
        'bg-green-100 text-green-900 border-green-200';

    const headerBg = 
        triageResult === TriageColor.RED ? 'bg-red-600' :
        triageResult === TriageColor.YELLOW ? 'bg-yellow-500' :
        'bg-green-600';

    return (
        <div className="flex flex-col h-full bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10 flex items-center gap-3 shadow-sm">
                <button 
                    onClick={() => setViewingRecord(null)}
                    className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-600"
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="flex-1">
                    <h2 className="font-black text-slate-800 text-lg leading-none">Patient Record</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs font-bold text-slate-400 uppercase">
                            {new Date(timestamp).toLocaleString()}
                        </p>
                        {/* Detail View Sync Status */}
                        {synced ? (
                            <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded-full flex items-center gap-1 font-bold">
                                <CloudCheck size={10} /> SYNCED
                            </span>
                        ) : (
                            <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full flex items-center gap-1 font-bold">
                                <CloudUpload size={10} /> PENDING SYNC
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto flex-1">
                
                {/* Triage Banner */}
                <div className={`rounded-xl overflow-hidden shadow-sm border-2 ${colorStyles.split(' ')[2]}`}>
                    <div className={`${headerBg} p-3 text-white flex justify-between items-center`}>
                        <span className="font-black uppercase tracking-wider">TRIAGE RESULT</span>
                        <Activity className="opacity-80" />
                    </div>
                    <div className={`p-6 text-center ${colorStyles.split(' ')[0]}`}>
                        <h1 className="text-4xl font-black uppercase tracking-tight">{triageResult}</h1>
                    </div>
                </div>

                {/* Vitals Grid */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                        <Activity size={14} /> Recorded Vitals
                    </h3>
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                        <VitalItem label="Blood Pressure" value={`${vitals.systolicBP}/${vitals.diastolicBP}`} unit="mmHg" />
                        <VitalItem label="Heart Rate" value={vitals.heartRate} unit="bpm" />
                        <VitalItem label="Respiratory Rate" value={vitals.respiratoryRate} unit="/min" />
                        <VitalItem label="Temperature" value={vitals.temperature} unit="°C" />
                        <div className="col-span-2 border-t border-slate-100 pt-4">
                             <p className="text-xs font-bold text-slate-400 uppercase mb-1">Consciousness (AVPU)</p>
                             <p className="text-xl font-mono font-bold text-slate-800">{vitals.consciousness}</p>
                        </div>
                    </div>
                </div>

                {/* Notes Section */}
                <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4 shadow-sm">
                     <h3 className="text-xs font-bold text-yellow-700 uppercase mb-3 flex items-center gap-2">
                        <StickyNote size={14} /> Clinical Notes
                    </h3>
                    <p className="text-slate-800 font-medium whitespace-pre-wrap leading-relaxed">
                        {notes || "No clinical notes recorded for this encounter."}
                    </p>
                </div>

                {/* Actions */}
                {onRefer && (
                    <div className="mt-4 flex gap-3">
                        <Button 
                            variant="primary" 
                            onClick={() => onRefer(viewingRecord)}
                            className="flex-1 shadow-lg"
                        >
                            <Share2 className="mr-2" size={20} /> Generate Referral
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={() => handleShare(viewingRecord)}
                            className="flex-1 shadow-sm bg-white"
                        >
                            <Share className="mr-2" size={20} /> Share Referral
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
  }

  // --- LIST VIEW ---

  if (patients.length === 0) {
    return <div className="p-8 text-center text-slate-400 font-bold">No saved encounters.</div>;
  }

  return (
    <div className="space-y-4 pb-20 p-4">
      {patients.map((p) => (
        <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 group active:scale-[0.99] transition-transform">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                        p.triageResult === TriageColor.RED ? 'bg-red-100 text-red-600' :
                        p.triageResult === TriageColor.YELLOW ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                    }`}>
                        <Clock size={20} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-slate-400 uppercase font-bold">
                                {new Date(p.timestamp).toLocaleDateString()}
                            </p>
                            {/* Sync Status Badge */}
                            {p.synced ? (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100">
                                    <CloudCheck size={10} /> SYNCED
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                                    <CloudUpload size={10} /> PENDING
                                </span>
                            )}
                        </div>
                        <p className="text-sm font-bold text-slate-700 mt-0.5">
                             {new Date(p.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                    </div>
                </div>
                <div className={`px-3 py-1 rounded-full font-bold text-xs border ${
                    p.triageResult === TriageColor.RED ? 'bg-red-100 text-red-800 border-red-200' :
                    p.triageResult === TriageColor.YELLOW ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                    'bg-green-100 text-green-800 border-green-200'
                }`}>
                    {p.triageResult}
                </div>
            </div>

            {/* Mini Vitals Summary */}
            <div className="flex gap-4 mb-4 text-xs font-mono text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                 <span>BP: <b className="text-slate-700">{p.vitals.systolicBP}/{p.vitals.diastolicBP}</b></span>
                 <span>HR: <b className="text-slate-700">{p.vitals.heartRate}</b></span>
                 {p.notes && <span className="flex items-center gap-1 text-slate-400"><StickyNote size={10} /> Note</span>}
            </div>
            
            <div className="flex gap-3">
                <button 
                    onClick={() => setViewingRecord(p)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-700 text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                >
                    <Eye size={16} /> VIEW DETAILS
                </button>
                {onRefer && (
                    <button 
                        onClick={() => onRefer(p)}
                        className="flex-1 py-2 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg text-teal-800 text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                        <Share2 size={16} /> REFERRAL
                    </button>
                )}
            </div>
        </div>
      ))}
    </div>
  );
};

const VitalItem = ({ label, value, unit }: { label: string, value: string | number, unit: string }) => (
    <div>
        <p className="text-xs font-bold text-slate-400 uppercase mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
            <span className="text-2xl font-mono font-bold text-slate-800">{value || '--'}</span>
            <span className="text-xs font-bold text-slate-500">{unit}</span>
        </div>
    </div>
);