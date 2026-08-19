const telemetryService = require('../services/telemetryService');
const lapService = require('../services/lapService');

let liveSessionId = null;
let liveTelemetryCache = [];

module.exports = function (io) {
  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Allow client to request active session ID or current state
    socket.emit('live_session_info', { sessionId: liveSessionId });

    // Handle telemetry incoming from simulator
    socket.on('telemetry_data', async (data) => {
      try {
        if (data.sessionId) liveSessionId = data.sessionId;
        
        // Broadcast immediately for low latency UI dashboard update
        io.emit('live_telemetry', data);

        // Store into cache & persist to MongoDB
        liveTelemetryCache.push(data);
        if (liveTelemetryCache.length >= 5) {
          const batchToSave = [...liveTelemetryCache];
          liveTelemetryCache = [];
          telemetryService.storeBatchTelemetry(batchToSave).catch(err => {
            console.error('[Socket.IO] Error persisting telemetry batch:', err.message);
          });
        }
      } catch (err) {
        console.error('[Socket.IO] Telemetry process error:', err.message);
      }
    });

    // Handle lap completed event from simulator
    socket.on('lap_completed', async (lapData) => {
      try {
        console.log(`[Socket.IO] Lap completed event received for Session ${lapData.sessionId}, Lap ${lapData.lapNumber}`);
        const lap = await lapService.recordLap(lapData);
        io.emit('lap_recorded', lap);
      } catch (err) {
        console.error('[Socket.IO] Error recording lap:', err.message);
      }
    });

    // Handle simulator start/reset session command
    socket.on('start_session', (sessionInfo) => {
      liveSessionId = sessionInfo.sessionId;
      io.emit('session_started', sessionInfo);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });
};
