# 🏎️ F1 Motorsport Telemetry Dashboard (MERN + Socket.IO)

A high-performance F1-style motorsport telemetry web application built with **React.js (Vite)**, **Node.js/Express (MVC & Service Layer pattern)**, **MongoDB (Mongoose)**, **Socket.IO real-time streaming**, and a **standalone 10-car F1 Telemetry Simulator**.

![F1 Telemetry Dashboard](https://img.shields.io/badge/Stack-MERN%20%2B%20Socket.IO-00ff88?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-cyan?style=for-the-badge)

---

## 🌟 Key Features

- **Full-Screen F1 Command Wall Layout**: Designed for high-frequency live engineering monitoring.
- **10 Official F1 Drivers & Teams**: Real-time switching between Verstappen, Leclerc, Norris, Hamilton, Sainz, Russell, Piastri, Alonso, Perez, and Gasly.
- **Dynamic Gauges**: Speed (km/h), Sequential 8-Speed gear indicator, Steering angle, Throttle/Brake pedal bars, and **16-LED multi-color RPM Shift Light Bar**.
- **Real-Time Line Traces**: Recharts multi-line telemetry chart plotting Speed, RPM, Throttle, and Brake curves cleanly over time.
- **2D Circuit Map**: Spline-based (Catmull-Rom & Cubic Bezier) Silverstone GP layout rendering real-time animated car markers.
- **Lap & Sector Split Timing**: Automatically records sector split times, highlighting Session Bests (Purple) and Personal Bests (Green).
- **Engineering Safety Alerts**: Real-time logging of engine RPM peaks, heavy braking events, and lap completions.
- **CSV Data Export**: Download raw session telemetry data as standard CSV files (`GET /api/telemetry/:sessionId/export/csv`).

---

## 📁 Repository Structure

```
motorsport-telemetry/
├── client/                     → React dashboard (Vite + Tailwind CSS + Recharts + Socket.IO)
│   ├── src/
│   │   ├── components/         → Gauges, TrackMap, TelemetryChart, LapTimeTable, AlertsPanel, Navbar
│   │   ├── context/            → AuthContext & TelemetryContext
│   │   ├── utils/              → trackWaypoints.js (Spline path generator)
│   │   └── pages/              → DashboardPage, LoginPage
│   ├── index.html
│   └── vite.config.js
│
├── server/                     → Express API + Socket.IO Server (MVC + Service Layer)
│   ├── src/
│   │   ├── config/             → db.js (MongoDB + Memory Server fallback)
│   │   ├── models/             → User, Driver, Session, Lap, Telemetry
│   │   ├── services/           → telemetryService, lapService, sessionService
│   │   ├── controllers/        → Auth, Driver, Session, Lap, Telemetry
│   │   ├── routes/             → Express API endpoints
│   │   └── sockets/            → telemetrySocket.js
│   └── server.js
│
└── simulator/                  → Standalone F1 Telemetry Generator
    ├── simulator.js            → 10-car smooth physics engine
    └── trackWaypoints.js       → Catmull-Rom spline positioning
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/motorsport-telemetry.git
cd motorsport-telemetry
```

### 2. Install Dependencies
```bash
# Server dependencies
cd server && npm install

# Simulator dependencies
cd ../simulator && npm install

# Client dependencies
cd ../client && npm install
```

### 3. Run the Application
Open 3 separate terminal windows:

- **Terminal 1 (Backend Server)**:
  ```bash
  cd server && npm start
  ```

- **Terminal 2 (F1 Telemetry Simulator)**:
  ```bash
  cd simulator && npm start
  ```

- **Terminal 3 (React Web Client)**:
  ```bash
  cd client && npm run dev
  ```

Open **`http://localhost:5173`** in your browser!
