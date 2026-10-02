import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Users, Sprout, MapPin, Globe, Cpu, ArrowRight, Activity, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';

export const Dashboard = () => {
  const { profile, user } = useAuth();
  const farmerName = profile?.full_name || user?.email?.split('@')[0] || 'Farmer';
  const farmerDistrict = profile?.district || 'Kolar';

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
              Detect crop diseases in real-time, track 7-day Mandi market prices, and stay updated with local district warnings.
            </p>
          </div>

          {/* Profile Quick Overview */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-xs text-emerald-50 space-y-2 shrink-0 w-full md:w-auto">
            <div className="flex items-center gap-2 font-medium">
              <MapPin className="w-4 h-4 text-emerald-300" />
              <span>District: <strong className="text-white font-bold">{farmerDistrict}</strong></span>
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

        {/* Primary Features Grid: Disease Detection, Price Prediction & Community */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Feature 1: Disease Detection Card */}
          <div className="bg-white rounded-3xl p-8 border border-emerald-200/80 shadow-xl shadow-emerald-50/50 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-emerald-100/60 to-teal-50/20 rounded-full blur-3xl -z-0 pointer-events-none" />
            
            <div className="relative z-10 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-200">
                <ShieldAlert className="w-8 h-8" />
              </div>

              <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                DISEASE DIAGNOSIS
              </div>

              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Scan Crop Leaf
              </h2>

              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                Upload a photo of an affected leaf for instant AI diagnosis, validated out-of-scope filtering, and verified agricultural treatment advisory.
              </p>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-slate-100">
              <Link
                to="/detect"
                className="inline-flex items-center justify-between w-full px-6 py-3.5 rounded-2xl btn-primary text-base font-bold shadow-md transition-all group"
              >
                <span>Launch Disease Detector</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Feature 2: Price Prediction Card */}
          <div className="bg-white rounded-3xl p-8 border border-teal-200/80 shadow-xl shadow-teal-50/50 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-teal-100/60 to-emerald-50/20 rounded-full blur-3xl -z-0 pointer-events-none" />
            
            <div className="relative z-10 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-700 text-white flex items-center justify-center shadow-md shadow-teal-200">
                <TrendingUp className="w-8 h-8" />
              </div>

              <div className="inline-block px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
                MARKET INTELLIGENCE
              </div>

              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                7-Day Price Forecast
              </h2>

              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                Track live Mandi rates & 7-day predicted prices per quintal and per kg powered by weather and market arrival trends.
              </p>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-slate-100">
              <Link
                to="/price-prediction"
                className="inline-flex items-center justify-between w-full px-6 py-3.5 rounded-2xl bg-teal-800 hover:bg-teal-900 text-white text-base font-bold shadow-md transition-all group"
              >
                <span>View Price Forecast</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Feature 3: Community Advisory Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-100 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-slate-100/60 to-emerald-50/20 rounded-full blur-3xl -z-0 pointer-events-none" />
            
            <div className="relative z-10 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 text-white flex items-center justify-center shadow-md shadow-slate-300">
                <Users className="w-8 h-8" />
              </div>

              <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider">
                LOCAL WARNINGS
              </div>

              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Community Alerts
              </h2>

              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                View verified disease alerts in <strong>{farmerDistrict} District</strong> based on detections made by other farmers in your area to prevent outbreaks.
              </p>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-slate-100">
              <Link
                to="/community"
                className="inline-flex items-center justify-between w-full px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-base font-bold shadow-md transition-all group"
              >
                <span>View District Warnings</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>

        {/* System Capability Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="card-product p-6 rounded-3xl space-y-2 bg-white border border-slate-200">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Diagnosis Scope</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xl font-black text-slate-900">Multi-Class Detection</p>
            <p className="text-xs text-slate-600 font-medium">Bacterial Spot, Early/Late Blight, Leaf Mold, Septoria, Spider Mites, Yellow Leaf Curl, Mosaic Virus, Healthy.</p>
          </div>

          <div className="card-product p-6 rounded-3xl space-y-2 bg-white border border-slate-200">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>District Protection</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-xl font-black text-emerald-700">Early Warning Network</p>
            <p className="text-xs text-slate-600 font-medium">Aggregates anonymized disease occurrences per district to warn neighboring farms before infections spread.</p>
          </div>

          <div className="card-product p-6 rounded-3xl space-y-2 bg-white border border-slate-200">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Quality Guard</span>
              <Activity className="w-4 h-4 text-teal-600" />
            </div>
            <p className="text-xl font-black text-teal-700">Automated Validation</p>
            <p className="text-xs text-slate-600 font-medium">Guards against non-leaf photos, blurry focus, or invalid uploads to ensure reliable advisory.</p>
          </div>

        </div>

      </div>
    </div>
  );
};

