const express = require('express');
const router = express.Router();
const telemetryController = require('../controllers/telemetryController');

router.post('/', telemetryController.storeTelemetry);
router.get('/:sessionId', telemetryController.getTelemetryBySession);
router.get('/:sessionId/lap/:lapNumber', telemetryController.getTelemetryByLap);
router.get('/:sessionId/export/csv', telemetryController.exportTelemetryCSV);

module.exports = router;
