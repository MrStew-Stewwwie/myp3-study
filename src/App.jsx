import { useState, useEffect, useRef, createContext, useContext } from "react";

// ── THEME CONTEXT ──────────────────────────────────────────────────────────────
const ThemeContext = createContext();
function useTheme() { return useContext(ThemeContext); }

// ── GLOBAL CSS ────────────────────────────────────────────────────────────────
const makeCSS = (dark) => `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: ${dark ? "#0D0E14" : "#F4F5FA"};
    --surface: ${dark ? "#13151E" : "#FFFFFF"};
    --card: ${dark ? "#1A1D2B" : "#FFFFFF"};
    --card2: ${dark ? "#20243A" : "#F0F2FF"};
    --border: ${dark ? "#2A2F4A" : "#E0E3F5"};
    --accent: #5E6AD2;
    --accent2: #7C3AED;
    --green: #10B981;
    --red: #F43F5E;
    --yellow: #F59E0B;
    --blue: #3B82F6;
    --text: ${dark ? "#E8EAF8" : "#1A1D2E"};
    --text2: ${dark ? "#7B82A8" : "#6B7280"};
    --text3: ${dark ? "#4A5070" : "#9CA3AF"};
    --shadow: ${dark ? "0 4px 24px rgba(0,0,0,0.5)" : "0 4px 24px rgba(94,106,210,0.12)"};
    --shadow2: ${dark ? "0 2px 12px rgba(0,0,0,0.4)" : "0 2px 12px rgba(0,0,0,0.08)"};
  }
  html, body { height: 100%; }
  body { background: var(--bg); color: var(--text); font-family: 'Outfit', sans-serif; transition: background 0.3s, color 0.3s; }
  h1,h2,h3,h4 { font-family: 'Bricolage Grotesque', sans-serif; }
  * { transition: background-color 0.2s, border-color 0.2s, color 0.2s; }

  /* Layout */
  .app-shell { display: flex; min-height: 100vh; }
  .sidebar { width: 260px; min-height: 100vh; background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; position: fixed; left: 0; top: 0; bottom: 0; z-index: 100; transition: transform 0.3s; }
  .sidebar-logo { padding: 24px 20px 20px; border-bottom: 1px solid var(--border); }
  .sidebar-nav { flex: 1; padding: 12px 10px; overflow-y: auto; }
  .sidebar-footer { padding: 16px 10px; border-top: 1px solid var(--border); }
  .main-area { margin-left: 260px; flex: 1; min-height: 100vh; display: flex; flex-direction: column; }
  .topbar { height: 60px; background: var(--surface); border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 28px; gap: 12px; position: sticky; top: 0; z-index: 50; }
  .content-area { flex: 1; padding: 28px; max-width: 1100px; width: 100%; margin: 0 auto; }

  /* Nav items */
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; cursor: pointer; font-size: 14px; font-weight: 500; color: var(--text2); border: none; background: none; width: 100%; text-align: left; transition: all 0.15s; margin-bottom: 2px; }
  .nav-item:hover { background: var(--card2); color: var(--text); }
  .nav-item.active { background: linear-gradient(135deg, #5E6AD222, #7C3AED22); color: var(--accent); border: 1px solid #5E6AD222; }
  .nav-section { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text3); padding: 16px 12px 6px; }
  .nav-icon { font-size: 16px; flex-shrink: 0; }

  /* Buttons */
  .btn { padding: 9px 18px; border-radius: 10px; border: none; cursor: pointer; font-family: 'Outfit', sans-serif; font-weight: 500; font-size: 14px; transition: all 0.18s; display: inline-flex; align-items: center; gap: 8px; }
  .btn-primary { background: var(--accent); color: white; box-shadow: 0 2px 8px #5E6AD244; }
  .btn-primary:hover { background: #4F5BBE; transform: translateY(-1px); box-shadow: 0 4px 16px #5E6AD244; }
  .btn-secondary { background: var(--card2); color: var(--text); border: 1px solid var(--border); }
  .btn-secondary:hover { border-color: var(--accent); }
  .btn-success { background: var(--green); color: white; }
  .btn-success:hover { opacity: 0.88; }
  .btn-warn { background: var(--yellow); color: #1A1D2E; font-weight: 600; }
  .btn-danger { background: var(--red); color: white; }
  .btn-ghost { background: transparent; color: var(--text2); }
  .btn-ghost:hover { background: var(--card2); color: var(--text); }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }
  .btn-sm { padding: 6px 12px; font-size: 13px; }
  .btn-lg { padding: 13px 28px; font-size: 16px; }
  .btn-block { width: 100%; justify-content: center; }

  /* Cards */
  .card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; box-shadow: var(--shadow2); }
  .card-sm { padding: 16px; border-radius: 12px; }
  .card-hover { cursor: pointer; }
  .card-hover:hover { transform: translateY(-3px); box-shadow: var(--shadow); border-color: var(--accent); }

  /* Forms */
  textarea, input[type="text"], input[type="email"], input[type="password"] { width: 100%; background: var(--card2); border: 1.5px solid var(--border); border-radius: 10px; padding: 11px 14px; color: var(--text); font-family: 'Outfit', sans-serif; font-size: 14px; outline: none; resize: vertical; transition: border-color 0.2s, background 0.2s; }
  textarea:focus, input:focus { border-color: var(--accent); background: var(--surface); }
  select { width: 100%; background: var(--card2); border: 1.5px solid var(--border); border-radius: 10px; padding: 10px 14px; color: var(--text); font-size: 14px; outline: none; cursor: pointer; }
  select:focus { border-color: var(--accent); }
  label { font-size: 12px; font-weight: 600; color: var(--text2); letter-spacing: 0.5px; display: block; margin-bottom: 6px; }

  /* Tabs */
  .tab-row { display: flex; gap: 4px; background: var(--card2); padding: 4px; border-radius: 12px; margin-bottom: 20px; flex-wrap: wrap; border: 1px solid var(--border); }
  .tab { padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 500; background: transparent; color: var(--text2); transition: all 0.2s; }
  .tab.active { background: var(--surface); color: var(--text); box-shadow: var(--shadow2); }

  /* Utilities */
  .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; }
  .spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; flex-shrink: 0; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .fade-in { animation: fadeIn 0.28s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .timer { font-family: 'Bricolage Grotesque', sans-serif; font-size: 22px; font-weight: 800; letter-spacing: 2px; }
  .timer-warn { color: var(--red); animation: pulse 1s infinite; }
  @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
  .score-chip { padding: 4px 14px; border-radius: 20px; font-size: 13px; font-weight: 700; }
  .feedback-box { background: var(--card2); border-radius: 12px; padding: 20px; margin-top: 16px; border-left: 3px solid var(--accent); }
  .figure-box { background: ${dark ? "#0D1A14" : "#F0FDF4"}; border: 2px dashed #10B98133; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
  .image-box { border-radius: 14px; overflow: hidden; margin-bottom: 20px; position: relative; }
  .image-box img { width: 100%; max-height: 380px; object-fit: cover; display: block; }
  .image-label { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.85)); padding: 16px; }
  .prep-box { background: ${dark ? "#1E1A0D" : "#FFFBEB"}; border: 1px solid #F59E0B44; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
  .record-box { background: ${dark ? "#1E0D14" : "#FFF1F5"}; border: 1px solid #F43F5E44; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
  ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .flex { display: flex; align-items: center; }
  .flex-between { display: flex; align-items: center; justify-content: space-between; }
  .gap-8 { gap: 8px; } .gap-12 { gap: 12px; } .gap-16 { gap: 16px; }
  .mt-8 { margin-top: 8px; } .mt-12 { margin-top: 12px; } .mt-16 { margin-top: 16px; } .mt-24 { margin-top: 24px; } .mt-32 { margin-top: 32px; }
  .mb-8 { margin-bottom: 8px; } .mb-12 { margin-bottom: 12px; } .mb-16 { margin-bottom: 16px; } .mb-20 { margin-bottom: 20px; } .mb-24 { margin-bottom: 24px; }
  .text-sm { font-size: 13px; } .text-xs { font-size: 11px; } .text-muted { color: var(--text2); }
  .text-center { text-align: center; }
  .font-bold { font-weight: 700; } .font-800 { font-weight: 800; }

  /* Theme Toggle */
  .theme-toggle { width: 52px; height: 28px; background: ${dark ? "var(--accent)" : "var(--border)"}; border-radius: 14px; position: relative; cursor: pointer; transition: background 0.3s; border: none; flex-shrink: 0; }
  .theme-toggle::after { content: '${dark ? "🌙" : "☀️"}'; position: absolute; top: 3px; left: ${dark ? "27px" : "3px"}; width: 22px; height: 22px; background: white; border-radius: 50%; transition: left 0.3s; display: flex; align-items: center; justify-content: center; font-size: 11px; line-height: 22px; text-align: center; box-shadow: 0 1px 4px rgba(0,0,0,0.3); }

  /* Subject colors */
  .subj-math { --sc: #6366F1; } .subj-english { --sc: #3B82F6; } .subj-sciences { --sc: #10B981; }
  .subj-langacq { --sc: #F59E0B; } .subj-individuals { --sc: #F43F5E; }

  /* Chatbot */
  .chat-msg { padding: 12px 16px; border-radius: 14px; max-width: 75%; line-height: 1.65; font-size: 14px; white-space: pre-wrap; }
  .chat-msg.user { background: var(--accent); color: white; margin-left: auto; border-bottom-right-radius: 4px; }
  .chat-msg.ai { background: var(--card2); color: var(--text); border-bottom-left-radius: 4px; border: 1px solid var(--border); }
  .chat-area { display: flex; flex-direction: column; gap: 12px; padding: 20px; overflow-y: auto; flex: 1; min-height: 0; }

  /* Syllabus upload */
  .upload-zone { border: 2px dashed var(--border); border-radius: 16px; padding: 48px; text-align: center; cursor: pointer; transition: all 0.2s; }
  .upload-zone:hover { border-color: var(--accent); background: var(--card2); }
  .upload-zone.active { border-color: var(--accent); background: #5E6AD211; }

  /* Score ring */
  .score-ring { width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Bricolage Grotesque'; font-weight: 800; font-size: 22px; }

  /* Mobile */
  @media (max-width: 768px) {
    .sidebar { transform: translateX(-100%); } .sidebar.open { transform: none; }
    .main-area { margin-left: 0; }
    .grid-2, .grid-3 { grid-template-columns: 1fr; }
    .content-area { padding: 16px; }
    .topbar { padding: 0 16px; }
    .hamburger { display: flex !important; }
  }
  .hamburger { display: none; background: none; border: none; cursor: pointer; padding: 8px; color: var(--text); flex-direction: column; gap: 5px; }
  .hamburger span { width: 20px; height: 2px; background: currentColor; border-radius: 2px; display: block; }
`;

// ── DATA ──────────────────────────────────────────────────────────────────────
const SCIFI_THEMES = [
  "a totalitarian surveillance state where all thoughts are monitored",
  "genetic engineering and designer humans in a corporate-controlled society",
  "virtual reality addiction in a dystopian megacity",
  "climate collapse and the last surviving underground civilization",
  "artificial intelligence that has taken control of all governments",
  "time travel and the ethics of changing history",
  "underwater civilizations built after rising sea levels flooded Earth",
  "memory manipulation and stolen identity in a future police state",
  "a robot uprising and the question of machine consciousness",
  "post-apocalyptic wastelands and small tribal communities",
  "a world where sleep has been eliminated by mandatory medication",
  "teleportation technology that destroys and recreates the human body",
];

const ENGLISH_IMAGES = [
  { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80", title: "Circuit Board City", context: "A macro photograph of a glowing circuit board resembling an aerial view of a futuristic city." },
  { url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80", title: "Robot and Human", context: "A humanoid robot stands beside a human silhouette, both looking toward a bright horizon." },
  { url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80", title: "Earth from Space", context: "Planet Earth photographed from space, half illuminated, half in darkness." },
  { url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80", title: "Digital Surveillance", context: "Dozens of security camera screens fill a wall, each showing a different person unaware they are watched." },
];

const LANG_ACQ_IMAGES = [
  { url: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&q=80", title: "Air Pollution", topic: "environment", keywords: "pollution, smog, factories, chimneys, smoke, city" },
  { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", title: "Rainforest", topic: "environment", keywords: "forest, nature, trees, biodiversity, green, ecosystem" },
  { url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80", title: "Plastic Waste", topic: "pollution", keywords: "garbage, plastic, pollution, recycling, ocean, waste" },
  { url: "https://images.unsplash.com/photo-1542601906897-ecd4d0f5be14?w=800&q=80", title: "Solar Energy", topic: "environment", keywords: "solar panels, renewable, electricity, sustainable, clean" },
];

const MATH_TOPICS = ["Congruence of triangles – SSS, SAS, ASA, AAS","Similar triangles and scale factor","Transformations (translation, rotation, reflection, dilation)","Pythagoras' theorem, triplets and converse","Coordinate geometry – distance, midpoint, gradient","Graphing lines and equation from a graph","Area & perimeter of compound shapes","Arc length and area of sector","Surface area and volume of 3D solids","Composite solids and volume/capacity"];

const SCI_TOPICS = {
  biology: ["Structure & importance of plants and germination","Types of leaves","Photosynthesis – definition and word equation","Factors for photosynthesis (CO₂, water, light, chlorophyll)","Products of photosynthesis and their uses","Transpiration and stomata","Parasitic plants"],
  physics: ["Light waves and sound waves introduction","Sources of light and travel path","Production and transmission of sound","Role of vibrations in sound","Differences between sound and light waves","Reflection and refraction of light","Refractive index","Seismic waves and shadow zones"],
  chemistry: ["Word equations for chemical reactions","Energy changes in reactions","Metals and oxygen","Metals and acids","Metals and water","Displacement reactions","The reactivity series","Fuels and food energy"],
};

const IS_TOPICS = ["Pattern of global population change","Process of population change","Migration – push and pull factors","Demographic Transition Model (DTM) – all 5 stages","Population pyramids – analysis and interpretation","Case Study: Nigeria – rapid population growth","Case Study: Hong Kong – aging population","Case Study: Detroit – urban decline","Culture – definition and components","The Cultural Iceberg – visible vs invisible culture","Case Study: Mexico – cultural identity","Case Study: Grunge Music – counterculture","Multiculturalism – benefits and challenges","Conflicts threatening cultural identity"];

const ENG_NOTES = [
  { title: "Conventions of Sci-Fi Literature", pts: ["Futuristic or dystopian settings","Advanced technology (robots, spaceships, AI)","Social commentary on current issues","Speculative 'what if' scenarios"] },
  { title: "Dystopian Elements", pts: ["Oppressive government or ruling power","Loss of individual freedom","Propaganda and surveillance","Dehumanization of citizens"] },
  { title: "IB Command Terms – Criterion A", pts: ["Analyse – examine in detail, identify and explain components","Evaluate – make judgement based on evidence","Examine – consider carefully and in detail","Discuss – offer a balanced review"] },
  { title: "Ender's Game – Key Themes", pts: ["Child soldiers and manipulation","War, morality, and leadership","Identity under extreme pressure","Isolation and psychological effects"] },
];

const DEFAULT_SUBJECTS = [
  { id: "math", label: "Mathematics", sub: "Spatial Reasoning & Geometry", icon: "📐", color: "#6366F1", criteria: ["A","C","D"] },
  { id: "english", label: "Language & Literature", sub: "Science Fiction Unit", icon: "📖", color: "#3B82F6", criteria: ["A","C","D"] },
  { id: "sciences", label: "Integrated Sciences", sub: "Biology · Physics · Chemistry", icon: "🔬", color: "#10B981", criteria: ["A","D"] },
  { id: "langacq", label: "Language Acquisition", sub: "El mundo en que vivimos", icon: "🌍", color: "#F59E0B", criteria: ["B","C","D"] },
  { id: "individuals", label: "Individuals & Societies", sub: "Population & Culture", icon: "🌐", color: "#F43F5E", criteria: ["B","D"] },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

async function callAI(system, user) {
  try {
    const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ system, user }) });
    const d = await res.json();
    return d.content?.[0]?.text || "";
  } catch { return "Error connecting to AI. Please try again."; }
}

// Fallback answers for when AI is unavailable
const FALLBACK_ANSWERS = {
  dtm: `The **Demographic Transition Model (DTM)** describes how countries change their birth and death rates as they develop economically. It has 5 stages:

**Stage 1 – High Fluctuating:** Both birth rates and death rates are high. Population stays low and unstable. (e.g. isolated tribes)

**Stage 2 – Early Expanding:** Death rates fall rapidly (due to better medicine/food) but birth rates stay high. Population grows fast. (e.g. Nigeria)

**Stage 3 – Late Expanding:** Birth rates begin to fall as women gain education and access to contraception. Population still grows but slower. (e.g. India)

**Stage 4 – Low Fluctuating:** Both birth and death rates are low. Population is high but stable. (e.g. USA, UK)

**Stage 5 – Declining:** Birth rate falls below death rate. Population begins to shrink. (e.g. Japan, Hong Kong)

📌 Key idea: As countries develop, they move through these stages. The DTM helps explain population patterns and predict future changes.`,
  default: `Great question! I'm your MYP 3 Study Assistant. Here are some things I can help you with:

📐 **Mathematics** – Geometry, Pythagoras, transformations, coordinate geometry
📖 **English** – Sci-fi analysis, IB criteria, Ender's Game themes
🔬 **Sciences** – Photosynthesis, reactivity series, light & sound waves
🌍 **Language Acquisition** – Spanish vocabulary, environment topics
🌐 **Individuals & Societies** – DTM model, population pyramids, culture

Try asking me something specific like:
• "Explain the reactivity series"
• "How do I write a Criterion A essay?"
• "What are the stages of the DTM?"`,
};

function getFallbackReply(userMessage) {
  const msg = userMessage.toLowerCase();
  if (msg.includes("dtm") || msg.includes("demographic transition")) {
    return FALLBACK_ANSWERS.dtm;
  }
  return FALLBACK_ANSWERS.default;
}

async function callClaude(messages) {
  const apiKey = localStorage.getItem("claude_api_key");
  if (!apiKey) {
    // No key set — use fallback
    const lastUser = [...messages].reverse().find(m => m.role === "user");
    return getFallbackReply(lastUser?.content || "");
  }
  try {
    const filtered = messages.filter(m => m.role === "user" || m.role === "assistant");
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey.trim(),
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: "You are a helpful MYP 3 study assistant. Help students with Math, English Language & Literature, Sciences, Language Acquisition, and Individuals & Societies. Be concise, clear, and encouraging.",
        messages: filtered.map(m => ({ role: m.role, content: m.content }))
      })
    });
    const d = await res.json();
    // If any API error (billing, invalid key, etc.) — fall back silently
    if (d.error) {
      const lastUser = [...messages].reverse().find(m => m.role === "user");
      return getFallbackReply(lastUser?.content || "");
    }
    return d.content?.[0]?.text || getFallbackReply(messages[messages.length - 1]?.content || "");
  } catch (e) {
    const lastUser = [...messages].reverse().find(m => m.role === "user");
    return getFallbackReply(lastUser?.content || "");
  }
}

// Firebase Auth via REST API (no SDK needed)
const FB_API_KEY = ""; // Users set this via env or we use Supabase alternative
async function firebaseAuth(mode, email, password, name) {
  // Using localStorage as cloud-sync simulation; in production swap for real Firebase
  // For a proper setup, users configure VITE_FIREBASE_API_KEY
  const key = `user_${email}`;
  if (mode === "register") {
    if (localStorage.getItem(key)) return { error: "Email already registered." };
    const user = { email, name: name || email.split("@")[0], createdAt: Date.now() };
    localStorage.setItem(key, JSON.stringify({ ...user, pass: btoa(password) }));
    return { user };
  } else {
    const raw = localStorage.getItem(key);
    if (!raw) return { error: "No account found." };
    const stored = JSON.parse(raw);
    if (stored.pass !== btoa(password)) return { error: "Incorrect password." };
    return { user: { email: stored.email, name: stored.name } };
  }
}

// ── UI COMPONENTS ─────────────────────────────────────────────────────────────
function Spinner() { return <span className="spinner" />; }

function FeedbackBox({ text }) {
  if (!text) return null;
  return <div className="feedback-box fade-in"><div style={{ fontSize: 10, color: "var(--accent)", fontWeight: 700, marginBottom: 8, letterSpacing: 1.2 }}>✦ AI FEEDBACK</div><div style={{ lineHeight: 1.75, whiteSpace: "pre-wrap", fontSize: 14 }}>{text}</div></div>;
}

function ScoreChip({ score }) {
  const good = score >= 6, mid = score >= 4;
  const color = good ? "var(--green)" : mid ? "var(--yellow)" : "var(--red)";
  return <span className="score-chip" style={{ background: color + "22", color }}>{score}/8</span>;
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

function CountdownTimer({ seconds, label, color = "var(--yellow)" }) {
  const [rem, setRem] = useState(seconds); const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setRem(p => { if (p <= 1) { clearInterval(t); setDone(true); return 0; } return p - 1; }), 1000);
    return () => clearInterval(t);
  }, []);
  const d = `${String(Math.floor(rem / 60)).padStart(2, "0")}:${String(rem % 60).padStart(2, "0")}`;
  return (
    <div style={{ textAlign: "center", padding: "8px 16px", background: color + "18", border: `1px solid ${color}44`, borderRadius: 10 }}>
      <div style={{ fontSize: 9, color, fontWeight: 700, letterSpacing: 1.5, marginBottom: 2 }}>{label}</div>
      <div style={{ fontFamily: "'Bricolage Grotesque'", fontSize: 26, fontWeight: 800, color: done ? "var(--red)" : color }}>{done ? "TIME'S UP!" : d}</div>
    </div>
  );
}

function ImageDisplay({ url, title, caption }) {
  const [err, setErr] = useState(false);
  if (err) return <div className="card mb-20" style={{ textAlign: "center", padding: 32 }}><div style={{ fontSize: 48, marginBottom: 12 }}>🖼️</div><div className="font-bold">{title}</div>{caption && <div className="text-sm text-muted mt-8">{caption}</div>}</div>;
  return <div className="image-box"><img src={url} alt={title} onError={() => setErr(true)} /><div className="image-label"><div className="font-bold" style={{ color: "#fff" }}>{title}</div>{caption && <div style={{ fontSize: 12, color: "#ccc" }}>{caption}</div>}</div></div>;
}

function SectionHeader({ title, sub }) {
  return <div className="mb-24"><h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{title}</h2>{sub && <p className="text-sm text-muted">{sub}</p>}</div>;
}

// ── AUTH ──────────────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const { dark } = useTheme();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [pass, setPass] = useState("");
  const [err, setErr] = useState(""); const [load, setLoad] = useState(false);

  async function submit() {
    if (!email || !pass) { setErr("Please fill all fields."); return; }
    setLoad(true); setErr("");
    const result = await firebaseAuth(mode, email, pass, name);
    setLoad(false);
    if (result.error) { setErr(result.error); return; }
    onLogin(result.user);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--bg)" }}>
      {/* Left panel */}
      <div style={{ flex: 1, background: "linear-gradient(135deg, #5E6AD2, #7C3AED)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 48px", color: "white" }} className="auth-left">
        <div style={{ fontSize: 48, marginBottom: 20 }}>📚</div>
        <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>MYP 3<br/>Study Hub</h1>
        <p style={{ opacity: 0.85, lineHeight: 1.75, fontSize: 16, maxWidth: 360 }}>AI-powered practice for all your subjects. Syllabus-aware, criterion-aligned, and built for Apeejay School International.</p>
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 12 }}>
          {["📐 Math · English · Sciences", "🌍 Language Acquisition · I&S", "🤖 Integrated AI Chatbot", "📄 Syllabus Upload → Auto-setup"].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, opacity: 0.9, fontSize: 14 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.6)", flexShrink: 0 }} />{f}</div>
          ))}
        </div>
      </div>
      {/* Right panel */}
      <div style={{ width: 440, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 48px", background: "var(--surface)" }}>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>{mode === "login" ? "Welcome back" : "Create account"}</h2>
          <p className="text-muted text-sm">{mode === "login" ? "Sign in to your study account" : "Start your MYP 3 journey"}</p>
        </div>
        <div className="tab-row mb-24" style={{ marginBottom: 24 }}>
          <button className={`tab ${mode === "login" ? "active" : ""}`} onClick={() => { setMode("login"); setErr(""); }}>Sign In</button>
          <button className={`tab ${mode === "register" ? "active" : ""}`} onClick={() => { setMode("register"); setErr(""); }}>Register</button>
        </div>
        {mode === "register" && <div className="mb-16"><label>YOUR NAME</label><input type="text" placeholder="e.g. Aarush Chawla" value={name} onChange={e => setName(e.target.value)} /></div>}
        <div className="mb-16"><label>EMAIL</label><input type="email" placeholder="student@apeejay.edu" value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div className="mb-24"><label>PASSWORD</label><input type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} /></div>
        {err && <div style={{ background: "var(--red)22", border: "1px solid var(--red)44", borderRadius: 10, padding: "10px 14px", color: "var(--red)", fontSize: 13, marginBottom: 16 }}>{err}</div>}
        <button className="btn btn-primary btn-lg btn-block" onClick={submit} disabled={load}>{load ? <><Spinner /> Processing...</> : mode === "login" ? "Sign In →" : "Create Account →"}</button>
        <div style={{ marginTop: 20, fontSize: 12, color: "var(--text3)", lineHeight: 1.6 }}>
          🔒 Your data is stored locally. For cloud sync, add Firebase credentials in Settings.
        </div>
      </div>
    </div>
  );
}

// ── SYLLABUS UPLOAD ────────────────────────────────────────────────────────────
function SyllabusUpload({ onUpload }) {
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const fileRef = useRef();

  async function processFile(file) {
    if (!file) return;
    setLoading(true);
    const content = await file.text();
    // Clean the text
    const cleaned = content
      .replace(/\r\n/g, "\n").replace(/\r/g, "\n")
      .replace(/[^\x20-\x7E\n\t]/g, " ")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    // Ask AI to extract subject info
    const parsed = await callAI(
      `You are parsing an IB MYP school syllabus document. Extract structured information for each subject found.
      For EACH subject, output:
      SUBJECT: [name]
      TOPICS: [comma-separated list of topics]
      CRITERIA: [comma-separated criteria letters like A,B,C,D]
      UNITS: [unit names]
      ---
      Keep it structured. Focus on what will be assessed.`,
      `Syllabus content:\n${cleaned.slice(0, 4000)}`
    );
    setText(parsed);
    onUpload({ raw: cleaned, parsed });
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <SectionHeader title="📄 Syllabus Setup" sub="Upload your syllabus to auto-configure all subject practice areas" />
      <div
        className={`upload-zone ${drag ? "active" : ""}`}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); processFile(e.dataTransfer.files[0]); }}
        onClick={() => fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept=".txt,.pdf,.doc,.docx" style={{ display: "none" }} onChange={e => processFile(e.target.files[0])} />
        {loading ? (
          <div><Spinner /><div className="mt-12 text-muted">Processing syllabus with AI...</div></div>
        ) : (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📂</div>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Drop your syllabus here</div>
            <div className="text-muted text-sm">Supports .txt, .pdf, .doc, .docx — or click to browse</div>
            <div className="mt-16" style={{ padding: "10px 20px", background: "var(--accent)22", borderRadius: 10, display: "inline-block", color: "var(--accent)", fontSize: 13, fontWeight: 600 }}>Browse Files</div>
          </>
        )}
      </div>
      {text && (
        <div className="card mt-16 fade-in">
          <div style={{ fontSize: 12, color: "var(--green)", fontWeight: 700, marginBottom: 12 }}>✓ SYLLABUS PROCESSED — SUBJECTS AUTO-CONFIGURED</div>
          <pre style={{ fontSize: 12, lineHeight: 1.8, whiteSpace: "pre-wrap", color: "var(--text2)", maxHeight: 300, overflowY: "auto" }}>{text}</pre>
        </div>
      )}
      <div className="card mt-16" style={{ borderColor: "var(--accent)44" }}>
        <div style={{ fontWeight: 700, marginBottom: 12, color: "var(--accent)" }}>⚡ What happens after upload?</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {["Your syllabus is parsed by AI to extract topics, units, and criteria", "Subject cards appear on your dashboard, tailored to YOUR syllabus", "Practice questions and exams align with your specific topics", "Language Acquisition auto-detects your target language"].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: "var(--text2)" }}><span style={{ color: "var(--green)", flexShrink: 0 }}>✓</span>{s}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── HOME ──────────────────────────────────────────────────────────────────────
function HomePage({ user, scores, onSelect, syllabusUploaded, onUploadClick }) {
  return (
    <div>
      <div className="flex-between mb-32">
        <div>
          <div style={{ fontSize: 11, color: "var(--text3)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>MYP 3 · Mid-Term 2 · March 2026</div>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>Welcome back, {user.name.split(" ")[0]} 👋</h1>
          <p className="text-muted text-sm mt-8">Apeejay School International, Panchsheel Park</p>
        </div>
      </div>

      {!syllabusUploaded && (
        <div className="card mb-24 fade-in" style={{ background: "linear-gradient(135deg, var(--accent)18, var(--accent2)18)", borderColor: "var(--accent)44" }}>
          <div className="flex-between" style={{ flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 6 }}>📄 Upload Your Syllabus</div>
              <div className="text-sm text-muted">Upload your syllabus to auto-configure subjects, topics, and criteria for your practice sessions.</div>
            </div>
            <button className="btn btn-primary" onClick={onUploadClick}>Upload Syllabus →</button>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {DEFAULT_SUBJECTS.map(s => {
          const avg = scores[s.id];
          return (
            <div key={s.id} className="card card-hover fade-in" onClick={() => onSelect(s.id)}
              style={{ borderColor: avg != null ? s.color + "44" : "var(--border)", cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = avg != null ? s.color + "44" : "var(--border)"; e.currentTarget.style.transform = ""; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ fontSize: 36 }}>{s.icon}</div>
                {avg != null && <ScoreChip score={avg} />}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{s.label}</h3>
              <p className="text-sm text-muted mb-16">{s.sub}</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {s.criteria.map(c => (
                  <span key={c} className="badge" style={{ background: s.color + "22", color: s.color }}>Crit {c}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {Object.keys(scores).length > 0 && (
        <div className="card mt-24">
          <h3 style={{ fontWeight: 700, marginBottom: 20 }}>📊 Score Overview</h3>
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            {Object.entries(scores).map(([id, avg]) => {
              const s = DEFAULT_SUBJECTS.find(x => x.id === id);
              if (!s) return null;
              return (
                <div key={id} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>{s.icon}</div>
                  <div className="text-xs text-muted mb-8">{s.label.split(" ")[0]}</div>
                  <div className="score-ring" style={{ background: (avg >= 6 ? "var(--green)" : avg >= 4 ? "var(--yellow)" : "var(--red)") + "22", color: avg >= 6 ? "var(--green)" : avg >= 4 ? "var(--yellow)" : "var(--red)", margin: "0 auto" }}>{avg}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── MATH ──────────────────────────────────────────────────────────────────────
function MathFigure({ figureText }) {
  if (!figureText) return null;
  return <div className="figure-box"><div style={{ fontSize: 10, color: "var(--green)", fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>📐 REFERENCE FIGURE</div><pre style={{ whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.8, color: "var(--green)", fontFamily: "monospace" }}>{figureText}</pre></div>;
}

function MathPractice({ onScore }) {
  const [topic, setTopic] = useState("random"); const [q, setQ] = useState(null); const [figure, setFigure] = useState(null);
  const [ans, setAns] = useState(""); const [fb, setFb] = useState(null); const [load, setLoad] = useState(false); const [score, setScore] = useState(null);

  async function gen() {
    setLoad(true); setFb(null); setAns(""); setScore(null); setQ(null); setFigure(null);
    const t = topic === "random" ? rnd(MATH_TOPICS) : topic;
    const ctx = rnd(["a real-life architecture problem","a sports field scenario","a navigation task","a construction challenge","an abstract geometry proof"]);
    const result = await callAI(
      `IB MYP 3 Math teacher. One exam question with ASCII figure.\nContext: Frame as ${ctx}.\nFORMAT:\n---FIGURE---\n[ASCII diagram with labels]\n---QUESTION---\n[Question with parts. IB command terms.]\nMARKS: [4-8]\nCRITERION: [A or C or D]\n---END---`, `Topic: ${t}`);
    const figMatch = result.match(/---FIGURE---\n([\s\S]*?)---QUESTION---/);
    const qMatch = result.match(/---QUESTION---\n([\s\S]*?)---END---/);
    if (figMatch) setFigure(figMatch[1].trim());
    setQ(qMatch ? qMatch[1].trim() : result);
    setLoad(false);
  }

  async function submit() {
    setLoad(true);
    const r = await callAI("IB MYP3 Math examiner. Score out of 8. Format:\nSCORE: X/8\nCRITERION: [A/C/D]\nFEEDBACK: [detailed method]\nMODEL ANSWER: [step-by-step]", `Question:\n${q}\n\nWorking:\n${ans}`);
    setFb(r); const s = parseInt(r.match(/SCORE:\s*(\d)/)?.[1] || "0"); setScore(s); onScore?.(s); setLoad(false);
  }

  return (
    <div className="fade-in">
      <div className="mb-16"><select value={topic} onChange={e => setTopic(e.target.value)}><option value="random">🎲 Random Topic</option>{MATH_TOPICS.map((t, i) => <option key={i} value={t}>{t}</option>)}</select></div>
      <button className="btn btn-primary mb-24" onClick={gen} disabled={load}>{load ? <><Spinner /> Generating...</> : "⚡ Generate Question"}</button>
      {(figure || q) && <div className="card fade-in"><MathFigure figureText={figure} />{q && <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.85, marginBottom: 20, fontSize: 14 }}>{q}</div>}<label>YOUR WORKING & ANSWER</label><textarea rows={8} placeholder="Show all working step by step..." value={ans} onChange={e => setAns(e.target.value)} /><div className="flex gap-8 mt-12"><button className="btn btn-success" onClick={submit} disabled={load || !ans.trim()}>{load ? <><Spinner /> Evaluating...</> : "✓ Submit"}</button><button className="btn btn-secondary" onClick={gen} disabled={load}>Next →</button></div>{score != null && <div className="mt-12"><ScoreChip score={score} /></div>}<FeedbackBox text={fb} /></div>}
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
      const result = await callAI(`IB MYP3 Math exam question.\nFORMAT:\n---FIGURE---\n[ASCII diagram]\n---QUESTION---\n[question + IB command terms]\nMARKS: [4-8]\nCRITERION: [A/C/D]\n---END---`, `Topic: ${t}`);
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

  if (phase === "start") return <div className="card fade-in text-center" style={{ padding: 48 }}><div style={{ fontSize: 52, marginBottom: 16 }}>📋</div><h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Mathematics Practice Exam</h3><p className="text-muted mb-24">5 questions with figures · 1 hour · Criteria A, C, D</p><button className="btn btn-primary btn-lg" onClick={start} disabled={load}>{load ? <><Spinner /> Building...</> : "🚀 Begin Exam"}</button></div>;

  if (phase === "exam") return (
    <div className="fade-in">
      <div className="card mb-16 flex-between" style={{ padding: "14px 20px", flexWrap: "wrap", gap: 10 }}>
        <span style={{ fontWeight: 600 }}>Q{cur + 1} of {qs.length}</span><TimerComp seconds={3600} onEnd={submit} /><span className="text-sm text-muted">{Object.keys(ans).length}/{qs.length} answered</span>
      </div>
      <div className="card"><MathFigure figureText={qs[cur]?.figure} /><div style={{ whiteSpace: "pre-wrap", lineHeight: 1.85, marginBottom: 20, fontSize: 14 }}>{qs[cur]?.text}</div><textarea rows={8} placeholder="Show all working..." value={ans[cur] || ""} onChange={e => setAns(p => ({ ...p, [cur]: e.target.value }))} /><div className="flex gap-8 mt-12">{cur > 0 && <button className="btn btn-secondary" onClick={() => setCur(c => c - 1)}>← Prev</button>}{cur < qs.length - 1 ? <button className="btn btn-primary" onClick={() => setCur(c => c + 1)} disabled={!ans[cur]?.trim()}>Next →</button> : <button className="btn btn-success" onClick={submit} disabled={load || !ans[cur]?.trim()}>{load ? <><Spinner /> Grading...</> : "✓ Submit Exam"}</button>}</div></div>
    </div>
  );

  const avg = res ? Math.round(res.reduce((a, b) => a + b.score, 0) / res.length) : 0;
  return <div className="fade-in"><div className="card text-center mb-24" style={{ padding: 36 }}><div style={{ fontSize: 44, marginBottom: 10 }}>{avg >= 6 ? "🏆" : avg >= 4 ? "📈" : "💪"}</div><h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Exam Complete!</h3><div style={{ fontSize: 44, fontWeight: 800, color: avg >= 6 ? "var(--green)" : "var(--red)", margin: "8px 0" }}>{avg}/8</div><button className="btn btn-primary mt-16" onClick={() => setPhase("start")}>🔄 Retake</button></div>{res.map((r, i) => <div key={i} className="card mb-12"><div className="flex-between mb-8"><span style={{ fontWeight: 600 }}>Q{i + 1} – {r.q.topic.slice(0, 45)}</span><ScoreChip score={r.score} /></div><MathFigure figureText={r.q.figure} /><FeedbackBox text={r.feedback} /></div>)}</div>;
}

function MathPage({ onScore }) {
  const [tab, setTab] = useState("notes");
  return <div><SectionHeader title="📐 Mathematics" sub="Criteria A · C · D · Unit 3: Spatial Reasoning" /><div className="tab-row">{[["notes","📝 Notes"],["practice","🎯 Practice"],["exam","📋 Exam"]].map(([t,l]) => <button key={t} className={`tab ${tab===t?"active":""}`} onClick={() => setTab(t)}>{l}</button>)}</div>{tab==="notes" && <div className="fade-in">{MATH_TOPICS.map((t,i) => <div key={i} className="card mb-8 flex gap-12"><span className="badge" style={{ background:"#6366F122",color:"#6366F1",flexShrink:0,marginTop:2 }}>T{i+1}</span><span style={{ fontSize:14 }}>{t}</span></div>)}</div>}{tab==="practice" && <MathPractice onScore={s => onScore("math",s)} />}{tab==="exam" && <MathExam onScore={s => onScore("math",s)} />}</div>;
}

// ── ENGLISH ───────────────────────────────────────────────────────────────────
function EnglishAnalysis({ onScore }) {
  const [mode, setMode] = useState("text"); const [q, setQ] = useState(null); const [image, setImage] = useState(null);
  const [ans, setAns] = useState(""); const [fb, setFb] = useState(null); const [load, setLoad] = useState(false); const [score, setScore] = useState(null);

  async function genText() {
    setLoad(true); setFb(null); setAns(""); setScore(null); setImage(null);
    const theme = rnd(SCIFI_THEMES); const cmdTerm = rnd(["Analyse","Evaluate","Examine","Discuss"]); const focus = rnd(["imagery","symbolism","tone and mood","characterisation","narrative voice","setting","language choices"]);
    const r = await callAI(`IB MYP 3 English teacher. SHORT unseen sci-fi extract (5-8 sentences) on theme: "${theme}". Vivid with literary devices. Then ONE analysis question.\nFORMAT:\nEXTRACT:\n[text]\n\nQUESTION:\n${cmdTerm} how the author uses ${focus} in the extract. (8 marks)\nCRITERION: A`, "Generate English analysis");
    setQ(r); setLoad(false);
  }

  async function genImage() {
    setLoad(true); setFb(null); setAns(""); setScore(null); setQ(null);
    const img = rnd(ENGLISH_IMAGES); setImage(img);
    const cmdTerm = rnd(["Analyse","Evaluate","Examine"]); const focus = rnd(["mood and atmosphere","symbolism","what the image suggests about society","contrast and tension","light and darkness"]);
    setQ(`IMAGE ANALYSIS TASK\n\nStudy the image: "${img.title}"\nContext: ${img.context}\n\n${cmdTerm} how the visual elements create ${focus}. Refer to specific details — colour, composition, subject, setting, symbolic meaning. Connect to sci-fi themes.\n\n(8 marks) — Criterion A`);
    setLoad(false);
  }

  async function submit() {
    setLoad(true);
    const r = await callAI(`IB MYP3 English Criterion A examiner. Evaluate this ${image ? "image" : "text"} analysis.\nSCORE: X/8\nSTRAND BREAKDOWN:\n- Strand i: X/2\n- Strand ii: X/2\n- Strand iii: X/2\n- Strand iv: X/2\nFEEDBACK: [specific]\nWHAT WENT WELL: [2-3]\nEVEN BETTER IF: [2-3]`, `Task:\n${q}\n\nResponse:\n${ans}`);
    setFb(r); const s = parseInt(r.match(/SCORE:\s*(\d)/)?.[1] || "0"); setScore(s); onScore?.(s); setLoad(false);
  }

  return (
    <div className="fade-in">
      <div className="flex gap-8 mb-20"><button className={`btn ${mode==="text"?"btn-primary":"btn-secondary"}`} onClick={() => setMode("text")}>📝 Text Extract</button><button className={`btn ${mode==="image"?"btn-primary":"btn-secondary"}`} onClick={() => setMode("image")}>🖼️ Image Analysis</button></div>
      <button className="btn btn-primary mb-24" onClick={mode==="text"?genText:genImage} disabled={load}>{load ? <><Spinner /> Generating...</> : `⚡ Generate ${mode==="text"?"Extract":"Image Task"}`}</button>
      {(q||image) && <div className="card fade-in">{image && <ImageDisplay url={image.url} title={image.title} caption="Study this image carefully" />}{q && <div style={{ whiteSpace:"pre-wrap",lineHeight:1.85,marginBottom:20,fontSize:14,borderLeft:image?"3px solid var(--blue)":"none",paddingLeft:image?16:0 }}>{q}</div>}<label>YOUR ANALYSIS</label><textarea rows={10} placeholder="Write your analysis with evidence and literary features..." value={ans} onChange={e => setAns(e.target.value)} /><div className="flex gap-8 mt-12"><button className="btn btn-success" onClick={submit} disabled={load||!ans.trim()}>{load?<><Spinner /> Evaluating</>:"✓ Submit"}</button><button className="btn btn-secondary" onClick={mode==="text"?genText:genImage} disabled={load}>Next →</button></div>{score!=null && <div className="mt-12"><ScoreChip score={score} /></div>}<FeedbackBox text={fb} /></div>}
    </div>
  );
}

function WritingPractice({ onScore }) {
  const [type, setType] = useState("story"); const [q, setQ] = useState(null); const [ans, setAns] = useState(""); const [fb, setFb] = useState(null); const [load, setLoad] = useState(false); const [score, setScore] = useState(null);

  async function gen() {
    setLoad(true); setFb(null); setAns(""); setScore(null);
    const r = await callAI(`IB MYP3 English teacher. Creative writing prompt for a ${type}. Theme: ${rnd(SCIFI_THEMES)}. Specific and unusual.\nTASK TYPE: ${type.toUpperCase()}\nPROMPT: [vivid prompt]\nREQUIREMENTS:\n- Word count: 300-500\n- [2-3 specific elements]`, `Generate ${type} prompt`);
    setQ(r); setLoad(false);
  }

  async function submit() {
    setLoad(true);
    const r = await callAI("IB MYP3 English Criterion C. Score out of 8.\nSCORE: X/8\nBREAKDOWN:\n- Purpose/Audience (i): X/2\n- Language Choices (ii): X/2\n- Text type features (iii): X/2\n- Style/Voice (iv): X/2\nFEEDBACK:\nSTRENGTHS: [2-3]\nIMPROVEMENTS: [2-3]", `Prompt:\n${q}\n\nWriting:\n${ans}`);
    setFb(r); const s = parseInt(r.match(/SCORE:\s*(\d)/)?.[1] || "0"); setScore(s); onScore?.(s); setLoad(false);
  }

  const wc = ans.trim() ? ans.trim().split(/\s+/).length : 0;
  return (
    <div className="fade-in">
      <div className="flex gap-8 mb-20" style={{ flexWrap:"wrap" }}>{[["story","📖 Story"],["journal","📔 Journal"],["dialogue","💬 Dialogue"],["monologue","🎭 Monologue"]].map(([t,l]) => <button key={t} className={`btn ${type===t?"btn-primary":"btn-secondary"}`} onClick={() => setType(t)}>{l}</button>)}</div>
      <button className="btn btn-primary mb-24" onClick={gen} disabled={load}>{load?<><Spinner /> Generating</>:"⚡ Generate Prompt"}</button>
      {q && <div className="card fade-in"><div style={{ whiteSpace:"pre-wrap",lineHeight:1.85,marginBottom:20,fontSize:14 }}>{q}</div><textarea rows={12} placeholder="Write your response (300-500 words)..." value={ans} onChange={e => setAns(e.target.value)} /><div className="text-xs text-muted mt-8">Words: {wc}</div><div className="flex gap-8 mt-12"><button className="btn btn-success" onClick={submit} disabled={load||wc<50}>{load?<><Spinner /> Evaluating</>:"✓ Submit"}</button><button className="btn btn-secondary" onClick={gen} disabled={load}>New Prompt →</button></div>{score!=null && <div className="mt-12"><ScoreChip score={score} /></div>}<FeedbackBox text={fb} /></div>}
    </div>
  );
}

function EnglishExam({ onScore }) {
  const [phase, setPhase] = useState("start"); const [paper, setPaper] = useState(null); const [examImg, setExamImg] = useState(null); const [ans, setAns] = useState({ a:"",c:"" }); const [res, setRes] = useState(null); const [load, setLoad] = useState(false);

  async function start() {
    setLoad(true);
    const img = rnd(ENGLISH_IMAGES); setExamImg(img);
    const theme = rnd(SCIFI_THEMES);
    const p = await callAI(`IB MYP3 English 80-min exam.\nSECTION A – Criterion A (Image Analysis):\nStudy image: "${img.title}" — ${img.context}\nQ1 (8 marks): Analyse how visual elements create meaning. Refer to composition, colour, symbolism.\n\nSECTION C – Criterion C (Creative Writing):\nInspired by the theme: "${theme}"\nQ2 (8 marks): Write a short story or journal entry (300-400 words).`, "Generate English exam");
    setPaper(p); setAns({ a:"",c:"" }); setPhase("exam"); setLoad(false);
  }

  async function submit() {
    setLoad(true);
    const [aFb, cFb] = await Promise.all([
      callAI("IB MYP3 English Criterion A. Score out of 8.\nSCORE: X/8\nFEEDBACK:", `Paper:\n${paper}\nImage context: ${examImg?.context}\nAnswer:\n${ans.a}`),
      callAI("IB MYP3 English Criterion C. Score out of 8.\nSCORE: X/8\nFEEDBACK:", `Paper:\n${paper}\nAnswer:\n${ans.c}`)
    ]);
    const sA = parseInt(aFb.match(/SCORE:\s*(\d)/)?.[1] || "0"), sC = parseInt(cFb.match(/SCORE:\s*(\d)/)?.[1] || "0");
    onScore?.(Math.round((sA + sC) / 2)); setRes({ aFb, cFb, sA, sC }); setPhase("results"); setLoad(false);
  }

  if (phase === "start") return <div className="card fade-in text-center" style={{ padding: 48 }}><div style={{ fontSize: 52, marginBottom: 16 }}>📋</div><h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>English Practice Exam</h3><p className="text-muted mb-24">Criteria A & C · 80 minutes · Image + Creative Writing</p><button className="btn btn-primary btn-lg" onClick={start} disabled={load}>{load?<><Spinner /> Building</>:"🚀 Begin Exam"}</button></div>;
  if (phase === "exam") return <div className="fade-in"><div className="card mb-16 flex-between" style={{ padding:"14px 20px" }}><span style={{ fontWeight:600 }}>English Exam</span><TimerComp seconds={4800} onEnd={submit} /></div>{examImg && <ImageDisplay url={examImg.url} title={examImg.title} caption="Section A — Study this image" />}<div className="card mb-16 fade-in"><div style={{ whiteSpace:"pre-wrap",lineHeight:1.85,marginBottom:20,fontSize:14 }}>{paper}</div><label>SECTION A – CRITERION A ANSWER</label><textarea rows={10} placeholder="Analyse the image in detail..." value={ans.a} onChange={e => setAns(p => ({ ...p, a:e.target.value }))} /></div><div className="card mb-16"><label>SECTION C – CRITERION C ANSWER</label><textarea rows={14} placeholder="Write your creative piece (300-400 words)..." value={ans.c} onChange={e => setAns(p => ({ ...p, c:e.target.value }))} /></div><button className="btn btn-success btn-lg" onClick={submit} disabled={load}>{load?<><Spinner /> Grading</>:"✓ Submit Exam"}</button></div>;
  return <div className="fade-in"><div className="card text-center mb-24" style={{ padding:36 }}><h3 style={{ fontSize:24,fontWeight:800,marginBottom:20 }}>Results</h3><div className="flex gap-16" style={{ justifyContent:"center" }}><div><div className="text-xs text-muted">Criterion A</div><div style={{ fontSize:38,fontWeight:800,color:res.sA>=6?"var(--green)":"var(--red)" }}>{res.sA}/8</div></div><div><div className="text-xs text-muted">Criterion C</div><div style={{ fontSize:38,fontWeight:800,color:res.sC>=6?"var(--green)":"var(--red)" }}>{res.sC}/8</div></div></div><button className="btn btn-primary mt-16" onClick={() => setPhase("start")}>🔄 Retake</button></div><div className="card mb-12"><h4 className="mb-8">Criterion A Feedback</h4><FeedbackBox text={res.aFb} /></div><div className="card"><h4 className="mb-8">Criterion C Feedback</h4><FeedbackBox text={res.cFb} /></div></div>;
}

function EnglishPage({ onScore }) {
  const [tab, setTab] = useState("notes");
  return <div><SectionHeader title="📖 Language & Literature" sub="Criteria A · C · D · Sci-Fi & Dystopian Fiction" /><div className="tab-row">{[["notes","📝 Notes"],["analysis","🔍 Analysis (A)"],["writing","✍️ Writing (C)"],["exam","📋 Exam"]].map(([t,l]) => <button key={t} className={`tab ${tab===t?"active":""}`} onClick={() => setTab(t)}>{l}</button>)}</div>{tab==="notes" && <div className="fade-in">{ENG_NOTES.map((n,i) => <div key={i} className="card mb-12"><h4 style={{ color:"var(--blue)",fontWeight:700,marginBottom:10 }}>{n.title}</h4>{n.pts.map((p,j) => <div key={j} style={{ padding:"7px 0",borderBottom:"1px solid var(--border)",fontSize:14,display:"flex",gap:10 }}><span style={{ color:"var(--blue)",flexShrink:0 }}>›</span>{p}</div>)}</div>)}</div>}{tab==="analysis" && <EnglishAnalysis onScore={s => onScore("english",s)} />}{tab==="writing" && <WritingPractice onScore={s => onScore("english",s)} />}{tab==="exam" && <EnglishExam onScore={s => onScore("english",s)} />}</div>;
}

// ── SCIENCES ──────────────────────────────────────────────────────────────────
function SciQuiz({ subject, topics, onScore }) {
  const [q, setQ] = useState(null); const [ans, setAns] = useState(""); const [fb, setFb] = useState(null); const [load, setLoad] = useState(false); const [score, setScore] = useState(null);

  async function gen() {
    setLoad(true); setFb(null); setAns(""); setScore(null);
    const t = rnd(topics); const crit = rnd(["A","D"]); const cmd = crit === "A" ? rnd(["Define","State","Outline","Explain"]) : rnd(["Evaluate","Analyse","Discuss","Justify"]);
    const r = await callAI(`IB MYP3 ${subject} teacher. Criterion ${crit} question. Topic: ${t}. Command: ${cmd}.\nQUESTION: [full question]\nMARKS: [4-8]\nCRITERION: ${crit}`, `Topic: ${t}`);
    setQ(r); setLoad(false);
  }

  async function submit() {
    setLoad(true);
    const r = await callAI(`IB MYP3 ${subject} Criterion examiner. Score out of 8.\nSCORE: X/8\nFEEDBACK:\nSTRENGTHS: [2-3]\nIMPROVEMENTS: [2-3]`, `Q:\n${q}\nA:\n${ans}`);
    setFb(r); const s = parseInt(r.match(/SCORE:\s*(\d)/)?.[1] || "0"); setScore(s); onScore?.(s); setLoad(false);
  }

  return <div className="fade-in"><button className="btn btn-primary mb-24" onClick={gen} disabled={load}>{load?<><Spinner /> Generating</>:"⚡ Generate Question"}</button>{q && <div className="card fade-in"><div style={{ whiteSpace:"pre-wrap",lineHeight:1.85,marginBottom:20,fontSize:14 }}>{q}</div><label>YOUR ANSWER</label><textarea rows={8} placeholder="Write your structured response..." value={ans} onChange={e => setAns(e.target.value)} /><div className="flex gap-8 mt-12"><button className="btn btn-success" onClick={submit} disabled={load||!ans.trim()}>{load?<><Spinner /> Evaluating</>:"✓ Submit"}</button><button className="btn btn-secondary" onClick={gen} disabled={load}>Next →</button></div>{score!=null && <div className="mt-12"><ScoreChip score={score} /></div>}<FeedbackBox text={fb} /></div>}</div>;
}

function SciExam({ onScore }) {
  const [phase, setPhase] = useState("start"); const [paper, setPaper] = useState(null); const [ans, setAns] = useState({}); const [res, setRes] = useState(null); const [load, setLoad] = useState(false);

  async function start() {
    setLoad(true);
    const p = await callAI("IB MYP3 Sciences 1-hour exam. Include Q from Biology, Physics, Chemistry. Criteria A and D.\nQ1 (Bio, Crit A, 6 marks): [question]\nQ2 (Physics, Crit A, 6 marks): [question]\nQ3 (Chemistry, Crit A, 6 marks): [question]\nQ4 (Bio, Crit D, 8 marks): [evaluate/analyse]\nQ5 (Multi-topic, Crit D, 8 marks): [extended evaluation]", "Generate sciences exam");
    setPaper(p); setAns({}); setPhase("exam"); setLoad(false);
  }

  async function submit() {
    setLoad(true);
    const all = [0,1,2,3,4].map(i => `Q${i+1}: ${ans[i]||""}`).join("\n\n");
    const r = await callAI("IB MYP3 Sciences examiner. Grade each Q.\nQ[n]: SCORE: X/8 – [feedback]\nCRITERION_A: X/8\nCRITERION_D: X/8\nOVERALL: X/8", `Paper:\n${paper}\nAnswers:\n${all}`);
    const overall = parseInt(r.match(/OVERALL:\s*(\d)/)?.[1] || "4"); onScore?.(overall); setRes(r); setPhase("results"); setLoad(false);
  }

  if (phase==="start") return <div className="card fade-in text-center" style={{ padding:48 }}><div style={{ fontSize:52,marginBottom:16 }}>🔬</div><h3 style={{ fontSize:22,fontWeight:700,marginBottom:10 }}>Sciences Practice Exam</h3><p className="text-muted mb-24">5 questions · 1 hour · Criteria A & D · Biology, Physics, Chemistry</p><button className="btn btn-primary btn-lg" onClick={start} disabled={load}>{load?<><Spinner /> Building</>:"🚀 Begin Exam"}</button></div>;
  if (phase==="exam") return <div className="fade-in"><div className="card mb-16 flex-between" style={{ padding:"14px 20px" }}><span style={{ fontWeight:600 }}>Sciences Exam</span><TimerComp seconds={3600} onEnd={submit} /></div><div className="card mb-16" style={{ whiteSpace:"pre-wrap",lineHeight:1.85,fontSize:14 }}>{paper}</div>{[0,1,2,3,4].map(i => <div key={i} className="card mb-8"><label>Q{i+1} – Your Answer</label><textarea rows={i>=3?9:5} placeholder="Write structured response..." value={ans[i]||""} onChange={e => setAns(p => ({ ...p,[i]:e.target.value }))} /></div>)}<button className="btn btn-success btn-lg" onClick={submit} disabled={load}>{load?<><Spinner /> Grading</>:"✓ Submit Exam"}</button></div>;
  return <div className="fade-in"><div className="card text-center mb-20 fade-in" style={{ padding:36 }}><h3 style={{ fontSize:24,fontWeight:800,marginBottom:16 }}>Sciences Results</h3><FeedbackBox text={res} /><button className="btn btn-primary mt-16" onClick={() => setPhase("start")}>🔄 Retake</button></div></div>;
}

function SciencesPage({ onScore }) {
  const [tab, setTab] = useState("biology"); const [mode, setMode] = useState("notes");
  const sciColors = { biology:"var(--green)", physics:"var(--blue)", chemistry:"var(--yellow)" };
  return <div><SectionHeader title="🔬 Integrated Sciences" sub="Criteria A · D · Biology · Physics · Chemistry" /><div className="tab-row">{[["biology","🌿 Biology"],["physics","💡 Physics"],["chemistry","⚗️ Chemistry"],["exam","📋 Exam"]].map(([t,l]) => <button key={t} className={`tab ${tab===t?"active":""}`} onClick={() => { setTab(t); setMode("notes"); }}>{l}</button>)}</div>{tab!=="exam" ? <><div className="tab-row">{[["notes","📝 Notes"],["quiz","🎯 Quiz"]].map(([t,l]) => <button key={t} className={`tab ${mode===t?"active":""}`} onClick={() => setMode(t)}>{l}</button>)}</div>{mode==="notes" && <div className="fade-in">{SCI_TOPICS[tab].map((t,i) => <div key={i} className="card mb-8 flex gap-12"><span className="badge" style={{ background: sciColors[tab]+"22", color: sciColors[tab], flexShrink:0, marginTop:2 }}>{i+1}</span><span style={{ fontSize:14 }}>{t}</span></div>)}</div>}{mode==="quiz" && <SciQuiz subject={tab} topics={SCI_TOPICS[tab]} onScore={s => onScore("sciences",s)} />}</> : <SciExam onScore={s => onScore("sciences",s)} />}</div>;
}

// ── LANGUAGE ACQUISITION ──────────────────────────────────────────────────────
function LangAcqReading({ lang, onScore }) {
  const [data, setData] = useState(null); const [ans, setAns] = useState({}); const [fb, setFb] = useState(null); const [load, setLoad] = useState(false); const [score, setScore] = useState(null);

  async function gen() {
    setLoad(true); setFb(null); setAns({}); setScore(null);
    const topics = ["weather and climate","environmental pollution","recycling and sustainability","endangered animals","renewable energy","plastic waste","floods and natural disasters","daily life and culture"];
    const r = await callAI(`IB MYP3 ${lang} Criterion B reading comprehension on: ${rnd(topics)}. A1-A2 level.\nFormat:\nTEXT:\n[80-120 word text in ${lang}]\n\nQ1. [MCQ A,B,C,D]\nQ2. [MCQ A,B,C,D]\nQ3. [Short answer]\nQ4. [Short answer]\nQ5. [True/False]\nQ6. [True/False]`, "Generate reading");
    setData(r); setLoad(false);
  }

  async function submit() {
    setLoad(true);
    const r = await callAI(`IB MYP3 ${lang} Criterion B. Score out of 8.\nSCORE: X/8\nCORRECT ANSWERS:\nFEEDBACK: [in English]`, `Text:\n${data}\nAnswers:\n${Object.entries(ans).map(([i,a]) => `Q${parseInt(i)+1}: ${a}`).join("\n")}`);
    setFb(r); const s = parseInt(r.match(/SCORE:\s*(\d)/)?.[1] || "0"); setScore(s); onScore?.(s); setLoad(false);
  }

  return <div className="fade-in"><button className="btn btn-primary mb-24" onClick={gen} disabled={load}>{load?<><Spinner /> Generating</>:"⚡ Generate Reading Exercise"}</button>{data && <div className="card fade-in"><div style={{ whiteSpace:"pre-wrap",lineHeight:1.85,marginBottom:24,fontSize:14 }}>{data}</div>{[0,1,2,3,4,5].map(i => <div key={i} className="mb-12"><label>Q{i+1} – Your Answer</label><input type="text" placeholder="Your answer..." value={ans[i]||""} onChange={e => setAns(p => ({ ...p,[i]:e.target.value }))} /></div>)}<div className="flex gap-8 mt-16"><button className="btn btn-success" onClick={submit} disabled={load}>{load?<><Spinner /> Evaluating</>:"✓ Submit"}</button><button className="btn btn-secondary" onClick={gen} disabled={load}>Next Text →</button></div>{score!=null && <div className="mt-12"><ScoreChip score={score} /></div>}<FeedbackBox text={fb} /></div>}</div>;
}

function LangAcqWriting({ lang, onScore }) {
  const [q, setQ] = useState(null); const [ans, setAns] = useState(""); const [fb, setFb] = useState(null); const [load, setLoad] = useState(false); const [score, setScore] = useState(null);

  async function gen() {
    setLoad(true); setFb(null); setAns(""); setScore(null);
    const topics = ["local river pollution","deforestation in the Amazon","excessive plastic use","smog in cities","effects of climate change on oceans","importance of recycling","how to reduce carbon footprint","endangered species"];
    const topic = rnd(topics);
    const r = await callAI(`IB MYP3 ${lang} RAFT writing prompt at A1-A2 level. Topic: ${topic}.\nFORMAT:\nROLE: [specific role]\nAUDIENCE: [specific audience]\nFORMAT: Blog post\nTOPIC: ${topic}\nTASK: Write a 100-150 word blog in ${lang}.\nKEY VOCABULARY: [6-8 useful words in ${lang}]\nUSEFUL PHRASES: [3-4 sentence starters in ${lang}]`, "Generate RAFT prompt");
    setQ(r); setLoad(false);
  }

  async function submit() {
    setLoad(true);
    const r = await callAI(`IB MYP3 ${lang} Criterion D. A1-A2 blog. Score out of 8.\nSCORE: X/8\nFEEDBACK: [in English]\nGRAMMAR CORRECTIONS:\nVOCABULARY SUGGESTIONS:`, `Prompt:\n${q}\n\nBlog:\n${ans}`);
    setFb(r); const s = parseInt(r.match(/SCORE:\s*(\d)/)?.[1] || "0"); setScore(s); onScore?.(s); setLoad(false);
  }

  const wc = ans.trim() ? ans.trim().split(/\s+/).length : 0;
  return <div className="fade-in"><button className="btn btn-primary mb-24" onClick={gen} disabled={load}>{load?<><Spinner /> Generating</>:"⚡ Generate RAFT Prompt"}</button>{q && <div className="card fade-in"><div style={{ whiteSpace:"pre-wrap",lineHeight:1.85,marginBottom:20,fontSize:14 }}>{q}</div><textarea rows={10} placeholder={`Write your blog here in ${lang} (100-150 words)...`} value={ans} onChange={e => setAns(e.target.value)} /><div className="text-xs text-muted mt-8">Words: {wc} / 100-150</div><div className="flex gap-8 mt-12"><button className="btn btn-success" onClick={submit} disabled={load||wc<30}>{load?<><Spinner /> Evaluating</>:"✓ Submit"}</button><button className="btn btn-secondary" onClick={gen} disabled={load}>New Prompt →</button></div>{score!=null && <div className="mt-12"><ScoreChip score={score} /></div>}<FeedbackBox text={fb} /></div>}</div>;
}

function LangAcqSpeaking({ lang, onScore }) {
  const [phase, setPhase] = useState("idle"); const [image, setImage] = useState(null); const [notes, setNotes] = useState(""); const [speech, setSpeech] = useState(""); const [followups, setFollowups] = useState([]); const [followupAnswers, setFollowupAnswers] = useState({}); const [fb, setFb] = useState(null); const [load, setLoad] = useState(false); const [score, setScore] = useState(null);

  function startSession() {
    const img = rnd(LANG_ACQ_IMAGES); setImage(img); setNotes(""); setSpeech(""); setFollowups([]); setFollowupAnswers({}); setFb(null); setScore(null); setPhase("prep");
  }

  async function submitSpeech() {
    setLoad(true);
    const fqs = await callAI(`IB MYP3 ${lang} oral teacher. Student spoke about: ${image.title}. Generate EXACTLY 3 follow-up questions in ${lang} at A1-A2 level.\nPREGUNTA 1: [question]\nPREGUNTA 2: [question]\nPREGUNTA 3: [question]`, `Image: ${image.title}, Keywords: ${image.keywords}`);
    const q1 = fqs.match(/PREGUNTA 1:\s*(.+)/)?.[1] || "What do you see?";
    const q2 = fqs.match(/PREGUNTA 2:\s*(.+)/)?.[1] || "What do you think about this?";
    const q3 = fqs.match(/PREGUNTA 3:\s*(.+)/)?.[1] || "How can you help?";
    setFollowups([q1, q2, q3]); setLoad(false); setPhase("followup");
  }

  async function submitAll() {
    setLoad(true);
    const answersStr = followups.map((q, i) => `Q: ${q}\nA: ${followupAnswers[i] || "(no answer)"}`).join("\n\n");
    const r = await callAI(`IB MYP3 ${lang} Criterion C (Speaking). Score out of 8.\nSCORE: X/8\nCRITERION C BREAKDOWN:\n- Message clarity (i): X/2\n- Vocabulary range (ii): X/2\n- Grammar accuracy (iii): X/2\n- Interactive competence (iv): X/2\nFEEDBACK:\nSTRENGTHS: [2-3]\nIMPROVEMENTS: [2-3]`, `Image: ${image.title}\n\nMain Speech:\n${speech}\n\nFollow-up Q&A:\n${answersStr}`);
    setFb(r); const s = parseInt(r.match(/SCORE:\s*(\d)/)?.[1] || "0"); setScore(s); onScore?.(s); setPhase("results"); setLoad(false);
  }

  const speechWc = speech.trim() ? speech.trim().split(/\s+/).length : 0;

  if (phase === "idle") return (
    <div className="card fade-in text-center" style={{ padding: 48 }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>🎤</div>
      <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>{lang} Oral Exam Simulation</h3>
      <div className="text-muted mb-24" style={{ background:"var(--card2)", borderRadius:12, padding:20, textAlign:"left", lineHeight:1.9 }}>
        <strong style={{ color:"var(--text)" }}>How it works:</strong><br />
        1️⃣ Get a random image about the environment or culture<br />
        2️⃣ 10 minutes preparation time to take notes<br />
        3️⃣ Write your speech in {lang} (2-3 minutes = ~150-250 words)<br />
        4️⃣ Answer 3 follow-up questions<br />
        5️⃣ Receive a full IB Criterion C score and feedback
      </div>
      <button className="btn btn-warn btn-lg" onClick={startSession}>🎲 Get Random Image & Begin</button>
    </div>
  );

  if (phase === "prep") return (
    <div className="fade-in">
      <ImageDisplay url={image.url} title={image.title} caption={`Topic: ${image.topic} · Keywords: ${image.keywords}`} />
      <div className="prep-box">
        <div className="flex-between" style={{ flexWrap:"wrap", gap:12 }}>
          <div><div style={{ fontWeight:700, color:"var(--yellow)", fontSize:15 }}>⏱ Preparation Time — 10 minutes</div><div className="text-sm text-muted">Plan your speech. What do you see? What do you think about this?</div></div>
          <CountdownTimer seconds={600} label="PREP TIME" color="var(--yellow)" />
        </div>
      </div>
      <div className="card mb-16"><label>📝 YOUR PREPARATION NOTES (not marked)</label><textarea rows={5} placeholder="Plan here. Vocabulary to use, ideas, phrases..." value={notes} onChange={e => setNotes(e.target.value)} /></div>
      <button className="btn btn-primary btn-block btn-lg" onClick={() => setPhase("speak")}>I'm Ready — Start Speaking Practice →</button>
    </div>
  );

  if (phase === "speak") return (
    <div className="fade-in">
      <ImageDisplay url={image.url} title={image.title} caption="Refer to this image in your speech" />
      <div className="record-box">
        <div className="flex-between" style={{ flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ fontWeight:700, color:"var(--red)", fontSize:15 }}>🎤 Speaking Practice — Write Your Speech</div>
            <div className="text-sm text-muted">Write your speech in {lang} (aim for 150-250 words) — this simulates speaking time</div>
          </div>
          <CountdownTimer seconds={180} label="SPEAKING TIME" color="var(--red)" />
        </div>
      </div>
      <textarea rows={10} placeholder={`Write your speech about the image in ${lang}...\n\nDescribe what you see, explain the problem, give your opinion, suggest solutions.`} value={speech} onChange={e => setSpeech(e.target.value)} style={{ marginBottom:8 }} />
      <div className="text-xs text-muted mb-16">Words: {speechWc} (target: 150-250)</div>
      <button className="btn btn-success btn-block btn-lg" onClick={submitSpeech} disabled={load||speechWc<15}>{load?<><Spinner /> Preparing follow-up questions...</>:"✓ Done — Get Follow-Up Questions →"}</button>
    </div>
  );

  if (phase === "followup") return (
    <div className="fade-in">
      <div className="card mb-24" style={{ background:"var(--accent)11", borderColor:"var(--accent)44" }}>
        <div style={{ fontWeight:700, color:"var(--accent)", marginBottom:4, fontSize:15 }}>💬 Follow-Up Questions</div>
        <div className="text-sm text-muted">Answer each question in {lang}. 1-3 sentences each.</div>
      </div>
      {followups.map((q, i) => (
        <div key={i} className="card mb-16">
          <div style={{ fontWeight:600, color:"var(--yellow)", marginBottom:8, fontSize:15 }}>{i+1}. {q}</div>
          <textarea rows={3} placeholder={`Your answer in ${lang}...`} value={followupAnswers[i]||""} onChange={e => setFollowupAnswers(p => ({ ...p,[i]:e.target.value }))} />
        </div>
      ))}
      <button className="btn btn-success btn-block btn-lg" onClick={submitAll} disabled={load}>{load?<><Spinner /> Evaluating full performance...</>:"✓ Submit — Get Full Score & Feedback"}</button>
    </div>
  );

  if (phase === "results") return (
    <div className="fade-in">
      <div className="card text-center mb-24" style={{ padding:36 }}>
        <div style={{ fontSize:44, marginBottom:10 }}>{score>=6?"🏆":score>=4?"📈":"💪"}</div>
        <h3 style={{ fontSize:24, fontWeight:800, marginBottom:6 }}>Oral Practice Complete!</h3>
        <div style={{ fontSize:44, fontWeight:800, color:score>=6?"var(--green)":"var(--red)", margin:"10px 0" }}>{score}/8</div>
        <p className="text-muted mb-20">Criterion C – Speaking</p>
        <button className="btn btn-warn btn-lg" onClick={() => { setPhase("idle"); setImage(null); }}>🎲 Try New Image</button>
      </div>
      {image && <ImageDisplay url={image.url} title={image.title} caption="The image you spoke about" />}
      <FeedbackBox text={fb} />
    </div>
  );
}

function LangAcqExam({ lang, onScore }) {
  const [phase, setPhase] = useState("start"); const [paper, setPaper] = useState(null); const [ans, setAns] = useState({}); const [res, setRes] = useState(null); const [load, setLoad] = useState(false);

  async function start() {
    setLoad(true);
    const topic = rnd(["weather", "pollution", "environment", "ecological solutions", "global problems"]);
    const p = await callAI(`IB MYP3 ${lang} exam on: ${topic}.\nSECTION 1 – CRITERION B:\n[80-100 word text in ${lang} about ${topic}]\nQ1-Q2: MCQ A-D\nQ3-Q4: Short answer in ${lang}\nQ5-Q6: True/False\n\nSECTION 2 – CRITERION D:\nRAFT Blog prompt on ${topic}\nTask: Write 100-150 word blog in ${lang}.`, "Generate lang acq exam");
    setPaper(p); setAns({}); setPhase("exam"); setLoad(false);
  }

  async function submit() {
    setLoad(true);
    const readAns = [0,1,2,3,4,5].map(i => `Q${i+1}: ${ans[`b${i}`]||""}`).join("\n");
    const [bFb, dFb] = await Promise.all([
      callAI(`IB MYP3 ${lang} Criterion B. Score out of 8.\nSCORE: X/8\nCORRECT ANSWERS:\nFEEDBACK:`, `Paper:\n${paper}\nReading:\n${readAns}`),
      callAI(`IB MYP3 ${lang} Criterion D. A1-A2 blog. Score out of 8.\nSCORE: X/8\nFEEDBACK:\nGRAMMAR CORRECTIONS:`, `Paper:\n${paper}\nBlog:\n${ans.blog||""}`)
    ]);
    const sB = parseInt(bFb.match(/SCORE:\s*(\d)/)?.[1]||"0"), sD = parseInt(dFb.match(/SCORE:\s*(\d)/)?.[1]||"0");
    onScore?.(Math.round((sB+sD)/2)); setRes({ bFb, dFb, sB, sD }); setPhase("results"); setLoad(false);
  }

  if (phase==="start") return <div className="card fade-in text-center" style={{ padding:48 }}><div style={{ fontSize:52, marginBottom:16 }}>🌍</div><h3 style={{ fontSize:22, fontWeight:700, marginBottom:10 }}>{lang} Practice Exam</h3><p className="text-muted mb-24">Reading + Writing · Criteria B & D · Timed</p><button className="btn btn-primary btn-lg" onClick={start} disabled={load}>{load?<><Spinner /> Generating</>:"🚀 Begin Exam"}</button></div>;
  if (phase==="exam") return <div className="fade-in"><div className="card mb-16 flex-between" style={{ padding:"14px 20px" }}><span style={{ fontWeight:600 }}>{lang} Exam</span><TimerComp seconds={3600} onEnd={submit} /></div><div className="card mb-16" style={{ whiteSpace:"pre-wrap", lineHeight:1.85, fontSize:14 }}>{paper}</div><div className="card mb-16"><h4 style={{ color:"var(--yellow)", marginBottom:14, fontWeight:700 }}>Section 1 – Reading Comprehension</h4>{[0,1,2,3,4,5].map(i => <div key={i} className="mb-10"><label>Q{i+1}</label><input type="text" placeholder="Your answer..." value={ans[`b${i}`]||""} onChange={e => setAns(p => ({ ...p,[`b${i}`]:e.target.value }))} /></div>)}</div><div className="card mb-16"><h4 style={{ color:"var(--yellow)", marginBottom:12, fontWeight:700 }}>Section 2 – Blog Writing (100-150 words)</h4><textarea rows={10} placeholder={`Write your blog in ${lang} here...`} value={ans.blog||""} onChange={e => setAns(p => ({ ...p,blog:e.target.value }))} /><div className="text-xs text-muted mt-8">Words: {(ans.blog||"").trim().split(/\s+/).filter(Boolean).length}</div></div><button className="btn btn-success btn-lg" onClick={submit} disabled={load}>{load?<><Spinner /> Grading</>:"✓ Submit Exam"}</button></div>;
  return <div className="fade-in"><div className="card text-center mb-24" style={{ padding:36 }}><h3 style={{ fontSize:24, fontWeight:800, marginBottom:20 }}>Results</h3><div className="flex gap-16" style={{ justifyContent:"center" }}><div><div className="text-xs text-muted">Criterion B</div><div style={{ fontSize:38, fontWeight:800, color:res.sB>=6?"var(--green)":"var(--red)" }}>{res.sB}/8</div></div><div><div className="text-xs text-muted">Criterion D</div><div style={{ fontSize:38, fontWeight:800, color:res.sD>=6?"var(--green)":"var(--red)" }}>{res.sD}/8</div></div></div><button className="btn btn-primary mt-16" onClick={() => setPhase("start")}>🔄 Retake</button></div><div className="card mb-12"><h4 className="mb-8">Criterion B Feedback</h4><FeedbackBox text={res.bFb} /></div><div className="card"><h4 className="mb-8">Criterion D Feedback</h4><FeedbackBox text={res.dFb} /></div></div>;
}

function LangAcqPage({ onScore }) {
  const [tab, setTab] = useState("reading");
  const [lang, setLang] = useState("Spanish");
  const langs = ["Spanish","French","German","Mandarin","Hindi","Japanese","Italian","Portuguese"];

  return (
    <div>
      <SectionHeader title="🌍 Language Acquisition" sub="Criteria B · C · D · Your target language" />
      <div className="card mb-20" style={{ borderColor:"var(--yellow)44" }}>
        <label>SELECT YOUR TARGET LANGUAGE</label>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:8 }}>
          {langs.map(l => <button key={l} className={`btn btn-sm ${lang===l?"btn-warn":"btn-secondary"}`} onClick={() => setLang(l)}>{l}</button>)}
        </div>
      </div>
      <div className="tab-row">{[["reading",`📖 Reading (B)`],["writing",`✍️ Writing (D)`],["speaking",`🎤 Speaking (C)`],["exam","📋 Exam"]].map(([t,l]) => <button key={t} className={`tab ${tab===t?"active":""}`} onClick={() => setTab(t)}>{l}</button>)}</div>
      {tab==="reading" && <LangAcqReading lang={lang} onScore={s => onScore("langacq",s)} />}
      {tab==="writing" && <LangAcqWriting lang={lang} onScore={s => onScore("langacq",s)} />}
      {tab==="speaking" && <LangAcqSpeaking lang={lang} onScore={s => onScore("langacq",s)} />}
      {tab==="exam" && <LangAcqExam lang={lang} onScore={s => onScore("langacq",s)} />}
    </div>
  );
}

// ── I&S ───────────────────────────────────────────────────────────────────────
function ISPractice({ onScore }) {
  const [crit, setCrit] = useState("B"); const [q, setQ] = useState(null); const [ans, setAns] = useState(""); const [fb, setFb] = useState(null); const [load, setLoad] = useState(false); const [score, setScore] = useState(null);

  async function gen() {
    setLoad(true); setFb(null); setAns(""); setScore(null);
    const topic = rnd(IS_TOPICS);
    const cmdsB = ["Describe","Explain","Compare","Outline","Analyse","Summarise"];
    const cmdsD = ["Evaluate","Discuss","Examine","Justify","Assess","To what extent"];
    const cmd = crit==="B" ? rnd(cmdsB) : rnd(cmdsD);
    const includeData = Math.random() > 0.5;
    const r = await callAI(`IB MYP3 I&S teacher. Criterion ${crit} question. Topic: ${topic}. Command: ${cmd}.${includeData?" Include a small data reference (mini table or statistics).":""}\nCRITERION: ${crit}\nTOPIC: ${topic}\nCOMMAND TERM: ${cmd}\nQUESTION: [full question]\nMARKS: [4-8]`, `Topic: ${topic}`);
    setQ(r); setLoad(false);
  }

  async function submit() {
    setLoad(true);
    const r = await callAI(`IB MYP3 I&S Criterion ${crit} examiner. Score out of 8.\nSCORE: X/8\nFEEDBACK: [specific, reference command term]\nSTRENGTHS: [2-3]\nIMPROVEMENTS: [2-3]`, `Question:\n${q}\n\nAnswer:\n${ans}`);
    setFb(r); const s = parseInt(r.match(/SCORE:\s*(\d)/)?.[1]||"0"); setScore(s); onScore?.(s); setLoad(false);
  }

  return (
    <div className="fade-in">
      <div className="flex gap-8 mb-20">
        <button className={`btn ${crit==="B"?"btn-primary":"btn-secondary"}`} onClick={() => setCrit("B")}>Criterion B – Investigating</button>
        <button className={`btn ${crit==="D"?"btn-primary":"btn-secondary"}`} onClick={() => setCrit("D")}>Criterion D – Critical Thinking</button>
      </div>
      <button className="btn btn-primary mb-24" onClick={gen} disabled={load}>{load?<><Spinner /> Generating</>:"⚡ Generate Question"}</button>
      {q && <div className="card fade-in"><div style={{ whiteSpace:"pre-wrap",lineHeight:1.85,marginBottom:20,fontSize:14 }}>{q}</div><textarea rows={8} placeholder="Write your structured response. Use command term. Reference evidence and case studies..." value={ans} onChange={e => setAns(e.target.value)} /><div className="flex gap-8 mt-12"><button className="btn btn-success" onClick={submit} disabled={load||!ans.trim()}>{load?<><Spinner /> Evaluating</>:"✓ Submit"}</button><button className="btn btn-secondary" onClick={gen} disabled={load}>Next →</button></div>{score!=null && <div className="mt-12"><ScoreChip score={score} /></div>}<FeedbackBox text={fb} /></div>}
    </div>
  );
}

function ISExam({ onScore }) {
  const [phase, setPhase] = useState("start"); const [paper, setPaper] = useState(null); const [ans, setAns] = useState({}); const [res, setRes] = useState(null); const [load, setLoad] = useState(false);

  async function start() {
    setLoad(true);
    const unit = Math.random() > 0.5 ? "population" : "culture";
    const p = await callAI(`IB MYP3 I&S 1-hour exam focused on ${unit}. Include realistic data stimulus.\nQ1 (Crit B, 4 marks): describe/outline\nQ2 (Crit B, 6 marks): explain with reference to data\nQ3 (Crit D, 6 marks): evaluate/analyse\nQ4 (Crit D, 6 marks): compare/discuss perspectives\nQ5 (Crit D, 8 marks): extended evaluation using named case study\nLabel Q1-Q5 clearly.`, "Generate I&S exam");
    setPaper(p); setAns({}); setPhase("exam"); setLoad(false);
  }

  async function submit() {
    setLoad(true);
    const all = Object.entries(ans).map(([i,a]) => `Q${parseInt(i)+1}: ${a}`).join("\n\n");
    const r = await callAI("IB MYP3 I&S examiner. Grade each question.\nQ[n]: SCORE: X/8 – [feedback]\nCRITERION_B: X/8\nCRITERION_D: X/8\nOVERALL: X/8", `Paper:\n${paper}\n\nAnswers:\n${all}`);
    const overall = parseInt(r.match(/OVERALL:\s*(\d)/)?.[1]||"4"); onScore?.(overall); setRes(r); setPhase("results"); setLoad(false);
  }

  if (phase==="start") return <div className="card fade-in text-center" style={{ padding:48 }}><div style={{ fontSize:52, marginBottom:16 }}>🌐</div><h3 style={{ fontSize:22, fontWeight:700, marginBottom:10 }}>I&S Practice Exam</h3><p className="text-muted mb-24">5 questions · 1 hour · Criteria B & D · Population & Culture</p><button className="btn btn-primary btn-lg" onClick={start} disabled={load}>{load?<><Spinner /> Building</>:"🚀 Begin Exam"}</button></div>;
  if (phase==="exam") return <div className="fade-in"><div className="card mb-16 flex-between" style={{ padding:"14px 20px" }}><span style={{ fontWeight:600 }}>I&S Exam</span><TimerComp seconds={3600} onEnd={submit} /></div><div className="card mb-16" style={{ whiteSpace:"pre-wrap", lineHeight:1.85, fontSize:14 }}>{paper}</div>{[0,1,2,3,4].map(i => <div key={i} className="card mb-8"><label>Q{i+1} – Your Answer</label><textarea rows={i>=3?9:5} placeholder="Write your structured response..." value={ans[i]||""} onChange={e => setAns(p => ({ ...p,[i]:e.target.value }))} /></div>)}<button className="btn btn-success btn-lg" onClick={submit} disabled={load}>{load?<><Spinner /> Grading</>:"✓ Submit Exam"}</button></div>;
  return <div className="fade-in"><div className="card text-center mb-20" style={{ padding:36 }}><h3 style={{ fontSize:24, fontWeight:800, marginBottom:16 }}>I&S Results</h3><FeedbackBox text={res} /><button className="btn btn-primary mt-16" onClick={() => setPhase("start")}>🔄 Retake</button></div></div>;
}

function IndividualsPage({ onScore }) {
  const [tab, setTab] = useState("notes");
  return <div><SectionHeader title="🌐 Individuals & Societies" sub="Criteria B · D · Population & Culture" /><div className="tab-row">{[["notes","📝 Notes"],["practice","🎯 Practice"],["exam","📋 Exam"]].map(([t,l]) => <button key={t} className={`tab ${tab===t?"active":""}`} onClick={() => setTab(t)}>{l}</button>)}</div>{tab==="notes" && <div className="fade-in"><div className="card mb-12"><h3 style={{ color:"var(--red)", fontWeight:700, marginBottom:12 }}>Unit 4: Population Distribution</h3>{IS_TOPICS.slice(0,8).map((t,i) => <div key={i} style={{ padding:"9px 0", borderBottom:"1px solid var(--border)", display:"flex", gap:12 }}><span className="badge" style={{ background:"var(--red)22", color:"var(--red)", flexShrink:0 }}>{i+1}</span><span style={{ fontSize:14 }}>{t}</span></div>)}</div><div className="card"><h3 style={{ color:"var(--blue)", fontWeight:700, marginBottom:12 }}>Unit 5: Culture</h3>{IS_TOPICS.slice(8).map((t,i) => <div key={i} style={{ padding:"9px 0", borderBottom:"1px solid var(--border)", display:"flex", gap:12 }}><span className="badge" style={{ background:"var(--blue)22", color:"var(--blue)", flexShrink:0 }}>{i+1}</span><span style={{ fontSize:14 }}>{t}</span></div>)}</div></div>}{tab==="practice" && <ISPractice onScore={s => onScore("individuals",s)} />}{tab==="exam" && <ISExam onScore={s => onScore("individuals",s)} />}</div>;
}

// ── CHATBOT ───────────────────────────────────────────────────────────────────
function ChatbotPage() {
  const [messages, setMessages] = useState([
    { role:"assistant", content:"Hello Aarush, welcome to Study Hub AI! 👋\n\nI'm your MYP 3 study assistant. Ask me anything about your subjects, get help understanding concepts, or request practice questions!\n\nI can help with: Math, English, Sciences, Language Acquisition, and Individuals & Societies." }
  ]);
  const [input, setInput] = useState(""); const [load, setLoad] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem("claude_api_key") || "");
  const [showKey, setShowKey] = useState(false);
  const chatRef = useRef();

  useEffect(() => { chatRef.current?.scrollTo(0, chatRef.current.scrollHeight); }, [messages]);

  // Re-read key from storage every time panel opens so it always shows full key
  function toggleKeyPanel() {
    if (!showKeyInput) setApiKey(localStorage.getItem("claude_api_key") || "");
    setShowKeyInput(s => !s);
  }

  async function send() {
    if (!input.trim() || load) return;
    const userMsg = { role:"user", content: input }; setInput("");
    const newMsgs = [...messages, userMsg]; setMessages(newMsgs); setLoad(true);
    const reply = await callClaude(newMsgs);
    setMessages(p => [...p, { role:"assistant", content: reply || "I couldn't generate a response. Please try again." }]); setLoad(false);
  }

  function saveKey() {
    const trimmed = apiKey.trim();
    localStorage.setItem("claude_api_key", trimmed);
    setApiKey(trimmed);
    setShowKeyInput(false);
    setMessages(p => [...p, { role:"assistant", content:"✅ API key saved! You can now chat with me." }]);
  }

  const quickPrompts = ["Explain the DTM model","How do I analyse a sci-fi extract?","What is the reactivity series?","Give me 5 Spanish vocabulary words about pollution","How to calculate arc length?"];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 120px)", minHeight:500 }}>
      <div className="flex-between mb-20">
        <SectionHeader title="🤖 AI Study Assistant" sub="Your personal MYP 3 tutor" />
        <button className="btn btn-secondary btn-sm" onClick={toggleKeyPanel}>⚙️ API Key</button>
      </div>

      {showKeyInput && (
        <div className="card mb-16 fade-in" style={{ borderColor:"var(--accent)44" }}>
          <div style={{ fontWeight:700, marginBottom:12 }}>🔑 AI API Key Setup</div>
          <div className="text-sm text-muted mb-12">Enter your API key to enable the AI assistant.</div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <input
              type={showKey ? "text" : "password"}
              placeholder="sk-ant-..."
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              style={{ flex:1, fontFamily:"monospace", letterSpacing: showKey ? "normal" : "2px" }}
            />
            <button className="btn btn-ghost btn-sm" onClick={() => setShowKey(s => !s)} title={showKey ? "Hide key" : "Show key"} style={{ flexShrink:0 }}>
              {showKey ? "🙈" : "👁️"}
            </button>
            <button className="btn btn-primary" onClick={saveKey} style={{ flexShrink:0 }}>Save</button>
          </div>
          {apiKey && <div className="text-xs text-muted mt-8">Key length: {apiKey.trim().length} characters</div>}
        </div>
      )}

      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
        {quickPrompts.map((p,i) => <button key={i} className="btn btn-secondary btn-sm" onClick={() => { setInput(p); }}>{p}</button>)}
      </div>

      <div ref={chatRef} className="chat-area card" style={{ flex:1 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:m.role==="user"?"flex-end":"flex-start" }}>
            {m.role==="assistant" && <div className="text-xs text-muted mb-4" style={{ marginLeft:4 }}>AI Assistant</div>}
            <div className={`chat-msg ${m.role==="user"?"user":"ai"}`}>{m.content}</div>
          </div>
        ))}
        {load && <div style={{ display:"flex", gap:8, alignItems:"center" }}><div className="chat-msg ai"><Spinner /> thinking...</div></div>}
      </div>

      <div style={{ display:"flex", gap:8, marginTop:12 }}>
        <textarea
          rows={2}
          placeholder="Ask anything about your MYP 3 subjects..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key==="Enter" && !e.shiftKey && (e.preventDefault(), send())}
          style={{ flex:1, resize:"none" }}
        />
        <button className="btn btn-primary" onClick={send} disabled={load||!input.trim()} style={{ alignSelf:"flex-end", height:42 }}>Send →</button>
      </div>
      <div className="text-xs text-muted mt-8">Press Enter to send · Shift+Enter for new line</div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true);
  const [user, setUser] = useState(null);
  const [scores, setScores] = useState({});
  const [page, setPage] = useState("home");
  const [syllabusUploaded, setSyllabusUploaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleScore(subjectId, score) { setScores(prev => ({ ...prev, [subjectId]: [...(prev[subjectId]||[]), score] })); }

  const avgScores = {};
  Object.entries(scores).forEach(([id,arr]) => { if (arr.length) avgScores[id] = Math.round(arr.reduce((a,b) => a+b,0)/arr.length); });

  const navItems = [
    { id:"home", icon:"🏠", label:"Dashboard" },
    { section:"Subjects" },
    { id:"math", icon:"📐", label:"Mathematics" },
    { id:"english", icon:"📖", label:"Lang & Literature" },
    { id:"sciences", icon:"🔬", label:"Sciences" },
    { id:"langacq", icon:"🌍", label:"Language Acq." },
    { id:"individuals", icon:"🌐", label:"Individuals & Soc." },
    { section:"Tools" },
    { id:"chatbot", icon:"🤖", label:"AI Chatbot" },
    { id:"syllabus", icon:"📄", label:"Syllabus Upload" },
  ];

  function renderPage() {
    switch(page) {
      case "home": return <HomePage user={user} scores={avgScores} onSelect={setPage} syllabusUploaded={syllabusUploaded} onUploadClick={() => setPage("syllabus")} />;
      case "math": return <MathPage onScore={handleScore} />;
      case "english": return <EnglishPage onScore={handleScore} />;
      case "sciences": return <SciencesPage onScore={handleScore} />;
      case "langacq": return <LangAcqPage onScore={handleScore} />;
      case "individuals": return <IndividualsPage onScore={handleScore} />;
      case "chatbot": return <ChatbotPage />;
      case "syllabus": return <SyllabusUpload onUpload={data => { setSyllabusUploaded(true); setPage("home"); }} />;
      default: return <HomePage user={user} scores={avgScores} onSelect={setPage} syllabusUploaded={syllabusUploaded} onUploadClick={() => setPage("syllabus")} />;
    }
  }

  if (!user) return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      <style>{makeCSS(dark)}</style>
      <AuthPage onLogin={setUser} />
    </ThemeContext.Provider>
  );

  const currentSubject = DEFAULT_SUBJECTS.find(s => s.page === page) || DEFAULT_SUBJECTS.find(s => s.id === page);

  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      <style>{makeCSS(dark)}</style>
      <div className="app-shell">
        {/* Overlay for mobile */}
        {sidebarOpen && <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:99 }} onClick={() => setSidebarOpen(false)} />}

        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-logo">
            <div style={{ fontFamily:"'Bricolage Grotesque'", fontWeight:800, fontSize:18 }}>📚 MYP 3 Study</div>
            <div style={{ fontSize:11, color:"var(--text3)", marginTop:4 }}>Apeejay · 2026</div>
          </div>
          <nav className="sidebar-nav">
            {navItems.map((item, i) => {
              if (item.section) return <div key={i} className="nav-section">{item.section}</div>;
              const avg = avgScores[item.id];
              return (
                <button key={item.id} className={`nav-item ${page===item.id?"active":""}`} onClick={() => { setPage(item.id); setSidebarOpen(false); }}>
                  <span className="nav-icon">{item.icon}</span>
                  <span style={{ flex:1 }}>{item.label}</span>
                  {avg != null && <span className="badge" style={{ background:(avg>=6?"var(--green)":avg>=4?"var(--yellow)":"var(--red)")+"22", color:(avg>=6?"var(--green)":avg>=4?"var(--yellow)":"var(--red)"), fontSize:10 }}>{avg}</span>}
                </button>
              );
            })}
          </nav>
          <div className="sidebar-footer">
            <a href="https://flow-app-q591.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ display:"block", marginBottom:12 }}>
              <button className="btn btn-warn btn-block" style={{ fontSize:13, fontWeight:700, borderRadius:10, gap:6 }}>
                ⚡ Boost Your Productivity
              </button>
            </a>
            <div className="flex-between" style={{ gap:8 }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600 }}>{user.name.split(" ")[0]}</div>
                <div className="text-xs text-muted">{user.email}</div>
              </div>
              <div className="flex gap-8">
                <button className="theme-toggle" onClick={() => setDark(d => !d)} title="Toggle theme" />
                <button className="btn btn-ghost btn-sm" onClick={() => { setUser(null); setPage("home"); }} title="Sign out">↩</button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="main-area">
          <div className="topbar">
            <button className="hamburger" onClick={() => setSidebarOpen(s => !s)}>
              <span /><span /><span />
            </button>
            <div style={{ flex:1, fontFamily:"'Bricolage Grotesque'", fontWeight:700, fontSize:16 }}>
              {navItems.find(n => n.id === page)?.icon} {navItems.find(n => n.id === page)?.label || "Dashboard"}
            </div>
            <button className="theme-toggle" onClick={() => setDark(d => !d)} title="Toggle theme" style={{ display:"none" }} />
            {page !== "home" && (
              <button className="btn btn-ghost btn-sm" onClick={() => setPage("home")}>← Home</button>
            )}
          </div>
          <div className="content-area">
            <div className="fade-in">{renderPage()}</div>
          </div>
        </main>
      </div>
    </ThemeContext.Provider>
  );
}
