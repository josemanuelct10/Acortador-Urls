// routes/url.js
const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlsController');

// Ruta para acortar URL
router.post('/sendUrl', urlController.createUrl);
router.get('/:shortId', urlController.redirectUrl);
router.get('/getUrls/:idUser', urlController.getUrls);

module.exports = router;
