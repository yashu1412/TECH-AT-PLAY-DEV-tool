const express = require('express');
const router = express.Router();
const multer = require('multer');
const hashController = require('../controller/hashController');

const upload = multer({ dest: 'uploads/' });

router.post('/text', hashController.generateTextHashes);
router.post('/file', upload.single('file'), hashController.generateFileHashes);

module.exports = router;
