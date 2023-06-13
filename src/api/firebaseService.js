// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDCg9PbwEwwhM8yz_ob17Sf3hKF1W_z74Y",
    authDomain: "flownotes-339616.firebaseapp.com",
    projectId: "flownotes-339616",
    storageBucket: "flownotes-339616.appspot.com",
    messagingSenderId: "300810296179",
    appId: "1:300810296179:web:5e6ef712c93df493468306",
    measurementId: "G-T926K43FPS"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp);

