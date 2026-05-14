import api from './index'

export const dashboardApi = {
  getStats: async () => {
    try {
      const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
        api.get('/patients?select=id'),
        api.get('/doctors?select=id'),
        api.get('/appointments?select=id'),
      ]);

      return {
        totalPatients: patientsRes.data.length,
        totalDoctors: doctorsRes.data.length,
        totalAppointments: appointmentsRes.data.length,
      };
    } catch (error) {
      // Handle error and return default values
      return {
        totalPatients: 0,
        totalDoctors: 0,
        totalAppointments: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
}
