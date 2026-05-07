/* ============================================================
   KIU-Learners Pace — app.js
   Firebase Firestore backend — cross-device, cross-browser
   Admin sees ALL students from any device/location
   ============================================================ */

/* ── CONSTANTS ── */
const ADMIN_CREDS  = { username: "kiu.admin", password: "KIU@Admin2025!" };
const SESSION_KEY  = "kiu_session_v3";   // localStorage: current logged-in user only
const DEMO_KEY     = "kiu_demo_v3";      // localStorage: fallback when Firebase not configured

/* ── FIREBASE STATE ── */
let db        = null;
let FB_READY  = false;
let DEMO_MODE = false;   // true when Firebase config not yet filled in

/* ── APP STATE ── */
let APP = {
  currentUser:   null,
  isAdmin:       false,
  currentModule: null,
  currentQIndex: 0,
  quizAnswers:   [],
};

/* ─────────────────────────────────────────────
   FIREBASE INIT
───────────────────────────────────────────── */
function initFirebase() {
  const cfg = window.KIU_FIREBASE_CONFIG || {};
  const isPlaceholder = !cfg.apiKey || cfg.apiKey.includes("PASTE_YOUR");

  if (isPlaceholder) {
    DEMO_MODE = true;
    console.warn("[KIU-LMS] Firebase not configured — running in Demo Mode (localStorage only).");
    return;
  }

  try {
    if (!firebase.apps.length) firebase.initializeApp(cfg);
    db = firebase.firestore();
    FB_READY = true;
    console.info("[KIU-LMS] Firebase Firestore connected ✅");
  } catch (err) {
    DEMO_MODE = true;
    console.error("[KIU-LMS] Firebase init failed — Demo Mode:", err);
  }
}

/* ─────────────────────────────────────────────
   FIRESTORE HELPERS
   All reads/writes go through these.
   Falls back to localStorage in Demo Mode.
───────────────────────────────────────────── */

/** Get demo DB from localStorage */
function demoGetDB() {
  try { return JSON.parse(localStorage.getItem(DEMO_KEY)) || { students: {}, logs: [] }; }
  catch { return { students: {}, logs: [] }; }
}
function demoSaveDB(d) { localStorage.setItem(DEMO_KEY, JSON.stringify(d)); }

/** Fetch one student document */
async function fsGetStudent(sid) {
  if (!FB_READY) {
    const d = demoGetDB();
    return d.students[sid.toLowerCase()] || null;
  }
  const snap = await db.collection("students").doc(sid.toLowerCase()).get();
  return snap.exists ? snap.data() : null;
}

/** Save / merge student document */
async function fsSaveStudent(sid, data) {
  if (!FB_READY) {
    const d = demoGetDB();
    d.students[sid.toLowerCase()] = { ...(d.students[sid.toLowerCase()] || {}), ...data };
    demoSaveDB(d);
    return;
  }
  await db.collection("students").doc(sid.toLowerCase()).set(data, { merge: true });
}

/** Fetch ALL students (admin only) */
async function fsGetAllStudents() {
  if (!FB_READY) {
    const d = demoGetDB();
    return Object.values(d.students);
  }
  const snap = await db.collection("students").orderBy("registeredAt", "desc").get();
  return snap.docs.map(d => d.data());
}

/** Save a log entry */
async function fsAddLog(entry) {
  const logEntry = { ...entry, ts: new Date().toISOString() };
  if (!FB_READY) {
    const d = demoGetDB();
    d.logs.unshift(logEntry);
    if (d.logs.length > 3000) d.logs.length = 3000;
    demoSaveDB(d);
    return;
  }
  await db.collection("logs").add(logEntry);
}

/** Fetch recent logs (admin only) */
async function fsGetLogs(limit = 100) {
  if (!FB_READY) {
    const d = demoGetDB();
    return d.logs.slice(0, limit);
  }
  const snap = await db.collection("logs")
    .orderBy("ts", "desc")
    .limit(limit)
    .get();
  return snap.docs.map(d => d.data());
}

/** Clear all logs (admin) */
async function fsClearLogs() {
  if (!FB_READY) {
    const d = demoGetDB(); d.logs = []; demoSaveDB(d); return;
  }
  const snap = await db.collection("logs").limit(500).get();
  const batch = db.batch();
  snap.docs.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
}

/* Shortcut helpers for progress inside student doc */
function getModProg(studentData, moduleId) {
  return (studentData.progress || {})[`mod_${moduleId}`] || { status: "locked", score: null, pass: false };
}
function setModProg(studentData, moduleId, data) {
  if (!studentData.progress) studentData.progress = {};
  studentData.progress[`mod_${moduleId}`] = {
    ...(studentData.progress[`mod_${moduleId}`] || {}),
    ...data
  };
}

/* ─────────────────────────────────────────────
   SESSION (current device only)
───────────────────────────────────────────── */
function saveSession(user) { localStorage.setItem(SESSION_KEY, JSON.stringify(user)); }
function clearSession()    { localStorage.removeItem(SESSION_KEY); }
function loadSession()     { try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; } }

/* ─────────────────────────────────────────────
   DOM HELPERS
───────────────────────────────────────────── */
function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") e.className = v;
    else if (k === "style") e.style.cssText = v;
    else if (k.startsWith("on") && typeof v === "function") e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  children.forEach(c => {
    if (c == null) return;
    if (typeof c === "string") e.insertAdjacentHTML("beforeend", c);
    else e.appendChild(c);
  });
  return e;
}
function render(view) {
  const app = document.getElementById("app");
  app.innerHTML = "";
  app.appendChild(view);
}

/* ─────────────────────────────────────────────
   TOAST
───────────────────────────────────────────── */
function toast(msg, type = "success") {
  let wrap = document.getElementById("kiu-toast-wrap");
  if (!wrap) {
    wrap = el("div", { id: "kiu-toast-wrap", class: "toast-wrap" });
    document.body.appendChild(wrap);
  }
  const icons = { success: "✅", error: "❌", info: "ℹ️", warn: "⚠️" };
  const t = el("div", { class: `toast ${type}` }, `${icons[type] || ""} ${msg}`);
  wrap.appendChild(t);
  setTimeout(() => { t.classList.add("removing"); setTimeout(() => t.remove(), 350); }, 3400);
}

/* ─────────────────────────────────────────────
   LOADING OVERLAY
───────────────────────────────────────────── */
function showLoading(msg = "Loading…") {
  let ov = document.getElementById("kiu-loading");
  if (!ov) {
    ov = el("div", { id: "kiu-loading", style: "position:fixed;inset:0;z-index:9999;background:rgba(10,40,20,.65);backdrop-filter:blur(4px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;" });
    ov.innerHTML = `<div style="width:48px;height:48px;border:4px solid rgba(255,255,255,.2);border-top-color:#4cc87a;border-radius:50%;animation:spin .8s linear infinite;"></div><p style="color:white;font-family:var(--font-body);font-size:.95rem;" id="kiu-load-msg">${msg}</p>`;
    if (!document.getElementById("kiu-spin-style")) {
      const s = document.createElement("style");
      s.id = "kiu-spin-style";
      s.textContent = "@keyframes spin{to{transform:rotate(360deg)}}";
      document.head.appendChild(s);
    }
    document.body.appendChild(ov);
  } else {
    const m = ov.querySelector("#kiu-load-msg");
    if (m) m.textContent = msg;
  }
}
function hideLoading() {
  const ov = document.getElementById("kiu-loading");
  if (ov) ov.remove();
}

/* ─────────────────────────────────────────────
   TOPBAR
───────────────────────────────────────────── */
function buildTopbar(userName, isAdmin) {
  const initials = isAdmin ? "AD" : userName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const topbar = el("nav", { class: "topbar" });
  topbar.innerHTML = `
    <div class="topbar-brand">
      <img src="assets/kiu-logo.jpg" class="topbar-logo" alt="KIU Logo">
      <div class="topbar-title">KIU-Learners Pace<span>Kampala International University</span></div>
    </div>
    <div class="topbar-right">
      ${DEMO_MODE ? `<span style="background:#d4a017;color:#3a2800;font-size:.72rem;font-weight:700;padding:3px 10px;border-radius:99px;letter-spacing:.04em;">⚠ DEMO MODE</span>` : `<span style="background:rgba(76,200,122,.15);color:#4cc87a;font-size:.72rem;font-weight:700;padding:3px 10px;border-radius:99px;letter-spacing:.04em;">🟢 LIVE</span>`}
      <div class="topbar-user">
        <div class="avatar">${initials}</div>
        <span style="color:rgba(255,255,255,.85);font-size:.88rem;">${isAdmin ? "Administrator" : userName}</span>
      </div>
      <button class="btn btn-outline" id="logout-btn">Sign Out</button>
    </div>`;
  topbar.querySelector("#logout-btn").onclick = logout;
  return topbar;
}

/* ─────────────────────────────────────────────
   FIREBASE SETUP SCREEN
───────────────────────────────────────────── */
function showSetupScreen() {
  const page = el("div");
  page.innerHTML = `
  <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(145deg,var(--kiu-green-deep),var(--kiu-green));padding:24px;">
    <div style="background:white;border-radius:var(--radius-xl);padding:48px 44px;max-width:560px;width:100%;box-shadow:var(--shadow-lg);animation:fadeUp .5s ease both;">
      <div style="text-align:center;margin-bottom:32px;">
        <img src="assets/kiu-logo.jpg" style="width:90px;border-radius:10px;margin-bottom:16px;">
        <h1 style="font-family:var(--font-display);font-size:1.7rem;color:var(--kiu-green-deep);">Firebase Setup Required</h1>
        <p style="color:var(--text-muted);margin-top:6px;font-size:.92rem;">To store student data centrally (visible from any device), connect a free Firebase project.</p>
      </div>

      <div style="background:var(--kiu-green-pale);border-radius:var(--radius-md);padding:20px 22px;margin-bottom:24px;">
        <p style="font-weight:700;color:var(--kiu-green-deep);margin-bottom:12px;">📋 One-time setup steps:</p>
        <ol style="font-size:.88rem;color:var(--text-mid);line-height:1.9;padding-left:18px;">
          <li>Go to <a href="https://console.firebase.google.com" target="_blank" style="color:var(--kiu-green);font-weight:600;">console.firebase.google.com</a></li>
          <li>Click <strong>"Add project"</strong> → name it <em>kiu-lms</em> → Create</li>
          <li>Click the <strong>&lt;/&gt;</strong> (Web) icon → Register app → Copy the config</li>
          <li>Open <code style="background:white;padding:2px 6px;border-radius:4px;font-size:.85em;">js/firebase-config.js</code> and paste your values</li>
          <li>In Firebase: <strong>Build → Firestore Database → Create</strong> (Test mode)</li>
          <li>Paste the security rules shown in firebase-config.js → Publish</li>
          <li>Reload this page</li>
        </ol>
      </div>

      <div style="background:#fff8e1;border:1.5px solid #f5c842;border-radius:var(--radius-md);padding:16px 20px;margin-bottom:24px;">
        <p style="font-size:.85rem;color:#7a5c00;font-weight:600;">⚡ Firebase Free Tier is more than enough:</p>
        <p style="font-size:.82rem;color:#9a7000;margin-top:4px;">50,000 reads/day · 20,000 writes/day · 1 GB storage · No credit card needed</p>
      </div>

      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        <a href="https://console.firebase.google.com" target="_blank" class="btn btn-primary btn-lg" style="flex:1;justify-content:center;">Open Firebase Console ↗</a>
        <button class="btn btn-green btn-lg" id="demo-btn" style="flex:1;">Use Demo Mode</button>
      </div>
      <p style="text-align:center;font-size:.78rem;color:var(--text-muted);margin-top:14px;">Demo Mode stores data locally on this device only — admin won't see other devices' students.</p>
    </div>
  </div>`;
  page.querySelector("#demo-btn").onclick = () => { DEMO_MODE = true; showLogin(); };
  render(page);
}

/* ─────────────────────────────────────────────
   LOGIN PAGE
───────────────────────────────────────────── */
function showLogin() {
  const page = el("div");
  page.innerHTML = `
  <div class="login-page" style="min-height:100vh;">
    <div class="login-hero">
      <img src="assets/kiu-logo.jpg" class="login-hero-logo" alt="KIU Logo">
      <h1 class="login-hero-title">KIU-Learners&nbsp;Pace</h1>
      <p class="login-hero-sub">Your gateway to quality computing education at Kampala International University</p>
      <div class="login-hero-badges">
        <span class="badge">📚 5 Modules</span>
        <span class="badge">🎯 Interactive Quizzes</span>
        <span class="badge badge-gold">🏆 Track Progress</span>
        <span class="badge">🌐 ICT 1101</span>
      </div>
      ${DEMO_MODE ? `<div style="background:rgba(212,160,23,.25);border:1px solid var(--kiu-gold);border-radius:var(--radius-sm);padding:10px 16px;max-width:320px;text-align:center;margin-top:8px;"><p style="color:var(--kiu-gold-light);font-size:.8rem;font-weight:600;">⚠ Running in Demo Mode — data stored locally only.<br>Configure Firebase for cross-device access.</p></div>` : `<div style="background:rgba(76,200,122,.15);border:1px solid rgba(76,200,122,.4);border-radius:var(--radius-sm);padding:8px 16px;"><p style="color:#4cc87a;font-size:.8rem;font-weight:600;">🟢 Connected to Cloud Database</p></div>`}
    </div>
    <div class="login-panel">
      <div class="login-card">
        <div class="login-card-header">
          <h2>Welcome Back</h2>
          <p>Sign in to continue your learning journey</p>
        </div>
        <div class="tab-row">
          <button class="tab-btn active" id="tab-student">🎓 Student</button>
          <button class="tab-btn" id="tab-admin">🔑 Admin</button>
        </div>
        <div id="form-error" class="form-error"></div>
        <div id="student-form">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input class="form-input" id="stu-name" type="text" placeholder="e.g. Nakato Sarah" maxlength="60" autocomplete="name">
          </div>
          <div class="form-group">
            <label class="form-label">Student Number</label>
            <input class="form-input" id="stu-id" type="text" placeholder="e.g. KIU/2024/001" maxlength="30" autocomplete="username">
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input class="form-input" id="stu-pass" type="password" placeholder="Create or enter your password" autocomplete="current-password">
          </div>
          <button class="btn btn-primary btn-block btn-lg" id="stu-login-btn" style="margin-top:8px;">Start Learning →</button>
        </div>
        <div id="admin-form" class="hidden">
          <div class="form-group">
            <label class="form-label">Admin Username</label>
            <input class="form-input" id="adm-user" type="text" placeholder="kiu.admin" autocomplete="username">
          </div>
          <div class="form-group">
            <label class="form-label">Admin Password</label>
            <input class="form-input" id="adm-pass" type="password" placeholder="Enter admin password" autocomplete="current-password">
          </div>
          <button class="btn btn-primary btn-block btn-lg" id="adm-login-btn" style="margin-top:8px;">Access Dashboard →</button>
        </div>
        <div class="divider"></div>
        <p style="text-align:center;font-size:.78rem;color:var(--text-muted);">Introduction to Computing — ICT 1101 &nbsp;|&nbsp; © 2025 KIU</p>
      </div>
    </div>
  </div>`;

  const errBox  = page.querySelector("#form-error");
  const tabStu  = page.querySelector("#tab-student");
  const tabAdm  = page.querySelector("#tab-admin");
  const stuForm = page.querySelector("#student-form");
  const admForm = page.querySelector("#admin-form");

  const showErr  = msg => { errBox.textContent = msg; errBox.classList.add("show"); };
  const hideErr  = ()  => errBox.classList.remove("show");

  tabStu.onclick = () => { tabStu.classList.add("active"); tabAdm.classList.remove("active"); stuForm.classList.remove("hidden"); admForm.classList.add("hidden"); hideErr(); };
  tabAdm.onclick = () => { tabAdm.classList.add("active"); tabStu.classList.remove("active"); admForm.classList.remove("hidden"); stuForm.classList.add("hidden"); hideErr(); };

  /* ── STUDENT LOGIN ── */
  page.querySelector("#stu-login-btn").onclick = async () => {
    const name = page.querySelector("#stu-name").value.trim();
    const sid  = page.querySelector("#stu-id").value.trim().toUpperCase();
    const pass = page.querySelector("#stu-pass").value;
    if (!name || !sid || !pass) { showErr("Please fill in all fields."); return; }
    if (name.length < 3)         { showErr("Please enter your full name."); return; }
    if (pass.length < 4)         { showErr("Password must be at least 4 characters."); return; }

    showLoading("Signing in…");
    try {
      const existing = await fsGetStudent(sid);
      const pHash = btoa(encodeURIComponent(pass));

      if (existing) {
        if (existing.passwordHash !== pHash) { hideLoading(); showErr("Incorrect password for this student number."); return; }
        if (existing.name.toLowerCase() !== name.toLowerCase()) { hideLoading(); showErr("Name does not match this student number."); return; }
      } else {
        // New registration
        const newStudent = {
          name, sid,
          passwordHash: pHash,
          registeredAt: new Date().toISOString(),
          progress: { mod_1: { status: "unlocked" } }
        };
        await fsSaveStudent(sid, newStudent);
        await fsAddLog({ type: "registration", user: name, sid, message: `${name} (${sid}) registered.` });
      }
      await fsAddLog({ type: "login", user: name, sid, message: `${name} (${sid}) signed in.` });
      APP.currentUser = { name, sid };
      APP.isAdmin = false;
      saveSession({ name, sid, isAdmin: false });
      hideLoading();
      showDashboard();
    } catch (err) {
      hideLoading();
      console.error(err);
      showErr("Connection error. Check your internet connection and try again.");
    }
  };

  /* ── ADMIN LOGIN ── */
  page.querySelector("#adm-login-btn").onclick = async () => {
    const u = page.querySelector("#adm-user").value.trim();
    const p = page.querySelector("#adm-pass").value;
    if (u !== ADMIN_CREDS.username || p !== ADMIN_CREDS.password) { showErr("Invalid administrator credentials."); return; }
    showLoading("Loading admin dashboard…");
    await fsAddLog({ type: "admin_login", user: "Administrator", message: "Admin signed in." });
    APP.isAdmin = true;
    APP.currentUser = { name: "Administrator", sid: "admin" };
    saveSession({ name: "Administrator", sid: "admin", isAdmin: true });
    hideLoading();
    showAdminDashboard();
  };

  ["stu-name","stu-id","stu-pass"].forEach(id => page.querySelector(`#${id}`).addEventListener("keydown", e => { if (e.key === "Enter") page.querySelector("#stu-login-btn").click(); }));
  ["adm-user","adm-pass"].forEach(id => page.querySelector(`#${id}`).addEventListener("keydown", e => { if (e.key === "Enter") page.querySelector("#adm-login-btn").click(); }));

  render(page);
}

function logout() {
  if (APP.currentUser) fsAddLog({ type: "logout", user: APP.currentUser.name, sid: APP.currentUser.sid, message: `${APP.currentUser.name} signed out.` });
  APP = { currentUser: null, isAdmin: false, currentModule: null, currentQIndex: 0, quizAnswers: [] };
  clearSession();
  showLogin();
}

/* ─────────────────────────────────────────────
   STUDENT DASHBOARD
───────────────────────────────────────────── */
async function showDashboard() {
  showLoading("Loading your progress…");
  const { name, sid } = APP.currentUser;
  const modules = window.COURSE.modules;

  let studentData;
  try {
    studentData = await fsGetStudent(sid) || { progress: { mod_1: { status: "unlocked" } } };
  } catch { studentData = { progress: { mod_1: { status: "unlocked" } } }; }

  hideLoading();

  let doneCount = 0;
  modules.forEach(m => { if (getModProg(studentData, m.id).status === "completed") doneCount++; });
  const pct = Math.round((doneCount / modules.length) * 100);

  const wrap = el("div");
  wrap.appendChild(buildTopbar(name, false));
  const pageWrap = el("div", { class: "page-wrap" });
  const cont = el("div", { class: "container" });
  pageWrap.appendChild(cont);
  wrap.appendChild(pageWrap);

  const circumference = 2 * Math.PI * 38;
  const dashOffset = circumference - (pct / 100) * circumference;

  cont.innerHTML = `
  <div class="dashboard">
    <div class="dashboard-header">
      <div class="welcome-banner">
        <div class="welcome-text">
          <h1>Welcome, ${name.split(" ")[0]}! 👋</h1>
          <p>Introduction to Computing — ICT 1101 &nbsp;|&nbsp; ${doneCount} of ${modules.length} modules completed</p>
        </div>
        <div class="progress-overview">
          <div class="progress-ring-wrap">
            <svg width="90" height="90" viewBox="0 0 90 90">
              <circle class="ring-bg" cx="45" cy="45" r="38" stroke-width="7"/>
              <circle class="ring-fill" cx="45" cy="45" r="38" stroke-width="7"
                stroke-dasharray="${circumference}" stroke-dashoffset="${dashOffset}"/>
            </svg>
            <div class="progress-ring-label"><strong>${pct}%</strong><span>Done</span></div>
          </div>
        </div>
      </div>
    </div>
    <h2 class="section-title">📖 Course Modules</h2>
    <div class="modules-grid" id="modules-grid"></div>
    ${doneCount === modules.length ? `<div class="completion-banner"><h2>🎉 Course Complete!</h2><p>Congratulations! You have successfully completed all 5 modules of Introduction to Computing.</p></div>` : ""}
  </div>`;

  const grid = cont.querySelector("#modules-grid");
  modules.forEach(mod => {
    const mp = getModProg(studentData, mod.id);
    const isCompleted = mp.status === "completed";
    const isLocked    = mp.status === "locked";

    const statusIcon  = isCompleted ? "✅" : (isLocked ? "🔒" : "▶️");
    const statusClass = isCompleted ? "done" : (isLocked ? "locked-icon" : "active");

    const card = el("div", { class: `module-card${isLocked ? " locked" : ""}${isCompleted ? " completed" : ""}` });
    card.innerHTML = `
      <div class="module-num">${mod.icon || mod.id}<div class="mod-label">Module ${mod.id}</div></div>
      <div class="module-info">
        <div class="module-title">${mod.title}</div>
        <div class="module-desc">${mod.description}</div>
        <div class="module-meta">
          <span class="meta-tag">⏱ ${mod.duration}</span>
          <span class="meta-tag">📝 5 Questions</span>
          ${isCompleted ? `<span class="meta-tag gold">🏆 Score: ${mp.score}/5</span>` : ""}
          ${isLocked ? `<span class="meta-tag" style="background:#f3f4f6;color:#6b7280;">🔒 Complete previous module first</span>` : ""}
        </div>
      </div>
      <div class="module-action"><div class="status-icon ${statusClass}">${statusIcon}</div></div>`;
    card.onclick = isLocked ? () => toast("Complete the previous module to unlock this one.", "info") : () => showReader(mod.id);
    grid.appendChild(card);
  });

  render(wrap);
}

/* ─────────────────────────────────────────────
   READER
───────────────────────────────────────────── */
async function showReader(moduleId) {
  const mod = window.COURSE.modules.find(m => m.id === moduleId);
  if (!mod) return;
  APP.currentModule = moduleId;
  const { name, sid } = APP.currentUser;

  showLoading("Loading module…");
  let studentData;
  try { studentData = await fsGetStudent(sid) || {}; } catch { studentData = {}; }
  hideLoading();

  const mp = getModProg(studentData, moduleId);
  await fsAddLog({ type: "read_start", user: name, sid, module: mod.title, message: `${name} opened Module ${moduleId}: ${mod.title}` });

  const wrap = el("div");
  wrap.appendChild(buildTopbar(name, false));
  const pageWrap = el("div", { class: "page-wrap" });
  const cont = el("div", { class: "container reader-page" });
  pageWrap.appendChild(cont);
  wrap.appendChild(pageWrap);

  cont.innerHTML = `
  <div class="reader-header">
    <div class="reader-header-left">
      <h2>Module ${moduleId}: ${mod.title}</h2>
      <p>${mod.description}</p>
    </div>
    <div class="reader-progress">
      <span class="page-counter" id="page-display">Page 1 / 10+</span>
      <button class="btn btn-outline" id="back-btn" style="background:var(--kiu-green-pale);color:var(--kiu-green);border-color:var(--border);">← Dashboard</button>
    </div>
  </div>
  <div class="reader-body" id="reader-scroll-area">
    <div class="reading-content">${mod.content}</div>
  </div>
  <div class="reader-nav">
    <button class="btn btn-outline" id="back-btn2" style="background:white;color:var(--kiu-green);border-color:var(--border);">← Back to Dashboard</button>
    <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
      <span id="scroll-hint" style="font-size:.85rem;color:var(--text-muted);">📜 Scroll to the end to unlock the quiz</span>
      <button class="btn btn-primary btn-lg" id="start-quiz-btn" ${mp.status === "completed" ? "" : "disabled"}>
        ${mp.status === "completed" ? "Review Quiz ✓" : "Take Quiz →"}
      </button>
    </div>
  </div>`;

  if (mp.status === "completed") cont.querySelector("#scroll-hint").textContent = "✅ Module already completed";

  cont.querySelector("#back-btn").onclick  = showDashboard;
  cont.querySelector("#back-btn2").onclick = showDashboard;

  const scrollArea = cont.querySelector("#reader-scroll-area");
  const quizBtn    = cont.querySelector("#start-quiz-btn");
  const pageDsp    = cont.querySelector("#page-display");
  const scrollHint = cont.querySelector("#scroll-hint");
  let readUnlocked = mp.status === "completed";

  scrollArea.addEventListener("scroll", () => {
    const sh = scrollArea.scrollHeight - scrollArea.clientHeight;
    const pct = sh > 0 ? (scrollArea.scrollTop / sh) * 100 : 100;
    const pg = Math.min(10, Math.max(1, Math.ceil(pct / 10)));
    pageDsp.textContent = `Page ${pg} / 10+`;
    if (pct >= 90 && !readUnlocked) {
      readUnlocked = true;
      quizBtn.disabled = false;
      scrollHint.textContent = "✅ Reading complete! You can now take the quiz.";
      toast("Reading complete — quiz is now unlocked!", "success");
    }
  });

  quizBtn.onclick = () => {
    if (!readUnlocked) { toast("Please finish reading before attempting the quiz.", "info"); return; }
    startQuiz(moduleId);
  };

  render(wrap);
}

/* ─────────────────────────────────────────────
   QUIZ ENGINE
───────────────────────────────────────────── */
function startQuiz(moduleId) {
  const mod = window.COURSE.modules.find(m => m.id === moduleId);
  APP.currentModule = moduleId;
  APP.currentQIndex = 0;
  APP.quizAnswers = mod.quiz.map(() => ({ chosen: null, correct: false, attemptsUsed: 0 }));
  fsAddLog({ type: "quiz_start", user: APP.currentUser.name, sid: APP.currentUser.sid, module: mod.title, message: `${APP.currentUser.name} started quiz for Module ${moduleId}` });
  showQuestion(moduleId);
}

function showQuestion(moduleId) {
  const mod = window.COURSE.modules.find(m => m.id === moduleId);
  const qi  = APP.currentQIndex;
  const q   = mod.quiz[qi];
  const MAX = 3;
  const rec = APP.quizAnswers[qi];

  const dotsHTML = mod.quiz.map((_, i) => {
    let cls = i < qi ? (APP.quizAnswers[i].correct ? "done" : "wrong") : i === qi ? "active" : "";
    return `<div class="q-dot ${cls}"></div>`;
  }).join("");

  const attHTML = (left) => Array.from({ length: MAX }, (_, i) => `<div class="attempt-dot ${i >= left ? "used" : ""}"></div>`).join("");

  // Remove existing overlay
  document.getElementById("quiz-overlay")?.remove();
  const overlay = el("div", { class: "quiz-overlay", id: "quiz-overlay" });

  function buildCard(attemptsLeft) {
    overlay.innerHTML = `
    <div class="quiz-card">
      <div class="quiz-header">
        <div class="quiz-module-tag">Module ${moduleId} — ${mod.title}</div>
        <h2>📝 Knowledge Check</h2>
        <div class="quiz-progress-row">${dotsHTML}</div>
      </div>
      <div class="question-body">
        <div class="question-num">Question ${qi + 1} of ${mod.quiz.length}</div>
        <div class="question-text">${q.question}</div>
      </div>
      <div class="attempts-row">
        <span class="attempts-label">Attempts remaining:</span>
        <div class="attempts-dots" id="att-dots">${attHTML(attemptsLeft)}</div>
      </div>
      <div class="options-list" id="options-list">
        ${q.options.map((opt, oi) => `
          <button class="option-btn" data-idx="${oi}" id="opt-${oi}">
            <span class="option-letter">${String.fromCharCode(65 + oi)}</span>
            <span>${opt}</span>
          </button>`).join("")}
      </div>
      <div class="feedback-box" id="fb"></div>
      <div class="quiz-footer">
        <button class="btn btn-green" id="submit-btn" disabled>Submit Answer</button>
      </div>
    </div>`;

    let selected = null;
    const getOpts = () => overlay.querySelectorAll(".option-btn");
    const getSubm = () => overlay.querySelector("#submit-btn");
    const getFb   = () => overlay.querySelector("#fb");

    getOpts().forEach(btn => {
      btn.onclick = () => {
        getOpts().forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        selected = parseInt(btn.getAttribute("data-idx"));
        getSubm().disabled = false;
      };
    });

    getSubm().onclick = () => handleSubmit(selected);
  }

  function handleSubmit(selectedIdx) {
    if (selectedIdx === null) return;
    rec.attemptsUsed++;
    rec.chosen = selectedIdx;
    const isCorrect = selectedIdx === q.correct;
    const opts = overlay.querySelectorAll(".option-btn");
    opts.forEach(b => b.disabled = true);
    const fb   = overlay.querySelector("#fb");
    const subm = overlay.querySelector("#submit-btn");

    if (isCorrect) {
      rec.correct = true;
      opts[q.correct].classList.add("correct");
      fb.className = "feedback-box correct-fb show";
      fb.innerHTML = `✅ <strong>Correct!</strong> ${q.explanation}`;
      subm.textContent = qi < mod.quiz.length - 1 ? "Next Question →" : "See Results 🏆";
      subm.disabled = false;
      subm.onclick = nextOrResults;
    } else {
      opts[selectedIdx].classList.add("wrong-choice");
      const left = MAX - rec.attemptsUsed;
      overlay.querySelector("#att-dots").innerHTML = attHTML(left);

      if (left <= 0) {
        opts[q.correct].classList.add("correct");
        fb.className = "feedback-box wrong-fb show";
        fb.innerHTML = `❌ <strong>Incorrect.</strong> Correct answer: <strong>${String.fromCharCode(65 + q.correct)}: ${q.options[q.correct]}</strong><br><br>
          📖 <strong>Suggested Reading:</strong><br>
          <span class="read-hint" data-sec="${q.hintSection}">📌 ${q.hint}</span>`;
        fb.querySelector(".read-hint").onclick = () => {
          overlay.remove(); showReaderAtSection(moduleId, q.hintSection);
        };
        subm.textContent = qi < mod.quiz.length - 1 ? "Next Question →" : "See Results 🏆";
        subm.disabled = false;
        subm.onclick = nextOrResults;
      } else {
        fb.className = "feedback-box wrong-fb show";
        fb.innerHTML = `❌ <strong>Incorrect.</strong> <strong>${left}</strong> attempt${left !== 1 ? "s" : ""} remaining.<br><br>📖 <em>Hint: ${q.hint}</em>`;
        // Reset for retry
        setTimeout(() => {
          opts.forEach(b => { b.disabled = false; b.classList.remove("selected","wrong-choice"); });
          subm.disabled = true;
          subm.onclick = null;
          subm.textContent = "Submit Answer";
          // Re-bind selection
          let sel2 = null;
          opts.forEach(btn => {
            btn.onclick = () => {
              opts.forEach(b => b.classList.remove("selected"));
              btn.classList.add("selected");
              sel2 = parseInt(btn.getAttribute("data-idx"));
              subm.disabled = false;
            };
          });
          subm.onclick = () => handleSubmit(sel2);
        }, 1200);
      }
    }
  }

  function nextOrResults() {
    if (qi < mod.quiz.length - 1) {
      APP.currentQIndex++;
      overlay.remove();
      showQuestion(moduleId);
    } else {
      overlay.remove();
      showResults(moduleId);
    }
  }

  buildCard(MAX - rec.attemptsUsed);
  document.getElementById("app").appendChild(overlay);
}

function showReaderAtSection(moduleId, sectionId) {
  showReader(moduleId).then?.(() => {});
  setTimeout(() => {
    const sec = document.getElementById(sectionId);
    if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
    const btn = document.querySelector("#start-quiz-btn");
    if (btn) { btn.disabled = false; btn.textContent = "Continue Quiz →"; }
  }, 600);
}

/* ─────────────────────────────────────────────
   RESULTS
───────────────────────────────────────────── */
async function showResults(moduleId) {
  const mod  = window.COURSE.modules.find(m => m.id === moduleId);
  const { name, sid } = APP.currentUser;
  const score = APP.quizAnswers.filter(a => a.correct).length;
  const pass  = score >= 3;

  showLoading("Saving your results…");
  try {
    const studentData = await fsGetStudent(sid) || {};
    setModProg(studentData, moduleId, { status: "completed", score, pass, completedAt: new Date().toISOString() });

    // Unlock next module
    const nextId = moduleId + 1;
    const nextMod = window.COURSE.modules.find(m => m.id === nextId);
    if (nextMod) {
      const nmp = getModProg(studentData, nextId);
      if (nmp.status === "locked") setModProg(studentData, nextId, { status: "unlocked" });
    }
    await fsSaveStudent(sid, studentData);
    await fsAddLog({ type: "quiz_complete", user: name, sid, module: mod.title, score, pass, message: `${name} (${sid}) completed Module ${moduleId}. Score: ${score}/5. ${pass ? "PASSED ✅" : "FAILED ❌"}` });
    hideLoading();
  } catch (err) {
    hideLoading();
    console.error("Save error:", err);
    toast("Could not save results to server. Check connection.", "warn");
  }

  const nextMod2 = window.COURSE.modules.find(m => m.id === moduleId + 1);

  const overlay = el("div", { class: "quiz-overlay" });
  overlay.innerHTML = `
  <div class="quiz-card">
    <div class="quiz-header">
      <div class="quiz-module-tag">Module ${moduleId} Results</div>
      <h2>${pass ? "🏆 Congratulations!" : "📚 Keep Studying!"}</h2>
    </div>
    <div class="score-result">
      <div class="score-circle ${pass ? "pass" : "fail"}">
        <div class="score-num">${score}/5</div>
        <div class="score-of">${Math.round(score/5*100)}%</div>
      </div>
      <h3>${pass ? "Module Passed!" : "Module Attempted"}</h3>
      <p>${pass
        ? `You scored ${score} out of 5. ${nextMod2 ? `Module ${moduleId + 1} is now unlocked!` : "You have completed all modules — well done!"}`
        : `You scored ${score} out of 5. Review the reading material and try again.`}</p>
    </div>
    <div style="margin:20px 0;">
      ${APP.quizAnswers.map((a, i) => {
        const q = mod.quiz[i];
        return `<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);font-size:.88rem;">
          <span>${a.correct ? "✅" : "❌"}</span>
          <span style="flex:1;color:var(--text-dark);">Q${i+1}: ${q.question.substring(0, 65)}…</span>
          <span class="pill ${a.correct ? "pill-green" : "pill-red"}">${a.correct ? "Correct" : "Wrong"}</span>
        </div>`;
      }).join("")}
    </div>
    <div class="quiz-footer" style="justify-content:space-between;flex-wrap:wrap;gap:10px;">
      ${!pass ? `<button class="btn btn-outline" id="retry-btn" style="color:var(--kiu-green);border-color:var(--kiu-green);">🔄 Retry Quiz</button>` : ""}
      <button class="btn btn-primary btn-lg" id="continue-btn">${nextMod2 && pass ? "Next Module →" : "Back to Dashboard"}</button>
    </div>
  </div>`;

  overlay.querySelector("#retry-btn")?.addEventListener("click", () => { overlay.remove(); startQuiz(moduleId); });
  overlay.querySelector("#continue-btn").onclick = () => {
    overlay.remove();
    nextMod2 && pass ? showReader(moduleId + 1) : showDashboard();
  };
  document.getElementById("app").appendChild(overlay);
}

/* ─────────────────────────────────────────────
   ADMIN DASHBOARD  ← NOW READS FROM FIRESTORE
   Shows ALL students from any device/browser
───────────────────────────────────────────── */
async function showAdminDashboard() {
  showLoading("Loading all students from database…");

  let allStudents = [], logs = [];
  try {
    [allStudents, logs] = await Promise.all([fsGetAllStudents(), fsGetLogs(100)]);
  } catch (err) {
    hideLoading();
    toast("Error loading data: " + err.message, "error");
    allStudents = []; logs = [];
  }
  hideLoading();

  const modules = window.COURSE.modules;
  let totalCompleted = 0, totalPassed = 0;
  allStudents.forEach(u => {
    modules.forEach(m => {
      const mp = getModProg(u, m.id);
      if (mp.status === "completed") totalCompleted++;
      if (mp.status === "completed" && mp.pass) totalPassed++;
    });
  });

  const wrap = el("div");
  wrap.appendChild(buildTopbar("Administrator", true));
  const pageWrap = el("div", { class: "page-wrap" });
  const cont = el("div", { class: "container", style: "padding-top:36px;padding-bottom:60px;" });
  pageWrap.appendChild(cont);
  wrap.appendChild(pageWrap);

  cont.innerHTML = `
  <div class="admin-header">
    <div>
      <h1>🔑 Administrator Dashboard</h1>
      <p>Monitor all student activity across ICT 1101 — Introduction to Computing</p>
      <p style="font-size:.78rem;margin-top:6px;opacity:.7;">${DEMO_MODE ? "⚠ Demo Mode — data from this device only" : "🟢 Live Firebase — showing ALL students from all devices"}</p>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <button class="btn btn-primary" id="refresh-btn">🔄 Refresh</button>
      <button class="btn btn-primary" id="dl-csv-btn">⬇ Download CSV</button>
      <button class="btn btn-outline" id="dl-log-btn">⬇ Download Logs</button>
    </div>
  </div>

  <!-- Stats -->
  <div class="stats-grid">
    <div class="stat-card"><div class="stat-icon">👥</div><div class="stat-num" id="stat-students">${allStudents.length}</div><div class="stat-label">Registered Students</div></div>
    <div class="stat-card"><div class="stat-icon">✅</div><div class="stat-num">${totalCompleted}</div><div class="stat-label">Modules Completed</div></div>
    <div class="stat-card"><div class="stat-icon">🏆</div><div class="stat-num">${totalPassed}</div><div class="stat-label">Modules Passed</div></div>
    <div class="stat-card"><div class="stat-icon">📚</div><div class="stat-num">${modules.length}</div><div class="stat-label">Total Modules</div></div>
    <div class="stat-card"><div class="stat-icon">📋</div><div class="stat-num">${logs.length}</div><div class="stat-label">Activity Events</div></div>
  </div>

  <!-- Student Table -->
  <div class="table-wrap" style="margin-bottom:28px;">
    <div class="table-head">
      <h3>📊 Student Progress <span style="font-size:.75rem;font-weight:400;color:var(--text-muted);margin-left:8px;">(${allStudents.length} student${allStudents.length !== 1 ? "s" : ""} total)</span></h3>
      <input class="search-box" id="student-search" placeholder="🔍 Search by name or student no…" type="text">
    </div>
    <div style="overflow-x:auto;">
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Student Name</th>
            <th>Student No.</th>
            <th>Registered</th>
            ${modules.map(m => `<th>M${m.id}</th>`).join("")}
            <th>Overall</th>
          </tr>
        </thead>
        <tbody id="student-tbody"></tbody>
      </table>
    </div>
  </div>

  <!-- Activity Log -->
  <div class="table-wrap">
    <div class="table-head">
      <h3>🕐 Activity Log <span style="font-size:.75rem;font-weight:400;color:var(--text-muted);">(latest ${logs.length})</span></h3>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-sm btn-danger" id="clear-log-btn">🗑 Clear Logs</button>
      </div>
    </div>
    <div class="activity-log" id="activity-log" style="max-height:400px;overflow-y:auto;"></div>
  </div>`;

  /* ── Render student rows ── */
  function renderRows(filter = "") {
    const tbody = cont.querySelector("#student-tbody");
    tbody.innerHTML = "";
    const filtered = allStudents.filter(u =>
      u.name?.toLowerCase().includes(filter.toLowerCase()) ||
      u.sid?.toLowerCase().includes(filter.toLowerCase())
    );
    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="${4 + modules.length + 1}" style="text-align:center;padding:28px;color:var(--text-muted);">${filter ? "No students match your search." : "No students registered yet."}</td></tr>`;
      return;
    }
    filtered.forEach((u, idx) => {
      let done = 0;
      const cells = modules.map(m => {
        const mp = getModProg(u, m.id);
        if (mp.status === "completed") done++;
        const cls  = mp.status === "completed" ? (mp.pass ? "pill-green" : "pill-red") : mp.status === "unlocked" ? "pill-gold" : "pill-gray";
        const text = mp.status === "completed" ? `${mp.score}/5${mp.pass ? " ✓" : " ✗"}` : mp.status === "unlocked" ? "Open" : "Locked";
        return `<td><span class="pill ${cls}" style="white-space:nowrap;">${text}</span></td>`;
      }).join("");
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="color:var(--text-muted);font-size:.8rem;">${idx + 1}</td>
        <td><strong>${u.name}</strong></td>
        <td><code style="font-size:.8rem;">${u.sid}</code></td>
        <td style="font-size:.8rem;color:var(--text-muted);">${u.registeredAt ? new Date(u.registeredAt).toLocaleDateString("en-UG", { day:"2-digit", month:"short", year:"numeric" }) : "—"}</td>
        ${cells}
        <td><span class="pill ${done === modules.length ? "pill-green" : done > 0 ? "pill-gold" : "pill-gray"}">${done}/${modules.length} (${Math.round(done/modules.length*100)}%)</span></td>`;
      tbody.appendChild(tr);
    });
  }
  renderRows();
  cont.querySelector("#student-search").oninput = e => renderRows(e.target.value);

  /* ── Activity log ── */
  const logWrap = cont.querySelector("#activity-log");
  if (logs.length === 0) {
    logWrap.innerHTML = `<div class="activity-item"><span style="color:var(--text-muted);">No activity recorded yet.</span></div>`;
  } else {
    logs.forEach(log => {
      const d = new Date(log.ts);
      const timeStr = isNaN(d) ? log.ts : `${d.toLocaleDateString("en-UG")} ${d.toLocaleTimeString("en-UG",{hour:"2-digit",minute:"2-digit"})}`;
      const dot = log.type === "quiz_complete" ? (log.pass ? "var(--kiu-green-mid)" : "#e74c3c") : log.type === "registration" ? "var(--kiu-gold)" : "var(--kiu-green-light)";
      const div = el("div", { class: "activity-item" });
      div.innerHTML = `
        <div class="activity-dot" style="background:${dot}"></div>
        <span style="flex:1;font-size:.86rem;">${log.message || log.type}</span>
        ${log.type === "quiz_complete" ? `<span class="pill ${log.pass ? "pill-green" : "pill-red"}">${log.score}/5</span>` : ""}
        <span class="activity-time">${timeStr}</span>`;
      logWrap.appendChild(div);
    });
  }

  /* ── Controls ── */
  cont.querySelector("#refresh-btn").onclick = showAdminDashboard;

  cont.querySelector("#clear-log-btn").onclick = async () => {
    if (!confirm("Clear all activity logs? This cannot be undone.")) return;
    showLoading("Clearing logs…");
    await fsClearLogs();
    hideLoading();
    toast("Logs cleared.", "info");
    showAdminDashboard();
  };

  cont.querySelector("#dl-csv-btn").onclick = () => {
    let csv = `"#","Student Name","Student Number","Registered"`;
    modules.forEach(m => { csv += `,"Module ${m.id} Score","Module ${m.id} Status","Module ${m.id} Pass"`; });
    csv += `,"Overall Progress"\n`;
    allStudents.forEach((u, idx) => {
      let done = 0;
      let row  = `"${idx+1}","${u.name}","${u.sid}","${u.registeredAt ? new Date(u.registeredAt).toLocaleDateString() : ""}"`;
      modules.forEach(m => {
        const mp = getModProg(u, m.id);
        if (mp.status === "completed") done++;
        row += `,"${mp.score != null ? mp.score+"/5" : "—"}","${mp.status}","${mp.pass ? "Yes" : mp.status === "completed" ? "No" : "—"}"`;
      });
      row += `,"${done}/${modules.length}"`;
      csv += row + "\n";
    });
    dlFile("KIU_LMS_Student_Progress.csv", csv, "text/csv");
    toast("CSV downloaded!", "success");
  };

  cont.querySelector("#dl-log-btn").onclick = () => {
    let txt = `KIU-Learners Pace — Activity Log\nGenerated: ${new Date().toLocaleString()}\n${"=".repeat(70)}\n\n`;
    logs.forEach(log => {
      const d = new Date(log.ts);
      txt += `[${isNaN(d) ? log.ts : d.toLocaleString()}] ${log.message || log.type}\n`;
    });
    dlFile("KIU_LMS_Activity_Log.txt", txt, "text/plain");
    toast("Activity log downloaded!", "success");
  };

  render(wrap);
}

function dlFile(name, content, mime) {
  const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([content], { type: mime })), download: name });
  a.click(); URL.revokeObjectURL(a.href);
}

/* ─────────────────────────────────────────────
   INIT
───────────────────────────────────────────── */
window.addEventListener("DOMContentLoaded", () => {
  initFirebase();
  setTimeout(async () => {
    // Check for an existing session
    const session = loadSession();
    if (session) {
      APP.currentUser = { name: session.name, sid: session.sid };
      APP.isAdmin     = session.isAdmin || false;
      if (APP.isAdmin) { showAdminDashboard(); return; }
      showDashboard();
      return;
    }
    // No session — show setup prompt if Firebase not configured
    if (DEMO_MODE) {
      showSetupScreen();
    } else {
      showLogin();
    }
  }, 1700);
});
