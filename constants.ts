import { PPHAction } from './types';

// Modified Early Obstetric Warning Score (MEOWS) Thresholds
// These are simplified for the PoC but reflect typical clinical red flags.
export const TRIAGE_THRESHOLDS = {
  SYSTOLIC_RED_LOW: 90,
  SYSTOLIC_RED_HIGH: 160,
  DIASTOLIC_RED_HIGH: 110,
  HR_RED_LOW: 50,
  HR_RED_HIGH: 120,
  RR_RED_LOW: 10,
  RR_RED_HIGH: 30,
  TEMP_RED_LOW: 35.0,
  TEMP_RED_HIGH: 38.0,
};

export const PPH_PROTOCOL: PPHAction[] = [
  { id: '1', label: 'Call for Help & Massage Uterus', timeOffsetMin: 0, completed: false },
  { id: '2', label: 'Insert 2x Large Bore IVs (16G)', timeOffsetMin: 2, completed: false },
  { id: '3', label: 'Oxytocin 10-20 units IV/IM', timeOffsetMin: 5, completed: false },
  { id: '4', label: 'Empty Bladder (Catheter)', timeOffsetMin: 8, completed: false },
  { id: '5', label: 'Tranexamic Acid 1g IV', timeOffsetMin: 10, completed: false },
  { id: '6', label: 'Check Clotting / Transfer Decision', timeOffsetMin: 15, completed: false },
];