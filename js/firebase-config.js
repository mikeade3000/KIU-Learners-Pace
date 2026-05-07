/* ============================================================
   KIU-Learners Pace — Firebase Configuration
   
   SETUP INSTRUCTIONS:
   1. Go to https://console.firebase.google.com
   2. Click "Add project" → name it "kiu-lms" → Continue
   3. Disable Google Analytics (optional) → Create project
   4. Click the </> (Web) icon to add a web app
   5. Register app name "KIU-LMS" → Copy the firebaseConfig object
   6. Paste your values below, replacing the placeholders
   7. In Firebase console: Build → Firestore Database → Create database
      → Start in TEST MODE → Choose a region → Enable
   ============================================================ */

window.KIU_FIREBASE_CONFIG = {
  apiKey:            "PASTE_YOUR_API_KEY_HERE",
  authDomain:        "PASTE_YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "PASTE_YOUR_PROJECT_ID",
  storageBucket:     "PASTE_YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId:             "PASTE_YOUR_APP_ID"
};

/* ── FIRESTORE SECURITY RULES ─────────────────────────────────
   After creating Firestore, go to: Firestore → Rules tab
   Replace the existing rules with this and click Publish:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /students/{sid} {
      allow read, write: if true;
    }
    match /logs/{logId} {
      allow read, write: if true;
    }
  }
}
─────────────────────────────────────────────────────────────── */
