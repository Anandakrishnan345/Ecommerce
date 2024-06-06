// orderController.js
const Order = require('../db/models/Order');
const { success_function, error_function } = require('../Utils/responsehandler');
const Product = require('../db/models/products');
exports.createOrders = async (req, res) => {
  const { orderItems } = req.body;
  const userId = req.user.id; // Assuming you have user authentication and get user ID from token
  console.log(req.body); // Check the entire req.body object

  console.log('orderItems:', { orderItems });

  try {
    // Iterate over each order item and create an order
    await Promise.all(
      orderItems.map(async (orderItem) => {
        const { productId, quantity, totalPrice } = orderItem;

        // Create a new order in the database
        const newOrder = new Order({
          userId,
          productId,
          quantity,
          totalPrice,
          paymentStatus: 'Pending', // Add default payment status
          deliveryStatus: 'Order Placed' // Add default delivery status
        });

        // Save the new order
       const saveOrder = await newOrder.save();
      })
    );
    
    // Respond with success message using success_function
    const response = success_function({
      statusCode: 201,
      message: 'Orders created successfully.',
      data: orderItems
    });
    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error("Error creating orders:", error);
    // Respond with error message using error_function
    const response = error_function({
      statusCode: 500,
      message: 'Failed to create orders.',
      data: { error: error.message }
    });
    res.status(response.statusCode).json(response);
  }
};


exports.getOrdersByUserId = async (req, res) => {
  try {
    const userId = req.user.id; // Get the authenticated user's ID from the request
    
    // Find all orders for the specified user ID
    const orders = await Order.find({ userId });

    // Create an array to store populated orders with product details
    const populatedOrders = [];

    // Loop through each order and populate the 'product' details
    for (const order of orders) {
      const { productId, quantity } = order;
      const productDetails = await Product.findById(productId);

      if (productDetails) {
        // Create a new object with combined order and product details
        const populatedOrder = {
          _id: order._id,
          deliveryStatus:order.deliveryStatus,
          product: {
            _id: productDetails._id,
            productName: productDetails.productName,
            price: productDetails.price,
            category: productDetails.category,
            image: productDetails.image,
            sellerName: productDetails.sellerName,
            contactEmail: productDetails.contactEmail
          },
          userId: order.userId,
          quantity: order.quantity,
          totalPrice: order.totalPrice,
          __v: order.__v
        };

        // Push the populated order into the array
        populatedOrders.push(populatedOrder);
      }
    }

    // Send the populated orders as the response
    res.status(200).json({ orders: populatedOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};
