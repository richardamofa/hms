import { create } from 'zustand'
import { supabase } from '@/utils/supabase'
import type { User, AuthState } from '@/types'

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      set({
        user: profile as User,
        isAuthenticated: true,
        isLoading: false,
      })
    }
  },

  register: async (email: string, password: string, role: 'admin' | 'doctor') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role },
      },
    })

    if (error) throw error

    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      set({
        user: profile as User,
        isAuthenticated: true,
        isLoading: false,
      })
    }
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null, isAuthenticated: false, isLoading: false })
  },

  checkAuth: async () => {
    const { data: { session } } = await supabase.auth.getSession()

    if (session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      set({
        user: profile as User,
        isAuthenticated: true,
        isLoading: false,
      })
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },
}))
