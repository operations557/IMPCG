export interface PPHProtocolItem {
  id: string;
  category: 'Emergency Drug' | 'Procedure' | 'Protocol';
  title: string;
  dosage_iv?: string; // Optional for non-drugs
  rate?: string; // Optional for non-drugs
  indications?: string[];
  steps?: string[]; // Optional for drugs
  pdf_ref: string;
  warning?: string;
}

export const PPH_DATA: PPHProtocolItem[] = [
  // --- DRUGS ---
  {
    "id": "drug_oxytocin_infusion",
    "category": "Emergency Drug",
    "title": "Oxytocin (Syntocinon) - Maintenance",
    "dosage_iv": "20 IU in 1 Litre Sodium Chloride 0.9%",
    "rate": "125-250 ml/hour",
    "indications": ["Routine PPH Management", "Atonic Uterus"],
    "pdf_ref": "Page 117",
    "warning": "Do not remove IV line for at least 12 hours."
  },
  {
    "id": "drug_oxytocin_stat",
    "category": "Emergency Drug",
    "title": "Oxytocin (Syntocinon) - Stat Dose",
    "dosage_iv": "10 IU in 100 or 200mls 0.9% sodium chloride over 5-10 minutes",
    "indications": ["First response to PPH (E-MOTIVE)"],
    "pdf_ref": "Page 117",
    "warning": "If delay in securing IV, give 10 IU IM."
  },
  {
    "id": "drug_tranexamic_acid",
    "category": "Emergency Drug",
    "title": "Tranexamic Acid (TXA)",
    "dosage_iv": "1g in 200ml 0.9% Sodium Chloride over 10 minutes",
    "indications": ["All PPH cases (E-MOTIVE)", "Refractory Bleeding", "Lacerations"],
    "pdf_ref": "Page 117",
    "warning": "Do not mix in the same bag as Oxytocin. Can repeat after 30 mins if bleeding continues."
  },
  {
    "id": "drug_ergometrine",
    "category": "Emergency Drug",
    "title": "Ergometrine",
    "dosage_iv": "0.5 mg IM (or Ergometrine/Oxytocin combination)",
    "indications": ["Atonic Uterus", "After reduction of Uterine Inversion"],
    "pdf_ref": "Page 117",
    "warning": "Contraindicated in Cardiac Disease or Hypertension."
  },
  {
    "id": "drug_misoprostol",
    "category": "Emergency Drug",
    "title": "Misoprostol",
    "dosage_iv": "400-600 mcg Sublingually or Rectally (Single Dose)",
    "indications": ["Atonic Uterus Uncontrolled by Oxytocin/Ergometrine"],
    "pdf_ref": "Page 117",
    "warning": "Do not overdose."
  },
  {
    "id": "drug_salbutamol",
    "category": "Emergency Drug",
    "title": "Salbutamol (Uterine Relaxant)",
    "dosage_iv": "250 mcg IV (½ of a 500 μg ampoule diluted in 20 mL saline)",
    "indications": ["Acute Uterine Inversion (to relax uterus for reduction)"],
    "pdf_ref": "Page 119",
    "warning": "Do not use if cardiac contra-indications exist."
  },
  {
    "id": "drug_morphine",
    "category": "Emergency Drug",
    "title": "Morphine",
    "dosage_iv": "0.1mg/kg IM (Max 10mg)",
    "indications": ["Acute Uterine Inversion (Pain/Shock management)"],
    "pdf_ref": "Page 119",
    "warning": "Only if systolic BP ≥ 90 mmHg."
  },

  // --- PROTOCOLS ---
  {
    "id": "protocol_emotive",
    "category": "Protocol",
    "title": "E-MOTIVE Bundle (First Response)",
    "steps": [
      "1. CALL for assistance and PPH box.",
      "2. MASSAGE uterus and expel clots.",
      "3. OXYTOCIN: 10 IU IV/IM stat + 20 IU in 1L fluids.",
      "4. TRANEXAMIC ACID: 1g IV over 10 mins.",
      "5. IV FLUIDS: Insert 2nd cannula and run fast if shocked.",
      "6. EMPTY BLADDER (Catheterise).",
      "7. EXAMINE for tears/placenta completeness."
    ],
    "pdf_ref": "Page 117"
  },
  {
    "id": "protocol_atonic_uterus",
    "category": "Protocol",
    "title": "Atonic Uterus Management",
    "steps": [
      "1. Continue Oxytocin infusion.",
      "2. Add Ergometrine 0.5mg IM (if no HTN/Cardiac).",
      "3. Give Tranexamic Acid 1g IV.",
      "4. Continuous bimanual compression.",
      "5. If uncontrolled: Misoprostol 400-600mcg SL/Rectal.",
      "6. Consider Uterine Balloon Tamponade (UBT) or condom catheter.",
      "7. Prepare for transfer/surgery."
    ],
    "pdf_ref": "Page 117"
  },
  {
    "id": "protocol_retained_placenta_bleeding",
    "category": "Procedure",
    "title": "Retained Placenta with Active Bleeding",
    "steps": [
      "1. Insert urinary catheter.",
      "2. Oxytocin 20 units in 1L N/Saline at 120-240 ml/hr.",
      "3. Attempt manual removal (One hand in uterus, one stabilising fundus).",
      "4. If excessive bleeding: 2nd IV line, fluids.",
      "5. Antibiotics: Ampicillin 1g IV + Metronidazole 400mg PO.",
      "6. Refer for formal removal in theatre if unsuccessful."
    ],
    "pdf_ref": "Page 119"
  },
  {
    "id": "protocol_uterine_inversion",
    "category": "Procedure",
    "title": "Acute Uterine Inversion Management",
    "steps": [
      "1. IMMEDIATE ACTION: Treat shock (2x Large Bore IVs, Fluids, Blood).",
      "2. Do NOT remove placenta if still attached.",
      "3. Give Morphine 0.1mg/kg IM (if BP > 90 systolic).",
      "4. Relax Uterus: Salbutamol 250mcg IV.",
      "5. Manual Reduction: Push uterus up into vagina, hold for several minutes (Johnson maneuver).",
      "6. Hydrostatic reduction if manual fails (500-1000ml warm saline).",
      "7. AFTER reduction: Ergometrine 0.5mg IM + Oxytocin infusion."
    ],
    "pdf_ref": "Page 119"
  },
  {
    "id": "protocol_refractory_pph",
    "category": "Protocol",
    "title": "Refractory PPH (Persistent Bleeding)",
    "steps": [
      "1. Aortic Compression (Apply pressure above umbilicus).",
      "2. Intensify resuscitation (up to 3L Crystalloid + Blood).",
      "3. Urgent examination in theatre (Tears/Rupture).",
      "4. Trial of Balloon Tamponade.",
      "5. Laparotomy: Compression sutures (Hayman/B-Lynch), Devascularisation, or Hysterectomy.",
      "6. If transfer needed: Apply Non-pneumatic Anti Shock Garment (NASG)."
    ],
    "pdf_ref": "Page 118"
  },
  {
    "id": "protocol_secondary_pph",
    "category": "Protocol",
    "title": "Secondary PPH (>24hrs after delivery)",
    "steps": [
      "1. Resuscitate if shocked.",
      "2. Oxytocin 10 IU IM single dose.",
      "3. Oxytocin 20 IU in 1L N/Saline at 125ml/hr.",
      "4. Ergometrine 0.5mg IM (if no HTN/Cardiac).",
      "5. Treat cause (Sepsis? Retained products?).",
      "6. Admit or transfer to hospital."
    ],
    "pdf_ref": "Page 120"
  }
];