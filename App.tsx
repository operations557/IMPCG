import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Triage } from './components/Triage';
import { PPHManager } from './components/PPH';
import { BancRisk } from './components/BancRisk';
import { History } from './components/History';
import { GeminiAssistant } from './components/GeminiAssistant';
import { ReferralGenerator } from './components/ReferralGenerator';
import { Partogram } from './components/Partogram';
import { DrugReference } from './components/DrugReference';
import { GuidelinesIndex } from './components/GuidelinesIndex';
import { ProtocolsIndex } from './components/ProtocolsIndex';
import { CancerManagement } from './components/CancerManagement';
import { TabView, PatientRecord, TriageColor } from './types';
import { PatientRepository } from './services/storageService';
import { Activity, Home, Menu, LineChart, Pill, Book, ClipboardList } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabView>('DASHBOARD');
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);

  // Safety Check: Resume PPH Session if active (Panic-proof redundancy)
  useEffect(() => {
    const pphState = PatientRepository.getPPHState();
    if (pphState && pphState.isActive && pphState.startTime) {
        // Clinical Safety: Only resume if session is < 12 hours old (avoid stale sessions from days ago)
        const age = Date.now() - pphState.startTime;
        const twelveHours = 12 * 60 * 60 * 1000;
        
        if (age < twelveHours) {
            setActiveTab('PPH');
        }
    }
  }, []);

  const handleReferral = (record: PatientRecord) => {
    setSelectedPatient(record);
    setActiveTab('REFERRAL');
  };

  const handlePartogramTransfer = () => {
    // Create a temporary emergency record for the Partogram transfer
    // In a full app, this would pull the specific patient context
    const emergencyRecord: PatientRecord = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        triageResult: TriageColor.RED, // Assumed RED due to Action Line breach
        synced: false,
        notes: 'Action Line Breached on Partogram. Urgent Transfer Required.',
        vitals: {
            systolicBP: '',
            diastolicBP: '',
            heartRate: '',
            respiratoryRate: '',
            temperature: '',
            consciousness: 'ALERT'
        }
    };
    handleReferral(emergencyRecord);
  };

  // Theme: Primary Teal 700 (#0f766e)
  return (
    <div className="max-w-md mx-auto h-screen bg-slate-50 flex flex-col relative overflow-hidden shadow-2xl">
      {/* AppBar / Header */}
      <header className="bg-teal-700 text-white p-4 pt-6 shrink-0 shadow-md z-20">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
                IMPCG <span className="text-teal-200">ASSISTANT</span>
            </h1>
            <p className="text-teal-100 text-[10px] uppercase font-bold tracking-widest">Offline-First Clinical Support</p>
          </div>
          <div className="flex gap-1">
             <button onClick={() => setActiveTab('PROTOCOLS')} className={`p-2 rounded-full transition-colors ${activeTab === 'PROTOCOLS' ? 'bg-teal-800 text-white' : 'hover:bg-teal-600'}`}>
                <ClipboardList className="w-6 h-6" />
             </button>
             <button onClick={() => setActiveTab('GUIDELINES')} className={`p-2 rounded-full transition-colors ${activeTab === 'GUIDELINES' ? 'bg-teal-800 text-white' : 'hover:bg-teal-600'}`}>
                <Book className="w-6 h-6" />
             </button>
             <button onClick={() => setActiveTab('DRUGS')} className={`p-2 rounded-full transition-colors ${activeTab === 'DRUGS' ? 'bg-teal-800 text-white' : 'hover:bg-teal-600'}`}>
                <Pill className="w-6 h-6" />
             </button>
             <button onClick={() => setActiveTab('PARTOGRAM')} className={`p-2 rounded-full transition-colors ${activeTab === 'PARTOGRAM' ? 'bg-teal-800 text-white' : 'hover:bg-teal-600'}`}>
                <LineChart className="w-6 h-6" />
             </button>
             <button onClick={() => setActiveTab('DASHBOARD')} className={`p-2 rounded-full transition-colors ${activeTab === 'DASHBOARD' ? 'bg-teal-800 text-white' : 'hover:bg-teal-600'}`}>
                <Home className="w-6 h-6" />
             </button>
          </div>
        </div>
      </header>

      {/* Main Content Area - "Body" */}
      <main className="flex-1 overflow-y-auto bg-slate-100">
        {activeTab === 'DASHBOARD' && <Dashboard onNavigate={setActiveTab} />}
        {activeTab === 'TRIAGE' && <div className="p-4"><Triage /></div>}
        {activeTab === 'PPH' && <PPHManager />}
        {activeTab === 'BANC' && <BancRisk />}
        {activeTab === 'HISTORY' && <div className="p-4"><History onRefer={handleReferral} /></div>}
        {activeTab === 'AI_ASSISTANT' && <div className="p-4 h-full"><GeminiAssistant /></div>}
        {activeTab === 'PARTOGRAM' && <div className="p-4 h-full"><Partogram onRequestTransfer={handlePartogramTransfer} /></div>}
        {activeTab === 'DRUGS' && <DrugReference />}
        {activeTab === 'GUIDELINES' && <GuidelinesIndex />}
        {activeTab === 'PROTOCOLS' && <ProtocolsIndex />}
        {activeTab === 'CANCER' && <CancerManagement />}
        {activeTab === 'REFERRAL' && selectedPatient && (
          <div className="p-4 h-full">
            <ReferralGenerator record={selectedPatient} onBack={() => setActiveTab('HISTORY')} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;