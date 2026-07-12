import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAI1TxsLCSZUqW8VIJbfK9j2ieubxa8Mns",
  authDomain: "shred-8870a.firebaseapp.com",
  projectId: "shred-8870a",
  storageBucket: "shred-8870a.firebasestorage.app",
  messagingSenderId: "350918339231",
  appId: "1:350918339231:web:53ae174e6cef4a96a1d0aa",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);