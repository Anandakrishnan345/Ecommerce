const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticateUser = require('../Utils/authenticateUser');

// POST add to cart
router.post('/addToCart',authenticateUser, cartController.addToCart);
router.get('/getcart', authenticateUser,cartController.getCartItemsByUserId);
router.put('/cart/updateQuantity/:cartItemId',authenticateUser,cartController.updateCartItemQuantity);
router.delete('/cart/removeProduct/:productId', authenticateUser,cartController.removeProductFromCart);


module.exports = router;
