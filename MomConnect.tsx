import React, { useState } from 'react';
import { Button } from './Button';
import { Phone, Calendar, Building, CheckCircle, Smartphone, User, AlertCircle, Loader2 } from 'lucide-react';
import { AuditService } from '../services/auditService';

export const MomConnect: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  
  // Form State
  const [idNumber, setIdNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [edd, setEdd] = useState('');
  const [facilityCode, setFacilityCode] = useState('');

  // Clinical/Data Validation
  const isValidID = idNumber.length === 13 && /^\d+$/.test(idNumber);

  const handleRegister = () => {
    if (!isValidID) {
      alert("Please enter a valid 13-digit SA ID Number.");
      return;
    }

    if (!window.confirm('Are you sure you want to initiate registration via USSD?')) {
        return;
    }

    setIsLaunching(true);

    // Logic: Generate USSD String
    // Note: Standard MomConnect registration via USSD often starts with the ID.
    // Example format: *134*550*IDNUMBER#
    const ussdString = `*134*550*${idNumber}#`;
    
    // Audit Log - Include context like Facility Code for tracing
    AuditService.log(
      'MOMCONNECT_REGISTER', 
      `Registration initiated. ID: ...${idNumber.slice(-6)}, Facility: ${facilityCode || 'N/A'}`
    );

    // Delay slightly to show UI feedback before system dialer takes over
    setTimeout(() => {
        // Launch Native Dialer (Offline-capable)
        window.location.href = `tel:${encodeURIComponent(ussdString)}`;

        // Optimistically set registered state for PoC
        setIsRegistered(true);
        setIsOpen(false);
        setIsLaunching(false);
    }, 1500);
  };

  if (isRegistered) {
    return (
      <div className="bg-green-100 border border-green-300 rounded-xl p-4 flex items-center gap-3 mb-6 shadow-sm animate-in fade-in duration-500">
        <div className="bg-green-600 text-white p-2 rounded-full shadow-sm">
          <CheckCircle size={24} />
        </div>
        <div>
          <h3 className="font-black text-green-900 text-lg leading-tight">MOMCONNECT ACTIVE</h3>
          <p className="text-green-800 text-xs font-bold">Patient successfully registered.</p>
          <p className="text-green-700 text-[10px] mt-1">ID: ...{idNumber.slice(-6)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-6 shadow-sm relative">
      
      {/* Launching Overlay */}
      {isLaunching && (
          <div className="absolute inset-0 bg-white/90 z-20 flex flex-col items-center justify-center backdrop-blur-sm animate-in fade-in">
              <Loader2 className="w-10 h-10 text-pink-600 animate-spin mb-2" />
              <p className="font-black text-pink-900 text-sm">LAUNCHING DIALER...</p>
          </div>
      )}

      {/* Banner / Header */}
      <div 
        className={`p-4 flex justify-between items-center cursor-pointer transition-colors ${isOpen ? 'bg-pink-700' : 'bg-pink-600 hover:bg-pink-700'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3 text-white">
          <Smartphone size={24} className="shrink-0" />
          <div>
            <h3 className="font-black text-lg leading-none">MOMCONNECT</h3>
            <p className="text-pink-100 text-[10px] font-bold uppercase tracking-wider">National Pregnancy Registry</p>
          </div>
        </div>
        <div className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
          {isOpen ? 'CLOSE' : 'REGISTER'}
        </div>
      </div>

      {/* Registration Form */}
      {isOpen && (
        <div className="p-4 space-y-4 animate-in slide-in-from-top-4 duration-300 bg-slate-50">
          <p className="text-xs text-slate-500 font-bold mb-2">
            Enter details to generate USSD code. Ensure patient has their phone ready.
          </p>

          <InputWithIcon 
            icon={<User size={18} />}
            label="SA ID Number"
            placeholder="Ex: 9201010050080"
            value={idNumber}
            onChange={setIdNumber}
            type="tel" // Use tel for numeric keypad
            maxLength={13}
            isValid={idNumber === '' || isValidID}
          />
          {!isValidID && idNumber.length > 0 && (
            <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 -mt-3">
              <AlertCircle size={10} /> Must be 13 digits
            </p>
          )}

          <InputWithIcon 
            icon={<Phone size={18} />}
            label="Mother's Phone"
            placeholder="072 123 4567"
            value={phone}
            onChange={setPhone}
            type="tel"
          />

          <div className="grid grid-cols-2 gap-4">
            <InputWithIcon 
              icon={<Calendar size={18} />}
              label="EDD"
              placeholder="YYYY-MM-DD"
              value={edd}
              onChange={setEdd}
              type="date"
            />
            <InputWithIcon 
              icon={<Building size={18} />}
              label="Facility Code"
              placeholder="Ex: 123456"
              value={facilityCode}
              onChange={setFacilityCode}
            />
          </div>

          <Button 
            onClick={handleRegister} 
            disabled={!isValidID}
            className={`mt-2 shadow-pink-200 transition-all ${isValidID ? 'bg-pink-600 hover:bg-pink-700 text-white' : 'bg-slate-300 text-slate-500'}`} 
            fullWidth
          >
            <Smartphone className="mr-2" size={20} />
            <div className="flex flex-col items-start leading-none">
                <span>REGISTER PATIENT</span>
                {isValidID && <span className="text-[10px] opacity-80 font-normal mt-0.5 font-mono">*134*550*ID#</span>}
            </div>
          </Button>
          
          <div className="flex justify-center gap-4 text-[10px] text-slate-400 font-mono mt-2">
            <span>*Standard USSD rates apply</span>
            <span>*Offline Compatible</span>
          </div>
        </div>
      )}
    </div>
  );
};

const InputWithIcon = ({ icon, label, placeholder, value, onChange, type = "text", maxLength, isValid = true }: any) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-slate-500 uppercase">{label}</label>
    <div className="relative">
      <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${isValid ? 'text-slate-400' : 'text-red-400'}`}>
        {icon}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
        className={`w-full h-12 pl-10 pr-4 rounded-lg border-2 bg-white focus:bg-white outline-none font-mono text-sm font-bold transition-all ${
            isValid 
            ? 'border-slate-200 focus:border-pink-500' 
            : 'border-red-300 focus:border-red-500 text-red-900'
        }`}
      />
    </div>
  </div>
);