


import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "../../Api-handler/Baseurl";
import {  useNavigate , Link } from "react-router-dom";

import Newnavbar from "../Newnavbar";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Authentication token not found. Please log in.");
        return;
      }

      const response = await axios.get(`${BASE_URL}/getcart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('cartresponse',response)
      setCartItems(response.data.cartItems);

      const totalPrice = response.data.cartItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );
      setTotalPrice(totalPrice);
    } catch (error) {
      console.error("Error fetching cart items:", error.message);
      toast.error("Failed to fetch cart items. Please try again.");
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Authentication token not found. Please log in.");
        return;
      }

      const response = await axios.put(
        `${BASE_URL}/cart/updateQuantity/${cartItemId}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Quantity updated successfully.");
      fetchCartItems(); // Refresh cart items after updating quantity
    } catch (error) {
      console.error("Error updating quantity:", error.response.data.message);
      toast.error(error.response.data.message);
    }
  };



const handleRemoveItem = async (cartItemId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Authentication token not found. Please log in.");
        return;
      }
      
      const response = await axios.delete(`${BASE_URL}/cart/removeProduct/${cartItemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('deleteresponse',response)
      toast.success("Item removed from cart successfully.");

      fetchCartItems(); // Refresh cart items after removing item
    } catch (error) {
      console.error("Error removing item from cart:", error.message);
      toast.error("Failed to remove item from cart. Please try again.");
    }
  };

  // const handleBuyNow = () => {
    const handleBuyNow = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Authentication token not found. Please log in.");
          return;
        }
    
        // Prepare order items from cart items
        // const orderItems = cartItems.map((item) => ({
        //   productId: item.product._id,
        //   quantity: item.quantity,
        //   totalPrice: item.product.price * item.quantity
        // }));
    
        // Make POST request to create orders
        // const response = await axios.post(
        //   `${BASE_URL}/addorders`,
        //   { orderItems },
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //       "Content-Type": "application/json"
        //     }
        //   }
        // );
    
        // console.log('Order creation response:', response.data);
        // toast.success("Order placed successfully!");
    
        // Clear the cart after successful order placement
        // setCartItems([]);
        // setTotalPrice(0);
              // Log product IDs from the cart items
      const productIds = cartItems.map(item => item.product._id);
      console.log('Product IDs:', productIds);
      navigate(`/ordersummary/${productIds}`);

      } catch (error) {
        console.error("Error placing order:", error.message);
        toast.error("Failed to place order. Please try again.");
      }
    };
    // updated
  // };

  return (
    <div className="container mx-auto px-4">
      <Newnavbar />
      <h1 className="sm:text-3xl text-lg font-bold mb-4 text-center">Your Cart</h1>
      {cartItems.length > 0 ? (
        <>
          {cartItems.map((item) => (
            <div key={item._id} className="flex items-center justify-around border-b border-gray-200 py-4">
              <div>
              
                <Link to={`/viewproductdetailsbuyer/${item.product._id}`} >
                <img src={`${BASE_URL}/${item.product.image}`} alt={item.product.productName} className="w-20 h-20 object-contain rounded hover:scale-110 transition-transform duration-300 ease-in-out" />
                </Link>
                <div className="ml-4">
                  <p className="font-bold sm:text-lg text-sm">{item.product.productName}</p>
                  <p className="text-gray-600 sm:text-lg text-xs">Price: ${item.product.price}</p>
                  <p className="text-gray-600 sm:text-lg text-xs">Quantity: {item.quantity}</p>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleUpdateQuantity(item._id, e.target.value)}
                  className="w-16 border border-gray-300 rounded-md p-2 text-center mr-4 sm:text-xl text-sm"
                />
                <button
                  onClick={() => handleRemoveItem(item.product._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md sm:text-xl text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="mt-8 flex flex-row justify-around">
            <p className="sm:text-xl font-bold px-6 py-3 mt-4 text-sm ">Total Price: ${totalPrice}</p>
            <button
              onClick={handleBuyNow}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md mt-4 sm:text-xl text-sm  "
            >
              Buy Now
            </button>
          </div>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;





    