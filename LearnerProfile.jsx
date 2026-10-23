import React, { useState } from 'react';
import { User, Upload, Sparkles, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Zap, BrainCircuit } from 'lucide-react';
import { MOSPI_DIVISIONS, DESIGNATIONS, SAMPLE_RESUMES } from '../data/mockData';
import { runResumePipeline } from '../services/aiAgentService';

export default function LearnerProfile({ 
  profile, 
  setProfile, 
  onProceedToAssessment, 
  onApplyResumeSkills 
}) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [analyzedData, setAnalyzedData] = useState(null);
  const [activeTab, setActiveTab] = useState('resume_ai'); // 'resume_ai' or 'paste'

  const [analysisError, setAnalysisError] = useState('');
  const [engineLabel, setEngineLabel] = useState('');

  // Run the AI agent pipeline: resume (real file / pasted text / sample) -> profile -> personalised quiz
  const handleAnalyzeResume = async (sample = null, file = null) => {
    if (isAnalyzing) return;
    setAnalysisError('');
    const textToAnalyze = sample ? sample.summaryText : resumeText.trim();

    if (!file && textToAnalyze.length < 30) {
      setAnalysisError('Please upload a resume file or paste at least a few lines of your resume text.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(10);
    setAnalysisStage(file ? `Reading ${file.name}...` : 'Extracting statistical entities and cadre designations...');

    const stages = [
      { p: 30, t: 'Extracting statistical entities and cadre designations...' },
      { p: 55, t: 'Cross-referencing tools: Python, R, Stata, CAPI against MoSPI Competency Matrix...' },
      { p: 75, t: 'Detecting domain focus (SNA 2008, PLFS, CPI, DPDP Act 2023)...' },
      { p: 90, t: 'Generating a personalised diagnostic quiz from your profile...' }
    ];
    let stageIdx = 0;
    const timer = setInterval(() => {
      const st = stages[Math.min(stageIdx, stages.length - 1)];
      stageIdx += 1;
      setAnalysisProgress(st.p);
      setAnalysisStage(st.t);
    }, 1500);

    try {
      const { profile: p, quiz, trace } = await runResumePipeline(file ? { file } : { text: textToAnalyze });
      setEngineLabel(trace?.[0]?.source === 'gemini' ? 'Gemini AI' : 'Offline engine');
      setAnalysisProgress(100);

      const targetData = { ...p, detectedGaps: p.detectedGaps || [] };
      setAnalyzedData(targetData);

      setProfile(prev => ({
        ...prev,
        // Keep the logged-in officer's identity; the resume must not rename the account
        name: prev.name || p.name,
        designation: p.designation || prev.designation,
        division: p.division || prev.division,
        experience: p.experience || prev.experience,
        qualifications: p.qualifications || prev.qualifications,
        skills: p.extractedSkills || prev.skills,
        preliminaryGaps: p.detectedGaps || prev.preliminaryGaps,
        gapCompetencies: p.gapCompetencies || [],
        competencyEstimates: p.competencyEstimates || {}
      }));

      if (onApplyResumeSkills) {
        onApplyResumeSkills(targetData, quiz);
      }
    } catch (e) {
      setAnalysisError(e.message || 'The AI agent could not analyse this resume. Please try again.');
    } finally {
      clearInterval(timer);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Intro Banner (MuchSkills Dark Aesthetics) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
              <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
              <span>Step 1: Automated Competency Profiling</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Official Learner Profile & AI Resume Agent</span>
            </h2>
            
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Our AI engine extracts your statistical background, survey experience, and technical tools (Python, R, Stata, SQL) directly from your CV or official service record to establish your baseline competency map.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleAnalyzeResume(SAMPLE_RESUMES[0])}
              className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Try SSO Resume (NAD)</span>
            </button>
            <button
              type="button"
              onClick={() => handleAnalyzeResume(SAMPLE_RESUMES[1])}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5 border border-slate-700"
            >
              <span>Try JSO Resume (FOD)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: AI Resume Agent (Left) & Profile Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: AI Resume Analyzer Agent */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl p-6 backdrop-blur-md space-y-5">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-cyan-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">AI Resume & Profile Analyzer</h3>
                  <p className="text-xs text-slate-400">Upload CV or Government Service Record</p>
                </div>
              </div>

              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('resume_ai')}
                  className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'resume_ai' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  Upload & Scan
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('paste')}
                  className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'paste' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  Quick Paste Text
                </button>
              </div>
            </div>

            {/* Upload Zone */}
            {activeTab === 'resume_ai' ? (
              <div className="border-2 border-dashed border-indigo-500/30 rounded-2xl p-6 text-center hover:border-indigo-400/60 transition bg-indigo-950/20 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/30">
                  <Upload className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Drag & Drop Resume (PDF, DOCX, TXT)
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Automatically extracts statistical postings, survey experience (NSS/ASI/CPI), and programming capabilities.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <label className="cursor-pointer px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md">
                    <span>Browse Device Files</span>
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx,.txt" 
                      className="hidden" 
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleAnalyzeResume(null, f);
                        e.target.value = '';
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAnalyzeResume(SAMPLE_RESUMES[0])}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition"
                  >
                    Load Mock SSO Resume
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume summary or professional experience details here..."
                  rows={6}
                  className="w-full text-xs p-3.5 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-200"
                />
                <button
                  type="button"
                  onClick={() => handleAnalyzeResume()}
                  disabled={isAnalyzing}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Parse Text with MoSPI AI Agent</span>
                </button>
              </div>
            )}

            {/* Error from the AI agent */}
            {analysisError && (
              <div role="alert" className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 text-xs text-red-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{analysisError}</span>
              </div>
            )}

            {/* Analysis Progress Scanner */}
            {isAnalyzing && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/40 space-y-2.5 animate-pulse">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-indigo-300 flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    <span>AI Agent Processing Service Record...</span>
                  </span>
                  <span className="font-mono text-cyan-400 font-bold">{analysisProgress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full transition-all duration-300"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-mono">&gt; {analysisStage}</p>
              </div>
            )}

            {/* Extracted Entity Preview */}
            {analyzedData && !isAnalyzing && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-4 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-300">
                      AI Extraction Complete &bull; Profile Calibrated
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                    Baseline Mapped{engineLabel ? ` • ${engineLabel}` : ''}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-300 mb-2">
                    Verified Competencies Extracted from Resume:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(analyzedData.extractedSkills || []).map((skill, idx) => (
                      <span 
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-medium"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-300 mb-2">
                    Anticipated Skill Gaps Flagged by AI Agent:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(analyzedData.detectedGaps || []).map((gap, idx) => (
                      <span 
                        key={idx}
                        className={`text-xs px-2.5 py-1 rounded-xl font-medium border ${
                          gap.includes('Critical') 
                            ? 'bg-red-950/40 border-red-500/40 text-red-300' 
                            : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                        }`}
                      >
                        ⚠ {gap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Col: Official Profile Card */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl p-6 backdrop-blur-md space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-base">Official Cadre Identity</h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 font-mono">
                ID: {profile.employeeId}
              </span>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Official Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Designation */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Cadre & Designation
              </label>
              <select
                value={profile.designation}
                onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {DESIGNATIONS.map((des) => (
                  <option key={des.id} value={des.id}>
                    {des.title} ({des.grade})
                  </option>
                ))}
              </select>
            </div>

            {/* MoSPI Division */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Current Division / Wing
              </label>
              <select
                value={profile.division}
                onChange={(e) => setProfile({ ...profile, division: e.target.value })}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {MOSPI_DIVISIONS.map((div) => (
                  <option key={div.id} value={div.id}>
                    {div.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Experience */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Experience
                </label>
                <input
                  type="text"
                  value={profile.experience}
                  onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Education */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Qualification
                </label>
                <input
                  type="text"
                  value={profile.qualifications}
                  onChange={(e) => setProfile({ ...profile, qualifications: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Next Action Button */}
            <div className="pt-3">
              <button
                type="button"
                onClick={onProceedToAssessment}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs tracking-wide shadow-lg transition flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Step 2: Diagnostic Assessment</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-[10px] text-center text-slate-400 mt-2">
                10-15 Adaptive MCQs calibrated for {profile.designation} in {profile.division}
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
