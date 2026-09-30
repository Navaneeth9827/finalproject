import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sprout, Cpu, CheckCircle2, ArrowRight, Zap, MapPin, Eye, PhoneCall, Award } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex flex-col font-sans">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-mesh py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs sm:text-sm mb-6 border border-emerald-200/80 shadow-xs">
            <Sprout className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Next-Gen Precision AgTech Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Instant AI Diagnostics for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">Tomato Crop Protection</span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Protect your yield with real-time tomato leaf disease identification powered by state-of-the-art vision models and verified agricultural advisory.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl btn-primary text-base font-bold shadow-lg flex items-center justify-center gap-2 group"
            >
              <span>Start Free Diagnosis</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/reports"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-200 shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Award className="w-5 h-5 text-emerald-600" />
              <span>View Accuracy Metrics</span>
            </Link>
          </div>

          {/* Key Metrics Banner */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="card-product p-5 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600">98.15%</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Test Accuracy</div>
            </div>
            <div className="card-product p-5 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-black text-teal-600">&lt; 2 Sec</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Scan Speed</div>
            </div>
            <div className="card-product p-5 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-black text-slate-900">9 Classes</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Disease Range</div>
            </div>
            <div className="card-product p-5 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-black text-emerald-700">OOD Shield</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Quality Guard</div>
            </div>
          </div>

        </div>
      </section>

      {/* Product Capabilities Cards */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Designed for Modern Agribusiness & Farmers
          </h2>
          <p className="text-slate-600 font-medium text-sm sm:text-base mt-3">
            Combining state-of-the-art machine learning with localized agricultural advisory to ensure crop health and maximize harvest yields.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="card-product p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6 shadow-xs">
                <Cpu className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">VMamba Selective Scan Model</h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                Uses 2D selective state-space scanning to capture fine-grained leaf pathology, early spots, and fungal spore textures across 9 tomato diseases.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zero Hallucination Backbone</span>
            </div>
          </div>

          <div className="card-product p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-6 shadow-xs">
                <Eye className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">Out-of-Scope Quality Shield</h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                Smart validation filters prevent incorrect diagnostic results if non-leaf objects, severely blurry photos, or unrelated subjects are uploaded.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-teal-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Automated Image Quality Guard</span>
            </div>
          </div>

          <div className="card-product p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-6 shadow-xs">
                <Sprout className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">Verified Actionable Advisory</h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                Clear, step-by-step recommendations for symptoms, organic and chemical management, favorable conditions, and direct Krishi Vigyan Kendra contact.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-amber-800 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-amber-600" />
              <span>ICAR-IIHR Verified Guidance</span>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white border-y border-slate-200/60 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">Simple 3-Step Process</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              How Smart Advisory Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            <div className="card-product p-8 rounded-3xl text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-md">
                1
              </div>
              <h4 className="text-lg font-bold text-slate-900">Upload Leaf Photo</h4>
              <p className="text-slate-600 text-xs font-medium leading-relaxed">
                Take a clear picture of the affected tomato leaf on your phone or camera and upload it into our diagnostic scan portal.
              </p>
            </div>

            <div className="card-product p-8 rounded-3xl text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-md">
                2
              </div>
              <h4 className="text-lg font-bold text-slate-900">AI Quality & Vision Analysis</h4>
              <p className="text-slate-600 text-xs font-medium leading-relaxed">
                The VMamba model verifies leaf quality, filters out-of-scope images, and scans for visual disease pathogens.
              </p>
            </div>

            <div className="card-product p-8 rounded-3xl text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-md">
                3
              </div>
              <h4 className="text-lg font-bold text-slate-900">Receive Treatment Plan</h4>
              <p className="text-slate-600 text-xs font-medium leading-relaxed">
                Get an instant diagnostic report with symptoms, cause breakdown, bio-pesticide recommendations, and KVK advisory support.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black">Ready to protect your tomato crops?</h3>
            <p className="text-emerald-100 text-sm font-medium max-w-xl">
              Create your free farmer account now and start scanning tomato leaves in seconds.
            </p>
          </div>
          <Link
            to="/signup"
            className="px-8 py-4 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 font-extrabold text-base shadow-lg transition-all hover:scale-105 shrink-0"
          >
            Create Free Account
          </Link>
        </div>
      </section>

    </div>
  );
};
