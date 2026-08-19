const telemetryService = require('../services/telemetryService');

exports.getTelemetryBySession = async (req, res) => {
  try {
    const telemetry = await telemetryService.getTelemetryBySession(req.params.sessionId);
    res.json(telemetry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTelemetryByLap = async (req, res) => {
  try {
    const { sessionId, lapNumber } = req.params;
    const telemetry = await telemetryService.getTelemetryByLap(sessionId, lapNumber);
    res.json(telemetry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.storeTelemetry = async (req, res) => {
  try {
    const doc = await telemetryService.storeTelemetry(req.body);
    res.status(201).json(doc);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.exportTelemetryCSV = async (req, res) => {
  try {
    const telemetry = await telemetryService.getTelemetryBySession(req.params.sessionId, 10000);
    
    if (!telemetry || telemetry.length === 0) {
      return res.status(404).send('No telemetry data found for CSV export.');
    }

    const headers = ['Timestamp', 'LapNumber', 'Distance(m)', 'Speed(km/h)', 'RPM', 'Gear', 'Throttle(%)', 'Brake(%)', 'Steering(deg)', 'Lat', 'Lng'];
    const rows = telemetry.map(t => [
      t.timestamp,
      t.lapNumber,
      t.distance,
      t.speed,
      t.rpm,
      t.gear,
      t.throttle,
      t.brake,
      t.steering,
      t.latitude,
      t.longitude
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=telemetry_session_${req.params.sessionId}.csv`);
    res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
