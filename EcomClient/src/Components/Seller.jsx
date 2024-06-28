

// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import axios from 'axios';
// import BASE_URL from '../Api-handler/Baseurl';
// import Logout from './Logout';
// import { MenuIcon, XIcon } from '@heroicons/react/outline'; // Import menu and close icons from Heroicons



// const Seller = () => {
//   const { id } = useParams();
  
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showActions, setShowActions] = useState(false); // Start with actions menu hidden
  
//   console.log('id',id)

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(`${BASE_URL}/viewuser/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         setUser(response.data.data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Failed to fetch user:', error);
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [id]);

//   const toggleActions = () => {
//     setShowActions((prev) => !prev);
//   };

//   if (loading) {
//     return <div className="flex justify-center items-center h-screen text-gray-600">Loading...</div>;
//   }

//   if (!user) {
//     return <div className="flex justify-center items-center h-screen text-red-500">Failed to load user data.</div>;
//   }

//   return (
//     <>
//     <div className="flex flex-col h-screen">
//       <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
//         <div>
//           <Logout />
//         </div>
//         <div className="text-xl font-bold">User Info</div>
//         <div>
//           {/* Conditional Rendering of Menu or Close Icon */}
//           <button className="text-white focus:outline-none" onClick={toggleActions}>
//             {showActions ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
//           </button>
//         </div>
//       </nav>
//       <div className="flex-1 p-4 overflow-y-auto">
//         <div className="text-lg font-semibold">Welcome, {user.name}</div>
//         <div className="text-sm">Email: {user.email}</div>
//         <div className="text-sm">Role: {user.role}</div>

//       </div>
//       {/* Slide-in Navbar for Actions */}
//       <div className={`fixed top-0 right-0 h-screen bg-gray-800 text-white p-4 transform transition-transform duration-300 ${showActions ? 'translate-x-0' : 'translate-x-full'}`}>
//         <div className="flex flex-col">
//         <button className="text-white focus:outline-none px-auto flex justify-end" onClick={toggleActions}>
//             {showActions ? <XIcon className="h-6 w-6 " /> : <MenuIcon className="h-6 w-6" />}
//           </button>
//           <div className="flex flex-col mb-4 p-5">Welcome: {user.name} 
//           <div className="">Account type: {user.role}</div>
//            </div>
         
//           <Link to={`/Update/${user._id}`} className="button mb-4 p-5">Update User</Link>
//           <Link to={'changepassword'} className="button mb-4 p-5">Change Password</Link>        
//           <Link to={'/myorders'} className="button mb-4 p-5">Orders</Link>
//           <Link to={`/addproduct/${user._id}`} className="button mb-4 p-5">Add products</Link>
//           <Link to={`/viewproducts/bySeller/${user._id}`} className="button mb-4 p-5">List products</Link>
//         </div>
//       </div>
//     </div>
//     </>
//   );
// };

// export default Seller;
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../Api-handler/Baseurl';
import Logout from './Logout';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import Newnavbar from './Newnavbar';
import GetproductasBuyer from './products/GetproductasBuyer';

const Seller = () => {
  const { id } = useParams(); // Get the id from the URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showActions, setShowActions] = useState(false);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/viewuser/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/viewproducts/bySeller/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data && response.data.product) {
          const products = response.data.product;
          const categorizedProducts = {};

          // Group products by category
          products.forEach((product) => {
            const { category } = product;
            if (!categorizedProducts[category]) {
              categorizedProducts[category] = [];
            }
            categorizedProducts[category].push(product);
          });

          setProductsByCategory(categorizedProducts);
        } else {
          setError('No products found.');
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setError('Failed to fetch products. Please try again.');
      }
    };

    fetchProducts();
  }, [id]);

  const toggleActions = () => {
    setShowActions((prev) => !prev);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Loading...</div>;
  }

  if (!user) {
    return <div className="flex justify-center items-center h-screen text-red-500">Failed to load user data.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen  bg-indigo-200">
    {/* Fixed Background */}
    <div className=" " />
 

<div className="flex flex-col min-h-screen bg-indigo-200">
      <Newnavbar  />
      <div className="p-4">
        <GetproductasBuyer  />
      </div>
    </div>

  </div>
  );
};

export default Seller;




