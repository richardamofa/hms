import api from './index'

export const dashboardApi = {
  getStats: async () => {
    const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
      api.get('/patients?select=id'),
      api.get('/doctors?select=id'),
      api.get('/appointments?select=id'),
    ])

    return {
      totalPatients: patientsRes.data.length,
      totalDoctors: doctorsRes.data.length,
      totalAppointments: appointmentsRes.data.length,
    }
  },
}
