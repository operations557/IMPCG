import React, { useState } from 'react';
import { AlertTriangle, Info, Heart, Activity, Stethoscope, Microscope, XCircle, CheckCircle, ArrowRight } from 'lucide-react';

type CancerTab = 'CERVICAL' | 'BREAST' | 'OVARIAN' | 'COUNSELLING';

export const CancerManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CancerTab>('CERVICAL');

  const renderContent = () => {
    switch (activeTab) {
      case 'CERVICAL':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-black text-lg text-slate-800 mb-2 flex items-center gap-2">
                    <Stethoscope className="text-pink-600" /> Diagnosis
                </h3>
                <ul className="space-y-2 text-sm font-medium text-slate-700">
                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" /> Symptoms: Vaginal bleeding (often post-coital), offensive discharge.</li>
                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" /> Speculum exam is mandatory for any bleeding in pregnancy.</li>
                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" /> <strong>Biopsy:</strong> Safe. Punch biopsy preferred. Avoid endocervical curettage (risk of ROM).</li>
                </ul>
            </div>

            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <h3 className="font-black text-indigo-900 mb-3">Management Strategy</h3>
                
                <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg border border-indigo-100 shadow-sm">
                        <span className="text-xs font-black bg-indigo-100 text-indigo-600 px-2 py-1 rounded uppercase">Early Pregnancy (&lt; 20 Weeks)</span>
                        <p className="text-sm font-bold text-slate-700 mt-2">Immediate treatment usually recommended.</p>
                        <p className="text-xs text-slate-500 mt-1">Spontaneous abortion often occurs with radical hysterectomy. Discuss termination if advanced stage.</p>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-indigo-100 shadow-sm">
                         <span className="text-xs font-black bg-teal-100 text-teal-700 px-2 py-1 rounded uppercase">Late Pregnancy (&gt; 20 Weeks)</span>
                        <p className="text-sm font-bold text-slate-700 mt-2">Delay treatment until fetal maturity if possible.</p>
						<p className="text-xs text-slate-500 mt-1">Aim for delivery &gt; 34 weeks. Monitor closely for progression.</p>
                    </div>
                </div>
            </div>

            <div className="bg-red-50 p-4 rounded-xl border border-red-200 flex items-start gap-3">
                <AlertTriangle className="text-red-600 shrink-0 mt-1" />
                <div>
                    <h4 className="font-black text-red-800 text-sm uppercase">Delivery Mode</h4>
                    <p className="text-sm text-red-900 font-medium leading-snug">
                        Caesarean Section is usually preferred to avoid obstruction or haemorrhage from the cervical mass.
                    </p>
                </div>
            </div>
          </div>
        );
      
      case 'BREAST':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-black text-lg text-slate-800 mb-2 flex items-center gap-2">
                    <Microscope className="text-pink-600" /> Workup
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-xs font-bold text-slate-400 uppercase">Ultrasound</p>
                        <p className="font-bold text-green-700 flex items-center gap-1"><CheckCircle size={14}/> Safe</p>
                        <p className="text-xs text-slate-500">First line investigation.</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-xs font-bold text-slate-400 uppercase">Mammogram</p>
                        <p className="font-bold text-orange-600 flex items-center gap-1"><AlertTriangle size={14}/> With Shielding</p>
                        <p className="text-xs text-slate-500">If U/S inconclusive.</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <TreatmentCard 
                    title="Surgery" 
                    status="SAFE" 
                    desc="Mastectomy or Breast Conserving Surgery can be performed in any trimester." 
                />
                <TreatmentCard 
                    title="Chemotherapy" 
                    status="CAUTION" 
                    desc="Contraindicated in 1st Trimester (Teratogenic). Safe in 2nd/3rd. STOP 3 weeks before delivery." 
                    isWarning
                />
                <TreatmentCard 
                    title="Radiotherapy" 
                    status="UNSAFE" 
                    desc="Contraindicated throughout pregnancy due to fetal risk." 
                    isDanger
                />
            </div>

            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <h4 className="font-black text-yellow-800 text-sm uppercase mb-1">Lactation</h4>
                <p className="text-sm text-yellow-900 font-medium">
                    Breastfeeding is contraindicated if the mother is receiving chemotherapy. Suppression of lactation may be required.
                </p>
            </div>
          </div>
        );

      case 'OVARIAN':
        return (
           <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-black text-lg text-slate-800 mb-2">Diagnosis</h3>
                <p className="text-sm text-slate-600 mb-3">Often incidental finding on routine ultrasound.</p>
                <div className="flex gap-2 items-center text-sm font-bold text-slate-700 bg-slate-50 p-2 rounded">
                    <XCircle size={16} className="text-slate-400" />
                    <span>CA-125 is unreliable (naturally elevated in pregnancy).</span>
                </div>
             </div>

             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-black text-lg text-slate-800 mb-2">Surgical Management</h3>
                <ul className="space-y-3">
                    <li className="bg-green-50 p-3 rounded-lg border border-green-100">
                        <span className="text-xs font-black text-green-700 uppercase block mb-1">Elective Surgery</span>
                        <span className="text-sm font-bold text-green-900">Best performed at 16-20 Weeks.</span>
                        <span className="text-xs block text-green-700 mt-1">Minimizes miscarriage risk while avoiding late pregnancy complications.</span>
                    </li>
                    <li className="bg-red-50 p-3 rounded-lg border border-red-100">
                        <span className="text-xs font-black text-red-700 uppercase block mb-1">Emergency Surgery</span>
                        <span className="text-sm font-bold text-red-900">Any Gestation</span>
                        <span className="text-xs block text-red-700 mt-1">Required for torsion, rupture, or haemorrhage.</span>
                    </li>
                </ul>
             </div>
           </div>
        );

      case 'COUNSELLING':
        return (
           <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
             <div className="bg-pink-50 border border-pink-100 p-6 rounded-xl text-center">
                <Heart className="w-16 h-16 text-pink-300 mx-auto mb-3" />
                <h3 className="font-black text-pink-900 text-xl">Holistic Care</h3>
                <p className="text-pink-800 text-sm font-medium mt-2">
                    Pregnancy with cancer is a complex psychological event. A multidisciplinary approach is essential.
                </p>
             </div>

             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <CounsellingItem 
                    title="Multidisciplinary Team (MDT)"
                    desc="Include Obstetrician, Oncologist, Neonatologist, Social Worker, and Psychologist."
                />
                <CounsellingItem 
                    title="Breaking Bad News"
                    desc="Ensure privacy. Allow a companion. Provide clear, jargon-free information. Document the discussion."
                />
                <CounsellingItem 
                    title="Pregnancy Continuation"
                    desc="Discuss risks of delaying treatment vs risks of termination vs risks of preterm delivery."
                />
                <CounsellingItem 
                    title="Future Fertility"
                    desc="Discuss impact of proposed treatments (chemo/surgery) on future reproductive potential."
                />
             </div>
           </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="p-4 bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Activity className="text-pink-600" /> 
            ONCOLOGY
        </h2>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-8">
            Chapter 27: Cancers in Pregnancy
        </p>
      </div>

      {/* Tabs */}
      <div className="flex p-2 gap-2 overflow-x-auto bg-slate-100 border-b border-slate-200 shrink-0">
         <TabButton active={activeTab === 'CERVICAL'} onClick={() => setActiveTab('CERVICAL')} label="Cervical" />
         <TabButton active={activeTab === 'BREAST'} onClick={() => setActiveTab('BREAST')} label="Breast" />
         <TabButton active={activeTab === 'OVARIAN'} onClick={() => setActiveTab('OVARIAN')} label="Ovarian" />
         <TabButton active={activeTab === 'COUNSELLING'} onClick={() => setActiveTab('COUNSELLING')} label="Counselling" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {renderContent()}
        
        <div className="mt-8 p-4 bg-slate-200 rounded-lg text-center">
            <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center justify-center gap-2">
                <Info size={12} /> Reference: IMPCG 2024 Page 177
            </p>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
    <button 
        onClick={onClick}
        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${
            active 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
        }`}
    >
        {label}
    </button>
);

const TreatmentCard = ({ title, status, desc, isWarning, isDanger }: any) => (
    <div className={`p-3 rounded-lg border ${
        isDanger ? 'bg-red-50 border-red-200' :
        isWarning ? 'bg-orange-50 border-orange-200' :
        'bg-white border-slate-200'
    }`}>
        <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-slate-800">{title}</span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                 isDanger ? 'bg-red-200 text-red-800' :
                 isWarning ? 'bg-orange-200 text-orange-800' :
                 'bg-green-100 text-green-800'
            }`}>{status}</span>
        </div>
        <p className="text-sm text-slate-600 leading-snug">{desc}</p>
    </div>
);

const CounsellingItem = ({ title, desc }: any) => (
    <div className="border-l-4 border-pink-300 pl-3">
        <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
        <p className="text-sm text-slate-600 mt-1">{desc}</p>
    </div>
);