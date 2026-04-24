const express = require('express');
const { processBfhl } = require('../controllers/bfhlController');

const router = express.Router();

router.post('/', processBfhl);

module.exports = router;
