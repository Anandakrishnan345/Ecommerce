// import { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import axios from 'axios';
// import BASE_URL from '../Api-handler/Baseurl';
// import Logout from './Logout';

// function User() {
//   const [user, setUser] = useState(null);
//   const { id } = useParams();
//   const [showActions, setShowActions] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(`${BASE_URL}/viewuser/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
          
//         });
//         console.log('response',response.data.data)
//         console.log('user is:',user)
//         setUser(response.data.data);
//       } catch (error) {
//         console.error('Failed to fetch user:', error);
//       }
//     };

//     fetchUser();
//   }, [id]);

//   const toggleActions = () => {
//     setShowActions((prev) => !prev);
//   };

//   if (!user) {
//     return <div className="flex justify-center items-center h-screen text-gray-600">Loading...</div>;
//   }

//   return (
//     <div className="flex flex-col h-screen">
//       <nav className="bg-gray-800 text-white p-4">
//         <div className="flex justify-between items-center">
//           <div>
//             <Logout />
//           </div>
//           <div className="text-xl font-bold">User Info</div>
//           <div></div>
//         </div>
//         <div className="mt-4">
//           <div className="text-lg font-semibold">Welcome, {user.name}</div>
//           <div className="text-sm">Email: {user.email}</div>
//           <div className="text-sm">Role: {user.role}</div>
//         </div>
//       </nav>
//       <div
//         className={`fixed top-0 right-0 bg-gray-800 text-white p-4 transform transition-transform duration-300 ${
//           showActions ? 'translate-y-0' : 'translate-y-full'
//         }`}
//       >
//         <div className="flex flex-col">
//           <Link
//             to={`/Update/${user._id}`}
//             className={`button mb-4 ${showActions ? 'block' : 'hidden'}`}
//           >
//             Update User
//           </Link>
//           <Link
//             to={'changepassword'}
//             className={`button ${showActions ? 'block' : 'hidden'}`}
//           >
//             Change Password
//           </Link>
//         </div>
//       </div>
//       <button
//         className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-full shadow-md"
//         onClick={toggleActions}
//       >
//         {showActions ? 'Hide Actions' : 'Show Actions'}
//       </button>
//     </div>
//   );
// }

// export default User;



import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../Api-handler/Baseurl';
import Logout from './Logout';
import Getproduct from './products/Getproduct';

function User() {
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const [showActions, setShowActions] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/viewuser/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('user',user)
        setUser(response.data.data); // Update user state with fetched data
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, [id]);

  const toggleActions = () => {
    setShowActions((prev) => !prev);
  };

  if (!user) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <nav className="bg-gray-800 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <Logout />
          </div>
          <div className="text-xl font-bold">User Info</div>
          <div></div>
        </div>
        <div className="mt-4">
          <div className="text-lg font-semibold">Welcome, {user.name}</div>
          <div className="text-sm">Email: {user.email}</div>
          <div className="text-sm">Role: {user.role}</div>
        </div>
      </nav>
      <div
        className={`fixed top-0 right-0 bg-gray-800 text-white p-4 transform transition-transform duration-300 ${
          showActions ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex flex-col">
          <Link
            to={`/Update/${user._id}`}
            className={`button mb-4 ${showActions ? 'block' : 'hidden'}`}
          >
            Update User
          </Link>
          <Link
            to={'changepassword'}
            className={`button ${showActions ? 'block' : 'hidden'}`}
          >
            Change Password
          </Link>
        </div>
      </div>
      <button
        className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-full shadow-md"
        onClick={toggleActions}
      >
        {showActions ? 'Hide Actions' : 'Show Actions'}
      </button>

      
    </div>
  );
}

export default User;
