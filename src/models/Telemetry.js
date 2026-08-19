const mongoose = require('mongoose');

const telemetrySchema = new mongoose.Schema(
  {
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true, index: true },
    lapNumber: { type: Number, required: true, index: true },
    timestamp: { type: Number, required: true },
    distance: { type: Number, required: true }, // meters around circuit
    speed: { type: Number, required: true }, // km/h
    rpm: { type: Number, required: true },
    gear: { type: Number, required: true },
    throttle: { type: Number, required: true }, // 0 to 100%
    brake: { type: Number, required: true }, // 0 to 100%
    steering: { type: Number, required: true }, // -180 to 180 degrees
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Telemetry', telemetrySchema);
