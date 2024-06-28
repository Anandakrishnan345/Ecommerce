const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  sellerId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    default: 'Pending' // Set default payment status
  },
  deliveryStatus: {
    type: String,
    default: 'Order Placed' // Set default delivery status
  },
  DeliveredAt: {
    type: Date,
    default: Date.now
  }
  
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
