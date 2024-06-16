// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAI29KcREpwuT6y7-EPyjfzX-eonvXN98",
  authDomain: "software-engineering-bb17b.firebaseapp.com",
  projectId: "software-engineering-bb17b",
  storageBucket: "software-engineering-bb17b.appspot.com",
  messagingSenderId: "382674951106",
  appId: "1:382674951106:web:849c6545aa0c64afbc945b",
  measurementId: "G-1LCGK3M5LQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth , sendPasswordResetEmail };