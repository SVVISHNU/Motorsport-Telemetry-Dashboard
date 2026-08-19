const lapService = require('../services/lapService');

exports.getLapsBySession = async (req, res) => {
  try {
    const laps = await lapService.getLapsBySession(req.params.sessionId);
    res.json(laps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createLap = async (req, res) => {
  try {
    const lap = await lapService.recordLap(req.body);
    res.status(201).json(lap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
