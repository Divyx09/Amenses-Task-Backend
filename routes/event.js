const express = require('express');
const router = express.Router();

const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');

router.post('/create', auth, eventController.createEvent);
router.get('/', eventController.getEvents);
router.post('/join', auth, eventController.joinEvent);
router.get('/joined', auth, eventController.getJoinedEvents);

module.exports = router;
