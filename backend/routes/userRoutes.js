// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');

router.post('/', userCtrl.createUser);
router.get('/', userCtrl.listUsers);
router.get('/:id', userCtrl.getUser);
router.put('/:id', userCtrl.updateUser);
router.delete('/:id', userCtrl.deleteUser);

module.exports = router;
