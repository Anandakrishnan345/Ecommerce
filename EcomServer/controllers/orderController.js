// orderController.js
const Order = require('../db/models/Order');
const { success_function, error_function } = require('../Utils/responsehandler');
const Product = require('../db/models/products');
const mongoose = require('mongoose');
// exports.createOrders = async (req, res) => {
//   const { orderItems } = req.body;
//   const userId = req.user.id; // Assuming you have user authentication and get user ID from token
//   console.log(req.body); // Check the entire req.body object

//   console.log('orderItems:', { orderItems });

//   try {
//     // Iterate over each order item and create an order
//     await Promise.all(
//       orderItems.map(async (orderItem) => {
//         const { productId, quantity, totalPrice } = orderItem;

//         // Create a new order in the database
//         const newOrder = new Order({
//           userId,
//           productId,
//           quantity,
//           totalPrice,
//           paymentStatus: 'Pending', // Add default payment status
//           deliveryStatus: 'Order Placed' // Add default delivery status
//         });

//         // Save the new order
//        const saveOrder = await newOrder.save();
//       })
//     );
    
//     // Respond with success message using success_function
//     const response = success_function({
//       statusCode: 201,
//       message: 'Orders created successfully.',
//       data: orderItems
//     });
//     res.status(response.statusCode).json(response);
//   } catch (error) {
//     console.error("Error creating orders:", error);
//     // Respond with error message using error_function
//     const response = error_function({
//       statusCode: 500,
//       message: 'Failed to create orders.',
//       data: { error: error.message }
//     });
//     res.status(response.statusCode).json(response);
//   }
// };


// exports.createOrders = async (req, res) => {
//   const { orderItems } = req.body;
//   const userId = req.user.id; // Assuming you have user authentication and get user ID from token
//   console.log(req.body); // Check the entire req.body object
//   console.log('orderItems:', { orderItems });

//   try {
//     // Iterate over each order item and create an order
//     const createdOrders = await Promise.all(
//       orderItems.map(async (orderItem) => {
//         const { productId, quantity, totalPrice } = orderItem;

//         // Fetch the product details to get the sellerId
//         const productDetails = await Product.findById(productId);
//         if (!productDetails) {
//           throw new Error(`Product with ID ${productId} not found.`);
//         }

//         const sellerId = productDetails.addedBy;

//         // Create a new order in the database
//         const newOrder = new Order({
//           userId,
//           productId,
//           sellerId, // Include the sellerId from product details
//           quantity,
//           totalPrice,
//           paymentStatus: 'Pending', // Add default payment status
//           deliveryStatus: 'Order Placed' // Add default delivery status
//         });

//         // Save the new order
//         const savedOrder = await newOrder.save();
//         return savedOrder; // Return the saved order
//       })
//     );

//     // Respond with success message using success_function
//     const response = success_function({
//       statusCode: 201,
//       message: 'Orders created successfully.',
//       data: createdOrders // Include the saved orders in the response
//     });
//     res.status(response.statusCode).json(response);
//   } catch (error) {
//     console.error("Error creating orders:", error);
//     // Respond with error message using error_function
//     const response = error_function({
//       statusCode: 500,
//       message: 'Failed to create orders.',
//       data: { error: error.message }
//     });
//     res.status(response.statusCode).json(response);
//   }
// };

exports.createOrders = async (req, res) => {
  const { orderItems } = req.body;
  const userId = req.user.id;

  try {
    const createdOrders = [];

    for (const orderItem of orderItems) {
      const { productId, quantity, totalPrice } = orderItem;

      const productDetails = await Product.findById(productId);

      if (!productDetails) {
        throw new Error(`Product with ID ${productId} not found.`);
      }

      if (productDetails.stock < quantity) {
        throw new Error(`Insufficient stock, inStock: ${productDetails.stock}.`);
      }

      productDetails.stock -= quantity;
      await productDetails.save();

      const sellerId = productDetails.addedBy;

      const newOrder = new Order({
        userId,
        productId,
        sellerId,
        quantity,
        totalPrice,
        paymentStatus: 'Pending',
        deliveryStatus: 'Order Placed'
      });

      const savedOrder = await newOrder.save();
      createdOrders.push(savedOrder);
    }

    const response = success_function({
      statusCode: 201,
      message: 'Orders created successfully.',
      data: createdOrders
    });

    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error("Error creating orders:", error);
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
          DeliveredAt:order. DeliveredAt,
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

// Assume you have the necessary imports and setup, e.g., Order and Product models

exports.getOrdersBySellerId = async (req, res) => {
  try {
    const addedBy = req.user.id; // Get the authenticated seller's ID from the request
    
    // Find all products sold by the seller
    const products = await Product.find({ addedBy });

    // Extract product IDs sold by the seller
    const productIds = products.map(product => product._id);

    // Find all orders containing products sold by the seller
    const orders = await Order.find({ productId: { $in: productIds } });

    // Create an array to store populated orders with product details
    const populatedOrders = [];

    // Loop through each order and populate the 'product' details
    for (const order of orders) {
      const { productId, quantity } = order;
      const productDetails = products.find(product => product._id.toString() === productId.toString());

      if (productDetails) {
        // Create a new object with combined order and product details
        const populatedOrder = {
          _id: order._id,
          deliveryStatus: order.deliveryStatus,
          paymentStatus: order.paymentStatus,
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
exports.updateOrderBySellerId = async (req, res) => {
  const sellerId = req.user.id; // Get the authenticated seller's ID from the request
  const { orderId } = req.params; // Order ID to be updated
  const updateData = req.body; // Data to update

  // Add the sellerId to the update data
  updateData.sellerId = sellerId;

  try {
    // Fetch the order by its ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json(error_function({
        statusCode: 404,
        message: 'Order not found.',
        data: {}
      }));
    }

    // Fetch the product details for the order to verify the seller
    const product = await Product.findById(order.productId);

    if (!product) {
      return res.status(404).json(error_function({
        statusCode: 404,
        message: 'Product associated with this order not found.',
        data: {}
      }));
    }

    // Check if the authenticated seller is the owner of the product
    if (product.addedBy.toString() !== sellerId) {
      return res.status(403).json(error_function({
        statusCode: 403,
        message: 'You are not authorized to update this order.',
        data: {}
      }));
    }

    // Update the order with the provided data
    for (const key in updateData) {
      if (updateData.hasOwnProperty(key)) {
        order[key] = updateData[key];
      }
    }

    // Save the current date when the update is made
    order.updatedAt = new Date();

    // Save the updated order
    const updatedOrder = await order.save();

    // Send the updated order as the response
    res.status(200).json(success_function({
      statusCode: 200,
      message: 'Order updated successfully.',
      data: updatedOrder
    }));

  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json(error_function({
      statusCode: 500,
      message: 'Failed to update order.',
      data: { error: error.message }
    }));
  }
};
