const mongoose = require('mongoose');

const lapSchema = new mongoose.Schema(
  {
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
    lapNumber: { type: Number, required: true },
    lapTime: { type: Number, required: true }, // in seconds
    sector1: { type: Number, required: true }, // in seconds
    sector2: { type: Number, required: true },
    sector3: { type: Number, required: true },
    topSpeed: { type: Number, default: 0 },
    isPersonalBest: { type: Boolean, default: false },
    isSessionBest: { type: Boolean, default: false }
  },
  { timestamps: true }
);

lapSchema.index({ sessionId: 1, lapNumber: 1 }, { unique: true });

module.exports = mongoose.model('Lap', lapSchema);
