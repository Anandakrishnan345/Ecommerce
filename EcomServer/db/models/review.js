const mongoose = require("mongoose");


const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  reviewerName: { type: String, required: true },
  reviewerEmail: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create the Review model based on the review schema
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
