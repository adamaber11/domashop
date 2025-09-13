// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  "projectId": "studio-4652651276-b8ce1",
  "appId": "1:128363646284:web:8fbbcfbe531652bfc093e9",
  "storageBucket": "studio-4652651276-b8ce1.firebasestorage.app",
  "apiKey": "AIzaSyCPzkHzyX_03F6TIp954K5nQTrOGLaH4vc",
  "authDomain": "studio-4652651276-b8ce1.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "128363646284"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);