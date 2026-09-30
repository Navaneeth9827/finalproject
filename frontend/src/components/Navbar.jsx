import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, ShieldAlert, BarChart3, User, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';

export const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-header border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-200 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-slate-900 text-lg tracking-tight leading-none group-hover:text-emerald-700 transition-colors">
                Smart Crop Advisory
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest mt-0.5">
                Precision AgTech
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3.5 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-1.5 ${
                    isActive('/dashboard')
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                  Dashboard
                </Link>

                <Link
                  to="/detect"
                  className={`px-3.5 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-1.5 ${
                    isActive('/detect')
                      ? 'bg-emerald-600 text-white font-bold shadow-sm shadow-emerald-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  Disease Detection
                </Link>

                <Link
                  to="/reports"
                  className={`px-3.5 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-1.5 ${
                    isActive('/reports')
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  Analytics Report
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`px-3.5 py-2 rounded-lg font-semibold text-sm transition-all ${
                    isActive('/') ? 'text-emerald-700 font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Product Overview
                </Link>
              </>
            )}
          </nav>

          {/* Right Action / Auth Status */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 transition-colors text-slate-800 text-xs font-semibold"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'F'}
                  </div>
                  <span>{profile?.full_name || user.email?.split('@')[0]}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary px-4 py-2 rounded-lg text-xs font-bold"
                >
                  Create Free Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Slide-down Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-semibold text-sm text-slate-700 hover:bg-slate-100"
              >
                Dashboard
              </Link>
              <Link
                to="/detect"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-semibold text-sm text-emerald-700 bg-emerald-50"
              >
                Disease Detection
              </Link>
              <Link
                to="/reports"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-semibold text-sm text-slate-700 hover:bg-slate-100"
              >
                Analytics Report
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-semibold text-sm text-slate-700 hover:bg-slate-100"
              >
                Account Settings
              </Link>
              <button
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="w-full text-left px-3 py-2 rounded-lg font-semibold text-sm text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-semibold text-sm text-slate-700 hover:bg-slate-100"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-bold text-sm bg-emerald-600 text-white text-center shadow-xs"
              >
                Create Free Account
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
