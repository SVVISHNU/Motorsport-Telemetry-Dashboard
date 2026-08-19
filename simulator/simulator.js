const { io } = require('socket.io-client');
const axios = require('axios');
const { getTrackPosition, TRACK_LENGTH } = require('./trackWaypoints');

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';
const socket = io(SERVER_URL);

// 10 Official F1 Drivers
const F1_GRID_CONFIG = [
  { name: 'Max Verstappen', number: 1, team: 'Red Bull Racing', teamColor: '#3671C6', initialOffset: 0 },
  { name: 'Charles Leclerc', number: 16, team: 'Scuderia Ferrari', teamColor: '#E8002D', initialOffset: 250 },
  { name: 'Lando Norris', number: 4, team: 'McLaren F1', teamColor: '#FF8000', initialOffset: 500 },
  { name: 'Lewis Hamilton', number: 44, team: 'Mercedes-AMG F1', teamColor: '#6CD3BF', initialOffset: 750 },
  { name: 'Carlos Sainz', number: 55, team: 'Scuderia Ferrari', teamColor: '#E8002D', initialOffset: 1000 },
  { name: 'George Russell', number: 63, team: 'Mercedes-AMG F1', teamColor: '#27F4D2', initialOffset: 1250 },
  { name: 'Oscar Piastri', number: 81, team: 'McLaren F1', teamColor: '#FF8000', initialOffset: 1500 },
  { name: 'Fernando Alonso', number: 14, team: 'Aston Martin F1', teamColor: '#229971', initialOffset: 1750 },
  { name: 'Sergio Perez', number: 11, team: 'Red Bull Racing', teamColor: '#3671C6', initialOffset: 2000 },
  { name: 'Pierre Gasly', number: 10, team: 'Alpine F1', teamColor: '#0093CC', initialOffset: 2250 }
];

let carsState = [];
let updateInterval = null;

async function initF1GridSession() {
  try {
    console.log(`[Simulator] Registering 10 F1 Drivers...`);
    carsState = [];

    for (const config of F1_GRID_CONFIG) {
      const driverRes = await axios.post(`${SERVER_URL}/api/drivers`, {
        name: config.name,
        number: config.number,
        team: config.team,
        country: 'Global'
      }).catch(err => err.response?.status === 400 ? axios.get(`${SERVER_URL}/api/drivers`) : Promise.reject(err));

      let driverId;
      if (Array.isArray(driverRes.data)) {
        const found = driverRes.data.find(d => d.number === config.number) || driverRes.data[0];
        driverId = found._id;
      } else {
        driverId = driverRes.data._id;
      }

      const sessionRes = await axios.post(`${SERVER_URL}/api/sessions`, {
        driverId,
        track: 'Silverstone Circuit',
        sessionType: 'Race',
        weather: { trackTemp: 42, airTemp: 28, condition: 'Dry' }
      });

      carsState.push({
        ...config,
        sessionId: sessionRes.data._id,
        currentLap: 1,
        distance: config.initialOffset,
        speed: 160,
        targetSpeed: 280,
        rpm: 10500,
        gear: 5,
        throttle: 90,
        brake: 0,
        steering: 0,
        sector1Time: 0,
        sector2Time: 0,
        sector3Time: 0,
        sector1StartTime: Date.now(),
        sector2StartTime: null,
        sector3StartTime: null,
        topSpeedThisLap: 0,
        phaseTime: 0
      });
    }

    console.log(`[Simulator] Active F1 Grid Initialized (10 Cars Streaming)`);
    socket.emit('start_session', { sessionId: carsState[0].sessionId, track: 'Silverstone Circuit' });
    startSmoothPhysicsLoop();
  } catch (error) {
    console.error('[Simulator] Init error:', error.message);
    setTimeout(initF1GridSession, 3000);
  }
}

function startSmoothPhysicsLoop() {
  if (updateInterval) clearInterval(updateInterval);

  console.log('[Simulator] Smooth Telemetry Stream Active (10 Hz)...');
  updateInterval = setInterval(() => {
    stepSmoothF1Physics();
  }, 100);
}

function stepSmoothF1Physics() {
  const now = Date.now();

  carsState.forEach(car => {
    car.phaseTime += 0.1;
    
    const lapCycle = (car.distance % TRACK_LENGTH) / TRACK_LENGTH;
    const baseSpeed = 225 + 115 * Math.sin(lapCycle * Math.PI * 8);
    car.speed = parseFloat(Math.min(348, Math.max(95, baseSpeed + Math.sin(car.phaseTime * 2) * 5)).toFixed(1));

    if (Math.sin(lapCycle * Math.PI * 8) > -0.2) {
      car.throttle = Math.min(100, Math.round(75 + 25 * Math.sin(lapCycle * Math.PI * 8)));
      car.brake = 0;
    } else {
      car.throttle = 0;
      car.brake = Math.min(100, Math.round(60 + 40 * Math.abs(Math.sin(lapCycle * Math.PI * 8))));
    }

    if (car.speed < 90) car.gear = 2;
    else if (car.speed < 135) car.gear = 3;
    else if (car.speed < 185) car.gear = 4;
    else if (car.speed < 235) car.gear = 5;
    else if (car.speed < 275) car.gear = 6;
    else if (car.speed < 315) car.gear = 7;
    else car.gear = 8;

    const minGearRpm = 7500;
    const maxGearRpm = 14850;
    const gearFraction = (car.speed % 45) / 45;
    car.rpm = Math.min(15000, Math.round(minGearRpm + gearFraction * (maxGearRpm - minGearRpm)));

    car.steering = Math.round(35 * Math.sin(lapCycle * Math.PI * 12));

    const speedMps = (car.speed * 1000) / 3600;
    car.distance += speedMps * 0.1;

    if (car.speed > car.topSpeedThisLap) {
      car.topSpeedThisLap = Math.round(car.speed);
    }

    const lapDistance = car.distance % TRACK_LENGTH;
    if (lapDistance < speedMps * 0.1 && car.distance > TRACK_LENGTH) {
      const s1 = parseFloat((27.5 + Math.random() * 1.5).toFixed(3));
      const s2 = parseFloat((36.2 + Math.random() * 1.5).toFixed(3));
      const s3 = parseFloat((23.8 + Math.random() * 1.2).toFixed(3));
      const totalLapTime = parseFloat((s1 + s2 + s3).toFixed(3));

      socket.emit('lap_completed', {
        sessionId: car.sessionId,
        driverNumber: car.number,
        team: car.team,
        driverName: car.name,
        lapNumber: car.currentLap,
        lapTime: totalLapTime,
        sector1: s1,
        sector2: s2,
        sector3: s3,
        topSpeed: car.topSpeedThisLap
      });

      car.currentLap++;
      car.topSpeedThisLap = car.speed;
    }

    // Catmull-Rom smooth position calculation
    const svgPos = getTrackPosition(car.distance);

    const telemetryPacket = {
      sessionId: car.sessionId,
      driverNumber: car.number,
      team: car.team,
      driverName: car.name,
      teamColor: car.teamColor,
      lapNumber: car.currentLap,
      timestamp: now,
      distance: Math.round(car.distance),
      speed: Math.round(car.speed),
      rpm: car.rpm,
      gear: car.gear,
      throttle: car.throttle,
      brake: car.brake,
      steering: car.steering,
      trackPosition: { x: svgPos.x, y: svgPos.y },
      latitude: 52.0786,
      longitude: -1.0169
    };

    socket.emit('telemetry_data', telemetryPacket);
  });
}

socket.on('connect', () => {
  console.log('[Simulator] Connected to Socket.IO Server');
  initF1GridSession();
});

socket.on('disconnect', () => {
  console.warn('[Simulator] Disconnected from server. Retrying...');
});
