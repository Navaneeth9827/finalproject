import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserCheck, MapPin, Sprout, Globe, Phone, Loader2, AlertCircle, CheckCircle2, User } from 'lucide-react';

export const ProfileSetup = () => {
  const { profile, saveProfile } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [mobileNumber, setMobileNumber] = useState(profile?.mobile_number || '');
  const [district, setDistrict] = useState(profile?.district || '');
  const [mainCrop, setMainCrop] = useState(profile?.main_crop || '');
  const [preferredLanguage, setPreferredLanguage] = useState(profile?.preferred_language || 'English');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) return setError('Please enter your full name.');
    if (!mobileNumber.trim()) return setError('Please enter your mobile number.');
    if (!district) return setError('Please select your District.');
    if (!mainCrop) return setError('Please select your Main Crop.');

    setLoading(true);

    try {
      await saveProfile({
        full_name: fullName.trim(),
        mobile_number: mobileNumber.trim(),
        district,
        main_crop: mainCrop,
        preferred_language: preferredLanguage
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
      <div className="max-w-xl w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50">
        
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white mx-auto flex items-center justify-center shadow-md shadow-emerald-200 mb-4">
            <UserCheck className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Farmer Profile Setup</h2>
          <p className="text-xs text-slate-500 mt-1 font-semibold uppercase tracking-wider">
            Personalize Your Smart Advisory Experience
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              Full Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Ramesh Gowda"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-900 text-sm bg-slate-50/50 focus:bg-white"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              Mobile Number *
            </label>
            <input
              type="tel"
              required
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-900 text-sm bg-slate-50/50 focus:bg-white"
            />
          </div>

          {/* District Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              Agricultural District *
            </label>
            <select
              required
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-900 text-sm bg-slate-50/50 focus:bg-white"
            >
              <option value="">-- Select Your District --</option>
              <option value="Kolar">Kolar</option>
            </select>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Select your farm district (Saved only when explicitly chosen).</p>
          </div>

          {/* Main Crop Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-emerald-600" />
              Main Crop *
            </label>
            <select
              required
              value={mainCrop}
              onChange={(e) => setMainCrop(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-900 text-sm bg-slate-50/50 focus:bg-white"
            >
              <option value="">-- Select Your Primary Crop --</option>
              <option value="Tomato">Tomato</option>
            </select>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Select your main field cultivation crop.</p>
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              Preferred Language *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['English', 'Kannada', 'Hindi'].map((lang) => (
                <button
                  type="button"
                  key={lang}
                  onClick={() => setPreferredLanguage(lang)}
                  className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all border flex items-center justify-center gap-1.5 ${
                    preferredLanguage === lang
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {preferredLanguage === lang && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  <span>{lang}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl btn-primary text-base font-bold flex items-center justify-center gap-2 disabled:opacity-50 mt-8"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <span>Save & Continue to Dashboard</span>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
