export interface Patient {
  id: string;
  clinicId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string | null;
  sex: 'MALE' | 'FEMALE' | null;
  bloodGroup: string | null;
  allergies: string | null;
  medicalHistory: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PatientSearchResult {
  data: Patient[];
  meta: {
    total: number;
    query: string;
  };
}