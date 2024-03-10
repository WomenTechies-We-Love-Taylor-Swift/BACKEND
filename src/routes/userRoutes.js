// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.post('/', UserController.createUser);
router.get('/:userId', UserController.getUser);
router.put('/:userId', UserController.updateUser);
router.delete('/:userId', UserController.deleteUser);

module.exports = router;


