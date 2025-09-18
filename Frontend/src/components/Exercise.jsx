import React, { useState } from "react";

export default function Exercise({ lesson, onPassed }) {
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");

  const check = () => {
    const ok = lesson.check(code.trim());
    setResult(ok ? "Correct. Nice work, Salma." : "Not quite. Check the hint and try again.");
    if (ok) onPassed(lesson.exerciseId);
  };

  return (
    <div className="exercise">
      <h2>{lesson.title}</h2>
      <p className="muted">{lesson.summary}</p>

      <h3>Example</h3>
      <pre className="code"><code>{lesson.example}</code></pre>

      <h3>Exercise</h3>
      <p>{lesson.prompt}</p>
      <textarea
        rows={8}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write your Python solution here…"
      />
      <div className="actions">
        <button className="btn primary" onClick={check}>Check answer</button>
        <button className="btn" onClick={() => setCode(lesson.hint)}>Show hint</button>
      </div>

      {result && <p className={`feedback ${result.startsWith("Correct") ? "ok" : "bad"}`}>{result}</p>}
    </div>
  );
}

