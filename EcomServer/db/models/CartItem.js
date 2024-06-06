const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { 
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Product',
     required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },

  quantity: { type: Number, default: 1 },
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;
