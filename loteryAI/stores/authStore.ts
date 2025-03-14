import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  session: null,
  initializeAuth: async () => {
    try {
      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }

      if (session) {
        // Fetch user profile if session exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', session.user.id)
          .single();

        set({
          session,
          isAuthenticated: true,
          user: {
            id: session.user.id,
            email: session.user.email!,
            name: profile?.name || 'User',
          },
        });
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', session.user.id)
            .single();

          set({
            session,
            isAuthenticated: true,
            user: {
              id: session.user.id,
              email: session.user.email!,
              name: profile?.name || 'User',
            },
          });
        } else {
          set({
            session: null,
            isAuthenticated: false,
            user: null,
          });
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({
        session: null,
        isAuthenticated: false,
        user: null,
      });
    }
  },
  login: async (email: string, password: string) => {
    try {
      // Check if user exists first
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.toLowerCase())
        .single();

      if (checkError || !existingUser) {
        console.error('User check error:', checkError?.message || 'User not found');
        throw new Error('No account found with this email address');
      }

      // Attempt to sign in
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });

      if (signInError) {
        console.error('Sign in error:', signInError.message);
        if (signInError.message.includes('Invalid login credentials')) {
          throw new Error('Incorrect password. Please try again.');
        }
        throw signInError;
      }

      if (!data.user || !data.session) {
        console.error('No user data returned after login');
        throw new Error('Login failed - no user data');
      }

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError.message);
        throw new Error('Failed to fetch user profile');
      }

      // Set the user state
      set({
        session: data.session,
        user: {
          id: data.user.id,
          email: data.user.email!,
          name: profile?.name || 'User',
        },
        isAuthenticated: true,
      });
    } catch (error: any) {
      console.error('Login process error:', error);
      throw error;
    }
  },
  register: async (email: string, password: string, name: string) => {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.toLowerCase())
        .single();

      if (existingUser) {
        throw new Error('An account with this email already exists');
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password,
      });

      if (signUpError) {
        console.error('Sign up error:', signUpError.message);
        throw new Error(signUpError.message);
      }

      if (!data.user || !data.session) {
        console.error('No user returned after registration');
        throw new Error('Registration failed - no user created');
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: data.user.id, name, email: email.toLowerCase() }]);

      if (profileError) {
        console.error('Profile creation error:', profileError.message);
        throw new Error('Failed to create user profile');
      }

      set({
        session: data.session,
        user: {
          id: data.user.id,
          email: data.user.email!,
          name,
        },
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Registration process error:', error);
      throw error;
    }
  },
  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error.message);
        throw error;
      }
      set({ user: null, isAuthenticated: false, session: null });
    } catch (error) {
      console.error('Logout process error:', error);
      throw error;
    }
  },
}));