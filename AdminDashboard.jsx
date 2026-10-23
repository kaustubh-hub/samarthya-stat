import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Building2, Users, TrendingUp, AlertTriangle, Award, Download, Sparkles, BarChart3, Search, X, RefreshCw } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { MOSPI_DIVISIONS } from '../data/mockData';
import { getAdminSummary, getAdminUsers, getAdminUser, downloadAdminCsv } from '../services/authService';

const fmtDate = (iso) => (iso ? new Date(iso).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '—');
const pct = (v) => (v === null || v === undefined ? '—' : `${Math.round(v)}%`);

function OfficerDetail({ id, onClose }) {
  const [d, setD] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => {
    let alive = true;
    getAdminUser(id).then((r) => alive && setD(r)).catch((e) => alive && setErr(e.message));
    return () => { alive = false; };
  }, [id]);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 space-y-5 my-auto">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-white">{d?.name || 'Officer details'}</h3>
            {d && <p className="text-xs text-slate-400">{d.email} • {d.designation} • {d.division}{d.employeeId ? ` • ${d.employeeId}` : ''}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        {err && <div role="alert" className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-200">{err}</div>}
        {!d && !err && <div className="text-sm text-slate-400">Loading…</div>}

        {d && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                ['Competency Index', pct(d.avgIndex)],
                ['Critical Gaps', d.scoresReady ? d.criticalGaps : '—'],
                ['Diagnostic Score', pct(d.diagnosticPct)],
                ['Avg Quiz Score', pct(d.avgQuizPct)]
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl bg-slate-950 border border-slate-800 p-3">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">{k}</div>
                  <div className="text-2xl font-black text-white">{v}</div>
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-3"><span className="text-slate-400">Experience: </span>{d.experience || '—'}</div>
              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-3"><span className="text-slate-400">Qualifications: </span>{d.qualifications || '—'}</div>
              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-3"><span className="text-slate-400">Registered: </span>{fmtDate(d.createdAt)}</div>
              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-3"><span className="text-slate-400">Last active: </span>{fmtDate(d.lastActive)}</div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-2">Competency scores vs. targets</h4>
              {!d.scoresReady ? (
                <p className="text-xs text-slate-400">This officer has not yet analysed a resume or taken an assessment, so no scores are recorded.</p>
              ) : (
                <div className="space-y-1.5">
                  {d.competencies.filter((c) => c.score !== null).map((c) => (
                    <div key={c.id} className="flex items-center gap-3 text-xs">
                      <span className="w-52 shrink-0 text-slate-300 truncate" title={c.name}>{c.name}</span>
                      <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden relative">
                        <div className={`h-full ${c.target - c.score >= 45 ? 'bg-red-500' : c.target - c.score >= 25 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${c.score}%` }} />
                      </div>
                      <span className="w-20 text-right font-mono text-slate-300">{c.score}/{c.target}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-bold text-white mb-2">Skills from resume</h4>
                <div className="flex flex-wrap gap-1.5">
                  {d.skills.length ? d.skills.map((s) => <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">{s}</span>) : <span className="text-xs text-slate-500">None recorded</span>}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-2">Flagged gaps</h4>
                <div className="flex flex-wrap gap-1.5">
                  {d.gaps.length ? d.gaps.map((s) => <span key={s} className={`text-[11px] px-2 py-0.5 rounded-full border ${s.includes('Critical') ? 'bg-red-500/20 text-red-200 border-red-500/40' : 'bg-amber-500/20 text-amber-200 border-amber-500/40'}`}>{s}</span>) : <span className="text-xs text-slate-500">None recorded</span>}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-2">Quiz history</h4>
              {d.quizHistory.length ? (
                <ul className="space-y-1.5">
                  {d.quizHistory.map((q, i) => (
                    <li key={i} className="flex items-center justify-between text-xs rounded-xl bg-slate-950 border border-slate-800 px-3 py-2">
                      <span className="text-slate-200 truncate pr-3">{q.title}</span>
                      <span className="shrink-0 text-slate-400">{fmtDate(q.at)} • <strong className="text-white">{q.scorePct}%</strong></span>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-xs text-slate-500">No document quizzes taken yet.</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-bold text-white mb-2">iGOT courses enrolled ({d.enrolledCourses.length})</h4>
                <ul className="text-xs text-slate-300 space-y-1">{d.enrolledCourses.length ? d.enrolledCourses.map((c) => <li key={c}>• {c}</li>) : <li className="text-slate-500">None</li>}</ul>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-2">Completed ({d.completedCourses.length})</h4>
                <ul className="text-xs text-slate-300 space-y-1">{d.completedCourses.length ? d.completedCourses.map((c) => <li key={c}>✓ {c}</li>) : <li className="text-slate-500">None</li>}</ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [query, setQuery] = useState('');
  const [divFilter, setDivFilter] = useState('all');
  const [showDemo, setShowDemo] = useState(false);
  const [openId, setOpenId] = useState(null);
  const [exporting, setExporting] = useState(false);

  const load = useCallback(async () => {
    try {
      const [s, u] = await Promise.all([getAdminSummary(), getAdminUsers()]);
      setSummary(s);
      setUsers(u.users);
      setError('');
      setUpdatedAt(new Date());
    } catch (e) {
      setError(e.status === 401 || e.status === 403 ? 'Your administrator session has expired. Please sign in again.' : e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 30000); // live refresh
    return () => clearInterval(t);
  }, [load]);

  const handleExport = async () => {
    setExporting(true);
    try {
      await downloadAdminCsv();
    } catch (e) {
      setError(e.message);
    } finally {
      setExporting(false);
    }
  };

  const real = useMemo(() => users.filter((u) => !u.demo), [users]);
  const assessed = summary?.assessedOfficers || 0;
  const withCritical = real.filter((u) => u.scoresReady && u.criticalGaps > 0).length;
  const enrolledTotal = real.reduce((s, u) => s + u.coursesEnrolled, 0);
  const worstDivision = summary ? [...summary.divisionReadiness].sort((a, b) => b.criticalGaps - a.criticalGaps)[0] : null;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) =>
      (showDemo || !u.demo) &&
      (divFilter === 'all' || u.division === divFilter) &&
      (!q || `${u.name} ${u.email} ${u.employeeId}`.toLowerCase().includes(q))
    );
  }, [users, query, divFilter, showDemo]);

  const s = summary || { totalOfficers: 0, averageCompetencyIndex: 0, criticalGapsActive: 0, completedIgotCertificates: 0, divisionReadiness: [], topDeficientSkills: [] };

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>MoSPI DIID & NSSTA Leadership Cockpit</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Workforce Skill Intelligence & Capacity Analytics
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Live monitoring of every registered officer's competencies, quiz scores, critical skill deficits and iGOT Karmayogi progress across all 7 MoSPI divisions.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={load}
              title="Refresh now"
              className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={exporting}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 disabled:opacity-60 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>{exporting ? 'Preparing…' : 'Export Officer Data (CSV)'}</span>
            </button>
          </div>
        </div>
        {updatedAt && <p className="relative z-10 mt-3 text-[10px] text-slate-400 font-mono">Updated {updatedAt.toLocaleTimeString()} • auto-refreshes every 30 s</p>}
      </div>

      {error && <div role="alert" className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 text-xs text-red-200">{error}</div>}

      {/* 4 Key Ministry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl flex items-center justify-between backdrop-blur-md">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Registered Officers</span>
            <div className="text-3xl font-black text-white">{s.totalOfficers.toLocaleString()}</div>
            <p className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{assessed} assessed</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-cyan-400 border border-indigo-500/30 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl flex items-center justify-between backdrop-blur-md">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Avg Competency Index</span>
            <div className="text-3xl font-black text-cyan-400">{assessed ? `${s.averageCompetencyIndex}%` : '—'}</div>
            <p className="text-[11px] text-slate-400 font-medium">Target: 80% across divisions</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-cyan-400 border border-indigo-500/30 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-red-500/40 p-5 shadow-xl flex items-center justify-between backdrop-blur-md muchskills-glow-red">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-red-400 uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>Active Critical Gaps</span>
            </span>
            <div className="text-3xl font-black text-red-400">{s.criticalGapsActive}</div>
            <p className="text-[11px] text-slate-400">
              {assessed ? `${Math.round((withCritical / assessed) * 100)}% of assessed officers affected` : 'No assessed officers yet'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-emerald-500/30 p-5 shadow-xl flex items-center justify-between backdrop-blur-md muchskills-glow-emerald">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">iGOT Courses Completed</span>
            <div className="text-3xl font-black text-emerald-400">{s.completedIgotCertificates.toLocaleString()}</div>
            <p className="text-[11px] text-slate-400 font-mono">{enrolledTotal} enrollments • {s.quizzesTaken || 0} quizzes</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <div className="lg:col-span-7 bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl p-6 space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-white text-base">Division Competency Readiness vs. Critical Deficits</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">{MOSPI_DIVISIONS.length} MoSPI Divisions</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={s.divisionReadiness} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="division" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} stroke="#334155" />
                <Tooltip contentStyle={{ backgroundColor: '#070a13', border: '1px solid #334155', color: '#fff', borderRadius: 12, fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10, color: '#cbd5e1' }} />
                <Bar name="Competency Readiness (%)" dataKey="score" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar name="Critical Gap Count" dataKey="criticalGaps" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-400">
            {worstDivision && worstDivision.criticalGaps > 0
              ? <span><strong>{worstDivision.name} ({worstDivision.division})</strong> currently has the most critical competency gaps ({worstDivision.criticalGaps}) across {worstDivision.officers} registered officer{worstDivision.officers === 1 ? '' : 's'}.</span>
              : <span>No critical gaps recorded yet. Divisions fill in as officers register and complete their assessments.</span>}
          </div>
        </div>

        <div className="lg:col-span-5 bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl p-6 space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">Predictive Capacity Deficiencies</h3>
            </div>
            {s.topDeficientSkills.length > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 font-mono">Action Required</span>
            )}
          </div>

          <div className="space-y-2.5">
            {s.topDeficientSkills.length === 0 && (
              <p className="text-xs text-slate-400 p-3 rounded-2xl border border-slate-800 bg-slate-950/60">No skill deficits recorded yet.</p>
            )}
            {s.topDeficientSkills.map((item) => (
              <div key={item.competencyId} className="p-3.5 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{item.skill}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    item.urgency === 'Critical' ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>{item.urgency}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Affected Officers:</span>
                  <strong className="text-white font-bold">{item.affectedOfficers.toLocaleString()}</strong>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className={`h-full ${item.urgency === 'Critical' ? 'bg-red-500' : 'bg-amber-500'}`}
                    style={{ width: `${Math.min(100, (item.affectedOfficers / Math.max(assessed, 1)) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => alert(`Batch enrollment needs the iGOT Karmayogi API, which is not connected to this deployment yet.\n\n${withCritical} assessed officer(s) currently have a critical gap flagged — use "Export Officer Data (CSV)" to share the list with the iGOT team.`)}
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Trigger Mandatory iGOT Batch Enrollment</span>
          </button>
        </div>
      </div>

      {/* Officer tracking table */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl p-6 space-y-4 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-base">Officer Progress Tracking</h3>
            <span className="text-xs text-slate-400 font-mono">({visible.length})</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, email, employee ID"
                className="pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none w-64"
              />
            </div>
            <select
              value={divFilter}
              onChange={(e) => setDivFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="all">All divisions</option>
              {MOSPI_DIVISIONS.map((d) => <option key={d.id} value={d.id}>{d.id}</option>)}
            </select>
            <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer">
              <input type="checkbox" checked={showDemo} onChange={(e) => setShowDemo(e.target.checked)} />
              Show demo accounts
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-wide text-slate-400 border-b border-slate-800">
                <th className="py-2 pr-3 font-bold">Officer</th>
                <th className="py-2 pr-3 font-bold">Role / Division</th>
                <th className="py-2 pr-3 font-bold text-right">Index</th>
                <th className="py-2 pr-3 font-bold text-right">Critical gaps</th>
                <th className="py-2 pr-3 font-bold text-right">Diagnostic</th>
                <th className="py-2 pr-3 font-bold text-right">Quizzes (avg)</th>
                <th className="py-2 pr-3 font-bold text-right">Courses done/enrolled</th>
                <th className="py-2 font-bold">Last active</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((u) => (
                <tr key={u.id} onClick={() => setOpenId(u.id)} className="border-b border-slate-800/60 hover:bg-slate-800/40 cursor-pointer transition">
                  <td className="py-2.5 pr-3">
                    <div className="font-bold text-white flex items-center gap-2">
                      {u.name}
                      {u.demo && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">DEMO</span>}
                      {!u.demo && !u.scoresReady && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-700 text-slate-300">Not assessed</span>}
                    </div>
                    <div className="text-[11px] text-slate-400">{u.email}</div>
                  </td>
                  <td className="py-2.5 pr-3 text-slate-300">{u.designation} • {u.division}</td>
                  <td className="py-2.5 pr-3 text-right font-mono text-white">{pct(u.avgIndex)}</td>
                  <td className={`py-2.5 pr-3 text-right font-mono ${u.criticalGaps ? 'text-red-400 font-bold' : 'text-slate-300'}`}>{u.scoresReady ? u.criticalGaps : '—'}</td>
                  <td className="py-2.5 pr-3 text-right font-mono text-white">{pct(u.diagnosticPct)}</td>
                  <td className="py-2.5 pr-3 text-right font-mono text-white">{u.quizzesTaken}{u.quizzesTaken ? ` (${pct(u.avgQuizPct)})` : ''}</td>
                  <td className="py-2.5 pr-3 text-right font-mono text-white">{u.coursesCompleted}/{u.coursesEnrolled}</td>
                  <td className="py-2.5 text-slate-400">{fmtDate(u.lastActive)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && visible.length === 0 && (
            <p className="text-xs text-slate-400 py-8 text-center">
              {users.length === 0 ? 'No officers have registered yet. They will appear here as soon as they sign up and start using the platform.' : 'No officers match your filters.'}
            </p>
          )}
        </div>
      </div>

      {openId && <OfficerDetail id={openId} onClose={() => setOpenId(null)} />}
    </div>
  );
}
