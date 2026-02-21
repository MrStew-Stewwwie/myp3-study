import { useState, useEffect, useRef, useCallback } from "react";

// ─── THEME & STYLES ────────────────────────────────────────────────────────────
const COLORS = {
  bg: "#0A0B0F",
  surface: "#12141A",
  card: "#1A1D26",
  border: "#252836",
  accent: "#6C63FF",
  accentGlow: "#6C63FF33",
  gold: "#FFD166",
  green: "#06D6A0",
  red: "#EF476F",
  blue: "#118AB2",
  text: "#E8E9F0",
  muted: "#6B7280",
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
  
  body { 
    background: ${COLORS.bg}; 
    color: ${COLORS.text}; 
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
  }

  .app { min-height: 100vh; background: ${COLORS.bg}; }

  h1, h2, h3, .display { font-family: 'Syne', sans-serif; }

  .btn {
    padding: 10px 20px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    font-size: 14px;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .btn-primary {
    background: ${COLORS.accent};
    color: white;
  }
  .btn-primary:hover { opacity: 0.85; transform: translateY(-1px); }
  .btn-secondary {
    background: ${COLORS.card};
    color: ${COLORS.text};
    border: 1px solid ${COLORS.border};
  }
  .btn-secondary:hover { border-color: ${COLORS.accent}; }
  .btn-danger { background: ${COLORS.red}; color: white; }
  .btn-success { background: ${COLORS.green}; color: #0A0B0F; }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .card {
    background: ${COLORS.card};
    border: 1px solid ${COLORS.border};
    border-radius: 16px;
    padding: 24px;
  }

  textarea, input[type="text"], input[type="email"], input[type="password"] {
    width: 100%;
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    border-radius: 10px;
    padding: 12px 16px;
    color: ${COLORS.text};
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    resize: vertical;
    transition: border-color 0.2s;
  }
  textarea:focus, input:focus { border-color: ${COLORS.accent}; }

  .badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .progress-bar-track {
    background: ${COLORS.surface};
    border-radius: 100px;
    height: 6px;
    overflow: hidden;
  }
  .progress-bar-fill {
    height: 100%;
    border-radius: 100px;
    background: ${COLORS.accent};
    transition: width 0.5s ease;
  }

  .tab-row {
    display: flex;
    gap: 4px;
    background: ${COLORS.surface};
    padding: 4px;
    border-radius: 12px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }
  .tab {
    padding: 8px 16px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    background: transparent;
    color: ${COLORS.muted};
    transition: all 0.2s;
  }
  .tab.active {
    background: ${COLORS.card};
    color: ${COLORS.text};
  }

  .loading-spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid ${COLORS.border};
    border-top-color: ${COLORS.accent};
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .fade-in { animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  .timer-display {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: 2px;
  }
  .timer-warning { color: ${COLORS.red}; animation: pulse 1s infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }

  .score-chip {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
  }
  
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }

  .feedback-box {
    background: ${COLORS.surface};
    border-radius: 12px;
    padding: 20px;
    margin-top: 16px;
    border-left: 3px solid ${COLORS.accent};
  }
  
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  @media (max-width: 700px) {
    .grid-2, .grid-3 { grid-template-columns: 1fr; }
  }
`;

// ─── STORAGE ──────────────────────────────────────────────────────────────────
const STORAGE_KEY = "myp3_platform";

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

const defaultData = () => ({
  user: null,
  attempts: [],
  scores: {},
});

// ─── AI CALL ──────────────────────────────────────────────────────────────────
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

// ─── TIMER ────────────────────────────────────────────────────────────────────
function useTimer(seconds, onEnd) {
  const [remaining, setRemaining] = useState(seconds);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onEnd?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  return { remaining, display: fmt(remaining) };
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function Timer({ seconds, onEnd }) {
  const { display, remaining } = useTimer(seconds, onEnd);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 18 }}>⏱</span>
      <span className={`timer-display ${remaining < 300 ? 'timer-warning' : ''}`}>
        {display}
      </span>
    </div>
  );
}

function Spinner() {
  return <span className="loading-spinner" />;
}

function FeedbackBox({ feedback }) {
  if (!feedback) return null;
  return (
    <div className="feedback-box fade-in">
      <div style={{ fontSize: 12, color: COLORS.accent, fontWeight: 600, marginBottom: 8 }}>AI FEEDBACK</div>
      <div style={{ lineHeight: 1.7, whiteSpace: 'pre-wrap', fontSize: 14 }}>{feedback}</div>
    </div>
  );
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function handle() {
    if (!email || !password) return setError("Please fill all fields");
    if (mode === "register" && !name) return setError("Please enter your name");
    
    const stored = loadData() || defaultData();
    if (mode === "register") {
      stored.user = { email, name, joinedAt: Date.now() };
      saveData(stored);
      onLogin(stored.user);
    } else {
      if (stored.user?.email === email) {
        onLogin(stored.user);
      } else {
        // Auto-create account
        const user = { email, name: email.split('@')[0], joinedAt: Date.now() };
        stored.user = user;
        saveData(stored);
        onLogin(user);
      }
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLORS.bg, padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
          <h1 style={{ fontSize: 28, fontFamily: 'Syne, sans-serif', fontWeight: 800, marginBottom: 6 }}>MYP 3 Study</h1>
          <p style={{ color: COLORS.muted, fontSize: 14 }}>Apeejay School International · March 2026</p>
        </div>
        <div className="card">
          <div className="tab-row" style={{ marginBottom: 20 }}>
            <button className={`tab ${mode==='login'?'active':''}`} onClick={() => setMode('login')}>Sign In</button>
            <button className={`tab ${mode==='register'?'active':''}`} onClick={() => setMode('register')}>Register</button>
          </div>
          {mode === 'register' && (
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: COLORS.muted, display: 'block', marginBottom: 6 }}>NAME</label>
              <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: COLORS.muted, display: 'block', marginBottom: 6 }}>EMAIL</label>
            <input type="email" placeholder="student@apeejay.edu" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: COLORS.muted, display: 'block', marginBottom: 6 }}>PASSWORD</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key==='Enter' && handle()} />
          </div>
          {error && <p style={{ color: COLORS.red, fontSize: 13, marginBottom: 12 }}>{error}</p>}
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px' }} onClick={handle}>
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomePage({ user, scores, onSelectSubject, onLogout }) {
  const subjects = [
    { id: 'math', label: 'Mathematics', criteria: 'A · C · D', desc: 'Spatial Reasoning & Geometry' },
    { id: 'english', label: 'Language & Literature', criteria: 'A · C · D', desc: 'Science Fiction Unit' },
    { id: 'sciences', label: 'Integrated Sciences', criteria: 'A · D', desc: 'Biology · Physics · Chemistry' },
    { id: 'spanish', label: 'Spanish', criteria: 'B · C · D', desc: 'El mundo en que vivimos' },
    { id: 'individuals', label: 'Individuals & Societies', criteria: 'B · D', desc: 'Population & Culture' },
  ];

  function getAvg(subjectId) {
    const s = scores[subjectId];
    if (!s || !Object.keys(s).length) return null;
    const vals = Object.values(s);
    return Math.round(vals.reduce((a,b)=>a+b,0)/vals.length);
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48 }}>
        <div>
          <div style={{ fontSize: 12, color: COLORS.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>MYP 3 · Mid-Term 2 · March 2026</div>
          <h1 style={{ fontSize: 36, fontWeight: 800 }}>Welcome back, {user.name.split(' ')[0]} 👋</h1>
          <p style={{ color: COLORS.muted, marginTop: 6 }}>Apeejay School International, Panchsheel Park</p>
        </div>
        <button className="btn btn-secondary" onClick={onLogout} style={{ marginTop: 8 }}>Sign Out</button>
      </div>

      {/* Subject Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {subjects.map(sub => {
          const col = COLORS.subjectColors[sub.id];
          const avg = getAvg(sub.id);
          return (
            <div key={sub.id}
              onClick={() => onSelectSubject(sub.id)}
              className="fade-in"
              style={{
                background: col.bg,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 20,
                padding: 28,
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = col.accent; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.transform = ''; }}
            >
              <div style={{ fontSize: 36, marginBottom: 16 }}>{col.icon}</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{sub.label}</h2>
              <p style={{ fontSize: 12, color: COLORS.muted, marginBottom: 12 }}>{sub.desc}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge" style={{ background: col.accent + '22', color: col.accent }}>Criteria {sub.criteria}</span>
                {avg !== null && (
                  <span className="score-chip" style={{ background: avg >= 6 ? COLORS.green+'22' : COLORS.red+'22', color: avg >= 6 ? COLORS.green : COLORS.red }}>
                    Avg {avg}/8
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="card" style={{ marginTop: 32 }}>
        <h3 style={{ marginBottom: 20, fontWeight: 700 }}>📊 Your Progress</h3>
        <div className="grid-3">
          {['math','english','sciences','spanish','individuals'].map(id => {
            const avg = getAvg(id);
            const col = COLORS.subjectColors[id];
            const labels = { math:'Math', english:'English', sciences:'Sciences', spanish:'Spanish', individuals:'I&S' };
            return (
              <div key={id} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{col.icon}</div>
                <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 8 }}>{labels[id]}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: col.accent }}>{avg !== null ? `${avg}/8` : '–'}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── MATH SUBJECT ─────────────────────────────────────────────────────────────
const MATH_TOPICS = [
  "Congruence of triangles – SSS, SAS, ASA, AAS postulates",
  "Similar triangles and scale factor (enlargement/reduction)",
  "Transformations (translation, rotation, reflection, dilation)",
  "Pythagoras' theorem, Pythagorean triplets, and converse",
  "Coordinate geometry – distance formula, midpoint formula, gradient",
  "Graphing lines and finding equation from a graph",
  "Area and perimeter of compound shapes",
  "Arc length and area of sector",
  "Surface area and volume of 3D solids",
  "Composite solids and connecting volume to capacity",
];

function MathPage({ scores, onUpdateScores }) {
  const [tab, setTab] = useState("notes");
  const [pracMode, setPracMode] = useState(null);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800 }}>📐 Mathematics</h2>
        <p style={{ color: COLORS.muted, fontSize: 14 }}>Criteria A · C · D &nbsp;·&nbsp; Unit 3: Spatial Reasoning</p>
      </div>
      <div className="tab-row">
        {['notes','practice','exam'].map(t => (
          <button key={t} className={`tab ${tab===t?'active':''}`} onClick={() => { setTab(t); setPracMode(null); }}>
            {t === 'notes' ? '📝 Notes' : t === 'practice' ? '🎯 Practice' : '📋 Exam'}
          </button>
        ))}
      </div>

      {tab === 'notes' && <MathNotes />}
      {tab === 'practice' && <MathPractice onUpdateScores={onUpdateScores} />}
      {tab === 'exam' && <MathExam onUpdateScores={onUpdateScores} />}
    </div>
  );
}

function MathNotes() {
  return (
    <div className="fade-in">
      {MATH_TOPICS.map((topic, i) => (
        <div key={i} className="card" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span className="badge" style={{ background: COLORS.accent+'22', color: COLORS.accent, marginTop: 2, flexShrink: 0 }}>Topic {i+1}</span>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{topic}</div>
              <div style={{ fontSize: 13, color: COLORS.muted }}>Use General Practice to generate unlimited questions on this topic →</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MathPractice({ onUpdateScores }) {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("random");
  const [score, setScore] = useState(null);

  async function generateQuestion() {
    setLoading(true);
    setFeedback(null);
    setAnswer("");
    setScore(null);
    const topic = selectedTopic === "random" ? MATH_TOPICS[Math.floor(Math.random()*MATH_TOPICS.length)] : selectedTopic;
    try {
      const q = await callAI(
        `You are an IB MYP 3 Mathematics teacher. Generate one structured exam-style question on the topic provided. The question must be appropriate for MYP 3 (Grade 8, age 13-14). Use IB command terms (calculate, show that, justify, find, hence). Format: 
QUESTION: [the question, may include multiple parts a, b, c]
MARKS: [total marks, 4-8]
TOPIC: [topic name]
Do not provide the answer.`,
        `Topic: ${topic}`
      );
      setQuestion({ text: q, topic });
    } catch (e) {
      setQuestion({ text: "Error generating question. Please try again.", topic });
    }
    setLoading(false);
  }

  async function submitAnswer() {
    if (!answer.trim()) return;
    setLoading(true);
    try {
      const fb = await callAI(
        `You are an IB MYP 3 Mathematics examiner. Evaluate the student's working and answer. Be detailed: check method, steps, and final answer. Award marks out of 8. Format your response:
SCORE: X/8
CRITERION: [A/C/D]
FEEDBACK: [detailed feedback on method, what was correct, what was wrong]
MODEL ANSWER: [brief model solution]`,
        `Question: ${question.text}\n\nStudent's Answer/Working:\n${answer}`
      );
      setFeedback(fb);
      const match = fb.match(/SCORE:\s*(\d)/);
      if (match) {
        const s = parseInt(match[1]);
        setScore(s);
        onUpdateScores?.('math', s);
      }
    } catch { setFeedback("Could not evaluate. Please try again."); }
    setLoading(false);
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 12, color: COLORS.muted, display: 'block', marginBottom: 8 }}>SELECT TOPIC</label>
        <select
          value={selectedTopic}
          onChange={e => setSelectedTopic(e.target.value)}
          style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: '10px 14px', color: COLORS.text, fontSize: 14, width: '100%', outline: 'none' }}
        >
          <option value="random">🎲 Random Topic</option>
          {MATH_TOPICS.map((t,i) => <option key={i} value={t}>{t.slice(0,60)}</option>)}
        </select>
      </div>

      <button className="btn btn-primary" onClick={generateQuestion} disabled={loading} style={{ marginBottom: 24 }}>
        {loading ? <><Spinner /> Generating...</> : '⚡ Generate Question'}
      </button>

      {question && (
        <div className="card fade-in">
          <div style={{ fontSize: 12, color: COLORS.accent, marginBottom: 12, fontWeight: 600 }}>{question.topic}</div>
          <div style={{ lineHeight: 1.8, marginBottom: 20, whiteSpace: 'pre-wrap' }}>{question.text}</div>
          <label style={{ fontSize: 12, color: COLORS.muted, display: 'block', marginBottom: 8 }}>YOUR WORKING & ANSWER</label>
          <textarea rows={6} placeholder="Show all working. Write step by step..." value={answer} onChange={e => setAnswer(e.target.value)} />
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <button className="btn btn-success" onClick={submitAnswer} disabled={loading || !answer.trim()}>
              {loading ? <><Spinner /> Evaluating...</> : '✓ Submit'}
            </button>
            <button className="btn btn-secondary" onClick={generateQuestion} disabled={loading}>Next Question →</button>
          </div>
          {score !== null && (
            <div style={{ marginTop: 12 }}>
              <span className="score-chip" style={{ background: score >= 6 ? COLORS.green+'22' : COLORS.red+'22', color: score >= 6 ? COLORS.green : COLORS.red, fontSize: 16 }}>
                Score: {score}/8
              </span>
            </div>
          )}
          <FeedbackBox feedback={feedback} />
        </div>
      )}
    </div>
  );
}

function MathExam({ onUpdateScores }) {
  const [phase, setPhase] = useState("start"); // start | exam | results
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  async function startExam() {
    setGenerating(true);
    const qs = [];
    const topicSample = [...MATH_TOPICS].sort(() => Math.random()-0.5).slice(0, 5);
    for (const topic of topicSample) {
      const q = await callAI(
        `You are an IB MYP 3 Mathematics examiner. Generate one exam question. Use IB command terms. Be precise.
Format:
QUESTION: [structured question with parts a, b if needed]
MARKS: [4-8]
CRITERION: [A or C or D]`,
        `Topic: ${topic}`
      );
      qs.push({ text: q, topic, criterion: q.match(/CRITERION:\s*([ACD])/)?.[1] || 'A' });
    }
    setQuestions(qs);
    setAnswers({});
    setCurrent(0);
    setPhase("exam");
    setGenerating(false);
  }

  async function submitExam() {
    setLoading(true);
    const res = [];
    for (let i = 0; i < questions.length; i++) {
      const fb = await callAI(
        `You are an IB MYP 3 Math examiner. Evaluate briefly.
Format:
SCORE: X/8
CRITERION: [A/C/D]
FEEDBACK: [2-3 sentences]`,
        `Question: ${questions[i].text}\nAnswer: ${answers[i] || "(No answer)"}`
      );
      const s = parseInt(fb.match(/SCORE:\s*(\d)/)?.[1] || '0');
      res.push({ q: questions[i], answer: answers[i], feedback: fb, score: s });
      onUpdateScores?.('math', s);
    }
    setResults(res);
    setPhase("results");
    setLoading(false);
  }

  if (phase === "start") return (
    <div className="card fade-in" style={{ textAlign: 'center', padding: 48 }}>
      <div style={{ fontSize: 56, marginBottom: 20 }}>📋</div>
      <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Mathematics Practice Exam</h3>
      <p style={{ color: COLORS.muted, marginBottom: 8 }}>5 questions · 1 hour · Criteria A, C, D</p>
      <p style={{ color: COLORS.muted, fontSize: 13, marginBottom: 28 }}>No skipping allowed. Show all working.</p>
      {generating ? (
        <div style={{ color: COLORS.muted }}><Spinner /> &nbsp;Generating exam paper...</div>
      ) : (
        <button className="btn btn-primary" onClick={startExam} style={{ fontSize: 16, padding: '14px 32px' }}>
          🚀 Begin Exam
        </button>
      )}
    </div>
  );

  if (phase === "exam") return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, background: COLORS.card, padding: '16px 20px', borderRadius: 12 }}>
        <div>Question {current+1} of {questions.length}</div>
        <Timer seconds={3600} onEnd={submitExam} />
        <div className="progress-bar-track" style={{ width: 120 }}>
          <div className="progress-bar-fill" style={{ width: `${((current)/questions.length)*100}%` }} />
        </div>
      </div>

      <div className="card">
        <span className="badge" style={{ background: COLORS.accent+'22', color: COLORS.accent, marginBottom: 12, display: 'inline-block' }}>
          Criterion {questions[current]?.criterion}
        </span>
        <div style={{ lineHeight: 1.8, marginBottom: 20, whiteSpace: 'pre-wrap' }}>{questions[current]?.text}</div>
        <label style={{ fontSize: 12, color: COLORS.muted, display: 'block', marginBottom: 8 }}>YOUR WORKING & ANSWER</label>
        <textarea rows={8}
          placeholder="Show all working step by step..."
          value={answers[current] || ""}
          onChange={e => setAnswers(prev => ({ ...prev, [current]: e.target.value }))}
        />
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          {current < questions.length - 1 ? (
            <button className="btn btn-primary" onClick={() => setCurrent(c => c+1)} disabled={!answers[current]?.trim()}>
              Next Question →
            </button>
          ) : (
            <button className="btn btn-success" onClick={submitExam} disabled={loading || !answers[current]?.trim()}>
              {loading ? <><Spinner /> Grading...</> : '✓ Submit Exam'}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (phase === "results") {
    const total = results.reduce((a,b) => a+b.score, 0);
    const avg = Math.round(total / results.length);
    return (
      <div className="fade-in">
        <div className="card" style={{ textAlign: 'center', marginBottom: 24, padding: 36 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{avg >= 6 ? '🏆' : avg >= 4 ? '📈' : '💪'}</div>
          <h3 style={{ fontSize: 26, fontWeight: 800 }}>Exam Complete!</h3>
          <div style={{ fontSize: 42, fontWeight: 800, color: avg >= 6 ? COLORS.green : COLORS.red, margin: '12px 0' }}>{avg}/8</div>
          <p style={{ color: COLORS.muted }}>Average score across {results.length} questions</p>
          <button className="btn btn-primary" onClick={() => setPhase('start')} style={{ marginTop: 20 }}>🔄 Retake Exam</button>
        </div>
        {results.map((r, i) => (
          <div key={i} className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontWeight: 600 }}>Question {i+1} – Criterion {r.q.criterion}</span>
              <span className="score-chip" style={{ background: r.score >= 6 ? COLORS.green+'22' : COLORS.red+'22', color: r.score >= 6 ? COLORS.green : COLORS.red }}>{r.score}/8</span>
            </div>
            <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 8, whiteSpace: 'pre-wrap' }}>{r.q.text}</div>
            <FeedbackBox feedback={r.feedback} />
          </div>
        ))}
      </div>
    );
  }
}

// ─── ENGLISH SUBJECT ──────────────────────────────────────────────────────────
const ENGLISH_CMD_TERMS = ["Analyse", "Evaluate", "Explain", "Identify", "Compare", "Discuss", "Examine"];
const SCI_FI_PROMPTS = [
  "Examine how the author uses setting to create a dystopian atmosphere.",
  "Analyse the characteristics of the sci-fi protagonist in the extract.",
  "Identify and explain three conventions of science fiction literature.",
  "Evaluate how the text critiques modern society through sci-fi elements.",
  "Discuss the themes present in this extract from the perspective of a sci-fi reader.",
];

function EnglishPage({ onUpdateScores }) {
  const [tab, setTab] = useState("notes");
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800 }}>📖 Language & Literature</h2>
        <p style={{ color: COLORS.muted, fontSize: 14 }}>Criteria A · C · D &nbsp;·&nbsp; Unit 4: Science Fiction</p>
      </div>
      <div className="tab-row">
        {['notes','practice','writing','exam'].map(t => (
          <button key={t} className={`tab ${tab===t?'active':''}`} onClick={() => setTab(t)}>
            {t==='notes'?'📝 Notes':t==='practice'?'🔍 Analysis':t==='writing'?'✍️ Writing':'📋 Exam'}
          </button>
        ))}
      </div>
      {tab === 'notes' && <EnglishNotes />}
      {tab === 'practice' && <EnglishAnalysis onUpdateScores={onUpdateScores} />}
      {tab === 'writing' && <EnglishWriting onUpdateScores={onUpdateScores} />}
      {tab === 'exam' && <EnglishExam onUpdateScores={onUpdateScores} />}
    </div>
  );
}

function EnglishNotes() {
  const topics = [
    { title: "Conventions of Sci-Fi Literature", points: ["Futuristic settings", "Advanced technology", "Dystopian/utopian worlds", "Alien beings or AI", "Social commentary", "Speculative 'what if' scenarios"] },
    { title: "Sci-Fi Protagonist Traits", points: ["Often an outsider or rebel", "Questions authority", "Special ability or knowledge", "Undergoes transformation", "Represents the reader's perspective"] },
    { title: "Dystopian Elements", points: ["Oppressive government or society", "Loss of individual freedom", "Propaganda and surveillance", "Dehumanization", "Environmental destruction", "Fear as control mechanism"] },
    { title: "IB Command Terms", points: ENGLISH_CMD_TERMS.map(t => `${t}: requires specific type of response`) },
    { title: "Close Analysis: Ender's Game", points: ["Child soldiers and manipulation", "War and morality themes", "Identity under pressure", "Isolation and leadership"] },
  ];

  return (
    <div className="fade-in">
      {topics.map((t, i) => (
        <div key={i} className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 12, color: COLORS.blue }}>{t.title}</h3>
          <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
            {t.points.map((p, j) => <li key={j} style={{ fontSize: 14 }}>{p}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}

function EnglishAnalysis({ onUpdateScores }) {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);

  async function generate() {
    setLoading(true);
    setFeedback(null);
    setAnswer("");
    setScore(null);
    try {
      const q = await callAI(
        `You are an IB MYP 3 English Language & Literature teacher. Generate a short unseen sci-fi text extract (4-6 sentences) followed by one analysis question using proper IB command terms. The extract should contain clear sci-fi or dystopian elements.
Format:
EXTRACT:
[short text extract]

QUESTION:
[One focused analysis question using IB command terms like Analyse/Evaluate/Examine]

CRITERION: [A or C or D]`,
        "Generate a sci-fi analysis practice question"
      );
      setQuestion(q);
    } catch { setQuestion("Error. Please try again."); }
    setLoading(false);
  }

  async function submit() {
    setLoading(true);
    try {
      const fb = await callAI(
        `You are an IB MYP 3 English examiner. Evaluate the student response using the IB Criterion A rubric (Analysing). Score out of 8.
Assess: identification of literary features, analysis of effect, use of textual evidence, interpretation of meaning.
Format:
SCORE: X/8
STRAND BREAKDOWN:
- Analysing (i): X/2
- Analysing (ii): X/2  
- Analysing (iii): X/2
- Overall quality: X/2
FEEDBACK: [specific feedback on strengths and areas for improvement, mention IB criteria language]
SUGGESTED IMPROVEMENTS: [2-3 concrete ways to improve the response]`,
        `Task: ${question}\n\nStudent Response:\n${answer}`
      );
      setFeedback(fb);
      const s = parseInt(fb.match(/SCORE:\s*(\d)/)?.[1] || '0');
      setScore(s);
      onUpdateScores?.('english', s);
    } catch { setFeedback("Could not evaluate. Please try again."); }
    setLoading(false);
  }

  return (
    <div className="fade-in">
      <button className="btn btn-primary" onClick={generate} disabled={loading} style={{ marginBottom: 24 }}>
        {loading ? <><Spinner /> Generating...</> : '⚡ Generate Analysis Question'}
      </button>

      {question && (
        <div className="card fade-in">
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, marginBottom: 20 }}>{question}</div>
          <label style={{ fontSize: 12, color: COLORS.muted, display: 'block', marginBottom: 8 }}>YOUR ANALYSIS RESPONSE</label>
          <textarea rows={8} placeholder="Write your analysis. Use textual evidence. Identify language features and explain their effect..." value={answer} onChange={e => setAnswer(e.target.value)} />
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <button className="btn btn-success" onClick={submit} disabled={loading || !answer.trim()}>
              {loading ? <><Spinner /> Evaluating...</> : '✓ Submit'}
            </button>
            <button className="btn btn-secondary" onClick={generate} disabled={loading}>Next Question →</button>
          </div>
          {score !== null && (
            <div style={{ marginTop: 12 }}>
              <span className="score-chip" style={{ background: score >= 6 ? COLORS.green+'22' : COLORS.red+'22', color: score >= 6 ? COLORS.green : COLORS.red, fontSize: 16 }}>
                Criterion A: {score}/8
              </span>
            </div>
          )}
          <FeedbackBox feedback={feedback} />
        </div>
      )}
    </div>
  );
}

function EnglishWriting({ onUpdateScores }) {
  const [prompt, setPrompt] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [type, setType] = useState("story");

  async function generate() {
    setLoading(true);
    setFeedback(null);
    setAnswer("");
    setScore(null);
    try {
      const p = await callAI(
        `You are an IB MYP 3 English teacher. Generate a creative writing prompt for a ${type}.
The prompt must be linked to science fiction themes (dystopian worlds, advanced technology, social critique).
Format:
TASK TYPE: ${type}
PROMPT: [clear, engaging writing prompt]
REQUIREMENTS: [3-4 bullet points about what to include: word count 300-500, specific elements, structure]`,
        `Generate a ${type} writing prompt for sci-fi unit`
      );
      setPrompt(p);
    } catch { setPrompt("Error. Please retry."); }
    setLoading(false);
  }

  async function submit() {
    setLoading(true);
    try {
      const fb = await callAI(
        `You are an IB MYP 3 English examiner. Evaluate this creative writing using Criterion C (Producing Text) rubric.
Score out of 8.
Assess: purpose/audience awareness, use of language features, creative choices, text type conventions.
Format:
SCORE: X/8
CRITERION C BREAKDOWN:
- Purpose/Audience (i): X/2
- Language Choices (ii): X/2
- Text type features (iii): X/2
- Style/Voice (iv): X/2
FEEDBACK: [specific feedback]
STRENGTHS: [2-3 things done well]
IMPROVEMENTS: [2-3 specific improvements]`,
        `Prompt: ${prompt}\n\nStudent Writing:\n${answer}`
      );
      setFeedback(fb);
      const s = parseInt(fb.match(/SCORE:\s*(\d)/)?.[1] || '0');
      setScore(s);
      onUpdateScores?.('english', s);
    } catch { setFeedback("Evaluation failed. Please retry."); }
    setLoading(false);
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['story','journal','dialogue','monologue'].map(t => (
          <button key={t} className={`btn ${type===t?'btn-primary':'btn-secondary'}`} onClick={() => setType(t)} style={{ textTransform: 'capitalize' }}>
            {t === 'story' ? '📖 Short Story' : t === 'journal' ? '📔 Journal Entry' : t === 'dialogue' ? '💬 Dialogue' : '🎭 Monologue'}
          </button>
        ))}
      </div>
      <button className="btn btn-primary" onClick={generate} disabled={loading} style={{ marginBottom: 24 }}>
        {loading ? <><Spinner /> Generating...</> : '⚡ Generate Writing Prompt'}
      </button>

      {prompt && (
        <div className="card fade-in">
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, marginBottom: 20 }}>{prompt}</div>
          <textarea rows={12} placeholder="Write your response here. Aim for 300-500 words." value={answer} onChange={e => setAnswer(e.target.value)} />
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <button className="btn btn-success" onClick={submit} disabled={loading || answer.split(' ').length < 50}>
              {loading ? <><Spinner /> Evaluating...</> : '✓ Submit'}
            </button>
            <button className="btn btn-secondary" onClick={generate} disabled={loading}>New Prompt →</button>
          </div>
          <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 8 }}>
            Word count: {answer.trim() ? answer.trim().split(/\s+/).length : 0}
          </div>
          {score !== null && (
            <div style={{ marginTop: 12 }}>
              <span className="score-chip" style={{ background: score >= 6 ? COLORS.green+'22' : COLORS.red+'22', color: score >= 6 ? COLORS.green : COLORS.red, fontSize: 16 }}>
                Criterion C: {score}/8
              </span>
            </div>
          )}
          <FeedbackBox feedback={feedback} />
        </div>
      )}
    </div>
  );
}

function EnglishExam({ onUpdateScores }) {
  const [phase, setPhase] = useState("start");
  const [paper, setPaper] = useState(null);
  const [answers, setAnswers] = useState({ analysis: '', writing: '' });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  async function startExam() {
    setLoading(true);
    try {
      const extract = await callAI(
        `Generate a complete IB MYP 3 English exam paper on Science Fiction. Format:
SECTION A – ANALYSIS (Criterion A)
EXTRACT:
[6-8 sentence sci-fi extract with clear literary features]

QUESTION 1: [Analyse question – 8 marks]

---

SECTION B – CREATIVE WRITING (Criterion C)
QUESTION 2: Write a [story/journal entry] about [sci-fi scenario]. (300-400 words, 8 marks)`,
        "Generate complete English exam"
      );
      setPaper(extract);
      setPhase("exam");
    } catch { alert("Error generating exam. Please try again."); }
    setLoading(false);
  }

  async function submit() {
    setLoading(true);
    try {
      const [aFb, cFb] = await Promise.all([
        callAI(`IB MYP3 English Criterion A examiner. Score out of 8. Format: SCORE: X/8\nFEEDBACK: [detailed]`,
          `Paper: ${paper}\nAnalysis Answer: ${answers.analysis}`),
        callAI(`IB MYP3 English Criterion C examiner. Score out of 8. Format: SCORE: X/8\nFEEDBACK: [detailed]`,
          `Writing prompt from paper: ${paper}\nStudent writing: ${answers.writing}`)
      ]);
      const sA = parseInt(aFb.match(/SCORE:\s*(\d)/)?.[1]||'0');
      const sC = parseInt(cFb.match(/SCORE:\s*(\d)/)?.[1]||'0');
      onUpdateScores?.('english', Math.round((sA+sC)/2));
      setResults({ aFb, cFb, sA, sC });
      setPhase("results");
    } catch { alert("Error grading. Please try again."); }
    setLoading(false);
  }

  if (phase === "start") return (
    <div className="card fade-in" style={{ textAlign: 'center', padding: 48 }}>
      <div style={{ fontSize: 56, marginBottom: 20 }}>📋</div>
      <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>English Practice Exam</h3>
      <p style={{ color: COLORS.muted, marginBottom: 28 }}>Analysis + Creative Writing · 1 hour · Criteria A, C, D</p>
      <button className="btn btn-primary" onClick={startExam} disabled={loading} style={{ fontSize: 16, padding: '14px 32px' }}>
        {loading ? <><Spinner /> Generating paper...</> : '🚀 Begin Exam'}
      </button>
    </div>
  );

  if (phase === "exam") return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, background: COLORS.card, padding: '16px 20px', borderRadius: 12 }}>
        <span style={{ fontWeight: 700 }}>English Exam</span>
        <Timer seconds={3600} onEnd={submit} />
      </div>
      <div className="card" style={{ marginBottom: 20, whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{paper}</div>
      <div className="card" style={{ marginBottom: 16 }}>
        <h4 style={{ marginBottom: 12, color: COLORS.blue }}>Section A – Analysis Response (Criterion A)</h4>
        <textarea rows={10} placeholder="Write your analysis here..." value={answers.analysis} onChange={e => setAnswers(p => ({...p, analysis: e.target.value}))} />
      </div>
      <div className="card" style={{ marginBottom: 20 }}>
        <h4 style={{ marginBottom: 12, color: COLORS.blue }}>Section B – Creative Writing (Criterion C)</h4>
        <textarea rows={14} placeholder="Write your story/journal entry here..." value={answers.writing} onChange={e => setAnswers(p => ({...p, writing: e.target.value}))} />
        <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 6 }}>Word count: {answers.writing.trim() ? answers.writing.trim().split(/\s+/).length : 0}</div>
      </div>
      <button className="btn btn-success" onClick={submit} disabled={loading || !answers.analysis.trim() || !answers.writing.trim()} style={{ padding: '14px 32px' }}>
        {loading ? <><Spinner /> Grading...</> : '✓ Submit Exam'}
      </button>
    </div>
  );

  if (phase === "results") return (
    <div className="fade-in">
      <div className="card" style={{ textAlign: 'center', marginBottom: 24, padding: 36 }}>
        <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Exam Results</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40 }}>
          <div>
            <div style={{ fontSize: 13, color: COLORS.muted }}>Criterion A</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: results.sA >= 6 ? COLORS.green : COLORS.red }}>{results.sA}/8</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: COLORS.muted }}>Criterion C</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: results.sC >= 6 ? COLORS.green : COLORS.red }}>{results.sC}/8</div>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setPhase('start')} style={{ marginTop: 24 }}>🔄 Retake Exam</button>
      </div>
      <div className="card" style={{ marginBottom: 16 }}>
        <h4 style={{ marginBottom: 12 }}>Criterion A – Analysis Feedback</h4>
        <FeedbackBox feedback={results.aFb} />
      </div>
      <div className="card">
        <h4 style={{ marginBottom: 12 }}>Criterion C – Writing Feedback</h4>
        <FeedbackBox feedback={results.cFb} />
      </div>
    </div>
  );
}

// ─── SCIENCES ─────────────────────────────────────────────────────────────────
const SCI_TOPICS = {
  biology: ["Structure and importance of plants and germination", "Types of leaves", "Photosynthesis – definition and word equation", "Factors needed for photosynthesis (CO₂, water, light, chlorophyll)", "Products of photosynthesis and their uses", "Transpiration and stomata", "Parasitic plants"],
  physics: ["Introduction to light waves and sound waves", "Sources of light and travel path", "Production and transmission of sound", "Role of vibrations in sound production", "Differences between sound and light waves", "Reflection and refraction of light", "Refractive index", "Seismic waves and shadow zones", "Hearing sound in space"],
  chemistry: ["Word equations for chemical reactions", "Energy changes in reactions", "Metals and oxygen reactions", "Metals and acids reactions", "Metals and water reactions", "Displacement reactions", "The reactivity series", "Investigating fuels and food energy"],
};

function SciencesPage({ onUpdateScores }) {
  const [sciTab, setSciTab] = useState("biology");
  const [mode, setMode] = useState("notes");

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800 }}>🔬 Integrated Sciences</h2>
        <p style={{ color: COLORS.muted, fontSize: 14 }}>Criteria A · D &nbsp;·&nbsp; Biology · Physics · Chemistry</p>
      </div>

      <div className="tab-row">
        {['biology','physics','chemistry','exam'].map(t => (
          <button key={t} className={`tab ${sciTab===t?'active':''}`} onClick={() => { setSciTab(t); setMode('notes'); }}>
            {t==='biology'?'🌿 Biology':t==='physics'?'💡 Physics':t==='chemistry'?'⚗️ Chemistry':'📋 Integrated Exam'}
          </button>
        ))}
      </div>

      {sciTab !== 'exam' ? (
        <>
          <div className="tab-row">
            <button className={`tab ${mode==='notes'?'active':''}`} onClick={() => setMode('notes')}>📝 Notes</button>
            <button className={`tab ${mode==='quiz'?'active':''}`} onClick={() => setMode('quiz')}>🎯 Quiz</button>
          </div>
          {mode === 'notes' && <SciNotes subject={sciTab} />}
          {mode === 'quiz' && <SciQuiz subject={sciTab} onUpdateScores={onUpdateScores} />}
        </>
      ) : (
        <SciExam onUpdateScores={onUpdateScores} />
      )}
    </div>
  );
}

function SciNotes({ subject }) {
  return (
    <div className="fade-in">
      {SCI_TOPICS[subject].map((t, i) => (
        <div key={i} className="card" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <span className="badge" style={{ background: COLORS.green+'22', color: COLORS.green, flexShrink: 0, marginTop: 2 }}>{i+1}</span>
            <span style={{ fontWeight: 500 }}>{t}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function SciQuiz({ subject, onUpdateScores }) {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [qType, setQType] = useState("mcq");

  async function generate() {
    setLoading(true);
    setFeedback(null);
    setAnswer("");
    setScore(null);
    const topic = SCI_TOPICS[subject][Math.floor(Math.random()*SCI_TOPICS[subject].length)];
    try {
      const q = await callAI(
        `You are an IB MYP 3 Integrated Sciences teacher. Generate a ${qType === 'mcq' ? 'multiple choice question (4 options, label A-D)' : 'structured short answer question'} on the topic. Use IB command terms (State, Define, Describe, Explain, Outline). Match MYP 3 level (Cambridge Lower Secondary equivalent).
Format:
TOPIC: ${topic}
QUESTION: [question text]
${qType === 'mcq' ? 'A) [option]\nB) [option]\nC) [option]\nD) [option]\nCORRECT: [A/B/C/D]' : 'MARKS: [2-4]'}`,
        `Subject: ${subject}, Topic: ${topic}`
      );
      setQuestion(q);
    } catch { setQuestion("Error. Please retry."); }
    setLoading(false);
  }

  async function submit() {
    if (!answer.trim()) return;
    setLoading(true);
    try {
      let fb;
      if (qType === 'mcq') {
        const correct = question.match(/CORRECT:\s*([ABCD])/)?.[1];
        const isRight = answer.toUpperCase().trim() === correct;
        fb = `SCORE: ${isRight ? '8' : '0'}/8\nFEEDBACK: ${isRight ? '✅ Correct!' : `❌ Incorrect. The correct answer was ${correct}.`}\n\n`;
        const detailed = await callAI(`Explain why ${correct} is the correct answer to this science question in 3-4 sentences. Be educational.`, question);
        fb += detailed;
      } else {
        fb = await callAI(
          `IB MYP3 Science examiner. Evaluate this response. Score out of 8. Format: SCORE: X/8\nCRITERION: [A or D]\nFEEDBACK: [specific feedback]`,
          `Question: ${question}\nAnswer: ${answer}`
        );
      }
      setFeedback(fb);
      const s = parseInt(fb.match(/SCORE:\s*(\d)/)?.[1] || '0');
      setScore(s);
      onUpdateScores?.('sciences', s);
    } catch { setFeedback("Evaluation failed."); }
    setLoading(false);
  }

  const subjectEmoji = { biology: '🌿', physics: '💡', chemistry: '⚗️' };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button className={`btn ${qType==='mcq'?'btn-primary':'btn-secondary'}`} onClick={() => setQType('mcq')}>MCQ</button>
        <button className={`btn ${qType==='short'?'btn-primary':'btn-secondary'}`} onClick={() => setQType('short')}>Short Answer</button>
      </div>

      <button className="btn btn-primary" onClick={generate} disabled={loading} style={{ marginBottom: 24 }}>
        {loading ? <><Spinner /> Generating...</> : `⚡ Generate ${subjectEmoji[subject]} Question`}
      </button>

      {question && (
        <div className="card fade-in">
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, marginBottom: 20 }}>{question}</div>
          {qType === 'mcq' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['A','B','C','D'].map(opt => (
                <button key={opt} className={`btn ${answer===opt?'btn-primary':'btn-secondary'}`} onClick={() => setAnswer(opt)} style={{ justifyContent: 'flex-start', textAlign: 'left' }}>
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <textarea rows={5} placeholder="Write your answer..." value={answer} onChange={e => setAnswer(e.target.value)} />
          )}
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <button className="btn btn-success" onClick={submit} disabled={loading || !answer.trim()}>
              {loading ? <><Spinner /> Checking...</> : '✓ Submit'}
            </button>
            <button className="btn btn-secondary" onClick={generate} disabled={loading}>Next →</button>
          </div>
          {score !== null && (
            <div style={{ marginTop: 12 }}>
              <span className="score-chip" style={{ background: score >= 6 ? COLORS.green+'22' : COLORS.red+'22', color: score >= 6 ? COLORS.green : COLORS.red, fontSize: 15 }}>{score}/8</span>
            </div>
          )}
          <FeedbackBox feedback={feedback} />
        </div>
      )}
    </div>
  );
}

function SciExam({ onUpdateScores }) {
  const [phase, setPhase] = useState("start");
  const [paper, setPaper] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  async function startExam() {
    setLoading(true);
    try {
      const p = await callAI(
        `You are an IB MYP 3 Integrated Sciences examiner. Generate a complete 1-hour integrated science exam with:
- 3 Biology questions (Criterion A + D)
- 3 Physics questions (Criterion A + D)
- 3 Chemistry questions (Criterion A + D)
Include structured parts (a, b, c). Use IB command terms. Total 9 questions numbered Q1-Q9.
Mark each question out of 8.`,
        "Generate integrated science exam"
      );
      setPaper(p);
      setAnswers({});
      setPhase("exam");
    } catch { alert("Error generating exam."); }
    setLoading(false);
  }

  async function submit() {
    setLoading(true);
    const allAnswers = Object.entries(answers).map(([q, a]) => `Q${parseInt(q)+1}: ${a}`).join('\n\n');
    try {
      const fb = await callAI(
        `IB MYP3 Integrated Sciences examiner. Evaluate these responses to the exam paper.
For each question that has an answer, provide: SCORE: X/8 and brief FEEDBACK.
Then give OVERALL: X/8 and CRITERION_A: X/8 and CRITERION_D: X/8`,
        `Exam Paper:\n${paper}\n\nStudent Answers:\n${allAnswers}`
      );
      const overall = parseInt(fb.match(/OVERALL:\s*(\d)/)?.[1] || '4');
      onUpdateScores?.('sciences', overall);
      setResults(fb);
      setPhase("results");
    } catch { alert("Error grading."); }
    setLoading(false);
  }

  const qNums = paper ? Array.from({length: 9}, (_, i) => i) : [];

  if (phase === "start") return (
    <div className="card fade-in" style={{ textAlign: 'center', padding: 48 }}>
      <div style={{ fontSize: 56, marginBottom: 20 }}>🔬</div>
      <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Integrated Science Exam</h3>
      <p style={{ color: COLORS.muted, marginBottom: 8 }}>9 questions · Biology · Physics · Chemistry</p>
      <p style={{ color: COLORS.muted, fontSize: 13, marginBottom: 28 }}>1 hour · Criteria A and D · No skipping</p>
      <button className="btn btn-primary" onClick={startExam} disabled={loading} style={{ fontSize: 16, padding: '14px 32px' }}>
        {loading ? <><Spinner /> Generating...</> : '🚀 Begin Exam'}
      </button>
    </div>
  );

  if (phase === "exam") return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, background: COLORS.card, padding: '16px 20px', borderRadius: 12 }}>
        <span style={{ fontWeight: 700 }}>Science Exam</span>
        <Timer seconds={3600} onEnd={submit} />
      </div>
      <div className="card" style={{ marginBottom: 20, whiteSpace: 'pre-wrap', lineHeight: 1.9, fontSize: 14 }}>{paper}</div>
      {qNums.map(i => (
        <div key={i} className="card" style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 13, color: COLORS.muted, display: 'block', marginBottom: 8 }}>Q{i+1} – Your Answer</label>
          <textarea rows={4} placeholder="Answer here..." value={answers[i]||''} onChange={e => setAnswers(p => ({...p, [i]: e.target.value}))} />
        </div>
      ))}
      <button className="btn btn-success" onClick={submit} disabled={loading} style={{ marginTop: 8, padding: '14px 32px' }}>
        {loading ? <><Spinner /> Grading...</> : '✓ Submit Exam'}
      </button>
    </div>
  );

  if (phase === "results") return (
    <div className="fade-in">
      <div className="card" style={{ marginBottom: 20, padding: 36, textAlign: 'center' }}>
        <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Science Exam Results</h3>
        <FeedbackBox feedback={results} />
        <button className="btn btn-primary" onClick={() => setPhase('start')} style={{ marginTop: 20 }}>🔄 Retake Exam</button>
      </div>
    </div>
  );
}

// ─── SPANISH ──────────────────────────────────────────────────────────────────
function SpanishPage({ onUpdateScores }) {
  const [tab, setTab] = useState("reading");
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800 }}>🌍 Spanish</h2>
        <p style={{ color: COLORS.muted, fontSize: 14 }}>Criteria B · C · D &nbsp;·&nbsp; Tema 5: El mundo en que vivimos</p>
      </div>
      <div className="tab-row">
        {['reading','writing','speaking','exam'].map(t => (
          <button key={t} className={`tab ${tab===t?'active':''}`} onClick={() => setTab(t)}>
            {t==='reading'?'📖 Lectura (B)':t==='writing'?'✍️ Escritura (D)':t==='speaking'?'🎤 Oral (C)':'📋 Exam'}
          </button>
        ))}
      </div>
      {tab === 'reading' && <SpanishReading onUpdateScores={onUpdateScores} />}
      {tab === 'writing' && <SpanishWriting onUpdateScores={onUpdateScores} />}
      {tab === 'speaking' && <SpanishSpeaking onUpdateScores={onUpdateScores} />}
      {tab === 'exam' && <SpanishExam onUpdateScores={onUpdateScores} />}
    </div>
  );
}

function SpanishReading({ onUpdateScores }) {
  const [passage, setPassage] = useState(null);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);

  async function generate() {
    setLoading(true);
    setFeedback(null);
    setAnswers({});
    setScore(null);
    try {
      const p = await callAI(
        `You are an IB MYP 3 Spanish Language Acquisition teacher. Generate a reading comprehension exercise at A1-A2 level on El Tiempo (weather) or El Medio Ambiente (environment/contamination).

Format exactly:
TEXTO:
[Short Spanish text, 80-120 words, simple vocabulary]

PREGUNTAS DE COMPRENSIÓN:
Q1. [MCQ in Spanish – 4 options: A, B, C, D]
Q2. [MCQ in Spanish – 4 options: A, B, C, D]

PREGUNTAS DE RESPUESTA CORTA:
Q3. [Short answer question in Spanish]
Q4. [Short answer question in Spanish]

VERDADERO/FALSO:
Q5. [Statement in Spanish] (True/False)
Q6. [Statement in Spanish] (True/False)`,
        "Generate Spanish reading comprehension"
      );
      setPassage(p);
    } catch { setPassage("Error. Please retry."); }
    setLoading(false);
  }

  async function submit() {
    setLoading(true);
    try {
      const answersStr = Object.entries(answers).map(([q,a]) => `Q${parseInt(q)+1}: ${a}`).join('\n');
      const fb = await callAI(
        `You are an IB MYP3 Spanish Criterion B (Reading) examiner. Evaluate responses to the reading comprehension. Score out of 8.
Format: SCORE: X/8\nFEEDBACK: [in English, specific feedback on each question]\nCORRECT ANSWERS: [the correct answers]`,
        `Reading Passage and Questions:\n${passage}\n\nStudent Answers:\n${answersStr}`
      );
      setFeedback(fb);
      const s = parseInt(fb.match(/SCORE:\s*(\d)/)?.[1]||'0');
      setScore(s);
      onUpdateScores?.('spanish', s);
    } catch { setFeedback("Evaluation failed."); }
    setLoading(false);
  }

  return (
    <div className="fade-in">
      <button className="btn btn-primary" onClick={generate} disabled={loading} style={{ marginBottom: 24 }}>
        {loading ? <><Spinner /> Generating...</> : '⚡ Generate Reading Exercise'}
      </button>
      {passage && (
        <div className="card fade-in">
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.9, marginBottom: 24, fontSize: 14 }}>{passage}</div>
          {[0,1,2,3,4,5].map(i => (
            <div key={i} style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: COLORS.muted, display: 'block', marginBottom: 6 }}>Respuesta Q{i+1}</label>
              <input type="text" placeholder="Tu respuesta..." value={answers[i]||''} onChange={e => setAnswers(p => ({...p, [i]: e.target.value}))} />
            </div>
          ))}
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button className="btn btn-success" onClick={submit} disabled={loading}>
              {loading ? <><Spinner /> Evaluating...</> : '✓ Submit'}
            </button>
            <button className="btn btn-secondary" onClick={generate} disabled={loading}>Next Text →</button>
          </div>
          {score !== null && (
            <div style={{ marginTop: 12 }}>
              <span className="score-chip" style={{ background: score >= 6 ? COLORS.green+'22' : COLORS.red+'22', color: score >= 6 ? COLORS.green : COLORS.red, fontSize: 15 }}>Criterion B: {score}/8</span>
            </div>
          )}
          <FeedbackBox feedback={feedback} />
        </div>
      )}
    </div>
  );
}

function SpanishWriting({ onUpdateScores }) {
  const [prompt, setPrompt] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);

  async function generate() {
    setLoading(true);
    setFeedback(null);
    setAnswer("");
    setScore(null);
    try {
      const p = await callAI(
        `Generate an IB MYP 3 Spanish Criterion D (Writing) RAFT prompt. Focus on contamination/environmental issues or weather. A1-A2 level.
Format:
ROLE: [who they are]
AUDIENCE: [who they're writing to]
FORMAT: Blog post
TOPIC: [specific environmental/weather topic in Spanish context]
TASK: Write a blog post of 100-150 words in Spanish about [topic].
VOCABULARY HINTS: [5-6 helpful Spanish words/phrases]`,
        "Generate Spanish RAFT writing prompt"
      );
      setPrompt(p);
    } catch { setPrompt("Error. Please retry."); }
    setLoading(false);
  }

  async function submit() {
    setLoading(true);
    try {
      const fb = await callAI(
        `You are an IB MYP3 Spanish Criterion D (Writing) examiner. Evaluate this blog post at A1-A2 level. Score out of 8.
Assess: message clarity, vocabulary range and accuracy, grammar, text type conventions, use of environmental/weather vocabulary.
Format: SCORE: X/8\nFEEDBACK: [in English, very specific feedback]\nGRAMMAR CORRECTIONS: [main errors with corrections]\nVOCABULARY SUGGESTIONS: [better words they could have used]`,
        `RAFT Prompt:\n${prompt}\n\nStudent Blog:\n${answer}`
      );
      setFeedback(fb);
      const s = parseInt(fb.match(/SCORE:\s*(\d)/)?.[1]||'0');
      setScore(s);
      onUpdateScores?.('spanish', s);
    } catch { setFeedback("Evaluation failed."); }
    setLoading(false);
  }

  return (
    <div className="fade-in">
      <button className="btn btn-primary" onClick={generate} disabled={loading} style={{ marginBottom: 24 }}>
        {loading ? <><Spinner /> Generating...</> : '⚡ Generate RAFT Prompt'}
      </button>
      {prompt && (
        <div className="card fade-in">
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.9, marginBottom: 20 }}>{prompt}</div>
          <textarea rows={10} placeholder="Escribe tu blog aquí (100-150 palabras)..." value={answer} onChange={e => setAnswer(e.target.value)} />
          <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 6 }}>
            Palabras: {answer.trim() ? answer.trim().split(/\s+/).length : 0} / 100-150
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <button className="btn btn-success" onClick={submit} disabled={loading || answer.split(/\s+/).length < 30}>
              {loading ? <><Spinner /> Evaluating...</> : '✓ Submit'}
            </button>
            <button className="btn btn-secondary" onClick={generate} disabled={loading}>New Prompt →</button>
          </div>
          {score !== null && (
            <div style={{ marginTop: 12 }}>
              <span className="score-chip" style={{ background: score >= 6 ? COLORS.green+'22' : COLORS.red+'22', color: score >= 6 ? COLORS.green : COLORS.red, fontSize: 15 }}>Criterion D: {score}/8</span>
            </div>
          )}
          <FeedbackBox feedback={feedback} />
        </div>
      )}
    </div>
  );
}

function SpanishSpeaking({ onUpdateScores }) {
  const [phase, setPhase] = useState("prep"); // prep | record | feedback
  const [prompt, setPrompt] = useState(null);
  const [notes, setNotes] = useState("");
  const [speech, setSpeech] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);

  async function generate() {
    setLoading(true);
    setNotes("");
    setSpeech("");
    setFeedback(null);
    try {
      const p = await callAI(
        `Generate an IB MYP 3 Spanish oral speaking prompt. Include a visual/scenario description related to weather, clothing, or environmental contamination.
Format:
TEMA: [topic title]
SCENARIO: [describe an image/situation in English – weather scene or environmental problem]
SPEAKING TASK: [What to talk about for 2-3 minutes in Spanish]
GUIDING QUESTIONS: [3 questions to address in the speech]
KEY VOCABULARY: [10 useful Spanish words for the topic]`,
        "Generate Spanish oral speaking prompt"
      );
      setPrompt(p);
      setPhase("prep");
    } catch { setPrompt("Error. Please retry."); }
    setLoading(false);
  }

  async function submitSpeech() {
    setLoading(true);
    try {
      const fb = await callAI(
        `You are an IB MYP3 Spanish Criterion C (Speaking) examiner. The student has submitted their oral speech as written text. Evaluate at A1-A2 level.
Score out of 8. Assess: message clarity, vocabulary, grammar, response to task.
Format: SCORE: X/8\nFEEDBACK: [specific feedback in English]\nFOLLOW-UP QUESTION 1: [question in Spanish]\nFOLLOW-UP QUESTION 2: [question in Spanish]`,
        `Speaking Prompt:\n${prompt}\n\nStudent Speech (written representation):\n${speech}`
      );
      setFeedback(fb);
      const s = parseInt(fb.match(/SCORE:\s*(\d)/)?.[1]||'0');
      setScore(s);
      onUpdateScores?.('spanish', s);
      setPhase("feedback");
    } catch { setFeedback("Evaluation failed."); }
    setLoading(false);
  }

  return (
    <div className="fade-in">
      <button className="btn btn-primary" onClick={generate} disabled={loading} style={{ marginBottom: 24 }}>
        {loading ? <><Spinner /> Generating...</> : '⚡ Generate Speaking Prompt'}
      </button>

      {prompt && (
        <div className="card fade-in">
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.9, marginBottom: 24 }}>{prompt}</div>

          {phase === "prep" && (
            <>
              <div style={{ background: COLORS.surface, borderRadius: 10, padding: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 24 }}>⏱</span>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>Preparation Time: 10 minutes</div>
                  <div style={{ fontSize: 13, color: COLORS.muted }}>Take notes below, then proceed to record your speech</div>
                </div>
              </div>
              <label style={{ fontSize: 12, color: COLORS.muted, display: 'block', marginBottom: 8 }}>PREPARATION NOTES</label>
              <textarea rows={5} placeholder="Tus notas / Your prep notes..." value={notes} onChange={e => setNotes(e.target.value)} />
              <button className="btn btn-primary" onClick={() => setPhase("record")} style={{ marginTop: 12 }}>Ready to Speak →</button>
            </>
          )}

          {phase === "record" && (
            <>
              <div style={{ background: COLORS.red+'11', border: `1px solid ${COLORS.red}33`, borderRadius: 10, padding: 16, marginBottom: 20 }}>
                <div style={{ fontWeight: 600, color: COLORS.red, marginBottom: 4 }}>🎤 Recording Mode</div>
                <div style={{ fontSize: 13, color: COLORS.muted }}>Type what you would say in your 2-3 minute speech. Write in Spanish.</div>
              </div>
              <textarea rows={10} placeholder="Habla aquí... (Escribe tu discurso en español)" value={speech} onChange={e => setSpeech(e.target.value)} />
              <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 6 }}>Palabras: {speech.trim().split(/\s+/).filter(Boolean).length}</div>
              <button className="btn btn-success" onClick={submitSpeech} disabled={loading || speech.split(/\s+/).length < 20} style={{ marginTop: 12 }}>
                {loading ? <><Spinner /> Evaluating...</> : '✓ Submit Speech'}
              </button>
            </>
          )}

          {phase === "feedback" && (
            <>
              {score !== null && (
                <div style={{ marginBottom: 12 }}>
                  <span className="score-chip" style={{ background: score >= 6 ? COLORS.green+'22' : COLORS.red+'22', color: score >= 6 ? COLORS.green : COLORS.red, fontSize: 15 }}>Criterion C: {score}/8</span>
                </div>
              )}
              <FeedbackBox feedback={feedback} />
              <button className="btn btn-secondary" onClick={() => { setPhase('prep'); generate(); }} style={{ marginTop: 16 }}>
                New Prompt →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function SpanishExam({ onUpdateScores }) {
  const [phase, setPhase] = useState("start");
  const [paper, setPaper] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  async function startExam() {
    setLoading(true);
    try {
      const p = await callAI(
        `Generate a complete IB MYP3 Spanish exam. A1-A2 level. No criterion C.

SECTION 1 – CRITERION B: READING COMPREHENSION
[Short Spanish text about weather or environment, 80-100 words]
Q1. [MCQ A-D]
Q2. [MCQ A-D]
Q3. [Short answer in Spanish]
Q4. [Short answer in Spanish]
Q5-Q6. [True/False statements]

SECTION 2 – CRITERION D: WRITING (RAFT)
Role: [role]
Audience: [audience]  
Format: Blog
Topic: [environmental/contamination topic]
Task: Write a blog post of 100-150 words in Spanish.`,
        "Generate complete Spanish exam"
      );
      setPaper(p);
      setAnswers({});
      setPhase("exam");
    } catch { alert("Error. Please retry."); }
    setLoading(false);
  }

  async function submit() {
    setLoading(true);
    try {
      const [bFb, dFb] = await Promise.all([
        callAI(`IB MYP3 Spanish Criterion B examiner. Score out of 8. Format: SCORE: X/8\nFEEDBACK: [brief]`,
          `Paper:\n${paper}\n\nReading Answers:\n${[0,1,2,3,4,5].map(i => `Q${i+1}: ${answers[`b${i}`]||''}`).join('\n')}`),
        callAI(`IB MYP3 Spanish Criterion D examiner. Score out of 8. Evaluate A1-A2 blog. Format: SCORE: X/8\nFEEDBACK: [detailed]`,
          `Prompt from paper:\n${paper}\n\nStudent Blog:\n${answers.blog||''}`)
      ]);
      const sB = parseInt(bFb.match(/SCORE:\s*(\d)/)?.[1]||'0');
      const sD = parseInt(dFb.match(/SCORE:\s*(\d)/)?.[1]||'0');
      onUpdateScores?.('spanish', Math.round((sB+sD)/2));
      setResults({ bFb, dFb, sB, sD });
      setPhase("results");
    } catch { alert("Error grading."); }
    setLoading(false);
  }

  if (phase === "start") return (
    <div className="card fade-in" style={{ textAlign: 'center', padding: 48 }}>
      <div style={{ fontSize: 56, marginBottom: 20 }}>🌍</div>
      <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Spanish Practice Exam</h3>
      <p style={{ color: COLORS.muted, marginBottom: 8 }}>Reading + Writing · Criteria B & D · No Criterion C</p>
      <p style={{ color: COLORS.muted, fontSize: 13, marginBottom: 28 }}>Timed · No skipping allowed</p>
      <button className="btn btn-primary" onClick={startExam} disabled={loading} style={{ fontSize: 16, padding: '14px 32px' }}>
        {loading ? <><Spinner /> Generating...</> : '🚀 Comenzar Examen'}
      </button>
    </div>
  );

  if (phase === "exam") return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, background: COLORS.card, padding: '16px 20px', borderRadius: 12 }}>
        <span style={{ fontWeight: 700 }}>Spanish Exam</span>
        <Timer seconds={3600} onEnd={submit} />
      </div>
      <div className="card" style={{ marginBottom: 20, whiteSpace: 'pre-wrap', lineHeight: 1.9, fontSize: 14 }}>{paper}</div>
      
      <div className="card" style={{ marginBottom: 20 }}>
        <h4 style={{ marginBottom: 16, color: COLORS.gold }}>Section 1 – Reading Comprehension</h4>
        {[0,1,2,3,4,5].map(i => (
          <div key={i} style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: COLORS.muted, display: 'block', marginBottom: 6 }}>Q{i+1}</label>
            <input type="text" placeholder="Tu respuesta..." value={answers[`b${i}`]||''} onChange={e => setAnswers(p => ({...p, [`b${i}`]: e.target.value}))} />
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h4 style={{ marginBottom: 12, color: COLORS.gold }}>Section 2 – Blog Writing (100-150 words)</h4>
        <textarea rows={10} placeholder="Escribe tu blog aquí..." value={answers.blog||''} onChange={e => setAnswers(p => ({...p, blog: e.target.value}))} />
        <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 6 }}>Palabras: {(answers.blog||'').trim().split(/\s+/).filter(Boolean).length}</div>
      </div>

      <button className="btn btn-success" onClick={submit} disabled={loading} style={{ padding: '14px 32px' }}>
        {loading ? <><Spinner /> Grading...</> : '✓ Submit Exam'}
      </button>
    </div>
  );

  if (phase === "results") return (
    <div className="fade-in">
      <div className="card" style={{ textAlign: 'center', marginBottom: 24, padding: 36 }}>
        <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Resultados del Examen</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40 }}>
          <div><div style={{ fontSize: 13, color: COLORS.muted }}>Criterion B (Reading)</div><div style={{ fontSize: 36, fontWeight: 800, color: results.sB >= 6 ? COLORS.green : COLORS.red }}>{results.sB}/8</div></div>
          <div><div style={{ fontSize: 13, color: COLORS.muted }}>Criterion D (Writing)</div><div style={{ fontSize: 36, fontWeight: 800, color: results.sD >= 6 ? COLORS.green : COLORS.red }}>{results.sD}/8</div></div>
        </div>
        <button className="btn btn-primary" onClick={() => setPhase('start')} style={{ marginTop: 20 }}>🔄 Retake</button>
      </div>
      <div className="card" style={{ marginBottom: 16 }}><h4 style={{ marginBottom: 12 }}>Criterion B Feedback</h4><FeedbackBox feedback={results.bFb} /></div>
      <div className="card"><h4 style={{ marginBottom: 12 }}>Criterion D Feedback</h4><FeedbackBox feedback={results.dFb} /></div>
    </div>
  );
}

// ─── INDIVIDUALS & SOCIETIES ──────────────────────────────────────────────────
const IS_TOPICS = [
  "Pattern of global population change",
  "Process of population change",
  "Migration – push and pull factors",
  "Demographic Transition Model (DTM) – all stages",
  "Population pyramids – analysis and interpretation",
  "Case Study: Nigeria – population issues",
  "Case Study: Hong Kong – aging population",
  "Case Study: Detroit – urban decline and population loss",
  "Culture – definition and components",
  "The Cultural Iceberg – visible and invisible culture",
  "Holidays and celebrations, arts, food, clothing, architecture",
  "Case Study: Mexico",
  "Case Study: Grunge Music – counterculture",
  "Multiculturalism – benefits and challenges",
  "Conflicts threatening culture",
];

function IndividualsPage({ onUpdateScores }) {
  const [tab, setTab] = useState("notes");
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800 }}>🌐 Individuals & Societies</h2>
        <p style={{ color: COLORS.muted, fontSize: 14 }}>Criteria B · D &nbsp;·&nbsp; Population & Culture</p>
      </div>
      <div className="tab-row">
        {['notes','practice','exam'].map(t => (
          <button key={t} className={`tab ${tab===t?'active':''}`} onClick={() => setTab(t)}>
            {t==='notes'?'📝 Notes':t==='practice'?'🎯 Practice':'📋 Exam'}
          </button>
        ))}
      </div>
      {tab === 'notes' && <ISNotes />}
      {tab === 'practice' && <ISPractice onUpdateScores={onUpdateScores} />}
      {tab === 'exam' && <ISExam onUpdateScores={onUpdateScores} />}
    </div>
  );
}

function ISNotes() {
  const units = [
    {
      title: "Unit 4: Dynamics of Population Distribution",
      topics: IS_TOPICS.slice(0, 8),
      color: COLORS.red,
    },
    {
      title: "Unit 5: Culture",
      topics: IS_TOPICS.slice(8),
      color: COLORS.blue,
    },
  ];
  return (
    <div className="fade-in">
      {units.map((u, i) => (
        <div key={i} className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ color: u.color, marginBottom: 16, fontWeight: 700 }}>{u.title}</h3>
          {u.topics.map((t, j) => (
            <div key={j} style={{ padding: '10px 0', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', gap: 12 }}>
              <span className="badge" style={{ background: u.color+'22', color: u.color, flexShrink: 0 }}>{j+1}</span>
              <span style={{ fontSize: 14 }}>{t}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function ISPractice({ onUpdateScores }) {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [criterion, setCriterion] = useState("B");

  async function generate() {
    setLoading(true);
    setFeedback(null);
    setAnswer("");
    setScore(null);
    const topic = IS_TOPICS[Math.floor(Math.random()*IS_TOPICS.length)];
    try {
      const q = await callAI(
        `You are an IB MYP 3 Individuals & Societies teacher. Generate a Criterion ${criterion} question.
For Criterion B: Use IB command terms (Describe, Explain, Compare, Outline, Analyse, Evaluate) related to investigating or communicating about population/culture topics.
For Criterion D: Focus on critical thinking – cause/effect, evaluation of impacts, different perspectives.
The question may reference data/sources the student should interpret.
Format:
CRITERION: ${criterion}
TOPIC: ${topic}
QUESTION: [structured IB-style question, may have parts a, b]
COMMAND TERM: [main command term used]
MARKS: [4-8]`,
        `Topic: ${topic}, Criterion: ${criterion}`
      );
      setQuestion(q);
    } catch { setQuestion("Error. Please retry."); }
    setLoading(false);
  }

  async function submit() {
    setLoading(true);
    try {
      const fb = await callAI(
        `IB MYP3 Individuals & Societies examiner. Criterion ${criterion}. Score out of 8.
Use appropriate strand descriptors.
Format: SCORE: X/8\nFEEDBACK: [specific to IB command terms and criterion]\nSTRENGTHS: [what was good]\nIMPROVEMENTS: [how to reach higher bands]`,
        `Question: ${question}\n\nStudent Answer:\n${answer}`
      );
      setFeedback(fb);
      const s = parseInt(fb.match(/SCORE:\s*(\d)/)?.[1]||'0');
      setScore(s);
      onUpdateScores?.('individuals', s);
    } catch { setFeedback("Evaluation failed."); }
    setLoading(false);
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button className={`btn ${criterion==='B'?'btn-primary':'btn-secondary'}`} onClick={() => setCriterion('B')}>Criterion B (Investigating)</button>
        <button className={`btn ${criterion==='D'?'btn-primary':'btn-secondary'}`} onClick={() => setCriterion('D')}>Criterion D (Critical Thinking)</button>
      </div>
      <button className="btn btn-primary" onClick={generate} disabled={loading} style={{ marginBottom: 24 }}>
        {loading ? <><Spinner /> Generating...</> : '⚡ Generate Question'}
      </button>
      {question && (
        <div className="card fade-in">
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.9, marginBottom: 20 }}>{question}</div>
          <textarea rows={8} placeholder="Write your structured response using IB command terms..." value={answer} onChange={e => setAnswer(e.target.value)} />
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <button className="btn btn-success" onClick={submit} disabled={loading || !answer.trim()}>
              {loading ? <><Spinner /> Evaluating...</> : '✓ Submit'}
            </button>
            <button className="btn btn-secondary" onClick={generate} disabled={loading}>Next Question →</button>
          </div>
          {score !== null && (
            <div style={{ marginTop: 12 }}>
              <span className="score-chip" style={{ background: score >= 6 ? COLORS.green+'22' : COLORS.red+'22', color: score >= 6 ? COLORS.green : COLORS.red, fontSize: 15 }}>Criterion {criterion}: {score}/8</span>
            </div>
          )}
          <FeedbackBox feedback={feedback} />
        </div>
      )}
    </div>
  );
}

function ISExam({ onUpdateScores }) {
  const [phase, setPhase] = useState("start");
  const [paper, setPaper] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [qCount, setQCount] = useState(0);

  async function startExam() {
    setLoading(true);
    try {
      const p = await callAI(
        `Generate a complete IB MYP3 Individuals & Societies practice exam (1 hour).
Include a data/source stimulus (population table or text about culture).
Then 5 structured questions:
Q1-Q2: Criterion B (Investigating/Communicating) – describe, explain, outline
Q3-Q4: Criterion D (Critical Thinking) – evaluate, discuss, analyse
Q5: Extended response – evaluate OR analyse using case study evidence.
Use proper IB formatting. No skipping in exam.`,
        "Generate I&S practice exam"
      );
      setPaper(p);
      const count = (p.match(/^Q\d/gm)||[]).length || 5;
      setQCount(count);
      setAnswers({});
      setPhase("exam");
    } catch { alert("Error. Please retry."); }
    setLoading(false);
  }

  async function submit() {
    setLoading(true);
    const allAns = Object.entries(answers).map(([q,a]) => `Q${parseInt(q)+1}: ${a}`).join('\n\n');
    try {
      const fb = await callAI(
        `IB MYP3 I&S examiner. Grade this exam. For each question provide score and feedback.
Then: CRITERION_B: X/8, CRITERION_D: X/8, OVERALL: X/8`,
        `Exam Paper:\n${paper}\n\nAnswers:\n${allAns}`
      );
      const overall = parseInt(fb.match(/OVERALL:\s*(\d)/)?.[1]||'4');
      onUpdateScores?.('individuals', overall);
      setResults(fb);
      setPhase("results");
    } catch { alert("Error grading."); }
    setLoading(false);
  }

  if (phase === "start") return (
    <div className="card fade-in" style={{ textAlign: 'center', padding: 48 }}>
      <div style={{ fontSize: 56, marginBottom: 20 }}>🌐</div>
      <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>I&S Practice Exam</h3>
      <p style={{ color: COLORS.muted, marginBottom: 8 }}>5 structured questions · 1 hour · Criteria B & D</p>
      <p style={{ color: COLORS.muted, fontSize: 13, marginBottom: 28 }}>Population & Culture · Extract-based · No skipping</p>
      <button className="btn btn-primary" onClick={startExam} disabled={loading} style={{ fontSize: 16, padding: '14px 32px' }}>
        {loading ? <><Spinner /> Generating...</> : '🚀 Begin Exam'}
      </button>
    </div>
  );

  if (phase === "exam") return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, background: COLORS.card, padding: '16px 20px', borderRadius: 12 }}>
        <span style={{ fontWeight: 700 }}>I&S Exam</span>
        <Timer seconds={3600} onEnd={submit} />
      </div>
      <div className="card" style={{ marginBottom: 20, whiteSpace: 'pre-wrap', lineHeight: 1.9, fontSize: 14 }}>{paper}</div>
      {Array.from({length: qCount}, (_, i) => (
        <div key={i} className="card" style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 13, color: COLORS.muted, display: 'block', marginBottom: 8 }}>Q{i+1} – Your Answer</label>
          <textarea rows={i === qCount-1 ? 10 : 5} placeholder="Write your response..." value={answers[i]||''} onChange={e => setAnswers(p => ({...p, [i]: e.target.value}))} />
        </div>
      ))}
      <button className="btn btn-success" onClick={submit} disabled={loading} style={{ padding: '14px 32px' }}>
        {loading ? <><Spinner /> Grading...</> : '✓ Submit Exam'}
      </button>
    </div>
  );

  if (phase === "results") return (
    <div className="fade-in">
      <div className="card" style={{ marginBottom: 20, padding: 36, textAlign: 'center' }}>
        <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Exam Results</h3>
        <FeedbackBox feedback={results} />
        <button className="btn btn-primary" onClick={() => setPhase('start')} style={{ marginTop: 20 }}>🔄 Retake Exam</button>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState(() => loadData() || defaultData());
  const [subject, setSubject] = useState(null);

  function updateScores(subjectId, score) {
    setData(prev => {
      const updated = {
        ...prev,
        scores: {
          ...prev.scores,
          [subjectId]: {
            ...(prev.scores[subjectId] || {}),
            [Date.now()]: score,
          }
        },
        attempts: [...(prev.attempts || []), { subject: subjectId, score, timestamp: Date.now() }]
      };
      saveData(updated);
      return updated;
    });
  }

  function login(user) {
    setData(prev => {
      const updated = { ...prev, user };
      saveData(updated);
      return updated;
    });
  }

  function logout() {
    setData(prev => {
      const updated = { ...prev, user: null };
      saveData(updated);
      return updated;
    });
    setSubject(null);
  }

  const avgScores = {};
  Object.entries(data.scores || {}).forEach(([subId, scoreMap]) => {
    const vals = Object.values(scoreMap || {});
    if (vals.length) avgScores[subId] = Math.round(vals.reduce((a,b)=>a+b,0)/vals.length);
  });

  const subjectProps = { scores: avgScores, onUpdateScores: updateScores };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {!data.user ? (
          <AuthPage onLogin={login} />
        ) : subject ? (
          <div>
            {/* Back nav */}
            <div style={{ background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <button className="btn btn-secondary" onClick={() => setSubject(null)} style={{ padding: '8px 14px' }}>← Home</button>
              <span style={{ color: COLORS.muted, fontSize: 13 }}>MYP 3 · Mid-Term 2 · {data.user.name}</span>
            </div>
            {subject === 'math' && <MathPage {...subjectProps} />}
            {subject === 'english' && <EnglishPage {...subjectProps} />}
            {subject === 'sciences' && <SciencesPage {...subjectProps} />}
            {subject === 'spanish' && <SpanishPage {...subjectProps} />}
            {subject === 'individuals' && <IndividualsPage {...subjectProps} />}
          </div>
        ) : (
          <HomePage
            user={data.user}
            scores={avgScores}
            onSelectSubject={setSubject}
            onLogout={logout}
          />
        )}
      </div>
    </>
  );
}
