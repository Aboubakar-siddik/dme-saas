export interface Visit {
  id: string;
  patientId: string;
  clinicId: string;
  doctorId: string | null;
  secretaryId: string | null;
  visitDate: string;
  reason: string;
  status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED';
  
  // Paramètres vitaux
  bloodPressure: string | null;
  heartRate: number | null;
  respiratoryRate: number | null;
  oxygenSaturation: number | null;
  temperature: number | null;
  weight: number | null;
  height: number | null;
  bloodSugar: number | null;
  
  // Consultation
  anamnesis: string | null;
  personalHistory: boolean | null;
  personalHistoryDetails: string | null;
  familyHistory: boolean | null;
  familyHistoryDetails: string | null;
  generalSystems: string | null;
  cardioSystems: string | null;
  
  // Résumé
  observations: string | null;
  diagnosis: string | null;
  bilan: string | null;
  prescription: string | null;
  fee: number | null;
  
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    bloodGroup?: string | null;
    sex?: string | null;
    dateOfBirth?: string | null;
    profession?: string | null;
    maritalStatus?: string | null;
    nationality?: string | null;
    countryOfOrigin?: string | null;
    cityOfResidence?: string | null;
    neighborhood?: string | null;
    idCardNumber?: string | null;
    email?: string | null;
    isMinor?: boolean;
    parentId?: string | null;
    allergies?: string | null;
    medicalHistory?: string | null;
  };
}