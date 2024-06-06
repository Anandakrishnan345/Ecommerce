const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticateUser = require('../Utils/authenticateUser');

router.post('/addorders', authenticateUser, orderController.createOrders);
router.get('/user-orders', authenticateUser, orderController.getOrdersByUserId);

module.exports = router;