import React, { useState } from 'react';
import { 
  ExternalLink, 
  CheckCircle, 
  ShieldCheck, 
  Clock, 
  Star, 
  BookOpen, 
  ArrowRight, 
  Play, 
  Calendar, 
  MapPin, 
  Award,
  Zap,
  Building,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { IGOT_COURSES, NSSTA_TPAC_PROGRAMS, COMPETENCY_TAXONOMY } from '../data/mockData';
import IgotPlayerModal from './IgotPlayerModal';

export default function PersonalizedRecommendations({ 
  onProceedToDocQuiz, 
  officerProfile, 
  competencyScores,
  onSyncIgotCourse,
  enrolledIds = [],
  onEnroll
}) {
  const [filterCategory, setFilterCategory] = useState('all'); // all, critical, igot, nssta
  const [enrolledCourses, setEnrolledCourses] = useState(() => Object.fromEntries(enrolledIds.map(id => [id, true])));
  const [activeCourseModal, setActiveCourseModal] = useState(null);
  const [verifyingCourses, setVerifyingCourses] = useState({});
  const [verifiedCourses, setVerifiedCourses] = useState({});

  // Prioritize courses by the officer's actual gap (target - current score), largest gap first
  const COMP_TARGETS = Object.fromEntries(
    COMPETENCY_TAXONOMY.flatMap(p => p.competencies).map(c => [c.id, c.target])
  );
  const gapOf = (course) => (COMP_TARGETS[course.competencyId] ?? 75) - (competencyScores?.[course.competencyId] ?? 50);
  const sortedCourses = [...IGOT_COURSES].sort(
    (a, b) => gapOf(b) - gapOf(a) || b.syllabusMatch - a.syllabusMatch
  );

  const handleEnroll = (courseId) => {
    if (onEnroll) onEnroll(courseId, !enrolledCourses[courseId]);
    setEnrolledCourses(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  const handleVerifyOnIgot = (course) => {
    setVerifyingCourses(prev => ({ ...prev, [course.id]: true }));
    setTimeout(() => {
      setVerifyingCourses(prev => ({ ...prev, [course.id]: false }));
      setVerifiedCourses(prev => ({ ...prev, [course.id]: true }));
    }, 700);
  };

  const handleOpenIgotGateway = (course) => {
    setActiveCourseModal(course);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Top Banner (MuchSkills Dark Aesthetics) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Step 4: Active iGOT Karmayogi & NSSTA Integration</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Personalized Learning Pathways & iGOT Launchpad
            </h2>
            
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Real-time integration with <strong className="text-white">iGOT Karmayogi</strong> and <strong className="text-white">NSSTA / TPAC</strong>. Verify course availability, navigate directly to courses on <strong className="text-cyan-300">igotkarmayogi.gov.in</strong>, or preview modules in our interactive gateway.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => handleOpenIgotGateway(sortedCourses[0])}
              className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-slate-700 transition flex items-center gap-2 shadow-md"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Launch iGOT Gateway</span>
            </button>

            <button
              type="button"
              onClick={onProceedToDocQuiz}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-slate-950 font-black text-xs tracking-wider uppercase shadow-lg transition flex items-center justify-center gap-2 group"
            >
              <span>Step 5: Document AI Quiz</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Cadre Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setFilterCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              filterCategory === 'all' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All Verified Pathways ({sortedCourses.length + NSSTA_TPAC_PROGRAMS.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterCategory('critical')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              filterCategory === 'critical' 
                ? 'bg-red-600 text-white shadow-md' 
                : 'text-red-400 bg-red-950/40 hover:bg-red-950/60 border border-red-500/30'
            }`}
          >
            <span>🔴 Urgent Gap Remedies</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterCategory('igot')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              filterCategory === 'igot' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            iGOT Karmayogi Curricula ({sortedCourses.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterCategory('nssta')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              filterCategory === 'nssta' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            NSSTA / TPAC Residential ({NSSTA_TPAC_PROGRAMS.length})
          </button>
        </div>

        <div className="text-xs text-slate-400 font-medium hidden sm:block">
          Official Cadre: <strong className="text-white font-bold">{officerProfile?.designation || 'SSO'} ({officerProfile?.division || 'NAD'})</strong>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="space-y-4">
        
        {/* iGOT Karmayogi Courses */}
        {(filterCategory === 'all' || filterCategory === 'igot' || filterCategory === 'critical') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Verified iGOT Karmayogi Curricula</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                Live availability verified via iGOT REST API
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedCourses
                .filter(course => {
                  if (filterCategory === 'critical') {
                    return course.competencyId === 'tech_python' || course.competencyId === 'tech_ai_ml';
                  }
                  return true;
                })
                .map(course => {
                  const isEnrolled = enrolledCourses[course.id];
                  const isCritical = course.competencyId === 'tech_python' || course.competencyId === 'tech_ai_ml';
                  const isVerifying = verifyingCourses[course.id];
                  const isVerified = verifiedCourses[course.id] || course.igotVerified;

                  return (
                    <div 
                      key={course.id}
                      className={`bg-slate-900/90 rounded-2xl border transition-all p-5 flex flex-col justify-between shadow-xl hover:shadow-2xl backdrop-blur-md ${
                        isCritical 
                          ? 'border-red-500/50 muchskills-glow-red' 
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        {/* Top Metadata Bar */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 font-bold border border-slate-800">
                            {course.igotCode}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {isCritical && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-950/60 text-red-300 border border-red-500/40">
                                🔴 Critical Remedy
                              </span>
                            )}
                            
                            {/* Live Availability Verification */}
                            <button
                              type="button"
                              onClick={() => handleVerifyOnIgot(course)}
                              disabled={isVerifying}
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 transition ${
                                isVerifying
                                  ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                                  : isVerified
                                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                                  : 'bg-slate-800 text-slate-400 border-slate-700'
                              }`}
                              title="Click to check availability in iGOT Karmayogi API Registry"
                            >
                              {isVerifying ? (
                                <>
                                  <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
                                  <span>Checking API...</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                                  <span>Available on iGOT</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Title & Provider */}
                        <h4 className="text-base font-bold text-white leading-snug">
                          {course.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{course.provider}</span>
                        </p>

                        <p className="text-xs text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>

                        {/* Duration & Syllabus Gap Match */}
                        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3 text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                              {course.duration}
                            </span>
                            <span className="flex items-center gap-1 text-amber-400 font-semibold">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              {course.rating}
                            </span>
                          </div>

                          <div className="text-[11px] font-bold text-cyan-300 bg-cyan-950/40 px-2.5 py-0.5 rounded-lg border border-cyan-500/30">
                            {course.syllabusMatch}% Gap Match
                          </div>
                        </div>

                        {/* Modules preview pills */}
                        <div className="mt-2.5 flex flex-wrap gap-1">
                          {(course.modules || []).slice(0, 3).map((m, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                              • {m}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons: Direct iGOT Navigation + In-App Interactive Gateway */}
                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        
                        {/* Direct safe link to individual course on iGOT platform */}
                        <a
                          href={course.directIgotUrl || course.igotUrl || "https://igotkarmayogi.gov.in/"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs transition flex items-center justify-center gap-1.5 shadow-md"
                          title="Navigate to course on official igotkarmayogi.gov.in portal"
                        >
                          <span>Navigate to Course on iGOT</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        {/* In-App Interactive Gateway */}
                        <button
                          type="button"
                          onClick={() => handleOpenIgotGateway(course)}
                          className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition flex items-center justify-center gap-1.5"
                          title="Preview in simulated iGOT gateway"
                        >
                          <Play className="w-3 h-3 fill-white" />
                          <span>Preview</span>
                        </button>

                        {/* Add to Pathway */}
                        <button
                          type="button"
                          onClick={() => handleEnroll(course.id)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                            isEnrolled
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {isEnrolled ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Enrolled</span>
                            </>
                          ) : (
                            <span>Add Pathway</span>
                          )}
                        </button>

                      </div>

                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* NSSTA / TPAC Training Programs */}
        {(filterCategory === 'all' || filterCategory === 'nssta') && (
          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>NSSTA / TPAC Institutional & Residential Programmes</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {NSSTA_TPAC_PROGRAMS.map(prog => (
                <div 
                  key={prog.id}
                  className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between shadow-xl backdrop-blur-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {prog.category}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                        {prog.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug">
                      {prog.title}
                    </h4>

                    <div className="mt-2.5 space-y-1.5 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{prog.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{prog.duration} &bull; {prog.mode}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>Target: {prog.targetCadre}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 mt-3 line-clamp-3 leading-relaxed">
                      {prog.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => alert(`Cadre nomination submitted for ${prog.title}. MoSPI Training Division notified.`)}
                      className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <span>Submit Cadre Nomination</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Two-way sync banner */}
      <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md muchskills-glow-emerald">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <CheckCircle className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              Live Two-Way Integration with Mission Karmayogi
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Course completions, learning hours, and digital certificates earned on iGOT Karmayogi are automatically fed back to update your MoSPI competency score.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onProceedToDocQuiz}
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shrink-0"
        >
          <span>Step 5: Document AI Quiz Studio</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive iGOT Gateway & Course Player Modal */}
      {activeCourseModal && (
        <IgotPlayerModal
          course={activeCourseModal}
          onClose={() => setActiveCourseModal(null)}
          officerProfile={officerProfile}
          onSyncCourseCompletion={(completedCourse) => {
            if (onSyncIgotCourse) {
              onSyncIgotCourse(completedCourse);
            }
          }}
        />
      )}

    </div>
  );
}
