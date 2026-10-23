import React, { useState, useEffect } from 'react';
import { X, Sparkles, Terminal, Copy, Check, Cpu, BrainCircuit } from 'lucide-react';
import { getLastAgentExecution } from '../services/aiAgentService';

export default function PromptInspectorModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [executionData, setExecutionData] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setExecutionData(getLastAgentExecution());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const data = executionData || getLastAgentExecution();

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 text-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-4 max-h-[88vh] flex flex-col relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Terminal className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>MoSPI AI Agent & Prompt Inspector</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                  SIH Meta-Feature
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Transparent inspection of agent chains, prompts, temperatures, and models
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition flex items-center gap-1"
              title="Copy JSON trace"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Trace'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-medium">Active Agent</span>
              <div className="text-white font-bold truncate">{data.agentName}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-medium">Underlying Model</span>
              <div className="text-cyan-400 font-bold truncate">{data.model}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-medium">Temperature</span>
              <div className="text-amber-400 font-mono font-bold">{data.temperature}</div>
            </div>
          </div>

          {/* System Prompt Box */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wide flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
              <span>System Prompt & Role Definition</span>
            </span>
            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
              {data.systemPrompt}
            </pre>
          </div>

          {/* User Prompt / Task Context */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>Task Input & Context Payload</span>
            </span>
            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
              {data.userPrompt}
            </pre>
          </div>

          {/* Raw Response Output */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Agent Output & Reasoning Response</span>
            </span>
            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-emerald-300 whitespace-pre-wrap font-mono leading-relaxed max-h-48 overflow-y-auto">
              {data.rawResponse}
            </pre>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Executed at: {new Date(data.timestamp).toLocaleTimeString()}</span>
          <span>MoSPI DIID &bull; Smart India Hackathon 2026</span>
        </div>

      </div>
    </div>
  );
}
