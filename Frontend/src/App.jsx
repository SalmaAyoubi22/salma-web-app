import React, { useEffect, useMemo, useState } from "react";
import Auth from "./components/Auth";
import LessonList from "./components/LessonList";
import Exercise from "./components/Exercise";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

/* ---------- Curriculum (Salma) ---------- */
export const LESSONS = [
  {
    id: "intro",
    title: "1) First Run",
    summary: "Create your first file and run it from the terminal.",
    example: `# hello.py
print("Hello, Salma!")

# Run it:
# python hello.py`,
    prompt: "Write code that prints exactly: Hello, Salma!",
    hint: `print("Hello, Salma!")`,
    check: (t) =>
      t.trim() === 'print("Hello, Salma!")' ||
      t.trim() === "print('Hello, Salma!')",
    exerciseId: "ex-hello",
  },
  {
    id: "variables",
    title: "2) Variables & Types",
    summary: "Numbers, strings, booleans and printing values.",
    example: `age = 21
name = "Salma"
is_student = True
print(name, age, is_student)`,
    prompt:
      "Create name='Salma' and age=21, then print them together in one print().",
    hint: `name="Salma"\nage=21\nprint(name, age)`,
    check: (t) =>
      /name\s*=\s*["']Salma["']/.test(t) &&
      /age\s*=\s*21/.test(t) &&
      /print\s*\(\s*name\s*,\s*age\s*\)/.test(t),
    exerciseId: "ex-vars",
  },
  {
    id: "control",
    title: "3) If & Loops",
    summary: "Branching with if/elif/else and looping with range().",
    example: `score = 88
if score >= 80:
    print("Great job, Salma!")

for i in range(3):
    print("Loop", i)`,
    prompt: "Write a for loop that prints 0, 1 and 2 (one per line).",
    hint: `for i in range(3):\n    print(i)`,
    check: (t) => /for\s+\w+\s+in\s+range\(\s*3\s*\)\s*:\s*[\s\S]*print\(/.test(t),
    exerciseId: "ex-loop",
  },
  {
    id: "collections",
    title: "4) Lists & Dicts",
    summary: "Store multiple values and map keys to values.",
    example: `skills = ["python", "apis", "testing"]
profile = {"name": "Salma", "city": "Kokkola"}
profile["skills"] = skills
print(profile)`,
    prompt:
      "Create skills=['python','ml'] and profile={'name':'Salma'}. Put skills into profile['skills'].",
    hint: `skills=["python","ml"]
profile={"name":"Salma"}
profile["skills"]=skills`,
    check: (t) =>
      /skills\s*=\s*\[.*["']python["'].*\]/s.test(t) &&
      /skills\s*=\s*\[.*["']ml["'].*\]/s.test(t) &&
      /profile\s*=\s*\{.*["']name["']\s*:\s*["']Salma["'].*\}/s.test(t) &&
      /profile\[\s*["']skills["']\s*\]\s*=\s*skills/.test(t),
    exerciseId: "ex-collections",
  },
  {
    id: "functions",
    title: "5) Functions & Return",
    summary: "Define functions and return results.",
    example: `def greet(name: str) -> str:
    return f"Hello, {name}!"

print(greet("Salma"))`,
    prompt:
      "Write greet(name) that returns 'Hello, <name>!' and print greet('Salma').",
    hint: `def greet(name):
    return f"Hello, {name}!"
print(greet("Salma"))`,
    check: (t) =>
      /def\s+greet\s*\(\s*name\s*\)\s*:/.test(t) &&
      /(return\s+f?["']Hello,\s*\{?name\}?!["'])/.test(t) &&
      /print\s*\(\s*greet\s*\(\s*["']Salma["']\s*\)\s*\)/.test(t),
    exerciseId: "ex-func",
  },
  {
    id: "files",
    title: "6) Files & Errors",
    summary: "Write and read files; handle missing files safely.",
    example: `from pathlib import Path

p = Path("notes.txt")
p.write_text("Hello, Salma!\\n")

try:
    print(p.read_text())
except FileNotFoundError:
    print("File not found")`,
    prompt:
      "Using pathlib, write 'Hello, Salma!' to notes.txt then read it and print its content.",
    hint: `from pathlib import Path
p=Path("notes.txt")
p.write_text("Hello, Salma!\\n")
print(p.read_text())`,
    check: (t) =>
      /from\s+pathlib\s+import\s+Path/.test(t) &&
      /Path\(\s*["']notes\.txt["']\s*\)/.test(t) &&
      /\.write_text\(\s*["']Hello,\s*Salma!\\n?["']\s*\)/.test(t) &&
      /\.read_text\(\)/.test(t) &&
      /print\(/.test(t),
    exerciseId: "ex-files",
  },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState({});
  const [activeId, setActiveId] = useState(LESSONS[0].id);

  // Restore login + progress
  useEffect(() => {
    const tok = localStorage.getItem("lp_token");
    if (!tok) return;
    fetch(`${API_URL}/api/me`, { headers: { Authorization: `Bearer ${tok}` } })
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setUser(d.user);
          return fetch(`${API_URL}/api/progress`, {
            headers: { Authorization: `Bearer ${tok}` },
          });
        } else {
          localStorage.removeItem("lp_token");
        }
      })
      .then((r) => r && r.json())
      .then((p) => p && setProgress(p))
      .catch(() => {});
  }, []);

  const activeLesson = useMemo(
    () => LESSONS.find((l) => l.id === activeId),
    [activeId]
  );

  const onPassed = async (exerciseId) => {
    setProgress((p) => ({ ...p, [exerciseId]: true }));
    const tok = localStorage.getItem("lp_token");
    if (!tok) return;
    try {
      await fetch(`${API_URL}/api/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tok}`,
        },
        body: JSON.stringify({ exercise_id: exerciseId, is_done: true }),
      });
    } catch {}
  };

  const logout = () => {
    localStorage.removeItem("lp_token");
    setUser(null);
    setProgress({});
    setActiveId(LESSONS[0].id);
  };

  if (!user) {
    return (
      <div className="auth-page">
        <div className="brand">
          <div className="logo">Py</div>
          <div className="brand-text">
            <h1>Learn Python</h1>
            <p className="muted">Beautiful, simple lessons. Examples use Salma.</p>
          </div>
        </div>
        <Auth apiUrl={API_URL} onLoggedIn={setUser} />
      </div>
    );
  }

  return (
    <div className="app-shell">
      {/* Top bar with Logout */}
      <header
        style={{
          gridColumn: "1 / -1",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="logo small">Py</div>
          <div className="title">Learn Python</div>
        </div>
        <button className="btn primary" onClick={logout}>
          Log out
        </button>
      </header>

      <aside className="sidebar">
        <div className="sidebar-header">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="logo small">Py</div>
            <div className="title">Chapters</div>
          </div>
          {/* removed "Hi, Salma" line */}
        </div>
        <LessonList
          items={LESSONS}
          activeId={activeId}
          onSelect={setActiveId}
          progress={progress}
        />
      </aside>

      <main className="main">
        <Exercise lesson={activeLesson} onPassed={onPassed} />
      </main>
    </div>
  );
}
