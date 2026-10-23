import React from 'react';
import { Repeat, CheckCircle2, Award, Sparkles, ArrowRight, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import AiCourseRecommenderAgent from './AiCourseRecommenderAgent';

export default function ContinuousLoop({ 
  officerProfile, 
  competencyScores, 
  lastQuizDelta,
  onRestartLoop, 
  onViewRecommendations 
}) {
  const compName = lastQuizDelta?.competency || 'National Accounts & GVA Deflators';
  const beforeScore = lastQuizDelta?.before || 60;
  const afterScore = lastQuizDelta?.after || (competencyScores.stat_accounts || 88);
  const diffScore = lastQuizDelta?.diff !== undefined ? lastQuizDelta.diff : (afterScore - beforeScore);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Top Banner (MuchSkills Dark Aesthetics) */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 rounded-3xl p-6 text-white border border-emerald-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Repeat className="w-3.5 h-3.5 text-emerald-400" />
            <span>Continuous Capacity Building Loop Active</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Competency Profile Recalibrated in Real-Time!
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
            Your performance on the Document AI quiz has automatically upgraded your verified MoSPI competency record and triggered updated iGOT course recommendations.
          </p>
        </div>

        <button
          type="button"
          onClick={triggerConfetti}
          className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-2 shadow-lg shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Celebrate Progress</span>
        </button>
      </div>

      {/* Dynamic Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-2 backdrop-blur-md">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {compName}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-emerald-400">{afterScore}%</span>
            <span className="text-xs text-slate-500 line-through">{beforeScore}%</span>
            <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/40 font-mono">
              {diffScore >= 0 ? `+${diffScore}%` : `${diffScore}%`}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Score updated in MoSPI central index.
          </p>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-2 backdrop-blur-md">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Status Transition
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 line-through">
              Moderate Gap
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              🟢 Proficient
            </span>
          </div>
          <p className="text-xs text-slate-400">
            MoSPI divisional standard satisfied.
          </p>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-2 backdrop-blur-md">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            iGOT Karmayogi Sync
          </span>
          <div className="flex items-center gap-2 mt-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold text-white">Credits Synchronized</span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Recorded under {officerProfile?.employeeId || 'ISS-2018-9412'}.
          </p>
        </div>

      </div>

      {/* Official Certificate Card */}
      <div className="bg-slate-900/90 rounded-3xl border border-indigo-500/30 p-6 shadow-2xl space-y-4 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-amber-400 flex items-center justify-center font-bold shadow-md">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest font-black text-amber-400">
                Government of India &bull; Ministry of Statistics & Programme Implementation
              </div>
              <h3 className="text-base font-bold text-white">
                Continuous Competency Advancement Certificate
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => alert(`Official Certificate downloaded for ${officerProfile?.name || 'Officer'} in PDF format.`)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Download Certificate (PDF)</span>
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          This officially certifies that <strong className="text-white">{officerProfile?.name || 'Official'}</strong>, 
          holding designation <strong className="text-cyan-300">{officerProfile?.designation || 'SSO'}</strong> in the 
          <strong className="text-cyan-300"> {officerProfile?.division || 'National Accounts Division'}</strong>, has successfully completed the adaptive 
          evaluation for <em>{compName}</em>, elevating their verified score to <strong className="text-emerald-400">{afterScore}%</strong>.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 gap-2 font-mono">
          <span>Verification Hash: <code className="text-cyan-400 font-bold">MOSPI-IGOT-2026-89A4B-VERIFIED</code></span>
          <span>Authorized by: <strong>DIID & NSSTA Joint Board</strong></span>
        </div>
      </div>

      {/* Embedded Post-Quiz AI Course Recommendation Agent to Close the Loop */}
      <AiCourseRecommenderAgent
        quizResult={{
          scorePct: afterScore,
          weakTopics: ['Double Deflation in National Accounts', 'Fixed-Width NSS Parsing in Python'],
          strongTopics: ['Elementary Aggregation', 'Consumer Price Indices']
        }}
        officerProfile={officerProfile}
      />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={onRestartLoop}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-700"
        >
          <Repeat className="w-4 h-4" />
          <span>Upload Another Learning Document</span>
        </button>

        <button
          type="button"
          onClick={onViewRecommendations}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg"
        >
          <span>View All iGOT Curricula &rarr;</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
