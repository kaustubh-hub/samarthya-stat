import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, ArrowRight, Sparkles, TrendingUp, Layers, BookOpen, Filter, Eye, Activity } from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

export default function SkillGapAnalysis({ 
  competencyScores, 
  onProceedToRecommendations, 
  officerProfile 
}) {
  const [selectedCluster, setSelectedCluster] = useState('ALL');
  const [selectedSkillDetail, setSelectedSkillDetail] = useState(null);
  const [viewMode, setViewMode] = useState('bubbles'); // 'bubbles' or 'matrix'

  // Dynamic competencies mapping with MuchSkills classification
  const skillsData = [
    {
      id: 'stat_sampling',
      name: 'Survey Sampling & Design',
      category: 'Statistical',
      current: competencyScores.stat_sampling || 78,
      target: 85,
      pillar: 'Statistical Competencies',
      description: 'Stratification, multi-stage sampling, and Horvitz-Thompson variance estimation.'
    },
    {
      id: 'stat_accounts',
      name: 'National Accounts (SNA 2008)',
      category: 'Statistical',
      current: competencyScores.stat_accounts || 60,
      target: 80,
      pillar: 'Statistical Competencies',
      description: 'Double deflation of Gross Value Added and Supply-Use Tables (SUT).'
    },
    {
      id: 'stat_price',
      name: 'Price Statistics & CPI',
      category: 'Statistical',
      current: competencyScores.stat_price || 82,
      target: 85,
      pillar: 'Statistical Competencies',
      description: 'Consumer Price Index (Rural/Urban/Combined) and Jevons elementary aggregation.'
    },
    {
      id: 'stat_sdg',
      name: 'SDG Indicators & DQAF',
      category: 'Statistical',
      current: competencyScores.stat_sdg || 80,
      target: 75,
      pillar: 'Statistical Competencies',
      description: 'National Indicator Framework (NIF) and UN Data Quality Assurance compliance.'
    },
    {
      id: 'tech_python',
      name: 'Python for Survey Microdata',
      category: 'Technical',
      current: competencyScores.tech_python || 35,
      target: 80,
      pillar: 'Technical Competencies',
      description: 'Pandas fixed-width (fwf) parsing, automated data pipelines, and SciPy modeling.'
    },
    {
      id: 'tech_r',
      name: 'R Survey Package & Econometrics',
      category: 'Technical',
      current: competencyScores.tech_r || 52,
      target: 75,
      pillar: 'Technical Competencies',
      description: 'Complex survey weighting with Lumley survey package and seasonal adjustment.'
    },
    {
      id: 'tech_ai_ml',
      name: 'AI & NLP in Official Stats',
      category: 'Technical',
      current: competencyScores.tech_ai_ml || 28,
      target: 70,
      pillar: 'Technical Competencies',
      description: 'Automated NIC/NCO text classification and satellite imagery for agriculture.'
    },
    {
      id: 'tech_gis',
      name: 'GIS & Spatial Boundary Mapping',
      category: 'Technical',
      current: competencyScores.tech_gis || 45,
      target: 65,
      pillar: 'Technical Competencies',
      description: 'QGIS cadastral maps, boundary demarcation, and spatial joins with NSS rounds.'
    },
    {
      id: 'gov_dpdp',
      name: 'Data Privacy & DPDP Act 2023',
      category: 'Governance',
      current: competencyScores.gov_dpdp || 65,
      target: 85,
      pillar: 'Digital Governance',
      description: 'Data fiduciary protocols, pseudonymisation, and respondent confidentiality.'
    },
    {
      id: 'gov_cyber',
      name: 'MeghRaj Gov Cloud & API Sec',
      category: 'Governance',
      current: competencyScores.gov_cyber || 78,
      target: 80,
      pillar: 'Digital Governance',
      description: 'TLS 1.3, CERT-In compliance, and secure microdata API distribution.'
    },
    {
      id: 'man_leadership',
      name: 'Field Supervision & CAPI Audits',
      category: 'Managerial',
      current: competencyScores.man_leadership || 85,
      target: 80,
      pillar: 'Managerial & Behavioural',
      description: 'Managing field investigator teams and non-sampling error reduction.'
    },
    {
      id: 'man_ethics',
      name: 'Collection of Statistics Act 2008',
      category: 'Managerial',
      current: competencyScores.man_ethics || 90,
      target: 90,
      pillar: 'Managerial & Behavioural',
      description: 'Statutory compliance, legal non-disclosure, and public data ethics.'
    }
  ];

  // Helper for status classification
  const getStatus = (score) => {
    if (score < 50) return { label: 'Critical Gap', color: 'red', badge: 'bg-red-500/20 text-red-300 border-red-500/40', glow: 'muchskills-glow-red', icon: AlertTriangle };
    if (score < 75) return { label: 'Moderate Gap', color: 'amber', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40', glow: 'muchskills-glow-amber', icon: Clock };
    return { label: 'Proficient', color: 'emerald', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', glow: 'muchskills-glow-emerald', icon: CheckCircle };
  };

  const filteredSkills = skillsData.filter(s => {
    if (selectedCluster === 'ALL') return true;
    return s.category === selectedCluster;
  });

  const criticalCount = skillsData.filter(s => s.current < 50).length;
  const moderateCount = skillsData.filter(s => s.current >= 50 && s.current < 75).length;
  const proficientCount = skillsData.filter(s => s.current >= 75).length;

  // Radar format
  const radarData = skillsData.slice(0, 8).map(s => ({
    subject: s.name.length > 18 ? s.name.substring(0, 16) + '...' : s.name,
    user: s.current,
    target: s.target,
    fullMark: 100
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Top Banner (MuchSkills Dark Aesthetics) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2 border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Step 3: MuchSkills Interactive Gap Intelligence</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Competency Gap Matrix & Visual Skill Bubbles</span>
            </h2>
            
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Visualizing capability distributions across <strong className="text-white">12 core MoSPI statistical competencies</strong>. 
              Click any bubble to inspect granular diagnostic deficits and recommended iGOT curricula.
            </p>
          </div>

          <button
            type="button"
            onClick={onProceedToRecommendations}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2 shrink-0 group"
          >
            <span>Proceed to Step 4: iGOT Pathways</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* 3 Metric Cards: Critical, Moderate, Proficient */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-slate-900/90 rounded-2xl border border-red-500/30 p-5 shadow-xl flex items-center justify-between backdrop-blur-md muchskills-glow-red">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wide">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span>Critical Gaps</span>
            </div>
            <div className="text-4xl font-black text-white">{criticalCount}</div>
            <p className="text-[11px] text-slate-400">Score &lt; 50% &bull; Urgent intervention</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center font-black text-xl">
            🔴
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-amber-500/30 p-5 shadow-xl flex items-center justify-between backdrop-blur-md muchskills-glow-amber">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wide">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Moderate Gaps</span>
            </div>
            <div className="text-4xl font-black text-white">{moderateCount}</div>
            <p className="text-[11px] text-slate-400">Score 50-74% &bull; Reinforcement needed</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black text-xl">
            🟡
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-emerald-500/30 p-5 shadow-xl flex items-center justify-between backdrop-blur-md muchskills-glow-emerald">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wide">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Proficient Competencies</span>
            </div>
            <div className="text-4xl font-black text-white">{proficientCount}</div>
            <p className="text-[11px] text-slate-400">Score &ge; 75% &bull; Meets MoSPI standard</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-xl">
            🟢
          </div>
        </div>

      </div>

      {/* Cluster Filters & View Mode */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 font-bold mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pillars:</span>
          </span>

          {['ALL', 'Statistical', 'Technical', 'Governance', 'Managerial'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCluster(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCluster === cat 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat === 'ALL' ? 'All Competencies (12)' : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'bubbles' ? 'matrix' : 'bubbles')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Toggle: {viewMode === 'bubbles' ? 'MuchSkills Bubble View' : 'Table Matrix View'}</span>
          </button>
        </div>
      </div>

      {/* MUCHSKILLS VISUAL SKILL BUBBLE MATRIX (User's reference link!) */}
      {viewMode === 'bubbles' ? (
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-2xl backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>MuchSkills Visual Capability Bubble Map</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                  Interactive Node Map
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Node size correlates with MoSPI target importance; ring color signifies gap urgency.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Critical</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Moderate</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Proficient</span>
            </div>
          </div>

          {/* Bubbles Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredSkills.map((skill) => {
              const status = getStatus(skill.current);
              const isSelected = selectedSkillDetail?.id === skill.id;
              const deficit = skill.current - skill.target;

              return (
                <div
                  key={skill.id}
                  onClick={() => setSelectedSkillDetail(skill)}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 ${
                    status.color === 'red'
                      ? 'bg-red-950/20 border-red-500/40 hover:border-red-400 muchskills-glow-red'
                      : status.color === 'amber'
                      ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400 muchskills-glow-amber'
                      : 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-400 muchskills-glow-emerald'
                  } ${isSelected ? 'ring-2 ring-cyan-400 scale-[1.02]' : 'hover:scale-[1.01]'}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 font-bold">
                        {skill.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.badge}`}>
                        {status.label}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug">
                      {skill.name}
                    </h4>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-slate-400">Score: <strong className="text-white font-bold">{skill.current}%</strong></span>
                      <span className={`text-[11px] font-bold ${deficit < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {deficit < 0 ? `${deficit}% Deficit` : `+${deficit}% Met`}
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          status.color === 'red' ? 'bg-red-500' : status.color === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${skill.current}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Drawer / Inspection Box for Selected Skill Bubble */}
          {selectedSkillDetail && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-3 animate-fade-in shadow-inner">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-sm font-bold text-white">
                    Inspecting: <span className="text-cyan-300">{selectedSkillDetail.name}</span>
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSkillDetail(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Close Detail
                </button>
              </div>

              <p className="text-xs text-slate-300">
                {selectedSkillDetail.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                <div className="flex items-center gap-4 text-slate-300">
                  <span>Current: <strong className="text-white">{selectedSkillDetail.current}%</strong></span>
                  <span>MoSPI Benchmark: <strong className="text-amber-400">{selectedSkillDetail.target}%</strong></span>
                  <span>Required Effort: <strong className="text-cyan-400">{Math.max(0, selectedSkillDetail.target - selectedSkillDetail.current)} Points</strong></span>
                </div>

                <button
                  type="button"
                  onClick={onProceedToRecommendations}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-md"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>View Targeted iGOT Modules for this Gap &rarr;</span>
                </button>
              </div>
            </div>
          )}

        </div>
      ) : null}

      {/* Main Grid: Radar Chart (Left) & Competency Urgency List (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Radar Chart (Dark Mode) */}
        <div className="lg:col-span-6 bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl p-6 flex flex-col justify-between backdrop-blur-md">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">Competency Radar vs. MoSPI Target</h3>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 font-mono">
                8 Core Dimensions
              </span>
            </div>
            
            <p className="text-xs text-slate-400 mt-2">
              Indigo fill represents Officer level; amber dashed line marks MoSPI division benchmark.
            </p>

            <div className="h-72 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 9 }} stroke="#334155" />
                  <Radar name="Officer Level" dataKey="user" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                  <Radar name="MoSPI Target Standard" dataKey="target" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeDasharray="3 3" />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10, color: '#e2e8f0' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#070a13', border: '1px solid #334155', color: '#fff', borderRadius: 12, fontSize: 11 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Competency Gap List Ranked by Urgency */}
        <div className="lg:col-span-6 bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl p-6 space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-white text-sm">Action Priorities (Ranked by Deficit)</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Real-time Recalibration</span>
          </div>

          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
            {[...skillsData]
              .sort((a, b) => a.current - b.current)
              .map((item, idx) => {
                const status = getStatus(item.current);
                const gap = item.current - item.target;
                const Icon = status.icon;

                return (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-2xl border border-slate-800/80 bg-slate-950/60 space-y-2 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{item.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.badge} flex items-center gap-1`}>
                        <Icon className="w-3 h-3" />
                        <span>{status.label}</span>
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">
                          Current: <strong className="text-white font-bold">{item.current}%</strong> &bull; Target: {item.target}%
                        </span>
                        <span className={`font-bold ${gap < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                          {gap < 0 ? `${gap}% Deficit` : `+${gap}% Surplus`}
                        </span>
                      </div>

                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            status.color === 'red' ? 'bg-red-500' :
                            status.color === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${item.current}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onProceedToRecommendations}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg"
            >
              <BookOpen className="w-4 h-4" />
              <span>Map Deficits to iGOT Karmayogi Curricula &rarr;</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
