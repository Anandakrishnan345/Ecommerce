
const Products = require('../db/models/products');
const Review = require('../db/models/review')
const { success_function, error_function } = require('../Utils/responsehandler');
const { response, request } = require('express');
const mongoose = require('mongoose');
const { Types: { ObjectId } } = mongoose;
const Wishlist = require('../db/models/Wishlist');
const { deleteImage } = require('../Utils/fileUtils')





// Controller function to handle product creation
exports.addProduct = async (req, res) => {
  const { productName, price, category, sellerName, contactEmail } = req.body;
  const { path: imagePath } = req.file; // Ensure req.file exists and get path
  const addedBy = req.user.id;

  try {
    // Validate required fields
    if (!productName || !price || !category || !sellerName || !contactEmail || !imagePath) {
      return res.status(400).json(error_function({ statusCode: 400, message: 'All fields are required' }));
    }

    // Create new product instance
    const newProduct = new Products({
      productName,
      price,
      category,
      sellerName,
      contactEmail,
      image: imagePath,
      addedBy: addedBy
    });

    // Save product to database
    const savedProduct = await newProduct.save();

    console.log('Product added successfully:', savedProduct);

    // Respond with success message using success_function
    const response = success_function({
      statusCode: 201,
      message: 'Product added successfully',
      data: { product: savedProduct }
    });
    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error('Error adding product:', error.message);
    // Respond with error message using error_function
    const response = error_function({
      statusCode: 500,
      message: 'Internal server error',
      data: { error: error.message }
    });
    res.status(response.statusCode).json(response);
  }
};



// exports.getAllProducts = async (req, res) => {
//     try {
//         const products = await Products.find()
//             .populate('seller', 'name email'); // Populate 'seller' field with user details (name and email)

//         res.status(200).json({ products });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch products', details: error.message });
//     }
// };

// Function to get products with optional search query
exports.getAllProducts = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};
    if (search) {
      query = {
        $or: [
          { productName: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const products = await Products.find(query)
      .populate('seller', 'name email'); // Populate 'seller' field with user details (name and email)

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params; // Extract the product ID from URL params

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    // Find the product by ID and populate the 'seller' field with 'name' and 'email'
    const product = await Products.findById(id).populate('seller', 'name email');

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ error: 'Product not found', id });
    }

    // Return the product details if found
    res.status(200).json({ product });
  } catch (error) {
    console.error('Error fetching product:', error.message);
    res.status(500).json({ error: 'Failed to fetch product', details: error.message });
  }
};





exports.viewProductSeller = async (req, res) => {
  try {
    const { addedByUserId } = req.params;

    // Validate the format of addedByUserId
    if (!mongoose.Types.ObjectId.isValid(addedByUserId)) {
      return res.status(400).json(error_function({ statusCode: 400, message: 'Invalid user ID' }));
    }
    console.log('id',addedByUserId)
    // Find product by `addedBy` field using Mongoose ObjectId
    const product = await Products.find ({ addedBy: addedByUserId })
      .populate('seller', 'name email');

    if (!product) {
      return res.status(404).json(error_function({ statusCode: 404, message: 'Product not found' }));
    }

    // Return successful response with the product data
    return res.status(200).json({ product });
  } catch (error) {
    console.error('Failed to fetch product:', error.message);
    // Handle internal server error with error response
    return res.status(500).json(error_function({ statusCode: 500, message: 'Failed to fetch product', details: error.message }));
  }
};



// Update product by seller 



// exports.updateProduct = async (req, res) => {
//   const { productId } = req.params; // Extract the product ID from URL params
//   const { productName, price, category, contactEmail } = req.body;
//   const updatedBy = req.user.id; // Authenticated user ID (seller)
   
//   try {
//     // Validate required fields
//     // if (!productName || !price || !category || !contactEmail) {
//     //   return res.status(400).json(error_function({ statusCode: 400, message: 'All fields are required' }));
//     // }
 
//     // Check if the product ID is valid
//     if (!mongoose.Types.ObjectId.isValid(productId)) {
//       return res.status(400).json(error_function({ statusCode: 400, message: 'Invalid product ID' }));
//     }

//     // Find the product by ID
//     const product = await Products.findById(productId);

//     // Check if the product exists
//     if (!product) {
//       return res.status(404).json(error_function({ statusCode: 404, message: 'Product not found' }));
//     }

//     // Check if the authenticated user is the one who added the product
//     if (product.addedBy.toString() !== updatedBy) {
//       console.log('addedby',product.addedBy);
//       console.log('updatedby',updatedBy);
//       return res.status(403).json(error_function({ statusCode: 403, message: 'Unauthorized: You are not allowed to update this product' }));
//     }

//     // Update product fields
//     product.productName = productName;
//     product.price = price;
//     product.category = category;
//     product.contactEmail = contactEmail;

//     // Check if a file was uploaded (optional)
//     if (req.file) {
//       product.image = req.file.path; // Assuming 'path' is the property containing the file path
//     }

//     // Save the updated product
//     const updatedProduct = await product.save();

//     // Respond with success message using success_function
//     const response = success_function({
//       statusCode: 200,
//       message: 'Product updated successfully',
//       data: { product: updatedProduct }
//     });
//     res.status(response.statusCode).json(response);
//   } catch (error) {
//     console.error('Error updating product:', error.message);
//     // Respond with error message using error_function
//     const response = error_function({
//       statusCode: 500,
//       message: 'Internal server error',
//       data: { error: error.message }
//     });
//     res.status(response.statusCode).json(response);
//   }
// };



// exports.updateProduct = async (req, res) => {
//   const { productId } = req.params; // Extract the product ID from URL params
//   const { productName, price, category, contactEmail } = req.body;
//   const updatedBy = req.user.id; // Authenticated user ID (seller)

   
//   try {
//     // Validate required fields (if needed)
//     // if (!productName || !price || !category || !contactEmail) {
//     //   return res.status(400).json(error_function({ statusCode: 400, message: 'All fields are required' }));
//     // }
 
//     // Check if the product ID is valid
//     if (!mongoose.Types.ObjectId.isValid(productId)) {
//       return res.status(400).json(error_function({ statusCode: 400, message: 'Invalid product ID' }));
//     }

//     // Find the product by ID
//     const product = await Products.findById(productId);

//     // Check if the product exists
//     if (!product) {
//       return res.status(404).json(error_function({ statusCode: 404, message: 'Product not found' }));
//     }

//     // Check if the authenticated user is the one who added the product
//     if (product.addedBy.toString() !== updatedBy) {
//       return res.status(403).json(error_function({ statusCode: 403, message: 'Unauthorized: You are not allowed to update this product' }));
//     }

//     // Store the original product data before update
//     const originalProductData = {
//       productName: product.productName,
//       price: product.price,
//       category: product.category,
//       contactEmail: product.contactEmail,
//       image: product.image // Assuming you want to include the image path
//     };

//     // Update product fields, retaining original data if updated field is empty
//     product.productName = productName || originalProductData.productName;
//     product.price = price || originalProductData.price;
//     product.category = category || originalProductData.category;
//     product.contactEmail = contactEmail || originalProductData.contactEmail;

//     // Check if a file was uploaded (optional)
//     if (req.file) {
//       // Update product image with the new file path
//       product.image = req.file.path;
//     }

//     // Save the updated product
//     const updatedProduct = await product.save();

//     // Respond with success message and updated product data
//     const response = success_function({
//       statusCode: 200,
//       message: 'Product updated successfully',
//       data: {
//         updatedProduct: updatedProduct,
//         originalProductData: originalProductData // Include original product data in the response
//       }
//     });
    
//     res.status(response.statusCode).json(response);
//   } catch (error) {
//     console.error('Error updating product:', error.message);
//     // Respond with error message using error_function
//     const response = error_function({
//       statusCode: 500,
//       message: 'Internal server error',
//       data: { error: error.message }
//     });
//     res.status(response.statusCode).json(response);
//   }
// };

exports.updateProduct = async (req, res) => {
  const { productId } = req.params; // Extract the product ID from URL params
  const { productName, price, category, contactEmail } = req.body;
  const updatedBy = req.user.id; // Authenticated user ID (seller)

  try {
    // Validate required fields (if needed)
    // if (!productName || !price || !category || !contactEmail) {
    //   return res.status(400).json(error_function({ statusCode: 400, message: 'All fields are required' }));
    // }

    // Check if the product ID is valid
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json(error_function({ statusCode: 400, message: 'Invalid product ID' }));
    }

    // Find the product by ID
    const product = await Products.findById(productId);

    // Check if the product exists
    if (!product) {
      return res.status(404).json(error_function({ statusCode: 404, message: 'Product not found' }));
    }

    // Check if the authenticated user is the one who added the product
    if (product.addedBy.toString() !== updatedBy) {
      return res.status(403).json(error_function({ statusCode: 403, message: 'Unauthorized: You are not allowed to update this product' }));
    }

    // Store the original product data before update
    const originalProductData = {
      productName: product.productName,
      price: product.price,
      category: product.category,
      contactEmail: product.contactEmail,
      image: product.image // Assuming you want to include the image path
    };

    // Update product fields, retaining original data if updated field is empty
    product.productName = productName || originalProductData.productName;
    product.price = price || originalProductData.price;
    product.category = category || originalProductData.category;
    product.contactEmail = contactEmail || originalProductData.contactEmail;

    // Check if a file was uploaded (optional)
    if (req.file) {
      // Delete existing image if present
      if (product.image) {
        // Implement a function to delete the old image using fs.unlinkSync
        deleteImage(product.image);
      }
      // Update product image with the new file path
      product.image = req.file.path;
    }

    // Save the updated product
    const updatedProduct = await product.save();

    // Respond with success message and updated product data
    const response = success_function({
      statusCode: 200,
      message: 'Product updated successfully',
      data: {
        updatedProduct: updatedProduct,
        originalProductData: originalProductData // Include original product data in the response
      }
    });

    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error('Error updating product:', error.message);
    // Respond with error message using error_function
    const response = error_function({
      statusCode: 500,
      message: 'Internal server error',
      data: { error: error.message }
    });
    res.status(response.statusCode).json(response);
  }
};

// Function to delete an image file
// const deleteImage = (filePath) => {
//   // const fs = require('fs');
//   try {
//     fs.unlinkSync(filePath); // Synchronously delete the file
//     console.log(`Deleted old image: ${filePath}`);
//   } catch (error) {
//     console.error(`Error deleting image: ${error}`);
//   }
// };


exports.deleteProduct = async (req, res) => {
  const { productId } = req.params;
  const updatedBy = req.user.id; // Authenticated user ID
  const userRole = req.user.user_type; // Authenticated user's user_type

  try {
    // Check if the product ID is valid
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    // Find the product by ID
    const product = await Products.findById(productId);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the authenticated user added the product or has admin rights
    if (product.addedBy.toString() !== updatedBy && userRole !== '65eecb8e18357aefe2c8f15b') {
      return res.status(403).json({ message: 'Unauthorized: You are not allowed to delete this product' });
    }

    // Delete the product from the database
    await Products.findByIdAndDelete(productId);

    // If deletion is successful, delete the associated image
    if (product.image) {
      deleteImage(product.image);
      console.log('Deleted image:', product.image);
    }

    // Respond with success message
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// // Function to delete an image file
// const deleteImage = (filePath) => {
//   try {
//     fs.unlinkSync(filePath); // Synchronously delete the file
//     console.log(`Deleted image: ${filePath}`);
//   } catch (error) {
//     console.error(`Error deleting image: ${error}`);
//   }
// };

exports.addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const { name } = req.user; // Access the authenticated user's name and email
    const { email } = req.user;
    console.log('user',req.user)
    // Check if the product exists
    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Create a new review
    const newReview = new Review({
      productId,
      reviewerName: name, // Use the authenticated user's name as the reviewerName
      reviewerEmail: email, // Use the authenticated user's email as the reviewerEmail
      rating,
      comment
    });

    // Save the new review
    await newReview.save();

    res.status(201).json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: "Failed to add review" });
  }
};

// Controller to get all reviews for a specific product
exports.getAllReviewsForProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find all reviews for the specified product
    const reviews = await Review.find({ productId });

    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

exports.addToWishlist = async (req, res) => {
  // try {
  //   const { productId } = req.body;
  //   const userId = req.user.id; // req.user contains the authenticated user details
  //   console.log("User ID:", userId); // Log user ID
  //   console.log("Product ID:", productId);
  //   // Validate productId
  //   if (!productId) {
  //     console.log("Product ID is missing");
  //     return res.status(400).json({ error: 'Product ID is required' });
  //   }

  //   // Check if the product is already in the wishlist
  //   let wishlistItem = await Wishlist.findOne({ product: productId, user: userId });

  //   if (wishlistItem) {
  //     // If the product is already in the wishlist, you can choose to update the quantity or return a message
  //     return res.status(400).json({ error: 'Product is already in the wishlist' });
  //   } else {
  //     // Create a new wishlist item
  //     wishlistItem = new Wishlist({ product: productId, user: userId });
  //     await wishlistItem.save();
  //   }

  //   res.status(201).json({ message: 'Product added to wishlist successfully' });
  // } catch (error) {
  //   console.error('Error adding product to wishlist:', error);
  //   res.status(500).json({ error: 'Failed to add product to wishlist' });
  // }

  const userId = req.user.id;
  const { productId } = req.body;


  if (!productId) {
    
    return res.status(400).json({ success: false, message: 'Product ID is required' });
  }

  try {
    const existingWishlistItem = await Wishlist.findOne({ user: userId, product: productId });

    if (existingWishlistItem) {
      await Wishlist.deleteOne({ user: userId, product: productId });
      
      return res.status(200).json({ success: true, message: 'Product removed from wishlist' });
    } else {
      const newWishlistItem = new Wishlist({ user: userId, product: productId });
      await newWishlistItem.save();
      
      return res.status(200).json({ success: true, message: 'Product added to wishlist' });
    }
  } catch (error) {
    console.error('Error updating wishlist:', error);
    res.status(500).json({ success: false, message: 'Failed to update wishlist' });
  }
};


exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from authenticated user details
    const wishlistItems = await Wishlist.find({ user: userId }).populate('product');

    if (!wishlistItems) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    // Extract relevant information from wishlist items
    const wishlist = wishlistItems.map(item => ({
      productId: item.product._id,
      productName: item.product.productName,
      price: item.product.price,
      imageUrl: item.product.image,
    }));

    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch wishlist' });
  }
};
