export interface Visit {
  id: string;
  patientId: string;
  clinicId: string;
  doctorId: string | null;
  secretaryId: string | null;
  visitDate: string;
  reason: string;
  status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED';
  observations: string | null;
  diagnosis: string | null;
  prescription: string | null;
  fee: number | null;
  createdAt: string;
  updatedAt: string;
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    dateOfBirth?: string | null;  // ← Vérifie que cette ligne existe
    sex?: string | null;           // ← Vérifie que cette ligne existe
    bloodGroup?: string | null;
    allergies?: string | null;
    medicalHistory?: string | null;
  };
}