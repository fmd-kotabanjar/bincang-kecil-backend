
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
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshPermissions: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  const fetchPermissions = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching permissions:', error);
        return;
      }

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

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user || null);

        if (session?.user) {
          // Use setTimeout to prevent potential deadlocks
          setTimeout(() => {
            fetchProfile(session.user.id);
            fetchPermissions(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setPermissions([]);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchPermissions(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
        }
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
  };

  const value = {
    user,
    profile,
    permissions,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    refreshPermissions
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
