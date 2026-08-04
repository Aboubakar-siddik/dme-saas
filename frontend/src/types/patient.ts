export interface Patient {
  id: string;
  clinicId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string | null;
  sex: 'MALE' | 'FEMALE' | null;
  bloodGroup: string | null;
  profession: string | null;
  maritalStatus: 'CELIBATAIRE' | 'MARIE' | 'DIVORCE' | 'VEUF' | null;
  nationality: string | null;
  countryOfOrigin: string | null;
  cityOfResidence: string | null;
  neighborhood: string | null;
  idCardNumber: string | null;
  email: string | null;
  isMinor: boolean;
  parentId: string | null;
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