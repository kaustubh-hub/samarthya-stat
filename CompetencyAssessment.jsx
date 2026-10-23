import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, Flag, Zap, Sparkles, CheckCircle, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_DIAGNOSTIC_QUESTIONS } from '../data/mockData';

export default function CompetencyAssessment({ 
  onAssessmentCompleted, 
  userAnswers, 
  setUserAnswers, 
  questions: generatedQuestions = null,
  officerRole = 'SSO', 
  division = 'NAD' 
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flagged, setFlagged] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreSummary, setScoreSummary] = useState(null);

  // AI-generated, resume-personalised questions when available; otherwise the built-in bank
  const questions = generatedQuestions && generatedQuestions.length > 0 ? generatedQuestions : INITIAL_DIAGNOSTIC_QUESTIONS;
  const currentQ = questions[currentIdx];

  const handleSelectAnswer = (optionIdx) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionIdx
    }));
  };

  const handleToggleFlag = () => {
    setFlagged(prev => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id]
    }));
  };

  // Demo auto-fill modes for SIH judges
  const handleAutoFill = (mode = 'typical_gaps') => {
    const auto = {};
    questions.forEach((q) => {
      if (mode === 'all_correct') {
        auto[q.id] = q.correctAnswer;
      } else if (mode === 'all_wrong') {
        auto[q.id] = (q.correctAnswer + 1) % 4;
      } else {
        // 'typical_gaps': strong in official statistics, gap in Python & AI
        if (q.competencyId === 'tech_python' || q.competencyId === 'tech_ai_ml') {
          auto[q.id] = (q.correctAnswer + 1) % 4;
        } else {
          auto[q.id] = q.correctAnswer;
        }
      }
    });
    setUserAnswers(auto);
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setScoreSummary(null);
    setCurrentIdx(0);
  };

  const handleSubmit = () => {
    let correctCount = 0;
    const computedScores = {};
    // Real per-competency scores from the officer's ACTUAL answers, weighted by difficulty
    // (Easy 1, Medium 1.5, Hard 2). Fully correct -> 90, fully wrong -> 25.
    const W = { Easy: 1, Medium: 1.5, Hard: 2 };
    const agg = {};

    questions.forEach(q => {
      const isCorrect = userAnswers[q.id] === q.correctAnswer;
      if (isCorrect) correctCount++;
      const w = W[q.difficulty] || 1.5;
      const a = (agg[q.competencyId] = agg[q.competencyId] || { got: 0, max: 0 });
      a.max += w;
      if (isCorrect) a.got += w;
    });

    Object.entries(agg).forEach(([compId, a]) => {
      computedScores[compId] = Math.round(25 + 65 * (a.got / a.max));
    });

    const calculatedPercentage = Math.round((correctCount / questions.length) * 100);

    const summary = {
      total: questions.length,
      correct: correctCount,
      percentage: calculatedPercentage,
      computedScores
    };

    setScoreSummary(summary);
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti error:', e);
    }
  };

  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Quiz Header (MuchSkills Dark Aesthetics) */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl p-6 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              Step 2 of 6 &bull; Adaptive Diagnostic
            </span>
            <span className="text-xs text-slate-400">
              Calibrated for: <strong className="text-white">{officerRole} ({division})</strong>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Official Competency Diagnostic Assessment
          </h2>
        </div>

        {/* Action Controls & Fast Demos */}
        <div className="flex flex-wrap items-center gap-2">
          {!isSubmitted ? (
            <>
              <button
                type="button"
                onClick={() => handleAutoFill('typical_gaps')}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition flex items-center gap-1 shadow-sm"
                title="Simulates answering well in statistics but weak in Python & AI"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Demo: Deficit in AI/Python</span>
              </button>

              <button
                type="button"
                onClick={() => handleAutoFill('all_correct')}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition flex items-center gap-1 shadow-sm"
                title="Simulates 100% correct answers"
              >
                <span>Demo: 100% Mastery</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleResetQuiz}
              className="px-3.5 py-1.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Diagnostic</span>
            </button>
          )}

          <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono">
            {answeredCount} / {questions.length} Answered
          </div>
        </div>
      </div>

      {/* Results Banner when Submitted */}
      {isSubmitted && scoreSummary && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl text-white p-6 shadow-2xl border border-indigo-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Diagnostic Evaluated Dynamically</span>
            </div>
            <h3 className="text-2xl font-black">
              Diagnostic Score: {scoreSummary.percentage}% ({scoreSummary.correct} / {scoreSummary.total} Correct)
            </h3>
            <p className="text-xs text-slate-300">
              Your responses have dynamically recalibrated the 4-pillar competency matrix.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onAssessmentCompleted(scoreSummary)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition flex items-center gap-2 shrink-0"
          >
            <span>Proceed to Step 3: Skill Gap Matrix</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Active Question Box */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl p-6 backdrop-blur-md space-y-4">
        
        {/* Question Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 font-mono">
              Q{currentIdx + 1} of {questions.length}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
              {currentQ.pillar}
            </span>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
              currentQ.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
              currentQ.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
              'bg-purple-500/20 text-purple-300 border-purple-500/40'
            }`}>
              {currentQ.difficulty}
            </span>
          </div>

          <button
            type="button"
            onClick={handleToggleFlag}
            className={`p-2 rounded-xl border transition ${
              flagged[currentQ.id] 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Flag for review"
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>

        {/* Question Text */}
        <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed py-1">
          {currentQ.question}
        </h3>

        {/* Options */}
        <div className="space-y-2.5">
          {currentQ.options.map((option, idx) => {
            const isSelected = userAnswers[currentQ.id] === idx;
            const showFeedback = isSubmitted;
            const isCorrect = idx === currentQ.correctAnswer;

            let style = "border-slate-800 bg-slate-950/60 hover:border-indigo-500/50 hover:bg-slate-950 text-slate-300";
            if (isSelected) style = "border-indigo-500 bg-indigo-950/60 text-white ring-1 ring-indigo-500 font-medium";
            if (showFeedback) {
              if (isCorrect) style = "border-emerald-500 bg-emerald-950/60 text-emerald-200 font-bold ring-1 ring-emerald-500";
              else if (isSelected && !isCorrect) style = "border-red-500 bg-red-950/60 text-red-200 ring-1 ring-red-500";
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectAnswer(idx)}
                disabled={isSubmitted}
                className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all duration-150 flex items-start gap-3.5 ${style}`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-bold ${
                  isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="leading-relaxed mt-0.5">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation after submission */}
        {isSubmitted && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1.5 shadow-inner">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Official Statistical Methodology & Rationale:</span>
            </span>
            <p className="text-slate-300 leading-relaxed">
              {currentQ.explanation}
            </p>
          </div>
        )}

        {/* Pagination & Palette */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition"
          >
            Previous
          </button>

          {/* Quick Palette Pills */}
          <div className="flex flex-wrap gap-1.5 justify-center">
            {questions.map((q, idx) => {
              const isAns = userAnswers[q.id] !== undefined;
              const isCurr = currentIdx === idx;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-7 h-7 rounded-xl text-[11px] font-bold transition ${
                    isCurr ? 'bg-indigo-600 text-white ring-2 ring-cyan-400' :
                    isAns ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    'bg-slate-950 border border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {currentIdx < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm"
              >
                Next
              </button>
            ) : (
              !isSubmitted && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition shadow-lg flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Diagnostic</span>
                </button>
              )
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
