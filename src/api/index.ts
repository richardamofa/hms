import axios from 'axios'
import { supabase } from '@/utils/supabase'

const api = axios.create({
  baseURL: import.meta.env.VITE_SUPABASE_URL + '/rest/v1',
  headers: {
    'Content-Type': 'application/json',
    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
})

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})

// Simple error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong'
    console.error('API Error:', message)
    return Promise.reject(new Error(message))
  }
)

export default api
