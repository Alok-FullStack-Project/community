// routes/village.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // your auth middleware (optional but recommended)
const villageController = require('../controllers/villageController');

// Create
router.post('/', auth, villageController.createVillage);

// List / search / paginate
router.get('/',  villageController.listVillages); //auth,

// Get single
router.get('/:id', auth, villageController.getVillage);

// Update
router.put('/:id', auth, villageController.updateVillage);

// Delete

module.exports = router;
