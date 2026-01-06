import { PatientRecord, TriageColor, PPHSession, LaborDataPoint } from '../types';

const PATIENTS_KEY = 'impcg_patients_v1';
const PPH_KEY = 'impcg_pph_state_v1';
const PARTOGRAM_KEY = 'impcg_partogram_state_v1';

export interface PatientStats {
  highRisk: number; // Red + Yellow
  lowRisk: number;  // Green
  total: number;
}

export interface PartogramState {
  start: number | null;
  points: LaborDataPoint[];
}

// Acting as the "LocalDatabaseService" and "PatientRepository"
export const PatientRepository = {
  // --- Persistence Methods ---
  
  savePatientRecord: (record: PatientRecord): void => {
    try {
      const existing = PatientRepository.getAllRecords();
      const updated = [record, ...existing];
      localStorage.setItem(PATIENTS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Storage quota exceeded", e);
    }
  },

  getAllRecords: (): PatientRecord[] => {
    try {
      const data = localStorage.getItem(PATIENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  // --- Analytical Methods ---

  getStats: (): PatientStats => {
    const records = PatientRepository.getAllRecords();
    let highRisk = 0;
    let lowRisk = 0;

    records.forEach(r => {
      if (r.triageResult === TriageColor.RED || r.triageResult === TriageColor.YELLOW) {
        highRisk++;
      } else {
        lowRisk++;
      }
    });

    return {
      highRisk,
      lowRisk,
      total: records.length
    };
  },

  // --- PPH State Management (Session Persistence) ---

  savePPHState: (session: PPHSession): void => {
    localStorage.setItem(PPH_KEY, JSON.stringify(session));
  },

  getPPHState: (): PPHSession | null => {
    const data = localStorage.getItem(PPH_KEY);
    return data ? JSON.parse(data) : null;
  },

  clearPPHState: (): void => {
    localStorage.removeItem(PPH_KEY);
  },

  // --- Partogram State Management ---

  savePartogramState: (state: PartogramState): void => {
    localStorage.setItem(PARTOGRAM_KEY, JSON.stringify(state));
  },

  getPartogramState: (): PartogramState => {
    const data = localStorage.getItem(PARTOGRAM_KEY);
    return data ? JSON.parse(data) : { start: null, points: [] };
  },

  clearPartogramState: (): void => {
    localStorage.removeItem(PARTOGRAM_KEY);
  }
};

// Backwards compatibility for existing imports (if any)
export const StorageService = PatientRepository;