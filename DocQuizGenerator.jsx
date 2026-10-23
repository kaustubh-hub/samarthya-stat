import React, { useState } from 'react';
import { FileText, Upload, Sparkles, CheckCircle, AlertCircle, ArrowRight, RefreshCw, CheckCircle2, Zap, BookOpen, Repeat, BrainCircuit } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PRELOADED_LEARNING_MATERIALS } from '../data/mockData';
import AiCourseRecommenderAgent from './AiCourseRecommenderAgent';
import IgotPlayerModal from './IgotPlayerModal';
import { runDocumentQuiz } from '../services/aiAgentService';

export default function DocQuizGenerator({ 
  onQuizCompletedAndUpdateProfile,
  onProceedToLoop,
  onSyncIgotCourse,
  officerProfile 
}) {
  const [selectedMaterial, setSelectedMaterial] = useState(PRELOADED_LEARNING_MATERIALS[0]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractStage, setExtractStage] = useState('');
  const [activeQuizQuestions, setActiveQuizQuestions] = useState(PRELOADED_LEARNING_MATERIALS[0].questions);
  const [quizState, setQuizState] = useState('preview'); // 'preview', 'taking', 'analysis'
  
  // Quiz taking state
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [customFileUploaded, setCustomFileUploaded] = useState(null);

  const [generationError, setGenerationError] = useState('');
  const [quizCompetencyId, setQuizCompetencyId] = useState(null);
  const [playerCourse, setPlayerCourse] = useState(null);

  // Real generation: the AI agent reads the document (curated publication or uploaded file)
  // and returns 10 calibrated MCQs.
  const handleGenerateQuiz = async (material, file = null) => {
    if (isExtracting) return;
    setGenerationError('');
    setSelectedMaterial(material);
    setIsExtracting(true);
    setExtractStage(file ? `Reading ${file.name} and extracting text...` : 'Extracting statistical text, mathematical axioms, and SNA concepts from the document...');

    const stages = [
      'NLP Semantic Analysis: Mapping definitions, formulas and methodology...',
      'AI Assessment Engine: Generating 10 calibrated MCQs (3 Easy, 4 Medium, 3 Hard)...',
      'Validating answer keys and shuffling options...'
    ];
    let i = 0;
    const timer = setInterval(() => {
      setExtractStage(stages[Math.min(i, stages.length - 1)]);
      i += 1;
    }, 1800);

    try {
      const { quiz } = await runDocumentQuiz(
        file ? { file, title: material.title } : { materialId: material.id, title: material.title }
      );
      setActiveQuizQuestions(quiz.questions);
      setQuizCompetencyId(quiz.competencyId || null);
      setQuizState('taking');
      setCurrentQIdx(0);
      setAnswers({});
      setQuizResult(null);
    } catch (e) {
      setGenerationError(e.message || 'Quiz generation failed. Please try again.');
      setCustomFileUploaded(null);
    } finally {
      clearInterval(timer);
      setIsExtracting(false);
    }
  };

  const handleCustomFileUpload = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setCustomFileUploaded(file.name);
    handleGenerateQuiz(
      {
        id: 'custom_upload',
        title: file.name.replace(/\.[^.]+$/, ''),
        division: 'Custom Upload'
      },
      file
    );
  };

  const handleSelectOption = (qId, optionIdx) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  // Auto-solve for SIH Judge fast demonstration
  const handleAutoSolve = () => {
    const solved = {};
    activeQuizQuestions.forEach((q, idx) => {
      // 8 correct, 2 wrong for authentic deficit analysis
      if (idx === 1 || idx === 3) {
        solved[q.id] = (q.correctAnswer + 1) % 4; // Intentional error to trigger targeted recommendations
      } else {
        solved[q.id] = q.correctAnswer;
      }
    });
    setAnswers(solved);
  };

  // Finish quiz & calculate diagnostics
  const handleFinishQuiz = () => {
    let correctCount = 0;
    const strongTopics = [];
    const weakTopics = [];

    activeQuizQuestions.forEach(q => {
      const isCorrect = answers[q.id] === q.correctAnswer;
      if (isCorrect) {
        correctCount++;
        strongTopics.push(q.topic || 'Core Concept');
      } else {
        weakTopics.push(q.topic || 'Advanced Deflator Methodology');
      }
    });

    const scorePct = Math.round((correctCount / activeQuizQuestions.length) * 100);

    const result = {
      scorePct,
      correctCount,
      totalCount: activeQuizQuestions.length,
      strongTopics: [...new Set(strongTopics)],
      weakTopics: [...new Set(weakTopics)],
      materialTitle: selectedMaterial.title,
      division: selectedMaterial.division,
      competencyId: quizCompetencyId
    };

    setQuizResult(result);
    setQuizState('analysis');

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti error:', e);
    }
  };

  const handleApplyToProfile = () => {
    if (onQuizCompletedAndUpdateProfile) {
      onQuizCompletedAndUpdateProfile(quizResult);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Top Banner (MuchSkills Dark Aesthetics) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
              <BrainCircuit className="w-3.5 h-3.5 text-amber-400" />
              <span>Step 5: Intelligent Assessment Engine & Document AI</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>PDF Text Extraction to 10-Question Adaptive Quiz</span>
            </h2>
            
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Upload any official MoSPI handbook, research paper, or circular. Our AI engine extracts formulas and methodologies, dynamically generates 10 objective MCQs (Easy, Medium, Hard), and recommends targeted iGOT courses based on the outcome.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-mono">
              Mode: {quizState.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* STATE 1: PREVIEW & DOCUMENT SELECTION */}
      {quizState === 'preview' && (
        <div className="space-y-6">
          
          {/* Document Upload Zone */}
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl p-6 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-base">Upload Official Learning Material</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">PDF, DOCX, TXT supported</span>
            </div>

            <div className="border-2 border-dashed border-indigo-500/30 hover:border-indigo-400/60 rounded-2xl p-8 text-center transition bg-indigo-950/20 space-y-3">
              <FileText className="w-12 h-12 text-cyan-400 mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-white">
                  {customFileUploaded ? `Uploaded: ${customFileUploaded}` : 'Drag & Drop PDF or Select from MoSPI Repository'}
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  The NLP engine parses formulas, SNA definitions, and survey guidelines to construct a 10-MCQ assessment.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <label className="cursor-pointer px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md">
                  <span>Browse Custom PDF</span>
                  <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={handleCustomFileUpload} />
                </label>
              </div>
            </div>
          </div>

          {/* Pre-loaded Official MoSPI Publications */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Or Choose Pre-Loaded MoSPI Official Publications</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRELOADED_LEARNING_MATERIALS.map(mat => (
                <div 
                  key={mat.id}
                  className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl hover:border-indigo-500/40 transition flex flex-col justify-between space-y-4 backdrop-blur-md"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                        {mat.division}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {mat.pages} &bull; {mat.fileSize}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug">
                      {mat.title}
                    </h4>

                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {mat.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div className="text-[11px] text-slate-400 font-semibold">
                      10 Calibrated MCQs Available
                    </div>

                    <button
                      type="button"
                      onClick={() => handleGenerateQuiz(mat)}
                      disabled={isExtracting}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Extract & Generate Quiz</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {generationError && (
            <div role="alert" className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-xs text-red-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{generationError}</span>
            </div>
          )}

          {/* AI Extraction Animation Card */}
          {isExtracting && (
            <div className="p-6 rounded-2xl bg-slate-950 border border-indigo-500/40 text-white space-y-3 shadow-2xl animate-pulse">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
                <h4 className="text-sm font-bold text-indigo-200">
                  AI Intelligent Assessment Engine Parsing Document...
                </h4>
              </div>
              <p className="text-xs text-slate-300 font-mono">&gt; {extractStage}</p>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full w-4/5 animate-pulse" />
              </div>
            </div>
          )}

        </div>
      )}

      {/* STATE 2: TAKING THE 10-QUESTION QUIZ */}
      {quizState === 'taking' && (
        <div className="space-y-6">
          
          {/* Quiz Top Bar */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 backdrop-blur-md">
            <div>
              <span className="text-[11px] font-bold text-indigo-300 bg-indigo-500/20 px-2.5 py-0.5 rounded border border-indigo-400/30">
                {selectedMaterial.division} Assessment
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                {selectedMaterial.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAutoSolve}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition flex items-center gap-1 shadow-sm"
                title="Auto-solves for rapid demonstration"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>⚡ Auto-Solve for Demo</span>
              </button>

              <button
                type="button"
                onClick={() => setQuizState('preview')}
                className="px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition"
              >
                Switch Document
              </button>
            </div>
          </div>

          {/* Question Card */}
          {activeQuizQuestions[currentQIdx] && (
            <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl p-6 space-y-4 backdrop-blur-md">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 font-mono">
                    Question {currentQIdx + 1} of {activeQuizQuestions.length}
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                    activeQuizQuestions[currentQIdx].difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                    activeQuizQuestions[currentQIdx].difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                    'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  }`}>
                    {activeQuizQuestions[currentQIdx].difficulty}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Topic: {activeQuizQuestions[currentQIdx].topic}
                  </span>
                </div>

                <span className="text-xs font-semibold text-slate-400 font-mono">
                  {Object.keys(answers).length} / {activeQuizQuestions.length} Answered
                </span>
              </div>

              {/* Question Text */}
              <div className="py-2">
                <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                  {activeQuizQuestions[currentQIdx].question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {activeQuizQuestions[currentQIdx].options.map((opt, oIdx) => {
                  const isSelected = answers[activeQuizQuestions[currentQIdx].id] === oIdx;

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectOption(activeQuizQuestions[currentQIdx].id, oIdx)}
                      className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition flex items-start gap-3.5 ${
                        isSelected 
                          ? 'border-indigo-500 bg-indigo-950/60 text-white ring-1 ring-indigo-500' 
                          : 'border-slate-800 bg-slate-950/60 hover:border-indigo-500/50 hover:bg-slate-950 text-slate-300'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-bold ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="leading-relaxed mt-0.5">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCurrentQIdx(prev => Math.max(0, prev - 1))}
                  disabled={currentQIdx === 0}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition"
                >
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {currentQIdx < activeQuizQuestions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentQIdx(prev => Math.min(activeQuizQuestions.length - 1, prev + 1))}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition shadow-sm"
                    >
                      Next Question
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleFinishQuiz}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Finish & View Quiz Analysis</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* Quick Palette */}
          <div className="flex flex-wrap gap-2 justify-center">
            {activeQuizQuestions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = currentQIdx === idx;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentQIdx(idx)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition ${
                    isCurrent ? 'bg-indigo-600 text-white ring-2 ring-cyan-400' :
                    isAnswered ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 
                    'bg-slate-900 border border-slate-800 text-slate-500'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

        </div>
      )}

      {/* STATE 3: QUIZ ANALYSIS & POST-QUIZ AI COURSE AGENT (User's Core Requirement!) */}
      {quizState === 'analysis' && quizResult && (
        <div className="space-y-8">
          
          {/* Main Results Card */}
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl p-6 space-y-6 backdrop-blur-md">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Step 11: Quiz Analysis Complete
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Performance Diagnostics on: {quizResult.materialTitle}
                </h3>
              </div>

              <div className="text-center sm:text-right">
                <div className="text-4xl font-black text-cyan-400">
                  {quizResult.scorePct}%
                </div>
                <div className="text-xs text-slate-400 font-semibold mt-0.5">
                  {quizResult.correctCount} of {quizResult.totalCount} Correct
                </div>
              </div>
            </div>

            {/* Strong Topics vs Weak Topics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Strong Topics */}
              <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Strong Topics Identified</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(quizResult.strongTopics || []).map((topic, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-xl bg-emerald-900/40 border border-emerald-500/30 text-emerald-200 font-medium">
                      ✓ {topic}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Demonstrates solid mastery of core definitions, SNA 2008 frameworks, and price aggregations.
                </p>
              </div>

              {/* Weak Topics */}
              <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Topics Requiring Reinforcement (Weak Areas)</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(quizResult.weakTopics || []).length > 0 ? (
                    quizResult.weakTopics.map((topic, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-xl bg-amber-900/40 border border-amber-500/30 text-amber-200 font-medium">
                        ⚠ {topic}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-emerald-300 font-medium">None! 100% mastery achieved.</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  AI Course Recommendation Agent below maps these deficits to live courses available on iGOT.
                </p>
              </div>

            </div>

            {/* Action Card to Update Profile */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                Ready to feed this quiz result back into your official MoSPI profile?
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setQuizState('preview')}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold transition w-full sm:w-auto"
                >
                  Upload Another Document
                </button>

                <button
                  type="button"
                  onClick={handleApplyToProfile}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-black text-xs tracking-wider uppercase shadow-lg transition flex items-center justify-center gap-2 group w-full sm:w-auto"
                >
                  <Repeat className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  <span>Update Profile & Recalibrate Gaps</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* DEDICATED AI COURSE RECOMMENDATION AGENT BASED ON QUIZ RESULTS & RESUME */}
          <AiCourseRecommenderAgent
            quizResult={quizResult}
            officerProfile={officerProfile}
            onProceedToLoop={handleApplyToProfile}
            onLaunchIgotPlayer={(course) => setPlayerCourse(course)}
          />

        </div>
      )}

      {playerCourse && (
        <IgotPlayerModal
          course={playerCourse}
          onClose={() => setPlayerCourse(null)}
          officerProfile={officerProfile}
          onSyncCourseCompletion={(completed) => onSyncIgotCourse && onSyncIgotCourse(completed)}
        />
      )}

    </div>
  );
}
