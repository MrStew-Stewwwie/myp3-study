import { useState, useEffect, useRef } from "react";

// ── THEME ─────────────────────────────────────────────────────────────────────
const COLORS = {
  bg: "#0A0B0F", surface: "#12141A", card: "#1A1D26", border: "#252836",
  accent: "#6C63FF", gold: "#FFD166", green: "#06D6A0", red: "#EF476F",
  blue: "#118AB2", text: "#E8E9F0", muted: "#6B7280",
  subjectColors: {
    math: { bg: "#1A1F35", accent: "#6C63FF", icon: "📐" },
    english: { bg: "#1A2635", accent: "#118AB2", icon: "📖" },
    sciences: { bg: "#1A3525", accent: "#06D6A0", icon: "🔬" },
    spanish: { bg: "#352A1A", accent: "#FFD166", icon: "🌍" },
    individuals: { bg: "#351A2A", accent: "#EF476F", icon: "🌐" },
  },
};

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
  .settings-panel { background: #12141A; border: 1px solid #252836; border-radius: 20px; padding: 32px; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; }
  .upload-zone { border: 2px dashed #252836; border-radius: 12px; padding: 32px; text-align: center; cursor: pointer; transition: all 0.2s; }
  .upload-zone:hover { border-color: #6C63FF; background: #6C63FF08; }
  .upload-zone.active { border-color: #6C63FF; background: #6C63FF11; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-thumb { background: #252836; border-radius: 3px; }
`;

// ── VARIETY DATA ──────────────────────────────────────────────────────────────
const SCIFI_THEMES = [
  "a totalitarian surveillance state where all thoughts are monitored",
  "genetic engineering and designer humans in a corporate-controlled society",
  "virtual reality addiction in a dystopian megacity",
  "climate collapse and the last surviving underground civilization",
  "artificial intelligence that has taken control of all world governments",
  "time travel and the ethics of changing history",
  "underwater civilizations built after rising sea levels",
  "memory manipulation and stolen identity in a future police state",
  "a robot uprising and the philosophical question of machine consciousness",
  "post-apocalyptic wastelands and small tribal communities",
  "a world where sleep has been eliminated by mandatory medication",
  "a society where aging has been cured but overpopulation is catastrophic",
  "children raised entirely by AI in state facilities",
  "space colonists on Mars rebelling against Earth's corporate control",
  "a dystopia where emotions are illegal and chemically suppressed",
];

const ENGLISH_IMAGES = [
  { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80", title: "Circuit Board City", context: "A macro photograph of a glowing circuit board resembling an aerial view of a futuristic city." },
  { url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80", title: "Robot and Human", context: "A humanoid robot stands beside a human silhouette, both looking toward a bright horizon." },
  { url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80", title: "Earth from Space", context: "Planet Earth photographed from space, half illuminated, half in darkness. A single spacecraft orbits silently." },
  { url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80", title: "Digital Surveillance", context: "Dozens of security camera screens fill a wall, each showing a different person going about their daily life." },
  { url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80", title: "Milky Way Horizon", context: "A lone human figure stands on a hilltop beneath a galaxy-filled sky, holding a dim lantern." },
  { url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80", title: "Storm Over City", context: "Dramatic storm clouds spiral over a dense city skyline. Streets below are flooded." },
];

const SPANISH_IMAGES = [
  { url: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&q=80", title: "Contaminación del aire", topic: "contaminación", keywords: "contaminación, smog, fábricas, chimeneas, humo, ciudad" },
  { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", title: "Bosque tropical", topic: "medio ambiente", keywords: "bosque, naturaleza, árboles, selva, biodiversidad" },
  { url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80", title: "Tormenta", topic: "el tiempo", keywords: "tormenta, lluvia, relámpago, nubes, viento" },
  { url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80", title: "Basura plástica", topic: "contaminación", keywords: "basura, plástico, reciclaje, océano, residuos" },
  { url: "https://images.unsplash.com/photo-1542601906897-ecd4d0f5be14?w=800&q=80", title: "Energía solar", topic: "medio ambiente", keywords: "energía solar, paneles, renovable, sostenible" },
  { url: "https://images.unsplash.com/photo-1565034946487-077786996e27?w=800&q=80", title: "Nieve e invierno", topic: "el tiempo", keywords: "nieve, invierno, frío, montañas, hielo" },
];

const MATH_TOPICS = ["Congruence of triangles – SSS, SAS, ASA, AAS","Similar triangles and scale factor","Transformations (translation, rotation, reflection, dilation)","Pythagoras' theorem, triplets and converse","Coordinate geometry – distance, midpoint, gradient","Graphing lines and equation from a graph","Area & perimeter of compound shapes","Arc length and area of sector","Surface area and volume of 3D solids","Composite solids and volume/capacity"];
const SCI_TOPICS = {
  biology: ["Structure & importance of plants and germination","Types of leaves","Photosynthesis – definition and word equation","Factors for photosynthesis","Products of photosynthesis and their uses","Transpiration and stomata","Parasitic plants"],
  physics: ["Light waves and sound waves","Sources of light and travel path","Production and transmission of sound","Role of vibrations in sound","Differences between sound and light waves","Reflection and refraction of light","Refractive index","Seismic waves"],
  chemistry: ["Word equations for chemical reactions","Energy changes in reactions","Metals and oxygen","Metals and acids","Metals and water","Displacement reactions","The reactivity series","Fuels and food energy"],
};
const IS_TOPICS = ["Pattern of global population change","Process of population change","Migration – push and pull factors","Demographic Transition Model (DTM) – all 5 stages","Population pyramids – analysis","Case Study: Nigeria – rapid population growth","Case Study: Hong Kong – aging population","Case Study: Detroit – depopulation","Culture – definition and components","The Cultural Iceberg","Holidays, arts, food, clothing, architecture","Case Study: Mexico – cultural identity","Case Study: Grunge Music – counterculture","Multiculturalism – benefits and challenges","Conflicts threatening cultural identity"];
const ENG_NOTES_DATA = [
  { title: "Conventions of Sci-Fi Literature", pts: ["Futuristic or dystopian settings","Advanced technology (robots, spaceships, AI)","Social commentary on current issues","Speculative 'what if' scenarios"] },
  { title: "Sci-Fi Protagonist Traits", pts: ["Often an outsider or rebel","Questions authority and society","Undergoes significant transformation","Possesses special ability or knowledge"] },
  { title: "Dystopian Elements", pts: ["Oppressive government or ruling power","Loss of individual freedom","Propaganda and surveillance","Fear used as control"] },
  { title: "IB Command Terms – Criterion A", pts: ["Analyse – examine in detail, explain components","Evaluate – make judgement based on evidence","Examine – consider carefully","Discuss – offer a balanced review"] },
];

const MYP_GRADES = { 1: "MYP 1 (Grade 6)", 2: "MYP 2 (Grade 7)", 3: "MYP 3 (Grade 8)", 4: "MYP 4 (Grade 9)", 5: "MYP 5 (Grade 10)" };

function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// ── STORAGE HELPERS ───────────────────────────────────────────────────────────
function loadData(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function saveData(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ── AI ────────────────────────────────────────────────────────────────────────
async function callAI(system, user) {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system, user }),
    });
    const d = await res.json();
    return d.content?.[0]?.text || "";
  } catch { return "Error connecting to AI. Please try again."; }
}

// ── UI COMPONENTS ─────────────────────────────────────────────────────────────
function Spinner() { return <span className="spinner" />; }
function FeedbackBox({ text }) {
  if (!text) return null;
  return <div className="feedback-box fade-in"><div style={{ fontSize: 11, color: "#6C63FF", fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>AI FEEDBACK</div><div style={{ lineHeight: 1.75, whiteSpace: "pre-wrap", fontSize: 14 }}>{text}</div></div>;
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
function CountdownTimer({ seconds, label, color = "#FFD166" }) {
  const [rem, setRem] = useState(seconds); const [done, setDone] = useState(false);
  useEffect(() => { const t = setInterval(() => setRem(p => { if (p <= 1) { clearInterval(t); setDone(true); return 0; } return p - 1; }), 1000); return () => clearInterval(t); }, []);
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

// ── CUSTOM PROMPT BOX (shown on every subject page) ───────────────────────────
function CustomPromptBox({ subject, grade }) {
  const [prompt, setPrompt] = useState(""); const [result, setResult] = useState(""); const [load, setLoad] = useState(false);
  async function ask() {
    if (!prompt.trim()) return;
    setLoad(true); setResult("");
    const r = await callAI(
      `You are an IB MYP ${grade} ${subject} teacher/tutor. Answer the student's question helpfully. If they ask for a question, generate one at MYP ${grade} level. If they ask for an explanation, explain clearly. Be concise and educational.`,
      prompt
    );
    setResult(r); setLoad(false);
  }
  return (
    <div className="custom-prompt-box">
      <div style={{ fontSize: 12, color: "#6C63FF", fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>💬 ASK AI ANYTHING — {subject.toUpperCase()}</div>
      <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 10 }}>Examples: "Give me a harder question on Pythagoras" · "Explain photosynthesis simply" · "Make a question about Nigeria for I&S"</div>
      <textarea rows={2} placeholder="Type your request here..." value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), ask())} style={{ marginBottom: 8 }} />
      <button className="btn btn-primary" onClick={ask} disabled={load || !prompt.trim()}>{load ? <><Spinner /> Thinking...</> : "Ask →"}</button>
      {result && <div style={{ marginTop: 12, background: "#12141A", borderRadius: 10, padding: 16, fontSize: 14, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{result}</div>}
    </div>
  );
}

// ── SYLLABUS UPLOAD ───────────────────────────────────────────────────────────
function SyllabusStudy({ grade }) {
  const [syllabusText, setSyllabusText] = useState(loadData("syllabus_text", ""));
  const [syllabusName, setSyllabusName] = useState(loadData("syllabus_name", ""));
  const [studyPlan, setStudyPlan] = useState(null);
  const [customQ, setCustomQ] = useState(""); const [qResult, setQResult] = useState("");
  const [load, setLoad] = useState(false); const [qLoad, setQLoad] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  function handleFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target.result;
      setSyllabusText(text); setSyllabusName(file.name);
      saveData("syllabus_text", text); saveData("syllabus_name", file.name);
      setStudyPlan(null);
    };
    reader.readAsText(file);
  }

  function handleDrop(e) {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  async function generatePlan() {
    setLoad(true); setStudyPlan(null);
    const plan = await callAI(
      `You are an IB MYP ${grade} study planner. Analyse the syllabus/notes provided and create a comprehensive study plan. Include:
1. KEY TOPICS to revise (list all topics from the document)
2. IMPORTANT CONCEPTS for each topic
3. LIKELY EXAM QUESTIONS (3-5 questions based on the content)
4. STUDY TIPS specific to the content
Format clearly with headers and bullet points.`,
      `Syllabus/Notes content:\n${syllabusText.slice(0, 3000)}`
    );
    setStudyPlan(plan); setLoad(false);
  }

  async function askAboutSyllabus() {
    if (!customQ.trim()) return;
    setQLoad(true); setQResult("");
    const r = await callAI(
      `You are an IB MYP ${grade} tutor. The student has uploaded their syllabus/notes. Answer their question based on the content provided. Generate practice questions if asked.`,
      `Syllabus content:\n${syllabusText.slice(0, 2000)}\n\nStudent question: ${customQ}`
    );
    setQResult(r); setQLoad(false);
  }

  function clearSyllabus() {
    setSyllabusText(""); setSyllabusName(""); setStudyPlan(null);
    saveData("syllabus_text", ""); saveData("syllabus_name", "");
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>📄 Syllabus & Notes Upload</h3>
        <p style={{ fontSize: 13, color: "#6B7280" }}>Upload your syllabus, class notes, or any study material — the AI will generate a study plan and answer questions about it.</p>
      </div>

      {!syllabusText ? (
        <div className={`upload-zone ${dragging ? "active" : ""}`}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}>
          <input ref={fileRef} type="file" accept=".txt,.md,.csv,.doc,.docx" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
          <div style={{ fontSize: 48, marginBottom: 12 }}>📁</div>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Drop your file here or click to browse</div>
          <div style={{ fontSize: 13, color: "#6B7280" }}>Supports .txt, .md, .csv files · Or paste text below</div>
        </div>
      ) : (
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><div style={{ fontWeight: 600, color: "#06D6A0" }}>✅ {syllabusName || "Pasted text"}</div><div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{syllabusText.length} characters loaded</div></div>
            <button className="btn btn-danger" onClick={clearSyllabus} style={{ padding: "6px 12px", fontSize: 12 }}>Remove</button>
          </div>
        </div>
      )}

      {!syllabusText && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>Or paste your notes/syllabus directly:</div>
          <textarea rows={6} placeholder="Paste your class notes, syllabus, or any study content here..." onChange={e => { setSyllabusText(e.target.value); saveData("syllabus_text", e.target.value); setSyllabusName("Pasted text"); }} />
        </div>
      )}

      {syllabusText && (
        <div style={{ marginTop: 20 }}>
          <button className="btn btn-primary" onClick={generatePlan} disabled={load} style={{ marginBottom: 16, marginRight: 10 }}>{load ? <><Spinner /> Analysing...</> : "🧠 Generate Study Plan"}</button>

          {studyPlan && (
            <div className="card fade-in" style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h4 style={{ fontWeight: 700 }}>📋 Your Study Plan</h4>
                <button className="btn btn-secondary" style={{ fontSize: 12, padding: "6px 12px" }} onClick={() => {
                  const blob = new Blob([studyPlan], { type: "text/plain" });
                  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "study-plan.txt"; a.click();
                }}>⬇️ Download</button>
              </div>
              <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.85, fontSize: 14 }}>{studyPlan}</div>
            </div>
          )}

          <div className="custom-prompt-box">
            <div style={{ fontSize: 12, color: "#6C63FF", fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>❓ ASK ABOUT YOUR SYLLABUS</div>
            <textarea rows={2} placeholder='e.g. "Generate 5 questions from this syllabus" · "What are the key topics I should focus on?" · "Explain topic X from my notes"' value={customQ} onChange={e => setCustomQ(e.target.value)} style={{ marginBottom: 8 }} />
            <button className="btn btn-primary" onClick={askAboutSyllabus} disabled={qLoad || !customQ.trim()}>{qLoad ? <><Spinner /> Thinking...</> : "Ask →"}</button>
            {qResult && <div style={{ marginTop: 12, background: "#12141A", borderRadius: 10, padding: 16, fontSize: 14, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{qResult}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

// ── NOTES SECTION ─────────────────────────────────────────────────────────────
function NotesSection({ subject }) {
  const storageKey = `notes_${subject}`;
  const [notes, setNotes] = useState(() => loadData(storageKey, []));
  const [editing, setEditing] = useState(null); // null | "new" | noteId
  const [editTitle, setEditTitle] = useState(""); const [editContent, setEditContent] = useState("");
  const [aiLoad, setAiLoad] = useState(false); const [filter, setFilter] = useState("all");

  function saveNotes(updated) { setNotes(updated); saveData(storageKey, updated); }

  function startNew() { setEditing("new"); setEditTitle(""); setEditContent(""); }

  function startEdit(note) { setEditing(note.id); setEditTitle(note.title); setEditContent(note.content); }

  function saveNote() {
    if (!editTitle.trim() && !editContent.trim()) { setEditing(null); return; }
    if (editing === "new") {
      const newNote = { id: Date.now(), title: editTitle || "Untitled", content: editContent, subject, createdAt: new Date().toLocaleDateString(), tag: "note" };
      saveNotes([newNote, ...notes]);
    } else {
      saveNotes(notes.map(n => n.id === editing ? { ...n, title: editTitle || "Untitled", content: editContent } : n));
    }
    setEditing(null);
  }

  function deleteNote(id) { saveNotes(notes.filter(n => n.id !== id)); }

  async function enhanceWithAI() {
    if (!editContent.trim()) return;
    setAiLoad(true);
    const enhanced = await callAI(
      `You are an IB MYP study helper. The student has written some notes. Enhance them by:
- Fixing any errors
- Adding key definitions
- Adding 2-3 exam tips
- Suggesting connections to IB criteria
Keep it concise. Return enhanced notes only.`,
      `Subject: ${subject}\nNotes:\n${editContent}`
    );
    setEditContent(prev => prev + "\n\n--- AI ENHANCEMENTS ---\n" + enhanced);
    setAiLoad(false);
  }

  function exportAllNotes() {
    const text = notes.map(n => `# ${n.title}\n${n.createdAt}\n\n${n.content}`).join("\n\n---\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${subject}-notes.txt`; a.click();
  }

  function copyForGoogleDocs() {
    const text = notes.map(n => `${n.title}\n${"=".repeat(n.title.length)}\n\n${n.content}`).join("\n\n---\n\n");
    navigator.clipboard.writeText(text).then(() => alert("✅ Copied! Now open Google Docs and press Ctrl+V to paste."));
  }

  const col = COLORS.subjectColors[subject];

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700 }}>📓 My Notes</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {notes.length > 0 && <>
            <button className="btn btn-secondary" onClick={copyForGoogleDocs} style={{ fontSize: 12, padding: "7px 12px" }}>📋 Copy for Google Docs</button>
            <button className="btn btn-secondary" onClick={exportAllNotes} style={{ fontSize: 12, padding: "7px 12px" }}>⬇️ Export .txt</button>
          </>}
          <button className="btn btn-primary" onClick={startNew} style={{ fontSize: 13 }}>+ New Note</button>
        </div>
      </div>

      {editing !== null && (
        <div className="card fade-in" style={{ marginBottom: 20, border: "1px solid #6C63FF44" }}>
          <input type="text" placeholder="Note title..." value={editTitle} onChange={e => setEditTitle(e.target.value)} style={{ marginBottom: 12, fontWeight: 600, fontSize: 15 }} />
          <textarea rows={10} placeholder="Write your notes here... (Markdown supported)" value={editContent} onChange={e => setEditContent(e.target.value)} style={{ marginBottom: 12 }} />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="btn btn-success" onClick={saveNote}>💾 Save</button>
            <button className="btn btn-secondary" onClick={enhanceWithAI} disabled={aiLoad}>{aiLoad ? <><Spinner /> Enhancing...</> : "✨ Enhance with AI"}</button>
            <button className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
          </div>
          <div style={{ fontSize: 11, color: "#6B7280", marginTop: 10 }}>💡 "Enhance with AI" will add key definitions, exam tips, and IB connections to your notes.</div>
        </div>
      )}

      {notes.length === 0 && editing === null && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#6B7280" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>No notes yet</div>
          <div style={{ fontSize: 13 }}>Click "+ New Note" to start taking notes for {subject}</div>
        </div>
      )}

      {notes.map(note => (
        <div key={note.id} className="note-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{note.title}</div>
              <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>{note.createdAt}</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="btn btn-secondary" onClick={() => startEdit(note)} style={{ padding: "5px 10px", fontSize: 12 }}>✏️ Edit</button>
              <button className="btn btn-danger" onClick={() => deleteNote(note.id)} style={{ padding: "5px 10px", fontSize: 12 }}>🗑️</button>
            </div>
          </div>
          <div style={{ fontSize: 13, color: "#B0B8C8", lineHeight: 1.7, whiteSpace: "pre-wrap", maxHeight: 100, overflow: "hidden" }}>{note.content}</div>
          {note.content.length > 200 && <div style={{ fontSize: 12, color: "#6C63FF", marginTop: 6, cursor: "pointer" }} onClick={() => startEdit(note)}>Read more...</div>}
        </div>
      ))}
    </div>
  );
}

// ── SETTINGS PANEL ────────────────────────────────────────────────────────────
function SettingsPanel({ settings, onSave, onClose }) {
  const [grade, setGrade] = useState(settings.grade);
  const [name, setName] = useState(settings.name);
  const [school, setSchool] = useState(settings.school);
  const [difficulty, setDifficulty] = useState(settings.difficulty || "standard");

  function save() { onSave({ grade, name, school, difficulty }); onClose(); }

  return (
    <div className="settings-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="settings-panel fade-in">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>⚙️ Settings</h2>
          <button className="btn btn-secondary" onClick={onClose} style={{ padding: "6px 12px" }}>✕</button>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 8, fontWeight: 600, letterSpacing: 1 }}>YOUR NAME</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Aarush Chawla" />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 8, fontWeight: 600, letterSpacing: 1 }}>SCHOOL</label>
          <input type="text" value={school} onChange={e => setSchool(e.target.value)} placeholder="e.g. Apeejay School International" />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 8, fontWeight: 600, letterSpacing: 1 }}>IB MYP GRADE</label>
          <select value={grade} onChange={e => setGrade(parseInt(e.target.value))}>
            {Object.entries(MYP_GRADES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <div style={{ fontSize: 12, color: "#6B7280", marginTop: 6 }}>This adjusts the difficulty and content of all AI-generated questions.</div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 8, fontWeight: 600, letterSpacing: 1 }}>QUESTION DIFFICULTY</label>
          <div style={{ display: "flex", gap: 8 }}>
            {[["easy", "🟢 Easy"], ["standard", "🟡 Standard"], ["hard", "🔴 Hard"]].map(([v, l]) =>
              <button key={v} className={`btn ${difficulty === v ? "btn-primary" : "btn-secondary"}`} onClick={() => setDifficulty(v)} style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>{l}</button>
            )}
          </div>
          <div style={{ fontSize: 12, color: "#6B7280", marginTop: 6 }}>Easy = more guidance & hints. Hard = exam conditions, no hints.</div>
        </div>

        <div style={{ background: "#12141A", borderRadius: 12, padding: 16, marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>📱 Open in other apps</div>
          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 12 }}>Export your notes to use in other tools:</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a href="https://docs.google.com" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ fontSize: 12, padding: "7px 12px", textDecoration: "none" }}>📝 Google Docs</a>
            <a href="https://notion.so" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ fontSize: 12, padding: "7px 12px", textDecoration: "none" }}>🔲 Notion</a>
            <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ fontSize: 12, padding: "7px 12px", textDecoration: "none" }}>📅 Google Calendar</a>
          </div>
          <div style={{ fontSize: 11, color: "#6B7280", marginTop: 8 }}>Use "Copy for Google Docs" in the Notes section to transfer your notes.</div>
        </div>

        <button className="btn btn-primary" onClick={save} style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 15 }}>💾 Save Settings</button>
      </div>
    </div>
  );
}

// ── AUTH ──────────────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
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
            <button className={`tab ${mode === "login" ? "active" : ""}`} onClick={() => setMode("login")}>Sign In</button>
            <button className={`tab ${mode === "register" ? "active" : ""}`} onClick={() => setMode("register")}>Register</button>
          </div>
          {mode === "register" && <div style={{ marginBottom: 12 }}><label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 6 }}>YOUR NAME</label><input type="text" placeholder="e.g. Aarush Chawla" value={name} onChange={e => setName(e.target.value)} /></div>}
          <div style={{ marginBottom: 20 }}><label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 6 }}>EMAIL</label><input type="email" placeholder="student@school.edu" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && email && onLogin({ name: name || email.split("@")[0], email })} /></div>
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 15 }} onClick={() => email && onLogin({ name: name || email.split("@")[0], email })}>{mode === "login" ? "Sign In →" : "Create Account →"}</button>
        </div>
      </div>
    </div>
  );
}

// ── HOME ─────────────────────────────────────────────────────────────────────
function HomePage({ user, scores, onSelect, onLogout, onSettings, settings }) {
  const subjects = [
    { id: "math", label: "Mathematics", sub: "Spatial Reasoning & Geometry", criteria: "A · C · D" },
    { id: "english", label: "Language & Literature", sub: "Science Fiction Unit", criteria: "A · C · D" },
    { id: "sciences", label: "Integrated Sciences", sub: "Biology · Physics · Chemistry", criteria: "A · D" },
    { id: "spanish", label: "Spanish", sub: "El mundo en que vivimos", criteria: "B · C · D" },
    { id: "individuals", label: "Individuals & Societies", sub: "Population & Culture", criteria: "B · D" },
  ];
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, color: "#6B7280", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{MYP_GRADES[settings.grade]} · {settings.school}</div>
          <h1 style={{ fontSize: 32, fontWeight: 800 }}>Welcome back, {user.name.split(" ")[0]} 👋</h1>
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            <span className="badge" style={{ background: "#6C63FF22", color: "#6C63FF" }}>{MYP_GRADES[settings.grade]}</span>
            <span className="badge" style={{ background: settings.difficulty === "hard" ? "#EF476F22" : settings.difficulty === "easy" ? "#06D6A022" : "#FFD16622", color: settings.difficulty === "hard" ? "#EF476F" : settings.difficulty === "easy" ? "#06D6A0" : "#FFD166" }}>
              {settings.difficulty === "hard" ? "🔴 Hard Mode" : settings.difficulty === "easy" ? "🟢 Easy Mode" : "🟡 Standard Mode"}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary" onClick={onSettings}>⚙️ Settings</button>
          <button className="btn btn-secondary" onClick={onLogout}>Sign Out</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20, marginBottom: 32 }}>
        {subjects.map(s => {
          const col = COLORS.subjectColors[s.id]; const avg = scores[s.id];
          return <div key={s.id} onClick={() => onSelect(s.id)} className="fade-in" style={{ background: col.bg, border: "1px solid #252836", borderRadius: 20, padding: 28, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = col.accent; e.currentTarget.style.transform = "translateY(-3px)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "#252836"; e.currentTarget.style.transform = ""; }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>{col.icon}</div>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{s.label}</h2>
            <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 14 }}>{s.sub}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="badge" style={{ background: col.accent + "22", color: col.accent }}>Criteria {s.criteria}</span>
              {avg != null && <ScoreChip score={avg} />}
            </div>
          </div>;
        })}

        {/* Syllabus card */}
        <div onClick={() => onSelect("syllabus")} className="fade-in" style={{ background: "#1A2A1A", border: "1px solid #252836", borderRadius: 20, padding: 28, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = "#06D6A0"; e.currentTarget.style.transform = "translateY(-3px)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "#252836"; e.currentTarget.style.transform = ""; }}>
          <div style={{ fontSize: 40, marginBottom: 14 }}>📄</div>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Syllabus Upload</h2>
          <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 14 }}>Upload any syllabus or notes — AI generates a study plan</p>
          <span className="badge" style={{ background: "#06D6A022", color: "#06D6A0" }}>Any Subject</span>
        </div>
      </div>

      {Object.keys(scores).length > 0 && <div className="card"><h3 style={{ fontWeight: 700, marginBottom: 20 }}>📊 Score Overview</h3><div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>{Object.entries(scores).map(([id, avg]) => { const col = COLORS.subjectColors[id]; const labels = { math: "Math", english: "English", sciences: "Sciences", spanish: "Spanish", individuals: "I&S" }; return <div key={id} style={{ textAlign: "center" }}><div style={{ fontSize: 26, marginBottom: 4 }}>{col.icon}</div><div style={{ fontSize: 12, color: "#6B7280", marginBottom: 6 }}>{labels[id]}</div><div style={{ fontSize: 28, fontWeight: 800, color: col.accent }}>{avg}/8</div></div>; })}</div></div>}
    </div>
  );
}

// ── MATH PRACTICE ─────────────────────────────────────────────────────────────
function MathPractice({ onScore, grade, difficulty }) {
  const [topic, setTopic] = useState("random"); const [q, setQ] = useState(null); const [figure, setFigure] = useState(null);
  const [ans, setAns] = useState(""); const [fb, setFb] = useState(null); const [load, setLoad] = useState(false); const [score, setScore] = useState(null);

  async function gen() {
    setLoad(true); setFb(null); setAns(""); setScore(null); setQ(null); setFigure(null);
    const t = topic === "random" ? rnd(MATH_TOPICS) : topic;
    const diffNote = difficulty === "easy" ? "Include hints and step-by-step guidance." : difficulty === "hard" ? "No hints. Exam conditions. Make it challenging." : "Standard difficulty.";
    const result = await callAI(
      `IB MYP ${grade} Mathematics teacher. Generate ONE exam-style question with ASCII reference figure. ${diffNote}
FORMAT EXACTLY:
---FIGURE---
[ASCII diagram using |, -, /, \\, +, letters A B C D with measurements]
---QUESTION---
[Question with IB command terms: calculate/find/show that/justify/hence]
MARKS: [4-8]
CRITERION: [A or C or D]
---END---`,
      `Topic: ${t}`
    );
    const figMatch = result.match(/---FIGURE---\n([\s\S]*?)---QUESTION---/);
    const qMatch = result.match(/---QUESTION---\n([\s\S]*?)---END---/);
    if (figMatch) setFigure(figMatch[1].trim());
    setQ(qMatch ? qMatch[1].trim() : result);
    setLoad(false);
  }

  async function submit() {
    setLoad(true);
    const r = await callAI(`IB MYP${grade} Math examiner. Score out of 8. Format:\nSCORE: X/8\nCRITERION: [A/C/D]\nFEEDBACK: [detailed]\nMODEL ANSWER: [step-by-step]`, `Q:\n${q}\n\nWorking:\n${ans}`);
    setFb(r); const s = parseInt(r.match(/SCORE:\s*(\d)/)?.[1] || "0"); setScore(s); onScore?.(s);
    setLoad(false);
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 16 }}><select value={topic} onChange={e => setTopic(e.target.value)}><option value="random">🎲 Random Topic</option>{MATH_TOPICS.map((t, i) => <option key={i} value={t}>{t}</option>)}</select></div>
      <button className="btn btn-primary" onClick={gen} disabled={load} style={{ marginBottom: 24 }}>{load ? <><Spinner /> Generating...</> : "⚡ Generate Question + Figure"}</button>
      {(figure || q) && <div className="card fade-in">
        <MathFigure figureText={figure} />
        {q && <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.85, marginBottom: 20, fontSize: 14 }}>{q}</div>}
        <textarea rows={8} placeholder="Show all working step by step..." value={ans} onChange={e => setAns(e.target.value)} />
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <button className="btn btn-success" onClick={submit} disabled={load || !ans.trim()}>{load ? <><Spinner /> Evaluating...</> : "✓ Submit"}</button>
          <button className="btn btn-secondary" onClick={gen} disabled={load}>Next →</button>
        </div>
        {score != null && <div style={{ marginTop: 12 }}><ScoreChip score={score} /></div>}
        <FeedbackBox text={fb} />
      </div>}
    </div>
  );
}

function MathExam({ onScore, grade }) {
  const [phase, setPhase] = useState("start"); const [qs, setQs] = useState([]); const [ans, setAns] = useState({}); const [cur, setCur] = useState(0); const [res, setRes] = useState(null); const [load, setLoad] = useState(false);
  async function start() {
    setLoad(true);
    const sample = [...MATH_TOPICS].sort(() => Math.random() - 0.5).slice(0, 5); const questions = [];
    for (const t of sample) {
      const result = await callAI(`IB MYP${grade} Math exam question with ASCII figure.\nFORMAT:\n---FIGURE---\n[ASCII diagram]\n---QUESTION---\n[question]\nMARKS: [4-8]\nCRITERION: [A/C/D]\n---END---`, `Topic: ${t}`);
      const figMatch = result.match(/---FIGURE---\n([\s\S]*?)---QUESTION---/); const qMatch = result.match(/---QUESTION---\n([\s\S]*?)---END---/);
      questions.push({ text: qMatch ? qMatch[1].trim() : result, topic: t, figure: figMatch ? figMatch[1].trim() : null });
    }
    setQs(questions); setAns({}); setCur(0); setPhase("exam"); setLoad(false);
  }
  async function submit() {
    setLoad(true); const results = [];
    for (let i = 0; i < qs.length; i++) {
      const r = await callAI(`IB MYP${grade} Math. Score out of 8. Format:\nSCORE: X/8\nCRITERION: [A/C/D]\nFEEDBACK: [detailed]\nMODEL ANSWER: [steps]`, `Q: ${qs[i].text}\nAnswer: ${ans[i] || "(blank)"}`);
      const s = parseInt(r.match(/SCORE:\s*(\d)/)?.[1] || "0"); results.push({ q: qs[i], feedback: r, score: s }); onScore?.(s);
    }
    setRes(results); setPhase("results"); setLoad(false);
  }
  if (phase === "start") return <div className="card fade-in" style={{ textAlign: "center", padding: 48 }}><div style={{ fontSize: 52, marginBottom: 16 }}>📋</div><h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Mathematics Practice Exam</h3><p style={{ color: "#6B7280", marginBottom: 6 }}>5 questions with figures · 1 hour · MYP {grade}</p><button className="btn btn-primary" onClick={start} disabled={load} style={{ fontSize: 16, padding: "14px 32px", marginTop: 16 }}>{load ? <><Spinner /> Building...</> : "🚀 Begin Exam"}</button></div>;
  if (phase === "exam") return <div className="fade-in"><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1A1D26", padding: "14px 20px", borderRadius: 12, marginBottom: 20, flexWrap: "wrap", gap: 10 }}><span style={{ fontWeight: 600 }}>Q{cur + 1} of {qs.length}</span><TimerComp seconds={3600} onEnd={submit} /><span style={{ fontSize: 13, color: "#6B7280" }}>{Object.keys(ans).length}/{qs.length} answered</span></div><div className="card"><MathFigure figureText={qs[cur]?.figure} /><div style={{ whiteSpace: "pre-wrap", lineHeight: 1.85, marginBottom: 20, fontSize: 14 }}>{qs[cur]?.text}</div><textarea rows={8} placeholder="Show all working..." value={ans[cur] || ""} onChange={e => setAns(p => ({ ...p, [cur]: e.target.value }))} /><div style={{ display: "flex", gap: 10, marginTop: 14 }}>{cur > 0 && <button className="btn btn-secondary" onClick={() => setCur(c => c - 1)}>← Prev</button>}{cur < qs.length - 1 ? <button className="btn btn-primary" onClick={() => setCur(c => c + 1)} disabled={!ans[cur]?.trim()}>Next →</button> : <button className="btn btn-success" onClick={submit} disabled={load || !ans[cur]?.trim()}>{load ? <><Spinner /> Grading...</> : "✓ Submit"}</button>}</div></div></div>;
  const avg = res ? Math.round(res.reduce((a, b) => a + b.score, 0) / res.length) : 0;
  return <div className="fade-in"><div className="card" style={{ textAlign: "center", marginBottom: 24, padding: 36 }}><div style={{ fontSize: 44, marginBottom: 10 }}>{avg >= 6 ? "🏆" : avg >= 4 ? "📈" : "💪"}</div><h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Exam Complete!</h3><div style={{ fontSize: 44, fontWeight: 800, color: avg >= 6 ? "#06D6A0" : "#EF476F", margin: "8px 0" }}>{avg}/8</div><button className="btn btn-primary" onClick={() => setPhase("start")} style={{ marginTop: 20 }}>🔄 Retake</button></div>{res.map((r, i) => <div key={i} className="card" style={{ marginBottom: 14 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><span style={{ fontWeight: 600 }}>Q{i + 1} – {r.q.topic.slice(0, 40)}</span><ScoreChip score={r.score} /></div><MathFigure figureText={r.q.figure} /><FeedbackBox text={r.feedback} /></div>)}</div>;
}

function MathPage({ onScore, grade, difficulty }) {
  const [tab, setTab] = useState("notes");
  return <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}><div style={{ marginBottom: 24 }}><h2 style={{ fontSize: 26, fontWeight: 800 }}>📐 Mathematics</h2><p style={{ color: "#6B7280", fontSize: 14 }}>Criteria A · C · D · {MYP_GRADES[grade]}</p></div><CustomPromptBox subject="Mathematics" grade={grade} /><div className="tab-row">{[["notes", "📝 Notes"], ["practice", "🎯 Practice"], ["exam", "📋 Exam"], ["mynotes", "📓 My Notes"]].map(([t, l]) => <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{l}</button>)}</div>{tab === "notes" && <div className="fade-in">{MATH_TOPICS.map((t, i) => <div key={i} className="card" style={{ marginBottom: 10, display: "flex", gap: 12 }}><span className="badge" style={{ background: "#6C63FF22", color: "#6C63FF", flexShrink: 0, marginTop: 2 }}>T{i + 1}</span><span style={{ fontSize: 14 }}>{t}</span></div>)}</div>}{tab === "practice" && <MathPractice onScore={s => onScore("math", s)} grade={grade} difficulty={difficulty} />}{tab === "exam" && <MathExam onScore={s => onScore("math", s)} grade={grade} />}{tab === "mynotes" && <NotesSection subject="math" />}</div>;
}

// ── ENGLISH ──────────────────────────────────────────────────────────────────
function EnglishAnalysis({ onScore, grade, difficulty }) {
  const [mode, setMode] = useState("text"); const [q, setQ] = useState(null); const [image, setImage] = useState(null);
  const [ans, setAns] = useState(""); const [fb, setFb] = useState(null); const [load, setLoad] = useState(false); const [score, setScore] = useState(null);
  async function genText() {
    setLoad(true); setFb(null); setAns(""); setScore(null); setImage(null);
    const theme = rnd(SCIFI_THEMES); const cmdTerm = rnd(["Analyse", "Evaluate", "Examine", "Discuss"]); const focus = rnd(["imagery", "symbolism", "tone and mood", "characterisation", "narrative voice", "setting", "conflict"]);
    const diffNote = difficulty === "easy" ? "Keep language accessible. Provide some guidance in the question." : difficulty === "hard" ? "Use complex vocabulary. Make it challenging exam level." : "";
    const r = await callAI(`IB MYP ${grade} English teacher. Generate a SHORT unseen sci-fi/dystopian extract (5-8 sentences) on theme: "${theme}". ${diffNote}\nFORMAT:\nEXTRACT:\n[original vivid text]\n\nQUESTION:\n${cmdTerm} how the author uses ${focus} in the extract. (8 marks)\nCRITERION: A`, "Generate varied English analysis");
    setQ(r); setLoad(false);
  }
  async function genImage() {
    setLoad(true); setFb(null); setAns(""); setScore(null); setQ(null);
    const img = rnd(ENGLISH_IMAGES); setImage(img);
    const cmdTerm = rnd(["Analyse", "Evaluate", "Examine"]); const focus = rnd(["mood and atmosphere", "symbolism", "contrast and tension", "the human element", "light and darkness"]);
    setQ(`IMAGE ANALYSIS TASK\n\nStudy the image: "${img.title}"\nContext: ${img.context}\n\n${cmdTerm} how the visual elements create ${focus}. Refer to specific details — colour, composition, subject, symbolism. Connect to sci-fi themes.\n\n(8 marks) — Criterion A`);
    setLoad(false);
  }
  async function submit() {
    setLoad(true);
    const r = await callAI(`IB MYP${grade} English Criterion A examiner. Score out of 8. Format:\nSCORE: X/8\nSTRAND BREAKDOWN:\n- Strand i: X/2\n- Strand ii: X/2\n- Strand iii: X/2\n- Strand iv: X/2\nFEEDBACK: [specific]\nWHAT WENT WELL: [2-3]\nEVEN BETTER IF: [2-3]`, `Task:\n${q}\n\nResponse:\n${ans}`);
    setFb(r); const s = parseInt(r.match(/SCORE:\s*(\d)/)?.[1] || "0"); setScore(s); onScore?.(s); setLoad(false);
  }
  return <div className="fade-in"><div style={{ display: "flex", gap: 8, marginBottom: 20 }}><button className={`btn ${mode === "text" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("text")}>📝 Text Extract</button><button className={`btn ${mode === "image" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("image")}>🖼️ Image Analysis</button></div><button className="btn btn-primary" onClick={mode === "text" ? genText : genImage} disabled={load} style={{ marginBottom: 24 }}>{load ? <><Spinner /> Generating...</> : mode === "text" ? "⚡ Generate Text" : "⚡ Generate Image Task"}</button>{(q || image) && <div className="card fade-in">{image && <ImageDisplay url={image.url} title={image.title} caption="Study this image carefully." />}{q && <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.85, marginBottom: 20, fontSize: 14, borderLeft: image ? "3px solid #118AB2" : "none", paddingLeft: image ? 16 : 0 }}>{q}</div>}<textarea rows={10} placeholder="Write your analysis..." value={ans} onChange={e => setAns(e.target.value)} /><div style={{ display: "flex", gap: 10, marginTop: 12 }}><button className="btn btn-success" onClick={submit} disabled={load || !ans.trim()}>{load ? <><Spinner /> Evaluating...</> : "✓ Submit"}</button><button className="btn btn-secondary" onClick={mode === "text" ? genText : genImage} disabled={load}>Next →</button></div>{score != null && <div style={{ marginTop: 12 }}><ScoreChip score={score} /></div>}<FeedbackBox text={fb} /></div>}</div>;
}

function WritingPractice({ onScore, grade, difficulty }) {
  const [type, setType] = useState("story"); const [q, setQ] = useState(null); const [ans, setAns] = useState(""); const [fb, setFb] = useState(null); const [load, setLoad] = useState(false); const [score, setScore] = useState(null);
  async function gen() {
    setLoad(true); setFb(null); setAns(""); setScore(null);
    const theme = rnd(SCIFI_THEMES);
    const diffNote = difficulty === "easy" ? "Provide an opening sentence to help the student start." : difficulty === "hard" ? "Provide minimal scaffolding. Exam conditions." : "";
    const r = await callAI(`IB MYP${grade} English teacher. Generate a VARIED creative writing prompt for a ${type}. Theme: ${theme}. ${diffNote}\nFormat:\nTASK TYPE: ${type.toUpperCase()}\nPROMPT: [vivid specific prompt]\nREQUIREMENTS:\n- Word count: 300-500\n- [2-3 specific elements]`, `Generate ${type} prompt`);
    setQ(r); setLoad(false);
  }
  async function submit() {
    setLoad(true);
    const r = await callAI(`IB MYP${grade} English Criterion C examiner. Score out of 8. Format:\nSCORE: X/8\nBREAKDOWN:\n- Purpose/Audience: X/2\n- Language Choices: X/2\n- Text type features: X/2\n- Style/Voice: X/2\nFEEDBACK:\nSTRENGTHS: [2-3]\nIMPROVEMENTS: [2-3]`, `Prompt:\n${q}\n\nWriting:\n${ans}`);
    setFb(r); const s = parseInt(r.match(/SCORE:\s*(\d)/)?.[1] || "0"); setScore(s); onScore?.(s); setLoad(false);
  }
  const wc = ans.trim() ? ans.trim().split(/\s+/).length : 0;
  return <div className="fade-in"><div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>{[["story", "📖 Story"], ["journal", "📔 Journal"], ["dialogue", "💬 Dialogue"], ["monologue", "🎭 Monologue"]].map(([t, l]) => <button key={t} className={`btn ${type === t ? "btn-primary" : "btn-secondary"}`} onClick={() => setType(t)}>{l}</button>)}</div><button className="btn btn-primary" onClick={gen} disabled={load} style={{ marginBottom: 24 }}>{load ? <><Spinner /> Generating...</> : "⚡ Generate Prompt"}</button>{q && <div className="card fade-in"><div style={{ whiteSpace: "pre-wrap", lineHeight: 1.85, marginBottom: 20, fontSize: 14 }}>{q}</div><textarea rows={12} placeholder="Write your response (300-500 words)..." value={ans} onChange={e => setAns(e.target.value)} /><div style={{ fontSize: 12, color: "#6B7280", marginTop: 6 }}>Words: {wc}</div><div style={{ display: "flex", gap: 10, marginTop: 12 }}><button className="btn btn-success" onClick={submit} disabled={load || wc < 50}>{load ? <><Spinner /> Evaluating...</> : "✓ Submit"}</button><button className="btn btn-secondary" onClick={gen} disabled={load}>New Prompt →</button></div>{score != null && <div style={{ marginTop: 12 }}><ScoreChip score={score} /></div>}<FeedbackBox text={fb} /></div>}</div>;
}

function EnglishPage({ onScore, grade, difficulty }) {
  const [tab, setTab] = useState("notes");
  return <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}><div style={{ marginBottom: 24 }}><h2 style={{ fontSize: 26, fontWeight: 800 }}>📖 Language & Literature</h2><p style={{ color: "#6B7280", fontSize: 14 }}>Criteria A · C · D · {MYP_GRADES[grade]}</p></div><CustomPromptBox subject="English Language & Literature" grade={grade} /><div className="tab-row">{[["notes", "📝 Notes"], ["analysis", "🔍 Analysis (A)"], ["writing", "✍️ Writing (C)"], ["mynotes", "📓 My Notes"]].map(([t, l]) => <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{l}</button>)}</div>{tab === "notes" && <div className="fade-in">{ENG_NOTES_DATA.map((n, i) => <div key={i} className="card" style={{ marginBottom: 14 }}><h3 style={{ color: "#118AB2", fontWeight: 700, marginBottom: 10 }}>{n.title}</h3><ul style={{ paddingLeft: 20, lineHeight: 2.1 }}>{n.pts.map((p, j) => <li key={j} style={{ fontSize: 14 }}>{p}</li>)}</ul></div>)}</div>}{tab === "analysis" && <EnglishAnalysis onScore={s => onScore("english", s)} grade={grade} difficulty={difficulty} />}{tab === "writing" && <WritingPractice onScore={s => onScore("english", s)} grade={grade} difficulty={difficulty} />}{tab === "mynotes" && <NotesSection subject="english" />}</div>;
}

// ── SCIENCES ─────────────────────────────────────────────────────────────────
function SciQuiz({ subject, topics, onScore, grade, difficulty }) {
  const [qType, setQType] = useState("mcq"); const [q, setQ] = useState(null); const [ans, setAns] = useState(""); const [fb, setFb] = useState(null); const [load, setLoad] = useState(false); const [score, setScore] = useState(null);
  async function gen() {
    setLoad(true); setFb(null); setAns(""); setScore(null);
    const t = rnd(topics);
    const diffNote = difficulty === "easy" ? "Keep it straightforward with hints." : difficulty === "hard" ? "Make it challenging, exam level." : "";
    const r = await callAI(`IB MYP${grade} ${subject} teacher. Generate a ${qType === "mcq" ? "multiple choice question (4 options A-D, mark CORRECT)" : "structured short answer question"}. ${diffNote} Use IB command terms.\nFormat:\nTOPIC: ${t}\nQUESTION: [question]\n${qType === "mcq" ? "A) \nB) \nC) \nD) \nCORRECT: [A/B/C/D]" : "MARKS: [2-4]"}`, `Topic: ${t}`);
    setQ(r); setLoad(false);
  }
  async function submit() {
    setLoad(true); let r;
    if (qType === "mcq") {
      const correct = q.match(/CORRECT:\s*([ABCD])/)?.[1]; const ok = ans.toUpperCase().trim() === correct;
      const exp = await callAI(`Explain in 3-4 sentences why ${correct} is correct for this ${subject} question.`, q);
      r = `SCORE: ${ok ? "8" : "0"}/8\nFEEDBACK: ${ok ? "✅ Correct!" : `❌ Incorrect. Answer was ${correct}.`}\n\nEXPLANATION:\n${exp}`;
    } else {
      r = await callAI(`IB MYP${grade} Science examiner. Score out of 8. Format:\nSCORE: X/8\nFEEDBACK: [specific]`, `Q: ${q}\nAnswer: ${ans}`);
    }
    setFb(r); const s = parseInt(r.match(/SCORE:\s*(\d)/)?.[1] || "0"); setScore(s); onScore?.(s); setLoad(false);
  }
  return <div className="fade-in"><div style={{ display: "flex", gap: 8, marginBottom: 20 }}><button className={`btn ${qType === "mcq" ? "btn-primary" : "btn-secondary"}`} onClick={() => setQType("mcq")}>MCQ</button><button className={`btn ${qType === "short" ? "btn-primary" : "btn-secondary"}`} onClick={() => setQType("short")}>Short Answer</button></div><button className="btn btn-primary" onClick={gen} disabled={load} style={{ marginBottom: 24 }}>{load ? <><Spinner /> Generating...</> : "⚡ Generate Question"}</button>{q && <div className="card fade-in"><div style={{ whiteSpace: "pre-wrap", lineHeight: 1.85, marginBottom: 20, fontSize: 14 }}>{q}</div>{qType === "mcq" ? <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{["A", "B", "C", "D"].map(o => <button key={o} className={`btn ${ans === o ? "btn-primary" : "btn-secondary"}`} onClick={() => setAns(o)} style={{ justifyContent: "flex-start" }}>{o}</button>)}</div> : <textarea rows={5} placeholder="Write your answer..." value={ans} onChange={e => setAns(e.target.value)} />}<div style={{ display: "flex", gap: 10, marginTop: 12 }}><button className="btn btn-success" onClick={submit} disabled={load || !ans.trim()}>{load ? <><Spinner /> Checking...</> : "✓ Submit"}</button><button className="btn btn-secondary" onClick={gen} disabled={load}>Next →</button></div>{score != null && <div style={{ marginTop: 12 }}><ScoreChip score={score} /></div>}<FeedbackBox text={fb} /></div>}</div>;
}

function SciencesPage({ onScore, grade, difficulty }) {
  const [tab, setTab] = useState("biology"); const [mode, setMode] = useState("notes");
  const sciColors = { biology: "#06D6A0", physics: "#118AB2", chemistry: "#FFD166" };
  return <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}><div style={{ marginBottom: 24 }}><h2 style={{ fontSize: 26, fontWeight: 800 }}>🔬 Integrated Sciences</h2><p style={{ color: "#6B7280", fontSize: 14 }}>Criteria A · D · {MYP_GRADES[grade]}</p></div><CustomPromptBox subject="Integrated Sciences" grade={grade} /><div className="tab-row">{[["biology", "🌿 Biology"], ["physics", "💡 Physics"], ["chemistry", "⚗️ Chemistry"], ["mynotes", "📓 My Notes"]].map(([t, l]) => <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => { setTab(t); setMode("notes"); }}>{l}</button>)}</div>{tab !== "mynotes" ? <><div className="tab-row"><button className={`tab ${mode === "notes" ? "active" : ""}`} onClick={() => setMode("notes")}>📝 Notes</button><button className={`tab ${mode === "quiz" ? "active" : ""}`} onClick={() => setMode("quiz")}>🎯 Quiz</button></div>{mode === "notes" && <div className="fade-in">{SCI_TOPICS[tab].map((t, i) => <div key={i} className="card" style={{ marginBottom: 10, display: "flex", gap: 12 }}><span className="badge" style={{ background: sciColors[tab] + "22", color: sciColors[tab], flexShrink: 0, marginTop: 2 }}>{i + 1}</span><span style={{ fontSize: 14 }}>{t}</span></div>)}</div>}{mode === "quiz" && <SciQuiz subject={tab} topics={SCI_TOPICS[tab]} onScore={s => onScore("sciences", s)} grade={grade} difficulty={difficulty} />}</> : <NotesSection subject="sciences" />}</div>;
}

// ── SPANISH ──────────────────────────────────────────────────────────────────
function SpanishReading({ onScore, grade }) {
  const [data, setData] = useState(null); const [ans, setAns] = useState({}); const [fb, setFb] = useState(null); const [load, setLoad] = useState(false); const [score, setScore] = useState(null);
  const topics = ["el tiempo","la contaminación del aire","el reciclaje","los animales en peligro","el cambio climático","la energía renovable","la basura plástica","las inundaciones"];
  async function gen() {
    setLoad(true); setFb(null); setAns({}); setScore(null);
    const r = await callAI(`IB MYP${grade} Spanish A1-A2 reading comprehension on: ${rnd(topics)}. Vary scenario each time.\nFormat:\nTEXTO:\n[80-120 word Spanish text]\n\nQ1. [MCQ A,B,C,D]\nQ2. [MCQ A,B,C,D]\nQ3. [Short answer in Spanish]\nQ4. [Short answer in Spanish]\nQ5. [True/False]\nQ6. [True/False]`, "Generate varied Spanish reading");
    setData(r); setLoad(false);
  }
  async function submit() {
    setLoad(true);
    const r = await callAI("IB MYP3 Spanish Criterion B. Score out of 8. Format:\nSCORE: X/8\nCORRECT ANSWERS:\nFEEDBACK:", `Text:\n${data}\n\nAnswers:\n${Object.entries(ans).map(([i, a]) => `Q${parseInt(i) + 1}: ${a}`).join("\n")}`);
    setFb(r); const s = parseInt(r.match(/SCORE:\s*(\d)/)?.[1] || "0"); setScore(s); onScore?.(s); setLoad(false);
  }
  return <div className="fade-in"><button className="btn btn-primary" onClick={gen} disabled={load} style={{ marginBottom: 24 }}>{load ? <><Spinner /> Generating...</> : "⚡ Generate Reading Exercise"}</button>{data && <div className="card fade-in"><div style={{ whiteSpace: "pre-wrap", lineHeight: 1.85, marginBottom: 24, fontSize: 14 }}>{data}</div>{[0, 1, 2, 3, 4, 5].map(i => <div key={i} style={{ marginBottom: 12 }}><label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 6 }}>Q{i + 1}</label><input type="text" placeholder="Tu respuesta..." value={ans[i] || ""} onChange={e => setAns(p => ({ ...p, [i]: e.target.value }))} /></div>)}<div style={{ display: "flex", gap: 10, marginTop: 16 }}><button className="btn btn-success" onClick={submit} disabled={load}>{load ? <><Spinner /> Evaluating...</> : "✓ Submit"}</button><button className="btn btn-secondary" onClick={gen} disabled={load}>Next →</button></div>{score != null && <div style={{ marginTop: 12 }}><ScoreChip score={score} /></div>}<FeedbackBox text={fb} /></div>}</div>;
}

function SpanishWriting({ onScore, grade }) {
  const [q, setQ] = useState(null); const [ans, setAns] = useState(""); const [fb, setFb] = useState(null); const [load, setLoad] = useState(false); const [score, setScore] = useState(null);
  const raftTopics = ["la contaminación del río local","la deforestación","el uso excesivo del plástico","el smog en las ciudades","el cambio climático en los océanos","la importancia del reciclaje","los animales en peligro"];
  async function gen() {
    setLoad(true); setFb(null); setAns(""); setScore(null);
    const topic = rnd(raftTopics);
    const r = await callAI(`IB MYP${grade} Spanish RAFT prompt A1-A2. Topic: ${topic}. Different role/audience each time.\nFormat:\nROL: [role]\nAUDIENCIA: [audience]\nFORMATO: Blog post\nTEMA: ${topic}\nTAREA: Escribe un blog de 100-150 palabras.\nPALABRAS CLAVE: [6-8 words]\nFRASES ÚTILES: [3-4 starters]`, "Generate RAFT");
    setQ(r); setLoad(false);
  }
  async function submit() {
    setLoad(true);
    const r = await callAI(`IB MYP${grade} Spanish Criterion D. A1-A2 blog. Score out of 8. Format:\nSCORE: X/8\nFEEDBACK:\nGRAMMAR CORRECTIONS:`, `Prompt:\n${q}\n\nBlog:\n${ans}`);
    setFb(r); const s = parseInt(r.match(/SCORE:\s*(\d)/)?.[1] || "0"); setScore(s); onScore?.(s); setLoad(false);
  }
  const wc = ans.trim() ? ans.trim().split(/\s+/).length : 0;
  return <div className="fade-in"><button className="btn btn-primary" onClick={gen} disabled={load} style={{ marginBottom: 24 }}>{load ? <><Spinner /> Generating...</> : "⚡ Generate RAFT Prompt"}</button>{q && <div className="card fade-in"><div style={{ whiteSpace: "pre-wrap", lineHeight: 1.85, marginBottom: 20, fontSize: 14 }}>{q}</div><textarea rows={10} placeholder="Escribe tu blog aquí..." value={ans} onChange={e => setAns(e.target.value)} /><div style={{ fontSize: 12, color: "#6B7280", marginTop: 6 }}>Palabras: {wc}</div><div style={{ display: "flex", gap: 10, marginTop: 12 }}><button className="btn btn-success" onClick={submit} disabled={load || wc < 30}>{load ? <><Spinner /> Evaluating...</> : "✓ Submit"}</button><button className="btn btn-secondary" onClick={gen} disabled={load}>New →</button></div>{score != null && <div style={{ marginTop: 12 }}><ScoreChip score={score} /></div>}<FeedbackBox text={fb} /></div>}</div>;
}

function SpanishSpeaking({ onScore, grade }) {
  const [phase, setPhase] = useState("idle"); const [image, setImage] = useState(null); const [notes, setNotes] = useState(""); const [speech, setSpeech] = useState(""); const [followups, setFollowups] = useState([]); const [followupAnswers, setFollowupAnswers] = useState({}); const [fb, setFb] = useState(null); const [load, setLoad] = useState(false); const [score, setScore] = useState(null);
  function startSession() { const img = rnd(SPANISH_IMAGES); setImage(img); setNotes(""); setSpeech(""); setFollowups([]); setFollowupAnswers({}); setFb(null); setScore(null); setPhase("prep"); }
  async function submitSpeech() {
    setLoad(true);
    const fqs = await callAI(`IB MYP${grade} Spanish oral exam. Student spoke about: ${image.title}. Generate EXACTLY 3 follow-up questions in Spanish at A1-A2 level.\nFormat:\nPREGUNTA 1: [question]\nPREGUNTA 2: [question]\nPREGUNTA 3: [question]`, `Image: ${image.title}`);
    const q1 = fqs.match(/PREGUNTA 1:\s*(.+)/)?.[1] || "¿Qué ves en la imagen?";
    const q2 = fqs.match(/PREGUNTA 2:\s*(.+)/)?.[1] || "¿Qué piensas sobre este problema?";
    const q3 = fqs.match(/PREGUNTA 3:\s*(.+)/)?.[1] || "¿Cómo puedes ayudar?";
    setFollowups([q1, q2, q3]); setLoad(false); setPhase("followup");
  }
  async function submitAll() {
    setLoad(true);
    const answersStr = followups.map((q, i) => `Q: ${q}\nA: ${followupAnswers[i] || "(no answer)"}`).join("\n\n");
    const r = await callAI(`IB MYP${grade} Spanish Criterion C examiner. A1-A2. Score out of 8.\nFormat:\nSCORE: X/8\nCRITERION C BREAKDOWN:\n- Message clarity: X/2\n- Vocabulary range: X/2\n- Grammar accuracy: X/2\n- Interactive competence: X/2\nFEEDBACK:\nSTRENGTHS: [2-3]\nIMPROVEMENTS: [2-3]`, `Image: ${image.title}\n\nSpeech:\n${speech}\n\nFollow-up:\n${answersStr}`);
    setFb(r); const s = parseInt(r.match(/SCORE:\s*(\d)/)?.[1] || "0"); setScore(s); onScore?.(s); setPhase("results"); setLoad(false);
  }
  const speechWc = speech.trim() ? speech.trim().split(/\s+/).length : 0;
  if (phase === "idle") return <div className="card fade-in" style={{ textAlign: "center", padding: 48 }}><div style={{ fontSize: 52, marginBottom: 16 }}>🎤</div><h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Spanish Oral Exam Simulation</h3><div style={{ color: "#6B7280", marginBottom: 24, lineHeight: 1.9, textAlign: "left", background: "#12141A", borderRadius: 12, padding: 20 }}><strong style={{ color: "#FFD166" }}>How it works:</strong><br />1️⃣ Random image about weather or environment<br />2️⃣ 10 minutes preparation time<br />3️⃣ Speak about the image in Spanish (2-3 min)<br />4️⃣ Answer 3 follow-up questions<br />5️⃣ Full IB Criterion C score and feedback</div><button className="btn btn-warn" onClick={startSession} style={{ fontSize: 16, padding: "14px 32px" }}>🎲 Get Random Image & Begin</button></div>;
  if (phase === "prep") return <div className="fade-in"><ImageDisplay url={image.url} title={image.title} caption={`Tema: ${image.topic} · Keywords: ${image.keywords}`} /><div className="prep-box"><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}><div><div style={{ fontWeight: 700, color: "#FFD166" }}>⏱ Preparation — 10 minutes</div><div style={{ fontSize: 13, color: "#6B7280" }}>Plan your speech below</div></div><CountdownTimer seconds={600} label="PREP TIME" color="#FFD166" /></div></div><div className="card" style={{ marginBottom: 16 }}><label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 8 }}>📝 PREPARATION NOTES (not marked)</label><textarea rows={5} placeholder="Plan your speech here..." value={notes} onChange={e => setNotes(e.target.value)} /></div><button className="btn btn-primary" onClick={() => setPhase("speak")} style={{ width: "100%", justifyContent: "center", padding: 14 }}>I'm Ready — Start Speaking →</button></div>;
  if (phase === "speak") return <div className="fade-in"><ImageDisplay url={image.url} title={image.title} caption="Refer to this image" /><div className="record-box"><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}><div><div style={{ fontWeight: 700, color: "#EF476F" }}>🎤 Speaking Time — 2-3 minutes</div><div style={{ fontSize: 13, color: "#6B7280" }}>Write your speech in Spanish (150-250 words)</div></div><CountdownTimer seconds={180} label="SPEAKING TIME" color="#EF476F" /></div></div><textarea rows={10} placeholder="Habla sobre la imagen en español..." value={speech} onChange={e => setSpeech(e.target.value)} style={{ marginBottom: 8 }} /><div style={{ fontSize: 12, color: "#6B7280", marginBottom: 16 }}>Palabras: {speechWc}</div><button className="btn btn-success" onClick={submitSpeech} disabled={load || speechWc < 15} style={{ width: "100%", justifyContent: "center", padding: 14 }}>{load ? <><Spinner /> Preparing questions...</> : "✓ Done Speaking →"}</button></div>;
  if (phase === "followup") return <div className="fade-in"><div style={{ background: "#6C63FF11", border: "1px solid #6C63FF33", borderRadius: 12, padding: 16, marginBottom: 24 }}><div style={{ fontWeight: 700, color: "#6C63FF", marginBottom: 4 }}>💬 Teacher Follow-Up Questions</div><div style={{ fontSize: 13, color: "#6B7280" }}>Answer in Spanish. 1-3 sentences each.</div></div>{followups.map((q, i) => <div key={i} className="card" style={{ marginBottom: 16 }}><div style={{ fontWeight: 600, color: "#FFD166", marginBottom: 8 }}>{i + 1}. {q}</div><textarea rows={3} placeholder="Tu respuesta..." value={followupAnswers[i] || ""} onChange={e => setFollowupAnswers(p => ({ ...p, [i]: e.target.value }))} /></div>)}<button className="btn btn-success" onClick={submitAll} disabled={load} style={{ width: "100%", justifyContent: "center", padding: 14 }}>{load ? <><Spinner /> Evaluating...</> : "✓ Submit — Get Score & Feedback"}</button></div>;
  return <div className="fade-in"><div className="card" style={{ textAlign: "center", marginBottom: 24, padding: 36 }}><div style={{ fontSize: 44, marginBottom: 10 }}>{score >= 6 ? "🏆" : score >= 4 ? "📈" : "💪"}</div><h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Oral Complete!</h3><div style={{ fontSize: 44, fontWeight: 800, color: score >= 6 ? "#06D6A0" : "#EF476F", margin: "10px 0" }}>{score}/8</div><button className="btn btn-warn" onClick={() => { setPhase("idle"); setImage(null); }} style={{ marginTop: 16 }}>🎲 Try New Image</button></div>{image && <ImageDisplay url={image.url} title={image.title} />}<FeedbackBox text={fb} /></div>;
}

function SpanishPage({ onScore, grade, difficulty }) {
  const [tab, setTab] = useState("reading");
  return <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}><div style={{ marginBottom: 24 }}><h2 style={{ fontSize: 26, fontWeight: 800 }}>🌍 Spanish</h2><p style={{ color: "#6B7280", fontSize: 14 }}>Criteria B · C · D · {MYP_GRADES[grade]}</p></div><CustomPromptBox subject="Spanish" grade={grade} /><div className="tab-row">{[["reading", "📖 Lectura (B)"], ["writing", "✍️ Escritura (D)"], ["speaking", "🎤 Oral (C)"], ["mynotes", "📓 My Notes"]].map(([t, l]) => <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{l}</button>)}</div>{tab === "reading" && <SpanishReading onScore={s => onScore("spanish", s)} grade={grade} />}{tab === "writing" && <SpanishWriting onScore={s => onScore("spanish", s)} grade={grade} />}{tab === "speaking" && <SpanishSpeaking onScore={s => onScore("spanish", s)} grade={grade} />}{tab === "mynotes" && <NotesSection subject="spanish" />}</div>;
}

// ── I&S ──────────────────────────────────────────────────────────────────────
function ISPractice({ onScore, grade, difficulty }) {
  const [crit, setCrit] = useState("B"); const [q, setQ] = useState(null); const [ans, setAns] = useState(""); const [fb, setFb] = useState(null); const [load, setLoad] = useState(false); const [score, setScore] = useState(null);
  async function gen() {
    setLoad(true); setFb(null); setAns(""); setScore(null);
    const topic = rnd(IS_TOPICS); const cmdsB = ["Describe", "Explain", "Compare", "Outline", "Analyse"]; const cmdsD = ["Evaluate", "Discuss", "Examine", "Justify", "Assess"];
    const cmd = crit === "B" ? rnd(cmdsB) : rnd(cmdsD);
    const diffNote = difficulty === "easy" ? "Provide some guiding bullet points." : difficulty === "hard" ? "No hints. Exam conditions." : "";
    const r = await callAI(`IB MYP${grade} I&S teacher. Criterion ${crit} question. Topic: ${topic}. Command term: ${cmd}. ${diffNote}\nFormat:\nCRITERION: ${crit}\nTOPIC: ${topic}\nQUESTION: [full question]\nMARKS: [4-8]`, `Topic: ${topic}`);
    setQ(r); setLoad(false);
  }
  async function submit() {
    setLoad(true);
    const r = await callAI(`IB MYP${grade} I&S Criterion ${crit} examiner. Score out of 8. Format:\nSCORE: X/8\nFEEDBACK:\nSTRENGTHS: [2-3]\nIMPROVEMENTS: [2-3]`, `Q:\n${q}\n\nAnswer:\n${ans}`);
    setFb(r); const s = parseInt(r.match(/SCORE:\s*(\d)/)?.[1] || "0"); setScore(s); onScore?.(s); setLoad(false);
  }
  return <div className="fade-in"><div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}><button className={`btn ${crit === "B" ? "btn-primary" : "btn-secondary"}`} onClick={() => setCrit("B")}>Criterion B</button><button className={`btn ${crit === "D" ? "btn-primary" : "btn-secondary"}`} onClick={() => setCrit("D")}>Criterion D</button></div><button className="btn btn-primary" onClick={gen} disabled={load} style={{ marginBottom: 24 }}>{load ? <><Spinner /> Generating...</> : "⚡ Generate Question"}</button>{q && <div className="card fade-in"><div style={{ whiteSpace: "pre-wrap", lineHeight: 1.85, marginBottom: 20, fontSize: 14 }}>{q}</div><textarea rows={8} placeholder="Write your structured response..." value={ans} onChange={e => setAns(e.target.value)} /><div style={{ display: "flex", gap: 10, marginTop: 12 }}><button className="btn btn-success" onClick={submit} disabled={load || !ans.trim()}>{load ? <><Spinner /> Evaluating...</> : "✓ Submit"}</button><button className="btn btn-secondary" onClick={gen} disabled={load}>Next →</button></div>{score != null && <div style={{ marginTop: 12 }}><ScoreChip score={score} /></div>}<FeedbackBox text={fb} /></div>}</div>;
}

function IndividualsPage({ onScore, grade, difficulty }) {
  const [tab, setTab] = useState("notes");
  return <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}><div style={{ marginBottom: 24 }}><h2 style={{ fontSize: 26, fontWeight: 800 }}>🌐 Individuals & Societies</h2><p style={{ color: "#6B7280", fontSize: 14 }}>Criteria B · D · {MYP_GRADES[grade]}</p></div><CustomPromptBox subject="Individuals & Societies" grade={grade} /><div className="tab-row">{[["notes", "📝 Notes"], ["practice", "🎯 Practice"], ["mynotes", "📓 My Notes"]].map(([t, l]) => <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{l}</button>)}</div>{tab === "notes" && <div className="fade-in"><div className="card" style={{ marginBottom: 16 }}><h3 style={{ color: "#EF476F", fontWeight: 700, marginBottom: 12 }}>Unit 4: Population Distribution</h3>{IS_TOPICS.slice(0, 8).map((t, i) => <div key={i} style={{ padding: "9px 0", borderBottom: "1px solid #252836", display: "flex", gap: 12 }}><span className="badge" style={{ background: "#EF476F22", color: "#EF476F", flexShrink: 0 }}>{i + 1}</span><span style={{ fontSize: 14 }}>{t}</span></div>)}</div><div className="card"><h3 style={{ color: "#118AB2", fontWeight: 700, marginBottom: 12 }}>Unit 5: Culture</h3>{IS_TOPICS.slice(8).map((t, i) => <div key={i} style={{ padding: "9px 0", borderBottom: "1px solid #252836", display: "flex", gap: 12 }}><span className="badge" style={{ background: "#118AB222", color: "#118AB2", flexShrink: 0 }}>{i + 1}</span><span style={{ fontSize: 14 }}>{t}</span></div>)}</div></div>}{tab === "practice" && <ISPractice onScore={s => onScore("individuals", s)} grade={grade} difficulty={difficulty} />}{tab === "mynotes" && <NotesSection subject="individuals" />}</div>;
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => loadData("user", null));
  const [scores, setScores] = useState({});
  const [subject, setSubject] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(() => loadData("settings", { grade: 3, difficulty: "standard", school: "Apeejay School International", name: "" }));

  function handleScore(subjectId, score) {
    setScores(prev => ({ ...prev, [subjectId]: [...(prev[subjectId] || []), score] }));
  }

  function handleLogin(u) {
    const fullUser = { ...u };
    setUser(fullUser); saveData("user", fullUser);
    setSettings(prev => ({ ...prev, name: u.name }));
  }

  function handleSaveSettings(newSettings) {
    setSettings(newSettings); saveData("settings", newSettings);
    if (newSettings.name && user) { const updatedUser = { ...user, name: newSettings.name }; setUser(updatedUser); saveData("user", updatedUser); }
  }

  const avgScores = {};
  Object.entries(scores).forEach(([id, arr]) => { if (arr.length) avgScores[id] = Math.round(arr.reduce((a, b) => a + b, 0) / arr.length); });

  const subjectProps = { grade: settings.grade, difficulty: settings.difficulty };

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", background: "#0A0B0F", color: "#E8E9F0" }}>
        {showSettings && <SettingsPanel settings={{ ...settings, name: user?.name || settings.name }} onSave={handleSaveSettings} onClose={() => setShowSettings(false)} />}

        {!user ? <AuthPage onLogin={handleLogin} /> : subject ? (
          <div>
            <div style={{ background: "#12141A", borderBottom: "1px solid #252836", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button className="btn btn-secondary" onClick={() => setSubject(null)} style={{ padding: "8px 14px" }}>← Home</button>
                <span style={{ color: "#6B7280", fontSize: 13 }}>{MYP_GRADES[settings.grade]} · {user.name}</span>
              </div>
              <button className="btn btn-secondary" onClick={() => setShowSettings(true)} style={{ padding: "7px 12px", fontSize: 12 }}>⚙️</button>
            </div>
            {subject === "math" && <MathPage onScore={handleScore} {...subjectProps} />}
            {subject === "english" && <EnglishPage onScore={handleScore} {...subjectProps} />}
            {subject === "sciences" && <SciencesPage onScore={handleScore} {...subjectProps} />}
            {subject === "spanish" && <SpanishPage onScore={handleScore} {...subjectProps} />}
            {subject === "individuals" && <IndividualsPage onScore={handleScore} {...subjectProps} />}
            {subject === "syllabus" && <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}><div style={{ marginBottom: 24 }}><h2 style={{ fontSize: 26, fontWeight: 800 }}>📄 Syllabus Study</h2><p style={{ color: "#6B7280", fontSize: 14 }}>Upload any syllabus or notes — AI generates questions and study plans from it</p></div><SyllabusStudy grade={settings.grade} /></div>}
          </div>
        ) : (
          <HomePage user={user} scores={avgScores} onSelect={setSubject} onLogout={() => { setUser(null); saveData("user", null); setSubject(null); }} onSettings={() => setShowSettings(true)} settings={settings} />
        )}
      </div>
    </>
  );
}
