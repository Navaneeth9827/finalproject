import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
  Users, MapPin, AlertTriangle, RefreshCw, Sprout, CheckCircle2, ShieldAlert
} from 'lucide-react';

export const CommunityPage = () => {
  const { user, profile } = useAuth();
  const [activeDistrict, setActiveDistrict] = useState(profile?.district || '');
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCommunityWarningsFromSupabase = async () => {
    setLoading(true);
    setError('');

    try {
      // 1. Get logged-in farmer from Supabase Auth
      const { data: authData, error: authErr } = await supabase.auth.getUser();
      const currentUser = authData?.user;

      if (authErr || !currentUser) {
        setError('Please sign in to view community disease alerts for your district.');
        setWarnings([]);
        setLoading(false);
        return;
      }

      // 2. Read farmer's saved district from farmer_profiles table in Supabase
      const { data: dbProfile, error: profileErr } = await supabase
        .from('farmer_profiles')
        .select('district')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (profileErr) {
        console.error('Supabase SELECT error from farmer_profiles:', profileErr);
        setError(`Failed to retrieve farmer profile: ${profileErr.message}`);
        setWarnings([]);
        setLoading(false);
        return;
      }

      if (!dbProfile?.district) {
        setError('No district specified in your profile. Please complete your profile setup with your agricultural district.');
        setWarnings([]);
        setLoading(false);
        return;
      }

      const districtName = dbProfile.district;
      setActiveDistrict(districtName);

      // 3. Read Community reports directly from Supabase table: community_disease_reports
      const { data: reports, error: supabaseErr } = await supabase
        .from('community_disease_reports')
        .select('*')
        .eq('district', districtName)
        .eq('is_active', true)
        .order('detected_at', { ascending: false });

      if (supabaseErr) {
        console.error('Supabase SELECT error from community_disease_reports:', supabaseErr);
        setError(`Supabase Query Error: ${supabaseErr.message}`);
        setWarnings([]);
        return;
      }

      if (!reports || reports.length === 0) {
        setWarnings([]);
        return;
      }

      // Group recent warnings of the same crop & disease in the district for clear display
      const groupedMap = new Map();
      reports.forEach(r => {
        const key = `${r.crop_name || 'Tomato'}_${r.disease_name}`;
        if (!groupedMap.has(key)) {
          groupedMap.set(key, {
            id: r.id,
            district: r.district,
            crop_name: r.crop_name || 'Tomato',
            disease_name: r.disease_name,
            warning_title: r.warning_title || r.disease_name,
            warning_message: r.warning_message,
            occurrence_count: 1,
            last_detected_at: r.detected_at
          });
        } else {
          const existing = groupedMap.get(key);
          existing.occurrence_count += 1;
        }
      });

      setWarnings(Array.from(groupedMap.values()));
    } catch (err) {
      console.error('Community page Supabase fetch error:', err);
      setError(`Failed to retrieve community reports: ${err.message}`);
      setWarnings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityWarningsFromSupabase();
  }, [user]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-emerald-300 font-bold text-xs mb-3 backdrop-blur-md border border-white/10">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Community Early Warning System</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Community Alerts
            </h1>
            
            <p className="text-slate-300 text-sm font-medium mt-2 leading-relaxed">
              Stay informed about verified crop problems recently detected by farmers in your district to protect your yield early.
            </p>
          </div>

          {/* User's Automatically Detected District Badge */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shrink-0 w-full sm:w-auto space-y-1">
            <div className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider">Your Registered District</div>
            <div className="flex items-center gap-2 text-white text-lg font-black">
              <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{activeDistrict ? `${activeDistrict} District` : 'District Advisory'}</span>
            </div>
            <div className="text-[11px] text-emerald-300 font-medium">
              Automatic location advisory
            </div>
          </div>
        </div>

        {/* Refresh Action Bar */}
        <div className="flex justify-between items-center px-1">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <span>Recent Problems Reported {activeDistrict ? `in ${activeDistrict}` : ''}</span>
          </h2>

          <button
            onClick={fetchCommunityWarningsFromSupabase}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Warnings</span>
          </button>
        </div>

        {/* Main Warnings List / States */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Sprout className="w-6 h-6 animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Checking District Alerts...</h3>
            <p className="text-xs text-slate-500">Retrieving recent verified crop detections {activeDistrict ? `in ${activeDistrict} District` : ''}</p>
          </div>
        ) : error ? (
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 text-amber-900 font-medium text-sm flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>{error}</span>
          </div>
        ) : warnings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900">No Active Warnings in {activeDistrict} District</h3>
            <p className="text-slate-600 text-sm font-medium max-w-md mx-auto">
              There are currently no active crop disease alerts reported by farmers in {activeDistrict} District. Your area's crops are clear!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {warnings.map((warning) => (
              <div
                key={warning.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-md hover:shadow-lg transition-all p-6 space-y-3"
              >
                {/* Header: Compact Warning Title & Tags */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500 text-lg">⚠️</span>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                      {warning.warning_title || warning.disease_name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold">
                      {warning.crop_name || 'Tomato'}
                    </span>
                    {warning.occurrence_count > 1 && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                        {warning.occurrence_count} Recent Detections
                      </span>
                    )}
                  </div>
                </div>

                {/* Single Compact Paragraph Warning Message */}
                <p className="text-slate-700 text-sm sm:text-base font-medium leading-relaxed">
                  “{warning.warning_message}”
                </p>

                {/* Footer Metadata */}
                <div className="pt-2 flex justify-between items-center text-[11px] text-slate-400 font-medium border-t border-slate-50">
                  <span>Reported in {activeDistrict} District</span>
                  <span className="italic">Identity Protected • Verified Advice</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
