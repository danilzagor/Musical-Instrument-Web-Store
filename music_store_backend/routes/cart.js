const express = require('express');
const router = express.Router();
const {authenticateToken} = require("../services/securityService");
const cartController = require("../controllers/cartController");

router.post('/:musicInstrumentId', authenticateToken, cartController.addToCart);
router.get('/:musicInstrumentId', authenticateToken, cartController.getInstrumentInCart);
router.get('/', authenticateToken, cartController.getCart);
router.delete('/', authenticateToken, cartController.deleteCart);
router.delete('/:musicInstrumentId', authenticateToken, cartController.deleteFromCart);


module.exports = router;