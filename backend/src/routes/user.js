// routes/url.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');

// Ruta para acortar URL
router.post('/register', userController.createUser);
router.post('/login', userController.login);
router.get('/isAuthenticated', userController.isAuthenticated);
router.get('/logout', userController.logout);

module.exports = router;
