import { create } from 'zustand';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthState {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  initialize: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  supabaseUser: null,
  isAuthenticated: false,
  loading: true,

  initialize: async () => {
    try {
      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        set({ loading: false });
        return;
      }

      if (session?.user) {
        // Get user profile from our users table
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          // If profile doesn't exist, create it
          if (profileError.code === 'PGRST116') {
            const newUser: Partial<User> = {
              id: session.user.id,
              email: session.user.email!,
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              role: 'user',
              created_at: new Date().toISOString()
            };

            const { data: createdUser, error: createError } = await supabase
              .from('users')
              .insert([newUser])
              .select()
              .single();

            if (createError) {
              console.error('Error creating user profile:', createError);
              set({ loading: false });
              return;
            }

            set({
              user: createdUser,
              supabaseUser: session.user,
              isAuthenticated: true,
              loading: false
            });
          } else {
            set({ loading: false });
          }
        } else {
          set({
            user: userProfile,
            supabaseUser: session.user,
            isAuthenticated: true,
            loading: false
          });
        }
      } else {
        set({ loading: false });
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Get user profile
          const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError && profileError.code === 'PGRST116') {
            // Create profile if it doesn't exist
            const newUser: Partial<User> = {
              id: session.user.id,
              email: session.user.email!,
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              role: 'user',
              created_at: new Date().toISOString()
            };

            const { data: createdUser, error: createError } = await supabase
              .from('users')
              .insert([newUser])
              .select()
              .single();

            if (!createError) {
              set({
                user: createdUser,
                supabaseUser: session.user,
                isAuthenticated: true,
                loading: false
              });
            }
          } else if (!profileError) {
            set({
              user: userProfile,
              supabaseUser: session.user,
              isAuthenticated: true,
              loading: false
            });
          }
        } else if (event === 'SIGNED_OUT') {
          set({
            user: null,
            supabaseUser: null,
            isAuthenticated: false,
            loading: false
          });
        }
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ loading: false });
    }
  },

  login: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Có lỗi xảy ra khi đăng nhập' };
    }
  },

  loginWithGoogle: async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Có lỗi xảy ra khi đăng nhập với Google' };
    }
  },

  register: async (fullName: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user && !data.session) {
        return { 
          success: true, 
          error: 'Vui lòng kiểm tra email để xác nhận tài khoản' 
        };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Có lỗi xảy ra khi đăng ký' };
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  },

  updateProfile: async (userData: Partial<User>) => {
    try {
      const { user } = get();
      if (!user) {
        return { success: false, error: 'Người dùng chưa đăng nhập' };
      }

      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      set({ user: data });
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Có lỗi xảy ra khi cập nhật thông tin' };
    }
  }
}));