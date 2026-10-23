import React, { useState, useEffect } from 'react';
import { X, Key, Check, AlertCircle } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey } from '../services/aiAgentService';

export default function ApiKeyModal({ isOpen, onClose, onKeySaved }) {
  const [apiKey, setApiKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getStoredApiKey());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setStoredApiKey(apiKey);
    setSavedSuccess(true);
    if (onKeySaved) onKeySaved(apiKey);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setStoredApiKey('');
    setApiKey('');
    setSavedSuccess(false);
    if (onKeySaved) onKeySaved('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 text-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-bold">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Google Gemini API Key</h3>
            <p className="text-xs text-slate-400">Live LLM reasoning for SIH Judges & Evaluators</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The AI agent server normally holds its own Gemini key. Add a personal key here only if the server has none; it is sent over HTTPS to this app's server (in a header, never in a URL) to power <code className="text-cyan-300 font-mono">gemini-2.5-flash</code> resume parsing, quiz generation, and course matching.
        </p>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Zero-Setup Fallback Enabled</span>
          </div>
          <p className="text-[11px] text-slate-400">
            If no key is available anywhere, an offline rule-based engine still reads your resume and builds a diagnostic from the built-in question bank. Quizzes from custom uploaded documents need the live AI engine.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-slate-400 hover:text-red-400 transition"
            >
              Clear Key
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Key Saved!</span>
                  </>
                ) : (
                  <span>Save API Key</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
