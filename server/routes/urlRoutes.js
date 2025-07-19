const express = require('express');
const router = express.Router();
const urlController = require('../controller/urlController');

router.post('/encode', urlController.encodeURL);

router.post('/decode', urlController.decodeURL);

module.exports = router;
