const mongoose=require("mongoose");

// const reviewSchema = new mongoose.Schema({
//     reviewerName: { type: String, required: true },
//     rating: { type: Number, min: 1, max: 5, required: true },
//     comment: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now },
//   });

const products=new mongoose.Schema({
    productName:"string",
    price:"string",
    category:"string",
    image:"string",
    paymentMethod:"string",
    sellerName:"string",
    contactEmail:"string",
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users' // Reference to the User model
      },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users' // Reference to the User model
    },
    // reviews: [reviewSchema], 

})
module.exports=mongoose.model("products",products);