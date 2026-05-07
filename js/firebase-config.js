<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAuGUlRM71Zc6gecT87xSxbi4h_v-MxgDM",
    authDomain: "kiu-lms-5acb5.firebaseapp.com",
    projectId: "kiu-lms-5acb5",
    storageBucket: "kiu-lms-5acb5.firebasestorage.app",
    messagingSenderId: "174021780455",
    appId: "1:174021780455:web:be66e9a41c2810c8bf5342",
    measurementId: "G-WXY9Y042SM"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
