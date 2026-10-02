import React from 'react';
import {
  AlertTriangle, CheckCircle2, Info, Activity, Wind, Thermometer,
  ShieldCheck, Wrench, PhoneCall, ExternalLink, HelpCircle
} from 'lucide-react';

export const DiseaseResult = ({ result, imagePreview }) => {
  if (!result) return null;

  // 1. Unable to Detect / Out-of-Scope Banner
  if (result.status === 'unable_to_detect') {
    return (
      <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-8 text-center space-y-4 shadow-lg shadow-amber-100">
        <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto">
          <AlertTriangle className="w-9 h-9" />
        </div>
        <h3 className="text-2xl font-black text-amber-900">Unable to Detect</h3>
        <p className="text-amber-800 text-base font-medium max-w-lg mx-auto">
          {result.message || 'Unable to detect. Please upload a clear image of a tomato leaf.'}
        </p>
      </div>
    );
  }

  // 2. Low Confidence / Uncertain Banner
  if (result.status === 'uncertain' || result.uncertain) {
    return (
      <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-8 space-y-6 shadow-lg shadow-amber-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center shrink-0">
            <HelpCircle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-black text-amber-900">Result is Uncertain</h3>
            <p className="text-amber-800 text-sm font-medium mt-1">
              Prediction Confidence: {Math.round((result.confidence || 0) * 100)}% (Below threshold of 70%)
            </p>
            <p className="text-amber-900 font-semibold text-base mt-2">
              {result.message || 'Result is uncertain. Please upload a clearer image or consult an agricultural expert.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 3. Healthy Prediction Display
  if (result.disease === 'Healthy' || result.is_healthy) {
    const confidencePercent = Math.round((result.confidence || 0) * 100);
    return (
      <div className="space-y-8">
        
        {/* Healthy Result Header Card */}
        <div className="bg-white rounded-3xl border border-emerald-200 shadow-xl shadow-emerald-50 p-8 sm:p-10">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Diagnostic Result</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
                Healthy Tomato Leaf
              </h2>

              <p className="text-emerald-700 font-semibold text-base">
                No disease detected. Your crop leaf appears healthy and vigorous!
              </p>
            </div>

            {/* Confidence Badge */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center shrink-0 w-full sm:w-auto">
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Model Confidence</div>
              <div className="text-3xl font-black text-emerald-600 mt-1">{confidencePercent}%</div>
              <div className="text-[11px] text-emerald-700 font-medium">VMamba Tiny Fine-tuned</div>
            </div>

          </div>

          {/* Image Preview Thumbnail */}
          {imagePreview && (
            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-4">
              <img
                src={imagePreview}
                alt="Analyzed Leaf"
                className="w-20 h-20 object-cover rounded-xl border border-slate-200 shadow-sm"
              />
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Uploaded Image</p>
                <p className="text-sm font-semibold text-slate-800">Analyzed for 10 Tomato Leaf Classes</p>
              </div>
            </div>
          )}
        </div>

        {/* Good Maintenance Advisory Card */}
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-black text-emerald-900">Recommended Crop Maintenance</h3>
              <p className="text-emerald-700 text-xs font-medium">Keep your tomato crop thriving with good agricultural practices</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-emerald-100 space-y-2 shadow-xs">
              <h4 className="font-bold text-slate-900 text-sm">Balanced Drip Irrigation</h4>
              <p className="text-slate-600 text-xs font-medium">Water at plant base to keep foliage dry and avoid leaf moisture that encourages fungal spores.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-emerald-100 space-y-2 shadow-xs">
              <h4 className="font-bold text-slate-900 text-sm">Optimal Soil Nutrition</h4>
              <p className="text-slate-600 text-xs font-medium">Maintain recommended N-P-K fertilization and organic compost to strengthen plant immunity.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-emerald-100 space-y-2 shadow-xs">
              <h4 className="font-bold text-slate-900 text-sm">Weekly Inspection</h4>
              <p className="text-slate-600 text-xs font-medium">Regularly inspect leaf undersides for early signs of pests, whiteflies, or minor spots.</p>
            </div>
          </div>
        </div>

      </div>
    );
  }

  // 4. Success Disease Diagnosis Display
  const info = result.disease_info || {};
  const confidencePercent = Math.round((result.confidence || 0) * 100);

  return (
    <div className="space-y-8">
      
      {/* Top Main Result Card */}
      <div className="bg-white rounded-3xl border border-emerald-200 shadow-xl shadow-emerald-50 p-8 sm:p-10">
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Diagnostic Result</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              {result.disease}
            </h2>

            {info.scientific_name && (
              <p className="text-emerald-700 font-semibold italic text-base">
                {info.scientific_name}
              </p>
            )}

            {/* Supabase Community Report Status Badge */}
            {result.community_status === 'success' && (
              <div className="mt-2 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Community Report Saved to Supabase ({result.community_district} District)</span>
              </div>
            )}
            {result.community_status === 'error' && (
              <div className="mt-2 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span>Supabase Community INSERT Error: {result.community_error}</span>
              </div>
            )}
          </div>

          {/* Confidence Badge */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center shrink-0 w-full sm:w-auto">
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Model Confidence</div>
            <div className="text-3xl font-black text-emerald-600 mt-1">{confidencePercent}%</div>
            <div className="text-[11px] text-emerald-700 font-medium">VMamba Tiny Fine-tuned</div>
          </div>

        </div>

        {/* Image Preview Thumbnail if provided */}
        {imagePreview && (
          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-4">
            <img
              src={imagePreview}
              alt="Analyzed Leaf"
              className="w-20 h-20 object-cover rounded-xl border border-slate-200 shadow-sm"
            />
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Uploaded Image</p>
              <p className="text-sm font-semibold text-slate-800">Analyzed for 10 Tomato Leaf Classes</p>
            </div>
          </div>
        )}
      </div>

      {/* Structured Detailed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* What is this disease? */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-base">
            <Info className="w-5 h-5 text-emerald-600" />
            <h3>What is this disease?</h3>
          </div>
          <p className="text-slate-600 text-sm font-medium leading-relaxed">
            {info.what_is_it || info.description || 'Information available from agricultural extension.'}
          </p>
        </div>

        {/* Symptoms */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-base">
            <Activity className="w-5 h-5 text-emerald-600" />
            <h3>Symptoms</h3>
          </div>
          <p className="text-slate-600 text-sm font-medium leading-relaxed">
            {info.symptoms || 'Visual symptoms affect foliage and stems.'}
          </p>
        </div>

        {/* Why does it happen? */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-base">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            <h3>Why does it happen?</h3>
          </div>
          <p className="text-slate-600 text-sm font-medium leading-relaxed">
            {info.why_it_happens || 'Pathogen colonization under specific weather conditions.'}
          </p>
        </div>

        {/* How does it spread? */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-base">
            <Wind className="w-5 h-5 text-emerald-600" />
            <h3>How does it spread?</h3>
          </div>
          <p className="text-slate-600 text-sm font-medium leading-relaxed">
            {info.how_it_spreads || 'Wind, water splash, tools, or insect vectors.'}
          </p>
        </div>

        {/* Conditions that favor it */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-base">
            <Thermometer className="w-5 h-5 text-emerald-600" />
            <h3>Conditions that favor the disease</h3>
          </div>
          <p className="text-slate-600 text-sm font-medium leading-relaxed">
            {info.favorable_conditions || 'High humidity and specific temperature ranges.'}
          </p>
        </div>

        {/* What should I do now? */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-base">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3>What should I do now?</h3>
          </div>
          <p className="text-slate-600 text-sm font-medium leading-relaxed">
            {info.what_to_do_now || 'Isolate infected plants and prune affected foliage.'}
          </p>
        </div>

        {/* How can I prevent it? */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-base">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            <h3>How can I prevent it?</h3>
          </div>
          <p className="text-slate-600 text-sm font-medium leading-relaxed">
            {info.how_to_prevent || 'Practice crop rotation and use resistant varieties.'}
          </p>
        </div>

        {/* Management / Treatment */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-base">
            <Wrench className="w-5 h-5 text-emerald-600" />
            <h3>Management / Treatment</h3>
          </div>
          <p className="text-slate-600 text-sm font-medium leading-relaxed">
            {info.management_treatment || 'Apply recommended bio-pesticides or recommended fungicides.'}
          </p>
        </div>

      </div>

      {/* Expert Contact & Source Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base">When should I contact an agricultural expert?</h4>
              <p className="text-slate-400 text-xs mt-0.5">{info.when_to_contact_expert || 'Contact KVK if disease spreads across >20% canopy.'}</p>
            </div>
          </div>
        </div>

        {/* Source Display */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
          <div className="text-slate-400 font-medium">
            Verified Source: <strong className="text-slate-200 font-semibold">{info.source || 'ICAR-IIHR Advisory'}</strong>
          </div>

          {info.source_url && (
            <a
              href={info.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold transition-colors"
            >
              <span>View Verified Source</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

    </div>
  );
};
