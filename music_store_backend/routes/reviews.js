const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const {authenticateToken} = require("../services/securityService");

router.get('/:musicInstrumentId', reviewController.getInstrumentReviews);
router.post('/:musicInstrumentId', authenticateToken, reviewController.addInstrumentReview);
router.put('/:musicInstrumentId', authenticateToken, reviewController.editInstrumentReview);
router.delete('/:musicInstrumentId', authenticateToken, reviewController.deleteInstrumentReview);
router.get('/:musicInstrumentId/user', authenticateToken, reviewController.getUsersInstrumentReview);

module.exports = router;
