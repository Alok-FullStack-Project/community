const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const eventController = require('../controllers/eventController');
const upload = require('../middleware/upload');

// Event CRUD
router.post('/', auth, upload.single('coverImage'),eventController.createEvent);
router.get('/',  eventController.listEvents); //auth,
router.get('/:id',  eventController.getEvent); //auth,
router.put('/:id', auth,upload.single('coverImage'), eventController.updateEvent);
router.delete('/:id', auth, eventController.deleteEvent);

// Event Images CRUD
router.post('/:id/image', auth, upload.single('url'), eventController.addEventImage);
router.get('/:id/images',  eventController.listEventImages); //auth,
router.get('/:id/images/gallery',  eventController.listEventImagesGallery); //auth,
router.put('/image/:imageId', auth, upload.single('url'),eventController.updateEventImage);
router.delete('/image/:imageId', auth, eventController.deleteEventImage);
router.get('/event-images/slider',  eventController.getSliderImages); //auth,

module.exports = router;
