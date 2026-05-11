import api from './index'
import type { Patient } from '@/types'

export const patientApi = {
  getAll: async (): Promise<Patient[]> => {
    const { data } = await api.get('/patients?select=*&order=created_at.desc')
    return data
  },

  getById: async (id: string): Promise<Patient> => {
    const { data } = await api.get(`/patients?id=eq.${id}&select=*`)
    return data[0]
  },

  create: async (patient: Omit<Patient, 'id' | 'created_at'>): Promise<Patient> => {
    const { data } = await api.post('/patients', patient)
    return data[0]
  },

  update: async (id: string, patient: Partial<Patient>): Promise<Patient> => {
    const { data } = await api.patch(`/patients?id=eq.${id}`, patient)
    return data[0]
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/patients?id=eq.${id}`)
  },
}
