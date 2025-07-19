const express = require('express');
const router = express.Router();
const base64Controller = require('../controller/base64Controller');

router.post('/encode', base64Controller.encode);
router.post('/decode', base64Controller.decode);
router.get('/history', base64Controller.getHistory);

module.exports = router;
