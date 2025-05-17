import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  onValue,
} from "firebase/database";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBjfFdLeQw5pGXNoulfEUbYCEpdD3Sti2o",
  authDomain: "illum-alarm.firebaseapp.com",
  databaseURL: "https://illum-alarm-default-rtdb.firebaseio.com",
  projectId: "illum-alarm",
  storageBucket: "illum-alarm.firebasestorage.app",
  messagingSenderId: "701600396394",
  appId: "1:701600396394:web:b27e865fe3db7a6c84c613",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function App() {
  const [currentTime, setCurrentTime] = useState("");
  const [lightState, setLightState] = useState(false);
  const [alarmHour, setAlarmHour] = useState("7");
  const [alarmMinute, setAlarmMinute] = useState("00");
  const [alarmPeriod, setAlarmPeriod] = useState("AM");

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();

      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      const timeStr = `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
      setCurrentTime(timeStr);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Sync lightState from Firebase
  useEffect(() => {
    const stateRef = ref(db, "lightState");
    onValue(stateRef, (snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        setLightState(value);
      }
    });
  }, []);

  // Write light state to Firebase
  const toggleLight = (state) => {
    set(ref(db, "lightState"), state)
      .then(() => {
        console.log("lightState set to:", state);
      })
      .catch((error) => {
        console.error("Failed to set lightState:", error);
      });
  };

  // Write alarm time to Firebase
  const handleAlarmSet = () => {
    const formattedTime = `${alarmHour}:${alarmMinute} ${alarmPeriod}`;
    set(ref(db, "alarmTime"), formattedTime)
      .then(() => {
        alert(`Alarm set for ${formattedTime}`);
      })
      .catch((error) => {
        console.error("Failed to set alarmTime:", error);
      });
  };

  return (
    <div style={{ textAlign: "center", paddingTop: "2rem" }}>
      <h1>Illum Alarm Control</h1>
      <p>Current Time: {currentTime}</p>

      <div style={{ margin: "1rem" }}>
        <button onClick={() => toggleLight(true)}>Turn On</button>
        <button onClick={() => toggleLight(false)}>Turn Off</button>
        <p>Manual Light State: {lightState ? "ON" : "OFF"}</p>
      </div>

      <div style={{ margin: "1rem" }}>
        <h3>Set Alarm Time</h3>
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
          <select value={alarmHour} onChange={(e) => setAlarmHour(e.target.value)}>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>

          <select value={alarmMinute} onChange={(e) => setAlarmMinute(e.target.value)}>
            {[...Array(60)].map((_, i) => (
              <option key={i} value={i.toString().padStart(2, "0")}>
                {i.toString().padStart(2, "0")}
              </option>
            ))}
          </select>

          <select value={alarmPeriod} onChange={(e) => setAlarmPeriod(e.target.value)}>
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>

          <button onClick={handleAlarmSet}>Set Alarm</button>
        </div>
      </div>
    </div>
  );
}

export default App;
