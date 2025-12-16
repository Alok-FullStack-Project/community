// routes/village.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // your auth middleware (optional but recommended)
const villageController = require('../controllers/villageController');

// Create
router.post('/', auth, villageController.createVillage);

// List / search / paginate
router.get('/',  auth,villageController.listVillages); //auth,

router.get("/count", auth, async (req, res) => {
  try {
    const Village = require("../models/Village");
    const count = await Village.countDocuments();
    res.status(200).json({ count });
  } catch (err) {
    console.log("❌ Count Error:", err.message);
    res.status(500).json({
      message: "Failed to count Villages",
      error: err.message
    });
  }
});
// Get single
router.get('/:id', auth, villageController.getVillage);

// Update
router.put('/:id', auth, villageController.updateVillage);

// Delete

module.exports = router;
