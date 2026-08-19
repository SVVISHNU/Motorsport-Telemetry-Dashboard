const Telemetry = require('../models/Telemetry');

class TelemetryService {
  validateTelemetry(data) {
    if (!data.sessionId || data.lapNumber === undefined || data.speed === undefined || data.rpm === undefined) {
      throw new Error('Invalid telemetry packet: missing required fields (sessionId, lapNumber, speed, rpm)');
    }

    return {
      sessionId: data.sessionId,
      lapNumber: Number(data.lapNumber),
      timestamp: Number(data.timestamp || Date.now()),
      distance: Math.max(0, Number(data.distance || 0)),
      speed: Math.min(400, Math.max(0, Math.round(Number(data.speed)))),
      rpm: Math.min(20000, Math.max(0, Math.round(Number(data.rpm)))),
      gear: Math.min(8, Math.max(0, Math.round(Number(data.gear || 1)))),
      throttle: Math.min(100, Math.max(0, Math.round(Number(data.throttle || 0)))),
      brake: Math.min(100, Math.max(0, Math.round(Number(data.brake || 0)))),
      steering: Math.min(180, Math.max(-180, Math.round(Number(data.steering || 0)))),
      latitude: Number(data.latitude || 0),
      longitude: Number(data.longitude || 0)
    };
  }

  calculateSpeed(distanceDelta, timeDeltaSec) {
    if (timeDeltaSec <= 0) return 0;
    const speedMps = distanceDelta / timeDeltaSec;
    return Math.round(speedMps * 3.6); // m/s to km/h
  }

  async storeTelemetry(telemetryData) {
    const validated = this.validateTelemetry(telemetryData);
    const doc = new Telemetry(validated);
    await doc.save();
    return doc;
  }

  async storeBatchTelemetry(telemetryBatch) {
    if (!Array.isArray(telemetryBatch) || telemetryBatch.length === 0) return [];
    const validatedBatch = telemetryBatch.map(item => this.validateTelemetry(item));
    return await Telemetry.insertMany(validatedBatch);
  }

  async getTelemetryBySession(sessionId, limit = 2000) {
    return await Telemetry.find({ sessionId }).sort({ timestamp: 1 }).limit(limit).lean();
  }

  async getTelemetryByLap(sessionId, lapNumber) {
    return await Telemetry.find({ sessionId, lapNumber: Number(lapNumber) }).sort({ timestamp: 1 }).lean();
  }
}

module.exports = new TelemetryService();
