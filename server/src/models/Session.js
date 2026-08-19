const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
    track: { type: String, required: true },
    sessionType: { type: String, enum: ['Practice', 'Qualifying', 'Race', 'Testing'], default: 'Practice' },
    date: { type: Date, default: Date.now },
    weather: {
      trackTemp: { type: Number, default: 35 },
      airTemp: { type: Number, default: 24 },
      condition: { type: String, default: 'Dry' }
    },
    bestLap: { type: Number, default: null }, // Stores best lap time in seconds
    status: { type: String, enum: ['active', 'completed'], default: 'active' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Session', sessionSchema);
