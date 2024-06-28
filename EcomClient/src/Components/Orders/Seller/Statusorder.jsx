// UpdateOrderStatus.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import BASE_URL from '../../../Api-handler/Baseurl';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateOrderStatus = () => {
  console.log('UpdateOrderStatus component rendered'); // Check if the component renders
  const { orderId } = useParams();
  console.log('Received orderId from useParams:', orderId); // Log the received orderId

  const [order, setOrder] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('Pending');
  const [deliveryStatus, setDeliveryStatus] = useState('Order Placed');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Fetching order details for orderId:', orderId);
        const response = await axios.get(`${BASE_URL}/seller-orders`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Fetched order data:', response.data);
        const orderData = response.data.orders.find(order => order._id === orderId); // Fetch specific order
        setOrder(orderData);
        setPaymentStatus(orderData.paymentStatus);
        setDeliveryStatus(orderData.deliveryStatus);
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast.error('Failed to fetch order details.', {
          position: 'top-center',
        });
      }
    };

    if (orderId) {
      fetchOrderDetails();
    } else {
      console.log('No orderId provided');
    }
  }, [orderId]);

  const handleUpdateOrderStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Updating order with data:', { paymentStatus, deliveryStatus });
      console.log('Request URL:', `${BASE_URL}/order/update/${orderId}`);
      console.log('Request Headers:', { Authorization: `Bearer ${token}` });

      await axios.put(`${BASE_URL}/order/update/${orderId}`, { paymentStatus, deliveryStatus }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success('Order status updated successfully!', {
        position: 'top-center',
      });

      navigate('/getorders/asSeller');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status.', {
        position: 'top-center',
      });
    }
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Update Order Status</h2>
      <div className="mb-4">
        <span className="block text-sm font-medium text-gray-700">Payment Status:</span>
        <div className="mt-2">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="paymentStatus"
              value="Pending"
              checked={paymentStatus === 'Pending'}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="form-radio h-4 w-4 text-indigo-600"
            />
            <span className="ml-2">Pending</span>
          </label>
          <label className="inline-flex items-center ml-6">
            <input
              type="radio"
              name="paymentStatus"
              value="Success"
              checked={paymentStatus === 'Success'}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="form-radio h-4 w-4 text-indigo-600"
            />
            <span className="ml-2">Success</span>
          </label>
        </div>
      </div>
      <div className="mb-4">
        <span className="block text-sm font-medium text-gray-700">Delivery Status:</span>
        <div className="mt-2">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="deliveryStatus"
              value="Order Placed"
              checked={deliveryStatus === 'Order Placed'}
              onChange={(e) => setDeliveryStatus(e.target.value)}
              className="form-radio h-4 w-4 text-indigo-600"
            />
            <span className="ml-2">Order Placed</span>
          </label>
          <label className="inline-flex items-center ml-6">
            <input
              type="radio"
              name="deliveryStatus"
              value="Item Delivered"
              checked={deliveryStatus === 'Item Delivered'}
              onChange={(e) => setDeliveryStatus(e.target.value)}
              className="form-radio h-4 w-4 text-indigo-600"
            />
            <span className="ml-2">Item Delivered</span>
          </label>
        </div>
      </div>
      <button
        onClick={handleUpdateOrderStatus}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Update Status
      </button>
    </div>
  );
};

export default UpdateOrderStatus;
