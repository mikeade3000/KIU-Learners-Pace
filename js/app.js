/* ============================================================
   KIU-Learners Pace — app.js
   Backend: Google Sheets via Apps Script Web App
   Cross-device | Cross-browser | Completely free
   ============================================================ */

const ADMIN_CREDS = { username: "kiu.admin", password: "KIU@Admin2025!" };
const SESSION_KEY = "kiu_session_v4";
const CACHE_KEY   = "kiu_cache_v4";

let API_URL   = "";
let API_READY = false;
let DEMO_MODE = false;

/* ── APP STATE ── */
let APP = {
  currentUser:   null,
  isAdmin:       false,
  currentModule: null,
  currentQIndex: 0,
  quizAnswers:   [],
};

/* ─────────────────────────────────────────────
   API INIT
───────────────────────────────────────────── */
function initAPI() {
  const url = window.KIU_API_URL || "";
  if (!url || url.includes("PASTE_YOUR")) {
    DEMO_MODE = true;
    console.warn("[KIU-LMS] Sheets API not configured — Demo Mode (localStorage).");
    return;
  }
  API_URL   = url;
  API_READY = true;
  console.info("[KIU-LMS] Google Sheets API connected ✅");
}

/* ─────────────────────────────────────────────
   API CALLS  (fetch to Apps Script)
───────────────────────────────────────────── */
async function apiCall(action, payload = {}) {
  if (!API_READY) throw new Error("API not configured");
  const body = JSON.stringify({ action, ...payload });
  const res  = await fetch(API_URL, {
    method:  "POST",
    body,
    headers: { "Content-Type": "text/plain" }, // Apps Script needs text/plain for CORS
  });
  if (!res.ok) throw new Error("HTTP " + res.status);
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json;
}

/* ─────────────────────────────────────────────
   DEMO MODE (localStorage fallback)
───────────────────────────────────────────── */
function demoDB() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || { students: {}, logs: [] }; }
  catch { return { students: {}, logs: [] }; }
}
function demoSave(d) { localStorage.setItem(CACHE_KEY, JSON.stringify(d)); }

/* ─────────────────────────────────────────────
   DATABASE LAYER  (same interface regardless of mode)
───────────────────────────────────────────── */
async function dbGetStudent(sid) {
  if (!API_READY) {
    const d = demoDB();
    return d.students[sid.toLowerCase()] || null;
  }
  return await apiCall("getStudent", { sid });
}

async function dbSaveStudent(student) {
  if (!API_READY) {
    const d = demoDB();
    d.students[student.sid.toLowerCase()] = student;
    demoSave(d);
    return;
  }
  await apiCall("saveStudent", { student });
}

async function dbGetAllStudents() {
  if (!API_READY) {
    return Object.values(demoDB().students);
  }
  return await apiCall("getAllStudents");
}

async function dbAddLog(entry) {
  const log = { ...entry, ts: new Date().toISOString() };
  if (!API_READY) {
    const d = demoDB();
    d.logs.unshift(log);
    if (d.logs.length > 2000) d.logs.length = 2000;
    demoSave(d);
    return;
  }
  // Fire-and-forget logs (don't block UI)
  apiCall("addLog", { log }).catch(e => console.warn("Log failed:", e));
}

async function dbGetLogs(limit = 100) {
  if (!API_READY) return demoDB().logs.slice(0, limit);
  return await apiCall("getLogs", { limit });
}

async function dbClearLogs() {
  if (!API_READY) {
    const d = demoDB(); d.logs = []; demoSave(d); return;
  }
  await apiCall("clearLogs");
}

/* ─────────────────────────────────────────────
   PROGRESS HELPERS
───────────────────────────────────────────── */
function getModProg(studentData, moduleId) {
  return ((studentData || {}).progress || {})[`mod_${moduleId}`]
    || { status: "locked", score: null, pass: false };
}
function setModProg(studentData, moduleId, data) {
  if (!studentData.progress) studentData.progress = {};
  studentData.progress[`mod_${moduleId}`] = {
    ...(studentData.progress[`mod_${moduleId}`] || {}),
    ...data
  };
}

/* ─────────────────────────────────────────────
   SESSION
───────────────────────────────────────────── */
function saveSession(s) { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); }
function clearSession()  { localStorage.removeItem(SESSION_KEY); }
function loadSession()   { try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; } }

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
  let wrap = document.getElementById("kiu-toasts");
  if (!wrap) { wrap = el("div", { id: "kiu-toasts", class: "toast-wrap" }); document.body.appendChild(wrap); }
  const icons = { success: "✅", error: "❌", info: "ℹ️", warn: "⚠️" };
  const t = el("div", { class: `toast ${type}` }, `${icons[type] || ""} ${msg}`);
  wrap.appendChild(t);
  setTimeout(() => { t.classList.add("removing"); setTimeout(() => t.remove(), 350); }, 3500);
}

/* ─────────────────────────────────────────────
   LOADING OVERLAY
───────────────────────────────────────────── */
function showLoading(msg = "Loading…") {
  let ov = document.getElementById("kiu-loading");
  if (!ov) {
    const s = document.createElement("style");
    s.textContent = "@keyframes kspin{to{transform:rotate(360deg)}}";
    document.head.appendChild(s);
    ov = el("div", { id: "kiu-loading", style: "position:fixed;inset:0;z-index:9999;background:rgba(10,40,20,.7);backdrop-filter:blur(5px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;" });
    ov.innerHTML = `<div style="width:50px;height:50px;border:4px solid rgba(255,255,255,.2);border-top-color:#4cc87a;border-radius:50%;animation:kspin .75s linear infinite;"></div><p id="kiu-load-msg" style="color:white;font-family:var(--font-body);font-size:.95rem;letter-spacing:.02em;">${msg}</p>`;
    document.body.appendChild(ov);
  } else {
    const m = ov.querySelector("#kiu-load-msg");
    if (m) m.textContent = msg;
  }
}
function hideLoading() { document.getElementById("kiu-loading")?.remove(); }

/* ─────────────────────────────────────────────
   TOPBAR
───────────────────────────────────────────── */
function buildTopbar(userName, isAdmin) {
  const initials = isAdmin ? "AD" : userName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const bar = el("nav", { class: "topbar" });
  bar.innerHTML = `
    <div class="topbar-brand">
      <img src="assets/kiu-logo.jpg" class="topbar-logo" alt="KIU">
      <div class="topbar-title">KIU-Learners Pace<span>Kampala International University</span></div>
    </div>
    <div class="topbar-right">
      ${DEMO_MODE
        ? `<span style="background:#d4a017;color:#3a2800;font-size:.7rem;font-weight:700;padding:3px 10px;border-radius:99px;">⚠ DEMO MODE</span>`
        : `<span style="background:rgba(76,200,122,.15);color:#4cc87a;font-size:.7rem;font-weight:700;padding:3px 10px;border-radius:99px;">🟢 LIVE</span>`}
      <div class="topbar-user">
        <div class="avatar">${initials}</div>
        <span style="color:rgba(255,255,255,.85);font-size:.88rem;">${isAdmin ? "Administrator" : userName}</span>
      </div>
      <button class="btn btn-outline" id="logout-btn">Sign Out</button>
    </div>`;
  bar.querySelector("#logout-btn").onclick = logout;
  return bar;
}

/* ─────────────────────────────────────────────
   SETUP SCREEN (shown when API not configured)
───────────────────────────────────────────── */
function showSetupScreen() {
  const page = el("div");
  page.innerHTML = `
  <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;
    background:linear-gradient(145deg,var(--kiu-green-deep),var(--kiu-green));padding:24px;">
    <div style="background:white;border-radius:var(--radius-xl);padding:48px 44px;max-width:600px;
      width:100%;box-shadow:var(--shadow-lg);animation:fadeUp .5s ease both;">
      <div style="text-align:center;margin-bottom:32px;">
        <img src="assets/kiu-logo.jpg" style="width:90px;border-radius:10px;margin-bottom:16px;">
        <h1 style="font-family:var(--font-display);font-size:1.7rem;color:var(--kiu-green-deep);">Google Sheets Setup</h1>
        <p style="color:var(--text-muted);margin-top:6px;font-size:.92rem;">Free, no card needed. Students from any device will be visible to admin.</p>
      </div>
      <div style="background:var(--kiu-green-pale);border-radius:var(--radius-md);padding:22px 24px;margin-bottom:24px;">
        <p style="font-weight:700;color:var(--kiu-green-deep);margin-bottom:14px;">📋 Setup steps (10 minutes, one time only):</p>
        <ol style="font-size:.88rem;color:var(--text-mid);line-height:2.1;padding-left:20px;">
          <li>Go to <a href="https://sheets.google.com" target="_blank" style="color:var(--kiu-green);font-weight:600;">sheets.google.com</a> → create a <strong>new blank spreadsheet</strong></li>
          <li>Name it <strong>"KIU-LMS Database"</strong></li>
          <li>Click <strong>Extensions → Apps Script</strong></li>
          <li>Delete all the existing code</li>
          <li>Paste the entire contents of <code style="background:white;padding:2px 7px;border-radius:4px;">Code.gs</code> file</li>
          <li>Click 💾 Save → name the project <strong>"KIU-LMS"</strong></li>
          <li>Click <strong>Deploy → New deployment</strong></li>
          <li>Click ⚙ gear icon → select <strong>Web app</strong></li>
          <li>Set: <strong>Execute as → Me</strong> &nbsp;|&nbsp; <strong>Who has access → Anyone</strong></li>
          <li>Click <strong>Deploy → Authorize → Allow</strong></li>
          <li>Copy the <strong>Web app URL</strong></li>
          <li>Open <code style="background:white;padding:2px 7px;border-radius:4px;">js/sheets-config.js</code> → paste the URL</li>
          <li>Upload updated file to GitHub</li>
        </ol>
      </div>
      <div style="background:#fff8e1;border:1.5px solid #f5c842;border-radius:var(--radius-md);padding:14px 18px;margin-bottom:24px;">
        <p style="font-size:.85rem;color:#7a5c00;font-weight:600;">✅ Completely free — no billing, no credit card, no limits for this use case</p>
      </div>
      <button class="btn btn-green btn-lg" style="width:100%;justify-content:center;" id="demo-btn">
        Continue in Demo Mode (this device only)
      </button>
      <p style="text-align:center;font-size:.78rem;color:var(--text-muted);margin-top:12px;">
        Demo Mode: data saved locally. Admin only sees students from this device.
      </p>
    </div>
  </div>`;
  page.querySelector("#demo-btn").onclick = () => { DEMO_MODE = true; showLogin(); };
  render(page);
}

/* ─────────────────────────────────────────────
   LOGIN
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
        <span class="badge">🌐 MIS</span>
      </div>
      ${DEMO_MODE
        ? `<div style="background:rgba(212,160,23,.2);border:1px solid var(--kiu-gold);border-radius:var(--radius-sm);padding:10px 16px;max-width:300px;text-align:center;">
             <p style="color:var(--kiu-gold-light);font-size:.8rem;font-weight:600;">⚠ Demo Mode — configure Google Sheets for cross-device access</p>
           </div>`
        : `<div style="background:rgba(76,200,122,.15);border:1px solid rgba(76,200,122,.4);border-radius:var(--radius-sm);padding:8px 16px;">
             <p style="color:#4cc87a;font-size:.8rem;font-weight:600;">🟢 Connected — all devices sync</p>
           </div>`}
    </div>
    <div class="login-panel">
      <div class="login-card">
        <div class="login-card-header">
          <h2>Welcome Back</h2>
          <p>Sign in to continue your learning journey</p>
        </div>
        <div class="tab-row">
          <button class="tab-btn active" id="tab-s">🎓 Student</button>
          <button class="tab-btn" id="tab-a">🔑 Admin</button>
        </div>
        <div id="form-error" class="form-error"></div>
        <div id="stu-form">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input class="form-input" id="stu-name" type="text" placeholder="e.g. Nakato Sarah" maxlength="60" autocomplete="name">
          </div>
          <div class="form-group">
            <label class="form-label">Student Number</label>
            <input class="form-input" id="stu-id" type="text" placeholder="e.g. KIU/2024/001" maxlength="30">
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input class="form-input" id="stu-pass" type="password" placeholder="Create or enter your password">
          </div>
          <button class="btn btn-primary btn-block btn-lg" id="stu-btn" style="margin-top:8px;">Start Learning →</button>
        </div>
        <div id="adm-form" class="hidden">
          <div class="form-group">
            <label class="form-label">Admin Username</label>
            <input class="form-input" id="adm-user" type="text" placeholder="kiu.admin">
          </div>
          <div class="form-group">
            <label class="form-label">Admin Password</label>
            <input class="form-input" id="adm-pass" type="password" placeholder="Enter admin password">
          </div>
          <button class="btn btn-primary btn-block btn-lg" id="adm-btn" style="margin-top:8px;">Access Dashboard →</button>
        </div>
        <div class="divider"></div>
        <p style="text-align:center;font-size:.78rem;color:var(--text-muted);">Management Information Systems &nbsp;|&nbsp; © 2075 KIU</p>
      </div>
    </div>
  </div>`;

  const errBox = page.querySelector("#form-error");
  const showErr = m => { errBox.textContent = m; errBox.classList.add("show"); };
  const hideErr = () => errBox.classList.remove("show");

  page.querySelector("#tab-s").onclick = () => {
    page.querySelector("#tab-s").classList.add("active");
    page.querySelector("#tab-a").classList.remove("active");
    page.querySelector("#stu-form").classList.remove("hidden");
    page.querySelector("#adm-form").classList.add("hidden");
    hideErr();
  };
  page.querySelector("#tab-a").onclick = () => {
    page.querySelector("#tab-a").classList.add("active");
    page.querySelector("#tab-s").classList.remove("active");
    page.querySelector("#adm-form").classList.remove("hidden");
    page.querySelector("#stu-form").classList.add("hidden");
    hideErr();
  };

  /* Student login */
  page.querySelector("#stu-btn").onclick = async () => {
    const name = page.querySelector("#stu-name").value.trim();
    const sid  = page.querySelector("#stu-id").value.trim().toUpperCase();
    const pass = page.querySelector("#stu-pass").value;
    if (!name || !sid || !pass) { showErr("Please fill in all fields."); return; }
    if (name.length < 3)        { showErr("Please enter your full name."); return; }
    if (pass.length < 4)        { showErr("Password must be at least 4 characters."); return; }

    showLoading("Signing in…");
    try {
      const existing = await dbGetStudent(sid);
      const hash     = btoa(encodeURIComponent(pass));

      if (existing) {
        if (existing.passwordHash !== hash)              { hideLoading(); showErr("Incorrect password for this student number."); return; }
        if (existing.name.toLowerCase() !== name.toLowerCase()) { hideLoading(); showErr("Name does not match this student number."); return; }
      } else {
        // New student
        await dbSaveStudent({
          name, sid,
          passwordHash: hash,
          registeredAt: new Date().toISOString(),
          progress: { mod_1: { status: "unlocked" } }
        });
        dbAddLog({ type: "registration", user: name, sid, message: `${name} (${sid}) registered.` });
      }
      dbAddLog({ type: "login", user: name, sid, message: `${name} (${sid}) signed in.` });
      APP.currentUser = { name, sid };
      APP.isAdmin = false;
      saveSession({ name, sid, isAdmin: false });
      hideLoading();
      showDashboard();
    } catch (err) {
      hideLoading();
      showErr("Connection error — check internet and try again. (" + err.message + ")");
    }
  };

  /* Admin login */
  page.querySelector("#adm-btn").onclick = async () => {
    const u = page.querySelector("#adm-user").value.trim();
    const p = page.querySelector("#adm-pass").value;
    if (u !== ADMIN_CREDS.username || p !== ADMIN_CREDS.password) { showErr("Invalid administrator credentials."); return; }
    showLoading("Loading dashboard…");
    dbAddLog({ type: "admin_login", user: "Administrator", message: "Admin signed in." });
    APP.isAdmin = true;
    APP.currentUser = { name: "Administrator", sid: "admin" };
    saveSession({ name: "Administrator", sid: "admin", isAdmin: true });
    hideLoading();
    showAdminDashboard();
  };

  ["stu-name","stu-id","stu-pass"].forEach(id => page.querySelector(`#${id}`).addEventListener("keydown", e => { if (e.key === "Enter") page.querySelector("#stu-btn").click(); }));
  ["adm-user","adm-pass"].forEach(id => page.querySelector(`#${id}`).addEventListener("keydown", e => { if (e.key === "Enter") page.querySelector("#adm-btn").click(); }));

  render(page);
}

function logout() {
  dbAddLog({ type: "logout", user: APP.currentUser?.name, sid: APP.currentUser?.sid, message: `${APP.currentUser?.name} signed out.` });
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
  try   { studentData = await dbGetStudent(sid) || { progress: { mod_1: { status: "unlocked" } } }; }
  catch { studentData = { progress: { mod_1: { status: "unlocked" } } }; }
  hideLoading();

  let done = 0;
  modules.forEach(m => { if (getModProg(studentData, m.id).status === "completed") done++; });
  const pct = Math.round((done / modules.length) * 100);
  const circ = 2 * Math.PI * 38;

  const wrap = el("div");
  wrap.appendChild(buildTopbar(name, false));
  const pw = el("div", { class: "page-wrap" });
  const ct = el("div", { class: "container" });
  pw.appendChild(ct); wrap.appendChild(pw);

  ct.innerHTML = `
  <div class="dashboard">
    <div class="dashboard-header">
      <div class="welcome-banner">
        <div class="welcome-text">
          <h1>Welcome, ${name.split(" ")[0]}! 👋</h1>
          <p>Management Information Systems — MIS &nbsp;|&nbsp; ${done} of ${modules.length} modules completed</p>
        </div>
        <div class="progress-overview">
          <div class="progress-ring-wrap">
            <svg width="90" height="90" viewBox="0 0 90 90">
              <circle class="ring-bg" cx="45" cy="45" r="38" stroke-width="7"/>
              <circle class="ring-fill" cx="45" cy="45" r="38" stroke-width="7"
                stroke-dasharray="${circ}" stroke-dashoffset="${circ - (pct/100)*circ}"/>
            </svg>
            <div class="progress-ring-label"><strong>${pct}%</strong><span>Done</span></div>
          </div>
        </div>
      </div>
    </div>
    <h2 class="section-title">📖 Course Modules</h2>
    <div class="modules-grid" id="mgrid"></div>
    ${done === modules.length ? `<div class="completion-banner"><h2>🎉 Course Complete!</h2><p>Congratulations! You have successfully completed all 5 modules.</p></div>` : ""}
  </div>`;

  const grid = ct.querySelector("#mgrid");
  modules.forEach(mod => {
    const mp  = getModProg(studentData, mod.id);
    const ok  = mp.status === "completed";
    const lk  = mp.status === "locked";
    const ico = ok ? "✅" : lk ? "🔒" : "▶️";
    const cls = ok ? "done" : lk ? "locked-icon" : "active";
    const card = el("div", { class: `module-card${lk ? " locked" : ""}${ok ? " completed" : ""}` });
    card.innerHTML = `
      <div class="module-num">${mod.icon || mod.id}<div class="mod-label">Module ${mod.id}</div></div>
      <div class="module-info">
        <div class="module-title">${mod.title}</div>
        <div class="module-desc">${mod.description}</div>
        <div class="module-meta">
          <span class="meta-tag">⏱ ${mod.duration}</span>
          <span class="meta-tag">📝 5 Questions</span>
          ${ok ? `<span class="meta-tag gold">🏆 Score: ${mp.score}/5</span>` : ""}
          ${lk ? `<span class="meta-tag" style="background:#f3f4f6;color:#6b7280;">🔒 Complete previous module first</span>` : ""}
        </div>
      </div>
      <div class="module-action"><div class="status-icon ${cls}">${ico}</div></div>`;
    card.onclick = lk ? () => toast("Complete the previous module to unlock this one.", "info") : () => showReader(mod.id);
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

  showLoading("Opening module…");
  let sd;
  try { sd = await dbGetStudent(sid) || {}; } catch { sd = {}; }
  hideLoading();

  const mp = getModProg(sd, moduleId);
  dbAddLog({ type: "read_start", user: name, sid, module: mod.title, message: `${name} opened Module ${moduleId}: ${mod.title}` });

  const wrap = el("div");
  wrap.appendChild(buildTopbar(name, false));
  const pw = el("div", { class: "page-wrap" });
  const ct = el("div", { class: "container reader-page" });
  pw.appendChild(ct); wrap.appendChild(pw);

  const alreadyDone = mp.status === "completed";

  ct.innerHTML = `
  <div class="reader-header">
    <div class="reader-header-left">
      <h2>Module ${moduleId}: ${mod.title}</h2>
      <p>${mod.description}</p>
    </div>
    <div class="reader-progress" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
      <span style="font-size:.75rem;color:var(--kiu-green);background:var(--kiu-green-pale);padding:4px 12px;border-radius:99px;font-weight:600;">⏱ ${mod.duration}</span>
      <button class="btn btn-outline" id="back-btn" style="background:var(--kiu-green-pale);color:var(--kiu-green);border-color:var(--border);">← Dashboard</button>
    </div>
  </div>

  <div class="reader-body" id="rscroll">
    <div class="reading-content">${mod.content}</div>

    <!-- Reading Confirmation -->
    <div style="margin-top:52px;padding-top:32px;border-top:2px solid var(--kiu-green-pale);">
      <div id="confirm-box" style="background:${alreadyDone ? "var(--kiu-green-pale)" : "#fffbeb"};border:2px solid ${alreadyDone ? "var(--kiu-green-mid)" : "var(--kiu-gold)"};border-radius:var(--radius-lg);padding:28px 32px;">
        <p style="font-family:var(--font-display);font-size:1.15rem;color:var(--kiu-green-deep);margin-bottom:10px;">
          ${alreadyDone ? "✅ You have already completed this module." : "📋 Reading Confirmation"}
        </p>
        <p style="font-size:.9rem;color:var(--text-mid);line-height:1.75;margin-bottom:${alreadyDone ? "0" : "20px"};">
          ${alreadyDone
            ? "You completed this module and passed the quiz. You may review the content above or retake the quiz."
            : "Before proceeding to the quiz, please confirm that you have thoroughly read and understood all the material in this module — including all sections, key concepts, tables, and examples presented above."}
        </p>
        ${alreadyDone ? "" : `
        <label id="chk-label" style="display:flex;align-items:flex-start;gap:16px;cursor:pointer;padding:16px 20px;background:white;border-radius:var(--radius-md);border:2px solid var(--border);transition:all .25s;">
          <input type="checkbox" id="read-chk" style="width:22px;height:22px;cursor:pointer;accent-color:var(--kiu-green);flex-shrink:0;margin-top:2px;">
          <span style="font-size:.92rem;color:var(--text-dark);line-height:1.65;">
            <strong style="color:var(--kiu-green-deep);">I confirm that I have read and understood all the material in<br>Module ${moduleId}: ${mod.title}.</strong><br>
            <span style="color:var(--text-muted);font-size:.85rem;">I am ready to attempt the quiz and accept responsibility for my answers.</span>
          </span>
        </label>`}
      </div>
    </div>
  </div>

  <div class="reader-nav" style="margin-top:20px;padding-bottom:40px;">
    <button class="btn btn-outline" id="back-btn2" style="background:white;color:var(--kiu-green);border-color:var(--border);">← Back to Dashboard</button>
    <button class="btn btn-primary btn-lg" id="quiz-btn" ${alreadyDone ? "" : "disabled"} style="min-width:200px;">
      ${alreadyDone ? "Review Quiz ✓" : "Take Quiz →"}
    </button>
  </div>`;

  ct.querySelector("#back-btn").onclick  = showDashboard;
  ct.querySelector("#back-btn2").onclick = showDashboard;

  const qBtn = ct.querySelector("#quiz-btn");

  if (!alreadyDone) {
    const chk   = ct.querySelector("#read-chk");
    const label = ct.querySelector("#chk-label");
    chk.addEventListener("change", () => {
      if (chk.checked) {
        qBtn.disabled = false;
        label.style.borderColor = "var(--kiu-green-mid)";
        label.style.background  = "var(--kiu-green-pale)";
        ct.querySelector("#confirm-box").style.borderColor = "var(--kiu-green-mid)";
        ct.querySelector("#confirm-box").style.background  = "var(--kiu-green-pale)";
        toast("Reading confirmed ✅ — quiz is now unlocked!", "success");
      } else {
        qBtn.disabled = true;
        label.style.borderColor = "var(--border)";
        label.style.background  = "white";
      }
    });
  }

  qBtn.onclick = () => startQuiz(moduleId);
  render(wrap);
}

/* ─────────────────────────────────────────────
   QUIZ ENGINE
───────────────────────────────────────────── */
function startQuiz(moduleId) {
  const mod = window.COURSE.modules.find(m => m.id === moduleId);
  APP.currentModule  = moduleId;
  APP.currentQIndex  = 0;
  APP.quizAnswers    = mod.quiz.map(() => ({ chosen: null, correct: false, attemptsUsed: 0 }));
  dbAddLog({ type: "quiz_start", user: APP.currentUser.name, sid: APP.currentUser.sid, module: mod.title, message: `${APP.currentUser.name} started quiz for Module ${moduleId}` });
  showQuestion(moduleId);
}

function showQuestion(moduleId) {
  const mod = window.COURSE.modules.find(m => m.id === moduleId);
  const qi  = APP.currentQIndex;
  const q   = mod.quiz[qi];
  const MAX = 3;
  const rec = APP.quizAnswers[qi];

  const dots = mod.quiz.map((_, i) => {
    const c = i < qi ? (APP.quizAnswers[i].correct ? "done" : "wrong") : i === qi ? "active" : "";
    return `<div class="q-dot ${c}"></div>`;
  }).join("");

  const attDots = (left) => Array.from({ length: MAX }, (_, i) =>
    `<div class="attempt-dot ${i >= left ? "used" : ""}"></div>`).join("");

  document.getElementById("quiz-overlay")?.remove();
  const ov = el("div", { class: "quiz-overlay", id: "quiz-overlay" });

  ov.innerHTML = `
  <div class="quiz-card">
    <div class="quiz-header">
      <div class="quiz-module-tag">Module ${moduleId} — ${mod.title}</div>
      <h2>📝 Knowledge Check</h2>
      <div class="quiz-progress-row">${dots}</div>
    </div>
    <div class="question-body">
      <div class="question-num">Question ${qi + 1} of ${mod.quiz.length}</div>
      <div class="question-text">${q.question}</div>
    </div>
    <div class="attempts-row">
      <span class="attempts-label">Attempts remaining:</span>
      <div class="attempts-dots" id="adots">${attDots(MAX - rec.attemptsUsed)}</div>
    </div>
    <div class="options-list" id="opts">
      ${q.options.map((opt, oi) => `
        <button class="option-btn" data-i="${oi}">
          <span class="option-letter">${String.fromCharCode(65 + oi)}</span>
          <span>${opt}</span>
        </button>`).join("")}
    </div>
    <div class="feedback-box" id="fb"></div>
    <div class="quiz-footer">
      <button class="btn btn-green" id="sub-btn" disabled>Submit Answer</button>
    </div>
  </div>`;

  let sel = null;
  const opts  = () => ov.querySelectorAll(".option-btn");
  const subm  = () => ov.querySelector("#sub-btn");
  const fb    = () => ov.querySelector("#fb");
  const adots = () => ov.querySelector("#adots");

  opts().forEach(btn => {
    btn.onclick = () => {
      opts().forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      sel = parseInt(btn.getAttribute("data-i"));
      subm().disabled = false;
    };
  });

  function bindSubmit(getSelected) {
    subm().onclick = () => {
      const chosen = typeof getSelected === "function" ? getSelected() : sel;
      if (chosen === null || chosen === undefined) return;
      handleAnswer(chosen);
    };
  }

  function handleAnswer(chosen) {
    rec.attemptsUsed++;
    rec.chosen = chosen;
    const isRight = chosen === q.correct;
    opts().forEach(b => b.disabled = true);

    if (isRight) {
      rec.correct = true;
      opts()[q.correct].classList.add("correct");
      fb().className = "feedback-box correct-fb show";
      fb().innerHTML = `✅ <strong>Correct!</strong> ${q.explanation}`;
      subm().textContent = qi < mod.quiz.length - 1 ? "Next Question →" : "See Results 🏆";
      subm().disabled = false;
      subm().onclick = advance;
    } else {
      opts()[chosen].classList.add("wrong-choice");
      const left = MAX - rec.attemptsUsed;
      adots().innerHTML = attDots(left);

      if (left <= 0) {
        opts()[q.correct].classList.add("correct");
        fb().className = "feedback-box wrong-fb show";
        fb().innerHTML = `❌ <strong>Incorrect.</strong> Correct answer: <strong>${String.fromCharCode(65 + q.correct)}: ${q.options[q.correct]}</strong><br><br>
          📖 <strong>Suggested Reading:</strong><br>
          <span class="read-hint" id="hint-link">📌 ${q.hint}</span>`;
        ov.querySelector("#hint-link").onclick = () => { ov.remove(); showReaderAtSection(moduleId, q.hintSection); };
        subm().textContent = qi < mod.quiz.length - 1 ? "Next Question →" : "See Results 🏆";
        subm().disabled = false;
        subm().onclick = advance;
      } else {
        fb().className = "feedback-box wrong-fb show";
        fb().innerHTML = `❌ <strong>Incorrect.</strong> <strong>${left}</strong> attempt${left !== 1 ? "s" : ""} remaining.<br><br>📖 <em>${q.hint}</em>`;
        setTimeout(() => {
          opts().forEach(b => { b.disabled = false; b.classList.remove("selected","wrong-choice"); });
          subm().disabled = true;
          subm().textContent = "Submit Answer";
          let sel2 = null;
          opts().forEach(btn => {
            btn.onclick = () => {
              opts().forEach(b => b.classList.remove("selected"));
              btn.classList.add("selected");
              sel2 = parseInt(btn.getAttribute("data-i"));
              subm().disabled = false;
            };
          });
          bindSubmit(() => sel2);
        }, 1200);
      }
    }
  }

  function advance() {
    if (qi < mod.quiz.length - 1) { APP.currentQIndex++; ov.remove(); showQuestion(moduleId); }
    else { ov.remove(); showResults(moduleId); }
  }

  bindSubmit(() => sel);
  document.getElementById("app").appendChild(ov);
}

function showReaderAtSection(moduleId, sectionId) {
  showReader(moduleId);
  setTimeout(() => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    const btn = document.querySelector("#quiz-btn");
    if (btn) { btn.disabled = false; btn.textContent = "Continue Quiz →"; }
  }, 700);
}

/* ─────────────────────────────────────────────
   RESULTS
───────────────────────────────────────────── */
async function showResults(moduleId) {
  const mod   = window.COURSE.modules.find(m => m.id === moduleId);
  const { name, sid } = APP.currentUser;
  const score = APP.quizAnswers.filter(a => a.correct).length;
  const pass  = score >= 3;

  showLoading("Saving your results…");
  try {
    const sd = await dbGetStudent(sid) || {};
    setModProg(sd, moduleId, { status: "completed", score, pass, completedAt: new Date().toISOString() });
    const next = window.COURSE.modules.find(m => m.id === moduleId + 1);
    if (next && getModProg(sd, next.id).status === "locked") setModProg(sd, next.id, { status: "unlocked" });
    sd.name = name; sd.sid = sid;
    await dbSaveStudent(sd);
    dbAddLog({ type: "quiz_complete", user: name, sid, module: mod.title, score, pass, message: `${name} (${sid}) completed Module ${moduleId}. Score: ${score}/5. ${pass ? "PASSED ✅" : "FAILED ❌"}` });
    hideLoading();
  } catch (err) {
    hideLoading();
    toast("Could not save to server — check connection.", "warn");
  }

  const nextMod = window.COURSE.modules.find(m => m.id === moduleId + 1);
  const ov = el("div", { class: "quiz-overlay" });
  ov.innerHTML = `
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
        ? `You scored ${score}/5. ${nextMod ? `Module ${moduleId + 1} is now unlocked!` : "You completed the entire course — well done!"}`
        : `You scored ${score}/5. Review the reading and try again.`}</p>
    </div>
    <div style="margin:20px 0;">
      ${APP.quizAnswers.map((a, i) => {
        const q = mod.quiz[i];
        return `<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);font-size:.88rem;">
          <span>${a.correct ? "✅" : "❌"}</span>
          <span style="flex:1;">${q.question.substring(0, 65)}…</span>
          <span class="pill ${a.correct ? "pill-green" : "pill-red"}">${a.correct ? "Correct" : "Wrong"}</span>
        </div>`;
      }).join("")}
    </div>
    <div class="quiz-footer" style="justify-content:space-between;flex-wrap:wrap;gap:10px;">
      ${!pass ? `<button class="btn btn-outline" id="retry-btn" style="color:var(--kiu-green);border-color:var(--kiu-green);">🔄 Retry Quiz</button>` : ""}
      <button class="btn btn-primary btn-lg" id="cont-btn">${nextMod && pass ? "Next Module →" : "Back to Dashboard"}</button>
    </div>
  </div>`;
  ov.querySelector("#retry-btn")?.addEventListener("click", () => { ov.remove(); startQuiz(moduleId); });
  ov.querySelector("#cont-btn").onclick = () => { ov.remove(); nextMod && pass ? showReader(moduleId + 1) : showDashboard(); };
  document.getElementById("app").appendChild(ov);
}

/* ─────────────────────────────────────────────
   ADMIN DASHBOARD — reads ALL students from Google Sheets
───────────────────────────────────────────── */
async function showAdminDashboard() {
  showLoading("Fetching all students..........");
  let allStudents = [], logs = [];
  try {
    [allStudents, logs] = await Promise.all([dbGetAllStudents(), dbGetLogs(150)]);
  } catch (err) {
    hideLoading();
    toast("Error loading data: " + err.message, "error");
    allStudents = []; logs = [];
  }
  hideLoading();

  const modules = window.COURSE.modules;
  let totCompleted = 0, totPassed = 0;
  allStudents.forEach(u => {
    modules.forEach(m => {
      const mp = getModProg(u, m.id);
      if (mp.status === "completed") totCompleted++;
      if (mp.status === "completed" && mp.pass) totPassed++;
    });
  });

  const wrap = el("div");
  wrap.appendChild(buildTopbar("Administrator", true));
  const pw = el("div", { class: "page-wrap" });
  const ct = el("div", { class: "container", style: "padding-top:36px;padding-bottom:60px;" });
  pw.appendChild(ct); wrap.appendChild(pw);

  ct.innerHTML = `
  <div class="admin-header">
    <div>
      <h1>🔑 Administrator Dashboard</h1>
      <p>Monitor all student activity across Management Information Systems</p>
      <p style="font-size:.75rem;opacity:.7;margin-top:4px;">
        ${DEMO_MODE
          ? "⚠ Demo Mode — showing students from this device only"
          : `🟢 Live — showing ALL ${allStudents.length} students from every device`}
      </p>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <button class="btn btn-green btn-sm" id="refresh-btn">🔄 Refresh</button>
      <button class="btn btn-primary" id="dl-csv">⬇ Download CSV</button>
      <button class="btn btn-outline" id="dl-log">⬇ Download Logs</button>
    </div>
  </div>

  <!-- Stats -->
  <div class="stats-grid">
    <div class="stat-card"><div class="stat-icon">👥</div><div class="stat-num">${allStudents.length}</div><div class="stat-label">Registered Students</div></div>
    <div class="stat-card"><div class="stat-icon">✅</div><div class="stat-num">${totCompleted}</div><div class="stat-label">Modules Completed</div></div>
    <div class="stat-card"><div class="stat-icon">🏆</div><div class="stat-num">${totPassed}</div><div class="stat-label">Modules Passed</div></div>
    <div class="stat-card"><div class="stat-icon">📚</div><div class="stat-num">${modules.length}</div><div class="stat-label">Total Modules</div></div>
    <div class="stat-card"><div class="stat-icon">📋</div><div class="stat-num">${logs.length}</div><div class="stat-label">Activity Events</div></div>
  </div>

  <!-- Student table -->
  <div class="table-wrap" style="margin-bottom:28px;">
    <div class="table-head">
      <h3>📊 Student Progress
        <span style="font-size:.75rem;font-weight:400;color:var(--text-muted);margin-left:8px;">${allStudents.length} student${allStudents.length !== 1 ? "s" : ""}</span>
      </h3>
      <input class="search-box" id="s-search" placeholder="🔍 Search by name or student no…">
    </div>
    <div style="overflow-x:auto;">
      <table class="data-table">
        <thead><tr>
          <th>#</th><th>Student Name</th><th>Student No.</th><th>Registered</th>
          ${modules.map(m => `<th title="${m.title}">M${m.id}</th>`).join("")}
          <th>Overall</th>
        </tr></thead>
        <tbody id="s-tbody"></tbody>
      </table>
    </div>
  </div>

  <!-- Activity log -->
  <div class="table-wrap">
    <div class="table-head">
      <h3>🕐 Activity Log <span style="font-size:.75rem;font-weight:400;color:var(--text-muted);">(latest ${logs.length})</span></h3>
      <button class="btn btn-sm btn-danger" id="clear-logs">🗑 Clear Logs</button>
    </div>
    <div class="activity-log" id="act-log" style="max-height:420px;overflow-y:auto;"></div>
  </div>`;

  /* Populate rows */
  function renderRows(filter = "") {
    const tbody = ct.querySelector("#s-tbody");
    tbody.innerHTML = "";
    const filtered = allStudents.filter(u =>
      (u.name || "").toLowerCase().includes(filter.toLowerCase()) ||
      (u.sid  || "").toLowerCase().includes(filter.toLowerCase())
    );
    if (!filtered.length) {
      tbody.innerHTML = `<tr><td colspan="${4 + modules.length + 1}" style="text-align:center;padding:28px;color:var(--text-muted);">${filter ? "No students match your search." : "No students registered yet."}</td></tr>`;
      return;
    }
    filtered.forEach((u, idx) => {
      let done = 0;
      const cells = modules.map(m => {
        const mp = getModProg(u, m.id);
        if (mp.status === "completed") done++;
        const cls  = mp.status === "completed" ? (mp.pass ? "pill-green" : "pill-red") : mp.status === "unlocked" ? "pill-gold" : "pill-gray";
        const text = mp.status === "completed" ? `${mp.score}/5${mp.pass ? "✓" : "✗"}` : mp.status === "unlocked" ? "Open" : "Locked";
        return `<td><span class="pill ${cls}" style="white-space:nowrap;">${text}</span></td>`;
      }).join("");
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="color:var(--text-muted);font-size:.8rem;">${idx + 1}</td>
        <td><strong>${u.name || "—"}</strong></td>
        <td><code style="font-size:.8rem;">${u.sid || "—"}</code></td>
        <td style="font-size:.8rem;color:var(--text-muted);">${u.registeredAt ? new Date(u.registeredAt).toLocaleDateString("en-UG",{day:"2-digit",month:"short",year:"numeric"}) : "—"}</td>
        ${cells}
        <td><span class="pill ${done === modules.length ? "pill-green" : done > 0 ? "pill-gold" : "pill-gray"}">${done}/${modules.length} (${Math.round(done/modules.length*100)}%)</span></td>`;
      tbody.appendChild(tr);
    });
  }
  renderRows();
  ct.querySelector("#s-search").oninput = e => renderRows(e.target.value);

  /* Activity log */
  const logWrap = ct.querySelector("#act-log");
  if (!logs.length) {
    logWrap.innerHTML = `<div class="activity-item"><span style="color:var(--text-muted);">No activity recorded yet.</span></div>`;
  } else {
    logs.forEach(log => {
      const d = new Date(log.ts);
      const t = isNaN(d) ? log.ts : `${d.toLocaleDateString("en-UG")} ${d.toLocaleTimeString("en-UG",{hour:"2-digit",minute:"2-digit"})}`;
      const dot = log.type === "quiz_complete" ? (log.pass ? "var(--kiu-green-mid)" : "#e74c3c") : log.type === "registration" ? "var(--kiu-gold)" : "var(--kiu-green-light)";
      const div = el("div", { class: "activity-item" });
      div.innerHTML = `
        <div class="activity-dot" style="background:${dot}"></div>
        <span style="flex:1;font-size:.86rem;">${log.message || log.type}</span>
        ${log.type === "quiz_complete" ? `<span class="pill ${log.pass ? "pill-green" : "pill-red"}">${log.score}/5</span>` : ""}
        <span class="activity-time">${t}</span>`;
      logWrap.appendChild(div);
    });
  }

  /* Buttons */
  ct.querySelector("#refresh-btn").onclick = showAdminDashboard;

  ct.querySelector("#clear-logs").onclick = async () => {
    if (!confirm("Clear all activity logs? This cannot be undone.")) return;
    showLoading("Clearing logs…");
    await dbClearLogs();
    hideLoading();
    toast("Logs cleared.", "info");
    showAdminDashboard();
  };

  ct.querySelector("#dl-csv").onclick = () => {
    let csv = `"#","Student Name","Student Number","Registered"`;
    modules.forEach(m => { csv += `,"M${m.id} Score","M${m.id} Status","M${m.id} Pass"`; });
    csv += `,"Overall"\n`;
    allStudents.forEach((u, idx) => {
      let done = 0;
      let row  = `"${idx+1}","${u.name}","${u.sid}","${u.registeredAt ? new Date(u.registeredAt).toLocaleDateString() : ""}"`;
      modules.forEach(m => {
        const mp = getModProg(u, m.id);
        if (mp.status === "completed") done++;
        row += `,"${mp.score != null ? mp.score+"/5" : "—"}","${mp.status}","${mp.pass === true ? "Yes" : mp.status === "completed" ? "No" : "—"}"`;
      });
      row += `,"${done}/${modules.length}"`;
      csv += row + "\n";
    });
    dlFile("KIU_LMS_Progress.csv", csv, "text/csv");
    toast("CSV downloaded!", "success");
  };

  ct.querySelector("#dl-log").onclick = () => {
    let txt = `KIU-Learners Pace — Activity Log\nGenerated: ${new Date().toLocaleString()}\n${"=".repeat(70)}\n\n`;
    logs.forEach(l => { txt += `[${l.ts}] ${l.message || l.type}\n`; });
    dlFile("KIU_LMS_Logs.txt", txt, "text/plain");
    toast("Log downloaded!", "success");
  };

  render(wrap);
}

function dlFile(name, content, mime) {
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(new Blob([content], { type: mime })), download: name
  });
  a.click(); URL.revokeObjectURL(a.href);
}

/* ─────────────────────────────────────────────
   INIT
───────────────────────────────────────────── */
window.addEventListener("DOMContentLoaded", () => {
  initAPI();
  setTimeout(async () => {
    const session = loadSession();
    if (session) {
      APP.currentUser = { name: session.name, sid: session.sid };
      APP.isAdmin     = session.isAdmin || false;
      if (APP.isAdmin) { showAdminDashboard(); return; }
      showDashboard(); return;
    }
    DEMO_MODE ? showSetupScreen() : showLogin();
  }, 1700);
});
