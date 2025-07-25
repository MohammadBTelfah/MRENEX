const express = require('express');
const router = express.Router();
const orderControllers = require('../controllers/orderControllers');
const auth = require('../middleware/authMiddleware');

router.post('/place-order', auth, orderControllers.PlaceOrder);
router.get('/get-all-orders', auth, orderControllers.getAllOrders);

module.exports = router;
