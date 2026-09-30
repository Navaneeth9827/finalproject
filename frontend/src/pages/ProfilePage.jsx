import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Sprout, Globe, Phone, Edit3, ShieldCheck } from 'lucide-react';

export const ProfilePage = () => {
  const { profile, user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Main Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl shadow-slate-200/50">
          
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-slate-100 text-center sm:text-left">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-emerald-200 shrink-0">
              {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'F'}
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Farmer Account</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {profile?.full_name || 'Farmer Profile'}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-500">
                {user?.email}
              </p>
              <p className="text-xs text-slate-400 font-mono">
                Farmer Record ID: #{profile?.serial_number || 'AUTO-GEN'}
              </p>
            </div>
          </div>

          <div className="py-8 space-y-4">
            
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Mobile Number</p>
                <p className="text-sm sm:text-base font-bold text-slate-900">{profile?.mobile_number || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Agricultural District</p>
                <p className="text-sm sm:text-base font-bold text-slate-900">{profile?.district || 'Not selected'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Main Cultivation Crop</p>
                <p className="text-sm sm:text-base font-bold text-slate-900">{profile?.main_crop || 'Tomato'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Preferred Advisory Language</p>
                <p className="text-sm sm:text-base font-bold text-slate-900">{profile?.preferred_language || 'English'}</p>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <Link
              to="/profile-setup"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl btn-primary text-sm font-bold shadow-md transition-all"
            >
              <Edit3 className="w-4 h-4" />
              <span>Update Profile Info</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
