import React from 'react';
import { 
  User, 
  HelpCircle, 
  Target, 
  Sparkles, 
  FileText, 
  Repeat, 
  Check, 
  ChevronRight 
} from 'lucide-react';

const STEPS = [
  { id: 'profile', number: 1, title: 'Profile & Resume', icon: User },
  { id: 'assessment', number: 2, title: 'Diagnostic Quiz', icon: HelpCircle },
  { id: 'analysis', number: 3, title: 'Skill Gap Matrix', icon: Target },
  { id: 'recommendations', number: 4, title: 'iGOT Courses', icon: Sparkles },
  { id: 'doc_quiz', number: 5, title: 'Document AI Studio', icon: FileText },
  { id: 'loop', number: 6, title: 'Continuous Loop', icon: Repeat }
];

export default function StepNavigation({ 
  currentStep, 
  onSelectStep, 
  assessmentCompleted, 
  docQuizCompleted, 
  currentRole 
}) {
  if (currentRole === 'admin') {
    return (
      <div className="bg-slate-950 text-white py-2.5 border-b border-slate-800 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold tracking-wide uppercase text-amber-300">
              MoSPI Administrative Leadership Dashboard &bull; DIID & NSSTA Greater Noida
            </span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Workforce Competency & Training Needs Assessment (TNA 2026)
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950/90 border-b border-slate-800 shadow-md backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <nav className="flex items-center justify-between overflow-x-auto no-scrollbar gap-1.5 sm:gap-2">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = 
              (step.id === 'profile' && true) ||
              (step.id === 'assessment' && assessmentCompleted) ||
              (step.id === 'doc_quiz' && docQuizCompleted);

            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => onSelectStep(step.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 shrink-0 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg ring-1 ring-cyan-400'
                      : isCompleted
                      ? 'bg-slate-900 text-slate-200 hover:bg-slate-850 border border-slate-800'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black ${
                    isActive
                      ? 'bg-white text-indigo-700'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isCompleted && !isActive ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                    ) : (
                      step.number
                    )}
                  </span>
                  <span className="whitespace-nowrap">{step.title}</span>
                </button>

                {index < STEPS.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-700 shrink-0 hidden md:inline" />
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
