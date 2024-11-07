import { initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app';

const firebaseConfig = {
    apiKey: "AIzaSyClm5tc1sK2jxIhzje_0_tCHZPD_zwjeDQ",
    authDomain: "ferreteriaprueba-2d714.firebaseapp.com",
    projectId: "ferreteriaprueba-2d714",
    storageBucket: "ferreteriaprueba-2d714.firebasestorage.app",
    messagingSenderId: "446033237255",
    appId: "1:446033237255:web:ce68d3209262610dfe21a2",
    measurementId: "G-FBSGW8Y6MZ"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
    }

    const appFirebase = initializeApp(firebaseConfig);

    export {appFirebase, firebase}