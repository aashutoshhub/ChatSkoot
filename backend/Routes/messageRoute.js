const express = require('express');
const { sendMessage, getMessages } = require('../controller/MessageController');
const isAuthenticated = require('../middleware/authMiddleware');
const router = express.Router();


router.route('/').post(isAuthenticated, sendMessage);
router.route('/:chatId').get(isAuthenticated, getMessages);

module.exports = router;