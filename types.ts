export enum TriageColor {
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  RED = 'RED',
}

export enum RiskLevel {
  LOW = 'LOW',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface Vitals {
  systolicBP: number | '';
  diastolicBP: number | '';
  heartRate: number | '';
  respiratoryRate: number | '';
  temperature: number | '';
  consciousness: 'ALERT' | 'VOICE' | 'PAIN' | 'UNRESPONSIVE';
}

export interface PatientRecord {
  id: string;
  timestamp: number;
  vitals: Vitals;
  triageResult: TriageColor;
  notes?: string;
  synced: boolean;
  momConnectRegistered?: boolean;
  gestationalAgeWeeks?: number;
}

export type TabView = 'DASHBOARD' | 'TRIAGE' | 'PPH' | 'BANC' | 'HISTORY' | 'AI_ASSISTANT' | 'REFERRAL' | 'PARTOGRAM' | 'DRUGS' | 'GUIDELINES' | 'PROTOCOLS' | 'CANCER';

export interface PPHAction {
  id: string;
  label: string;
  completed: boolean;
  timeOffsetMin?: number;
}

export interface PPHSession {
  isActive: boolean;
  startTime: number | null;
  medsAdministered: string[];
  isRefractory: boolean;
}

export interface LaborDataPoint {
  dilation: number; // 4-10 cm
  time: number; // timestamp
  hoursFromStart: number; // calculated relative to active phase start
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  actionType: 'VIEW_PROTOCOL' | 'CALCULATE_DOSE' | 'GENERATE_REFERRAL' | 'CLINICAL_ACTION' | 'RISK_ASSESSMENT' | 'TRIAGE_SAVED' | 'MOMCONNECT_REGISTER';
  details: string;
  hash: string; // tamper-proof hash
}