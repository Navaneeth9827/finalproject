import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Sprout, MapPin, Globe, Cpu, Award, ArrowRight, Activity, CheckCircle2 } from 'lucide-react';

export const Dashboard = () => {
  const { profile, user } = useAuth();
  const farmerName = profile?.full_name || user?.email?.split('@')[0] || 'Farmer';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-800 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-emerald-200 font-bold text-xs mb-3 backdrop-blur-md border border-white/10">
              <Sprout className="w-4 h-4 text-emerald-300" />
              <span>Smart Crop Advisory Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Hello, {farmerName} 👋
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base font-medium mt-2 max-w-xl">
              Detect tomato crop diseases in real-time, inspect leaf health, and access tailored agro-advisory instructions.
            </p>
          </div>

          {/* Profile Quick Overview */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-xs text-emerald-50 space-y-2 shrink-0 w-full md:w-auto">
            <div className="flex items-center gap-2 font-medium">
              <MapPin className="w-4 h-4 text-emerald-300" />
              <span>District: <strong className="text-white font-bold">{profile?.district || 'Not Selected'}</strong></span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <Sprout className="w-4 h-4 text-emerald-300" />
              <span>Main Crop: <strong className="text-white font-bold">{profile?.main_crop || 'Tomato'}</strong></span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <Globe className="w-4 h-4 text-emerald-300" />
              <span>Language: <strong className="text-white font-bold">{profile?.preferred_language || 'English'}</strong></span>
            </div>
          </div>
        </div>

        {/* Primary Action Hero Card: Disease Detection */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-emerald-200/80 shadow-xl shadow-emerald-50/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-100/60 to-teal-50/20 rounded-full blur-3xl -z-0 pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mb-6 shadow-md shadow-emerald-200">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
              PRIMARY ADVISORY ACTION
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 tracking-tight">
              Run Tomato Leaf AI Scan
            </h2>

            <p className="text-slate-600 text-base font-medium leading-relaxed mb-6">
              Upload a photo of an affected tomato leaf to run instant diagnosis powered by our fine-tuned VMamba Tiny state-space model. Includes automated out-of-scope leaf validation and custom advisory steps.
            </p>

            <div className="flex flex-wrap gap-3 items-center mb-8 text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5 bg-slate-100 px-3.5 py-2 rounded-xl">
                <Cpu className="w-4 h-4 text-emerald-600" />
                VMamba Backbone
              </span>
              <span className="flex items-center gap-1.5 bg-slate-100 px-3.5 py-2 rounded-xl">
                <Award className="w-4 h-4 text-amber-600" />
                98.15% Precision
              </span>
              <span className="flex items-center gap-1.5 bg-slate-100 px-3.5 py-2 rounded-xl">
                <Activity className="w-4 h-4 text-teal-600" />
                OOD Quality Shield
              </span>
            </div>

            <Link
              to="/detect"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl btn-primary text-lg font-bold shadow-lg transition-all group"
            >
              <span>Launch Disease Detector</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* System Capability Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="card-product p-6 rounded-3xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Target Crop Diseases</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">9 Tomato Classes</p>
            <p className="text-xs text-slate-600 font-medium">Bacterial Spot, Early/Late Blight, Leaf Mold, Septoria, Spider Mites, Yellow Leaf Curl, Mosaic Virus, Healthy.</p>
          </div>

          <div className="card-product p-6 rounded-3xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Evaluation Standard</span>
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-emerald-700">98.15% Accuracy</p>
            <p className="text-xs text-slate-600 font-medium">Empirically validated on 2,486 held-out test set photos with 97.53% Macro F1 Score.</p>
          </div>

          <div className="card-product p-6 rounded-3xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Out-of-Scope Shield</span>
              <Activity className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-teal-700">Automated Filter</p>
            <p className="text-xs text-slate-600 font-medium">Guards against non-leaf objects, blurry focus, or invalid uploads to ensure trustworthy advice.</p>
          </div>

        </div>

      </div>
    </div>
  );
};
