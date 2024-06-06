const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
  product: { 
     type: mongoose.Schema.Types.ObjectId,
     ref: 'products',
     required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },

  quantity: { type: Number, default: 1 },
});

const Wishlist = mongoose.model('Wishlist', wishlistItemSchema);

module.exports = Wishlist;
