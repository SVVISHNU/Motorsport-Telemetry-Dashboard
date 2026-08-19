import React, { createContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

export const TelemetryContext = createContext();

export const OFFICIAL_F1_DRIVERS = [
  { name: 'Max Verstappen', number: 1, team: 'Red Bull Racing', color: '#3671C6' },
  { name: 'Charles Leclerc', number: 16, team: 'Scuderia Ferrari', color: '#E8002D' },
  { name: 'Lando Norris', number: 4, team: 'McLaren F1', color: '#FF8000' },
  { name: 'Lewis Hamilton', number: 44, team: 'Mercedes-AMG F1', color: '#6CD3BF' },
  { name: 'Carlos Sainz', number: 55, team: 'Scuderia Ferrari', color: '#E8002D' },
  { name: 'George Russell', number: 63, team: 'Mercedes-AMG F1', color: '#27F4D2' },
  { name: 'Oscar Piastri', number: 81, team: 'McLaren F1', color: '#FF8000' },
  { name: 'Fernando Alonso', number: 14, team: 'Aston Martin F1', color: '#229971' },
  { name: 'Sergio Perez', number: 11, team: 'Red Bull Racing', color: '#3671C6' },
  { name: 'Pierre Gasly', number: 10, team: 'Alpine F1', color: '#0093CC' }
];

export const TelemetryProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedDriverNumber, setSelectedDriverNumber] = useState(1);

  const [carsTelemetry, setCarsTelemetry] = useState({});
  const [carsTelemetryHistory, setCarsTelemetryHistory] = useState({});
  const [allCarsTrackPositions, setAllCarsTrackPositions] = useState([]);
  
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [laps, setLaps] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const socketUri = window.location.origin.includes('localhost') ? 'http://localhost:5000' : '/';
    const newSocket = io(socketUri, { transports: ['websocket', 'polling'] });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('[React Dashboard] Connected to Socket.IO Telemetry Stream');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('[React Dashboard] Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('live_telemetry', (data) => {
      if (!data || !data.driverNumber) return;
      const driverNo = data.driverNumber;

      // Update instantaneous live gauges
      setCarsTelemetry(prev => ({
        ...prev,
        [driverNo]: data
      }));

      // Maintain clean 60-point history window for smooth line chart
      setCarsTelemetryHistory(prev => {
        const carHistory = prev[driverNo] || [];
        const updated = [...carHistory, data].slice(-60);
        return { ...prev, [driverNo]: updated };
      });

      // Update positions map safely
      setAllCarsTrackPositions(prev => {
        const filtered = prev.filter(c => c.driverNumber !== driverNo);
        return [...filtered, {
          driverNumber: driverNo,
          team: data.team || 'F1 Team',
          driverName: data.driverName || 'F1 Driver',
          teamColor: data.teamColor || '#00ff88',
          x: Number(data.trackPosition?.x ?? 60),
          y: Number(data.trackPosition?.y ?? 290)
        }];
      });

      if (driverNo === selectedDriverNumber) {
        checkTelemetryAlerts(data);
      }
    });

    newSocket.on('lap_recorded', (lap) => {
      if (!lap) return;
      setLaps(prev => {
        const filtered = prev.filter(l => l.lapNumber !== lap.lapNumber);
        return [...filtered, lap].sort((a, b) => a.lapNumber - b.lapNumber);
      });

      addAlert({
        id: Date.now() + Math.random(),
        type: lap.isSessionBest ? 'purple' : 'green',
        message: `[#${lap.driverNumber || 1} ${lap.driverName || 'Driver'}] Lap ${lap.lapNumber} Completed: ${lap.lapTime}s ${lap.isSessionBest ? '★ SESSION BEST' : ''}`,
        timestamp: new Date().toLocaleTimeString()
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [selectedDriverNumber]);

  const fetchSessions = async () => {
    try {
      const res = await axios.get('/api/sessions');
      setSessions(res.data);
      if (res.data.length > 0 && !activeSession) {
        selectSession(res.data[0]._id);
      }
    } catch (err) {
      console.error('[React Dashboard] Error fetching sessions:', err.message);
    }
  };

  const selectSession = async (sessionId) => {
    try {
      const sessionRes = await axios.get(`/api/sessions/${sessionId}`);
      setActiveSession(sessionRes.data);

      const lapRes = await axios.get(`/api/laps/${sessionId}`);
      setLaps(lapRes.data);

      const telRes = await axios.get(`/api/telemetry/${sessionId}`);
      const driverNo = sessionRes.data.driverId?.number || 1;
      setCarsTelemetryHistory(prev => ({
        ...prev,
        [driverNo]: telRes.data.slice(-60)
      }));
    } catch (err) {
      console.error('[React Dashboard] Error selecting session:', err.message);
    }
  };

  const checkTelemetryAlerts = (data) => {
    const alertsToTrigger = [];
    if (data.rpm >= 14800) {
      alertsToTrigger.push({ type: 'warning', message: `[#${data.driverNumber} ${data.driverName}] Engine Shift Peak: ${data.rpm} RPM` });
    }
    if (data.brake > 90 && data.speed > 220) {
      alertsToTrigger.push({ type: 'info', message: `[#${data.driverNumber} ${data.driverName}] Heavy Braking: -${Math.round(data.brake)}% @ ${data.speed} km/h` });
    }

    alertsToTrigger.forEach(a => {
      addAlert({
        id: Date.now() + Math.random(),
        ...a,
        timestamp: new Date().toLocaleTimeString()
      });
    });
  };

  const addAlert = (alertObj) => {
    setAlerts(prev => [alertObj, ...prev].slice(0, 10));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const liveTelemetry = carsTelemetry[selectedDriverNumber] || null;
  const telemetryHistory = carsTelemetryHistory[selectedDriverNumber] || [];

  return (
    <TelemetryContext.Provider value={{
      socket,
      isConnected,
      selectedDriverNumber,
      setSelectedDriverNumber,
      liveTelemetry,
      telemetryHistory,
      allCarsTrackPositions,
      sessions,
      activeSession,
      laps,
      alerts,
      fetchSessions,
      selectSession
    }}>
      {children}
    </TelemetryContext.Provider>
  );
};
