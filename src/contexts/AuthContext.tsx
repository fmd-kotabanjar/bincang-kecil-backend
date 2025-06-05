import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  username: string;
  email: string;
  role: string;
  request_prompt_quota: number;
}

interface UserPermission {
  permission_key: string;
  granted_by_code: string;
  granted_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  permissions: UserPermission[];
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  adminLogin: (password: string) => Promise<boolean>;
  adminLogout: () => void;
  refreshPermissions: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default admin password - dalam production, ini harus lebih aman
const ADMIN_PASSWORD = 'admin123';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      console.log('Profile data:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  const fetchPermissions = async (userId: string) => {
    try {
      console.log('Fetching permissions for user:', userId);
      const { data, error } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching permissions:', error);
        return;
      }

      console.log('Permissions data:', data);
      setPermissions(data || []);
    } catch (error) {
      console.error('Error in fetchPermissions:', error);
    }
  };

  const refreshPermissions = async () => {
    if (user) {
      await fetchPermissions(user.id);
      await fetchProfile(user.id);
    }
  };

  // Admin login function
  const adminLogin = async (password: string): Promise<boolean> => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      console.log('Admin login successful');
      return true;
    }
    return false;
  };

  // Admin logout function
  const adminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
    console.log('Admin logout successful');
  };

  // Check admin status on mount
  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user || null);

        if (session?.user) {
          // Use setTimeout to prevent potential issues with auth state changes
          setTimeout(() => {
            if (mounted) {
              fetchProfile(session.user.id);
              fetchPermissions(session.user.id);
            }
          }, 100);
        } else {
          setProfile(null);
          setPermissions([]);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        console.log('Initial session:', session?.user?.email);
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
          await fetchPermissions(session.user.id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    const redirectUrl = `${window.location.origin}/dashboard`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
        },
        emailRedirectTo: redirectUrl
      }
    });

    if (error) throw error;
    
    console.log('Sign up successful:', data.user?.email);
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    
    console.log('Sign in successful:', data.user?.email);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    console.log('Sign out successful');
    setProfile(null);
    setPermissions([]);
    
    // Also logout admin if logged in
    adminLogout();
  };

  const value = {
    user,
    profile,
    permissions,
    session,
    loading,
    isAdmin,
    signUp,
    signIn,
    signOut,
    adminLogin,
    adminLogout,
    refreshPermissions
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
