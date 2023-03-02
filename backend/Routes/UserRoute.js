const express = require('express');
const { registerUser, loginUser, allUsers } = require('../controller/UserController');
const isAuthenticated = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/').get(isAuthenticated, allUsers);


module.exports = router;