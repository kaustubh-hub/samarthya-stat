import React, { useState, useEffect } from 'react';
import { Building2, ShieldCheck, UserCheck, ArrowRight, Sparkles, Lock, Mail, Zap } from 'lucide-react';
import { MOSPI_DIVISIONS, DESIGNATIONS, SAMPLE_RESUMES } from '../data/mockData';
import { login, register, demoLogin, getHealth } from '../services/authService';

export default function LoginRegister({ onLogin }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [selectedRole, setSelectedRole] = useState('learner'); // 'learner' or 'admin'
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regForm, setRegForm] = useState({
    name: '',
    employeeId: '',
    designation: 'SSO',
    division: 'NAD',
    experience: '4.5 Years',
    qualifications: 'M.Sc. Statistics',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [demoEnabled, setDemoEnabled] = useState(true);

  // Hide the one-click demo personas if the server has disabled them (production)
  useEffect(() => {
    getHealth().then(h => { if (h && h.demo === false) setDemoEnabled(false); });
  }, []);

  // Turn the server's account record into the profile object the app uses.
  // Real (non-demo) learners start with an empty skills/gaps list until their resume is analysed.
  const finish = (u, progress, extra = {}) => {
    onLogin({
      role: u.role,
      id: u.id,
      email: u.email,
      demo: u.demo,
      name: u.name,
      employeeId: u.employeeId,
      designation: u.designation || 'SSO',
      division: u.division || 'NAD',
      experience: u.experience,
      qualifications: u.qualifications,
      ...(u.role === 'learner' && !u.demo ? { skills: [], preliminaryGaps: [] } : {}),
      ...extra
    }, progress);
  };

  const run = async (fn) => {
    setError('');
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleManualLogin = (e) => {
    e.preventDefault();
    if (busy) return;
    if (!loginEmail.trim() || !loginPassword) {
      setError('Please enter your email and password.');
      return;
    }
    run(async () => {
      const { user, progress } = await login(loginEmail, loginPassword, selectedRole);
      finish(user, progress);
    });
  };

  const handleQuickDemoLogin = (profileType) => {
    if (busy) return;
    if (profileType === 'admin') {
      // Administrators must authenticate: just take them to the admin sign-in form
      setError('');
      setActiveTab('login');
      setSelectedRole('admin');
      return;
    }
    const sample = SAMPLE_RESUMES[profileType === 'jso_fod' ? 1 : 0];
    run(async () => {
      const { user, progress } = await demoLogin(profileType);
      finish(user, progress, {
        division: sample.division,
        experience: sample.experience,
        qualifications: sample.qualifications,
        skills: sample.extractedSkills,
        preliminaryGaps: sample.detectedGaps
      });
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (busy) return;
    run(async () => {
      const { user, progress } = await register(regForm);
      finish(user, progress);
    });
  };

  const ErrorBox = () => error ? (
    <div role="alert" className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-200">
      {error}
    </div>
  ) : null;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Glows (MuchSkills Dark Aesthetics) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Gov Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-cyan-300 text-xs font-semibold mb-3 border border-indigo-400/30 backdrop-blur-md font-mono">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Smart India Hackathon 2026 &bull; PS 26101</span>
        </div>

        <div className="flex items-center justify-center gap-3.5 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-lg">
            <Building2 className="w-7 h-7" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              समर्थ्य-STAT
            </h1>
            <p className="text-xs text-indigo-300 font-medium">
              MoSPI &bull; Integrated with iGOT Karmayogi
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          AI-Enabled Skill Intelligence & Continuous Capacity Building Platform
        </p>
      </div>

      {/* Main Authentication Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-slate-900/90 backdrop-blur-xl py-8 px-6 sm:px-10 rounded-3xl shadow-2xl border border-slate-800 space-y-6">
          
          {/* Tab Switcher: Login vs Register */}
          <div className="flex p-1 bg-slate-950 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'login'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In (Jan Parichay / SSO)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'register'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register New Official
            </button>
          </div>

          {/* TAB 1: LOGIN */}
          {activeTab === 'login' && (
            <div className="space-y-5">
              
              {/* Role Selection Pill */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedRole('learner')}
                  className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 ${
                    selectedRole === 'learner'
                      ? 'border-indigo-500 bg-indigo-950/60 ring-1 ring-indigo-500 text-white'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-750 text-slate-400'
                  }`}
                >
                  <UserCheck className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">Learner Official</div>
                    <div className="text-[10px] text-slate-400">ISS / SSS / Cadre</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 ${
                    selectedRole === 'admin'
                      ? 'border-amber-500 bg-amber-950/40 ring-1 ring-amber-500 text-white'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-750 text-slate-400'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">MoSPI Admin</div>
                    <div className="text-[10px] text-slate-400">DIID & NSSTA Wing</div>
                  </div>
                </button>
              </div>

              {/* Instant 1-Click Demo Login for SIH Judges (hidden when ALLOW_DEMO_LOGIN=false) */}
              {demoEnabled && (
              <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>Instant 1-Click Evaluation Personas:</span>
                  </span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/40 font-mono">
                    SIH Ready
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('sso_nad')}
                    className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 transition text-xs font-bold text-white shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span>Rajesh Verma (SSO)</span>
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal">National Accounts (NAD)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('jso_fod')}
                    className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 transition text-xs font-bold text-white shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span>Pooja Sharma (JSO)</span>
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal">Field Operations (FOD)</div>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin')}
                  className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-amber-500/30 text-amber-300 text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>MoSPI Administrator sign-in</span>
                </button>
              </div>
              )}

              {/* Standard Email/Gov ID form */}
              <form onSubmit={handleManualLogin} className="space-y-3.5 pt-1">
                {selectedRole === 'admin' && (
                  <div className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>MoSPI administrator sign-in. Use the official admin email and password issued to you.</span>
                  </div>
                )}
                <ErrorBox />
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Government Email / Karmayogi ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      autoComplete="username"
                      placeholder="officer.name@nic.in"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Password / Single Sign-On Token
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    <input
                      type="password"
                      autoComplete="current-password"
                      placeholder="••••••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
                >
                  <span>{busy ? 'Signing in…' : selectedRole === 'admin' ? 'Sign In as MoSPI Admin' : 'Sign In to Samarthya-Stat'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

            </div>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <ErrorBox />
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Full Name (as per Service Book)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suresh Chandra Nair"
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Official Email</label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="name@nic.in"
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Password (min 8 characters)</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cadre Designation
                  </label>
                  <select
                    value={regForm.designation}
                    onChange={(e) => setRegForm({ ...regForm, designation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {DESIGNATIONS.map((d) => (
                      <option key={d.id} value={d.id}>{d.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    MoSPI Division
                  </label>
                  <select
                    value={regForm.division}
                    onChange={(e) => setRegForm({ ...regForm, division: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {MOSPI_DIVISIONS.map((div) => (
                      <option key={div.id} value={div.id}>{div.id} - {div.name.split('(')[0]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ISS-2024-8819"
                    value={regForm.employeeId}
                    onChange={(e) => setRegForm({ ...regForm, employeeId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Experience
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5 Years"
                    value={regForm.experience}
                    onChange={(e) => setRegForm({ ...regForm, experience: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Educational Qualifications
                </label>
                <input
                  type="text"
                  placeholder="e.g. M.Sc. Statistics / MCA / M.A. Economics"
                  value={regForm.qualifications}
                  onChange={(e) => setRegForm({ ...regForm, qualifications: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full py-3 mt-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-indigo-700 hover:from-emerald-500 hover:to-indigo-600 disabled:opacity-60 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
              >
                <span>{busy ? 'Creating account…' : 'Register & Begin Competency Diagnostic'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>
      </div>

    </div>
  );
}
