const express = require('express');
const router = express.Router();
const cartControllers = require('../controllers/cartControllers');
const auth = require('../middleware/authMiddleware');

router.post('/add-to-cart', auth, cartControllers.addToCart);
router.get('/get-cart', auth, cartControllers.getCart);
router.delete('/remove-from-cart', auth, cartControllers.removeFromCart);

module.exports = router;
