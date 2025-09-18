from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

DB = "applications.db"  # reuse your file

def db_conn():
    return sqlite3.connect(DB)

def init_db():
    conn = db_conn()
    c = conn.cursor()
    # users
    c.execute("""
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
    """)
    # (optional) progress
    c.execute("""
    CREATE TABLE IF NOT EXISTS progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      exercise_id TEXT NOT NULL,
      is_done INTEGER DEFAULT 0,
      updated_at TEXT DEFAULT (datetime('now')),
      UNIQUE(user_id, exercise_id)
    )
    """)
    conn.commit()
    conn.close()

init_db()

def row_to_user(row):
    if not row: return None
    return {"id": row[0], "name": row[1], "email": row[2], "created_at": row[4]}

@app.get("/health")
def health():
    return jsonify({"status": "ok"})

# -------- AUTH ---------

@app.post("/api/auth/register")
def register():
    data = request.json or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not name or not email or not password:
        return jsonify({"error": "Name, email, and password are required"}), 400

    pwh = generate_password_hash(password)
    conn = db_conn()
    c = conn.cursor()
    try:
        c.execute("INSERT INTO users(name, email, password_hash) VALUES (?,?,?)",
                  (name, email, pwh))
        conn.commit()
        user_id = c.lastrowid
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({"error": "Email already registered"}), 409
    conn.close()
    return jsonify({"ok": True, "user": {"id": user_id, "name": name, "email": email}}), 201

@app.post("/api/auth/login")
def login():
    data = request.json or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    conn = db_conn()
    c = conn.cursor()
    c.execute("SELECT id, name, email, password_hash, created_at FROM users WHERE email = ?", (email,))
    row = c.fetchone()
    conn.close()
    if not row or not check_password_hash(row[3], password):
        return jsonify({"error": "Invalid credentials"}), 401

    # Simple demo token: just the user id as string.
    token = str(row[0])
    return jsonify({"ok": True, "token": token, "user": row_to_user(row)})

@app.get("/api/me")
def me():
    # Demo auth: Authorization: Bearer <user_id>
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return jsonify({"error": "No token"}), 401
    user_id = auth.split(" ", 1)[1]
    conn = db_conn()
    c = conn.cursor()
    c.execute("SELECT id, name, email, password_hash, created_at FROM users WHERE id = ?", (user_id,))
    row = c.fetchone()
    conn.close()
    if not row:
        return jsonify({"error": "Invalid token"}), 401
    return jsonify({"user": row_to_user(row)})

# -------- Exercises (optional progress) ---------

@app.post("/api/progress")
def set_progress():
    data = request.json or {}
    exercise_id = data.get("exercise_id")
    is_done = 1 if data.get("is_done") else 0
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return jsonify({"error": "No token"}), 401
    user_id = auth.split(" ", 1)[1]

    if not exercise_id:
        return jsonify({"error": "exercise_id required"}), 400

    conn = db_conn()
    c = conn.cursor()
    c.execute("""
      INSERT INTO progress(user_id, exercise_id, is_done, updated_at)
      VALUES(?,?,?,?)
      ON CONFLICT(user_id, exercise_id) DO UPDATE SET
        is_done=excluded.is_done, updated_at=excluded.updated_at
    """, (user_id, exercise_id, is_done, datetime.utcnow().isoformat()))
    conn.commit()
    conn.close()
    return jsonify({"ok": True})

@app.get("/api/progress")
def get_progress():
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return jsonify({"error": "No token"}), 401
    user_id = auth.split(" ", 1)[1]

    conn = db_conn()
    c = conn.cursor()
    c.execute("SELECT exercise_id, is_done FROM progress WHERE user_id = ?", (user_id,))
    rows = c.fetchall()
    conn.close()
    return jsonify({eid: bool(done) for (eid, done) in rows})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
