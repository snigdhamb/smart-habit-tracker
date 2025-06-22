// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2LlDLYRsMcFT0YDDJZZPiYyi3jczrvvc",
  authDomain: "smart-habit-tracker-193c4.firebaseapp.com",
  projectId: "smart-habit-tracker-193c4",
  storageBucket: "smart-habit-tracker-193c4.firebasestorage.app",
  messagingSenderId: "254213015211",
  appId: "1:254213015211:web:7428374c87aee21027d9ee",
  measurementId: "G-7X0DF42DQE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const db = getFirestore(app);
