const express = require('express');
const {
  accessChat,
  fetchChats,
  createGroup,
  renameGroup,
  addToGroup,
  removeFromGroup
} = require('../controller/ChatController');

const isAuthenticated = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(isAuthenticated, accessChat);
router.route('/').get(isAuthenticated, fetchChats);
router.route('/group').post(isAuthenticated, createGroup);
router.route('/rename').put(isAuthenticated, renameGroup);
router.route('/groupadd').post(isAuthenticated, addToGroup);
router.route('/groupremove').post(isAuthenticated, removeFromGroup);

module.exports = router;
