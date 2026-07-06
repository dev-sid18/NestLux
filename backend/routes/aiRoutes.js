const express = require('express');
const router = express.Router();
const { smartSearch, generateDescription, chatAssistant } = require('../controllers/aiController');

router.post('/smart-search', smartSearch);
router.post('/generate-description', generateDescription);
router.post('/chat', chatAssistant);

module.exports = router;
