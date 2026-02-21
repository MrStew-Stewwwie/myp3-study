import { useState, useEffect, useRef } from "react";

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
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-thumb { background: #252836; border-radius: 3px; }
`;

// ── VARIETY DATA ──────────────────────────────────────────────────────────────
const SCIFI_THEMES = [
  "a totalitarian surveillance state where all thoughts are monitored",
  "genetic engineering and designer humans in a corporate-controlled society",
  "virtual reality addiction in a dystopian megacity where nobody goes outside",
  "climate collapse and the last surviving underground civilization",
  "artificial intelligence that has taken control of all world governments",
  "time travel and the ethics of changing history",
  "underwater civilizations built after rising sea levels flooded Earth",
  "memory manipulation and stolen identity in a future police state",
  "a robot uprising and the philosophical question of machine consciousness",
  "post-apocalyptic wastelands and small tribal communities",
  "a world where sleep has been eliminated by mandatory medication",
  "teleportation technology that destroys and recreates the human body",
  "a society where aging has been cured but overpopulation is catastrophic",
  "children raised entirely by AI in state facilities, never knowing parents",
  "space colonists on Mars rebelling against Earth's corporate control",
  "a dystopia where emotions are illegal and chemically suppressed",
];

const ENGLISH_IMAGES = [
  { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80", title: "Circuit Board City", context: "A macro photograph of a glowing circuit board resembling an aerial view of a futuristic city — green pathways like roads, glowing nodes like buildings." },
  { url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80", title: "Robot and Human", context: "A humanoid robot stands beside a human silhouette, both looking toward a bright horizon. The robot's face is a mirror, reflecting the human's expression." },
  { url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80", title: "Earth from Space", context: "Planet Earth photographed from space, half illuminated, half in darkness. A single spacecraft — tiny against the vastness — orbits silently." },
  { url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80", title: "Digital Surveillance", context: "Dozens of security camera screens fill a wall, each showing a different person going about their daily life — unaware they are being watched." },
  { url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80", title: "Milky Way Horizon", context: "A lone human figure stands on a hilltop beneath a galaxy-filled sky. They hold a dim lantern — the only artificial light for miles." },
  { url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80", title: "Storm Over City", context: "Dramatic storm clouds spiral over a dense city skyline. Lightning forks illuminate skyscrapers. Streets below are flooded." },
];

const SPANISH_IMAGES = [
  { url: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&q=80", title: "Contaminación del aire", topic: "contaminación", keywords: "contaminación, smog, fábricas, chimeneas, humo, ciudad" },
  { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", title: "Bosque tropical", topic: "medio ambiente", keywords: "bosque, naturaleza, árboles, selva, biodiversidad, verde" },
  { url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80", title: "Tormenta", topic: "el tiempo", keywords: "tormenta, lluvia, relámpago, nubes, tiempo, viento" },
  { url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80", title: "Basura plástica", topic: "contaminación", keywords: "basura, plástico, contaminación, reciclaje, océano, residuos" },
  { url: "https://images.unsplash.com/photo-1542601906897-ecd4d0f5be14?w=800&q=80", title: "Energía solar", topic: "medio ambiente", keywords: "energía solar, paneles solares, renovable, electricidad, sostenible" },
  { url: "https://images.unsplash.com/photo-1565034946487-077786996e27?w=800&q=80", title: "Nieve e invierno", topic: "el tiempo", keywords: "nieve, invierno, frío, temperatura, montañas, hielo" },
  { url: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800&q=80", title: "Océano contaminado", topic: "contaminación", keywords: "océano, basura, peces, agua, plástico, mar" },
];

const MATH_TOPICS = ["Congruence of triangles – SSS, SAS, ASA, AAS","Similar triangles and scale factor","Transformations (translation, rotation, reflection, dilation)","Pythagoras' theorem, triplets and converse","Coordinate geometry – distance, midpoint, gradient","Graphing lines and equation from a graph","Area & perimeter of compound shapes","Arc length and area of sector","Surface area and volume of 3D solids","Composite solids and volume/capacity"];

const SCI_TOPICS = {
  biology: ["Structure & importance of plants and germination","Types of leaves","Photosynthesis – definition and word equation","Factors for photosynthesis (CO₂, water, light, chlorophyll)","Products of photosynthesis and their uses","Transpiration and stomata","Parasitic plants"],
  physics: ["Light waves and sound waves introduction","Sources of light and travel path","Production and transmission of sound","Role of vibrations in sound","Differences between sound and light waves","Reflection and refraction of light","Refractive index","Seismic waves and shadow zones","Sound in space"],
  chemistry: ["Word equations for chemical reactions","Energy changes in reactions","Metals and oxygen","Metals and acids","Metals and water","Displacement reactions","The reactivity series","Fuels and food energy"],
};

const IS_TOPICS = ["Pattern of global population change","Process of population change","Migration – push and pull factors","Demographic Transition Model (DTM) – all 5 stages","Population pyramids – analysis and interpretation","Case Study: Nigeria – rapid population growth","Case Study: Hong Kong – aging population","Case Study: Detroit – urban decline","Culture – definition and components","The Cultural Iceberg – visible vs invisible culture","Holidays, arts, food, clothing, architecture","Case Study: Mexico – cultural identity","Case Study: Grunge Music – counterculture movement","Multiculturalism – benefits and challenges","Conflicts threatening cultural identity"];

const ENG_NOTES = [
  { title: "Conventions of Sci-Fi Literature", pts: ["Futuristic or dystopian settings","Advanced technology (robots, spaceships, AI)","Alien beings or artificial intelligence","Social commentary on current issues","Speculative 'what if' scenarios"] },
  { title: "Sci-Fi Protagonist Traits", pts: ["Often an outsider or rebel","Questions authority and society","Undergoes significant transformation","Possesses special ability or knowledge"] },
  { title: "Dystopian Elements", pts: ["Oppressive government or ruling power","Loss of individual freedom","Propaganda and surveillance","Dehumanization of citizens","Fear used as control"] },
  { title: "IB Command Terms – Criterion A", pts: ["Analyse – examine in detail, identify and explain components","Evaluate – make judgement based on evidence","Examine – consider carefully and in detail","Identify – recognize and name","Discuss – offer a balanced review"] },
  { title: "Ender's Game – Key Themes", pts: ["Child soldiers and manipulation","War, morality, and leadership","Identity under extreme pressure","Isolation and psychological effects"] },
];

function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

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

// ── UI HELPERS ────────────────────────────────────────────────────────────────
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
  const [rem, setRem] = useState(seconds);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setRem(p => { if (p <= 1) { clearInterval(t); setDone(true); return 0; } return p - 1; }), 1000);
    return () => clearInterval(t);
  }, []);
  const d = `${String(Math.floor(rem / 60)).padStart(2, "0")}:${String(rem % 60).padStart(2, "0")}`;
  return (
    <div style={{ textAlign: "center", padding: "10px 18px", background: color + "11", border: `1px solid ${color}33`, borderRadius: 10 }}>
      <div style={{ fontSize: 10, color, fontWeight: 700, letterSpacing: 1, marginBottom: 2 }}>{label}</div>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: done ? "#EF476F" : color }}>{done ? "TIME'S UP!" : d}</div>
    </div>
  );
}

function ImageDisplay({ url, title, caption }) {
  const [err, setErr] = useState(false);
  if (err) return <div style={{ background: "#12141A", borderRadius: 14, padding: 32, marginBottom: 20, textAlign: "center", border: "1px solid #252836" }}><div style={{ fontSize: 48, marginBottom: 12 }}>🖼️</div><div style={{ fontWeight: 600 }}>{title}</div>{caption && <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>{caption}</div>}</div>;
  return <div className="image-box"><img src={url} alt={title} onError={() => setErr(true)} /><div className="image-label"><div style={{ fontWeight: 600 }}>{title}</div>{caption && <div style={{ fontSize: 12, color: "#B0B8C8" }}>{caption}</div>}</div></div>;
}

// ── AUTH ──────────────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [pass, setPass] = useState("");
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>📚</div>
          <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 6 }}>MYP 3 Study</h1>
          <p style={{ color: "#6B7280", fontSize: 14 }}>Apeejay School International · March 2026</p>
        </div>
        <div className="card">
          <div className="tab-row" style={{ marginBottom: 20 }}>
            <button className={`tab ${mode === "login" ? "active" : ""}`} onClick={() => setMode("login")}>Sign In</button>
            <button className={`tab ${mode === "register" ? "active" : ""}`} onClick={() => setMode("register")}>Register</button>
          </div>
          {mode === "register" && <div style={{ marginBottom: 12 }}><label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 6 }}>YOUR NAME</label><input type="text" placeholder="e.g. Aarush Chawla" value={name} onChange={e => setName(e.target.value)} /></div>}
          <div style={{ marginBottom: 12 }}><label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 6 }}>EMAIL</label><input type="email" placeholder="student@apeejay.edu" value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div style={{ marginBottom: 20 }}><label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 6 }}>PASSWORD</label><input type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && email && onLogin({ name: name || email.split("@")[0], email })} /></div>
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 15 }} onClick={() => email && onLogin({ name: name || email.split("@")[0], email })}>{mode === "login" ? "Sign In →" : "Create Account →"}</button>
        </div>
      </div>
    </div>
  );
}

// ── HOME ─────────────────────────────────────────────────────────────────────
function HomePage({ user, scores, onSelect, onLogout }) {
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
          <div style={{ fontSize: 11, color: "#6B7280", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>MYP 3 · Mid-Term 2 · March 2026</div>
          <h1 style={{ fontSize: 32, fontWeight: 800 }}>Welcome back, {user.name.split(" ")[0]} 👋</h1>
          <p style={{ color: "#6B7280", marginTop: 6 }}>Apeejay School International, Panchsheel Park</p>
        </div>
        <button className="btn btn-secondary" onClick={onLogout}>Sign Out</button>
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
      </div>
      {Object.keys(scores).length > 0 && <div className="card"><h3 style={{ fontWeight: 700, marginBottom: 20 }}>📊 Score Overview</h3><div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>{Object.entries(scores).map(([id, avg]) => { const col = COLORS.subjectColors[id]; const labels = { math: "Math", english: "English", sciences: "Sciences", spanish: "Spanish", individuals: "I&S" }; return <div key={id} style={{ textAlign: "center" }}><div style={{ fontSize: 26, marginBottom: 4 }}>{col.icon}</div><div style={{ fontSize: 12, color: "#6B7280", marginBottom: 6 }}>{labels[id]}</div><div style={{ fontSize: 28, fontWeight: 800, color: col.accent }}>{avg}/8</div></div>; })}</div></div>}
    </div>
  );
}

// ── MATH ─────────────────────────────────────────────────────────────────────
function MathFigure({ figureText }) {
  if (!figureText) return null;
  return <div className="figure-box"><div style={{ fontSize: 11, color: "#06D6A0", fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>📐 REFERENCE FIGURE</div><pre style={{ whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.8, color: "#06D6A0", fontFamily: "monospace" }}>{figureText}</pre></div>;
}

function MathPractice({ onScore }) {
  const [topic, setTopic] = useState("random"); const [q, setQ] = useState(null); const [figure, setFigure] = useState(null);
  const [ans, setAns] = useState(""); const [fb, setFb] = useState(null); const [load, setLoad] = useState(false); const [score, setScore] = useState(null);

  async function gen() {
    setLoad(true); setFb(null); setAns(""); setScore(null); setQ(null); setFigure(null);
    const t = topic === "random" ? rnd(MATH_TOPICS) : topic;
    const contexts = ["a real-life architecture problem","a sports field scenario","a navigation/mapping task","a construction challenge","a nature/geography context","an abstract geometry proof","an art/design context"];
    const result = await callAI(
      `IB MYP 3 Mathematics teacher. Generate ONE exam-style question with ASCII reference figure.
Context: Frame as ${rnd(contexts)}. Use varied numbers each time.
FORMAT EXACTLY:
---FIGURE---
[ASCII diagram using |, -, /, \\, +, letters A B C D, with measurements labeled]
---QUESTION---
[Question with parts (a)(b) if needed. IB command terms: calculate/find/show that/justify/hence]
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
    const r = await callAI("IB MYP3 Math examiner. Score out of 8. Format:\nSCORE: X/8\nCRITERION: [A/C/D]\nFEEDBACK: [detailed on method]\nMODEL ANSWER: [step-by-step]", `Question:\n${q}\n\nStudent Working:\n${ans}`);
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
        <label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 8 }}>YOUR WORKING & ANSWER</label>
        <textarea rows={8} placeholder="Show all working step by step. Reference the figure where needed..." value={ans} onChange={e => setAns(e.target.value)} />
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

function MathExam({ onScore }) {
  const [phase, setPhase] = useState("start"); const [qs, setQs] = useState([]); const [ans, setAns] = useState({}); const [cur, setCur] = useState(0); const [res, setRes] = useState(null); const [load, setLoad] = useState(false);

  async function start() {
    setLoad(true);
    const sample = [...MATH_TOPICS].sort(() => Math.random() - 0.5).slice(0, 5);
    const questions = [];
    for (const t of sample) {
      const result = await callAI(`IB MYP3 Math exam question with ASCII figure.\nFORMAT:\n---FIGURE---\n[ASCII diagram]\n---QUESTION---\n[question + IB command terms]\nMARKS: [4-8]\nCRITERION: [A/C/D]\n---END---`, `Topic: ${t}`);
      const figMatch = result.match(/---FIGURE---\n([\s\S]*?)---QUESTION---/);
      const qMatch = result.match(/---QUESTION---\n([\s\S]*?)---END---/);
      questions.push({ text: qMatch ? qMatch[1].trim() : result, topic: t, figure: figMatch ? figMatch[1].trim() : null });
    }
    setQs(questions); setAns({}); setCur(0); setPhase("exam"); setLoad(false);
  }

  async function submit() {
    setLoad(true);
    const results = [];
    for (let i = 0; i < qs.length; i++) {
      const r = await callAI("IB MYP3 Math. Score out of 8. Format:\nSCORE: X/8\nCRITERION: [A/C/D]\nFEEDBACK: [detailed]\nMODEL ANSWER: [steps]", `Q: ${qs[i].text}\nAnswer: ${ans[i] || "(blank)"}`);
      const s = parseInt(r.match(/SCORE:\s*(\d)/)?.[1] || "0");
      results.push({ q: qs[i], feedback: r, score: s }); onScore?.(s);
    }
    setRes(results); setPhase("results"); setLoad(false);
  }

  if (phase === "start") return <div className="card fade-in" style={{ textAlign: "center", padding: 48 }}><div style={{ fontSize: 52, marginBottom: 16 }}>📋</div><h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Mathematics Practice Exam</h3><p style={{ color: "#6B7280", marginBottom: 6 }}>5 questions with figures · 1 hour · Criteria A, C, D</p><p style={{ color: "#6B7280", fontSize: 13, marginBottom: 28 }}>No skipping · Show all working</p><button className="btn btn-primary" onClick={start} disabled={load} style={{ fontSize: 16, padding: "14px 32px" }}>{load ? <><Spinner /> Building...</> : "🚀 Begin Exam"}</button></div>;

  if (phase === "exam") return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1A1D26", padding: "14px 20px", borderRadius: 12, marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <span style={{ fontWeight: 600 }}>Q{cur + 1} of {qs.length}</span><TimerComp seconds={3600} onEnd={submit} /><span style={{ fontSize: 13, color: "#6B7280" }}>{Object.keys(ans).length}/{qs.length} answered</span>
      </div>
      <div className="card"><MathFigure figureText={qs[cur]?.figure} /><div style={{ whiteSpace: "pre-wrap", lineHeight: 1.85, marginBottom: 20, fontSize: 14 }}>{qs[cur]?.text}</div><textarea rows={8} placeholder="Show all working..." value={ans[cur] || ""} onChange={e => setAns(p => ({ ...p, [cur]: e.target.value }))} /><div style={{ display: "flex", gap: 10, marginTop: 14 }}>{cur > 0 && <button className="btn btn-secondary" onClick={() => setCur(c => c - 1)}>← Prev</button>}{cur < qs.length - 1 ? <button className="btn btn-primary" onClick={() => setCur(c => c + 1)} disabled={!ans[cur]?.trim()}>Next →</button> : <button className="btn btn-success" onClick={submit} disabled={load || !ans[cur]?.trim()}>{load ? <><Spinner /> Grading...</> : "✓ Submit Exam"}</button>}</div></div>
    </div>
  );

  const avg = res ? Math.round(res.reduce((a, b) => a + b.score, 0) / res.length) : 0;
  return <div className="fade-in"><div className="card" style={{ textAlign: "center", marginBottom: 24, padding: 36 }}><div style={{ fontSize: 44, marginBottom: 10 }}>{avg >= 6 ? "🏆" : avg >= 4 ? "📈" : "💪"}</div><h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Exam Complete!</h3><div style={{ fontSize: 44, fontWeight: 800, color: avg >= 6 ? "#06D6A0" : "#EF476F", margin: "8px 0" }}>{avg}/8</div><button className="btn btn-primary" onClick={() => setPhase("start")} style={{ marginTop: 20 }}>🔄 Retake</button></div>{res.map((r, i) => <div key={i} className="card" style={{ marginBottom: 14 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><span style={{ fontWeight: 600 }}>Q{i + 1} – {r.q.topic.slice(0, 45)}</span><ScoreChip score={r.score} /></div><MathFigure figureText={r.q.figure} /><FeedbackBox text={r.feedback} /></div>)}</div>;
}

function MathPage({ onScore }) {
  const [tab, setTab] = useState("notes");
  return <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}><div style={{ marginBottom: 24 }}><h2 style={{ fontSize: 26, fontWeight: 800 }}>📐 Mathematics</h2><p style={{ color: "#6B7280", fontSize: 14 }}>Criteria A · C · D · Unit 3: Spatial Reasoning</p></div><div className="tab-row">{[["notes", "📝 Notes"], ["practice", "🎯 Practice"], ["exam", "📋 Exam"]].map(([t, l]) => <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{l}</button>)}</div>{tab === "notes" && <div className="fade-in">{MATH_TOPICS.map((t, i) => <div key={i} className="card" style={{ marginBottom: 10, display: "flex", gap: 12 }}><span className="badge" style={{ background: "#6C63FF22", color: "#6C63FF", flexShrink: 0, marginTop: 2 }}>T{i + 1}</span><span style={{ fontSize: 14 }}>{t}</span></div>)}</div>}{tab === "practice" && <MathPractice onScore={s => onScore("math", s)} />}{tab === "exam" && <MathExam onScore={s => onScore("math", s)} />}</div>;
}

// ── ENGLISH ──────────────────────────────────────────────────────────────────
function EnglishAnalysis({ onScore }) {
  const [mode, setMode] = useState("text"); const [q, setQ] = useState(null); const [image, setImage] = useState(null);
  const [ans, setAns] = useState(""); const [fb, setFb] = useState(null); const [load, setLoad] = useState(false); const [score, setScore] = useState(null);

  async function genText() {
    setLoad(true); setFb(null); setAns(""); setScore(null); setImage(null);
    const theme = rnd(SCIFI_THEMES);
    const cmdTerm = rnd(["Analyse", "Evaluate", "Examine", "Discuss"]);
    const focus = rnd(["imagery", "symbolism", "tone and mood", "characterisation", "narrative voice", "setting", "conflict", "language choices"]);
    const r = await callAI(
      `IB MYP 3 English teacher. Generate a SHORT unseen sci-fi/dystopian extract (5-8 sentences) on theme: "${theme}". Make it ORIGINAL and vivid with strong literary devices. Then ONE analysis question.
FORMAT:
EXTRACT:
[original atmospheric text]

QUESTION:
${cmdTerm} how the author uses ${focus} in the extract. [Add specific focus] (8 marks)
CRITERION: A`,
      "Generate varied English analysis"
    );
    setQ(r); setLoad(false);
  }

  async function genImage() {
    setLoad(true); setFb(null); setAns(""); setScore(null); setQ(null);
    const img = rnd(ENGLISH_IMAGES);
    setImage(img);
    const cmdTerm = rnd(["Analyse", "Evaluate", "Examine"]);
    const focus = rnd(["mood and atmosphere", "symbolism", "what the image suggests about society", "contrast and tension", "the human element", "light and darkness"]);
    setQ(`IMAGE ANALYSIS TASK\n\nStudy the image: "${img.title}"\nContext: ${img.context}\n\n${cmdTerm} how the visual elements create ${focus}. Refer to specific details — colour, composition, subject, setting, symbolic meaning. Connect to sci-fi themes where relevant.\n\n(8 marks) — Criterion A`);
    setLoad(false);
  }

  async function submit() {
    setLoad(true);
    const r = await callAI(`IB MYP3 English Criterion A examiner. Evaluate this ${image ? "image" : "text"} analysis. Format:\nSCORE: X/8\nSTRAND BREAKDOWN:\n- Strand i: X/2\n- Strand ii: X/2\n- Strand iii: X/2\n- Strand iv: X/2\nFEEDBACK: [specific]\nWHAT WENT WELL: [2-3]\nEVEN BETTER IF: [2-3]`, `Task:\n${q}\n\nResponse:\n${ans}`);
    setFb(r); const s = parseInt(r.match(/SCORE:\s*(\d)/)?.[1] || "0"); setScore(s); onScore?.(s);
    setLoad(false);
  }

  return (
    <div className="fade-in">
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button className={`btn ${mode === "text" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("text")}>📝 Text Extract</button>
        <button className={`btn ${mode === "image" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("image")}>🖼️ Image Analysis</button>
      </div>
      <button className="btn btn-primary" onClick={mode === "text" ? genText : genImage} disabled={load} style={{ marginBottom: 24 }}>{load ? <><Spinner /> Generating...</> : mode === "text" ? "⚡ Generate Text Extract" : "⚡ Generate Image Task"}</button>
      {(q || image) && <div className="card fade-in">
        {image && <ImageDisplay url={image.url} title={image.title} caption="Study this image carefully before writing your analysis." />}
        {q && <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.85, marginBottom: 20, fontSize: 14, borderLeft: image ? "3px solid #118AB2" : "none", paddingLeft: image ? 16 : 0 }}>{q}</div>}
        <label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 8 }}>YOUR ANALYSIS</label>
        <textarea rows={10} placeholder={image ? "Analyse the image in detail. Refer to specific visual elements — colour, composition, subject, symbolism. Connect to sci-fi themes..." : "Write your analysis. Use evidence from the text. Identify literary features and explain their effect..."} value={ans} onChange={e => setAns(e.target.value)} />
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <button className="btn btn-success" onClick={submit} disabled={load || !ans.trim()}>{load ? <><Spinner /> Evaluating...</> : "✓ Submit"}</button>
          <button className="btn btn-secondary" onClick={mode === "text" ? genText : genImage} disabled={load}>Next →</button>
        </div>
        {score != null && <div style={{ marginTop: 12 }}><ScoreChip score={score} /></div>}
        <FeedbackBox text={fb} />
      </div>}
    </div>
  );
}

function WritingPractice({ onScore }) {
  const [type, setType] = useState("story"); const [q, setQ] = useState(null); const [ans, setAns] = useState(""); const [fb, setFb] = useState(null); const [load, setLoad] = useState(false); const [score, setScore] = useState(null);

  async function gen() {
    setLoad(true); setFb(null); setAns(""); setScore(null);
    const theme = rnd(SCIFI_THEMES);
    const r = await callAI(`IB MYP3 English teacher. Generate a VARIED creative writing prompt for a ${type}. Theme: ${theme}. Make it specific and unusual.\nFormat:\nTASK TYPE: ${type.toUpperCase()}\nPROMPT: [vivid specific prompt with opening scenario]\nREQUIREMENTS:\n- Word count: 300-500 words\n- [2-3 specific elements to include]`, `Generate ${type} prompt`);
    setQ(r); setLoad(false);
  }

  async function submit() {
    setLoad(true);
    const r = await callAI("IB MYP3 English Criterion C examiner. Score out of 8. Format:\nSCORE: X/8\nBREAKDOWN:\n- Purpose/Audience (i): X/2\n- Language Choices (ii): X/2\n- Text type features (iii): X/2\n- Style/Voice (iv): X/2\nFEEDBACK: [specific]\nSTRENGTHS: [2-3]\nIMPROVEMENTS: [2-3]", `Prompt:\n${q}\n\nWriting:\n${ans}`);
    setFb(r); const s = parseInt(r.match(/SCORE:\s*(\d)/)?.[1] || "0"); setScore(s); onScore?.(s);
    setLoad(false);
  }

  const wc = ans.trim() ? ans.trim().split(/\s+/).length : 0;
  return (
    <div className="fade-in">
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>{[["story", "📖 Story"], ["journal", "📔 Journal"], ["dialogue", "💬 Dialogue"], ["monologue", "🎭 Monologue"]].map(([t, l]) => <button key={t} className={`btn ${type === t ? "btn-primary" : "btn-secondary"}`} onClick={() => setType(t)}>{l}</button>)}</div>
      <button className="btn btn-primary" onClick={gen} disabled={load} style={{ marginBottom: 24 }}>{load ? <><Spinner /> Generating...</> : "⚡ Generate Prompt"}</button>
      {q && <div className="card fade-in">
        <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.85, marginBottom: 20, fontSize: 14 }}>{q}</div>
        <textarea rows={12} placeholder="Write your response here (300-500 words)..." value={ans} onChange={e => setAns(e.target.value)} />
        <div style={{ fontSize: 12, color: "#6B7280", marginTop: 6 }}>Words: {wc}</div>
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <button className="btn btn-success" onClick={submit} disabled={load || wc < 50}>{load ? <><Spinner /> Evaluating...</> : "✓ Submit"}</button>
          <button className="btn btn-secondary" onClick={gen} disabled={load}>New Prompt →</button>
        </div>
        {score != null && <div style={{ marginTop: 12 }}><ScoreChip score={score} /></div>}
        <FeedbackBox text={fb} />
      </div>}
    </div>
  );
}

function EnglishExam({ onScore }) {
  const [phase, setPhase] = useState("start"); const [paper, setPaper] = useState(null); const [examImg, setExamImg] = useState(null); const [ans, setAns] = useState({ a: "", c: "" }); const [res, setRes] = useState(null); const [load, setLoad] = useState(false);

  async function start() {
    setLoad(true);
    const useImage = Math.random() > 0.5;
    if (useImage) {
      const img = rnd(ENGLISH_IMAGES); setExamImg(img);
      setPaper(`SECTION A – IMAGE ANALYSIS (Criterion A, 8 marks)\n\nStudy the image: "${img.title}"\nContext: ${img.context}\n\nQ1. Analyse how the visual elements of this image create meaning and atmosphere. Refer to specific details and connect your analysis to sci-fi themes. (8 marks)\n\n---\n\nSECTION B – CREATIVE WRITING (Criterion C, 8 marks)\n\nQ2. Write a ${rnd(["short story", "journal entry"])} from the perspective of a character who exists in this world. (300-400 words)`);
    } else {
      const theme = rnd(SCIFI_THEMES);
      const p = await callAI(`IB MYP3 English exam. Theme: ${theme}.\nSECTION A – ANALYSIS (Criterion A, 8 marks):\nEXTRACT: [vivid 7-9 sentence sci-fi extract]\nQ1: [Analyse/Examine question]\n\n---\n\nSECTION B – CREATIVE WRITING (Criterion C, 8 marks):\nQ2: [Story or journal prompt, 300-400 words]`, "Generate English exam");
      setPaper(p);
    }
    setPhase("exam"); setLoad(false);
  }

  async function submit() {
    setLoad(true);
    const [aFb, cFb] = await Promise.all([
      callAI("IB MYP3 English Criterion A. Score out of 8. Format:\nSCORE: X/8\nSTRAND BREAKDOWN:\n- Strand i: X/2\n- Strand ii: X/2\n- Strand iii: X/2\n- Strand iv: X/2\nFEEDBACK:", `Task:\n${paper}\nResponse:\n${ans.a}`),
      callAI("IB MYP3 English Criterion C. Score out of 8. Format:\nSCORE: X/8\nFEEDBACK:", `Task:\n${paper}\nWriting:\n${ans.c}`)
    ]);
    const sA = parseInt(aFb.match(/SCORE:\s*(\d)/)?.[1] || "0"), sC = parseInt(cFb.match(/SCORE:\s*(\d)/)?.[1] || "0");
    onScore?.(Math.round((sA + sC) / 2)); setRes({ aFb, cFb, sA, sC }); setPhase("results"); setLoad(false);
  }

  if (phase === "start") return <div className="card fade-in" style={{ textAlign: "center", padding: 48 }}><div style={{ fontSize: 52, marginBottom: 16 }}>📋</div><h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>English Practice Exam</h3><p style={{ color: "#6B7280", marginBottom: 6 }}>Text or Image Analysis + Creative Writing · 1 hour</p><p style={{ color: "#6B7280", fontSize: 13, marginBottom: 28 }}>Criteria A & C · Randomly varies each time</p><button className="btn btn-primary" onClick={start} disabled={load} style={{ fontSize: 16, padding: "14px 32px" }}>{load ? <><Spinner /> Generating...</> : "🚀 Begin Exam"}</button></div>;

  if (phase === "exam") return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1A1D26", padding: "14px 20px", borderRadius: 12, marginBottom: 20 }}><span style={{ fontWeight: 600 }}>English Exam</span><TimerComp seconds={3600} onEnd={submit} /></div>
      {examImg && <ImageDisplay url={examImg.url} title={examImg.title} caption="Use this image for Section A" />}
      <div className="card" style={{ marginBottom: 20, whiteSpace: "pre-wrap", lineHeight: 1.85, fontSize: 14 }}>{paper}</div>
      <div className="card" style={{ marginBottom: 16 }}><h4 style={{ color: "#118AB2", marginBottom: 12, fontWeight: 700 }}>Section A – Analysis (Criterion A)</h4><textarea rows={10} placeholder="Write your analysis..." value={ans.a} onChange={e => setAns(p => ({ ...p, a: e.target.value }))} /></div>
      <div className="card" style={{ marginBottom: 20 }}><h4 style={{ color: "#118AB2", marginBottom: 12, fontWeight: 700 }}>Section B – Creative Writing (Criterion C)</h4><textarea rows={14} placeholder="Write your story or journal entry..." value={ans.c} onChange={e => setAns(p => ({ ...p, c: e.target.value }))} /><div style={{ fontSize: 12, color: "#6B7280", marginTop: 6 }}>Words: {ans.c.trim() ? ans.c.trim().split(/\s+/).length : 0}</div></div>
      <button className="btn btn-success" onClick={submit} disabled={load || !ans.a.trim() || !ans.c.trim()} style={{ padding: "14px 32px" }}>{load ? <><Spinner /> Grading...</> : "✓ Submit Exam"}</button>
    </div>
  );

  return <div className="fade-in"><div className="card" style={{ textAlign: "center", marginBottom: 24, padding: 36 }}><h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Results</h3><div style={{ display: "flex", justifyContent: "center", gap: 48 }}><div><div style={{ fontSize: 12, color: "#6B7280" }}>Criterion A</div><div style={{ fontSize: 38, fontWeight: 800, color: res.sA >= 6 ? "#06D6A0" : "#EF476F" }}>{res.sA}/8</div></div><div><div style={{ fontSize: 12, color: "#6B7280" }}>Criterion C</div><div style={{ fontSize: 38, fontWeight: 800, color: res.sC >= 6 ? "#06D6A0" : "#EF476F" }}>{res.sC}/8</div></div></div><button className="btn btn-primary" onClick={() => { setPhase("start"); setExamImg(null); }} style={{ marginTop: 20 }}>🔄 Retake</button></div><div className="card" style={{ marginBottom: 14 }}><h4 style={{ marginBottom: 10 }}>Criterion A Feedback</h4><FeedbackBox text={res.aFb} /></div><div className="card"><h4 style={{ marginBottom: 10 }}>Criterion C Feedback</h4><FeedbackBox text={res.cFb} /></div></div>;
}

function EnglishPage({ onScore }) {
  const [tab, setTab] = useState("notes");
  return <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}><div style={{ marginBottom: 24 }}><h2 style={{ fontSize: 26, fontWeight: 800 }}>📖 Language & Literature</h2><p style={{ color: "#6B7280", fontSize: 14 }}>Criteria A · C · D · Unit 4: Science Fiction</p></div><div className="tab-row">{[["notes", "📝 Notes"], ["analysis", "🔍 Analysis (A)"], ["writing", "✍️ Writing (C)"], ["exam", "📋 Exam"]].map(([t, l]) => <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{l}</button>)}</div>{tab === "notes" && <div className="fade-in">{ENG_NOTES.map((n, i) => <div key={i} className="card" style={{ marginBottom: 14 }}><h3 style={{ color: "#118AB2", fontWeight: 700, marginBottom: 10 }}>{n.title}</h3><ul style={{ paddingLeft: 20, lineHeight: 2.1 }}>{n.pts.map((p, j) => <li key={j} style={{ fontSize: 14 }}>{p}</li>)}</ul></div>)}</div>}{tab === "analysis" && <EnglishAnalysis onScore={s => onScore("english", s)} />}{tab === "writing" && <WritingPractice onScore={s => onScore("english", s)} />}{tab === "exam" && <EnglishExam onScore={s => onScore("english", s)} />}</div>;
}

// ── SCIENCES ─────────────────────────────────────────────────────────────────
function SciQuiz({ subject, topics, onScore }) {
  const [qType, setQType] = useState("mcq"); const [q, setQ] = useState(null); const [ans, setAns] = useState(""); const [fb, setFb] = useState(null); const [load, setLoad] = useState(false); const [score, setScore] = useState(null);

  async function gen() {
    setLoad(true); setFb(null); setAns(""); setScore(null);
    const t = rnd(topics);
    const contexts = { biology: ["garden experiment", "field observation", "lab investigation", "rainforest study"], physics: ["concert hall design", "earthquake scenario", "telescope design", "echo in canyon"], chemistry: ["factory process", "cooking experiment", "mining operation", "lab investigation"] };
    const r = await callAI(`IB MYP3 ${subject} teacher. Generate a ${qType === "mcq" ? "multiple choice question (4 options A-D, mark CORRECT)" : "structured short answer question"}. Context: frame as a ${rnd(contexts[subject])}. Use IB command terms.\nFormat:\nTOPIC: ${t}\nQUESTION: [question]\n${qType === "mcq" ? "A) \nB) \nC) \nD) \nCORRECT: [A/B/C/D]" : "MARKS: [2-4]"}`, `Topic: ${t}`);
    setQ(r); setLoad(false);
  }

  async function submit() {
    setLoad(true);
    let r;
    if (qType === "mcq") {
      const correct = q.match(/CORRECT:\s*([ABCD])/)?.[1]; const ok = ans.toUpperCase().trim() === correct;
      const exp = await callAI(`Explain in 3-4 sentences why ${correct} is correct for this ${subject} question.`, q);
      r = `SCORE: ${ok ? "8" : "0"}/8\nFEEDBACK: ${ok ? "✅ Correct!" : `❌ Incorrect. Answer was ${correct}.`}\n\nEXPLANATION:\n${exp}`;
    } else {
      r = await callAI("IB MYP3 Science examiner. Score out of 8. Format:\nSCORE: X/8\nCRITERION: [A/D]\nFEEDBACK: [specific with correct answer]", `Q: ${q}\nAnswer: ${ans}`);
    }
    setFb(r); const s = parseInt(r.match(/SCORE:\s*(\d)/)?.[1] || "0"); setScore(s); onScore?.(s);
    setLoad(false);
  }

  return (
    <div className="fade-in">
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}><button className={`btn ${qType === "mcq" ? "btn-primary" : "btn-secondary"}`} onClick={() => setQType("mcq")}>MCQ</button><button className={`btn ${qType === "short" ? "btn-primary" : "btn-secondary"}`} onClick={() => setQType("short")}>Short Answer</button></div>
      <button className="btn btn-primary" onClick={gen} disabled={load} style={{ marginBottom: 24 }}>{load ? <><Spinner /> Generating...</> : "⚡ Generate Question"}</button>
      {q && <div className="card fade-in">
        <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.85, marginBottom: 20, fontSize: 14 }}>{q}</div>
        {qType === "mcq" ? <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{["A", "B", "C", "D"].map(o => <button key={o} className={`btn ${ans === o ? "btn-primary" : "btn-secondary"}`} onClick={() => setAns(o)} style={{ justifyContent: "flex-start" }}>{o}</button>)}</div> : <textarea rows={5} placeholder="Write your answer..." value={ans} onChange={e => setAns(e.target.value)} />}
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}><button className="btn btn-success" onClick={submit} disabled={load || !ans.trim()}>{load ? <><Spinner /> Checking...</> : "✓ Submit"}</button><button className="btn btn-secondary" onClick={gen} disabled={load}>Next →</button></div>
        {score != null && <div style={{ marginTop: 12 }}><ScoreChip score={score} /></div>}
        <FeedbackBox text={fb} />
      </div>}
    </div>
  );
}

function SciExam({ onScore }) {
  const [phase, setPhase] = useState("start"); const [paper, setPaper] = useState(null); const [ans, setAns] = useState({}); const [res, setRes] = useState(null); const [load, setLoad] = useState(false);
  async function start() {
    setLoad(true);
    const p = await callAI("IB MYP3 Integrated Sciences. Generate a varied 9-question exam: 3 Biology (Q1-Q3), 3 Physics (Q4-Q6), 3 Chemistry (Q7-Q9). Label each clearly. Use Criteria A and D. Vary question types: calculation, explanation, application, evaluation. IB command terms throughout.", "Generate integrated science exam");
    setPaper(p); setAns({}); setPhase("exam"); setLoad(false);
  }
  async function submit() {
    setLoad(true);
    const allAns = Object.entries(ans).map(([i, a]) => `Q${parseInt(i) + 1}: ${a}`).join("\n\n");
    const r = await callAI("IB MYP3 Science examiner. Grade each question. Format each: Q[n]: SCORE: X/8 – [feedback]. End with:\nCRITERION_A: X/8\nCRITERION_D: X/8\nOVERALL: X/8", `Paper:\n${paper}\n\nAnswers:\n${allAns}`);
    const overall = parseInt(r.match(/OVERALL:\s*(\d)/)?.[1] || "4"); onScore?.(overall); setRes(r); setPhase("results"); setLoad(false);
  }
  if (phase === "start") return <div className="card fade-in" style={{ textAlign: "center", padding: 48 }}><div style={{ fontSize: 52, marginBottom: 16 }}>🔬</div><h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Integrated Science Exam</h3><p style={{ color: "#6B7280", marginBottom: 8 }}>9 questions · Bio + Phys + Chem · 1 hour</p><p style={{ color: "#6B7280", fontSize: 13, marginBottom: 28 }}>Criteria A & D · No skipping</p><button className="btn btn-primary" onClick={start} disabled={load} style={{ fontSize: 16, padding: "14px 32px" }}>{load ? <><Spinner /> Building...</> : "🚀 Begin Exam"}</button></div>;
  if (phase === "exam") return <div className="fade-in"><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1A1D26", padding: "14px 20px", borderRadius: 12, marginBottom: 20 }}><span style={{ fontWeight: 600 }}>Science Exam</span><TimerComp seconds={3600} onEnd={submit} /></div><div className="card" style={{ marginBottom: 20, whiteSpace: "pre-wrap", lineHeight: 1.85, fontSize: 14 }}>{paper}</div>{Array.from({ length: 9 }, (_, i) => <div key={i} className="card" style={{ marginBottom: 10 }}><label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 8 }}>Q{i + 1} – Your Answer</label><textarea rows={4} placeholder="Answer here..." value={ans[i] || ""} onChange={e => setAns(p => ({ ...p, [i]: e.target.value }))} /></div>)}<button className="btn btn-success" onClick={submit} disabled={load} style={{ padding: "14px 32px" }}>{load ? <><Spinner /> Grading...</> : "✓ Submit Exam"}</button></div>;
  return <div className="fade-in"><div className="card" style={{ padding: 36, textAlign: "center", marginBottom: 20 }}><h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Science Exam Results</h3><FeedbackBox text={res} /><button className="btn btn-primary" onClick={() => setPhase("start")} style={{ marginTop: 20 }}>🔄 Retake</button></div></div>;
}

function SciencesPage({ onScore }) {
  const [tab, setTab] = useState("biology"); const [mode, setMode] = useState("notes");
  const sciColors = { biology: "#06D6A0", physics: "#118AB2", chemistry: "#FFD166" };
  return <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}><div style={{ marginBottom: 24 }}><h2 style={{ fontSize: 26, fontWeight: 800 }}>🔬 Integrated Sciences</h2><p style={{ color: "#6B7280", fontSize: 14 }}>Criteria A · D · Biology · Physics · Chemistry</p></div><div className="tab-row">{[["biology", "🌿 Biology"], ["physics", "💡 Physics"], ["chemistry", "⚗️ Chemistry"], ["exam", "📋 Exam"]].map(([t, l]) => <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => { setTab(t); setMode("notes"); }}>{l}</button>)}</div>{tab !== "exam" ? <><div className="tab-row"><button className={`tab ${mode === "notes" ? "active" : ""}`} onClick={() => setMode("notes")}>📝 Notes</button><button className={`tab ${mode === "quiz" ? "active" : ""}`} onClick={() => setMode("quiz")}>🎯 Quiz</button></div>{mode === "notes" && <div className="fade-in">{SCI_TOPICS[tab].map((t, i) => <div key={i} className="card" style={{ marginBottom: 10, display: "flex", gap: 12 }}><span className="badge" style={{ background: sciColors[tab] + "22", color: sciColors[tab], flexShrink: 0, marginTop: 2 }}>{i + 1}</span><span style={{ fontSize: 14 }}>{t}</span></div>)}</div>}{mode === "quiz" && <SciQuiz subject={tab} topics={SCI_TOPICS[tab]} onScore={s => onScore("sciences", s)} />}</> : <SciExam onScore={s => onScore("sciences", s)} />}</div>;
}

// ── SPANISH ──────────────────────────────────────────────────────────────────
function SpanishReading({ onScore }) {
  const [data, setData] = useState(null); const [ans, setAns] = useState({}); const [fb, setFb] = useState(null); const [load, setLoad] = useState(false); const [score, setScore] = useState(null);
  const topics = ["el tiempo (weather)","la contaminación del aire","el reciclaje","los animales en peligro","el cambio climático","la energía renovable","la basura plástica","las inundaciones"];

  async function gen() {
    setLoad(true); setFb(null); setAns({}); setScore(null);
    const r = await callAI(`IB MYP3 Spanish A1-A2 reading comprehension on: ${rnd(topics)}. Vary the scenario, characters, setting each time.\nFormat:\nTEXTO:\n[80-120 word Spanish text]\n\nQ1. [MCQ A,B,C,D in Spanish]\nQ2. [MCQ A,B,C,D in Spanish]\nQ3. [Short answer in Spanish]\nQ4. [Short answer in Spanish]\nQ5. [True/False in Spanish]\nQ6. [True/False in Spanish]`, "Generate varied Spanish reading");
    setData(r); setLoad(false);
  }

  async function submit() {
    setLoad(true);
    const r = await callAI("IB MYP3 Spanish Criterion B. Score out of 8. Format:\nSCORE: X/8\nCORRECT ANSWERS: [list each]\nFEEDBACK: [in English]", `Text:\n${data}\n\nAnswers:\n${Object.entries(ans).map(([i, a]) => `Q${parseInt(i) + 1}: ${a}`).join("\n")}`);
    setFb(r); const s = parseInt(r.match(/SCORE:\s*(\d)/)?.[1] || "0"); setScore(s); onScore?.(s);
    setLoad(false);
  }

  return <div className="fade-in"><button className="btn btn-primary" onClick={gen} disabled={load} style={{ marginBottom: 24 }}>{load ? <><Spinner /> Generating...</> : "⚡ Generate Reading Exercise"}</button>{data && <div className="card fade-in"><div style={{ whiteSpace: "pre-wrap", lineHeight: 1.85, marginBottom: 24, fontSize: 14 }}>{data}</div>{[0, 1, 2, 3, 4, 5].map(i => <div key={i} style={{ marginBottom: 12 }}><label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 6 }}>Respuesta Q{i + 1}</label><input type="text" placeholder="Tu respuesta..." value={ans[i] || ""} onChange={e => setAns(p => ({ ...p, [i]: e.target.value }))} /></div>)}<div style={{ display: "flex", gap: 10, marginTop: 16 }}><button className="btn btn-success" onClick={submit} disabled={load}>{load ? <><Spinner /> Evaluating...</> : "✓ Submit"}</button><button className="btn btn-secondary" onClick={gen} disabled={load}>Next Text →</button></div>{score != null && <div style={{ marginTop: 12 }}><ScoreChip score={score} /></div>}<FeedbackBox text={fb} /></div>}</div>;
}

function SpanishWriting({ onScore }) {
  const [q, setQ] = useState(null); const [ans, setAns] = useState(""); const [fb, setFb] = useState(null); const [load, setLoad] = useState(false); const [score, setScore] = useState(null);
  const raftTopics = ["la contaminación del río local","la deforestación en el Amazonas","el uso excesivo del plástico","el smog en las ciudades","los efectos del cambio climático en los océanos","la importancia del reciclaje","cómo reducir tu huella de carbono","los animales en peligro de extinción"];

  async function gen() {
    setLoad(true); setFb(null); setAns(""); setScore(null);
    const topic = rnd(raftTopics);
    const r = await callAI(`IB MYP3 Spanish RAFT prompt at A1-A2 level. Topic: ${topic}. Use a DIFFERENT role/audience each time.\nFormat:\nROL: [specific role]\nAUDIENCIA: [specific audience]\nFORMATO: Blog post\nTEMA: ${topic}\nTAREA: Escribe un blog de 100-150 palabras en español.\nPALABRAS CLAVE: [6-8 useful Spanish words]\nFRASES ÚTILES: [3-4 sentence starters]`, "Generate varied Spanish RAFT");
    setQ(r); setLoad(false);
  }

  async function submit() {
    setLoad(true);
    const r = await callAI("IB MYP3 Spanish Criterion D. A1-A2 blog. Score out of 8. Format:\nSCORE: X/8\nFEEDBACK: [in English]\nGRAMMAR CORRECTIONS: [main errors]\nVOCABULARY SUGGESTIONS:", `Prompt:\n${q}\n\nBlog:\n${ans}`);
    setFb(r); const s = parseInt(r.match(/SCORE:\s*(\d)/)?.[1] || "0"); setScore(s); onScore?.(s);
    setLoad(false);
  }

  const wc = ans.trim() ? ans.trim().split(/\s+/).length : 0;
  return <div className="fade-in"><button className="btn btn-primary" onClick={gen} disabled={load} style={{ marginBottom: 24 }}>{load ? <><Spinner /> Generating...</> : "⚡ Generate RAFT Prompt"}</button>{q && <div className="card fade-in"><div style={{ whiteSpace: "pre-wrap", lineHeight: 1.85, marginBottom: 20, fontSize: 14 }}>{q}</div><textarea rows={10} placeholder="Escribe tu blog aquí (100-150 palabras)..." value={ans} onChange={e => setAns(e.target.value)} /><div style={{ fontSize: 12, color: "#6B7280", marginTop: 6 }}>Palabras: {wc} / 100-150</div><div style={{ display: "flex", gap: 10, marginTop: 12 }}><button className="btn btn-success" onClick={submit} disabled={load || wc < 30}>{load ? <><Spinner /> Evaluating...</> : "✓ Submit"}</button><button className="btn btn-secondary" onClick={gen} disabled={load}>New Prompt →</button></div>{score != null && <div style={{ marginTop: 12 }}><ScoreChip score={score} /></div>}<FeedbackBox text={fb} /></div>}</div>;
}

function SpanishSpeaking({ onScore }) {
  const [phase, setPhase] = useState("idle");
  const [image, setImage] = useState(null);
  const [notes, setNotes] = useState("");
  const [speech, setSpeech] = useState("");
  const [followups, setFollowups] = useState([]);
  const [followupAnswers, setFollowupAnswers] = useState({});
  const [fb, setFb] = useState(null);
  const [load, setLoad] = useState(false);
  const [score, setScore] = useState(null);

  function startSession() {
    const img = rnd(SPANISH_IMAGES);
    setImage(img); setNotes(""); setSpeech(""); setFollowups([]); setFollowupAnswers({}); setFb(null); setScore(null);
    setPhase("prep");
  }

  async function submitSpeech() {
    setLoad(true);
    const fqs = await callAI(
      `IB MYP3 Spanish oral exam teacher. Student spoke about image: ${image.title} (topic: ${image.topic}). Generate EXACTLY 3 follow-up questions in Spanish at A1-A2 level — ask for opinions, descriptions, personal connections.\nFormat:\nPREGUNTA 1: [question]\nPREGUNTA 2: [question]\nPREGUNTA 3: [question]`,
      `Image: ${image.title}, Keywords: ${image.keywords}`
    );
    const q1 = fqs.match(/PREGUNTA 1:\s*(.+)/)?.[1] || "¿Qué ves en la imagen?";
    const q2 = fqs.match(/PREGUNTA 2:\s*(.+)/)?.[1] || "¿Qué piensas sobre este problema?";
    const q3 = fqs.match(/PREGUNTA 3:\s*(.+)/)?.[1] || "¿Cómo puedes ayudar?";
    setFollowups([q1, q2, q3]); setLoad(false); setPhase("followup");
  }

  async function submitAll() {
    setLoad(true);
    const answersStr = followups.map((q, i) => `Q: ${q}\nA: ${followupAnswers[i] || "(no answer)"}`).join("\n\n");
    const r = await callAI(
      `IB MYP3 Spanish Criterion C (Speaking) examiner. A1-A2 level. Score out of 8.\nFormat:\nSCORE: X/8\nCRITERION C BREAKDOWN:\n- Message clarity (i): X/2\n- Vocabulary range (ii): X/2\n- Grammar accuracy (iii): X/2\n- Interactive competence (iv): X/2\nFEEDBACK: [in English, encouraging]\nSTRENGTHS: [2-3]\nIMPROVEMENTS: [2-3 with examples]\nFOLLOW-UP FEEDBACK: [comment on each follow-up]`,
      `Image: ${image.title} (${image.keywords})\n\nMain Speech:\n${speech}\n\nFollow-up Q&A:\n${answersStr}`
    );
    setFb(r); const s = parseInt(r.match(/SCORE:\s*(\d)/)?.[1] || "0"); setScore(s); onScore?.(s);
    setPhase("results"); setLoad(false);
  }

  const speechWc = speech.trim() ? speech.trim().split(/\s+/).length : 0;

  if (phase === "idle") return (
    <div className="card fade-in" style={{ textAlign: "center", padding: 48 }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>🎤</div>
      <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Spanish Oral Exam Simulation</h3>
      <div style={{ color: "#6B7280", marginBottom: 24, lineHeight: 1.9, textAlign: "left", background: "#12141A", borderRadius: 12, padding: 20 }}>
        <strong style={{ color: "#FFD166" }}>How it works:</strong><br />
        1️⃣ You get a random image about weather or environment<br />
        2️⃣ 10 minutes preparation time to take notes<br />
        3️⃣ Speak about the image in Spanish for 2-3 minutes<br />
        4️⃣ Answer 3 follow-up questions from the "teacher"<br />
        5️⃣ Get a full IB Criterion C score and feedback
      </div>
      <button className="btn btn-warn" onClick={startSession} style={{ fontSize: 16, padding: "14px 32px" }}>🎲 Get Random Image & Begin</button>
    </div>
  );

  if (phase === "prep") return (
    <div className="fade-in">
      <ImageDisplay url={image.url} title={image.title} caption={`Tema: ${image.topic} · Palabras clave: ${image.keywords}`} />
      <div className="prep-box">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div><div style={{ fontWeight: 700, color: "#FFD166", fontSize: 15 }}>⏱ Preparation Time — 10 minutes</div><div style={{ fontSize: 13, color: "#6B7280" }}>Plan your speech. What do you see? What do you think about this?</div></div>
          <CountdownTimer seconds={600} label="PREP TIME" color="#FFD166" />
        </div>
      </div>
      <div className="card" style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 8 }}>📝 YOUR PREPARATION NOTES (not marked)</label>
        <textarea rows={5} placeholder="Plan your speech here. What can you see? What is the problem? Vocabulary to use... Phrases: En la imagen veo... Creo que... El problema es..." value={notes} onChange={e => setNotes(e.target.value)} />
      </div>
      <div style={{ background: "#12141A", borderRadius: 10, padding: 16, marginBottom: 16, fontSize: 13, color: "#6B7280", lineHeight: 1.8 }}>
        <strong style={{ color: "#E8E9F0" }}>What to talk about:</strong><br />
        · Describe what you see in the image (¿Qué hay en la imagen?)<br />
        · Explain the problem shown (¿Cuál es el problema?)<br />
        · Give your opinion: <em style={{ color: "#FFD166" }}>Creo que... / En mi opinión... / Pienso que...</em><br />
        · Suggest solutions: <em style={{ color: "#FFD166" }}>Debemos... / Es importante... / Podemos...</em>
      </div>
      <button className="btn btn-primary" onClick={() => setPhase("speak")} style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 15 }}>I'm Ready — Start Speaking →</button>
    </div>
  );

  if (phase === "speak") return (
    <div className="fade-in">
      <ImageDisplay url={image.url} title={image.title} caption="Refer to this image in your speech" />
      <div className="record-box">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div><div style={{ fontWeight: 700, color: "#EF476F", fontSize: 15 }}>🎤 Speaking Time — 2-3 minutes</div><div style={{ fontSize: 13, color: "#6B7280" }}>Write your speech in Spanish (aim for 150-250 words)</div></div>
          <CountdownTimer seconds={180} label="SPEAKING TIME" color="#EF476F" />
        </div>
      </div>
      <textarea rows={10} placeholder="Habla sobre la imagen en español...\n\nEjemplo:\nEn la imagen puedo ver... Creo que este problema es importante porque... En mi opinión, debemos... También pienso que..." value={speech} onChange={e => setSpeech(e.target.value)} style={{ marginBottom: 8 }} />
      <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 16 }}>Palabras: {speechWc} (objetivo: 150-250)</div>
      <button className="btn btn-success" onClick={submitSpeech} disabled={load || speechWc < 15} style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 15 }}>{load ? <><Spinner /> Preparing follow-up questions...</> : "✓ Done Speaking — Get Follow-Up Questions →"}</button>
    </div>
  );

  if (phase === "followup") return (
    <div className="fade-in">
      <div style={{ background: "#6C63FF11", border: "1px solid #6C63FF33", borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <div style={{ fontWeight: 700, color: "#6C63FF", marginBottom: 4, fontSize: 15 }}>💬 Teacher Follow-Up Questions</div>
        <div style={{ fontSize: 13, color: "#6B7280" }}>Answer each question in Spanish. Short answers are fine — 1-3 sentences each.</div>
      </div>
      {followups.map((q, i) => (
        <div key={i} className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 600, color: "#FFD166", marginBottom: 8, fontSize: 15 }}>{i + 1}. {q}</div>
          <textarea rows={3} placeholder="Tu respuesta en español..." value={followupAnswers[i] || ""} onChange={e => setFollowupAnswers(p => ({ ...p, [i]: e.target.value }))} />
        </div>
      ))}
      <button className="btn btn-success" onClick={submitAll} disabled={load} style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 15 }}>{load ? <><Spinner /> Evaluating full performance...</> : "✓ Submit — Get Full Score & Feedback"}</button>
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

function SpanishExam({ onScore }) {
  const [phase, setPhase] = useState("start"); const [paper, setPaper] = useState(null); const [ans, setAns] = useState({}); const [res, setRes] = useState(null); const [load, setLoad] = useState(false);

  async function start() {
    setLoad(true);
    const topic = rnd(["el tiempo", "la contaminación", "el medio ambiente", "las soluciones ecológicas", "los problemas globales"]);
    const p = await callAI(`IB MYP3 Spanish exam on: ${topic}. No Criterion C.\nSECTION 1 – CRITERION B:\n[80-100 word Spanish text about ${topic}]\nQ1-Q2: MCQ A-D\nQ3-Q4: Short answer in Spanish\nQ5-Q6: True/False\n\nSECTION 2 – CRITERION D:\nRAFT Blog prompt on ${topic}\nTask: Write 100-150 word blog in Spanish.`, "Generate Spanish exam");
    setPaper(p); setAns({}); setPhase("exam"); setLoad(false);
  }

  async function submit() {
    setLoad(true);
    const readAns = [0, 1, 2, 3, 4, 5].map(i => `Q${i + 1}: ${ans[`b${i}`] || ""}`).join("\n");
    const [bFb, dFb] = await Promise.all([
      callAI("IB MYP3 Spanish Criterion B. Score out of 8. Format:\nSCORE: X/8\nCORRECT ANSWERS:\nFEEDBACK:", `Paper:\n${paper}\nReading:\n${readAns}`),
      callAI("IB MYP3 Spanish Criterion D. A1-A2 blog. Score out of 8. Format:\nSCORE: X/8\nFEEDBACK:\nGRAMMAR CORRECTIONS:", `Paper:\n${paper}\nBlog:\n${ans.blog || ""}`)
    ]);
    const sB = parseInt(bFb.match(/SCORE:\s*(\d)/)?.[1] || "0"), sD = parseInt(dFb.match(/SCORE:\s*(\d)/)?.[1] || "0");
    onScore?.(Math.round((sB + sD) / 2)); setRes({ bFb, dFb, sB, sD }); setPhase("results"); setLoad(false);
  }

  if (phase === "start") return <div className="card fade-in" style={{ textAlign: "center", padding: 48 }}><div style={{ fontSize: 52, marginBottom: 16 }}>🌍</div><h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Spanish Practice Exam</h3><p style={{ color: "#6B7280", marginBottom: 8 }}>Reading + Blog Writing · Criteria B & D</p><p style={{ color: "#6B7280", fontSize: 13, marginBottom: 28 }}>Timed · No skipping</p><button className="btn btn-primary" onClick={start} disabled={load} style={{ fontSize: 16, padding: "14px 32px" }}>{load ? <><Spinner /> Generating...</> : "🚀 Comenzar"}</button></div>;

  if (phase === "exam") return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1A1D26", padding: "14px 20px", borderRadius: 12, marginBottom: 20 }}><span style={{ fontWeight: 600 }}>Spanish Exam</span><TimerComp seconds={3600} onEnd={submit} /></div>
      <div className="card" style={{ marginBottom: 20, whiteSpace: "pre-wrap", lineHeight: 1.85, fontSize: 14 }}>{paper}</div>
      <div className="card" style={{ marginBottom: 16 }}><h4 style={{ color: "#FFD166", marginBottom: 14, fontWeight: 700 }}>Section 1 – Reading Comprehension</h4>{[0, 1, 2, 3, 4, 5].map(i => <div key={i} style={{ marginBottom: 10 }}><label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 6 }}>Q{i + 1}</label><input type="text" placeholder="Tu respuesta..." value={ans[`b${i}`] || ""} onChange={e => setAns(p => ({ ...p, [`b${i}`]: e.target.value }))} /></div>)}</div>
      <div className="card" style={{ marginBottom: 20 }}><h4 style={{ color: "#FFD166", marginBottom: 12, fontWeight: 700 }}>Section 2 – Blog Writing (100-150 words)</h4><textarea rows={10} placeholder="Escribe tu blog aquí..." value={ans.blog || ""} onChange={e => setAns(p => ({ ...p, blog: e.target.value }))} /><div style={{ fontSize: 12, color: "#6B7280", marginTop: 6 }}>Palabras: {(ans.blog || "").trim().split(/\s+/).filter(Boolean).length}</div></div>
      <button className="btn btn-success" onClick={submit} disabled={load} style={{ padding: "14px 32px" }}>{load ? <><Spinner /> Grading...</> : "✓ Submit Exam"}</button>
    </div>
  );

  return <div className="fade-in"><div className="card" style={{ textAlign: "center", marginBottom: 24, padding: 36 }}><h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Resultados</h3><div style={{ display: "flex", justifyContent: "center", gap: 48 }}><div><div style={{ fontSize: 12, color: "#6B7280" }}>Criterion B</div><div style={{ fontSize: 38, fontWeight: 800, color: res.sB >= 6 ? "#06D6A0" : "#EF476F" }}>{res.sB}/8</div></div><div><div style={{ fontSize: 12, color: "#6B7280" }}>Criterion D</div><div style={{ fontSize: 38, fontWeight: 800, color: res.sD >= 6 ? "#06D6A0" : "#EF476F" }}>{res.sD}/8</div></div></div><button className="btn btn-primary" onClick={() => setPhase("start")} style={{ marginTop: 20 }}>🔄 Retake</button></div><div className="card" style={{ marginBottom: 14 }}><h4 style={{ marginBottom: 10 }}>Criterion B Feedback</h4><FeedbackBox text={res.bFb} /></div><div className="card"><h4 style={{ marginBottom: 10 }}>Criterion D Feedback</h4><FeedbackBox text={res.dFb} /></div></div>;
}

function SpanishPage({ onScore }) {
  const [tab, setTab] = useState("reading");
  return <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}><div style={{ marginBottom: 24 }}><h2 style={{ fontSize: 26, fontWeight: 800 }}>🌍 Spanish</h2><p style={{ color: "#6B7280", fontSize: 14 }}>Criteria B · C · D · Tema 5: El mundo en que vivimos</p></div><div className="tab-row">{[["reading", "📖 Lectura (B)"], ["writing", "✍️ Escritura (D)"], ["speaking", "🎤 Oral (C)"], ["exam", "📋 Exam"]].map(([t, l]) => <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{l}</button>)}</div>{tab === "reading" && <SpanishReading onScore={s => onScore("spanish", s)} />}{tab === "writing" && <SpanishWriting onScore={s => onScore("spanish", s)} />}{tab === "speaking" && <SpanishSpeaking onScore={s => onScore("spanish", s)} />}{tab === "exam" && <SpanishExam onScore={s => onScore("spanish", s)} />}</div>;
}

// ── I&S ──────────────────────────────────────────────────────────────────────
function ISPractice({ onScore }) {
  const [crit, setCrit] = useState("B"); const [q, setQ] = useState(null); const [ans, setAns] = useState(""); const [fb, setFb] = useState(null); const [load, setLoad] = useState(false); const [score, setScore] = useState(null);

  async function gen() {
    setLoad(true); setFb(null); setAns(""); setScore(null);
    const topic = rnd(IS_TOPICS);
    const cmdsB = ["Describe", "Explain", "Compare", "Outline", "Analyse", "Summarise"];
    const cmdsD = ["Evaluate", "Discuss", "Examine", "Justify", "Assess", "To what extent"];
    const cmd = crit === "B" ? rnd(cmdsB) : rnd(cmdsD);
    const includeData = Math.random() > 0.5;
    const r = await callAI(
      `IB MYP3 I&S teacher. Criterion ${crit} question. Topic: ${topic}. Command term: ${cmd}.${includeData ? " Include a small text-based data reference (mini table or statistics) for the student to reference." : ""} Reference real places and case studies where appropriate.\nFormat:\nCRITERION: ${crit}\nTOPIC: ${topic}\nCOMMAND TERM: ${cmd}\nQUESTION: [full structured question, may have parts (a)(b)]\nMARKS: [4-8]`,
      `Topic: ${topic}`
    );
    setQ(r); setLoad(false);
  }

  async function submit() {
    setLoad(true);
    const r = await callAI(`IB MYP3 I&S Criterion ${crit} examiner. Score out of 8. Format:\nSCORE: X/8\nFEEDBACK: [specific, reference command term]\nSTRENGTHS: [2-3]\nIMPROVEMENTS: [2-3 targeted to higher bands]`, `Question:\n${q}\n\nAnswer:\n${ans}`);
    setFb(r); const s = parseInt(r.match(/SCORE:\s*(\d)/)?.[1] || "0"); setScore(s); onScore?.(s);
    setLoad(false);
  }

  return (
    <div className="fade-in">
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <button className={`btn ${crit === "B" ? "btn-primary" : "btn-secondary"}`} onClick={() => setCrit("B")}>Criterion B – Investigating</button>
        <button className={`btn ${crit === "D" ? "btn-primary" : "btn-secondary"}`} onClick={() => setCrit("D")}>Criterion D – Critical Thinking</button>
      </div>
      <button className="btn btn-primary" onClick={gen} disabled={load} style={{ marginBottom: 24 }}>{load ? <><Spinner /> Generating...</> : "⚡ Generate Question"}</button>
      {q && <div className="card fade-in">
        <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.85, marginBottom: 20, fontSize: 14 }}>{q}</div>
        <textarea rows={8} placeholder="Write your structured response. Use the command term. Reference evidence and case studies..." value={ans} onChange={e => setAns(e.target.value)} />
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

function ISExam({ onScore }) {
  const [phase, setPhase] = useState("start"); const [paper, setPaper] = useState(null); const [ans, setAns] = useState({}); const [res, setRes] = useState(null); const [load, setLoad] = useState(false);

  async function start() {
    setLoad(true);
    const unit = Math.random() > 0.5 ? "population" : "culture";
    const p = await callAI(`IB MYP3 I&S 1-hour exam focused on ${unit}. Include realistic data stimulus. Then:\nQ1 (Criterion B, 4 marks): describe/outline\nQ2 (Criterion B, 6 marks): explain with reference to data\nQ3 (Criterion D, 6 marks): evaluate/analyse\nQ4 (Criterion D, 6 marks): compare/discuss perspectives\nQ5 (Criterion D, 8 marks): extended evaluation using named case study\nLabel Q1-Q5 clearly.`, "Generate I&S exam");
    setPaper(p); setAns({}); setPhase("exam"); setLoad(false);
  }

  async function submit() {
    setLoad(true);
    const allAns = Object.entries(ans).map(([i, a]) => `Q${parseInt(i) + 1}: ${a}`).join("\n\n");
    const r = await callAI("IB MYP3 I&S examiner. Grade each question. Format: Q[n]: SCORE: X/8 – [feedback]. End with:\nCRITERION_B: X/8\nCRITERION_D: X/8\nOVERALL: X/8", `Paper:\n${paper}\n\nAnswers:\n${allAns}`);
    const overall = parseInt(r.match(/OVERALL:\s*(\d)/)?.[1] || "4"); onScore?.(overall); setRes(r); setPhase("results"); setLoad(false);
  }

  if (phase === "start") return <div className="card fade-in" style={{ textAlign: "center", padding: 48 }}><div style={{ fontSize: 52, marginBottom: 16 }}>🌐</div><h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>I&S Practice Exam</h3><p style={{ color: "#6B7280", marginBottom: 8 }}>5 structured questions · 1 hour · Criteria B & D</p><p style={{ color: "#6B7280", fontSize: 13, marginBottom: 28 }}>Population & Culture · No skipping</p><button className="btn btn-primary" onClick={start} disabled={load} style={{ fontSize: 16, padding: "14px 32px" }}>{load ? <><Spinner /> Building...</> : "🚀 Begin Exam"}</button></div>;

  if (phase === "exam") return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1A1D26", padding: "14px 20px", borderRadius: 12, marginBottom: 20 }}><span style={{ fontWeight: 600 }}>I&S Exam</span><TimerComp seconds={3600} onEnd={submit} /></div>
      <div className="card" style={{ marginBottom: 20, whiteSpace: "pre-wrap", lineHeight: 1.85, fontSize: 14 }}>{paper}</div>
      {[0, 1, 2, 3, 4].map(i => <div key={i} className="card" style={{ marginBottom: 10 }}><label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 8 }}>Q{i + 1} – Your Answer</label><textarea rows={i >= 3 ? 9 : 5} placeholder="Write your structured response..." value={ans[i] || ""} onChange={e => setAns(p => ({ ...p, [i]: e.target.value }))} /></div>)}
      <button className="btn btn-success" onClick={submit} disabled={load} style={{ padding: "14px 32px" }}>{load ? <><Spinner /> Grading...</> : "✓ Submit Exam"}</button>
    </div>
  );

  return <div className="fade-in"><div className="card" style={{ padding: 36, textAlign: "center", marginBottom: 20 }}><h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>I&S Exam Results</h3><FeedbackBox text={res} /><button className="btn btn-primary" onClick={() => setPhase("start")} style={{ marginTop: 20 }}>🔄 Retake</button></div></div>;
}

function IndividualsPage({ onScore }) {
  const [tab, setTab] = useState("notes");
  return <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}><div style={{ marginBottom: 24 }}><h2 style={{ fontSize: 26, fontWeight: 800 }}>🌐 Individuals & Societies</h2><p style={{ color: "#6B7280", fontSize: 14 }}>Criteria B · D · Population & Culture</p></div><div className="tab-row">{[["notes", "📝 Notes"], ["practice", "🎯 Practice"], ["exam", "📋 Exam"]].map(([t, l]) => <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{l}</button>)}</div>{tab === "notes" && <div className="fade-in"><div className="card" style={{ marginBottom: 16 }}><h3 style={{ color: "#EF476F", fontWeight: 700, marginBottom: 12 }}>Unit 4: Population Distribution</h3>{IS_TOPICS.slice(0, 8).map((t, i) => <div key={i} style={{ padding: "9px 0", borderBottom: "1px solid #252836", display: "flex", gap: 12 }}><span className="badge" style={{ background: "#EF476F22", color: "#EF476F", flexShrink: 0 }}>{i + 1}</span><span style={{ fontSize: 14 }}>{t}</span></div>)}</div><div className="card"><h3 style={{ color: "#118AB2", fontWeight: 700, marginBottom: 12 }}>Unit 5: Culture</h3>{IS_TOPICS.slice(8).map((t, i) => <div key={i} style={{ padding: "9px 0", borderBottom: "1px solid #252836", display: "flex", gap: 12 }}><span className="badge" style={{ background: "#118AB222", color: "#118AB2", flexShrink: 0 }}>{i + 1}</span><span style={{ fontSize: 14 }}>{t}</span></div>)}</div></div>}{tab === "practice" && <ISPractice onScore={s => onScore("individuals", s)} />}{tab === "exam" && <ISExam onScore={s => onScore("individuals", s)} />}</div>;
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [scores, setScores] = useState({});
  const [subject, setSubject] = useState(null);

  function handleScore(subjectId, score) {
    setScores(prev => ({ ...prev, [subjectId]: [...(prev[subjectId] || []), score] }));
  }

  const avgScores = {};
  Object.entries(scores).forEach(([id, arr]) => {
    if (arr.length) avgScores[id] = Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
  });

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", background: "#0A0B0F", color: "#E8E9F0" }}>
        {!user ? <AuthPage onLogin={setUser} /> : subject ? (
          <div>
            <div style={{ background: "#12141A", borderBottom: "1px solid #252836", padding: "12px 24px", display: "flex", alignItems: "center", gap: 16 }}>
              <button className="btn btn-secondary" onClick={() => setSubject(null)} style={{ padding: "8px 14px" }}>← Home</button>
              <span style={{ color: "#6B7280", fontSize: 13 }}>MYP 3 · Mid-Term 2 · {user.name}</span>
            </div>
            {subject === "math" && <MathPage onScore={handleScore} />}
            {subject === "english" && <EnglishPage onScore={handleScore} />}
            {subject === "sciences" && <SciencesPage onScore={handleScore} />}
            {subject === "spanish" && <SpanishPage onScore={handleScore} />}
            {subject === "individuals" && <IndividualsPage onScore={handleScore} />}
          </div>
        ) : <HomePage user={user} scores={avgScores} onSelect={setSubject} onLogout={() => { setUser(null); setSubject(null); }} />}
      </div>
    </>
  );
}
