import { useState, useRef, useEffect } from "react";

// ── DESIGN TOKENS ──────────────────────────────────────────────
// Palette: deep space navy + electric violet accent + warm white text
// Signature: animated "rise" progress rings on the dashboard
const C = {
  bg: "#0A0A0F",
  surface: "#13131C",
  card: "#1A1A27",
  border: "#2A2A3E",
  accent: "#7C5CFC",
  accentGlow: "#7C5CFC44",
  accentLight: "#A98BFF",
  green: "#22C55E",
  red: "#EF4444",
  orange: "#F97316",
  yellow: "#EAB308",
  text: "#F0EFFF",
  muted: "#8884A8",
  dim: "#3A3A55",
};

// ── MOCK DATA ──────────────────────────────────────────────────
const INITIAL_HABITS = [
  { id: 1, name: "Morning workout", icon: "💪", streak: 5, done: false },
  { id: 2, name: "Drink 2L water", icon: "💧", streak: 12, done: true },
  { id: 3, name: "Read 20 minutes", icon: "📖", streak: 3, done: false },
  { id: 4, name: "No social media before 10am", icon: "📵", streak: 7, done: false },
];

const INITIAL_WORKOUTS = [
  { id: 1, name: "Push Day", exercises: [{ name: "Bench Press", sets: 4, reps: 8, weight: 60 }, { name: "Shoulder Press", sets: 3, reps: 10, weight: 30 }] },
  { id: 2, name: "Pull Day", exercises: [{ name: "Pull-ups", sets: 4, reps: 8, weight: 0 }, { name: "Barbell Row", sets: 3, reps: 10, weight: 50 }] },
];

const INITIAL_MEALS = [
  { id: 1, name: "Oats + banana", cal: 350, protein: 12, carbs: 65, fat: 6 },
  { id: 2, name: "Chicken rice bowl", cal: 520, protein: 42, carbs: 55, fat: 8 },
];

const LEADERBOARD = [
  { rank: 1, name: "You", points: 1240, avatar: "🧑‍💻" },
  { rank: 2, name: "Amaka", points: 1180, avatar: "👩" },
  { rank: 3, name: "Chidi", points: 1050, avatar: "👨" },
  { rank: 4, name: "Fatima", points: 980, avatar: "👩‍🦱" },
  { rank: 5, name: "Emeka", points: 870, avatar: "🧔" },
];

// ── HELPERS ───────────────────────────────────────────────────
function RingProgress({ value, max, size = 80, stroke = 7, color = C.accent, children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / max) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.border} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
          strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.6s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, ...style }}>
      {children}
    </div>
  );
}

function Badge({ children, color = C.accent }) {
  return (
    <span style={{ background: color + "22", color, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99, border: `1px solid ${color}44` }}>
      {children}
    </span>
  );
}

function Btn({ children, onClick, color = C.accent, outline = false, small = false, style }) {
  return (
    <button onClick={onClick} style={{
      background: outline ? "transparent" : color,
      color: outline ? color : "#fff",
      border: `1.5px solid ${color}`,
      borderRadius: 10,
      padding: small ? "6px 14px" : "10px 20px",
      fontSize: small ? 13 : 14,
      fontWeight: 700,
      cursor: "pointer",
      fontFamily: "inherit",
      transition: "opacity 0.15s",
      ...style
    }}
      onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
      onMouseOut={e => e.currentTarget.style.opacity = "1"}
    >
      {children}
    </button>
  );
}

// ── SCREENS ───────────────────────────────────────────────────

// HOME DASHBOARD
function Home({ habits, meals, workouts }) {
  const doneHabits = habits.filter(h => h.done).length;
  const totalCal = meals.reduce((a, m) => a + m.cal, 0);
  const calGoal = 2200;
  const totalProtein = meals.reduce((a, m) => a + m.protein, 0);
  const streak = 7;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Hero greeting */}
      <div style={{ background: `linear-gradient(135deg, ${C.accent}22, ${C.surface})`, border: `1px solid ${C.accent}33`, borderRadius: 20, padding: 20 }}>
        <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>Good morning 👋</p>
        <h2 style={{ color: C.text, margin: "4px 0 12px", fontSize: 22, fontWeight: 800 }}>Let's Rise Today</h2>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <RingProgress value={doneHabits} max={habits.length} size={72} stroke={7} color={C.accent}>
            <span style={{ color: C.text, fontSize: 13, fontWeight: 800 }}>{Math.round(doneHabits / habits.length * 100)}%</span>
          </RingProgress>
          <div>
            <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>Daily habits</p>
            <p style={{ color: C.text, fontWeight: 700, margin: "2px 0" }}>{doneHabits}/{habits.length} complete</p>
            <Badge color={C.orange}>🔥 {streak} day streak</Badge>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[
          { label: "Calories", value: totalCal, max: calGoal, unit: "kcal", color: C.orange },
          { label: "Protein", value: totalProtein, max: 160, unit: "g", color: C.green },
          { label: "Workouts", value: workouts.length, max: 5, unit: "wk", color: C.accent },
        ].map(s => (
          <Card key={s.label} style={{ padding: 12, textAlign: "center" }}>
            <RingProgress value={s.value} max={s.max} size={52} stroke={5} color={s.color}>
              <span style={{ fontSize: 10, color: C.text, fontWeight: 800 }}>{s.value}</span>
            </RingProgress>
            <p style={{ color: C.muted, fontSize: 11, margin: "6px 0 0", textAlign: "center" }}>{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Today's habits preview */}
      <Card>
        <p style={{ color: C.muted, fontSize: 12, fontWeight: 700, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 1 }}>Today's Habits</p>
        {habits.slice(0, 3).map(h => (
          <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 18 }}>{h.icon}</span>
            <span style={{ color: h.done ? C.muted : C.text, flex: 1, fontSize: 14, textDecoration: h.done ? "line-through" : "none" }}>{h.name}</span>
            {h.done && <span style={{ color: C.green, fontSize: 16 }}>✓</span>}
            {!h.done && <span style={{ color: C.dim, fontSize: 16 }}>○</span>}
          </div>
        ))}
      </Card>

      {/* Motivational quote */}
      <Card style={{ background: `linear-gradient(135deg, ${C.accent}18, ${C.card})`, textAlign: "center" }}>
        <p style={{ color: C.accentLight, fontSize: 13, fontStyle: "italic", margin: 0 }}>
          "Small daily improvements lead to stunning results."
        </p>
        <p style={{ color: C.dim, fontSize: 11, margin: "6px 0 0" }}>— Your Rizen Coach</p>
      </Card>
    </div>
  );
}

// HABITS
function Habits({ habits, setHabits }) {
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("⭐");
  const icons = ["💪", "📖", "💧", "🏃", "🧘", "🥗", "😴", "📵", "🎯", "✍️", "⭐"];

  const toggle = (id) => setHabits(habits.map(h => h.id === id ? { ...h, done: !h.done, streak: !h.done ? h.streak + 1 : h.streak } : h));
  const add = () => {
    if (!newName.trim()) return;
    setHabits([...habits, { id: Date.now(), name: newName, icon: newIcon, streak: 0, done: false }]);
    setNewName("");
  };
  const remove = (id) => setHabits(habits.filter(h => h.id !== id));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h2 style={{ color: C.text, margin: 0, fontSize: 20, fontWeight: 800 }}>Habits & Goals</h2>

      {/* Add habit */}
      <Card>
        <p style={{ color: C.muted, fontSize: 12, fontWeight: 700, margin: "0 0 10px", textTransform: "uppercase" }}>New Habit</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          {icons.map(ic => (
            <button key={ic} onClick={() => setNewIcon(ic)} style={{
              background: newIcon === ic ? C.accent : C.surface, border: `1px solid ${newIcon === ic ? C.accent : C.border}`,
              borderRadius: 8, width: 34, height: 34, fontSize: 16, cursor: "pointer"
            }}>{ic}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={newName} onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && add()}
            placeholder="e.g. Meditate 10 min"
            style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 12px", color: C.text, fontSize: 14, fontFamily: "inherit", outline: "none" }} />
          <Btn onClick={add}>Add</Btn>
        </div>
      </Card>

      {/* Habit list */}
      {habits.map(h => (
        <Card key={h.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => toggle(h.id)} style={{
            width: 36, height: 36, borderRadius: "50%", border: `2px solid ${h.done ? C.green : C.border}`,
            background: h.done ? C.green + "22" : "transparent", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            {h.done ? "✓" : h.icon}
          </button>
          <div style={{ flex: 1 }}>
            <p style={{ color: h.done ? C.muted : C.text, margin: 0, fontSize: 14, fontWeight: 600, textDecoration: h.done ? "line-through" : "none" }}>{h.name}</p>
            <p style={{ color: C.orange, margin: 0, fontSize: 12 }}>🔥 {h.streak} day streak</p>
          </div>
          <button onClick={() => remove(h.id)} style={{ background: "none", border: "none", color: C.dim, cursor: "pointer", fontSize: 16 }}>✕</button>
        </Card>
      ))}
    </div>
  );
}

// WORKOUTS
function Workouts({ workouts, setWorkouts }) {
  const [active, setActive] = useState(null);
  const [newWorkoutName, setNewWorkoutName] = useState("");
  const [newExName, setNewExName] = useState("");
  const [newSets, setNewSets] = useState("3");
  const [newReps, setNewReps] = useState("10");
  const [newWeight, setNewWeight] = useState("0");

  const addWorkout = () => {
    if (!newWorkoutName.trim()) return;
    const w = { id: Date.now(), name: newWorkoutName, exercises: [] };
    setWorkouts([...workouts, w]);
    setNewWorkoutName("");
    setActive(w.id);
  };

  const addExercise = (wid) => {
    if (!newExName.trim()) return;
    setWorkouts(workouts.map(w => w.id === wid ? {
      ...w, exercises: [...w.exercises, { name: newExName, sets: +newSets, reps: +newReps, weight: +newWeight }]
    } : w));
    setNewExName("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h2 style={{ color: C.text, margin: 0, fontSize: 20, fontWeight: 800 }}>Workouts</h2>

      <Card>
        <p style={{ color: C.muted, fontSize: 12, fontWeight: 700, margin: "0 0 10px", textTransform: "uppercase" }}>New Routine</p>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={newWorkoutName} onChange={e => setNewWorkoutName(e.target.value)}
            placeholder="e.g. Leg Day"
            style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 12px", color: C.text, fontSize: 14, fontFamily: "inherit", outline: "none" }} />
          <Btn onClick={addWorkout}>Create</Btn>
        </div>
      </Card>

      {workouts.map(w => (
        <Card key={w.id}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
            <span style={{ color: C.text, fontWeight: 800, fontSize: 16, flex: 1 }}>💪 {w.name}</span>
            <button onClick={() => setActive(active === w.id ? null : w.id)}
              style={{ background: C.accent + "22", color: C.accentLight, border: `1px solid ${C.accent}44`, borderRadius: 8, padding: "4px 12px", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
              {active === w.id ? "Close" : "Open"}
            </button>
          </div>

          {w.exercises.map((ex, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderTop: `1px solid ${C.border}`, fontSize: 13 }}>
              <span style={{ color: C.text, flex: 1 }}>{ex.name}</span>
              <Badge color={C.accent}>{ex.sets}×{ex.reps}</Badge>
              {ex.weight > 0 && <Badge color={C.orange}>{ex.weight}kg</Badge>}
            </div>
          ))}

          {active === w.id && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
              <p style={{ color: C.muted, fontSize: 12, fontWeight: 700, margin: "0 0 8px", textTransform: "uppercase" }}>Add Exercise</p>
              <input value={newExName} onChange={e => setNewExName(e.target.value)} placeholder="Exercise name"
                style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 12px", color: C.text, fontSize: 14, fontFamily: "inherit", outline: "none", marginBottom: 8, boxSizing: "border-box" }} />
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                {[["Sets", newSets, setNewSets], ["Reps", newReps, setNewReps], ["kg", newWeight, setNewWeight]].map(([label, val, set]) => (
                  <div key={label} style={{ flex: 1 }}>
                    <p style={{ color: C.muted, fontSize: 11, margin: "0 0 4px" }}>{label}</p>
                    <input type="number" value={val} onChange={e => set(e.target.value)}
                      style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 10px", color: C.text, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
                  </div>
                ))}
              </div>
              <Btn onClick={() => addExercise(w.id)} style={{ width: "100%" }}>Add Exercise</Btn>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

// NUTRITION
function Nutrition({ meals, setMeals }) {
  const [name, setName] = useState("");
  const [cal, setCal] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  const totals = meals.reduce((a, m) => ({ cal: a.cal + m.cal, protein: a.protein + m.protein, carbs: a.carbs + m.carbs, fat: a.fat + m.fat }), { cal: 0, protein: 0, carbs: 0, fat: 0 });
  const goals = { cal: 2200, protein: 160, carbs: 250, fat: 70 };

  const add = () => {
    if (!name.trim() || !cal) return;
    setMeals([...meals, { id: Date.now(), name, cal: +cal, protein: +protein || 0, carbs: +carbs || 0, fat: +fat || 0 }]);
    setName(""); setCal(""); setProtein(""); setCarbs(""); setFat("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h2 style={{ color: C.text, margin: 0, fontSize: 20, fontWeight: 800 }}>Nutrition</h2>

      {/* Macro rings */}
      <Card>
        <p style={{ color: C.muted, fontSize: 12, fontWeight: 700, margin: "0 0 12px", textTransform: "uppercase" }}>Today's Macros</p>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {[
            { label: "Calories", val: totals.cal, goal: goals.cal, unit: "kcal", color: C.orange },
            { label: "Protein", val: totals.protein, goal: goals.protein, unit: "g", color: C.green },
            { label: "Carbs", val: totals.carbs, goal: goals.carbs, unit: "g", color: C.accent },
            { label: "Fat", val: totals.fat, goal: goals.fat, unit: "g", color: C.yellow },
          ].map(m => (
            <div key={m.label} style={{ textAlign: "center" }}>
              <RingProgress value={Math.min(m.val, m.goal)} max={m.goal} size={58} stroke={6} color={m.color}>
                <span style={{ fontSize: 10, color: C.text, fontWeight: 800 }}>{m.val}</span>
              </RingProgress>
              <p style={{ color: C.muted, fontSize: 11, margin: "6px 0 0" }}>{m.label}</p>
              <p style={{ color: m.color, fontSize: 11, margin: 0 }}>/{m.goal}{m.unit}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Log meal */}
      <Card>
        <p style={{ color: C.muted, fontSize: 12, fontWeight: 700, margin: "0 0 10px", textTransform: "uppercase" }}>Log Meal</p>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Meal name"
          style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 12px", color: C.text, fontSize: 14, fontFamily: "inherit", outline: "none", marginBottom: 8, boxSizing: "border-box" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
          {[["Calories (kcal)", cal, setCal], ["Protein (g)", protein, setProtein], ["Carbs (g)", carbs, setCarbs], ["Fat (g)", fat, setFat]].map(([label, val, set]) => (
            <div key={label}>
              <p style={{ color: C.muted, fontSize: 11, margin: "0 0 4px" }}>{label}</p>
              <input type="number" value={val} onChange={e => set(e.target.value)} placeholder="0"
                style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 10px", color: C.text, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
            </div>
          ))}
        </div>
        <Btn onClick={add} style={{ width: "100%" }}>Log Meal</Btn>
      </Card>

      {/* Meal list */}
      {meals.map(m => (
        <Card key={m.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>🍽️</span>
          <div style={{ flex: 1 }}>
            <p style={{ color: C.text, fontWeight: 700, margin: 0, fontSize: 14 }}>{m.name}</p>
            <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
              <Badge color={C.orange}>{m.cal} kcal</Badge>
              <Badge color={C.green}>{m.protein}g protein</Badge>
              <Badge color={C.accent}>{m.carbs}g carbs</Badge>
            </div>
          </div>
          <button onClick={() => setMeals(meals.filter(x => x.id !== m.id))}
            style={{ background: "none", border: "none", color: C.dim, cursor: "pointer", fontSize: 16 }}>✕</button>
        </Card>
      ))}
    </div>
  );
}

// FOCUS MODE
function Focus() {
  const [active, setActive] = useState(false);
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(null);
  const intervalRef = useRef(null);

  const start = () => {
    setSecondsLeft(minutes * 60);
    setActive(true);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    setActive(false);
    setSecondsLeft(null);
  };

  useEffect(() => {
    if (active && secondsLeft > 0) {
      intervalRef.current = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    } else if (secondsLeft === 0) {
      setActive(false);
    }
    return () => clearTimeout(intervalRef.current);
  }, [active, secondsLeft]);

  const pct = secondsLeft !== null ? ((minutes * 60 - secondsLeft) / (minutes * 60)) : 0;
  const mins = secondsLeft !== null ? Math.floor(secondsLeft / 60) : minutes;
  const secs = secondsLeft !== null ? secondsLeft % 60 : 0;
  const display = String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");

  const blockedApps = ["Instagram", "TikTok", "Twitter/X", "YouTube", "WhatsApp"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h2 style={{ color: C.text, margin: 0, fontSize: 20, fontWeight: 800 }}>Focus Mode</h2>

      <Card style={{ textAlign: "center", padding: 28 }}>
        <RingProgress value={pct * 100} max={100} size={140} stroke={10} color={active ? C.accent : C.dim}>
          <div>
            <p style={{ color: C.text, fontSize: 28, fontWeight: 900, margin: 0, fontVariantNumeric: "tabular-nums" }}>{display}</p>
            <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>{active ? "Focus on" : "Ready"}</p>
          </div>
        </RingProgress>

        {!active && (
          <div style={{ marginTop: 16 }}>
            <p style={{ color: C.muted, fontSize: 12, margin: "0 0 8px" }}>Session length (minutes)</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }}>
              {[15, 25, 45, 60].map(m => (
                <button key={m} onClick={() => setMinutes(m)} style={{
                  background: minutes === m ? C.accent : C.surface, color: minutes === m ? "#fff" : C.muted,
                  border: `1px solid ${minutes === m ? C.accent : C.border}`, borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 700
                }}>{m}</button>
              ))}
            </div>
            <Btn onClick={start} style={{ width: "100%" }}>Start Focus Session</Btn>
          </div>
        )}
        {active && <Btn onClick={stop} color={C.red} style={{ marginTop: 16, width: "100%" }}>End Session</Btn>}
      </Card>

      <Card>
        <p style={{ color: C.muted, fontSize: 12, fontWeight: 700, margin: "0 0 10px", textTransform: "uppercase" }}>Blocked During Focus</p>
        {blockedApps.map(app => (
          <div key={app} style={{ display: "flex", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
            <span style={{ flex: 1, color: C.text, fontSize: 14 }}>{app}</span>
            <Badge color={C.red}>Blocked</Badge>
          </div>
        ))}
      </Card>
    </div>
  );
}

// AI COACH
function Coach() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hey! I'm your Rizen Coach 💪 I'm here to help you stay consistent, hit your goals, and become the best version of yourself. What's on your mind?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: `You are Rizen Coach — a sharp, motivating, and direct AI personal coach inside the Rizen self-improvement app. You help users with fitness, nutrition, habits, focus, mindset, and accountability. Keep responses concise (2-4 sentences max unless the user asks for detail). Be real, warm, and energetic — like a great coach who actually cares. Use occasional emojis. Never be preachy. If the user asks something off-topic, gently redirect to self-improvement.`,
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Let's keep pushing! Ask me anything.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Connection issue — but don't let that stop your grind! Try again 💪" }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 0 }}>
      <h2 style={{ color: C.text, margin: "0 0 14px", fontSize: 20, fontWeight: 800 }}>AI Coach</h2>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, paddingBottom: 12, minHeight: 300, maxHeight: 420 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            {m.role === "assistant" && (
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, marginRight: 8, flexShrink: 0, alignSelf: "flex-end" }}>⚡</div>
            )}
            <div style={{
              maxWidth: "75%", background: m.role === "user" ? C.accent : C.card,
              border: `1px solid ${m.role === "user" ? C.accent : C.border}`,
              borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              padding: "10px 14px", color: C.text, fontSize: 14, lineHeight: 1.5
            }}>{m.content}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "18px 18px 18px 4px", padding: "10px 16px" }}>
              <span style={{ color: C.muted, fontSize: 20, letterSpacing: 4 }}>···</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        {["Motivate me 🔥", "Chest workout?", "What should I eat?", "Help me focus"].map(q => (
          <button key={q} onClick={() => setInput(q)}
            style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 99, padding: "5px 12px", color: C.muted, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{q}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask your coach..."
          style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "11px 14px", color: C.text, fontSize: 14, fontFamily: "inherit", outline: "none" }} />
        <button onClick={send} disabled={loading}
          style={{ background: C.accent, border: "none", borderRadius: 12, width: 46, cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", opacity: loading ? 0.5 : 1 }}>
          ↑
        </button>
      </div>
    </div>
  );
}

// PHYSIQUE / POSTURE
function Physique() {
  const [postureFeedback, setPostureFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoLog, setPhotoLog] = useState([
    { date: "Jun 1", weight: 72, note: "Starting point" },
    { date: "Jun 8", weight: 71.5, note: "Down 0.5kg" },
    { date: "Jun 15", weight: 70.8, note: "Feeling stronger" },
  ]);
  const [newWeight, setNewWeight] = useState("");
  const [newNote, setNewNote] = useState("");

  const checkPosture = async () => {
    setLoading(true);
    setPostureFeedback(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: "You are a posture and physique coach. Give a short, practical posture check routine (3-4 tips) to help someone assess and improve their posture right now, without a camera. Be direct and actionable.",
          messages: [{ role: "user", content: "Give me a posture check right now" }]
        })
      });
      const data = await res.json();
      setPostureFeedback(data.content?.[0]?.text || "Stand tall, shoulders back, chin neutral!");
    } catch {
      setPostureFeedback("Stand with your back against a wall. Your head, shoulders, and glutes should all touch. Hold for 30 seconds!");
    }
    setLoading(false);
  };

  const addLog = () => {
    if (!newWeight) return;
    const today = new Date().toLocaleDateString("en", { month: "short", day: "numeric" });
    setPhotoLog([...photoLog, { date: today, weight: +newWeight, note: newNote }]);
    setNewWeight(""); setNewNote("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h2 style={{ color: C.text, margin: 0, fontSize: 20, fontWeight: 800 }}>Physique & Posture</h2>

      {/* Posture check */}
      <Card>
        <p style={{ color: C.muted, fontSize: 12, fontWeight: 700, margin: "0 0 8px", textTransform: "uppercase" }}>AI Posture Check</p>
        <p style={{ color: C.muted, fontSize: 13, margin: "0 0 12px" }}>Get instant feedback on how to fix your posture right now.</p>
        {!postureFeedback && <Btn onClick={checkPosture} style={{ width: "100%" }}>{loading ? "Analyzing..." : "Check My Posture ⚡"}</Btn>}
        {postureFeedback && (
          <div>
            <div style={{ background: C.surface, borderRadius: 12, padding: 14, marginBottom: 10, color: C.text, fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
              {postureFeedback}
            </div>
            <Btn onClick={() => { setPostureFeedback(null); checkPosture(); }} small outline>Check Again</Btn>
          </div>
        )}
      </Card>

      {/* Weight log */}
      <Card>
        <p style={{ color: C.muted, fontSize: 12, fontWeight: 700, margin: "0 0 12px", textTransform: "uppercase" }}>Progress Log</p>

        {/* Mini chart */}
        <div style={{ height: 80, display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 12 }}>
          {photoLog.map((entry, i) => {
            const maxW = Math.max(...photoLog.map(e => e.weight));
            const minW = Math.min(...photoLog.map(e => e.weight));
            const pct = maxW === minW ? 0.8 : 0.2 + 0.7 * (1 - (entry.weight - minW) / (maxW - minW));
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <span style={{ color: C.text, fontSize: 10, fontWeight: 700 }}>{entry.weight}</span>
                <div style={{ width: "100%", height: 60 * pct, background: `linear-gradient(to top, ${C.accent}, ${C.accentLight})`, borderRadius: "6px 6px 0 0", minHeight: 8 }} />
                <span style={{ color: C.muted, fontSize: 10 }}>{entry.date}</span>
              </div>
            );
          })}
        </div>

        {photoLog.map((e, i) => (
          <div key={i} style={{ display: "flex", gap: 10, padding: "7px 0", borderTop: `1px solid ${C.border}`, fontSize: 13 }}>
            <span style={{ color: C.muted, width: 50 }}>{e.date}</span>
            <span style={{ color: C.text, fontWeight: 700 }}>{e.weight}kg</span>
            <span style={{ color: C.muted, flex: 1 }}>{e.note}</span>
          </div>
        ))}

        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <input type="number" value={newWeight} onChange={e => setNewWeight(e.target.value)} placeholder="Weight (kg)"
            style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 10px", color: C.text, fontSize: 13, fontFamily: "inherit", outline: "none" }} />
          <input value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Note"
            style={{ flex: 2, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 10px", color: C.text, fontSize: 13, fontFamily: "inherit", outline: "none" }} />
          <Btn onClick={addLog} small>Log</Btn>
        </div>
      </Card>
    </div>
  );
}

// SOCIAL / LEADERBOARD
function Social() {
  const [tab, setTab] = useState("leaderboard");
  const [challenges, setChallenges] = useState([
    { id: 1, name: "7-Day Streak Challenge", participants: 24, endsIn: "3 days", joined: true },
    { id: 2, name: "10K Steps Daily", participants: 47, endsIn: "5 days", joined: false },
    { id: 3, name: "No Sugar Week", participants: 18, endsIn: "2 days", joined: false },
  ]);

  const toggleJoin = (id) => {
    setChallenges(challenges.map(ch =>
      ch.id === id ? { ...ch, joined: !ch.joined, participants: ch.joined ? ch.participants - 1 : ch.participants + 1 } : ch
    ));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h2 style={{ color: C.text, margin: 0, fontSize: 20, fontWeight: 800 }}>Community</h2>

      <div style={{ display: "flex", gap: 8 }}>
        {["leaderboard", "challenges"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, background: tab === t ? C.accent : C.card, color: tab === t ? "#fff" : C.muted,
            border: `1px solid ${tab === t ? C.accent : C.border}`, borderRadius: 10, padding: "9px 0",
            cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 13, textTransform: "capitalize"
          }}>{t}</button>
        ))}
      </div>

      {tab === "leaderboard" && (
        <Card>
          {LEADERBOARD.map((u, i) => (
            <div key={u.rank} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 0",
              borderBottom: i < LEADERBOARD.length - 1 ? `1px solid ${C.border}` : "none",
              background: u.rank === 1 ? C.accent + "11" : "transparent", borderRadius: 8
            }}>
              <span style={{ color: u.rank <= 3 ? C.yellow : C.muted, fontWeight: 900, fontSize: 16, width: 24, textAlign: "center" }}>
                {u.rank === 1 ? "🥇" : u.rank === 2 ? "🥈" : u.rank === 3 ? "🥉" : u.rank}
              </span>
              <span style={{ fontSize: 22 }}>{u.avatar}</span>
              <span style={{ color: C.text, flex: 1, fontWeight: u.name === "You" ? 800 : 500 }}>{u.name}</span>
              <Badge color={u.rank === 1 ? C.yellow : C.accent}>{u.points} pts</Badge>
            </div>
          ))}
        </Card>
      )}

      {tab === "challenges" && challenges.map(ch => (
        <Card key={ch.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <p style={{ color: C.text, fontWeight: 700, margin: 0, fontSize: 15 }}>{ch.name}</p>
            {ch.joined && <Badge color={C.green}>Joined ✓</Badge>}
          </div>
          <p style={{ color: C.muted, fontSize: 13, margin: "0 0 10px" }}>👥 {ch.participants} participants · Ends in {ch.endsIn}</p>
          <Btn small onClick={() => toggleJoin(ch.id)} color={ch.joined ? C.red : C.accent} outline={ch.joined}>
            {ch.joined ? "Leave Challenge" : "Join Challenge"}
          </Btn>
        </Card>
      ))}
    </div>
  );
}

// ── ROOT APP ───────────────────────────────────────────────────
const TABS = [
  { id: "home", label: "Home", icon: "⚡" },
  { id: "habits", label: "Habits", icon: "✅" },
  { id: "workouts", label: "Workout", icon: "💪" },
  { id: "nutrition", label: "Nutrition", icon: "🥗" },
  { id: "physique", label: "Physique", icon: "📸" },
  { id: "focus", label: "Focus", icon: "🎯" },
  { id: "coach", label: "Coach", icon: "🤖" },
  { id: "social", label: "Social", icon: "👥" },
];

export default function App() {
  const [tab, setTab] = useState("home");
  const [habits, setHabits] = useState(INITIAL_HABITS);
  const [workouts, setWorkouts] = useState(INITIAL_WORKOUTS);
  const [meals, setMeals] = useState(INITIAL_MEALS);
  const [trialDays] = useState(7);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif", color: C.text, display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
          <span style={{ fontWeight: 900, fontSize: 20, background: `linear-gradient(90deg, ${C.accentLight}, ${C.text})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Rizen</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Badge color={C.green}>🎉 {trialDays} days free</Badge>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.accent + "33", border: `2px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🧑‍💻</div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 16, overflowY: "auto", paddingBottom: 90 }}>
        {tab === "home" && <Home habits={habits} meals={meals} workouts={workouts} />}
        {tab === "habits" && <Habits habits={habits} setHabits={setHabits} />}
        {tab === "workouts" && <Workouts workouts={workouts} setWorkouts={setWorkouts} />}
        {tab === "nutrition" && <Nutrition meals={meals} setMeals={setMeals} />}
        {tab === "physique" && <Physique />}
        {tab === "focus" && <Focus />}
        {tab === "coach" && <Coach />}
        {tab === "social" && <Social />}
      </div>

      {/* Bottom nav */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480,
        background: C.surface, borderTop: `1px solid ${C.border}`, display: "flex", zIndex: 50
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            padding: "8px 0", background: "none", border: "none", cursor: "pointer",
            borderTop: `2px solid ${tab === t.id ? C.accent : "transparent"}`,
            transition: "border-color 0.15s"
          }}>
            <span style={{ fontSize: 16 }}>{t.icon}</span>
            <span style={{ fontSize: 9, color: tab === t.id ? C.accentLight : C.dim, fontWeight: tab === t.id ? 700 : 400 }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
