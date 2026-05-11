import api from './index'
import type { Doctor } from '@/types'

export const doctorApi = {
  getAll: async (): Promise<Doctor[]> => {
    const { data } = await api.get('/doctors?select=*&order=created_at.desc')
    return data
  },

  getById: async (id: string): Promise<Doctor> => {
    const { data } = await api.get(`/doctors?id=eq.${id}&select=*`)
    return data[0]
  },

  create: async (doctor: Omit<Doctor, 'id' | 'created_at'>): Promise<Doctor> => {
    const { data } = await api.post('/doctors', doctor)
    return data[0]
  },

  update: async (id: string, doctor: Partial<Doctor>): Promise<Doctor> => {
    const { data } = await api.patch(`/doctors?id=eq.${id}`, doctor)
    return data[0]
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/doctors?id=eq.${id}`)
  },
}
