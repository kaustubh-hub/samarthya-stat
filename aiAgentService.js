// Client for the Samarthya-Stat AI agent server (see /server).
// All LLM work happens server-side: the Gemini key never reaches the browser bundle.
// An OPTIONAL personal key (set via the key modal) is sent in a header to OUR server only,
// and is used only when the server has no GEMINI_API_KEY of its own.

const KEY_STORAGE = 'mospi_gemini_api_key';

export function getStoredApiKey() {
  try {
    return localStorage.getItem(KEY_STORAGE) || '';
  } catch {
    return '';
  }
}

export function setStoredApiKey(key) {
  try {
    if (key) localStorage.setItem(KEY_STORAGE, key.trim());
    else localStorage.removeItem(KEY_STORAGE);
  } catch (e) {
    console.warn('Failed to save API key:', e);
  }
}

// Latest agent run, shown by the "Prompt Inspector" for evaluators.
let lastAgentExecution = {
  timestamp: new Date().toISOString(),
  agentName: 'MoSPI Samarthya AI Agent Pipeline',
  model: 'Awaiting first run',
  systemPrompt: 'Run the resume agent (Step 1) to see the live system prompt here.',
  userPrompt: 'Ready for interactive execution',
  rawResponse: 'Ready to process resumes, generate quizzes, and recommend iGOT courses.',
  temperature: 0.2
};

export function getLastAgentExecution() {
  return lastAgentExecution;
}

function recordTrace(trace) {
  const steps = (Array.isArray(trace) ? trace : [trace]).filter(Boolean);
  const t = steps[steps.length - 1];
  if (!t) return;
  lastAgentExecution = {
    timestamp: t.timestamp || new Date().toISOString(),
    agentName: steps.length > 1 ? steps.map((s) => s.agent).join(' → ') : t.agent,
    model:
      t.source === 'gemini'
        ? `Google ${t.model} (live) • ${t.ms} ms`
        : `MoSPI heuristic engine (offline fallback) • ${t.ms} ms${t.note ? ` — ${t.note}` : ''}`,
    systemPrompt: t.systemPrompt || '',
    userPrompt: t.userPrompt || '',
    rawResponse: t.rawResponse || '(deterministic engine — no model response)',
    temperature: t.temperature ?? 0.2
  };
}

async function api(path, body) {
  const headers = { 'Content-Type': 'application/json' };
  const userKey = getStoredApiKey();
  if (userKey) headers['x-user-gemini-key'] = userKey;

  let res;
  try {
    res = await fetch(`/api${path}`, { method: 'POST', headers, body: JSON.stringify(body) });
  } catch {
    throw new Error('Cannot reach the AI agent server. Please check your connection and try again.');
  }
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON error page */
  }
  if (!res.ok) throw new Error(data?.error || `AI agent request failed (HTTP ${res.status})`);
  return data;
}

export async function getAiStatus() {
  try {
    const headers = {};
    const k = getStoredApiKey();
    if (k) headers['x-user-gemini-key'] = k;
    const res = await fetch('/api/health', { headers });
    return res.ok ? await res.json() : { ok: false, llm: false };
  } catch {
    return { ok: false, llm: false };
  }
}

/** Read a File as { filename, mimeType, base64 } for the server to parse. */
export function fileToPayload(file) {
  return new Promise((resolve, reject) => {
    const MAX = 8 * 1024 * 1024;
    if (file.size > MAX) return reject(new Error('File is too large (max 8 MB).'));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the selected file.'));
    reader.onload = () => {
      const base64 = String(reader.result).split(',')[1] || '';
      resolve({ filename: file.name, mimeType: file.type || '', base64 });
    };
    reader.readAsDataURL(file);
  });
}

/**
 * AGENT PIPELINE: resume (file or text) -> structured profile -> personalised diagnostic quiz.
 * Returns { profile, quiz, trace }.
 */
export async function runResumePipeline({ file, text }) {
  const body = file ? { file: await fileToPayload(file) } : { text };
  const data = await api('/agent/pipeline', body);
  recordTrace(data.trace);
  return data;
}

/** Document (upload or curated material id) -> 10-question quiz. Returns { quiz, trace }. */
export async function runDocumentQuiz({ file, materialId, title }) {
  const body = materialId ? { materialId, title } : { file: await fileToPayload(file), title };
  const data = await api('/agent/document-quiz', body);
  recordTrace(data.trace);
  return data;
}

/** Quiz result + resume profile -> iGOT course recommendations. */
export async function runPostQuizCourseAgent({ quizResult, resumeProfile }) {
  const data = await api('/agent/recommend', { quizResult, profile: resumeProfile });
  recordTrace(data.trace);
  return data;
}

/** Chat. Throws if the AI engine is unavailable so the caller can use its offline answers. */
export async function askChatAgent({ messages, profile }) {
  const data = await api('/agent/chat', { messages, profile });
  recordTrace(data.trace);
  return data.reply;
}
