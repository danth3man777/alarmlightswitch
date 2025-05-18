import React, { useState, useEffect } from "react";
import { database, ref, set, onValue } from "./firebase";
import "./App.css";

function App() {
  const [lightState, setLightState] = useState(false);
  const [alarmHour, setAlarmHour] = useState("7");
  const [alarmMinute, setAlarmMinute] = useState("00");
  const [alarmAmPm, setAlarmAmPm] = useState("AM");
  const [buzzerDuration, setBuzzerDuration] = useState(3);

  useEffect(() => {
    const lightRef = ref(database, "lightState");
    const alarmRef = ref(database, "alarmTime");
    const durationRef = ref(database, "buzzerDuration");

    onValue(lightRef, (snapshot) => {
      setLightState(snapshot.val());
    });

    onValue(alarmRef, (snapshot) => {
      const fullTime = snapshot.val();
      if (fullTime) {
        const [time, ampm] = fullTime.split(" ");
        const [hour, minute] = time.split(":");
        setAlarmHour(hour);
        setAlarmMinute(minute);
        setAlarmAmPm(ampm);
      }
    });

    onValue(durationRef, (snapshot) => {
      setBuzzerDuration(snapshot.val());
    });
  }, []);

  const handleToggleLight = () => {
    set(ref(database, "lightState"), !lightState);
  };

  const handleAlarmTimeChange = (hour, minute, ampm) => {
    setAlarmHour(hour);
    setAlarmMinute(minute);
    setAlarmAmPm(ampm);
    const formatted = `${hour}:${minute} ${ampm}`;
    set(ref(database, "alarmTime"), formatted);
  };

  const handleDurationChange = (e) => {
    const duration = parseInt(e.target.value, 10);
  
    if (!isNaN(duration) && duration > 0) {
      setBuzzerDuration(duration);
      set(ref(database, "buzzerDuration"), duration);
    }
  };

  return (
    <div className="App" style={{ textAlign: "center", padding: "20px" }}>
      <h1>🕹️ Illum Alarm Control Panel</h1>

      <button onClick={handleToggleLight} style={{ marginBottom: "20px" }}>
        {lightState ? "Turn Off" : "Turn On"}
      </button>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>
          ⏰ Set Alarm Time:
        </label>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <select
            value={alarmHour}
            onChange={(e) =>
              handleAlarmTimeChange(e.target.value, alarmMinute, alarmAmPm)
            }
          >
            {[...Array(12)].map((_, i) => {
              const hour = (i + 1).toString();
              return (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              );
            })}
          </select>

          <select
            value={alarmMinute}
            onChange={(e) =>
              handleAlarmTimeChange(alarmHour, e.target.value, alarmAmPm)
            }
          >
            {Array.from({ length: 60 }, (_, i) =>
              i.toString().padStart(2, "0")
            ).map((min) => (
              <option key={min} value={min}>
                {min}
              </option>
            ))}
          </select>

          <select
            value={alarmAmPm}
            onChange={(e) =>
              handleAlarmTimeChange(alarmHour, alarmMinute, e.target.value)
            }
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>

      <div>
        <label>🔊 Buzzer Duration (seconds): </label>
        <input
          type="number"
          value={buzzerDuration}
          onChange={handleDurationChange}
          min={1}
          max={20}
        />
      </div>
    </div>
  );
}

export default App;
