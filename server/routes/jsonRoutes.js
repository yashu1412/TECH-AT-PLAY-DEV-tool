const express = require('express');
const router = express.Router();
const jsonController = require('../controller/jsonController');


router.post('/format-json', jsonController.formatJSON);

router.get('/format-json/all', jsonController.getAllFormatted);

module.exports = router;
