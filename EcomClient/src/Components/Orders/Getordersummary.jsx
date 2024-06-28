
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import "react-toastify/dist/ReactToastify.css";
// import BASE_URL from '../../Api-handler/Baseurl';

// function Ordersummary() {
//   const [paymentMethod, setPaymentMethod] = useState('cod');
//   const [cartDetails, setCartDetails] = useState(null);

//   const fetchCartDetails = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         console.error('Authentication token not found. Please log in.');
//         return;
//       }

//       const response = await axios.get(`${BASE_URL}/getcart`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setCartDetails(response.data);
//     } catch (error) {
//       console.error('Error fetching cart details:', error.message);
//       toast.error('Failed to fetch cart details. Please try again.');
//     }
//   };

//   useEffect(() => {
//     fetchCartDetails();
//   }, []);

//   const handlePaymentChange = (event) => {
//     setPaymentMethod(event.target.value);
//   };

//   const handleOrderPlacement = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         console.error('Authentication token not found. Please log in.');
//         return;
//       }

//       const orderItems = cartDetails.cartItems.map((item) => ({
//         productId: item.product._id,
//         quantity: item.quantity,
//         totalPrice: item.product.price * item.quantity,
//       }));

//       const response = await axios.post(
//         `${BASE_URL}/addorders`,
//         { orderItems, paymentMethod },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       console.log('Order creation response:', response.data);
//       toast.success('Order placed successfully!');

//       // Clear the cart after successful order placement
//       setCartDetails(null);
//     } catch (error) {
//       console.error('Error placing order:', error.message);
//       toast.error('Failed to place order. Please try again.');
//     }
//   };

//   const handleRemoveItem = async (cartItemId) => {
//     try {
//       console.log(`Attempting to remove item with id: ${cartItemId}`);
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.error("Authentication token not found. Please log in.");
//         return;
//       }

//       const response = await axios.delete(`${BASE_URL}/cart/removeProduct/${cartItemId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
      
//       console.log('Item removal response:', response.data);
//       if (response.status === 200) {
//         toast.success("Item removed from cart successfully.");
//         fetchCartDetails(); // Refresh cart items after removing item
//       } else {
//         console.error('Unexpected response status:', response.status);
//         toast.error('Failed to remove item from cart. Please try again.');
//       }
//     } catch (error) {
//       console.error("Error removing item from cart:", error.message);
//       toast.error("Failed to remove item from cart. Please try again.");
//     }
//   };

//   if (!cartDetails) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className="App">
//       <header className="bg-indigo-500 p-4 text-white text-center">
//         <h1>MERN STORE</h1>
//       </header>
//       <div className="container mx-auto p-4 bg-white shadow-md mt-4">
//         <section className="mb-4 p-4 border-b border-gray-300">
//           <h2 className="text-lg font-semibold">LOGIN</h2>
//           <p>{cartDetails.cartItems[0].userdata.name} {cartDetails.cartItems[0].userdata.phonenumber}</p>
//           <button className="mt-2 text-blue-600">Change</button>
//         </section>

//         <section className="mb-4 p-4 border-b border-gray-300">
//           <h2 className="text-lg font-semibold">DELIVERY ADDRESS</h2>
//           <p>{cartDetails.cartItems[0].userdata.Address}</p>
//           <button className="mt-2 text-blue-600">Change</button>
//         </section>

//         <section className="mb-4 p-4 border-b border-gray-300">
//           <h2 className="text-lg font-semibold">ORDER SUMMARY</h2>
//           {cartDetails.cartItems.map((item, index) => (
//             <div key={`${item.product._id}-${index}`} className="flex items-center mb-4">
//               <img
//                 src={`${BASE_URL}/${item.product.image}`}
//                 alt={item.product.productName}
//                 className="w-24 h-24 mr-4"
//               />
//               <div className="flex-grow">
//                 <p>{item.product.productName}</p>
//                 <p className="text-green-600">${item.product.price}</p>
//                 <div className="flex items-center mt-2">
//                   <span className="mx-2">{item.quantity}</span>
//                 </div>
//               </div>
//               <button onClick={() => handleRemoveItem(item.product._id)} className="text-red-600">Remove</button>
//             </div>
//           ))}
//         </section>

//         <section className="mb-4 p-4 border-b border-gray-300">
//           <h2 className="text-lg font-semibold">MODE OF PAYMENT</h2>
//           <div className="flex flex-col">
//             <label className="mb-2">
//               <input
//                 type="radio"
//                 name="payment"
//                 value="cod"
//                 checked={paymentMethod === 'cod'}
//                 onChange={handlePaymentChange}
//                 className="mr-2"
//               />
//               Cash on Delivery (COD)
//             </label>
//             <label className="mb-2">
//               <input
//                 type="radio"
//                 name="payment"
//                 value="online"
//                 checked={paymentMethod === 'online'}
//                 onChange={handlePaymentChange}
//                 className="mr-2"
//                 disabled
//               />
//               Pay Online
//             </label>
//           </div>
//         </section>

//         <section className="mb-4 p-4">
//           <h2 className="text-lg font-semibold">PRICE DETAILS</h2>
//           <div className="flex justify-between my-2">
//             <p>Price ({cartDetails.cartItems.length} item{cartDetails.cartItems.length > 1 ? 's' : ''})</p>
//             <span>${cartDetails.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)}</span>
//           </div>
//           <div className="flex justify-between my-2">
//             <p>Delivery Charges</p>
//             <span className="text-green-600">FREE</span>
//           </div>
//           <div className="flex justify-between my-2">
//             <p>Total Payable</p>
//             <span>${cartDetails.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)}</span>
//           </div>
//         </section>
//       </div>
//       <footer className="text-center mt-4">
//         <button onClick={handleOrderPlacement} className="bg-gray-800 text-white px-6 py-2 text-lg mb-4 rounded-lg shadow-lg shadow-indigo-500/50">CONTINUE</button>
//       </footer>
//     </div>
//   );
// }

// export default Ordersummary;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from '../../Api-handler/Baseurl';
import {  useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';


function Ordersummary() {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [cartDetails, setCartDetails] = useState(null);
  const navigate = useNavigate();

  const fetchCartDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Authentication token not found. Please log in.');
        return;
      }

      const response = await axios.get(`${BASE_URL}/getcart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
console.log('respose',response)
      setCartDetails(response.data);
    } catch (error) {
      console.error('Error fetching cart details:', error.message);
      toast.error('Failed to fetch cart details. Please try again.');
    }
  };

  useEffect(() => {
    fetchCartDetails();
  }, []);

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };


  const handleOrderPlacement = async () => {
   
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Authentication token not found. Please log in.');
        return;
      }
  
      const orderItems = cartDetails.cartItems.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
        totalPrice: item.product.price * item.quantity,
      }));
  
      const response = await axios.post(
        `${BASE_URL}/addorders`,
        { orderItems, paymentMethod },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log('Order creation response:', response.data);
      toast.success('Order placed successfully!');
  
      // Clear the cart after successful order placement
      setCartDetails(null);
  
      // Get the userdata from the first order item
      const userdata = cartDetails.cartItems[0].userdata;
  
      // Navigate to buyer profile page
      
      navigate(`/buyer/${userdata._id}`);
  
      // Get the productId from the first order item
      const productId = orderItems[0].productId;
  
      // Make API request to delete cart items
      await axios.delete(`${BASE_URL}/cart/removeProduct/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log('Cart items deleted successfully.');
    } catch (error) {

      console.error('Error placing order:', error.response);
      console.error('Err:', error.response.data.data);
      // toast.error('Failed to place order. Please try again.');
      toast.error(error.response.data.data.error);
    }
  };

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
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        }
      );
  
      toast.success("Quantity updated successfully.");
      fetchCartDetails(); // Refresh cart items after updating quantity
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
      console.log('deleteresponse', response);
      toast.success("Item removed from cart successfully.");
  
      fetchCartDetails(); // Refresh cart items after removing item
  
      // Check if the cart will become empty after removing the item
      if (cartDetails.cartItems.length === 1) {
        // Navigate to `/buyer/${userdata._id}`
        const { userdata } = cartDetails.cartItems[0];
        if (userdata) {
          navigate(`/buyer/${userdata._id}`);
        } else {
          console.error("User data not found.");
        }
      }
    } catch (error) {
      console.error("Error removing item from cart:", error.message);
      toast.error("Failed to remove item from cart. Please try again.");
    }
  };
  
  if (!cartDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div className="App">
      <header className="bg-indigo-500 p-4 text-white text-center">
        <h1>MERN STORE</h1>
      </header>
      <div className="container mx-auto p-4 bg-white shadow-md mt-4">
        <section className="mb-4 p-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold">LOGIN</h2>
          <p>{cartDetails.cartItems[0].userdata.name} {cartDetails.cartItems[0].userdata.phonenumber}</p>
         <Link to={`/profile/${cartDetails.cartItems[0].userdata._id}`}> <button className="mt-2 text-blue-600">Change</button></Link>
        </section>

        <section className="mb-4 p-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold">DELIVERY ADDRESS</h2>
          <p>{cartDetails.cartItems[0].userdata.Address}</p>
        <Link to={`/profile/${cartDetails.cartItems[0].userdata._id}`}>  <button className="mt-2 text-blue-600">Change</button></Link>
        </section>

        <section className="mb-4 p-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold">ORDER SUMMARY</h2>
          {cartDetails.cartItems.map((item, index) => (
            <div key={`${item.product._id}-${index}`} className="flex items-center mb-4">
             <Link to={`/viewproductdetailsbuyer/${item.product._id}`}> <img
                src={`${BASE_URL}/${item.product.image}`}
                alt={item.product.productName}
                className="w-24 h-24 mr-4"
              />
              </Link>
              <div className="flex-grow">
                <p>{item.product.productName}</p>
                <p className="text-green-600">${item.product.price}</p>
                <div className="flex items-center mt-2">
                <button
  onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
  className="px-2 py-1 bg-gray-300 rounded-lg"
  disabled={item.quantity <= 1}
>
  -
</button>
<span className="mx-2">{item.quantity}</span>
<button
  onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
  className="px-2 py-1 bg-gray-300 rounded-lg"
>
  +
</button>

                </div>
              </div>
              <button onClick={() => handleRemoveItem(item.product._id)} className="text-red-600">Remove</button>
            </div>
          ))}
        </section>

        <section className="mb-4 p-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold">MODE OF PAYMENT</h2>
          <div className="flex flex-col">
            <label className="mb-2">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={handlePaymentChange}
                className="mr-2"
              />
              Cash on Delivery (COD)
            </label>
            <label className="mb-2">
              <input
                type="radio"
                name="payment"
                value="online"
                checked={paymentMethod === 'online'}
                onChange={handlePaymentChange}
                className="mr-2"
                disabled
              />
              Pay Online
            </label>
          </div>
        </section>

        <section className="mb-4 p-4">
          <h2 className="text-lg font-semibold">PRICE DETAILS</h2>
          <div className="flex justify-between my-2">
            <p>Price ({cartDetails.cartItems.length} item{cartDetails.cartItems.length > 1 ? 's' : ''})</p>
            <span>${cartDetails.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)}</span>
          </div>
          <div className="flex justify-between my-2">
            <p>Delivery Charges</p>
            <span className="text-green-600">FREE</span>
          </div>
          <div className="flex justify-between my-2">
            <p>Total Payable</p>
            <span>${cartDetails.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)}</span>
          </div>
        </section>
      </div>
      <footer className="text-center mt-4">
        <button onClick={handleOrderPlacement} className="bg-gray-800 text-white px-6 py-2 text-lg mb-4 rounded-lg shadow-lg shadow-indigo-500/50">CONTINUE</button>
      </footer>
    </div>
  );
}

export default Ordersummary;
