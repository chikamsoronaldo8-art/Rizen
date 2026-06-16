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
  const display = secondsLeft !== null
    ? `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:$
