const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {authenticateToken, verifyUserId} = require("../services/securityService");

router.get('/:id',authenticateToken, verifyUserId, userController.getUserById);
router.put('/:id',authenticateToken, verifyUserId, userController.editUserById);

module.exports = router;
