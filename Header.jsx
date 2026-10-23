import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  CheckCircle2, 
  LogOut,
  Zap,
  Key,
  Terminal
} from 'lucide-react';
import ApiKeyModal from './ApiKeyModal';
import PromptInspectorModal from './PromptInspectorModal';

export default function Header({ 
  currentRole, 
  setCurrentRole, 
  activeOfficer, 
  onLoadSampleProfile, 
  onLogout,
  isAdmin = false,
  showDemoLoader = false
}) {
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showPromptInspector, setShowPromptInspector] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 shadow-2xl">
        {/* Government of India Tricolor Ribbon */}
        <div className="gov-tricolor-bar w-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            
            {/* Left: Ministry Branding & Portal Identity */}
            <div className="flex items-center space-x-3.5">
              {/* National Emblem Box */}
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-950 to-indigo-950 flex items-center justify-center text-white shadow-md border border-indigo-500/30 shrink-0">
                <div className="text-center leading-none">
                  <span className="text-[8px] font-black tracking-widest text-amber-400 block">GOI</span>
                  <Building2 className="w-5 h-5 mx-auto text-amber-400 my-0.5" />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg font-black text-white tracking-tight flex items-center gap-1.5">
                    समर्थ्य-STAT 
                    <span className="text-[11px] font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-500/30">
                      Samarthya
                    </span>
                  </h1>
                  
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 font-mono">
                    SIH 2026 &bull; PS 26101
                  </span>

                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>iGOT Karmayogi Synced</span>
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 font-medium">
                  Ministry of Statistics & Programme Implementation (MoSPI) &bull; DIID & NSSTA Greater Noida
                </p>
              </div>
            </div>

            {/* Right Controls: Role Switcher, API Key, Prompt Inspector & Officer Profile */}
            <div className="flex flex-wrap items-center gap-2 justify-end">
              
              {/* SIH Judge Prompt Inspector Button */}
              <button
                type="button"
                onClick={() => setShowPromptInspector(true)}
                className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl bg-slate-800 text-cyan-300 border border-cyan-500/30 hover:bg-slate-700 transition shadow-sm"
                title="Inspect AI System Prompts and Model Execution Chain"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Prompt Inspector</span>
              </button>

              {/* Gemini API Key Button */}
              <button
                type="button"
                onClick={() => setShowApiKeyModal(true)}
                className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl bg-slate-800 text-amber-300 border border-amber-500/30 hover:bg-slate-700 transition shadow-sm"
                title="Configure Gemini API Key"
              >
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Key</span>
              </button>

              {showDemoLoader && (
              <button
                type="button"
                onClick={onLoadSampleProfile}
                className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600/50 transition"
                title="Quickly fill sample profile"
              >
                <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>Load Demo Officer</span>
              </button>

              )}

              {/* Role Switcher (administrators only) */}
              {isAdmin && (
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setCurrentRole('learner')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition ${
                    currentRole === 'learner'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Learner</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentRole('admin')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition ${
                    currentRole === 'admin'
                      ? 'bg-slate-800 text-amber-400 shadow-sm border border-slate-700'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>MoSPI Admin</span>
                </button>
              </div>
              )}

              {/* Officer Avatar Chip */}
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                <div className="w-8 h-8 rounded-full bg-indigo-600 border border-indigo-400/40 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  {activeOfficer?.name ? activeOfficer.name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'RK'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white leading-none">
                    {activeOfficer?.name || 'Officer'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium mt-0.5 leading-none">
                    {activeOfficer?.designation || 'SSO'} &bull; {activeOfficer?.division || 'NAD'}
                  </div>
                </div>

                {/* Logout Button */}
                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition ml-1"
                    title="Sign out / Switch account"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* Modals */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
      />

      <PromptInspectorModal
        isOpen={showPromptInspector}
        onClose={() => setShowPromptInspector(false)}
      />
    </>
  );
}
