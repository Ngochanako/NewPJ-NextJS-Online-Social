// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app" ;   
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = { 
  apiKey : process.env.VITE_KEY_FIREBASE, 
  authDomain : "online-social-2adfa.firebaseapp.com" , 
  projectId : "online-social-2adfa" , 
  storageBucket : "online-social-2adfa.appspot.com" , 
  messagingSenderId : "645607566050" , 
  appId : "1:645607566050:web:5062cb0745170da1fdccbb" 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage=getStorage(app)