# 🏎️ F1 Motorsport Telemetry Dashboard

A real-time **Formula 1-style telemetry dashboard** built with the MERN stack and Socket.IO.

The application simulates telemetry data from **10 F1 cars**, streams the data in real time, stores historical telemetry in MongoDB, and displays live vehicle performance through an interactive engineering dashboard.

> **Simulator → Socket.IO → Node.js → MongoDB + React → Live Telemetry Dashboard**

---

## 🚀 Project Overview

Motorsport teams collect thousands of data points from a race car to understand vehicle and driver performance.

This project recreates that workflow in a software environment.

The application includes a standalone telemetry simulator that generates realistic data such as:

* 🏎️ Vehicle speed
* 🔥 Engine RPM
* ⚙️ Gear
* 🟢 Throttle
* 🛑 Brake
* 🎯 Steering angle
* 📍 Track position
* ⏱️ Lap time
* 🏁 Sector times

The generated data is transmitted using **Socket.IO**, processed by the **Node.js/Express backend**, stored in **MongoDB**, and displayed in the **React dashboard**.

---

# ✨ Features

### 🏎️ Multi-Car Telemetry

The simulator generates live telemetry for 10 F1-style cars and drivers.

Drivers included:

* Max Verstappen
* Charles Leclerc
* Lando Norris
* Lewis Hamilton
* Carlos Sainz
* George Russell
* Oscar Piastri
* Fernando Alonso
* Sergio Perez
* Pierre Gasly

Users can switch between cars from the dashboard and monitor each driver's live telemetry.

---

### 📊 Live Telemetry Dashboard

The dashboard displays important vehicle information in real time:

```text
Speed        287 km/h
RPM          12,850
Gear         7
Throttle     94%
Brake        0%
Steering     -3.2°
```

The interface is designed as an F1-style engineering command wall for quick monitoring.

---

### 📈 Real-Time Telemetry Charts

Interactive charts display:

* Speed
* RPM
* Throttle
* Brake

Telemetry data continuously updates as new packets arrive through Socket.IO.

---

### 💡 RPM Shift Light

A 16-LED RPM indicator provides a visual representation of engine RPM.

```text
6,000 – 10,000 RPM       🟢 Green
10,000 – 13,000 RPM      🟡 Yellow
13,000 – 14,500 RPM      🔴 Red
14,500+ RPM              🟣 Peak / Shift Warning
```

This provides a quick visual indication of the engine's current state.

---

### 🗺️ Live Silverstone Track Map

The dashboard includes a 2D representation of the Silverstone circuit.

The simulator calculates car positions using spline interpolation and sends the coordinates to the frontend.

The React dashboard then animates the car markers around the circuit.

```text
Telemetry
    ↓
Distance around track
    ↓
Track position calculation
    ↓
X / Y coordinates
    ↓
React SVG Track Map
    ↓
🏎️ Live car position
```

---

### ⏱️ Lap & Sector Analysis

The application records lap and sector performance.

Example:

```text
Lap 18

Sector 1     33.720s
Sector 2     35.100s
Sector 3     32.830s
---------------------
Lap Time     1:41.650
```

The dashboard identifies:

* Session Best
* Personal Best
* Sector Best
* Top Speed

---

### 🚨 Engineering Alerts

The system monitors telemetry and generates alerts when important events occur.

Examples:

```text
🚨 HIGH RPM
Car #1 exceeded the configured RPM threshold.

⚠️ HEAVY BRAKING
Car #44 applied heavy braking.

🏆 FAST LAP
A new session-best lap was completed.
```

This demonstrates how raw telemetry can be converted into useful engineering information.

---

### 📥 CSV Telemetry Export

Historical telemetry can be exported as a CSV file.

Example endpoint:

```text
GET /api/telemetry/:sessionId/export/csv
```

This allows session data to be downloaded and analyzed outside the application.

---

# 🏗️ System Architecture

The application consists of three main parts:

```text
                    🏎️ TELEMETRY SIMULATOR
                             │
                             │ 10 Hz
                             ▼
                    📡 SOCKET.IO STREAM
                             │
                             ▼
                 ┌────────────────────────┐
                 │   NODE.JS + EXPRESS    │
                 │      BACKEND           │
                 └───────────┬────────────┘
                             │
                  ┌──────────┴──────────┐
                  │                     │
                  ▼                     ▼
              MongoDB               Socket.IO
            Historical Data        Live Stream
                  │                     │
                  │                     ▼
                  │              ⚛️ React Client
                  │                     │
                  │          ┌──────────┼──────────┐
                  │          ▼          ▼          ▼
                  │       Gauges     Charts    Track Map
                  │
                  ▼
             Lap Analysis
```

---

# 🔄 How It Works

## 1️⃣ Telemetry Generation

The simulator runs independently from the main application.

Every **100 milliseconds**, it generates a new telemetry frame for each car.

Example:

```json
{
  "driver": "Max Verstappen",
  "carNumber": 1,
  "speed": 287,
  "rpm": 12850,
  "gear": 7,
  "throttle": 94,
  "brake": 0,
  "steering": -3.2,
  "lap": 18,
  "distance": 4210.5
}
```

---

## 2️⃣ Real-Time Data Transmission

The simulator sends the telemetry packet to the backend using Socket.IO.

```text
Simulator
    ↓
telemetry_data
    ↓
Socket.IO Server
```

The simulator sends approximately:

```text
10 cars × 10 packets/second
= 100 telemetry frames/second
```

---

## 3️⃣ Backend Processing

The Express server receives the telemetry data.

The socket handler:

```text
telemetrySocket.js
```

processes the incoming packets.

The data is then:

1. Validated
2. Processed
3. Broadcast to connected clients
4. Stored for historical analysis

---

## 4️⃣ MongoDB Storage

Historical telemetry is stored using MongoDB and Mongoose.

Main collections include:

```text
Users
Drivers
Sessions
Laps
Telemetry
```

This allows previous sessions and laps to be analyzed later.

---

## 5️⃣ React Dashboard

The React application receives live telemetry through Socket.IO.

`TelemetryContext.jsx` manages the live telemetry state.

The data is then consumed by components such as:

```text
TelemetryContext
       │
       ├── Gauges
       ├── TelemetryChart
       ├── TrackMap
       ├── LapTimeTable
       └── AlertsPanel
```

As new telemetry arrives, the dashboard updates automatically.

---

# 📁 Project Structure

```text
motorsport-telemetry/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Gauges.jsx
│   │   │   ├── TrackMap.jsx
│   │   │   ├── TelemetryChart.jsx
│   │   │   ├── LapTimeTable.jsx
│   │   │   ├── AlertsPanel.jsx
│   │   │   └── Navbar.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── TelemetryContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   └── LoginPage.jsx
│   │   │
│   │   └── utils/
│   │       └── trackWaypoints.js
│   │
│   ├── index.html
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Driver.js
│   │   │   ├── Session.js
│   │   │   ├── Lap.js
│   │   │   └── Telemetry.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── driverController.js
│   │   │   ├── sessionController.js
│   │   │   ├── lapController.js
│   │   │   └── telemetryController.js
│   │   │
│   │   ├── services/
│   │   │   ├── telemetryService.js
│   │   │   ├── lapService.js
│   │   │   └── sessionService.js
│   │   │
│   │   ├── routes/
│   │   └── sockets/
│   │       └── telemetrySocket.js
│   │
│   └── server.js
│
├── simulator/
│   ├── simulator.js
│   ├── trackWaypoints.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* JavaScript ES6+
* Tailwind CSS
* Recharts
* Socket.IO Client

### Backend

* Node.js
* Express.js
* Socket.IO
* REST APIs
* MVC Architecture
* Service Layer Pattern

### Database

* MongoDB
* Mongoose

### Development Tools

* Git
* GitHub
* Postman
* VS Code

---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

* Node.js
* npm
* MongoDB

---

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/motorsport-telemetry.git

cd motorsport-telemetry
```

---

## 2. Install Dependencies

### Backend

```bash
cd server
npm install
```

### Simulator

```bash
cd ../simulator
npm install
```

### Frontend

```bash
cd ../client
npm install
```

---

# ▶️ Run the Application

You need **three terminals**.

### Terminal 1 — Backend

```bash
cd server
npm start
```

Backend:

```text
http://localhost:5000
```

---

### Terminal 2 — Telemetry Simulator

```bash
cd simulator
npm start
```

The simulator starts generating telemetry for the 10 cars.

---

### Terminal 3 — React Dashboard

```bash
cd client
npm run dev
```

Open:

```text
http://localhost:5173
```

---

# 📡 Example Data Flow

A single telemetry packet follows this path:

```text
🏎️ Simulator
     │
     │ telemetry_data
     ▼
📡 Socket.IO
     │
     ▼
🟢 Node.js Server
     │
     ├───────────────► MongoDB
     │
     └───────────────► React Dashboard
                              │
                 ┌────────────┼────────────┐
                 ▼            ▼            ▼
              Gauges        Charts      Track Map
```

---

# 🎯 Project Goals

This project was built to demonstrate practical experience with:

* Real-time web applications
* WebSocket communication
* MERN stack development
* REST API design
* MongoDB data persistence
* High-frequency data handling
* Data visualization
* State management
* Mathematical data processing
* SVG-based graphics
* Software architecture

---

# 🔮 Future Improvements

Possible future enhancements include:

* [ ] Real telemetry hardware integration
* [ ] User authentication and role-based access
* [ ] Multiple race sessions
* [ ] Driver-to-driver telemetry comparison
* [ ] Advanced tyre telemetry
* [ ] Fuel consumption monitoring
* [ ] Weather data integration
* [ ] Race replay mode
* [ ] Cloud deployment
* [ ] Advanced performance analytics
* [ ] AI-based driver performance insights

---

# 👨‍💻 Author

**Vishnupriyan**

MERN Stack Developer

* GitHub: https://github.com/SVVISHNU
* LinkedIn: https://www.linkedin.com/in/vishnu-priyan-72128728b

---

## ⭐ Why This Project?

This project combines **full-stack development, real-time communication, data processing, and data visualization** into one application.

Instead of simply displaying static racing data, the system creates a complete telemetry pipeline:

```text
GENERATE
   ↓
TRANSMIT
   ↓
PROCESS
   ↓
STORE
   ↓
STREAM
   ↓
VISUALIZE
   ↓
ANALYZE
```

That makes the project a practical demonstration of building a **real-time, data-driven MERN application.
