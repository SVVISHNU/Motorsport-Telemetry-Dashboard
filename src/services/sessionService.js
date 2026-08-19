const Session = require('../models/Session');
const Driver = require('../models/Driver');
const Lap = require('../models/Lap');

class SessionService {
  async createSession(sessionData) {
    const { driverId, track, sessionType, weather } = sessionData;

    let driver = await Driver.findById(driverId);
    if (!driver) {
      // Create a default driver if not found or provided by string
      driver = await Driver.create({
        name: 'Max Verstappen',
        number: 1,
        team: 'Red Bull Racing',
        country: 'Netherlands'
      });
    }

    const session = new Session({
      driverId: driver._id,
      track: track || 'Silverstone Circuit',
      sessionType: sessionType || 'Practice',
      weather: weather || { trackTemp: 38, airTemp: 26, condition: 'Dry' }
    });

    await session.save();
    return await Session.findById(session._id).populate('driverId');
  }

  async getAllSessions() {
    return await Session.find().populate('driverId').sort({ createdAt: -1 }).lean();
  }

  async getSessionById(id) {
    const session = await Session.findById(id).populate('driverId').lean();
    if (!session) return null;
    const laps = await Lap.find({ sessionId: id }).sort({ lapNumber: 1 }).lean();
    return { ...session, laps };
  }

  async deleteSession(id) {
    return await Session.findByIdAndDelete(id);
  }
}

module.exports = new SessionService();
