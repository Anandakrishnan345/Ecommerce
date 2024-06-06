
const CartItem = require('../db/models/CartItem');
const Product = require('../db/models/products'); 
const { ObjectId } = require('mongoose').Types;

exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id; // req.user contains the authenticated user details

    // Validate productId
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Validate product existence
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if the product is already in the user's cart
    const existingCartItem = await CartItem.findOne({ product: productId, user: userId });
    if (existingCartItem) {
      return res.status(400).json({ error: 'Product already in cart' });
    }

    const cartItem = new CartItem({ product: productId, user: userId });
    await cartItem.save();

    res.status(201).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ error: 'Failed to add product to cart' });
  }
};






//get all items in cart based on logged in user

exports.getCartItemsByUserId = async (req, res) => {
  try {
    const userId = req.user.id; // Get the authenticated user's ID from the request
    
    // Find all cart items for the specified user ID
    const cartItems = await CartItem.find({ user: userId });

    // Create an array to store populated cart items with product details
    const populatedCartItems = [];

    // Loop through each cart item and populate the 'product' details
    for (const cartItem of cartItems) {
      const { product, quantity } = cartItem;
      const productDetails = await Product.findById(product);

      if (productDetails) {
        // Create a new object with combined cart item and product details
        const populatedCartItem = {
          _id: cartItem._id,
          product: {
            _id: productDetails._id,
            productName: productDetails.productName,
            price: productDetails.price,
            category: productDetails.category,
            image: productDetails.image,
            sellerName: productDetails.sellerName,
            contactEmail: productDetails.contactEmail
          },
          user: cartItem.user,
          userdata:req.user,
          quantity: cartItem.quantity,
          __v: cartItem.__v
        };

        // Push the populated cart item into the array
        populatedCartItems.push(populatedCartItem);
      }
    }

    // Send the populated cart items as the response
    res.status(200).json({ cartItems: populatedCartItems });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
};

// exports.updateCartItemQuantity = async (req, res) => {
//   try {
//     const { cartItemId } = req.params;
//     const { quantity } = req.body;

//     console.log('cartItemId:', cartItemId);
//     console.log('quantity:', quantity);

//     // Validate request data
//     if (!cartItemId) {
//       return res.status(400).json({ error: 'Cart item ID is required' });
//     }

//     const parsedQuantity = parseInt(quantity);
//     console.log('parsedquantity',parsedQuantity)

//     if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
//       return res.status(400).json({ error: 'Invalid quantity value' });
//     }

//     if (parsedQuantity > 5) {
//       return res.status(400).json({ message: 'Quantity must not exceed 5' });
//     }

//     // Update the quantity of the cart item
//     const updatedCartItem = await CartItem.findByIdAndUpdate(
//       cartItemId,
//       { quantity: parsedQuantity },
//       { new: true }
//     );

//     if (!updatedCartItem) {
//       return res.status(404).json({ error: 'Cart item not found' });
//     }

//     console.log('updatequantity Result:', updatedCartItem);

//     res.status(200).json({ message: 'Cart item quantity updated successfully', updatedCartItem });
//   } catch (error) {
//     console.error('Error updating cart item quantity:', error);
//     res.status(500).json({ error: 'Failed to update cart item quantity' });
//   }
// };

exports.updateCartItemQuantity = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    // Validate request data
    if (!cartItemId) {
      return res.status(400).json({ error: 'Cart item ID is required' });
    }

    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
      return res.status(400).json({ error: 'Invalid quantity value' });
    }

    const parsedQuantity = parseInt(quantity);

    if (parsedQuantity > 5) {
      return res.status(400).json({ message: 'Quantity must not exceed 5' });
    }

    // Update the quantity of the cart item
    const updatedCartItem = await CartItem.findByIdAndUpdate(
      cartItemId,
      { quantity: parsedQuantity },
      { new: true }
    );

    if (!updatedCartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    return res.status(200).json({ message: 'Cart item quantity updated successfully', updatedCartItem });
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    return res.status(500).json({ error: 'Failed to update cart item quantity' });
  }
};



exports.removeProductFromCart = async (req, res) => {
  try {
    const  userId  = req.user.id; // Assuming the authenticated user's ID is available
    const  { productId }  = req.params;

    // Validate request data
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Find and delete the cart item for the specified user and product
   const result= await CartItem.findOneAndDelete({ user: userId, product: productId });
   console.log('Delete Result:',result)

    res.status(200).json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    console.error('Error removing product from cart:', error);
    res.status(500).json({ error: 'Failed to remove product from cart' });
  }
};