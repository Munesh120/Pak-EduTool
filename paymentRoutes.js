const express = require('express');
const router = express.Router();
const { initiatePayment, confirmPayment, getPaymentStatus } = require('../controllers/paymentController');

router.post('/initiate', initiatePayment);
router.post('/confirm', confirmPayment);
router.get('/status/:id', getPaymentStatus);

module.exports = router;
