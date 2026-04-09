import { useState, useEffect, useRef, useCallback } from "react";

// ── THEME ─────────────────────────────────────────────────────────────────────
const DEFAULT_COLORS = {
  bg: "#0A0B0F", surface: "#12141A", card: "#1A1D26", border: "#252836",
  accent: "#6C63FF", gold: "#FFD166", green: "#06D6A0", red: "#EF476F",
  blue: "#118AB2", text: "#E8E9F0", muted: "#6B7280",
};

const DEFAULT_SUBJECT_META = {
  math:        { bg: "#1A1F35", accent: "#6C63FF", icon: "📐", label: "Mathematics" },
  english:     { bg: "#1A2635", accent: "#118AB2", icon: "📖", label: "Language & Literature" },
  sciences:    { bg: "#1A3525", accent: "#06D6A0", icon: "🔬", label: "Integrated Sciences" },
  spanish:     { bg: "#352A1A", accent: "#FFD166", icon: "🌍", label: "Spanish" },
  individuals: { bg: "#351A2A", accent: "#EF476F", icon: "🌐", label: "Individuals & Societies" },
};

const MYP_GRADES = { 1:"MYP 1 (Grade 6)", 2:"MYP 2 (Grade 7)", 3:"MYP 3 (Grade 8)", 4:"MYP 4 (Grade 9)", 5:"MYP 5 (Grade 10)" };

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A0B0F; color: #E8E9F0; font-family: 'DM Sans', sans-serif; }
  h1,h2,h3 { font-family: 'Syne', sans-serif; }
  .btn { padding: 10px 20px; border-radius: 10px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 14px; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px; }
  .btn-primary { background: #6C63FF; color: white; }
  .btn-primary:hover { opacity: 0.85; transform: translateY(-1px); }
  .btn-secondary { background: #1A1D26; color: #E8E9F0; border: 1px solid #252836; }
  .btn-secondary:hover { border-color: #6C63FF; }
  .btn-success { background: #06D6A0; color: #0A0B0F; font-weight: 600; }
  .btn-warn { background: #FFD166; color: #0A0B0F; font-weight: 600; }
  .btn-danger { background: #EF476F; color: white; }
  .btn-tts { background: #1A1D26; color: #E8E9F0; border: 1px solid #252836; padding: 6px 12px; font-size: 12px; border-radius: 8px; }
  .btn-tts.speaking { border-color: #06D6A0; color: #06D6A0; animation: pulse-border 1s infinite; }
  .btn-tts.speaking:hover { opacity: 0.8; }
  @keyframes pulse-border { 0%,100%{border-color:#06D6A0}50%{border-color:#06D6A044} }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }
  .card { background: #1A1D26; border: 1px solid #252836; border-radius: 16px; padding: 24px; }
  textarea, input[type="text"], input[type="email"], input[type="password"] { width: 100%; background: #12141A; border: 1px solid #252836; border-radius: 10px; padding: 12px 16px; color: #E8E9F0; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; resize: vertical; transition: border-color 0.2s; }
  textarea:focus, input:focus { border-color: #6C63FF; }
  select { width: 100%; background: #12141A; border: 1px solid #252836; border-radius: 10px; padding: 10px 14px; color: #E8E9F0; font-size: 14px; outline: none; cursor: pointer; }
  .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; }
  .tab-row { display: flex; gap: 4px; background: #12141A; padding: 4px; border-radius: 12px; margin-bottom: 24px; flex-wrap: wrap; }
  .tab { padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; background: transparent; color: #6B7280; transition: all 0.2s; }
  .tab.active { background: #1A1D26; color: #E8E9F0; }
  .spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid #252836; border-top-color: #6C63FF; border-radius: 50%; animation: spin 0.8s linear infinite; flex-shrink: 0; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .fade-in { animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .timer { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 700; letter-spacing: 2px; }
  .timer-warn { color: #EF476F; animation: pulse 1s infinite; }
  @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
  .score-chip { padding: 4px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; }
  .feedback-box { background: #12141A; border-radius: 12px; padding: 20px; margin-top: 16px; border-left: 3px solid #6C63FF; }
  .feedback-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .figure-box { background: #0A0F0A; border: 2px dashed #06D6A033; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
  .image-box { border-radius: 14px; overflow: hidden; margin-bottom: 20px; position: relative; }
  .image-box img { width: 100%; max-height: 380px; object-fit: cover; display: block; }
  .image-label { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, #0A0B0Fee); padding: 16px; font-size: 13px; color: #E8E9F0; }
  .prep-box { background: #FFD16611; border: 1px solid #FFD16633; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
  .record-box { background: #EF476F11; border: 1px solid #EF476F33; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
  .note-card { background: #1A1D26; border: 1px solid #252836; border-radius: 12px; padding: 18px; margin-bottom: 12px; transition: border-color 0.2s; }
  .note-card:hover { border-color: #6C63FF44; }
  .custom-prompt-box { background: #6C63FF11; border: 1px solid #6C63FF33; border-radius: 12px; padding: 16px; margin-bottom: 20px; }
  .settings-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: #0A0B0Fcc; z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .settings-panel { background: #12141A; border: 1px solid #252836; border-radius: 20px; padding: 32px; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; }
  .upload-zone { border: 2px dashed #252836; border-radius: 12px; padding: 32px; text-align: center; cursor: pointer; transition: all 0.2s; }
  .upload-zone:hover, .upload-zone.active { border-color: #6C63FF; background: #6C63FF08; }
  .mic-btn { width: 64px; height: 64px; border-radius: 50%; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 28px; transition: all 0.2s; background: #1A1D26; border: 2px solid #252836; }
  .mic-btn.listening { background: #EF476F22; border-color: #EF476F; animation: mic-pulse 1s infinite; }
  @keyframes mic-pulse { 0%,100%{box-shadow:0 0 0 0 #EF476F44}50%{box-shadow:0 0 0 12px #EF476F00} }
  .transcript-box { background: #12141A; border: 1px solid #252836; border-radius: 10px; padding: 14px; min-height: 80px; font-size: 14px; line-height: 1.7; color: #E8E9F0; }
  .transcript-box.active { border-color: #EF476F; }
  .syllabus-banner { background: linear-gradient(135deg, #6C63FF22, #06D6A022); border: 1px solid #6C63FF33; border-radius: 12px; padding: 14px 18px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
  .subject-updating { opacity: 0.5; pointer-events: none; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-thumb { background: #252836; border-radius: 3px; }
`;

// ── STORAGE ───────────────────────────────────────────────────────────────────
function loadData(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } }
function saveData(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }

// ── AI ────────────────────────────────────────────────────────────────────────
async function callAI(system, user) {
  try {
    const res = await fetch("/api/chat", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system, user }),
    });
    const d = await res.json();
    return d.content?.[0]?.text || "";
  } catch { return "Error connecting to AI. Please try again."; }
}

// ── TEXT TO SPEECH ────────────────────────────────────────────────────────────
let currentUtterance = null;
function speakText(text, onEnd) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const clean = text.replace(/[*#_`>]/g, "").replace(/\n+/g, ". ").slice(0, 3000);
  const u = new SpeechSynthesisUtterance(clean);
  u.rate = 0.95; u.pitch = 1; u.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => v.lang === "en-GB" && v.name.includes("Female"))
    || voices.find(v => v.lang.startsWith("en"))
    || voices[0];
  if (preferred) u.voice = preferred;
  u.onend = () => { currentUtterance = null; onEnd?.(); };
  u.onerror = () => { currentUtterance = null; onEnd?.(); };
  currentUtterance = u;
  window.speechSynthesis.speak(u);
}
function stopSpeech() { window.speechSynthesis?.cancel(); currentUtterance = null; }

// TTS Button component
function TTSButton({ text }) {
  const [speaking, setSpeaking] = useState(false);
  function toggle() {
    if (speaking) { stopSpeech(); setSpeaking(false); }
    else { setSpeaking(true); speakText(text, () => setSpeaking(false)); }
  }
  useEffect(() => () => stopSpeech(), []);
  if (!text || !window.speechSynthesis) return null;
  return (
    <button className={`btn btn-tts ${speaking ? "speaking" : ""}`} onClick={toggle} title={speaking ? "Stop speaking" : "Read aloud"}>
      {speaking ? "⏹ Stop" : "🔊 Listen"}
    </button>
  );
}

// ── SPEECH RECOGNITION ────────────────────────────────────────────────────────
function useSpeechRecognition({ onTranscript, onFinal, continuous = true }) {
  const recogRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSupported(true);
      const r = new SpeechRecognition();
      r.continuous = continuous;
      r.interimResults = true;
      r.lang = "en-US";
      r.onresult = (e) => {
        let interim = "", final = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) final += e.results[i][0].transcript;
          else interim += e.results[i][0].transcript;
        }
        if (interim || final) onTranscript?.(interim, final);
        if (final) onFinal?.(final);
      };
      r.onend = () => setListening(false);
      r.onerror = () => setListening(false);
      recogRef.current = r;
    }
  }, []);

  function start(lang = "en-US") {
    if (!recogRef.current) return;
    recogRef.current.lang = lang;
    try { recogRef.current.start(); setListening(true); } catch {}
  }
  function stop() {
    try { recogRef.current?.stop(); } catch {}
    setListening(false);
  }
  return { listening, supported, start, stop };
}

// Mic Button component
function MicButton({ onTranscript, onFinal, lang = "en-US", size = 64 }) {
  const [transcript, setTranscript] = useState("");
  const { listening, supported, start, stop } = useSpeechRecognition({
    onTranscript: (interim, final) => setTranscript(prev => prev + (final || "")),
    onFinal,
    continuous: true,
  });

  if (!supported) return <div style={{ fontSize: 12, color: "#6B7280", padding: 8 }}>⚠️ Speech recognition not supported in this browser. Try Chrome or Edge.</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <button className={`mic-btn ${listening ? "listening" : ""}`} style={{ width: size, height: size, fontSize: size * 0.4 }}
        onClick={() => listening ? stop() : start(lang)}>
        🎤
      </button>
      <div style={{ fontSize: 12, color: listening ? "#EF476F" : "#6B7280", fontWeight: 600 }}>
        {listening ? "🔴 Listening... (click to stop)" : "Click to speak"}
      </div>
    </div>
  );
}

// ── SYLLABUS SYSTEM ───────────────────────────────────────────────────────────
// This parses an uploaded syllabus and creates custom subject configs
async function parseSyllabus(text, grade) {
  const result = await callAI(
    `You are an IB MYP curriculum expert. Analyse this syllabus/curriculum document and extract structured information.

Return a JSON object with this EXACT structure (no markdown, no backticks, pure JSON only):
{
  "subjects": [
    {
      "id": "unique_id_no_spaces",
      "label": "Subject Name",
      "icon": "single emoji",
      "description": "brief description",
      "criteria": "e.g. A · B · C",
      "accentColor": "#hexcolor",
      "bgColor": "#dark hex color",
      "topics": ["topic 1", "topic 2", "topic 3", "...up to 12 topics"],
      "units": ["unit 1", "unit 2"],
      "keyVocabulary": ["word1", "word2", "word3"]
    }
  ],
  "schoolName": "school name if found or empty string",
  "academicYear": "year if found or empty string",
  "gradeLevel": "grade level if found or empty string"
}

Rules:
- Extract ALL subjects mentioned in the document
- For each subject, identify all topics, units, and key vocabulary
- Choose appropriate emojis for each subject
- Use dark background colors (#1A1F35 style) for bgColor
- Use vibrant accent colors for accentColor
- If multiple subjects found, include all of them
- topics array must have at least 5 items per subject`,
    `Syllabus content (MYP ${grade}):\n${text.slice(0, 4000)}`
  );

  try {
    const clean = result.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return null;
  }
}

// ── UI HELPERS ────────────────────────────────────────────────────────────────
function Spinner() { return <span className="spinner" />; }

function FeedbackBox({ text }) {
  if (!text) return null;
  return (
    <div className="feedback-box fade-in">
      <div className="feedback-header">
        <div style={{ fontSize: 11, color: "#6C63FF", fontWeight: 700, letterSpacing: 1 }}>AI FEEDBACK</div>
        <TTSButton text={text} />
      </div>
      <div style={{ lineHeight: 1.75, whiteSpace: "pre-wrap", fontSize: 14 }}>{text}</div>
    </div>
  );
}

function ScoreChip({ score }) {
  return <span className="score-chip" style={{ background: score >= 6 ? "#06D6A022" : "#EF476F22", color: score >= 6 ? "#06D6A0" : "#EF476F", fontSize: 15 }}>{score}/8</span>;
}

function TimerComp({ seconds, onEnd }) {
  const [rem, setRem] = useState(seconds);
  useEffect(() => {
    const t = setInterval(() => setRem(p => { if (p <= 1) { clearInterval(t); onEnd?.(); return 0; } return p - 1; }), 1000);
    return () => clearInterval(t);
  }, []);
  const d = `${String(Math.floor(rem / 60)).padStart(2, "0")}:${String(rem % 60).padStart(2, "0")}`;
  return <span className={`timer ${rem < 300 ? "timer-warn" : ""}`}>{d}</span>;
}

function CountdownTimer({ seconds, label, color = "#FFD166", onEnd }) {
  const [rem, setRem] = useState(seconds); const [done, setDone] = useState(false);
  useEffect(() => { const t = setInterval(() => setRem(p => { if (p <= 1) { clearInterval(t); setDone(true); onEnd?.(); return 0; } return p - 1; }), 1000); return () => clearInterval(t); }, []);
  const d = `${String(Math.floor(rem / 60)).padStart(2, "0")}:${String(rem % 60).padStart(2, "0")}`;
  return <div style={{ textAlign: "center", padding: "10px 18px", background: color + "11", border: `1px solid ${color}33`, borderRadius: 10 }}><div style={{ fontSize: 10, color, fontWeight: 700, letterSpacing: 1, marginBottom: 2 }}>{label}</div><div style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, color: done ? "#EF476F" : color }}>{done ? "TIME'S UP!" : d}</div></div>;
}

function ImageDisplay({ url, title, caption }) {
  const [err, setErr] = useState(false);
  if (err) return <div style={{ background: "#12141A", borderRadius: 14, padding: 32, marginBottom: 20, textAlign: "center", border: "1px solid #252836" }}><div style={{ fontSize: 48, marginBottom: 12 }}>🖼️</div><div style={{ fontWeight: 600 }}>{title}</div>{caption && <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>{caption}</div>}</div>;
  return <div className="image-box"><img src={url} alt={title} onError={() => setErr(true)} /><div className="image-label"><div style={{ fontWeight: 600 }}>{title}</div>{caption && <div style={{ fontSize: 12, color: "#B0B8C8" }}>{caption}</div>}</div></div>;
}

function MathFigure({ figureText }) {
  if (!figureText) return null;
  return <div className="figure-box"><div style={{ fontSize: 11, color: "#06D6A0", fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>📐 REFERENCE FIGURE</div><pre style={{ whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.8, color: "#06D6A0", fontFamily: "monospace" }}>{figureText}</pre></div>;
}

// Syllabus active banner shown on subject pages
function SyllabusBanner({ syllabusData, subjectId }) {
  if (!syllabusData) return null;
  const sub = syllabusData.subjects?.find(s => s.id === subjectId);
  if (!sub) return null;
  return (
    <div className="syllabus-banner">
      <div>
        <div style={{ fontSize: 11, color: "#6C63FF", fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>📄 SYLLABUS ACTIVE</div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{sub.label} — {sub.topics.length} topics loaded from your syllabus</div>
        {syllabusData.schoolName && <div style={{ fontSize: 12, color: "#6B7280" }}>{syllabusData.schoolName}</div>}
      </div>
      <span className="badge" style={{ background: "#06D6A022", color: "#06D6A0", flexShrink: 0 }}>✓ Custom</span>
    </div>
  );
}

// Custom prompt box shown on every subject page
function CustomPromptBox({ subject, grade }) {
  const [prompt, setPrompt] = useState(""); const [result, setResult] = useState(""); const [load, setLoad] = useState(false);
  async function ask() {
    if (!prompt.trim()) return;
    setLoad(true); setResult("");
    const r = await callAI(`You are an IB MYP ${grade} ${subject} teacher/tutor. Answer the student's question. If they ask for a question, generate one. Be concise and educational.`, prompt);
    setResult(r); setLoad(false);
  }
  return (
    <div className="custom-prompt-box">
      <div style={{ fontSize: 12, color: "#6C63FF", fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>💬 ASK AI ANYTHING</div>
      <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>e.g. "Give me a harder question" · "Explain this topic simply" · "What should I revise?"</div>
      <textarea rows={2} placeholder="Type your request..." value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), ask())} style={{ marginBottom: 8 }} />
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button className="btn btn-primary" onClick={ask} disabled={load || !prompt.trim()}>{load ? <><Spinner /> Thinking...</> : "Ask →"}</button>
        {result && <TTSButton text={result} />}
      </div>
      {result && <div style={{ marginTop: 12, background: "#12141A", borderRadius: 10, padding: 16, fontSize: 14, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{result}</div>}
    </div>
  );
}

// ── NOTES ─────────────────────────────────────────────────────────────────────
function NotesSection({ subject }) {
  const [notes, setNotes] = useState(() => loadData(`notes_${subject}`, []));
  const [editing, setEditing] = useState(null);
  const [editTitle, setEditTitle] = useState(""); const [editContent, setEditContent] = useState("");
  const [aiLoad, setAiLoad] = useState(false);

  function saveNotes(updated) { setNotes(updated); saveData(`notes_${subject}`, updated); }
  function startNew() { setEditing("new"); setEditTitle(""); setEditContent(""); }
  function startEdit(note) { setEditing(note.id); setEditTitle(note.title); setEditContent(note.content); }
  function saveNote() {
    if (!editTitle.trim() && !editContent.trim()) { setEditing(null); return; }
    if (editing === "new") saveNotes([{ id: Date.now(), title: editTitle || "Untitled", content: editContent, createdAt: new Date().toLocaleDateString() }, ...notes]);
    else saveNotes(notes.map(n => n.id === editing ? { ...n, title: editTitle || "Untitled", content: editContent } : n));
    setEditing(null);
  }
  async function enhanceWithAI() {
    if (!editContent.trim()) return;
    setAiLoad(true);
    const enhanced = await callAI(`IB MYP study helper. Enhance these student notes by fixing errors, adding key definitions, adding 2-3 exam tips, suggesting IB criteria connections. Return enhanced notes only.`, `Subject: ${subject}\nNotes:\n${editContent}`);
    setEditContent(prev => prev + "\n\n--- AI ENHANCEMENTS ---\n" + enhanced);
    setAiLoad(false);
  }
  function exportAll() {
    const text = notes.map(n => `# ${n.title}\n${n.createdAt}\n\n${n.content}`).join("\n\n---\n\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" })); a.download = `${subject}-notes.txt`; a.click();
  }
  function copyForGoogleDocs() {
    const text = notes.map(n => `${n.title}\n${"=".repeat(n.title.length)}\n\n${n.content}`).join("\n\n---\n\n");
    navigator.clipboard.writeText(text).then(() => alert("✅ Copied! Open Google Docs and press Ctrl+V to paste."));
  }

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700 }}>📓 My Notes</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {notes.length > 0 && <><button className="btn btn-secondary" onClick={copyForGoogleDocs} style={{ fontSize: 12, padding: "7px 12px" }}>📋 Copy for Google Docs</button><button className="btn btn-secondary" onClick={exportAll} style={{ fontSize: 12, padding: "7px 12px" }}>⬇️ Export</button></>}
          <button className="btn btn-primary" onClick={startNew}>+ New Note</button>
        </div>
      </div>
      {editing !== null && (
        <div className="card fade-in" style={{ marginBottom: 20, border: "1px solid #6C63FF44" }}>
          <input type="text" placeholder="Note title..." value={editTitle} onChange={e => setEditTitle(e.target.value)} style={{ marginBottom: 12, fontWeight: 600, fontSize: 15 }} />
          <textarea rows={10} placeholder="Write your notes here..." value={editContent} onChange={e => setEditContent(e.target.value)} style={{ marginBottom: 12 }} />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="btn btn-success" onClick={saveNote}>💾 Save</button>
            <button className="btn btn-secondary" onClick={enhanceWithAI} disabled={aiLoad}>{aiLoad ? <><Spinner /> Enhancing...</> : "✨ Enhance with AI"}</button>
            <button className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
      )}
      {notes.length === 0 && editing === null && <div style={{ textAlign: "center", padding: "48px 0", color: "#6B7280" }}><div style={{ fontSize: 48, marginBottom: 12 }}>📭</div><div style={{ fontWeight: 600, marginBottom: 6 }}>No notes yet</div><div style={{ fontSize: 13 }}>Click "+ New Note" to start</div></div>}
      {notes.map(note => (
        <div key={note.id} className="note-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div><div style={{ fontWeight: 600, fontSize: 15 }}>{note.title}</div><div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>{note.createdAt}</div></div>
            <div style={{ display: "flex", gap: 6 }}>
              <TTSButton text={note.content} />
              <button className="btn btn-secondary" onClick={() => startEdit(note)} style={{ padding: "5px 10px", fontSize: 12 }}>✏️</button>
              <button className="btn btn-danger" onClick={() => saveNotes(notes.filter(n => n.id !== note.id))} style={{ padding: "5px 10px", fontSize: 12 }}>🗑️</button>
            </div>
          </div>
          <div style={{ fontSize: 13, color: "#B0B8C8", lineHeight: 1.7, whiteSpace: "pre-wrap", maxHeight: 100, overflow: "hidden" }}>{note.content}</div>
          {note.content.length > 200 && <div style={{ fontSize: 12, color: "#6C63FF", marginTop: 6, cursor: "pointer" }} onClick={() => startEdit(note)}>Read more...</div>}
        </div>
      ))}
    </div>
  );
}

// ── SMART SYLLABUS UPLOAD ─────────────────────────────────────────────────────
function SyllabusUpload({ onSyllabusLoaded, syllabusData, grade }) {
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [studyPlan, setStudyPlan] = useState(null);
  const [planLoad, setPlanLoad] = useState(false);
  const [customQ, setCustomQ] = useState(""); const [qResult, setQResult] = useState(""); const [qLoad, setQLoad] = useState(false);
  const fileRef = useRef();

  function handleFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => { setText(e.target.result); setName(file.name); setError(""); };
    reader.readAsText(file);
  }

  async function processSyllabus() {
    if (!text.trim()) return;
    setParsing(true); setError("");
    const parsed = await parseSyllabus(text, grade);
    if (!parsed || !parsed.subjects || parsed.subjects.length === 0) {
      setError("Could not parse subjects from this document. Try pasting the text directly or using a cleaner .txt file.");
      setParsing(false); return;
    }
    onSyllabusLoaded({ ...parsed, rawText: text, fileName: name });
    setParsing(false);
  }

  async function generatePlan() {
    if (!text.trim()) return;
    setPlanLoad(true); setStudyPlan(null);
    const plan = await callAI(
      `You are an IB MYP ${grade} study planner. Analyse this syllabus and create a detailed study plan including: KEY TOPICS, IMPORTANT CONCEPTS, LIKELY EXAM QUESTIONS (5-8), STUDY TIPS, REVISION SCHEDULE suggestion. Format clearly.`,
      `Syllabus:\n${text.slice(0, 3500)}`
    );
    setStudyPlan(plan); setPlanLoad(false);
  }

  async function askAbout() {
    if (!customQ.trim() || !text.trim()) return;
    setQLoad(true); setQResult("");
    const r = await callAI(`IB MYP ${grade} tutor. Answer the student's question based on their syllabus content.`, `Syllabus:\n${text.slice(0, 2000)}\n\nQuestion: ${customQ}`);
    setQResult(r); setQLoad(false);
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>📄 Smart Syllabus Upload</h3>
        <p style={{ fontSize: 13, color: "#6B7280" }}>Upload your syllabus and the app will automatically update <strong style={{ color: "#E8E9F0" }}>all subject cards, topics, and practice questions</strong> to match your curriculum.</p>
      </div>

      {syllabusData ? (
        <div>
          <div style={{ background: "#06D6A011", border: "1px solid #06D6A033", borderRadius: 14, padding: 20, marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: "#06D6A0", fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>✅ SYLLABUS ACTIVE</div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{syllabusData.fileName || "Uploaded syllabus"}</div>
                <div style={{ fontSize: 13, color: "#6B7280" }}>{syllabusData.subjects?.length} subjects detected · {syllabusData.schoolName || ""} {syllabusData.gradeLevel || ""}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                  {syllabusData.subjects?.map(s => <span key={s.id} className="badge" style={{ background: s.accentColor + "22", color: s.accentColor }}>{s.icon} {s.label}</span>)}
                </div>
              </div>
              <button className="btn btn-danger" onClick={() => onSyllabusLoaded(null)} style={{ fontSize: 12, padding: "7px 14px" }}>🗑️ Remove</button>
            </div>
          </div>
          {syllabusData.rawText && (
            <div>
              <button className="btn btn-primary" onClick={generatePlan} disabled={planLoad} style={{ marginBottom: 16, marginRight: 10 }}>{planLoad ? <><Spinner /> Generating...</> : "🧠 Generate Study Plan"}</button>
              {studyPlan && <div className="card fade-in" style={{ marginBottom: 20 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><h4 style={{ fontWeight: 700 }}>📋 Study Plan</h4><div style={{ display: "flex", gap: 8 }}><TTSButton text={studyPlan} /><button className="btn btn-secondary" style={{ fontSize: 12, padding: "6px 12px" }} onClick={() => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([studyPlan], { type: "text/plain" })); a.download = "study-plan.txt"; a.click(); }}>⬇️ Download</button></div></div><div style={{ whiteSpace: "pre-wrap", lineHeight: 1.85, fontSize: 14 }}>{studyPlan}</div></div>}
              <div className="custom-prompt-box">
                <div style={{ fontSize: 12, color: "#6C63FF", fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>❓ ASK ABOUT YOUR SYLLABUS</div>
                <textarea rows={2} placeholder='e.g. "Generate 5 exam questions from my syllabus" · "What topics should I focus on?"' value={customQ} onChange={e => setCustomQ(e.target.value)} style={{ marginBottom: 8 }} />
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button className="btn btn-primary" onClick={askAbout} disabled={qLoad || !customQ.trim()}>{qLoad ? <><Spinner /> Thinking...</> : "Ask →"}</button>
                  {qResult && <TTSButton text={qResult} />}
                </div>
                {qResult && <div style={{ marginTop: 12, background: "#12141A", borderRadius: 10, padding: 16, fontSize: 14, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{qResult}</div>}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          {!text ? (
            <div className={`upload-zone ${dragging ? "active" : ""}`}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => fileRef.current?.click()}>
              <input ref={fileRef} type="file" accept=".txt,.md,.csv" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
              <div style={{ fontSize: 48, marginBottom: 12 }}>📁</div>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Drop your syllabus file here or click to browse</div>
              <div style={{ fontSize: 13, color: "#6B7280" }}>Supports .txt, .md files only</div>
            </div>
          ) : (
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div><div style={{ fontWeight: 600, color: "#06D6A0" }}>✅ {name || "Pasted text"}</div><div style={{ fontSize: 12, color: "#6B7280" }}>{text.length} characters</div></div>
                <button className="btn btn-secondary" onClick={() => { setText(""); setName(""); }} style={{ fontSize: 12, padding: "6px 10px" }}>✕ Clear</button>
              </div>
            </div>
          )}

          <div style={{ marginTop: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>Or paste your syllabus text directly:</div>
            <textarea rows={6} placeholder="Paste your syllabus, class notes, or curriculum content here..." value={text} onChange={e => { setText(e.target.value); setName("Pasted text"); }} />
          </div>

          {error && <div style={{ background: "#EF476F11", border: "1px solid #EF476F33", borderRadius: 10, padding: 12, fontSize: 13, color: "#EF476F", marginBottom: 12 }}>{error}</div>}

          {text && (
            <button className="btn btn-primary" onClick={processSyllabus} disabled={parsing} style={{ fontSize: 15, padding: "13px 28px" }}>
              {parsing ? <><Spinner /> Analysing & updating all subjects...</> : "⚡ Process Syllabus — Update All Subjects"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── GENERIC PRACTICE ENGINE ───────────────────────────────────────────────────
function PracticeEngine({ topics, systemPrompt, evalPrompt, placeholder, answerRows = 6, grade, difficulty }) {
  const [topic, setTopic] = useState("random");
  const [q, setQ] = useState(null); const [ans, setAns] = useState(""); const [fb, setFb] = useState(null);
  const [load, setLoad] = useState(false); const [score, setScore] = useState(null);

  const diffNote = difficulty === "easy" ? "Include hints and step guidance." : difficulty === "hard" ? "Exam conditions, no hints, challenging." : "Standard difficulty.";

  async function gen() {
    setLoad(true); setFb(null); setAns(""); setScore(null);
    const t = topic === "random" ? topics[Math.floor(Math.random() * topics.length)] : topic;
    setQ(await callAI(systemPrompt + ` MYP ${grade}. ${diffNote}`, `Topic: ${t}`));
    setLoad(false);
  }
  async function submit() {
    if (!ans.trim()) return;
    setLoad(true);
    const r = await callAI(evalPrompt, `Question:\n${q}\n\nStudent Answer:\n${ans}`);
    setFb(r);
    const s = parseInt(r.match(/SCORE:\s*(\d)/)?.[1] || "0");
    setScore(s);
    setLoad(false);
  }

  return (
    <div className="fade-in">
      {topics.length > 1 && <div style={{ marginBottom: 16 }}><select value={topic} onChange={e => setTopic(e.target.value)}><option value="random">🎲 Random Topic</option>{topics.map((t, i) => <option key={i} value={t}>{t.slice(0, 65)}</option>)}</select></div>}
      <button className="btn btn-primary" onClick={gen} disabled={load} style={{ marginBottom: 24 }}>{load ? <><Spinner /> Generating...</> : "⚡ Generate Question"}</button>
      {q && (
        <div className="card fade-in">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.85, fontSize: 14, flex: 1 }}>{q}</div>
            <TTSButton text={q} />
          </div>
          <textarea rows={answerRows} placeholder={placeholder || "Write your answer here..."} value={ans} onChange={e => setAns(e.target.value)} />
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button className="btn btn-success" onClick={submit} disabled={load || !ans.trim()}>{load ? <><Spinner /> Evaluating...</> : "✓ Submit"}</button>
            <button className="btn btn-secondary" onClick={gen} disabled={load}>Next →</button>
          </div>
          {score != null && <div style={{ marginTop: 12 }}><ScoreChip score={score} /></div>}
          <FeedbackBox text={fb} />
        </div>
      )}
    </div>
  );
}

// ── SPANISH SPEAKING — FULL ORAL WITH SPEECH RECOGNITION ─────────────────────
const SPANISH_IMAGES = [
  { url: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&q=80", title: "Contaminación del aire", topic: "contaminación", keywords: "contaminación, smog, fábricas, chimeneas, humo" },
  { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", title: "Bosque tropical", topic: "medio ambiente", keywords: "bosque, naturaleza, árboles, selva, biodiversidad" },
  { url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80", title: "Tormenta", topic: "el tiempo", keywords: "tormenta, lluvia, relámpago, nubes, viento" },
  { url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80", title: "Basura plástica", topic: "contaminación", keywords: "basura, plástico, reciclaje, océano" },
  { url: "https://images.unsplash.com/photo-1542601906897-ecd4d0f5be14?w=800&q=80", title: "Energía solar", topic: "medio ambiente", keywords: "energía solar, paneles, renovable, sostenible" },
  { url: "https://images.unsplash.com/photo-1565034946487-077786996e27?w=800&q=80", title: "Nieve e invierno", topic: "el tiempo", keywords: "nieve, invierno, frío, montañas, hielo" },
];

function SpanishSpeaking({ onScore, grade }) {
  const [phase, setPhase] = useState("idle");
  const [image, setImage] = useState(null);
  const [notes, setNotes] = useState("");
  const [speechText, setSpeechText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [followups, setFollowups] = useState([]);
  const [followupTexts, setFollowupTexts] = useState({});
  const [followupInterim, setFollowupInterim] = useState("");
  const [activeFollowup, setActiveFollowup] = useState(null);
  const [fb, setFb] = useState(null);
  const [load, setLoad] = useState(false);
  const [score, setScore] = useState(null);
  const [useVoice, setUseVoice] = useState(true);

  // Speech recognition for main speech
  const mainRecog = useSpeechRecognition({
    onTranscript: (interim, final) => {
      if (final) setSpeechText(prev => prev + " " + final);
      setInterimText(interim);
    },
    onFinal: () => {},
    continuous: true,
  });

  // Speech recognition for follow-up answers
  const followupRecog = useSpeechRecognition({
    onTranscript: (interim, final) => {
      if (final && activeFollowup !== null) setFollowupTexts(prev => ({ ...prev, [activeFollowup]: (prev[activeFollowup] || "") + " " + final }));
      setFollowupInterim(interim);
    },
    onFinal: () => {},
    continuous: true,
  });

  function startSession() {
    const img = SPANISH_IMAGES[Math.floor(Math.random() * SPANISH_IMAGES.length)];
    setImage(img); setNotes(""); setSpeechText(""); setInterimText(""); setFollowups([]); setFollowupTexts({}); setFb(null); setScore(null); setActiveFollowup(null);
    setPhase("prep");
  }

  async function submitSpeech() {
    const fullSpeech = speechText.trim();
    if (!fullSpeech && !Object.keys(followupTexts).length) return;
    setLoad(true);
    const fqs = await callAI(
      `IB MYP${grade} Spanish oral exam teacher. Student spoke about image: ${image.title} (topic: ${image.topic}). Generate EXACTLY 3 follow-up questions in Spanish at A1-A2 level.\nFormat:\nPREGUNTA 1: [question]\nPREGUNTA 2: [question]\nPREGUNTA 3: [question]`,
      `Speech: ${fullSpeech}`
    );
    const q1 = fqs.match(/PREGUNTA 1:\s*(.+)/)?.[1] || "¿Qué ves en la imagen?";
    const q2 = fqs.match(/PREGUNTA 2:\s*(.+)/)?.[1] || "¿Qué piensas sobre este problema?";
    const q3 = fqs.match(/PREGUNTA 3:\s*(.+)/)?.[1] || "¿Cómo puedes ayudar?";
    setFollowups([q1, q2, q3]);
    setLoad(false); setPhase("followup");
    // Read questions aloud
    setTimeout(() => speakText(`Pregunta uno: ${q1}`, () => {}), 500);
  }

  async function submitAll() {
    setLoad(true);
    const answersStr = followups.map((q, i) => `Q: ${q}\nA: ${followupTexts[i] || "(no answer)"}`).join("\n\n");
    const r = await callAI(
      `IB MYP${grade} Spanish Criterion C (Speaking) examiner. A1-A2. Score out of 8.
Format:
SCORE: X/8
CRITERION C BREAKDOWN:
- Message clarity (i): X/2
- Vocabulary range (ii): X/2
- Grammar accuracy (iii): X/2
- Interactive competence (iv): X/2
FEEDBACK: [in English, encouraging and specific]
STRENGTHS: [2-3 things done well]
IMPROVEMENTS: [2-3 with examples in Spanish]
FOLLOW-UP FEEDBACK: [comment on each follow-up answer]`,
      `Image: ${image.title} (${image.keywords})\n\nMain Speech:\n${speechText}\n\nFollow-up Q&A:\n${answersStr}`
    );
    setFb(r);
    const s = parseInt(r.match(/SCORE:\s*(\d)/)?.[1] || "0");
    setScore(s); onScore?.(s);
    setPhase("results"); setLoad(false);
  }

  const speechWc = speechText.trim() ? speechText.trim().split(/\s+/).length : 0;

  if (phase === "idle") return (
    <div className="card fade-in" style={{ textAlign: "center", padding: 48 }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>🎤</div>
      <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Spanish Oral Exam Simulation</h3>
      <div style={{ color: "#6B7280", marginBottom: 20, lineHeight: 1.9, textAlign: "left", background: "#12141A", borderRadius: 12, padding: 20 }}>
        <strong style={{ color: "#FFD166" }}>How it works:</strong><br />
        1️⃣ You get a random image (weather / environment)<br />
        2️⃣ 10 minutes preparation time<br />
        3️⃣ <strong style={{ color: "#E8E9F0" }}>Speak for 2-3 minutes</strong> — use your mic or type<br />
        4️⃣ AI generates 3 follow-up questions (read aloud to you)<br />
        5️⃣ Answer by speaking or typing — AI evaluates everything<br />
        6️⃣ Full IB Criterion C score + feedback
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
        <button className={`btn ${useVoice ? "btn-primary" : "btn-secondary"}`} onClick={() => setUseVoice(true)}>🎤 Use Microphone</button>
        <button className={`btn ${!useVoice ? "btn-primary" : "btn-secondary"}`} onClick={() => setUseVoice(false)}>⌨️ Type Instead</button>
      </div>
      <button className="btn btn-warn" onClick={startSession} style={{ fontSize: 16, padding: "14px 32px" }}>🎲 Get Random Image & Begin</button>
    </div>
  );

  if (phase === "prep") return (
    <div className="fade-in">
      <ImageDisplay url={image.url} title={image.title} caption={`Tema: ${image.topic} · Keywords: ${image.keywords}`} />
      <div className="prep-box">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div><div style={{ fontWeight: 700, color: "#FFD166", fontSize: 15 }}>⏱ Preparation Time — 10 minutes</div><div style={{ fontSize: 13, color: "#6B7280" }}>Take notes below. Plan what you'll say.</div></div>
          <CountdownTimer seconds={600} label="PREP TIME" color="#FFD166" />
        </div>
      </div>
      <div style={{ background: "#12141A", borderRadius: 10, padding: 14, marginBottom: 14, fontSize: 13, color: "#6B7280", lineHeight: 1.8 }}>
        <strong style={{ color: "#E8E9F0" }}>What to say:</strong><br />
        · Describe what you see: <em style={{ color: "#FFD166" }}>En la imagen veo...</em><br />
        · Explain the problem: <em style={{ color: "#FFD166" }}>El problema es... porque...</em><br />
        · Give your opinion: <em style={{ color: "#FFD166" }}>Creo que... / En mi opinión...</em><br />
        · Suggest solutions: <em style={{ color: "#FFD166" }}>Debemos... / Podemos... / Es importante...</em>
      </div>
      <div className="card" style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 8 }}>📝 PREPARATION NOTES (not marked)</label>
        <textarea rows={5} placeholder="Plan your speech here..." value={notes} onChange={e => setNotes(e.target.value)} />
      </div>
      <button className="btn btn-primary" onClick={() => setPhase("speak")} style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 15 }}>I'm Ready — Start Speaking →</button>
    </div>
  );

  if (phase === "speak") return (
    <div className="fade-in">
      <ImageDisplay url={image.url} title={image.title} caption="Refer to this image in your speech" />
      <div className="record-box">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div><div style={{ fontWeight: 700, color: "#EF476F", fontSize: 15 }}>🎤 Speaking Time — 2-3 minutes</div><div style={{ fontSize: 13, color: "#6B7280" }}>Aim for 150-250 words in Spanish</div></div>
          <CountdownTimer seconds={180} label="SPEAKING TIME" color="#EF476F" />
        </div>
      </div>

      {useVoice && mainRecog.supported ? (
        <div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <MicButton lang="es-ES"
              onFinal={text => setSpeechText(prev => prev + " " + text)}
              onTranscript={(interim) => setInterimText(interim)} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <button className={`btn ${mainRecog.listening ? "btn-danger" : "btn-primary"}`} style={{ width: "100%", justifyContent: "center" }}
              onClick={() => mainRecog.listening ? mainRecog.stop() : mainRecog.start("es-ES")}>
              {mainRecog.listening ? "⏹ Stop Recording" : "🎤 Start Recording"}
            </button>
          </div>
          <div className={`transcript-box ${mainRecog.listening ? "active" : ""}`} style={{ marginBottom: 8 }}>
            {speechText || <span style={{ color: "#6B7280" }}>Your speech will appear here as you speak...</span>}
            {interimText && <span style={{ color: "#6B7280", fontStyle: "italic" }}> {interimText}</span>}
          </div>
          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>Words: {speechWc}</div>
          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 16 }}>💡 Tip: You can also edit your transcript below if needed.</div>
          <textarea rows={4} placeholder="Edit your transcript here if needed..." value={speechText} onChange={e => setSpeechText(e.target.value)} style={{ marginBottom: 8 }} />
        </div>
      ) : (
        <div>
          <textarea rows={10} placeholder="Habla sobre la imagen en español...\n\nEjemplo:\nEn la imagen puedo ver... Creo que este problema es importante porque... En mi opinión, debemos..." value={speechText} onChange={e => setSpeechText(e.target.value)} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 16 }}>Palabras: {speechWc} (objetivo: 150-250)</div>
        </div>
      )}

      <button className="btn btn-success" onClick={submitSpeech} disabled={load || speechWc < 10} style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 15 }}>
        {load ? <><Spinner /> Generating follow-up questions...</> : "✓ Done — Get Follow-Up Questions →"}
      </button>
    </div>
  );

  if (phase === "followup") return (
    <div className="fade-in">
      <div style={{ background: "#6C63FF11", border: "1px solid #6C63FF33", borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><div style={{ fontWeight: 700, color: "#6C63FF", marginBottom: 4, fontSize: 15 }}>💬 Teacher Follow-Up Questions</div><div style={{ fontSize: 13, color: "#6B7280" }}>Answer each in Spanish. Use your mic or type.</div></div>
        </div>
      </div>
      {followups.map((q, i) => (
        <div key={i} className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <div style={{ fontWeight: 600, color: "#FFD166", fontSize: 15, flex: 1 }}>{i + 1}. {q}</div>
            <TTSButton text={q} />
          </div>
          {useVoice && followupRecog.supported ? (
            <div>
              <button className={`btn ${followupRecog.listening && activeFollowup === i ? "btn-danger" : "btn-secondary"}`} style={{ marginBottom: 8, fontSize: 12 }}
                onClick={() => {
                  if (followupRecog.listening && activeFollowup === i) { followupRecog.stop(); setActiveFollowup(null); }
                  else { setActiveFollowup(i); followupRecog.start("es-ES"); }
                }}>
                {followupRecog.listening && activeFollowup === i ? "⏹ Stop" : "🎤 Speak Answer"}
              </button>
              <div className={`transcript-box ${followupRecog.listening && activeFollowup === i ? "active" : ""}`} style={{ marginBottom: 6, minHeight: 50 }}>
                {followupTexts[i] || <span style={{ color: "#6B7280" }}>Your answer will appear here...</span>}
                {followupRecog.listening && activeFollowup === i && followupInterim && <span style={{ color: "#6B7280", fontStyle: "italic" }}> {followupInterim}</span>}
              </div>
            </div>
          ) : null}
          <textarea rows={3} placeholder="Tu respuesta en español..." value={followupTexts[i] || ""} onChange={e => setFollowupTexts(p => ({ ...p, [i]: e.target.value }))} />
        </div>
      ))}
      <button className="btn btn-success" onClick={submitAll} disabled={load} style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 15 }}>
        {load ? <><Spinner /> Evaluating full performance...</> : "✓ Submit — Get Full Score & Feedback"}
      </button>
    </div>
  );

  if (phase === "results") return (
    <div className="fade-in">
      <div className="card" style={{ textAlign: "center", marginBottom: 24, padding: 36 }}>
        <div style={{ fontSize: 44, marginBottom: 10 }}>{score >= 6 ? "🏆" : score >= 4 ? "📈" : "💪"}</div>
        <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Oral Exam Complete!</h3>
        <div style={{ fontSize: 44, fontWeight: 800, color: score >= 6 ? "#06D6A0" : "#EF476F", margin: "10px 0" }}>{score}/8</div>
        <p style={{ color: "#6B7280", marginBottom: 20 }}>Criterion C – Speaking</p>
        <button className="btn btn-warn" onClick={() => { setPhase("idle"); setImage(null); }} style={{ fontSize: 15, padding: "12px 28px" }}>🎲 Try New Image</button>
      </div>
      {image && <ImageDisplay url={image.url} title={image.title} caption="The image you spoke about" />}
      <FeedbackBox text={fb} />
    </div>
  );
}

// ── SETTINGS ──────────────────────────────────────────────────────────────────
function SettingsPanel({ settings, onSave, onClose }) {
  const [grade, setGrade] = useState(settings.grade);
  const [name, setName] = useState(settings.name || "");
  const [school, setSchool] = useState(settings.school || "");
  const [difficulty, setDifficulty] = useState(settings.difficulty || "standard");
  const [ttsEnabled, setTtsEnabled] = useState(settings.ttsEnabled !== false);
  function save() { onSave({ grade, name, school, difficulty, ttsEnabled }); onClose(); }
  return (
    <div className="settings-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="settings-panel fade-in">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>⚙️ Settings</h2>
          <button className="btn btn-secondary" onClick={onClose} style={{ padding: "6px 12px" }}>✕</button>
        </div>
        <div style={{ marginBottom: 18 }}><label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 6, fontWeight: 600, letterSpacing: 1 }}>YOUR NAME</label><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Aarush Chawla" /></div>
        <div style={{ marginBottom: 18 }}><label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 6, fontWeight: 600, letterSpacing: 1 }}>SCHOOL</label><input type="text" value={school} onChange={e => setSchool(e.target.value)} placeholder="e.g. Apeejay School International" /></div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 6, fontWeight: 600, letterSpacing: 1 }}>IB MYP GRADE</label>
          <select value={grade} onChange={e => setGrade(parseInt(e.target.value))}>{Object.entries(MYP_GRADES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
          <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>Adjusts difficulty and content of all AI questions.</div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 6, fontWeight: 600, letterSpacing: 1 }}>QUESTION DIFFICULTY</label>
          <div style={{ display: "flex", gap: 8 }}>
            {[["easy","🟢 Easy"],["standard","🟡 Standard"],["hard","🔴 Hard"]].map(([v,l]) => <button key={v} className={`btn ${difficulty===v?"btn-primary":"btn-secondary"}`} onClick={() => setDifficulty(v)} style={{ flex:1, justifyContent:"center", fontSize:13 }}>{l}</button>)}
          </div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 6, fontWeight: 600, letterSpacing: 1 }}>ACCESSIBILITY</label>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className={`btn ${ttsEnabled ? "btn-success" : "btn-secondary"}`} onClick={() => setTtsEnabled(!ttsEnabled)} style={{ fontSize: 13 }}>{ttsEnabled ? "🔊 Text-to-Speech ON" : "🔇 Text-to-Speech OFF"}</button>
          </div>
          <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>When ON, 🔊 Listen buttons appear next to all AI responses.</div>
        </div>
        <div style={{ background: "#12141A", borderRadius: 10, padding: 14, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>📱 Open in other apps</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a href="https://docs.google.com" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ fontSize: 12, padding: "7px 12px", textDecoration: "none" }}>📝 Google Docs</a>
            <a href="https://notion.so" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ fontSize: 12, padding: "7px 12px", textDecoration: "none" }}>🔲 Notion</a>
            <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ fontSize: 12, padding: "7px 12px", textDecoration: "none" }}>📅 Google Calendar</a>
          </div>
        </div>
        <button className="btn btn-primary" onClick={save} style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 15 }}>💾 Save Settings</button>
      </div>
    </div>
  );
}

// ── AUTH ──────────────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login"); const [name, setName] = useState(""); const [email, setEmail] = useState("");
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>📚</div>
          <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 6 }}>MYP Study</h1>
          <p style={{ color: "#6B7280", fontSize: 14 }}>AI-powered IB exam preparation</p>
        </div>
        <div className="card">
          <div className="tab-row" style={{ marginBottom: 20 }}>
            <button className={`tab ${mode==="login"?"active":""}`} onClick={() => setMode("login")}>Sign In</button>
            <button className={`tab ${mode==="register"?"active":""}`} onClick={() => setMode("register")}>Register</button>
          </div>
          {mode === "register" && <div style={{ marginBottom: 12 }}><label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 6 }}>YOUR NAME</label><input type="text" placeholder="e.g. Aarush Chawla" value={name} onChange={e => setName(e.target.value)} /></div>}
          <div style={{ marginBottom: 20 }}><label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 6 }}>EMAIL</label><input type="email" placeholder="student@school.edu" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && email && onLogin({ name: name || email.split("@")[0], email })} /></div>
          <button className="btn btn-primary" style={{ width:"100%", justifyContent:"center", padding:14, fontSize:15 }} onClick={() => email && onLogin({ name: name || email.split("@")[0], email })}>{mode==="login"?"Sign In →":"Create Account →"}</button>
        </div>
      </div>
    </div>
  );
}

// ── HOME ─────────────────────────────────────────────────────────────────────
function HomePage({ user, scores, onSelect, onLogout, onSettings, settings, syllabusData }) {
  const rnd = arr => arr[Math.floor(Math.random() * arr.length)];

  // Build subject list — use syllabus data if available, else defaults
  const subjects = syllabusData?.subjects?.length
    ? syllabusData.subjects.map(s => ({
        id: s.id, label: s.label, sub: s.units?.[0] || s.description || "",
        criteria: s.criteria || "A · B · C · D",
        col: { bg: s.bgColor || "#1A1F35", accent: s.accentColor || "#6C63FF", icon: s.icon || "📚" }
      }))
    : [
        { id: "math", label: "Mathematics", sub: "Spatial Reasoning & Geometry", criteria: "A · C · D", col: DEFAULT_SUBJECT_META.math },
        { id: "english", label: "Language & Literature", sub: "Science Fiction Unit", criteria: "A · C · D", col: DEFAULT_SUBJECT_META.english },
        { id: "sciences", label: "Integrated Sciences", sub: "Biology · Physics · Chemistry", criteria: "A · D", col: DEFAULT_SUBJECT_META.sciences },
        { id: "spanish", label: "Spanish", sub: "El mundo en que vivimos", criteria: "B · C · D", col: DEFAULT_SUBJECT_META.spanish },
        { id: "individuals", label: "Individuals & Societies", sub: "Population & Culture", criteria: "B · D", col: DEFAULT_SUBJECT_META.individuals },
      ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, color: "#6B7280", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{MYP_GRADES[settings.grade]} · {settings.school || "MYP Study"}</div>
          <h1 style={{ fontSize: 32, fontWeight: 800 }}>Welcome back, {user.name.split(" ")[0]} 👋</h1>
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            <span className="badge" style={{ background: "#6C63FF22", color: "#6C63FF" }}>{MYP_GRADES[settings.grade]}</span>
            <span className="badge" style={{ background: settings.difficulty==="hard"?"#EF476F22":settings.difficulty==="easy"?"#06D6A022":"#FFD16622", color: settings.difficulty==="hard"?"#EF476F":settings.difficulty==="easy"?"#06D6A0":"#FFD166" }}>
              {settings.difficulty==="hard"?"🔴 Hard":settings.difficulty==="easy"?"🟢 Easy":"🟡 Standard"}
            </span>
            {syllabusData && <span className="badge" style={{ background: "#06D6A022", color: "#06D6A0" }}>📄 Custom Syllabus Active</span>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary" onClick={onSettings}>⚙️ Settings</button>
          <button className="btn btn-secondary" onClick={onLogout}>Sign Out</button>
        </div>
      </div>

      {syllabusData && (
        <div className="syllabus-banner" style={{ marginBottom: 24 }}>
          <div><div style={{ fontSize: 11, color: "#6C63FF", fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>📄 SYLLABUS ACTIVE — All subjects updated to match your curriculum</div><div style={{ fontSize: 13, color: "#B0B8C8" }}>{syllabusData.fileName} · {syllabusData.subjects?.length} subjects · {syllabusData.schoolName || ""}</div></div>
          <button className="btn btn-secondary" onClick={() => onSelect("syllabus")} style={{ fontSize: 12, padding: "7px 12px" }}>Manage →</button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20, marginBottom: 32 }}>
        {subjects.map(s => {
          const avg = scores[s.id];
          return (
            <div key={s.id} onClick={() => onSelect(s.id)} className="fade-in"
              style={{ background: s.col.bg, border: "1px solid #252836", borderRadius: 20, padding: 28, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = s.col.accent; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#252836"; e.currentTarget.style.transform = ""; }}>
              <div style={{ fontSize: 40, marginBottom: 14 }}>{s.col.icon}</div>
              <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{s.label}</h2>
              <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 14 }}>{s.sub}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="badge" style={{ background: s.col.accent + "22", color: s.col.accent }}>Criteria {s.criteria}</span>
                {avg != null && <ScoreChip score={avg} />}
              </div>
            </div>
          );
        })}

        {/* Syllabus card */}
        <div onClick={() => onSelect("syllabus")} className="fade-in"
          style={{ background: "#1A2A1A", border: `1px solid ${syllabusData ? "#06D6A044" : "#252836"}`, borderRadius: 20, padding: 28, cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#06D6A0"; e.currentTarget.style.transform = "translateY(-3px)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = syllabusData ? "#06D6A044" : "#252836"; e.currentTarget.style.transform = ""; }}>
          <div style={{ fontSize: 40, marginBottom: 14 }}>{syllabusData ? "✅" : "📄"}</div>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{syllabusData ? "Syllabus Active" : "Upload Syllabus"}</h2>
          <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 14 }}>{syllabusData ? "Click to manage or replace" : "Upload to customise all subjects"}</p>
          <span className="badge" style={{ background: "#06D6A022", color: "#06D6A0" }}>Smart AI Parser</span>
        </div>
      </div>

      {Object.keys(scores).length > 0 && (
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 20 }}>📊 Score Overview</h3>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {Object.entries(scores).map(([id, avg]) => {
              const subj = subjects.find(s => s.id === id);
              if (!subj) return null;
              return <div key={id} style={{ textAlign: "center" }}><div style={{ fontSize: 26, marginBottom: 4 }}>{subj.col.icon}</div><div style={{ fontSize: 12, color: "#6B7280", marginBottom: 6 }}>{subj.label.split(" ")[0]}</div><div style={{ fontSize: 28, fontWeight: 800, color: subj.col.accent }}>{avg}/8</div></div>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── DYNAMIC SUBJECT PAGE ──────────────────────────────────────────────────────
// For syllabus-generated subjects (not the built-in ones)
function DynamicSubjectPage({ subjectData, onScore, grade, difficulty, syllabusData }) {
  const [tab, setTab] = useState("notes");
  const topics = subjectData.topics || [];
  const rnd = arr => arr[Math.floor(Math.random() * arr.length)];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 26, fontWeight: 800 }}>{subjectData.icon} {subjectData.label}</h2>
        <p style={{ color: "#6B7280", fontSize: 14 }}>Criteria {subjectData.criteria} · {MYP_GRADES[grade]} · From your syllabus</p>
      </div>
      <SyllabusBanner syllabusData={syllabusData} subjectId={subjectData.id} />
      <CustomPromptBox subject={subjectData.label} grade={grade} />
      <div className="tab-row">
        {[["notes","📝 Topics"],["practice","🎯 Practice"],["mynotes","📓 My Notes"]].map(([t,l]) => <button key={t} className={`tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>{l}</button>)}
      </div>
      {tab === "notes" && (
        <div className="fade-in">
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 12, color: subjectData.accentColor || "#6C63FF" }}>Topics from your syllabus</h3>
            {topics.map((t, i) => <div key={i} style={{ padding: "9px 0", borderBottom: "1px solid #252836", display: "flex", gap: 12 }}><span className="badge" style={{ background: (subjectData.accentColor || "#6C63FF") + "22", color: subjectData.accentColor || "#6C63FF", flexShrink: 0 }}>{i+1}</span><span style={{ fontSize: 14 }}>{t}</span></div>)}
          </div>
          {subjectData.keyVocabulary?.length > 0 && (
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Key Vocabulary</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{subjectData.keyVocabulary.map((w, i) => <span key={i} className="badge" style={{ background: "#252836", color: "#E8E9F0", fontSize: 12 }}>{w}</span>)}</div>
            </div>
          )}
        </div>
      )}
      {tab === "practice" && (
        <PracticeEngine
          topics={topics}
          grade={grade}
          difficulty={difficulty}
          systemPrompt={`You are an IB MYP teacher for ${subjectData.label}. Generate one structured exam-style question using IB command terms. Criteria: ${subjectData.criteria}.`}
          evalPrompt={`IB MYP ${subjectData.label} examiner. Score out of 8. Format:\nSCORE: X/8\nFEEDBACK: [detailed]\nSTRENGTHS: [2-3]\nIMPROVEMENTS: [2-3]`}
          placeholder="Write your answer here..."
          answerRows={7}
        />
      )}
      {tab === "mynotes" && <NotesSection subject={subjectData.id} />}
    </div>
  );
}

// ── BUILT-IN SUBJECT PAGES ────────────────────────────────────────────────────
const SCIFI_THEMES = ["a totalitarian surveillance state","genetic engineering and designer humans","virtual reality addiction in a dystopian megacity","climate collapse and the last surviving underground civilization","artificial intelligence controlling all governments","time travel and the ethics of changing history","memory manipulation and stolen identity","robot uprising and machine consciousness","post-apocalyptic wastelands","a dystopia where emotions are illegal"];
const ENGLISH_IMAGES = [
  { url:"https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80", title:"Circuit Board City", context:"A macro photograph of a glowing circuit board resembling an aerial view of a futuristic city." },
  { url:"https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80", title:"Robot and Human", context:"A humanoid robot stands beside a human silhouette, both looking toward a bright horizon." },
  { url:"https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80", title:"Earth from Space", context:"Planet Earth from space, half illuminated, half in darkness. A single spacecraft orbits silently." },
  { url:"https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80", title:"Digital Surveillance", context:"Dozens of security camera screens fill a wall, each showing a different person unaware they are being watched." },
];
const MATH_TOPICS_DEFAULT = ["Congruence of triangles – SSS, SAS, ASA, AAS","Similar triangles and scale factor","Transformations (translation, rotation, reflection, dilation)","Pythagoras' theorem, triplets and converse","Coordinate geometry – distance, midpoint, gradient","Graphing lines and equation from a graph","Area & perimeter of compound shapes","Arc length and area of sector","Surface area and volume of 3D solids","Composite solids and volume/capacity"];
const SCI_TOPICS_DEFAULT = {
  biology:["Structure & importance of plants","Types of leaves","Photosynthesis","Factors for photosynthesis","Products of photosynthesis","Transpiration and stomata","Parasitic plants"],
  physics:["Light waves and sound waves","Sources of light","Production of sound","Role of vibrations","Reflection and refraction","Refractive index","Seismic waves"],
  chemistry:["Word equations","Energy changes in reactions","Metals and oxygen","Metals and acids","Metals and water","Displacement reactions","Reactivity series"],
};
const IS_TOPICS_DEFAULT = ["Pattern of global population change","Process of population change","Migration – push and pull factors","Demographic Transition Model","Population pyramids","Case Study: Nigeria","Case Study: Hong Kong","Case Study: Detroit","Culture – definition","The Cultural Iceberg","Case Study: Mexico","Case Study: Grunge Music","Multiculturalism","Conflicts threatening cultural identity"];
const ENG_NOTES_DATA = [
  { title:"Conventions of Sci-Fi", pts:["Futuristic or dystopian settings","Advanced technology","Social commentary","Speculative 'what if' scenarios"] },
  { title:"IB Command Terms", pts:["Analyse – examine in detail","Evaluate – make judgement","Examine – consider carefully","Discuss – balanced review"] },
  { title:"Dystopian Elements", pts:["Oppressive government","Loss of individual freedom","Propaganda and surveillance","Fear used as control"] },
];

function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function MathPage({ onScore, grade, difficulty, syllabusData }) {
  const [tab, setTab] = useState("notes");
  const topics = syllabusData?.subjects?.find(s => s.id === "math")?.topics || MATH_TOPICS_DEFAULT;

  async function genWithFigure(t, diff) {
    const diffNote = diff === "easy" ? "Include hints." : diff === "hard" ? "No hints, challenging." : "";
    const result = await callAI(`IB MYP${grade} Math teacher. Generate one exam question with ASCII figure. ${diffNote}\nFORMAT:\n---FIGURE---\n[ASCII diagram]\n---QUESTION---\n[question]\nMARKS: [4-8]\nCRITERION: [A/C/D]\n---END---`, `Topic: ${t}`);
    const figMatch = result.match(/---FIGURE---\n([\s\S]*?)---QUESTION---/);
    const qMatch = result.match(/---QUESTION---\n([\s\S]*?)---END---/);
    return { figure: figMatch?.[1]?.trim(), q: qMatch?.[1]?.trim() || result };
  }

  const [q, setQ] = useState(null); const [figure, setFigure] = useState(null); const [topic, setTopic] = useState("random");
  const [ans, setAns] = useState(""); const [fb, setFb] = useState(null); const [load, setLoad] = useState(false); const [score, setScore] = useState(null);

  async function gen() {
    setLoad(true); setFb(null); setAns(""); setScore(null); setQ(null); setFigure(null);
    const t = topic === "random" ? rnd(topics) : topic;
    const { figure: fig, q: question } = await genWithFigure(t, difficulty);
    setFigure(fig); setQ(question); setLoad(false);
  }

  async function submit() {
    setLoad(true);
    const r = await callAI(`IB MYP${grade} Math. Score out of 8. Format:\nSCORE: X/8\nFEEDBACK: [detailed]\nMODEL ANSWER: [steps]`, `Q:\n${q}\n\nAnswer:\n${ans}`);
    setFb(r); const s = parseInt(r.match(/SCORE:\s*(\d)/)?.[1] || "0"); setScore(s); onScore?.("math", s); setLoad(false);
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ marginBottom: 24 }}><h2 style={{ fontSize: 26, fontWeight: 800 }}>📐 Mathematics</h2><p style={{ color: "#6B7280", fontSize: 14 }}>Criteria A · C · D · {MYP_GRADES[grade]}</p></div>
      <SyllabusBanner syllabusData={syllabusData} subjectId="math" />
      <CustomPromptBox subject="Mathematics" grade={grade} />
      <div className="tab-row">{[["notes","📝 Notes"],["practice","🎯 Practice"],["mynotes","📓 My Notes"]].map(([t,l]) => <button key={t} className={`tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>{l}</button>)}</div>
      {tab === "notes" && <div className="fade-in">{topics.map((t,i) => <div key={i} className="card" style={{marginBottom:10,display:"flex",gap:12}}><span className="badge" style={{background:"#6C63FF22",color:"#6C63FF",flexShrink:0,marginTop:2}}>T{i+1}</span><span style={{fontSize:14}}>{t}</span></div>)}</div>}
      {tab === "practice" && (
        <div className="fade-in">
          <div style={{ marginBottom: 16 }}><select value={topic} onChange={e => setTopic(e.target.value)}><option value="random">🎲 Random Topic</option>{topics.map((t,i) => <option key={i} value={t}>{t}</option>)}</select></div>
          <button className="btn btn-primary" onClick={gen} disabled={load} style={{ marginBottom: 24 }}>{load ? <><Spinner /> Generating...</> : "⚡ Generate Question + Figure"}</button>
          {(figure || q) && <div className="card fade-in"><MathFigure figureText={figure} />{q && <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}><div style={{whiteSpace:"pre-wrap",lineHeight:1.85,fontSize:14,flex:1}}>{q}</div><TTSButton text={q} /></div>}<textarea rows={8} placeholder="Show all working..." value={ans} onChange={e => setAns(e.target.value)} /><div style={{display:"flex",gap:10,marginTop:12}}><button className="btn btn-success" onClick={submit} disabled={load||!ans.trim()}>{load?<><Spinner/>Evaluating...</>:"✓ Submit"}</button><button className="btn btn-secondary" onClick={gen} disabled={load}>Next →</button></div>{score!=null&&<div style={{marginTop:12}}><ScoreChip score={score}/></div>}<FeedbackBox text={fb}/></div>}
        </div>
      )}
      {tab === "mynotes" && <NotesSection subject="math" />}
    </div>
  );
}

function EnglishPage({ onScore, grade, difficulty, syllabusData }) {
  const [tab, setTab] = useState("notes");
  const [mode, setMode] = useState("text");
  const [q, setQ] = useState(null); const [image, setImage] = useState(null);
  const [ans, setAns] = useState(""); const [fb, setFb] = useState(null); const [load, setLoad] = useState(false); const [score, setScore] = useState(null);

  async function genText() {
    setLoad(true); setFb(null); setAns(""); setScore(null); setImage(null);
    const theme = rnd(SCIFI_THEMES); const cmd = rnd(["Analyse","Evaluate","Examine"]); const focus = rnd(["imagery","symbolism","tone and mood","characterisation","narrative voice","setting"]);
    const r = await callAI(`IB MYP${grade} English teacher. Short unseen sci-fi extract (5-8 sentences) on: "${theme}". ONE analysis question.\nFORMAT:\nEXTRACT:\n[text]\n\nQUESTION:\n${cmd} how the author uses ${focus}. (8 marks)\nCRITERION: A`, "Generate English analysis");
    setQ(r); setLoad(false);
  }
  async function genImage() {
    setLoad(true); setFb(null); setAns(""); setScore(null); setQ(null);
    const img = rnd(ENGLISH_IMAGES); setImage(img);
    const cmd = rnd(["Analyse","Evaluate","Examine"]); const focus = rnd(["mood and atmosphere","symbolism","contrast and tension","light and darkness"]);
    setQ(`IMAGE ANALYSIS TASK\n\nStudy the image: "${img.title}"\nContext: ${img.context}\n\n${cmd} how the visual elements create ${focus}. Refer to colour, composition, subject, symbolism, and sci-fi themes.\n\n(8 marks) — Criterion A`);
    setLoad(false);
  }
  async function submit() {
    setLoad(true);
    const r = await callAI(`IB MYP${grade} English Criterion A. Score out of 8. Format:\nSCORE: X/8\nSTRAND BREAKDOWN:\n- Strand i: X/2\n- Strand ii: X/2\n- Strand iii: X/2\n- Strand iv: X/2\nFEEDBACK:\nWHAT WENT WELL: [2-3]\nEVEN BETTER IF: [2-3]`, `Task:\n${q}\n\nResponse:\n${ans}`);
    setFb(r); const s = parseInt(r.match(/SCORE:\s*(\d)/)?.[1]||"0"); setScore(s); onScore?.("english",s); setLoad(false);
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ marginBottom: 24 }}><h2 style={{ fontSize: 26, fontWeight: 800 }}>📖 Language & Literature</h2><p style={{ color: "#6B7280", fontSize: 14 }}>Criteria A · C · D · {MYP_GRADES[grade]}</p></div>
      <SyllabusBanner syllabusData={syllabusData} subjectId="english" />
      <CustomPromptBox subject="English Language & Literature" grade={grade} />
      <div className="tab-row">{[["notes","📝 Notes"],["analysis","🔍 Analysis (A)"],["writing","✍️ Writing (C)"],["mynotes","📓 My Notes"]].map(([t,l]) => <button key={t} className={`tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>{l}</button>)}</div>
      {tab === "notes" && <div className="fade-in">{ENG_NOTES_DATA.map((n,i) => <div key={i} className="card" style={{marginBottom:14}}><h3 style={{color:"#118AB2",fontWeight:700,marginBottom:10}}>{n.title}</h3><ul style={{paddingLeft:20,lineHeight:2.1}}>{n.pts.map((p,j) => <li key={j} style={{fontSize:14}}>{p}</li>)}</ul></div>)}</div>}
      {tab === "analysis" && (
        <div className="fade-in">
          <div style={{ display:"flex", gap:8, marginBottom:20 }}>
            <button className={`btn ${mode==="text"?"btn-primary":"btn-secondary"}`} onClick={() => setMode("text")}>📝 Text Extract</button>
            <button className={`btn ${mode==="image"?"btn-primary":"btn-secondary"}`} onClick={() => setMode("image")}>🖼️ Image Analysis</button>
          </div>
          <button className="btn btn-primary" onClick={mode==="text"?genText:genImage} disabled={load} style={{marginBottom:24}}>{load?<><Spinner/>Generating...</>:mode==="text"?"⚡ Generate Text":"⚡ Generate Image Task"}</button>
          {(q||image) && <div className="card fade-in">{image&&<ImageDisplay url={image.url} title={image.title} caption="Study this image carefully."/>}{q&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}><div style={{whiteSpace:"pre-wrap",lineHeight:1.85,fontSize:14,flex:1,borderLeft:image?"3px solid #118AB2":"none",paddingLeft:image?16:0}}>{q}</div><TTSButton text={q}/></div>}<textarea rows={10} placeholder="Write your analysis..." value={ans} onChange={e=>setAns(e.target.value)}/><div style={{display:"flex",gap:10,marginTop:12}}><button className="btn btn-success" onClick={submit} disabled={load||!ans.trim()}>{load?<><Spinner/>Evaluating...</>:"✓ Submit"}</button><button className="btn btn-secondary" onClick={mode==="text"?genText:genImage} disabled={load}>Next →</button></div>{score!=null&&<div style={{marginTop:12}}><ScoreChip score={score}/></div>}<FeedbackBox text={fb}/></div>}
        </div>
      )}
      {tab === "writing" && (
        <PracticeEngine
          topics={["story","journal entry","dialogue","dramatic monologue"]}
          grade={grade} difficulty={difficulty}
          systemPrompt={`IB MYP English teacher. Generate a VARIED creative writing prompt for the given type. Theme: ${rnd(SCIFI_THEMES)}. Be specific and vivid.\nFormat:\nTASK TYPE: [type]\nPROMPT: [vivid prompt]\nREQUIREMENTS:\n- Word count: 300-500\n- [2-3 elements]`}
          evalPrompt={`IB MYP English Criterion C examiner. Score out of 8. Format:\nSCORE: X/8\nBREAKDOWN:\n- Purpose/Audience: X/2\n- Language Choices: X/2\n- Text type features: X/2\n- Style/Voice: X/2\nFEEDBACK:\nSTRENGTHS: [2-3]\nIMPROVEMENTS: [2-3]`}
          placeholder="Write your response here (300-500 words)..." answerRows={12}
        />
      )}
      {tab === "mynotes" && <NotesSection subject="english" />}
    </div>
  );
}

function SciencesPage({ onScore, grade, difficulty, syllabusData }) {
  const [tab, setTab] = useState("biology"); const [mode, setMode] = useState("notes");
  const sciColors = { biology:"#06D6A0", physics:"#118AB2", chemistry:"#FFD166" };
  const getSciTopics = (sub) => syllabusData?.subjects?.find(s => s.id === "sciences")?.topics || SCI_TOPICS_DEFAULT[sub];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ marginBottom: 24 }}><h2 style={{ fontSize: 26, fontWeight: 800 }}>🔬 Integrated Sciences</h2><p style={{ color: "#6B7280", fontSize: 14 }}>Criteria A · D · {MYP_GRADES[grade]}</p></div>
      <SyllabusBanner syllabusData={syllabusData} subjectId="sciences" />
      <CustomPromptBox subject="Integrated Sciences" grade={grade} />
      <div className="tab-row">{[["biology","🌿 Biology"],["physics","💡 Physics"],["chemistry","⚗️ Chemistry"],["mynotes","📓 My Notes"]].map(([t,l]) => <button key={t} className={`tab ${tab===t?"active":""}`} onClick={()=>{setTab(t);setMode("notes");}}>{l}</button>)}</div>
      {tab !== "mynotes" ? (
        <>
          <div className="tab-row"><button className={`tab ${mode==="notes"?"active":""}`} onClick={()=>setMode("notes")}>📝 Notes</button><button className={`tab ${mode==="quiz"?"active":""}`} onClick={()=>setMode("quiz")}>🎯 Quiz</button></div>
          {mode === "notes" && <div className="fade-in">{getSciTopics(tab).map((t,i) => <div key={i} className="card" style={{marginBottom:10,display:"flex",gap:12}}><span className="badge" style={{background:sciColors[tab]+"22",color:sciColors[tab],flexShrink:0,marginTop:2}}>{i+1}</span><span style={{fontSize:14}}>{t}</span></div>)}</div>}
          {mode === "quiz" && (
            <PracticeEngine
              topics={getSciTopics(tab)}
              grade={grade} difficulty={difficulty}
              systemPrompt={`IB MYP${grade} ${tab} teacher. Generate one exam question (MCQ or short answer). Use IB command terms. Format:\nQUESTION: [question]\nMARKS: [2-4]`}
              evalPrompt={`IB MYP${grade} Science examiner. Score out of 8. Format:\nSCORE: X/8\nFEEDBACK: [specific with correct answer]`}
              placeholder="Write your answer..." answerRows={5}
            />
          )}
        </>
      ) : <NotesSection subject="sciences" />}
    </div>
  );
}

function SpanishPage({ onScore, grade, difficulty, syllabusData }) {
  const [tab, setTab] = useState("reading");
  const topics = syllabusData?.subjects?.find(s => s.id === "spanish")?.topics || ["el tiempo","la contaminación","el reciclaje","los animales en peligro","el cambio climático","la energía renovable"];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ marginBottom: 24 }}><h2 style={{ fontSize: 26, fontWeight: 800 }}>🌍 Spanish</h2><p style={{ color: "#6B7280", fontSize: 14 }}>Criteria B · C · D · {MYP_GRADES[grade]}</p></div>
      <SyllabusBanner syllabusData={syllabusData} subjectId="spanish" />
      <CustomPromptBox subject="Spanish" grade={grade} />
      <div className="tab-row">{[["reading","📖 Lectura (B)"],["writing","✍️ Escritura (D)"],["speaking","🎤 Oral (C)"],["mynotes","📓 My Notes"]].map(([t,l]) => <button key={t} className={`tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>{l}</button>)}</div>
      {tab === "reading" && (
        <PracticeEngine
          topics={topics}
          grade={grade} difficulty={difficulty}
          systemPrompt={`IB MYP${grade} Spanish A1-A2 teacher. Generate a reading comprehension on the given topic. TEXTO: [80-120 word Spanish text]. Then 6 questions: 2 MCQ (A,B,C,D), 2 short answer in Spanish, 2 True/False.`}
          evalPrompt={`IB MYP${grade} Spanish Criterion B examiner. Score out of 8. Format:\nSCORE: X/8\nCORRECT ANSWERS:\nFEEDBACK:`}
          placeholder="Write your answers for Q1, Q2, Q3, Q4, Q5, Q6..." answerRows={8}
        />
      )}
      {tab === "writing" && (
        <PracticeEngine
          topics={topics}
          grade={grade} difficulty={difficulty}
          systemPrompt={`IB MYP${grade} Spanish RAFT prompt A1-A2 on the topic. Different role/audience each time.\nFormat:\nROL: [role]\nAUDIENCIA: [audience]\nFORMATO: Blog post\nTEMA: [topic]\nTAREA: Escribe un blog de 100-150 palabras.\nPALABRAS CLAVE: [6-8 words]\nFRASES ÚTILES: [3-4 starters]`}
          evalPrompt={`IB MYP${grade} Spanish Criterion D. A1-A2 blog. Score out of 8. Format:\nSCORE: X/8\nFEEDBACK:\nGRAMMAR CORRECTIONS:`}
          placeholder="Escribe tu blog aquí (100-150 palabras)..." answerRows={10}
        />
      )}
      {tab === "speaking" && <SpanishSpeaking onScore={s => onScore?.("spanish", s)} grade={grade} />}
      {tab === "mynotes" && <NotesSection subject="spanish" />}
    </div>
  );
}

function IndividualsPage({ onScore, grade, difficulty, syllabusData }) {
  const [tab, setTab] = useState("notes");
  const topics = syllabusData?.subjects?.find(s => s.id === "individuals")?.topics || IS_TOPICS_DEFAULT;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ marginBottom: 24 }}><h2 style={{ fontSize: 26, fontWeight: 800 }}>🌐 Individuals & Societies</h2><p style={{ color: "#6B7280", fontSize: 14 }}>Criteria B · D · {MYP_GRADES[grade]}</p></div>
      <SyllabusBanner syllabusData={syllabusData} subjectId="individuals" />
      <CustomPromptBox subject="Individuals & Societies" grade={grade} />
      <div className="tab-row">{[["notes","📝 Notes"],["practice","🎯 Practice"],["mynotes","📓 My Notes"]].map(([t,l]) => <button key={t} className={`tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>{l}</button>)}</div>
      {tab === "notes" && (
        <div className="fade-in">
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 12, color: "#EF476F" }}>Topics from {syllabusData ? "your syllabus" : "syllabus"}</h3>
            {topics.map((t,i) => <div key={i} style={{padding:"9px 0",borderBottom:"1px solid #252836",display:"flex",gap:12}}><span className="badge" style={{background:"#EF476F22",color:"#EF476F",flexShrink:0}}>{i+1}</span><span style={{fontSize:14}}>{t}</span></div>)}
          </div>
        </div>
      )}
      {tab === "practice" && (
        <PracticeEngine
          topics={topics}
          grade={grade} difficulty={difficulty}
          systemPrompt={`IB MYP${grade} I&S teacher. Generate a Criterion B or D question using IB command terms (Describe/Explain/Evaluate/Discuss). Include data or stimulus if relevant. Format:\nCRITERION: [B or D]\nQUESTION: [full question]\nMARKS: [4-8]`}
          evalPrompt={`IB MYP${grade} I&S examiner. Score out of 8. Format:\nSCORE: X/8\nFEEDBACK:\nSTRENGTHS: [2-3]\nIMPROVEMENTS: [2-3]`}
          placeholder="Write your structured response. Reference evidence and case studies..." answerRows={8}
        />
      )}
      {tab === "mynotes" && <NotesSection subject="individuals" />}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => loadData("user", null));
  const [scores, setScores] = useState({});
  const [subject, setSubject] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(() => loadData("settings", { grade: 3, difficulty: "standard", school: "Apeejay School International", ttsEnabled: true }));
  const [syllabusData, setSyllabusData] = useState(() => loadData("syllabus_parsed", null));

  function handleScore(subjectId, score) {
    setScores(prev => ({ ...prev, [subjectId]: [...(prev[subjectId] || []), score] }));
  }
  function handleLogin(u) { setUser(u); saveData("user", u); }
  function handleSaveSettings(s) {
    setSettings(s); saveData("settings", s);
    if (s.name && user) { const u = { ...user, name: s.name }; setUser(u); saveData("user", u); }
  }
  function handleSyllabusLoaded(data) {
    setSyllabusData(data);
    saveData("syllabus_parsed", data);
  }

  const avgScores = {};
  Object.entries(scores).forEach(([id, arr]) => { if (arr.length) avgScores[id] = Math.round(arr.reduce((a,b)=>a+b,0)/arr.length); });

  const subjectProps = { grade: settings.grade, difficulty: settings.difficulty, syllabusData, onScore: handleScore };

  // Determine which page to render
  function renderSubject() {
    // Check if it's a syllabus-generated subject
    if (syllabusData?.subjects) {
      const builtIn = ["math","english","sciences","spanish","individuals","syllabus"];
      if (!builtIn.includes(subject)) {
        const subjectData = syllabusData.subjects.find(s => s.id === subject);
        if (subjectData) return <DynamicSubjectPage subjectData={subjectData} grade={settings.grade} difficulty={settings.difficulty} syllabusData={syllabusData} onScore={handleScore} />;
      }
    }
    if (subject === "math") return <MathPage {...subjectProps} />;
    if (subject === "english") return <EnglishPage {...subjectProps} />;
    if (subject === "sciences") return <SciencesPage {...subjectProps} />;
    if (subject === "spanish") return <SpanishPage {...subjectProps} />;
    if (subject === "individuals") return <IndividualsPage {...subjectProps} />;
    if (subject === "syllabus") return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
        <SyllabusUpload onSyllabusLoaded={handleSyllabusLoaded} syllabusData={syllabusData} grade={settings.grade} />
      </div>
    );
    return null;
  }

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", background: "#0A0B0F", color: "#E8E9F0" }}>
        {showSettings && <SettingsPanel settings={{ ...settings, name: user?.name || "" }} onSave={handleSaveSettings} onClose={() => setShowSettings(false)} />}
        {!user ? <AuthPage onLogin={handleLogin} /> : subject ? (
          <div>
            <div style={{ background: "#12141A", borderBottom: "1px solid #252836", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button className="btn btn-secondary" onClick={() => setSubject(null)} style={{ padding: "8px 14px" }}>← Home</button>
                <span style={{ color: "#6B7280", fontSize: 13 }}>{MYP_GRADES[settings.grade]} · {user.name}</span>
              </div>
              <button className="btn btn-secondary" onClick={() => setShowSettings(true)} style={{ padding: "7px 12px", fontSize: 12 }}>⚙️</button>
            </div>
            {renderSubject()}
          </div>
        ) : (
          <HomePage user={user} scores={avgScores} onSelect={setSubject} onLogout={() => { setUser(null); saveData("user", null); setSubject(null); }} onSettings={() => setShowSettings(true)} settings={settings} syllabusData={syllabusData} />
        )}
      </div>
    </>
  );
}
