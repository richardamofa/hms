export interface User {
  id: string;
  email: string;
  role: 'admin' | 'doctor';
  created_at: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  created_at: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  phone: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  status: 'pending' | 'completed';
  appointment_date: string;
  created_at: string;
  patient?: Patient;
  doctor?: Doctor;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: 'admin' | 'doctor') => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}
