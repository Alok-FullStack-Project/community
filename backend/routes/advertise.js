// routes/advertise.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // ensure this sets req.user
const advertiseController = require('../controllers/advertiseController');
const upload = require('../middleware/upload');

// Create
router.post('/', auth, upload.single('image'),advertiseController.createAdvertise);

// List / search / paginate
router.get('/',  advertiseController.listAdvertises);

// Get single
router.get('/:id', auth, advertiseController.getAdvertise);

// Update
router.put('/:id', auth, upload.single('image'),advertiseController.updateAdvertise);

// Delete (soft by default, hard with ?hard=true)
router.delete('/:id', auth, advertiseController.deleteAdvertise);

module.exports = router;
