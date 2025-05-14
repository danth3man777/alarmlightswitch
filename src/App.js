import React, { useState, useEffect } from "react";

function App() {
  const ESP32_BASE_URL = "http://10.0.0.121"; // Replace with your ESP32 IP
  const [timerSeconds, setTimerSeconds] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [countdownActive, setCountdownActive] = useState(false);

  const [alarmTime, setAlarmTime] = useState("");
  const [alarmTriggered, setAlarmTriggered] = useState(false);

  const sendCommand = async (endpoint) => {
    try {
      const response = await fetch(`${ESP32_BASE_URL}/${endpoint}`, {
        method: "GET",
      });
      const result = await response.text();
      console.log("Response:", result);
    } catch (error) {
      console.error("Error sending command:", error);
    }
  };

  const sendAlarmTime = async (hour, minute) => {
    try {
      const response = await fetch(`${ESP32_BASE_URL}/setAlarm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hour, minute }),
      });
      const result = await response.text();
      console.log("Set alarm response:", result);
    } catch (error) {
      console.error("Error setting alarm:", error);
    }
  };

  // Handle countdown timer
  const handleSetTimer = () => {
    const seconds = parseInt(timerSeconds);
    if (!isNaN(seconds) && seconds > 0) {
      setCountdown(seconds);
      setCountdownActive(true);

      setTimeout(() => {
        sendCommand("on");
        setCountdownActive(false);
      }, seconds * 1000);
    }
  };

  useEffect(() => {
    let interval = null;

    if (countdownActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [countdownActive, countdown]);

  // Handle alarm clock trigger
  useEffect(() => {
    const alarmInterval = setInterval(() => {
      if (!alarmTime || alarmTriggered) return;

      const now = new Date();
      const nowStr = now.toTimeString().slice(0, 5); // "HH:MM"

      if (nowStr === alarmTime) {
        sendCommand("on");
        setAlarmTriggered(true);
        console.log("Alarm triggered at", alarmTime);
      }
    }, 1000);

    return () => clearInterval(alarmInterval);
  }, [alarmTime, alarmTriggered]);

  const handleSetAlarm = () => {
    setAlarmTriggered(false);

    const [hourStr, minuteStr] = alarmTime.split(":");
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    if (!isNaN(hour) && !isNaN(minute)) {
      sendAlarmTime(hour, minute);
      alert(`Alarm set for ${alarmTime}`);
    } else {
      alert("Invalid time format");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Smart Light Switch Controller</h1>

      <button onClick={() => sendCommand("on")}>On</button>
      <button onClick={() => sendCommand("off")}>Off</button>

      {/* Countdown Timer Section */}
      <div style={{ marginTop: "30px" }}>
        <h3>Set Countdown (seconds)</h3>
        <input
          type="number"
          placeholder="Seconds"
          value={timerSeconds}
          onChange={(e) => setTimerSeconds(e.target.value)}
        />
        <button onClick={handleSetTimer}>Start Countdown</button>

        {countdownActive && (
          <div style={{ marginTop: "10px", fontSize: "20px" }}>
            Timer: {countdown} second{countdown !== 1 ? "s" : ""} remaining
          </div>
        )}
      </div>

      {/* Alarm Clock Section */}
      <div style={{ marginTop: "50px" }}>
        <h3>Set Alarm Time</h3>
        <input
          type="time"
          value={alarmTime}
          onChange={(e) => setAlarmTime(e.target.value)}
        />
        <button onClick={handleSetAlarm}>Set Alarm</button>

        {alarmTime && !alarmTriggered && (
          <div style={{ marginTop: "10px", fontSize: "18px" }}>
            Alarm set for {alarmTime}
          </div>
        )}
        {alarmTriggered && (
          <div
            style={{ color: "green", fontWeight: "bold", marginTop: "10px" }}
          >
            Alarm triggered!
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
