const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const eventController = require('../controllers/eventController');
const upload = require('../middleware/upload');

// Event CRUD
router.post('/', auth, upload.single('coverImage'),eventController.createEvent);
router.get('/',  eventController.listEvents); //auth,
router.get('/:id', auth, eventController.getEvent);
router.put('/:id', auth, eventController.updateEvent);
router.delete('/:id', auth, eventController.deleteEvent);

// Event Images CRUD
router.post('/:id/image', auth, eventController.addEventImage);
router.get('/:id/images', auth, eventController.listEventImages);
router.put('/image/:imageId', auth, eventController.updateEventImage);
router.delete('/image/:imageId', auth, eventController.deleteEventImage);

module.exports = router;
