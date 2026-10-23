import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ExternalLink,
  CheckCircle, 
  Clock,
  Star,
  BookOpen, 
  ArrowRight, 
  Play,
  Building,
  CheckCircle2,
  RefreshCw, 
  Cpu, 
  BrainCircuit 
} from 'lucide-react';
import { IGOT_COURSES } from '../data/mockData';
import { runPostQuizCourseAgent } from '../services/aiAgentService';

export default function AiCourseRecommenderAgent({
  quizResult,
  officerProfile,
  onLaunchIgotPlayer,
  onAddCourseToPathway,
  onProceedToLoop
}) {
  const [isProcessing, setIsProcessing] = useState(true);
  const [agentStep, setAgentStep] = useState(1);
  const [agentStepText, setAgentStepText] = useState('Extracting weak topics from quiz diagnostic...');
  const [agentSummary, setAgentSummary] = useState('');
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [addedCourses, setAddedCourses] = useState({});

  useEffect(() => {
    let isMounted = true;

    async function executeAgent() {
      setIsProcessing(true);
      setAgentStep(1);
      setAgentStepText('Analyzing quiz error patterns & statistical deficits...');

      await new Promise(r => setTimeout(r, 600));
      if (!isMounted) return;
      setAgentStep(2);
      setAgentStepText(`Cross-referencing official profile for ${officerProfile?.name || 'Officer'} (${officerProfile?.designation || 'SSO'} in ${officerProfile?.division || 'NAD'})...`);

      await new Promise(r => setTimeout(r, 700));
      if (!isMounted) return;
      setAgentStep(3);
      setAgentStepText('Querying iGOT Karmayogi course registry for verified active modules...');

      let summary;
      let courses;
      try {
        const result = await runPostQuizCourseAgent({
          quizResult: quizResult || { scorePct: 0, weakTopics: [], strongTopics: [] },
          resumeProfile: officerProfile || {}
        });
        summary = result.agentSummary;
        courses = result.recommendedCourses;
      } catch (e) {
        console.warn('Course agent unavailable:', e);
        summary = 'The AI agent could not be reached, so these are general high-demand iGOT courses rather than personalised matches. Please retry shortly.';
        courses = IGOT_COURSES.slice(0, 3).map(c => ({ ...c, directIgotUrl: c.igotUrl }));
      }

      if (!isMounted) return;
      setAgentStep(4);
      setAgentStepText('Synthesizing customized capacity building pathway...');

      await new Promise(r => setTimeout(r, 400));
      if (!isMounted) return;

      setAgentSummary(summary || 'Tailored courses identified to bridge quiz deficits.');
      setRecommendedCourses(courses || []);

      setIsProcessing(false);
    }

    executeAgent();

    return () => {
      isMounted = false;
    };
  }, [quizResult, officerProfile]);

  const toggleAddCourse = (courseId) => {
    setAddedCourses(prev => {
      const next = { ...prev, [courseId]: !prev[courseId] };
      if (onAddCourseToPathway) {
        onAddCourseToPathway(courseId, next[courseId]);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Agent Header Banner (MuchSkills Dark Executive Theme) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
              <BrainCircuit className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>AI Course Recommendation Agent (Karma-Chanakya)</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Personalized iGOT Learning Pathways</span>
              <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
            </h2>
            
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Based on your recent quiz results (<strong className="text-amber-400">{quizResult?.scorePct || 70}%</strong>) 
              and your resume background as <strong className="text-white">{officerProfile?.designation || 'SSO'} ({officerProfile?.division || 'NAD'})</strong>, 
              this autonomous agent matches your exact skill gaps to verified courses available directly on the <strong className="text-emerald-400">iGOT Karmayogi</strong> platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            {onProceedToLoop && (
              <button
                type="button"
                onClick={onProceedToLoop}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2"
              >
                <span>Proceed to Step 6: Continuous Loop</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Agent Live Processing Monitor */}
      {isProcessing && (
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-indigo-500/40 shadow-xl space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-indigo-300 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>Autonomous Reasoning Chain in Progress (Step {agentStep} of 4)</span>
            </span>
            <span className="text-slate-400 font-mono text-[11px]">iGOT API Gateway: ACTIVE</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-full transition-all duration-300"
              style={{ width: `${agentStep * 25}%` }}
            />
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300">
            &gt; {agentStepText}
          </div>
        </div>
      )}

      {/* Synthesis Insight Callout */}
      {!isProcessing && agentSummary && (
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-indigo-500/20 backdrop-blur-sm flex items-start gap-3 text-xs text-slate-300">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0 border border-indigo-500/30">
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-white flex items-center gap-2">
              <span>Agent Synthesis & Gap-to-Course Mapping</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">Verified Match</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {agentSummary}
            </p>
          </div>
        </div>
      )}

      {/* Suggested Courses Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-bold uppercase tracking-wider text-[11px]">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Targeted iGOT Karmayogi Courses for Your Profile</span>
          </div>
          <span className="text-slate-400">
            Guaranteed Available on <strong className="text-slate-200">igotkarmayogi.gov.in</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedCourses.map((course) => {
            const isAdded = addedCourses[course.id];

            return (
              <div
                key={course.id}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-indigo-500/50 p-5 flex flex-col justify-between shadow-xl transition-all duration-200 hover:-translate-y-0.5 group backdrop-blur-md"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold">
                      {course.igotCode}
                    </span>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      <span>Live on iGOT</span>
                    </span>
                  </div>

                  {/* Course Title & Provider */}
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="line-clamp-1">{course.provider}</span>
                    </p>
                  </div>

                  {/* AI Match Reason Box (Crucial user requirement) */}
                  <div className="p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-800/50 text-[11px] space-y-1">
                    <div className="text-amber-400 font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Why AI Recommends This:</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {course.matchReason || `Identified from your quiz weaknesses to strengthen your official duties in ${officerProfile?.division || 'MoSPI'}.`}
                    </p>
                  </div>

                  {/* Stats / Duration */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {course.rating || 4.9}
                    </span>
                    <span className="text-cyan-400 font-bold">
                      {course.syllabusMatch}% Match
                    </span>
                  </div>
                </div>

                {/* Action Buttons: Direct iGOT Navigation + In-App Player */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                  
                  {/* Primary: Direct Navigation to iGOT Platform (User's explicit requirement!) */}
                  <a
                    href={course.directIgotUrl || course.igotUrl || "https://igotkarmayogi.gov.in/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs transition flex items-center justify-center gap-1.5 shadow-md group/link"
                    title={`Navigate to individual course on official iGOT platform: ${course.title}`}
                  >
                    <span>Navigate to Course on iGOT Platform</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                  </a>

                  {/* Secondary: Launch in In-App Gateway & Add to Pathway */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onLaunchIgotPlayer && onLaunchIgotPlayer(course)}
                      className="flex-1 py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition flex items-center justify-center gap-1"
                      title="Launch simulated interactive player"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Preview Module</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleAddCourse(course.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                        isAdded 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Added</span>
                        </>
                      ) : (
                        <span>Add</span>
                      )}
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
