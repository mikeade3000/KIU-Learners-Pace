/* ============================================================
   KIU-Learners Pace — Application Logic (app.js)
   SPA | LocalStorage-backed | GitHub-Pages compatible
   ============================================================ */

/* ── CONSTANTS ── */
const ADMIN = { username: "kiu.admin", password: "KIU@Admin2025!" };
const STORAGE_KEY = "kiu_lms_v2";
const LOG_KEY = "kiu_lms_logs_v2";
const PAGE_MIN = 10; // minimum "pages" before quiz unlocks (simulated by scroll %)

/* ── STATE ── */
let APP = {
  currentUser: null,
  isAdmin: false,
  currentModule: null,
  currentQuiz: null,
  currentQIndex: 0,
  attemptCount: 0,
  quizAnswers: [],
  scrollPercent: 0,
};

/* ─────────────────────────────────────────────
   STORAGE HELPERS
───────────────────────────────────────────── */
function getDB() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { users: {}, progress: {} }; }
  catch { return { users: {}, progress: {} }; }
}
function saveDB(db) { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); }

function getLogs() {
  try { return JSON.parse(localStorage.getItem(LOG_KEY)) || []; }
  catch { return []; }
}
function addLog(entry) {
  const logs = getLogs();
  logs.unshift({ ...entry, ts: new Date().toISOString() });
  if (logs.length > 2000) logs.length = 2000;
  localStorage.setItem(LOG_KEY, JSON.stringify(logs));
}

function getUserProgress(username) {
  const db = getDB();
  if (!db.progress[username]) db.progress[username] = {};
  return db.progress[username];
}
function saveProgress(username, data) {
  const db = getDB();
  if (!db.progress[username]) db.progress[username] = {};
  Object.assign(db.progress[username], data);
  saveDB(db);
}
function getModuleProgress(username, moduleId) {
  const p = getUserProgress(username);
  return p[`mod_${moduleId}`] || { status: "locked", score: null, attempts: 0, completedAt: null };
}
function saveModuleProgress(username, moduleId, data) {
  const p = getUserProgress(username);
  p[`mod_${moduleId}`] = { ...(p[`mod_${moduleId}`] || {}), ...data };
  saveProgress(username, p);
}

/* ─────────────────────────────────────────────
   ROUTING
───────────────────────────────────────────── */
function render(view) {
  const app = document.getElementById("app");
  app.innerHTML = "";
  app.appendChild(view);
}

/* ─────────────────────────────────────────────
   TOAST
───────────────────────────────────────────── */
function toast(msg, type = "success") {
  let wrap = document.getElementById("toast-wrap");
  if (!wrap) {
    wrap = el("div", { id: "toast-wrap", class: "toast-wrap" });
    document.body.appendChild(wrap);
  }
  const icons = { success: "✅", error: "❌", info: "ℹ️" };
  const t = el("div", { class: `toast ${type}` }, `${icons[type] || ""} ${msg}`);
  wrap.appendChild(t);
  setTimeout(() => { t.classList.add("removing"); setTimeout(() => t.remove(), 350); }, 3200);
}

/* ─────────────────────────────────────────────
   DOM HELPERS
───────────────────────────────────────────── */
function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") e.className = v;
    else if (k === "style") e.style.cssText = v;
    else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  children.forEach(c => {
    if (c == null) return;
    if (typeof c === "string") e.insertAdjacentHTML("beforeend", c);
    else e.appendChild(c);
  });
  return e;
}
function qs(sel, ctx = document) { return ctx.querySelector(sel); }

/* ─────────────────────────────────────────────
   TOPBAR
───────────────────────────────────────────── */
function buildTopbar(user, isAdmin) {
  const initials = isAdmin ? "AD" : user.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const topbar = el("nav", { class: "topbar" });
  topbar.innerHTML = `
    <div class="topbar-brand">
      <img src="assets/kiu-logo.jpg" class="topbar-logo" alt="KIU Logo">
      <div class="topbar-title">KIU-Learners Pace<span>Kampala International University</span></div>
    </div>
    <div class="topbar-right">
      <div class="topbar-user">
        <div class="avatar">${initials}</div>
        <span style="color:rgba(255,255,255,.85);font-size:.88rem;">${isAdmin ? "Administrator" : user}</span>
      </div>
      <button class="btn btn-outline" id="logout-btn">Sign Out</button>
    </div>
  `;
  topbar.querySelector("#logout-btn").onclick = logout;
  return topbar;
}

/* ─────────────────────────────────────────────
   LOGIN PAGE
───────────────────────────────────────────── */
function showLogin() {
  const page = document.createElement("div");
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
            <input class="form-input" id="stu-name" type="text" placeholder="e.g. Nakato Sarah" maxlength="60">
          </div>
          <div class="form-group">
            <label class="form-label">Student Number</label>
            <input class="form-input" id="stu-id" type="text" placeholder="e.g. KIU/2024/001" maxlength="30">
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input class="form-input" id="stu-pass" type="password" placeholder="Create or enter your password">
          </div>
          <button class="btn btn-primary btn-block btn-lg" id="stu-login-btn" style="margin-top:8px;">Start Learning →</button>
        </div>
        <div id="admin-form" class="hidden">
          <div class="form-group">
            <label class="form-label">Admin Username</label>
            <input class="form-input" id="adm-user" type="text" placeholder="kiu.admin">
          </div>
          <div class="form-group">
            <label class="form-label">Admin Password</label>
            <input class="form-input" id="adm-pass" type="password" placeholder="Enter admin password">
          </div>
          <button class="btn btn-primary btn-block btn-lg" id="adm-login-btn" style="margin-top:8px;">Access Dashboard →</button>
        </div>
        <div class="divider"></div>
        <p style="text-align:center;font-size:.78rem;color:var(--text-muted);">Introduction to Computing — ICT 1101 | © 2025 KIU</p>
      </div>
    </div>
  </div>`;

  const tabStu = page.querySelector("#tab-student");
  const tabAdm = page.querySelector("#tab-admin");
  const stuForm = page.querySelector("#student-form");
  const admForm = page.querySelector("#admin-form");
  const errBox = page.querySelector("#form-error");

  function showErr(msg) { errBox.textContent = msg; errBox.classList.add("show"); }
  function hideErr() { errBox.classList.remove("show"); }

  tabStu.onclick = () => {
    tabStu.classList.add("active"); tabAdm.classList.remove("active");
    stuForm.classList.remove("hidden"); admForm.classList.add("hidden"); hideErr();
  };
  tabAdm.onclick = () => {
    tabAdm.classList.add("active"); tabStu.classList.remove("active");
    admForm.classList.remove("hidden"); stuForm.classList.add("hidden"); hideErr();
  };

  page.querySelector("#stu-login-btn").onclick = () => {
    const name = page.querySelector("#stu-name").value.trim();
    const sid = page.querySelector("#stu-id").value.trim();
    const pass = page.querySelector("#stu-pass").value;
    if (!name || !sid || !pass) { showErr("Please fill in all fields."); return; }
    if (name.length < 3) { showErr("Please enter your full name."); return; }
    const db = getDB();
    const key = sid.toLowerCase();
    if (db.users[key]) {
      if (db.users[key].password !== btoa(pass)) { showErr("Incorrect password for this student number."); return; }
      if (db.users[key].name !== name) { showErr("Name does not match this student number."); return; }
    } else {
      db.users[key] = { name, sid, password: btoa(pass), registeredAt: new Date().toISOString() };
      saveDB(db);
      addLog({ type: "registration", user: name, sid, message: `${name} registered.` });
    }
    APP.currentUser = { name, sid };
    APP.isAdmin = false;
    addLog({ type: "login", user: name, sid, message: `${name} signed in.` });
    // Unlock module 1 if not already
    const mp = getModuleProgress(sid, 1);
    if (mp.status === "locked") saveModuleProgress(sid, 1, { status: "unlocked" });
    showDashboard();
  };

  // Enter key support
  ["stu-name","stu-id","stu-pass"].forEach(id => {
    page.querySelector(`#${id}`).addEventListener("keydown", e => { if(e.key==="Enter") page.querySelector("#stu-login-btn").click(); });
  });

  page.querySelector("#adm-login-btn").onclick = () => {
    const u = page.querySelector("#adm-user").value.trim();
    const p = page.querySelector("#adm-pass").value;
    if (u !== ADMIN.username || p !== ADMIN.password) { showErr("Invalid administrator credentials."); return; }
    APP.isAdmin = true;
    APP.currentUser = { name: "Administrator", sid: "admin" };
    addLog({ type: "admin_login", user: "Administrator", message: "Admin signed in." });
    showAdminDashboard();
  };

  ["adm-user","adm-pass"].forEach(id => {
    page.querySelector(`#${id}`).addEventListener("keydown", e => { if(e.key==="Enter") page.querySelector("#adm-login-btn").click(); });
  });

  render(page);
}

function logout() {
  if (APP.currentUser) addLog({ type: "logout", user: APP.currentUser.name, sid: APP.currentUser.sid || "", message: `${APP.currentUser.name} signed out.` });
  APP = { currentUser: null, isAdmin: false, currentModule: null, currentQuiz: null, currentQIndex: 0, attemptCount: 0, quizAnswers: [], scrollPercent: 0 };
  showLogin();
}

/* ─────────────────────────────────────────────
   STUDENT DASHBOARD
───────────────────────────────────────────── */
function showDashboard() {
  const { name, sid } = APP.currentUser;
  const modules = window.COURSE.modules;

  // Compute overall progress
  let doneCount = 0;
  modules.forEach(m => {
    const mp = getModuleProgress(sid, m.id);
    if (mp.status === "completed") doneCount++;
  });
  const pct = Math.round((doneCount / modules.length) * 100);

  const wrap = el("div");
  wrap.appendChild(buildTopbar(name, false));

  const pageWrap = el("div", { class: "page-wrap" });
  const cont = el("div", { class: "container" });
  pageWrap.appendChild(cont);
  wrap.appendChild(pageWrap);

  // Welcome banner with progress ring
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
            <div class="progress-ring-label">
              <strong>${pct}%</strong>
              <span>Done</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <h2 class="section-title">📖 Course Modules</h2>
    <div class="modules-grid" id="modules-grid"></div>
    ${doneCount === modules.length ? `
    <div class="completion-banner">
      <h2>🎉 Course Complete!</h2>
      <p>Congratulations! You have successfully completed all 5 modules of Introduction to Computing.</p>
    </div>` : ""}
  </div>`;

  const grid = cont.querySelector("#modules-grid");
  modules.forEach((mod, i) => {
    const mp = getModuleProgress(sid, mod.id);
    const isCompleted = mp.status === "completed";
    const isLocked = mp.status === "locked";
    const isUnlocked = mp.status === "unlocked";

    let statusIcon, statusClass;
    if (isCompleted) { statusIcon = "✅"; statusClass = "done"; }
    else if (isLocked) { statusIcon = "🔒"; statusClass = "locked-icon"; }
    else { statusIcon = "▶️"; statusClass = "active"; }

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
          ${isLocked ? `<span class="meta-tag" style="background:#f3f4f6;color:#6b7280;">🔒 Complete previous module</span>` : ""}
        </div>
      </div>
      <div class="module-action"><div class="status-icon ${statusClass}">${statusIcon}</div></div>
    `;

    if (!isLocked) {
      card.onclick = () => showReader(mod.id);
    } else {
      card.onclick = () => toast("Complete the previous module to unlock this one.", "info");
    }
    grid.appendChild(card);
  });

  render(wrap);
}

/* ─────────────────────────────────────────────
   READER
───────────────────────────────────────────── */
function showReader(moduleId) {
  const mod = window.COURSE.modules.find(m => m.id === moduleId);
  if (!mod) return;
  APP.currentModule = moduleId;
  const { name, sid } = APP.currentUser;
  const mp = getModuleProgress(sid, moduleId);

  addLog({ type: "read_start", user: name, sid, module: mod.title, message: `${name} opened Module ${moduleId}: ${mod.title}` });

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
    <div style="display:flex;align-items:center;gap:12px;">
      <span id="scroll-hint" style="font-size:.85rem;color:var(--text-muted);">📜 Read to the end to unlock the quiz</span>
      <button class="btn btn-primary btn-lg" id="start-quiz-btn" disabled>Take Quiz →</button>
    </div>
  </div>`;

  cont.querySelector("#back-btn").onclick = () => showDashboard();
  cont.querySelector("#back-btn2").onclick = () => showDashboard();

  const scrollArea = cont.querySelector("#reader-scroll-area");
  const quizBtn = cont.querySelector("#start-quiz-btn");
  const pageDisplay = cont.querySelector("#page-display");
  const scrollHint = cont.querySelector("#scroll-hint");

  // If already completed, enable quiz immediately
  if (mp.status === "completed") {
    quizBtn.disabled = false;
    quizBtn.textContent = "Review Quiz ✓";
    scrollHint.textContent = "✅ Module completed";
  }

  // Track scroll to "unlock" quiz
  let readUnlocked = mp.status === "completed";
  function onScroll() {
    const sh = scrollArea.scrollHeight - scrollArea.clientHeight;
    const pct = sh > 0 ? (scrollArea.scrollTop / sh) * 100 : 100;
    // Simulate 10-page progress
    const simulatedPage = Math.min(10, Math.max(1, Math.ceil(pct / 10)));
    pageDisplay.textContent = `Page ${simulatedPage} / 10+`;
    if (pct >= 90 && !readUnlocked) {
      readUnlocked = true;
      quizBtn.disabled = false;
      quizBtn.style.animation = "fadeUp .3s ease";
      scrollHint.textContent = "✅ Reading complete! Start the quiz.";
      toast("You've read the material! The quiz is now unlocked.", "success");
    }
  }
  scrollArea.addEventListener("scroll", onScroll);

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
  APP.attemptCount = 0;
  APP.quizAnswers = new Array(mod.quiz.length).fill(null).map(() => ({ chosen: null, correct: false, attemptsUsed: 0 }));
  addLog({ type: "quiz_start", user: APP.currentUser.name, sid: APP.currentUser.sid, module: mod.title, message: `${APP.currentUser.name} started quiz for Module ${moduleId}` });
  showQuestion(moduleId);
}

function showQuestion(moduleId) {
  const mod = window.COURSE.modules.find(m => m.id === moduleId);
  const qi = APP.currentQIndex;
  const q = mod.quiz[qi];
  const totalQ = mod.quiz.length;
  const maxAttempts = 3;
  const answerRecord = APP.quizAnswers[qi];
  const attemptsLeft = maxAttempts - answerRecord.attemptsUsed;

  // Build dots
  const dotsHTML = mod.quiz.map((_, idx) => {
    let cls = "";
    if (idx < qi) cls = APP.quizAnswers[idx].correct ? "done" : "wrong";
    else if (idx === qi) cls = "active";
    return `<div class="q-dot ${cls}"></div>`;
  }).join("");

  // Attempt dots
  const attDots = Array.from({ length: maxAttempts }, (_, i) => `<div class="attempt-dot ${i >= attemptsLeft ? "used" : ""}"></div>`).join("");

  const overlay = el("div", { class: "quiz-overlay", id: "quiz-overlay" });
  overlay.innerHTML = `
  <div class="quiz-card">
    <div class="quiz-header">
      <div class="quiz-module-tag">Module ${moduleId} — ${mod.title}</div>
      <h2>📝 Knowledge Check</h2>
      <div class="quiz-progress-row">${dotsHTML}</div>
    </div>
    <div class="question-body">
      <div class="question-num">Question ${qi + 1} of ${totalQ}</div>
      <div class="question-text">${q.question}</div>
    </div>
    <div class="attempts-row">
      <span class="attempts-label">Attempts remaining:</span>
      <div class="attempts-dots" id="att-dots">${attDots}</div>
    </div>
    <div class="options-list" id="options-list">
      ${q.options.map((opt, oi) => `
        <button class="option-btn" data-idx="${oi}" id="opt-${oi}">
          <span class="option-letter">${String.fromCharCode(65+oi)}</span>
          <span>${opt}</span>
        </button>
      `).join("")}
    </div>
    <div class="feedback-box" id="feedback-box"></div>
    <div class="quiz-footer">
      <button class="btn btn-green" id="submit-btn" disabled>Submit Answer</button>
    </div>
  </div>`;

  // Option selection
  let selectedIdx = null;
  overlay.querySelectorAll(".option-btn").forEach(btn => {
    btn.onclick = () => {
      if (answerRecord.correct) return; // already answered correctly
      overlay.querySelectorAll(".option-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedIdx = parseInt(btn.getAttribute("data-idx"));
      overlay.querySelector("#submit-btn").disabled = false;
    };
  });

  // Submit
  overlay.querySelector("#submit-btn").onclick = () => {
    if (selectedIdx === null) return;
    const isCorrect = selectedIdx === q.correct;
    answerRecord.attemptsUsed++;
    answerRecord.chosen = selectedIdx;

    const fb = overlay.querySelector("#feedback-box");
    const opts = overlay.querySelectorAll(".option-btn");
    opts.forEach(b => b.disabled = true);

    if (isCorrect) {
      answerRecord.correct = true;
      opts[q.correct].classList.add("correct");
      fb.className = "feedback-box correct-fb show";
      fb.innerHTML = `✅ <strong>Correct!</strong> ${q.explanation}`;
      overlay.querySelector("#submit-btn").textContent = qi < totalQ - 1 ? "Next Question →" : "See Results 🏆";
      overlay.querySelector("#submit-btn").disabled = false;
      overlay.querySelector("#submit-btn").onclick = () => {
        if (qi < totalQ - 1) { APP.currentQIndex++; overlay.remove(); showQuestion(moduleId); }
        else { overlay.remove(); showResults(moduleId); }
      };
    } else {
      opts[selectedIdx].classList.add("wrong-choice");
      const remainAfter = maxAttempts - answerRecord.attemptsUsed;
      if (remainAfter <= 0) {
        // Reveal correct answer
        opts[q.correct].classList.add("correct");
        fb.className = "feedback-box wrong-fb show";
        fb.innerHTML = `❌ <strong>Incorrect.</strong> The correct answer is <strong>${String.fromCharCode(65+q.correct)}: ${q.options[q.correct]}</strong>.<br><br>
          📖 <strong>Suggested Reading:</strong> Click below to re-read the relevant section.<br>
          <span class="read-hint" data-section="${q.hintSection}">📌 Go back and read: "${q.hint}"</span>`;
        fb.querySelector(".read-hint").onclick = () => {
          overlay.remove();
          showReaderAtSection(moduleId, q.hintSection);
        };
        overlay.querySelector("#submit-btn").textContent = qi < totalQ - 1 ? "Next Question →" : "See Results 🏆";
        overlay.querySelector("#submit-btn").disabled = false;
        overlay.querySelector("#submit-btn").onclick = () => {
          if (qi < totalQ - 1) { APP.currentQIndex++; overlay.remove(); showQuestion(moduleId); }
          else { overlay.remove(); showResults(moduleId); }
        };
      } else {
        fb.className = "feedback-box wrong-fb show";
        fb.innerHTML = `❌ <strong>Incorrect.</strong> You have <strong>${remainAfter}</strong> attempt${remainAfter !== 1 ? "s" : ""} remaining.<br><br>
          📖 <em>${q.hint}</em>`;
        // Update attempt dots
        const newDots = Array.from({ length: maxAttempts }, (_, i) => `<div class="attempt-dot ${i >= remainAfter ? "used" : ""}"></div>`).join("");
        overlay.querySelector("#att-dots").innerHTML = newDots;
        // Re-enable for another attempt
        opts.forEach(b => { b.disabled = false; b.classList.remove("selected","wrong-choice"); });
        selectedIdx = null;
        overlay.querySelector("#submit-btn").disabled = true;
        overlay.querySelector("#submit-btn").textContent = "Submit Answer";
        overlay.querySelector("#submit-btn").onclick = null;
        // Reattach submit
        overlay.querySelector("#submit-btn").onclick = overlay.querySelector("#submit-btn").onclick; // handled by re-render or keep ref
        // Re-bind submit (closure issue fix):
        overlay.querySelector("#submit-btn").onclick = () => {
          if (selectedIdx === null) return;
          const isC2 = selectedIdx === q.correct;
          answerRecord.attemptsUsed++;
          answerRecord.chosen = selectedIdx;
          opts.forEach(b => b.disabled = true);
          if (isC2) {
            answerRecord.correct = true;
            opts[q.correct].classList.add("correct");
            fb.className = "feedback-box correct-fb show";
            fb.innerHTML = `✅ <strong>Correct!</strong> ${q.explanation}`;
            overlay.querySelector("#submit-btn").textContent = qi < totalQ - 1 ? "Next Question →" : "See Results 🏆";
            overlay.querySelector("#submit-btn").disabled = false;
            overlay.querySelector("#submit-btn").onclick = () => {
              if (qi < totalQ - 1) { APP.currentQIndex++; overlay.remove(); showQuestion(moduleId); }
              else { overlay.remove(); showResults(moduleId); }
            };
          } else {
            opts[selectedIdx].classList.add("wrong-choice");
            const rem2 = maxAttempts - answerRecord.attemptsUsed;
            if (rem2 <= 0) {
              opts[q.correct].classList.add("correct");
              fb.className = "feedback-box wrong-fb show";
              fb.innerHTML = `❌ <strong>Incorrect.</strong> The correct answer is <strong>${String.fromCharCode(65+q.correct)}: ${q.options[q.correct]}</strong>.<br><br>
                📖 <strong>Suggested Reading:</strong> Click below to re-read the relevant section.<br>
                <span class="read-hint" data-section="${q.hintSection}">📌 Go back and read: "${q.hint}"</span>`;
              fb.querySelector(".read-hint").onclick = () => { overlay.remove(); showReaderAtSection(moduleId, q.hintSection); };
              overlay.querySelector("#submit-btn").textContent = qi < totalQ - 1 ? "Next Question →" : "See Results 🏆";
              overlay.querySelector("#submit-btn").disabled = false;
              overlay.querySelector("#submit-btn").onclick = () => {
                if (qi < totalQ - 1) { APP.currentQIndex++; overlay.remove(); showQuestion(moduleId); }
                else { overlay.remove(); showResults(moduleId); }
              };
            } else {
              fb.innerHTML = `❌ <strong>Incorrect.</strong> You have <strong>${rem2}</strong> attempt${rem2!==1?"s":""} remaining.<br><br>📖 <em>${q.hint}</em>`;
              const nd = Array.from({ length: maxAttempts }, (_, i) => `<div class="attempt-dot ${i >= rem2 ? "used" : ""}"></div>`).join("");
              overlay.querySelector("#att-dots").innerHTML = nd;
              overlay.remove();
              showQuestion(moduleId); // Re-render question for final attempt handling
            }
          }
        };
      }
    }
  };

  // Close on overlay click (outside card)
  overlay.onclick = e => { if (e.target === overlay) { /* do nothing — force completion */ } };

  document.getElementById("app").appendChild(overlay);
}

function showReaderAtSection(moduleId, sectionId) {
  showReader(moduleId);
  // Scroll to section after render
  setTimeout(() => {
    const sec = document.getElementById(sectionId);
    if (sec) { sec.scrollIntoView({ behavior: "smooth", block: "start" }); }
    // Re-open quiz after reading
    setTimeout(() => {
      const btn = document.querySelector("#start-quiz-btn");
      if (btn) { btn.disabled = false; btn.textContent = "Continue Quiz →"; }
    }, 500);
  }, 400);
}

/* ─────────────────────────────────────────────
   RESULTS
───────────────────────────────────────────── */
function showResults(moduleId) {
  const mod = window.COURSE.modules.find(m => m.id === moduleId);
  const { name, sid } = APP.currentUser;
  const score = APP.quizAnswers.filter(a => a.correct).length;
  const pass = score >= 3; // Pass threshold: 3/5

  saveModuleProgress(sid, moduleId, {
    status: "completed",
    score,
    pass,
    completedAt: new Date().toISOString(),
  });
  addLog({ type: "quiz_complete", user: name, sid, module: mod.title, score, pass, message: `${name} completed Module ${moduleId} quiz. Score: ${score}/5. ${pass ? "PASSED" : "FAILED"}.` });

  // Unlock next module
  const nextId = moduleId + 1;
  const nextMod = window.COURSE.modules.find(m => m.id === nextId);
  if (nextMod) {
    const nmp = getModuleProgress(sid, nextId);
    if (nmp.status === "locked") {
      saveModuleProgress(sid, nextId, { status: "unlocked" });
    }
  }

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
        ? `Excellent work! You scored ${score} out of 5. ${nextMod ? `Module ${nextId} has been unlocked.` : "You have completed all modules!"}`
        : `You scored ${score} out of 5. Don't worry — review the reading material and try again. You can revisit the module anytime.`}</p>
    </div>
    <div style="margin:24px 0;">
      ${APP.quizAnswers.map((a, i) => {
        const q = mod.quiz[i];
        return `<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);font-size:.88rem;">
          <span style="font-size:1.1rem;">${a.correct ? "✅" : "❌"}</span>
          <span style="flex:1;color:var(--text-dark);">Q${i+1}: ${q.question.substring(0, 65)}…</span>
          <span class="pill ${a.correct ? "pill-green" : "pill-red"}">${a.correct ? "Correct" : "Wrong"}</span>
        </div>`;
      }).join("")}
    </div>
    <div class="quiz-footer" style="justify-content:space-between;flex-wrap:wrap;gap:10px;">
      ${!pass ? `<button class="btn btn-outline" id="retry-btn" style="color:var(--kiu-green);border-color:var(--kiu-green);">🔄 Retry Quiz</button>` : ""}
      <button class="btn btn-primary btn-lg" id="continue-btn">${nextMod && pass ? `Next Module →` : "Back to Dashboard"}</button>
    </div>
  </div>`;

  const retryBtn = overlay.querySelector("#retry-btn");
  if (retryBtn) retryBtn.onclick = () => { overlay.remove(); startQuiz(moduleId); };

  overlay.querySelector("#continue-btn").onclick = () => {
    overlay.remove();
    if (nextMod && pass) {
      showReader(nextId);
    } else {
      showDashboard();
    }
  };

  document.getElementById("app").appendChild(overlay);
}

/* ─────────────────────────────────────────────
   ADMIN DASHBOARD
───────────────────────────────────────────── */
function showAdminDashboard() {
  const db = getDB();
  const logs = getLogs();
  const users = Object.values(db.users);
  const modules = window.COURSE.modules;

  const wrap = el("div");
  wrap.appendChild(buildTopbar("Administrator", true));
  const pageWrap = el("div", { class: "page-wrap" });
  const cont = el("div", { class: "container", style: "padding-top:36px;padding-bottom:60px;" });
  pageWrap.appendChild(cont);
  wrap.appendChild(pageWrap);

  // Compute stats
  let totalCompleted = 0, totalPassed = 0;
  users.forEach(u => {
    const sid = u.sid;
    modules.forEach(m => {
      const mp = getModuleProgress(sid, m.id);
      if (mp.status === "completed") totalCompleted++;
      if (mp.status === "completed" && mp.pass) totalPassed++;
    });
  });

  cont.innerHTML = `
  <div class="admin-header">
    <div>
      <h1>🔑 Administrator Dashboard</h1>
      <p>Monitor all student activity across ICT 1101 — Introduction to Computing</p>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <button class="btn btn-primary" id="dl-csv-btn">⬇ Download CSV</button>
      <button class="btn btn-outline" id="dl-log-btn">⬇ Download Logs</button>
    </div>
  </div>
  <div class="stats-grid">
    <div class="stat-card"><div class="stat-icon">👥</div><div class="stat-num">${users.length}</div><div class="stat-label">Registered Students</div></div>
    <div class="stat-card"><div class="stat-icon">✅</div><div class="stat-num">${totalCompleted}</div><div class="stat-label">Modules Completed</div></div>
    <div class="stat-card"><div class="stat-icon">🏆</div><div class="stat-num">${totalPassed}</div><div class="stat-label">Modules Passed</div></div>
    <div class="stat-card"><div class="stat-icon">📚</div><div class="stat-num">${modules.length}</div><div class="stat-label">Total Modules</div></div>
    <div class="stat-card"><div class="stat-icon">📋</div><div class="stat-num">${logs.length}</div><div class="stat-label">Activity Events</div></div>
  </div>

  <!-- Student Progress Table -->
  <div class="table-wrap" style="margin-bottom:28px;">
    <div class="table-head">
      <h3>📊 Student Progress</h3>
      <input class="search-box" id="student-search" placeholder="🔍 Search student…" type="text">
    </div>
    <div style="overflow-x:auto;">
    <table class="data-table" id="student-table">
      <thead>
        <tr>
          <th>Student Name</th>
          <th>Student No.</th>
          <th>Registered</th>
          ${modules.map(m => `<th>M${m.id}</th>`).join("")}
          <th>Overall</th>
        </tr>
      </thead>
      <tbody id="student-tbody">
      </tbody>
    </table>
    </div>
  </div>

  <!-- Activity Log -->
  <div class="table-wrap">
    <div class="table-head">
      <h3>🕐 Activity Log (latest ${Math.min(logs.length, 50)})</h3>
      <button class="btn btn-sm btn-danger" id="clear-log-btn">🗑 Clear Logs</button>
    </div>
    <div class="activity-log" id="activity-log"></div>
  </div>
  `;

  // Populate student rows
  function renderStudents(filter = "") {
    const tbody = cont.querySelector("#student-tbody");
    tbody.innerHTML = "";
    const filtered = users.filter(u => u.name.toLowerCase().includes(filter.toLowerCase()) || u.sid.toLowerCase().includes(filter.toLowerCase()));
    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="${3 + modules.length + 1}" style="text-align:center;padding:24px;color:var(--text-muted);">No students found.</td></tr>`;
      return;
    }
    filtered.forEach(u => {
      const tr = document.createElement("tr");
      let doneCount = 0, totalScore = 0;
      const cells = modules.map(m => {
        const mp = getModuleProgress(u.sid, m.id);
        if (mp.status === "completed") { doneCount++; totalScore += (mp.score || 0); }
        const pillClass = mp.status === "completed" ? (mp.pass ? "pill-green" : "pill-red") : (mp.status === "unlocked" ? "pill-gold" : "pill-gray");
        const pillText = mp.status === "completed" ? `${mp.score}/5` : (mp.status === "unlocked" ? "Open" : "Locked");
        return `<td><span class="pill ${pillClass}">${pillText}</span></td>`;
      }).join("");
      const overall = `${doneCount}/${modules.length} (${Math.round(doneCount / modules.length * 100)}%)`;
      tr.innerHTML = `
        <td><strong>${u.name}</strong></td>
        <td><code style="font-size:.82rem;">${u.sid}</code></td>
        <td style="font-size:.82rem;color:var(--text-muted);">${u.registeredAt ? new Date(u.registeredAt).toLocaleDateString("en-UG") : "—"}</td>
        ${cells}
        <td><span class="pill ${doneCount === modules.length ? "pill-green" : "pill-gold"}">${overall}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }
  renderStudents();
  cont.querySelector("#student-search").oninput = e => renderStudents(e.target.value);

  // Activity log
  const logWrap = cont.querySelector("#activity-log");
  const recentLogs = logs.slice(0, 50);
  if (recentLogs.length === 0) {
    logWrap.innerHTML = `<div class="activity-item"><span style="color:var(--text-muted);">No activity recorded yet.</span></div>`;
  } else {
    recentLogs.forEach(log => {
      const d = new Date(log.ts);
      const timeStr = `${d.toLocaleDateString("en-UG")} ${d.toLocaleTimeString("en-UG", { hour: "2-digit", minute: "2-digit" })}`;
      const div = el("div", { class: "activity-item" });
      div.innerHTML = `
        <div class="activity-dot" style="background:${log.type === "quiz_complete" ? (log.pass ? "var(--kiu-green-mid)" : "#e74c3c") : "var(--kiu-gold)"}"></div>
        <span style="flex:1;">${log.message || log.type}</span>
        ${log.type === "quiz_complete" ? `<span class="pill ${log.pass ? "pill-green" : "pill-red"}">${log.score}/5</span>` : ""}
        <span class="activity-time">${timeStr}</span>
      `;
      logWrap.appendChild(div);
    });
  }

  // Clear log
  cont.querySelector("#clear-log-btn").onclick = () => {
    if (confirm("Clear all activity logs? This cannot be undone.")) {
      localStorage.setItem(LOG_KEY, JSON.stringify([]));
      toast("Activity logs cleared.", "info");
      showAdminDashboard();
    }
  };

  // Download CSV
  cont.querySelector("#dl-csv-btn").onclick = () => {
    let csv = "Student Name,Student Number,Registered";
    modules.forEach(m => { csv += `,Module ${m.id} Score,Module ${m.id} Status`; });
    csv += ",Overall Progress\n";
    users.forEach(u => {
      let row = `"${u.name}","${u.sid}","${u.registeredAt ? new Date(u.registeredAt).toLocaleDateString() : ""}"`;
      let done = 0;
      modules.forEach(m => {
        const mp = getModuleProgress(u.sid, m.id);
        row += `,"${mp.score != null ? mp.score + "/5" : "—"}","${mp.status}"`;
        if (mp.status === "completed") done++;
      });
      row += `,"${done}/${modules.length}"`;
      csv += row + "\n";
    });
    downloadFile("KIU_LMS_Student_Progress.csv", csv, "text/csv");
    toast("CSV downloaded!", "success");
  };

  // Download Logs
  cont.querySelector("#dl-log-btn").onclick = () => {
    let txt = "KIU-Learners Pace — Activity Log\n";
    txt += "Generated: " + new Date().toLocaleString() + "\n";
    txt += "=".repeat(70) + "\n\n";
    logs.forEach(log => {
      const d = new Date(log.ts);
      txt += `[${d.toLocaleString()}] ${log.message || log.type}\n`;
    });
    downloadFile("KIU_LMS_Activity_Log.txt", txt, "text/plain");
    toast("Activity log downloaded!", "success");
  };

  render(wrap);
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

/* ─────────────────────────────────────────────
   INIT
───────────────────────────────────────────── */
window.addEventListener("DOMContentLoaded", () => {
  // Wait for splash to finish, then show login
  setTimeout(() => {
    showLogin();
  }, 1600);
});
