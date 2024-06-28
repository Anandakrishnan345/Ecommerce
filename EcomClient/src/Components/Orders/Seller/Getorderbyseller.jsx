import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BASE_URL from '../../../Api-handler/Baseurl';

const OrdersBySellerId = () => {
  const [orders, setOrders] = useState([]);
 

  useEffect(() => {
    // Fetch orders by seller ID when the component mounts
    const fetchOrdersBySellerId = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from local storage
        const response = await axios.get(`${BASE_URL}/seller-orders`, {
          headers: {
            Authorization: `Bearer ${token}` // Set authorization header
          }
        });
        console.log('res',response)
        setOrders(response.data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrdersBySellerId();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Orders by Seller</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-md">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 text-sm font-semibold ${order.deliveryStatus === 'Item Delivered' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'} rounded-md`}>{order.deliveryStatus}</span>
              </div>
              <img src={`${BASE_URL}/${order.product.image}`} alt={order.product.productName} className="w-full h-48 object-contain mb-4" />
              <p className="text-gray-800 text-lg font-semibold">{order.product.productName}</p>
              <p className="text-gray-600 mb-2">Quantity: {order.quantity}</p>
              <p className="text-gray-600 mb-2">Price: ${order.product.price}</p>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <Link to={`/status/${order._id}`} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md">Update Status</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersBySellerId;
