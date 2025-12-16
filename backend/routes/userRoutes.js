// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');

router.post('/', userCtrl.createUser);
router.get('/', userCtrl.listUsers);
router.get("/count", async (req, res) => {
  try {
    const User = require("../models/User");
    const count = await User.countDocuments();
    res.status(200).json({ count });
  } catch (err) {
    console.log("❌ Count Error:", err.message);
    res.status(500).json({
      message: "Failed to count User",
      error: err.message
    });
  }
});
router.get('/:id', userCtrl.getUser);
router.put('/:id', userCtrl.updateUser);
router.delete('/:id', userCtrl.deleteUser);

module.exports = router;
