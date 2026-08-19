const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    number: { type: Number, required: true, unique: true },
    team: { type: String, required: true },
    country: { type: String, default: 'Global' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Driver', driverSchema);
