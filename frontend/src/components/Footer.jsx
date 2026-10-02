import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Shield, ExternalLink, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand & Overview */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md">
                <Leaf className="w-5 h-5 fill-current" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-lg tracking-tight leading-none">
                  Smart Crop Advisory
                </span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5">
                  Precision AgTech Platform
                </span>
              </div>
            </Link>
            <p className="text-slate-400 text-xs font-medium leading-relaxed">
              AI-driven tomato leaf diagnostics and personalized agricultural advisory powered by state-of-the-art vision models.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-lg w-fit">
              <MapPin className="w-3.5 h-3.5" />
              <span>District-Based Crop Advisory</span>
            </div>
          </div>

          {/* Quick Platform Links */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Platform Features</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li>
                <Link to="/detect" className="hover:text-emerald-400 transition-colors">
                  AI Leaf Diagnostic Scan
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-emerald-400 transition-colors">
                  District Community Warnings
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">
                  Farmer Advisory Dashboard
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-emerald-400 transition-colors">
                  Farm Profile & Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Agricultural Extension Guidance */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Agricultural Partners</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li className="flex items-center gap-1.5">
                <span>ICAR - IIHR Advisory Guidelines</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>Krishi Vigyan Kendra (KVK) Network</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>PlantVillage Crop Knowledge Base</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>Out-of-Scope Quality Shield Filter</span>
              </li>
            </ul>
          </div>

          {/* Platform Standards */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Early Warning Protection</h4>
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Shield className="w-4 h-4" />
                <span>Community Early Warning</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Connects validated crop diagnoses to local district alerts to help neighboring farms prevent disease outbreaks.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
          <p>© {new Date().getFullYear()} Smart Crop Advisory System. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Agricultural Hotline</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
