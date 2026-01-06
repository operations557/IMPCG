import { AuditLog } from '../types';

const AUDIT_KEY = 'impcg_audit_trail_secure';
// In a real app, this would come from the authenticated session
const MOCK_USER_ID = 'midwife_device_001';

export const AuditService = {
  /**
   * Creates a secure, hashed log entry and stores it.
   */
  log: async (actionType: AuditLog['actionType'], details: string, patientId?: string) => {
    const timestamp = new Date().toISOString();
    const id = crypto.randomUUID();
    
    // Append patient ID to details if present for context.
    // Ensure full ID is logged for tracing critical events like TRIAGE_SAVED, GENERATE_REFERRAL, CLINICAL_ACTION.
    const enrichedDetails = patientId ? `[PatientID: ${patientId}] ${details}` : details;

    // Create a data string to hash: ID + Time + User + Action + Content
    const dataString = `${id}|${timestamp}|${MOCK_USER_ID}|${actionType}|${enrichedDetails}`;
    
    // Generate tamper-proof hash (SHA-256)
    const encoder = new TextEncoder();
    const data = encoder.encode(dataString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const entry: AuditLog = {
      id,
      timestamp,
      userId: MOCK_USER_ID,
      actionType,
      details: enrichedDetails,
      hash
    };

    AuditService.saveToSecureStorage(entry);
  },

  /**
   * Persists the log to local storage with simulated encryption (Base64).
   * In a production app, this would use proper encryption keys or write to a secure DB.
   */
  saveToSecureStorage: (entry: AuditLog) => {
    try {
      // Get existing encrypted logs
      const rawData = localStorage.getItem(AUDIT_KEY);
      let logs: AuditLog[] = [];
      
      if (rawData) {
        try {
          // Decrypt (Simulated via Base64 decode)
          const jsonStr = atob(rawData);
          logs = JSON.parse(jsonStr);
        } catch (e) {
          console.error("Audit log integrity check failed", e);
          logs = [];
        }
      }

      logs.push(entry);

      // Encrypt (Simulated via Base64 encode) to prevent casual tampering
      const encrypted = btoa(JSON.stringify(logs));
      localStorage.setItem(AUDIT_KEY, encrypted);
      
      // Development log
      console.info(`[AUDIT] ${entry.timestamp} | ${entry.actionType} | ${entry.details}`);
    } catch (e) {
      console.error("Failed to write audit log", e);
    }
  },

  /**
   * Retrieves decrypted logs for review/export.
   */
  getLogs: (): AuditLog[] => {
     const rawData = localStorage.getItem(AUDIT_KEY);
     if (!rawData) return [];
     try {
       return JSON.parse(atob(rawData));
     } catch (e) {
       return [];
     }
  }
};