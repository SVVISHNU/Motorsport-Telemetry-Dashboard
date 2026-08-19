const Lap = require('../models/Lap');
const Session = require('../models/Session');

class LapService {
  calculateLapTime(sector1, sector2, sector3) {
    const s1 = Number(sector1) || 0;
    const s2 = Number(sector2) || 0;
    const s3 = Number(sector3) || 0;
    return parseFloat((s1 + s2 + s3).toFixed(3));
  }

  calculateSectorTime(startTime, endTime) {
    if (!startTime || !endTime) return 0;
    return parseFloat(((endTime - startTime) / 1000).toFixed(3));
  }

  async detectBestLap(sessionId) {
    const laps = await Lap.find({ sessionId }).sort({ lapTime: 1 }).lean();
    if (laps.length === 0) return null;

    const bestLap = laps[0];
    
    // Reset session best flags and set the fastest
    await Lap.updateMany({ sessionId }, { isSessionBest: false });
    await Lap.findByIdAndUpdate(bestLap._id, { isSessionBest: true });
    await Session.findByIdAndUpdate(sessionId, { bestLap: bestLap.lapTime });

    return bestLap;
  }

  async recordLap(lapData) {
    const { sessionId, lapNumber, sector1, sector2, sector3, topSpeed } = lapData;
    const lapTime = this.calculateLapTime(sector1, sector2, sector3);

    // Check if personal best for driver
    const session = await Session.findById(sessionId);
    let isPersonalBest = false;
    if (session) {
      const driverSessions = await Session.find({ driverId: session.driverId }).select('_id');
      const driverSessionIds = driverSessions.map(s => s._id);
      const existingBest = await Lap.findOne({ sessionId: { $in: driverSessionIds } }).sort({ lapTime: 1 }).lean();
      
      if (!existingBest || lapTime < existingBest.lapTime) {
        isPersonalBest = true;
      }
    }

    const lap = new Lap({
      sessionId,
      lapNumber,
      lapTime,
      sector1,
      sector2,
      sector3,
      topSpeed: topSpeed || 0,
      isPersonalBest
    });

    await lap.save();
    await this.detectBestLap(sessionId);

    return lap;
  }

  async getLapsBySession(sessionId) {
    return await Lap.find({ sessionId }).sort({ lapNumber: 1 }).lean();
  }
}

module.exports = new LapService();
