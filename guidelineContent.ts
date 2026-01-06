export interface GuidelineChunk {
  id: string;
  title: string;
  content: string;
  page: number;
  tags: string[];
}

// Specific Clinical Protocols (Fast lookup / High Priority)
const CLINICAL_PROTOCOLS: GuidelineChunk[] = [
  // --- PPH ---
  {
    id: 'pph-1',
    title: 'PPH: Initial Management (E-MOTIVE)',
    content: 'Call for help. Empty bladder. Massage uterus. Administer Oxytocin 10 IU IM or IV. If bleeding continues, proceed to TXA.',
    page: 117,
    tags: ['pph', 'bleeding', 'hemorrhage', 'oxytocin', 'massage']
  },
  {
    id: 'pph-2',
    title: 'PPH: Refractory Treatment',
    content: 'If bleeding persists after 15 mins (Refractory PPH): Start second large bore IV. Give Tranexamic Acid (TXA) 1g IV slowly. Prepare for transfer. Apply bimanual compression.',
    page: 118,
    tags: ['pph', 'txa', 'refractory', 'transfer']
  },
  {
    id: 'pph-3',
    title: 'PPH: Drug Dosages',
    content: 'Oxytocin: 10 IU IM/IV. Misoprostol: 600-800mcg sublingual/rectal. Ergometrine: 0.5mg IM (Contraindicated in Hypertension).',
    page: 119,
    tags: ['pph', 'drugs', 'dosage', 'misoprostol', 'ergometrine']
  },
  
  // --- Hypertension / Eclampsia ---
  {
    id: 'htn-1',
    title: 'Severe Hypertension Management',
    content: 'BP >= 160/110 mmHg is an emergency. Administer Nifedipine 10mg PO immediately. Repeat BP in 30 mins.',
    page: 84,
    tags: ['bp', 'hypertension', 'nifedipine', 'severe']
  },
  {
    id: 'htn-2',
    title: 'Eclampsia: Magnesium Sulphate (Loading)',
    content: 'Start MgSO4 immediately for seizures or imminent eclampsia. Loading Dose: 4g IV (slowly over 20 mins) + 10g IM (5g in each buttock).',
    page: 86,
    tags: ['eclampsia', 'seizure', 'magnesium', 'mgso4', 'loading']
  },
  {
    id: 'htn-3',
    title: 'Eclampsia: Magnesium Sulphate (Maintenance)',
    content: 'Maintenance Dose: 5g IM every 4 hours in alternate buttocks. Monitor: Respiratory Rate > 16, Patellar Reflexes present, Urine Output > 25ml/hr.',
    page: 87,
    tags: ['eclampsia', 'magnesium', 'maintenance', 'monitoring']
  },

  // --- Sepsis ---
  {
    id: 'sepsis-1',
    title: 'Maternal Sepsis: Red Flags',
    content: 'Temp > 38°C, HR > 110, RR > 24, altered mental state. Start Sepsis Six bundle immediately.',
    page: 142,
    tags: ['sepsis', 'infection', 'fever', 'red flags']
  },
  {
    id: 'sepsis-2',
    title: 'Sepsis: Antibiotic Regimen',
    content: 'Give IV Ceftriaxone 2g daily + Metronidazole 500mg IV 8 hourly. Give first dose within 1 hour of diagnosis.',
    page: 144,
    tags: ['sepsis', 'antibiotics', 'ceftriaxone', 'metronidazole']
  },
  
  // --- General ---
  {
    id: 'gen-1',
    title: 'Normal Labour: Latent Phase',
    content: 'Cervix < 4cm. Contractions irregular. Encourage mobilization and hydration. Do not admit unless complications exist.',
    page: 42,
    tags: ['labour', 'latent', 'admission']
  }
];

// Full Document Index (Based on IMPCG 2024 Table of Contents)
const DOCUMENT_INDEX: GuidelineChunk[] = [
  {
    id: 'chap-1',
    title: 'Chapter 1: Respectful Maternity Care',
    content: 'Topics: Respectful care during labour and giving birth, Respectful postnatal care, Managing a difficult situation, Birth companions, Providing services to foreign clients, Engaging clients where there is a language barrier, Engaging with adolescents, Respect in the workplace, Self-care for health workers, Help line numbers, Reporting disrespect and abuse',
    page: 16,
    tags: ['respectful', 'maternity', 'care', 'labour', 'postnatal', 'companions', 'language', 'adolescents', 'abuse']
  },
  {
    id: 'chap-2',
    title: 'Chapter 2: Maternal Mental Health',
    content: 'Topics: Types of mental health conditions, Risk factors, Screening, Mental Health Screen tool, General management principles, Treatment, Conditions table (Depression, Anxiety, Bipolar, Psychosis), Suicide risk assessment, Aggressive or agitated behaviour',
    page: 21,
    tags: ['mental', 'health', 'depression', 'anxiety', 'suicide', 'screening', 'psychosis']
  },
  {
    id: 'chap-3',
    title: 'Chapter 3: Intimate Partner Violence and Domestic Violence',
    content: 'Topics: Types of IPV and DV, Health outcomes, Risk Factors, Identification and LIVES support, Safety planning, Reporting, Referrals, Health worker wellbeing',
    page: 30,
    tags: ['ipv', 'domestic', 'violence', 'abuse', 'safety', 'lives']
  },
  {
    id: 'chap-4',
    title: 'Chapter 4: Antenatal Care',
    content: 'Topics: Preconception care, The Maternity Case Record, First antenatal visit, Estimation of gestational age, Routine screening investigations, Medications and vaccinations, Information for pregnant women, Subsequent antenatal visits schedule (BANC Plus), Clinic checklists, Risk factors requiring referral',
    page: 34,
    tags: ['antenatal', 'anc', 'banc', 'screening', 'gestational', 'age', 'referral']
  },
  {
    id: 'chap-5',
    title: 'Chapter 5: Maternal Nutrition',
    content: 'Topics: Nutrition before pregnancy, Interventions throughout continuum of care, Nutritional management of minor ailments, Key recommendations, Nutrition while breastfeeding, At-risk groups (Underweight, Overweight, Intestinal worms)',
    page: 46,
    tags: ['nutrition', 'diet', 'breastfeeding', 'underweight', 'overweight', 'worms']
  },
  {
    id: 'chap-6',
    title: 'Chapter 6: Early Pregnancy Complications',
    content: 'Topics: Bleeding in early pregnancy algorithm, Miscarriage types (Threatening, Complete, Inevitable, Incomplete, Unsafe/Septic), Management of septic miscarriage, Post-miscarriage follow-up, Manual Vacuum Aspiration (MVA), Ectopic pregnancy, Surgical and anaesthetic management of ruptured ectopic',
    page: 50,
    tags: ['miscarriage', 'early', 'pregnancy', 'bleeding', 'mva', 'ectopic', 'septic']
  },
  {
    id: 'chap-7',
    title: 'Chapter 7: Normal Labour and Delivery - Intrapartum Care',
    content: 'Topics: Diagnosis of labour, Admission procedure, Suspected labour, General care (Respect, Diet, Mobility), Analgesia, First stage (Latent and Active phases), Completion of the partogram, Second stage, Episiotomy, Third stage management, Fourth stage management',
    page: 56,
    tags: ['labour', 'delivery', 'intrapartum', 'analgesia', 'partogram', 'episiotomy', 'stages']
  },
  {
    id: 'chap-8',
    title: 'Chapter 8: Fetal Monitoring',
    content: 'Topics: Antenatal approach (Fetal movements), Reduced fetal movements management, Intrapartum diagnosis, Intrapartum fetal heart monitoring (Auscultation vs CTG), CTG analysis guide, Categorising the CTG trace, Management plans for abnormal traces (Tachycardia, Bradycardia, Decelerations), Documentation, Action following birth if Apgar < 7',
    page: 63,
    tags: ['fetal', 'monitoring', 'ctg', 'heart', 'rate', 'movements', 'apgar']
  },
  {
    id: 'chap-9',
    title: 'Chapter 9: Induction of Labour',
    content: 'Topics: Contra-indications, Approach (Cervix favourable vs unfavourable), Oxytocin infusion regimen, Methods (Foley catheter, Misoprostol, Prostaglandins), IOL after Intra-Uterine Fetal Demise, IOL after prolonged ROM, IOL in a scarred uterus',
    page: 75,
    tags: ['induction', 'iol', 'labour', 'oxytocin', 'misoprostol', 'catheter', 'scarred']
  },
  {
    id: 'chap-10',
    title: 'Chapter 10: Problems in Pregnancy',
    content: 'Topics: Small for gestational age babies (SGA), Abnormal umbilical artery doppler, Multiple pregnancy, Breech presentation, Transverse lie, Chorioamnionitis, Preterm labour, PPROM, Prolonged pregnancy, Rhesus incompatibility, Poor obstetric history, Recurrent miscarriages',
    page: 79,
    tags: ['problems', 'sga', 'breech', 'preterm', 'pprom', 'multiple', 'twins', 'rhesus']
  },
  {
    id: 'chap-11',
    title: 'Chapter 11: Abnormal Labour and Delivery',
    content: 'Topics: Mental health and respectful care, Abnormalities of first stage (Prolonged latent, Poor active phase progress), Prolonged second stage, Vacuum extraction / Ventouse delivery, Forceps delivery, Emergencies (Cord prolapse, Shoulder dystocia), Third degree perineal tear',
    page: 91,
    tags: ['abnormal', 'labour', 'prolonged', 'vacuum', 'forceps', 'dystocia', 'prolapse', 'tear']
  },
  {
    id: 'chap-12',
    title: 'Chapter 12: Caesarean Delivery',
    content: 'Topics: Requests for CD, Fetal maturity testing, Preparation and precautions, Haemorrhage during CD, Postoperative orders, Haemorrhage after CD management, Uterine compression sutures, Vaginal birth after previous caesarean section (VBAC), CD safety checklist',
    page: 95,
    tags: ['caesarean', 'c-section', 'cd', 'vbac', 'haemorrhage', 'sutures']
  },
  {
    id: 'chap-13',
    title: 'Chapter 13: Hypertensive Disorders in Pregnancy',
    content: 'Topics: Definitions and Classification, Measurement of BP, Risk factors, Role of district hospitals, Prevention (Calcium, Aspirin), Management of Gestational Hypertension, Management of Pre-eclampsia (with and without severe features), Management of Eclampsia, Postpartum care',
    page: 103,
    tags: ['hypertension', 'bp', 'pre-eclampsia', 'eclampsia', 'aspirin', 'calcium']
  },
  {
    id: 'chap-14',
    title: 'Chapter 14: Antepartum Haemorrhage (APH)',
    content: 'Topics: Causes, Emergency management, Distinguishing Abruptio placentae vs Placenta praevia, Management of placenta praevia, Management of abruptio placentae, APH of unknown origin',
    page: 112,
    tags: ['aph', 'haemorrhage', 'bleeding', 'placenta', 'praevia', 'abruptio']
  },
  {
    id: 'chap-15',
    title: 'Chapter 15: Postpartum Haemorrhage (PPH)',
    content: 'Topics: Primary PPH definition, Prevention, Management algorithm (E-MOTIVE bundle), Uterine balloon tamponade, Refractory PPH, Retained placenta, Acute inversion of the uterus, Referral and NASG, Secondary PPH',
    page: 115,
    tags: ['pph', 'postpartum', 'haemorrhage', 'bleeding', 'e-motive', 'tamponade', 'nasg']
  },
  {
    id: 'chap-16',
    title: 'Chapter 16: Medical Disorders in Pregnancy',
    content: 'Topics: Anaemia, Diabetes mellitus (Pre-gestational and Gestational), Cardiac disease, Asthma, Thromboembolism (VTE), Shortness of breath, Epilepsy, Thyroid disease, Renal disease, Obesity, Substance abuse',
    page: 121,
    tags: ['medical', 'disorders', 'anaemia', 'diabetes', 'cardiac', 'asthma', 'vte', 'epilepsy', 'hiv']
  },
  {
    id: 'chap-17',
    title: 'Chapter 17: Postpartum (Puerperal) Sepsis',
    content: 'Topics: Definitions and risk factors, Mild vs Severe puerperal sepsis, Emergency management, Septic shock, Caesarean delivery wound sepsis',
    page: 135,
    tags: ['sepsis', 'puerperal', 'infection', 'shock', 'wound']
  },
  {
    id: 'chap-18',
    title: 'Chapter 18: HIV and Tuberculosis in Pregnancy',
    content: 'Topics: Vertical Transmission Prevention (VTP) in antenatal care, HIV testing and re-testing, Viral load monitoring, Screening for TB and other infections, Labour and delivery management, Post-delivery discharge and care of mother/infant, Tuberculosis in pregnancy and breastfeeding',
    page: 137,
    tags: ['hiv', 'tb', 'tuberculosis', 'vtp', 'viral', 'load', 'transmission']
  },
  {
    id: 'chap-19',
    title: 'Chapter 19: COVID-19 in Pregnant and Postpartum Women',
    content: 'Topics: Testing criteria, Preventative measures and Vaccination, Risk factors for severe disease, Effects on fetus, Management protocol by disease severity, Delivery site and timing',
    page: 142,
    tags: ['covid-19', 'coronavirus', 'vaccination', 'pandemic']
  },
  {
    id: 'chap-20',
    title: 'Chapter 20: Infections in Pregnancy',
    content: 'Topics: Vaginal discharge (Non-STIs vs STIs), Syphilis, Genital warts, Genital ulcer syndrome, Urinary tract infection, Malaria, Hepatitis B',
    page: 145,
    tags: ['infections', 'sti', 'syphilis', 'uti', 'malaria', 'hepatitis']
  },
  {
    id: 'chap-21',
    title: 'Chapter 21: Blood Transfusion',
    content: 'Topics: Patient blood management principles, Ordering priorities, Massive bleeding protocols (with and without blood bank), Transfusion related adverse events',
    page: 151,
    tags: ['blood', 'transfusion', 'bleeding', 'anemia']
  },
  {
    id: 'chap-22',
    title: 'Chapter 22: Routine and Complicated Postnatal Care',
    content: 'Topics: Care after normal vaginal delivery, Postpartum danger signs, Postnatal visits (3-6 days, 6 weeks), Care after caesarean delivery, Screening tables for mother and baby, Postpartum checklist example',
    page: 156,
    tags: ['postnatal', 'postpartum', 'care', 'checkups', 'danger', 'signs']
  },
  {
    id: 'chap-23',
    title: 'Chapter 23: Postpartum Contraception',
    content: 'Topics: Pregnancy risk postpartum, Counselling, Long-acting reversible contraception (IUD, Implant), Tubal ligation, Injectable contraception, Oral contraception, Lactational amenorrhoea method (LAM)',
    page: 164,
    tags: ['contraception', 'family', 'planning', 'iud', 'implant', 'sterilization']
  },
  {
    id: 'chap-24',
    title: 'Chapter 24: Basic Ultrasound at District Level',
    content: 'Topics: Level 1 scan indications, Doppler requests and interpretation, Abnormal findings, Screening for congenital disorders (Trisomy 21 risk), Ultrasound dating policy',
    page: 168,
    tags: ['ultrasound', 'scan', 'doppler', 'dating', 'congenital']
  },
  {
    id: 'chap-25',
    title: 'Chapter 25: Guidelines for Perinatal Review Meetings',
    content: 'Topics: Purpose and frequency, Attendees, Agenda and preparation, Minutes format, Action plans',
    page: 172,
    tags: ['perinatal', 'review', 'meetings', 'audit', 'mortality']
  },
  {
    id: 'chap-26',
    title: 'Chapter 26: Responding to a Maternal Death',
    content: 'Topics: Immediate actions, Within 72 hours, Within one month, Within three months',
    page: 176,
    tags: ['maternal', 'death', 'mortality', 'response']
  },
  {
    id: 'chap-27',
    title: 'Chapter 27: Management of Cancers in Pregnancy',
    content: 'Topics: Epidemiology and challenges, Cervical cancer, Breast cancer, Ovarian cancer, Counselling',
    page: 177,
    tags: ['cancer', 'oncology', 'cervical', 'breast', 'ovarian']
  },
  {
    id: 'annex-1',
    title: 'Annexures',
    content: 'Topics: Example of Notification of Resource Constraints, Nutrition Education and Counselling For Pregnant Women',
    page: 182,
    tags: ['annexure', 'resources', 'nutrition', 'forms']
  }
];

export const GUIDELINE_DATA: GuidelineChunk[] = [...CLINICAL_PROTOCOLS, ...DOCUMENT_INDEX];