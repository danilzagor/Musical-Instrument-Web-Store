const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {authenticateToken} = require("../services/securityService");

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/register', authController.register)
router.get('/verify', authenticateToken ,authController.verify)

module.exports = router;
