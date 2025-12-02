// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBwBQupQW3rTNfmJsvt6mY6YWNAaKpvdog",
  authDomain: "eaglercraft2o.firebaseapp.com",
  projectId: "eaglercraft2o",
  storageBucket: "eaglercraft2o.firebasestorage.app",
  messagingSenderId: "444098199590",
  appId: "1:444098199590:web:06ff7c5a55f5e9312866e7",
  measurementId: "G-GHE4WZ997M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = firebase.auth();