import React, { useState } from "react";

export default function Auth({ apiUrl, onLoggedIn }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [name, setName] = useState("Salma");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      if (mode === "register") {
        const r = await fetch(`${apiUrl}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "Register failed");
      }

      const r2 = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const d2 = await r2.json();
      if (!r2.ok) throw new Error(d2.error || "Login failed");

      localStorage.setItem("lp_token", d2.token);
      onLoggedIn(d2.user);
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <div className="auth-card">
      <div className="tabs">
        <button
          className={`tab ${mode === "login" ? "active" : ""}`}
          onClick={() => setMode("login")}
        >
          Log in
        </button>
        <button
          className={`tab ${mode === "register" ? "active" : ""}`}
          onClick={() => setMode("register")}
        >
          Create account
        </button>
      </div>

      <form className="form" onSubmit={submit}>
        {mode === "register" && (
          <>
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </>
        )}
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button className="btn primary" type="submit">
          {mode === "login" ? "Log in" : "Create account"}
        </button>

        {msg && <p className="error tiny">{msg}</p>}
      </form>
    </div>
  );
}
