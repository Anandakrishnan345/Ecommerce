import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from '../../Api-handler/Baseurl';
import Newnavbar from '../Newnavbar';

function GetOrder() {
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in.');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${BASE_URL}/user-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response)
      const responseData = response.data;
      const orders = responseData.orders; // Extract the orders array from the response
      
      if (!Array.isArray(orders) || orders.length === 0) {
        toast.info('No orders found.');
      } else {
        setOrderDetails(orders); // Set order details if they exist
      }
      

      setLoading(false);
    } catch (error) {
      console.error('Error fetching order details:', error.message);
      toast.error('Failed to fetch order details. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="App">
      <Newnavbar />
      <header className="bg-indigo-500 p-4 text-white text-center">
        <h1>Orders</h1>
      </header>
      <div className="container mx-auto p-4 bg-white shadow-md mt-4">
        {orderDetails.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orderDetails.map((order, index) => (
            <div key={index} className="mb-4 p-4 border-b border-gray-300">
              <div className="flex items-center mb-4">
                <img
                  src={`${BASE_URL}/${order.product.image}`}
                  alt={order.product.productName}
                  className="w-24 h-24 mr-4"
                />
                <div className="flex-grow">
                  <p>{order.product.productName}</p>
                  <p className="text-green-600">₹{order.product.price}</p>
                  {/* <p>Delivered on {new Date(order.deliveryDate).toLocaleDateString()}</p> */}
                  <p>{order.deliveryStatus}</p>
                  <p className="text-gray-600">Your item has been delivered</p>
                  <button className="text-blue-600">Rate & Review Product</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default GetOrder;

