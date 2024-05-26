// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-kylie-blog-189df.firebaseapp.com",
  projectId: "mern-kylie-blog-189df",
  storageBucket: "mern-kylie-blog-189df.appspot.com",
  messagingSenderId: "414878581291",
  appId: "1:414878581291:web:d08c1cdb04d7ac32e5e06e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);