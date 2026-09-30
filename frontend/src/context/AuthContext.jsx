import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId) => {
    try {
      // Check local storage first for fast load
      const cached = localStorage.getItem(`farmer_profile_${userId}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setProfile(parsed);
        } catch (e) {}
      }

      const { data, error } = await supabase
        .from('farmer_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        // If Supabase RLS is restricted, use cached profile or default fallback profile
        if (!profile && cached) {
          return JSON.parse(cached);
        }
        return profile;
      }

      if (data) {
        setProfile(data);
        localStorage.setItem(`farmer_profile_${userId}`, JSON.stringify(data));
        return data;
      }

      return profile;
    } catch (err) {
      console.warn('Profile fetch handled gracefully:', err.message);
      return profile;
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data?.user) {
      await fetchProfile(data.user.id);
    }
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
    setProfile(null);
    localStorage.clear();
  };

  const saveProfile = async (profileData) => {
    if (!user) throw new Error('User must be authenticated to save profile.');

    const payload = {
      id: user.id,
      full_name: profileData.full_name,
      mobile_number: profileData.mobile_number,
      district: profileData.district,
      main_crop: profileData.main_crop,
      preferred_language: profileData.preferred_language,
      updated_at: new Date().toISOString()
    };

    // Save locally first so UI updates immediately
    setProfile(payload);
    localStorage.setItem(`farmer_profile_${user.id}`, JSON.stringify(payload));

    try {
      const { data, error } = await supabase
        .from('farmer_profiles')
        .upsert(payload)
        .select()
        .single();

      if (error) {
        console.warn('Supabase DB save fallback:', error.message);
        return payload;
      }
      if (data) {
        setProfile(data);
        localStorage.setItem(`farmer_profile_${user.id}`, JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn('Profile save offline/fallback active');
    }

    return payload;
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      fetchProfile,
      saveProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
