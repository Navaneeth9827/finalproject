import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { DiseaseResult } from './DiseaseResult';
import { Upload, Image as ImageIcon, X, ShieldAlert, Loader2, AlertCircle, RefreshCw, Cpu, CheckCircle2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const DiseaseDetection = () => {
  const { user, profile } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (file) => {
    setError('');
    setResult(null);

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG or PNG).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image size exceeds 10 MB limit. Please select a smaller photo.');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setResult(null);
    setError('');
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || 'Inference API server error.');
      }

      const data = await response.json();
      setResult(data);

      // Process Community Disease Report only for valid, reliable disease detections
      if (data.status === 'success' && !data.uncertain && data.disease && !data.disease.toLowerCase().includes('healthy')) {
        (async () => {
          try {
            // 1. Get logged-in farmer from Supabase Auth
            const { data: authData, error: authErr } = await supabase.auth.getUser();
            const currentUser = authData?.user;

            if (authErr || !currentUser) {
              console.error('Community report creation skipped: Logged-in farmer could not be retrieved from Supabase Auth.', authErr);
              setResult(prev => ({ ...prev, community_status: 'error', community_error: 'User not authenticated in Supabase Auth' }));
              return;
            }

            // 2. Read farmer's district and main_crop from existing farmer_profiles Supabase table
            const { data: dbProfile, error: profileErr } = await supabase
              .from('farmer_profiles')
              .select('district, main_crop')
              .eq('id', currentUser.id)
              .maybeSingle();

            if (profileErr) {
              console.error('Supabase SELECT failed for farmer_profiles:', profileErr.message, profileErr);
              setResult(prev => ({ ...prev, community_status: 'error', community_error: `farmer_profiles query error: ${profileErr.message}` }));
              return;
            }

            if (!dbProfile?.district) {
              console.error('Community report creation skipped: Logged-in farmer has no district in farmer_profiles table.');
              setResult(prev => ({ ...prev, community_status: 'error', community_error: 'No district saved in farmer profile' }));
              return;
            }

            const farmerDistrict = dbProfile.district;
            const farmerCrop = dbProfile.main_crop || 'Tomato';

            // 3. Get matching disease information from existing disease_knowledge Supabase table
            let diseaseKnowledgeRecord = null;
            const { data: dkData, error: dkErr } = await supabase
              .from('disease_knowledge')
              .select('*')
              .eq('disease_name', data.disease)
              .maybeSingle();

            if (dkErr) {
              console.error('Supabase SELECT failed for disease_knowledge:', dkErr.message, dkErr);
            } else if (dkData) {
              diseaseKnowledgeRecord = dkData;
            }

            // 4. Generate Community warning using Groq from that verified information
            const groqRes = await fetch(`${API_BASE_URL}/api/community/generate-warning`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                crop_name: farmerCrop,
                disease_name: data.disease,
                district: farmerDistrict,
                disease_info: diseaseKnowledgeRecord || data.disease_info || {}
              })
            });

            if (!groqRes.ok) {
              const errText = await groqRes.text();
              console.error('Groq warning generation backend request failed:', errText);
              setResult(prev => ({ ...prev, community_status: 'error', community_error: 'Groq warning generation failed' }));
              return;
            }

            const groqData = await groqRes.json();
            if (!groqData?.warning_message) {
              console.error('Groq warning generation returned empty warning_message. INSERT cancelled.');
              setResult(prev => ({ ...prev, community_status: 'error', community_error: 'Groq generated empty message' }));
              return;
            }

            // 5. INSERT resulting Community report into existing Supabase table: community_disease_reports
            const reportPayload = {
              farmer_id: currentUser.id,
              district: farmerDistrict,
              crop_name: farmerCrop,
              disease_name: data.disease,
              confidence: data.confidence,
              disease_knowledge_id: diseaseKnowledgeRecord?.id || null,
              warning_title: groqData.warning_title || data.disease,
              warning_message: groqData.warning_message,
              is_active: true,
              detected_at: new Date().toISOString()
            };

            const { data: insertedData, error: insertErr } = await supabase
              .from('community_disease_reports')
              .insert([reportPayload])
              .select();

            if (insertErr) {
              console.error('Supabase INSERT failed for community_disease_reports:', insertErr.message, insertErr);
              setResult(prev => ({ ...prev, community_status: 'error', community_error: insertErr.message }));
            } else {
              console.log('Successfully saved Community Report to Supabase community_disease_reports:', insertedData);
              setResult(prev => ({ ...prev, community_status: 'success', community_district: farmerDistrict, community_report: insertedData?.[0] }));
            }
          } catch (commErr) {
            console.error('Community report processing error:', commErr);
            setResult(prev => ({ ...prev, community_status: 'error', community_error: commErr.message }));
          }
        })();
      }
    } catch (err) {
      console.error('Inference error:', err);
      setError(err.message || 'Unable to connect to Disease Detection backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white mx-auto flex items-center justify-center shadow-md shadow-emerald-200 mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Tomato Leaf Diagnostic Scan
          </h1>
          <p className="text-slate-600 font-medium text-sm mt-2">
            Upload a high-resolution photo of an affected tomato leaf for instant VMamba AI analysis and custom treatment advisory.
          </p>
        </div>

        {/* Upload Dropzone Card */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50">
          
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!imagePreview ? (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-3 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all ${
                dragActive
                  ? 'border-emerald-500 bg-emerald-50/60 scale-[1.01]'
                  : 'border-slate-300 hover:border-emerald-400 bg-slate-50/40 hover:bg-slate-50'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-100/80 text-emerald-700 mx-auto flex items-center justify-center mb-4 shadow-xs">
                <Upload className="w-8 h-8" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Drag and drop your leaf photo here
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-6">
                Supports JPG, JPEG, and PNG format (max 10 MB)
              </p>

              <label className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl btn-primary text-sm font-bold shadow-md cursor-pointer transition-all">
                <ImageIcon className="w-4 h-4" />
                <span>Select Photo File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Image Preview Box with Scanner Overlay during Loading */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 max-h-96 flex items-center justify-center group">
                <img
                  src={imagePreview}
                  alt="Selected Tomato Leaf"
                  className="max-h-96 w-auto object-contain rounded-2xl"
                />

                {/* Scan Line Animation Overlay */}
                {loading && (
                  <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                    <div className="scan-animation" />
                    <div className="bg-slate-900/90 border border-emerald-500/40 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-xl">
                      <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                      <div className="text-left">
                        <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Scanning Leaf</div>
                        <div className="text-xs text-slate-300 font-medium">VMamba SS2D Selective Model...</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {!loading && (
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 hover:bg-red-600 text-white transition-colors shadow-md"
                    title="Remove Image"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-2">
                <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Out-of-Scope Quality Guard Active</span>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={loading}
                    className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Choose Different Image</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="flex-1 sm:flex-none px-8 py-3.5 rounded-2xl btn-primary text-base font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Cpu className="w-5 h-5" />
                        <span>Run AI Analysis</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Diagnostic Results Display */}
        {result && <DiseaseResult result={result} imagePreview={imagePreview} />}

      </div>
    </div>
  );
};
