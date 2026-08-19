const express = require('express');
const router = express.Router();
const lapController = require('../controllers/lapController');

router.get('/:sessionId', lapController.getLapsBySession);
router.post('/', lapController.createLap);

module.exports = router;
