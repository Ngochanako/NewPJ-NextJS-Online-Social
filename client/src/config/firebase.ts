// Import các module cần thiết từ SDK Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain : "test-d0131.firebaseapp.com" , 
  projectId : "test-d0131" , 
  storageBucket : "test-d0131.appspot.com" , 
  messagingSenderId : "617421059193" , 
  appId : "1:617421059193:web:4cbb852bb84de1bf4050a8" , 
  measurementId : "G-20J4RL301G" 
};

// Khởi tạo Firebase App
const app = initializeApp(firebaseConfig);

// Khởi tạo các dịch vụ Firebase
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, db, storage };
export default firebase;
