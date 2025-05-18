// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBjfFdLeQw5pGXNoulfEUbYCEpdD3Sti2o",
  authDomain: "illum-alarm.firebaseapp.com",
  databaseURL: "https://illum-alarm-default-rtdb.firebaseio.com",
  projectId: "illum-alarm",
  storageBucket: "illum-alarm.appspot.com",
  messagingSenderId: "701600396394",
  appId: "1:701600396394:web:b27e865fe3db7a6c84c613",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, set, onValue };
