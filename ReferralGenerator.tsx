import React, { useMemo, useEffect } from 'react';
import { PatientRecord, TriageColor } from '../types';
import { Button } from './Button';
import { Copy, Share, Printer, ArrowLeft, AlertTriangle } from 'lucide-react';
import { AuditService } from '../services/auditService';

interface ReferralGeneratorProps {
  record: PatientRecord;
  onBack: () => void;
}

export const ReferralGenerator: React.FC<ReferralGeneratorProps> = ({ record, onBack }) => {
  
  // SBAR Logic Engine
  const sbarData = useMemo(() => {
    const time = new Date(record.timestamp).toLocaleString();
    const v = record.vitals;
    
    // Clinical Logic: Flag missing data
    const bp = (v.systolicBP && v.diastolicBP) ? `${v.systolicBP}/${v.diastolicBP} mmHg` : 'MISSING';
    const hr = v.heartRate ? `${v.heartRate} bpm` : 'MISSING';
    const rr = v.respiratoryRate ? `${v.respiratoryRate} /min` : 'MISSING';
    const temp = v.temperature ? `${v.temperature} °C` : 'MISSING';
    const avpu = v.consciousness;

    // Assessment Logic
    let assessment = "Routine referral.";
    if (record.triageResult === TriageColor.RED) {
      assessment = "CRITICAL: Patient exhibits signs of hemodynamic instability or severe distress.";
    } else if (record.triageResult === TriageColor.YELLOW) {
      assessment = "URGENT: Abnormal vitals detected requiring medical review.";
    }

    // Recommendation Logic
    let recommendation = "Review at District Hospital.";
    if (record.triageResult === TriageColor.RED) {
      recommendation = "URGENT AMBULANCE TRANSFER REQUIRED. Please accept patient for stabilization.";
    }

    // Raw Text for Clipboard
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

    return { text, bp, hr, rr, temp, avpu, assessment, recommendation, time };
  }, [record]);

  // Log on mount
  useEffect(() => {
    AuditService.log('GENERATE_REFERRAL', `Referral generated for Patient ${record.id}. Triage: ${record.triageResult}`, record.id);
  }, [record]);

  const handleCopy = () => {
    navigator.clipboard.writeText(sbarData.text);
    AuditService.log('CLINICAL_ACTION', `Referral note copied to clipboard for Patient ${record.id}`, record.id);
    alert("Referral note copied to clipboard.");
  };

  const handleShare = async () => {
    AuditService.log('CLINICAL_ACTION', `Share intent triggered for Patient ${record.id}`, record.id);
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'IMPCG Patient Referral',
          text: sbarData.text,
        });
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      handleCopy();
    }
  };

  const hasMissingData = sbarData.bp === 'MISSING' || sbarData.hr === 'MISSING';

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full">
            <ArrowLeft size={24} className="text-slate-600" />
        </button>
        <h2 className="text-xl font-black text-slate-800">Generate Referral</h2>
      </div>

      {hasMissingData && (
        <div className="bg-orange-100 p-3 rounded-lg border border-orange-200 flex items-start gap-3">
            <AlertTriangle className="text-orange-600 shrink-0 mt-0.5" size={20} />
            <div>
                <p className="font-bold text-orange-800 text-sm">INCOMPLETE VITALS</p>
                <p className="text-xs text-orange-700">Some critical values are missing. Please verify before sending.</p>
            </div>
        </div>
      )}

      {/* Preview Card */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-300 overflow-hidden flex flex-col">
        <div className="bg-slate-100 p-3 border-b border-slate-200 flex justify-between items-center">
            <span className="font-mono font-bold text-slate-500 text-xs">PREVIEW: SBAR FORMAT</span>
            <span className="bg-slate-800 text-white text-[10px] font-bold px-2 py-0.5 rounded">TEXT</span>
        </div>
        <textarea 
            readOnly 
            value={sbarData.text}
            className="flex-1 w-full p-4 font-mono text-sm leading-relaxed resize-none outline-none text-slate-800"
        />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 shrink-0">
        <Button variant="outline" onClick={handleCopy}>
            <Copy size={20} /> Copy Text
        </Button>
        <Button variant="primary" onClick={handleShare}>
            <Share size={20} /> Share Note
        </Button>
        <Button variant="ghost" onClick={() => window.print()} className="col-span-2">
            <Printer size={20} /> Print Form
        </Button>
      </div>
    </div>
  );
};