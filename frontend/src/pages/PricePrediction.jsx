import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Store,
  Sprout,
  Calendar,
  CloudSun,
  Loader2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  DollarSign,
  ArrowRight,
  Info,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const PricePrediction = () => {
  const { profile } = useAuth();

  const [markets, setMarkets] = useState([
    'Bengaluru APMC',
    'Kolar',
    'Chintamani',
    'Chickkaballapura',
    'Bagepalli',
    'Bangarpet',
    'Davangere',
    'Belgaum',
    'Arasikere',
    'Mysore',
    'Hubli',
    'Hassan',
    'Mandya',
    'Bagalkot',
    'Bellary',
  ]);
  const [commodities, setCommodities] = useState(['Onion', 'Tomato', 'Potato', 'Rice', 'Wheat']);

  const [selectedMarket, setSelectedMarket] = useState('Bengaluru APMC');
  const [selectedCommodity, setSelectedCommodity] = useState('Onion');

  const [loading, setLoading] = useState(false);
  const [fetchingMetaData, setFetchingMetaData] = useState(true);
  const [error, setError] = useState('');
  const [predictionResult, setPredictionResult] = useState(null);

  // Set smart initial defaults based on farmer profile
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setFetchingMetaData(true);
        const [resM, resC] = await Promise.all([
          fetch(`${API_BASE_URL}/api/price/markets`).then((r) => r.json()).catch(() => null),
          fetch(`${API_BASE_URL}/api/price/commodities`).then((r) => r.json()).catch(() => null),
        ]);

        if (resM?.markets && resM.markets.length > 0) {
          setMarkets(resM.markets);
          // Pre-select farmer's district if available in market list
          if (profile?.district) {
            const matchedM = resM.markets.find(
              (m) => m.toLowerCase().includes(profile.district.toLowerCase())
            );
            if (matchedM) setSelectedMarket(matchedM);
          }
        }

        if (resC?.commodities && resC.commodities.length > 0) {
          setCommodities(resC.commodities);
          // Pre-select farmer's crop if available in commodity list
          if (profile?.main_crop) {
            const matchedC = resC.commodities.find(
              (c) => c.toLowerCase() === profile.main_crop.toLowerCase()
            );
            if (matchedC) setSelectedCommodity(matchedC);
          }
        }
      } catch (err) {
        console.error('Metadata fetch warning:', err);
      } finally {
        setFetchingMetaData(false);
      }
    };

    fetchMetadata();
  }, [profile]);

  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    setPredictionResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/price/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          market: selectedMarket,
          commodity: selectedCommodity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to fetch price predictions.');
      }

      const data = await response.json();
      if (data.status === 'success') {
        setPredictionResult(data);
      } else {
        throw new Error(data.message || 'Price prediction failed.');
      }
    } catch (err) {
      console.error('Price prediction error:', err);
      setError(
        err.message ||
          'Unable to connect to the Price Prediction server. Please check your network or try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Initial load prediction
  useEffect(() => {
    handlePredict();
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-400/20 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Verified Random Forest AI Model</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Market Price Forecast & Trends
              </h1>
              <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed">
                7-day predictive pricing powered by weather patterns, mandi arrivals, and historical agricultural market intelligence.
              </p>
            </div>

            {profile && (
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-xs space-y-2 shrink-0 w-full sm:w-auto">
                <div className="text-emerald-300 font-bold uppercase tracking-wider text-[10px]">
                  Farmer Profile Defaults
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>District: <strong className="text-white">{profile.district || 'Kolar'}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Sprout className="w-4 h-4 text-emerald-400" />
                  <span>Crop: <strong className="text-white">{profile.main_crop || 'Tomato'}</strong></span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Market Selection Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
          <form onSubmit={handlePredict} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            
            {/* Select Market */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-600" />
                <span>Select APMC Market</span>
              </label>
              <select
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:opacity-50 text-sm"
              >
                {markets.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Commodity */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>Select Crop / Commodity</span>
              </label>
              <select
                value={selectedCommodity}
                onChange={(e) => setSelectedCommodity(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:opacity-50 text-sm"
              >
                {commodities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3.5 px-6 rounded-2xl font-bold text-sm shadow-md flex items-center justify-center gap-2 group transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing Market Data...</span>
                  </>
                ) : (
                  <>
                    <span>Generate 7-Day Forecast</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Error Alert State */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-rose-800 flex items-start gap-4 shadow-sm">
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              <h3 className="font-bold text-sm text-rose-900">Price Prediction Unavailable</h3>
              <p className="text-xs text-rose-700">{error}</p>
            </div>
            <button
              onClick={handlePredict}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        )}

        {/* Loading Spinner Skeleton */}
        {loading && (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4 shadow-md">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />
            <div className="space-y-1">
              <p className="font-bold text-slate-800 text-base">Running Random Forest Model...</p>
              <p className="text-xs text-slate-500 font-medium">
                Fetching weather forecasts & Mandi prices for {selectedCommodity} in {selectedMarket}
              </p>
            </div>
          </div>
        )}

        {/* Prediction Results */}
        {predictionResult && !loading && (
          <div className="space-y-8">
            
            {/* Top Cards: Current Market Price vs 7-Day Outlook */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Card 1: Current Market Price */}
              <div className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-md relative overflow-hidden flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                      CURRENT MARKET PRICE
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {predictionResult.current_price?.source || 'Mandi Data'}
                    </span>
                  </div>

                  <div>
                    <div className="text-3xl font-black text-slate-900">
                      ₹{predictionResult.current_price?.modal_price?.toLocaleString('en-IN')}{' '}
                      <span className="text-xs font-bold text-slate-500">/ quintal</span>
                    </div>
                    <div className="text-lg font-bold text-emerald-700 mt-1">
                      ₹{predictionResult.current_price?.modal_price_kg}{' '}
                      <span className="text-xs font-semibold text-slate-500">/ kg</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 flex justify-between font-medium">
                    <span>Range: ₹{predictionResult.current_price?.min_price} – ₹{predictionResult.current_price?.max_price}</span>
                    <span>Date: {predictionResult.current_price?.date}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: 7-Day Average Predicted Price */}
              <div className="bg-white rounded-3xl p-6 border border-teal-200 shadow-md flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
                      7-DAY FORECAST AVG
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">Random Forest AI</span>
                  </div>

                  <div>
                    <div className="text-3xl font-black text-slate-900">
                      ₹{predictionResult.summary?.avg_predicted_quintal?.toLocaleString('en-IN')}{' '}
                      <span className="text-xs font-bold text-slate-500">/ quintal</span>
                    </div>
                    <div className="text-lg font-bold text-teal-700 mt-1">
                      ₹{predictionResult.summary?.avg_predicted_kg}{' '}
                      <span className="text-xs font-semibold text-slate-500">/ kg</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 flex justify-between font-medium">
                    <span>Min: ₹{predictionResult.summary?.min_predicted_quintal}</span>
                    <span>Max: ₹{predictionResult.summary?.max_predicted_quintal}</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Overall Market Trend Outlook */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider">
                    7-DAY TREND OUTLOOK
                  </span>

                  <div className="flex items-center gap-3">
                    {predictionResult.summary?.overall_trend === 'upward' ? (
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-7 h-7" />
                      </div>
                    ) : predictionResult.summary?.overall_trend === 'downward' ? (
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                        <TrendingDown className="w-7 h-7" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                        <Minus className="w-7 h-7" />
                      </div>
                    )}

                    <div>
                      <div className="text-lg font-black text-slate-900 leading-tight">
                        {predictionResult.summary?.overall_trend_label}
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Based on sequential lag prices & 7-day weather inputs
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-1 font-medium">
                  <Info className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Market: {predictionResult.market} • Crop: {predictionResult.commodity}</span>
                </div>
              </div>

            </div>

            {/* 7-Day Detailed Forecast Grid */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    Daily Price Forecast & Weather Conditions
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Prices converted per Quintal (100 kg) and per Kilogram (1 kg)
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>19-Feature Prediction Pipeline</span>
                </div>
              </div>

              {/* Table Grid for 7 Days */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                {predictionResult.forecast?.map((day) => (
                  <div
                    key={day.date}
                    className="bg-slate-50 hover:bg-emerald-50/40 rounded-2xl p-4 border border-slate-200/80 hover:border-emerald-300 transition-all flex flex-col justify-between space-y-3"
                  >
                    {/* Header: Day & Date */}
                    <div className="border-b border-slate-200/60 pb-2">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {day.day_name}
                      </div>
                      <div className="text-sm font-black text-slate-900">
                        {new Date(day.date).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>

                    {/* Price Predictions */}
                    <div className="space-y-1">
                      <div className="text-lg font-black text-slate-900">
                        ₹{day.predicted_price_quintal?.toLocaleString('en-IN')}
                        <span className="text-[10px] font-bold text-slate-500 block">/ quintal</span>
                      </div>
                      <div className="text-xs font-bold text-emerald-700">
                        ₹{day.predicted_price_kg}{' '}
                        <span className="text-[10px] font-medium text-slate-500">/ kg</span>
                      </div>
                    </div>

                    {/* Daily Trend Badge */}
                    <div className="pt-2 border-t border-slate-200/60">
                      <div
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full w-full justify-center ${
                          day.trend === 'up'
                            ? 'bg-emerald-100 text-emerald-800'
                            : day.trend === 'down'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        {day.trend === 'up' ? (
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                        ) : day.trend === 'down' ? (
                          <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                        ) : (
                          <Minus className="w-3.5 h-3.5 text-slate-500" />
                        )}
                        <span>{day.trend_label}</span>
                      </div>
                    </div>

                    {/* Weather Context */}
                    <div className="bg-white/80 rounded-xl p-2 text-[10px] space-y-1 text-slate-600 border border-slate-100 font-medium">
                      <div className="flex items-center justify-between">
                        <span>Temp:</span>
                        <strong className="text-slate-900">{day.weather?.temperature}°C</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Rain:</span>
                        <strong className="text-slate-900">{day.weather?.rain} mm</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Humidity:</span>
                        <strong className="text-slate-900">{day.weather?.humidity}%</strong>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
