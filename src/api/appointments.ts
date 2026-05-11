import api from './index'
import type { Appointment } from '@/types'

export const appointmentApi = {
  getAll: async (): Promise<Appointment[]> => {
    const { data } = await api.get(
      '/appointments?select=*,patient:patients(*),doctor:doctors(*)&order=created_at.desc'
    )
    return data
  },

  getById: async (id: string): Promise<Appointment> => {
    const { data } = await api.get(
      `/appointments?id=eq.${id}&select=*,patient:patients(*),doctor:doctors(*)`
    )
    return data[0]
  },

  create: async (appointment: Omit<Appointment, 'id' | 'created_at' | 'patient' | 'doctor'>): Promise<Appointment> => {
    const { data } = await api.post('/appointments', appointment)
    return data[0]
  },

  update: async (id: string, appointment: Partial<Appointment>): Promise<Appointment> => {
    const { data } = await api.patch(`/appointments?id=eq.${id}`, appointment)
    return data[0]
  },

  updateStatus: async (id: string, status: 'pending' | 'completed'): Promise<Appointment> => {
    const { data } = await api.patch(`/appointments?id=eq.${id}`, { status })
    return data[0]
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/appointments?id=eq.${id}`)
  },
}
