
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import BASE_URL from '../Api-handler/Baseurl';
// import axios from 'axios';

// function UserProfile() {
//   const { id } = useParams();
//   const [user, setUser] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedUser, setEditedUser] = useState({});
//   const [role, setRole] = useState('');

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/viewuser/${id}`);
//         setUser(response.data.data);
//         setEditedUser(response.data.data); // Set editedUser initially with user data
//         setRole(response.data.data.role); // Set role state with user's role
//       } catch (error) {
//         console.error("Error fetching user data", error);
//       }
//     };
    
//     fetchUser();
//   }, [id]);

//   const handleEdit = () => {
//     setIsEditing(true);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     // Update the editedUser state with the new value
//     setEditedUser({ ...editedUser, [name]: value });
//   };

//   const handleSave = async () => {
//     try {
//       const response = await axios.put(`${BASE_URL}/update/${id}`, editedUser);
//       setUser(response.data.data);
//       setIsEditing(false);
//     } catch (error) {
//       console.error("Error updating user data", error);
//     }
//   };

//   if (!user) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="min-h-screen flex">
//       {/* <div className="w-1/4 bg-gray-100 p-4">
//         <div className="text-center mb-6">
//           <div className="h-24 w-24 bg-gray-300 rounded-full mx-auto"></div>
//           <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
//         </div>
//         <nav>
//           <ul>
//             <li className="py-2">
//               <a href="#" className="text-blue-600">My Orders</a>
//             </li>
//             <li className="py-2">
//               <a href="#" className="text-blue-600">Account Settings</a>
//               <ul className="ml-4 mt-2">
//                 <li className="py-1">
//                   <a href="#" className="text-blue-600">Profile Information</a>
//                 </li>
//                 <li className="py-1">
//                   <a href="#" className="text-blue-600">Manage Addresses</a>
//                 </li>
//                 <li className="py-1">
//                   <a href="#" className="text-blue-600">PAN Card Information</a>
//                 </li>
//               </ul>
//             </li>
//             <li className="py-2">
//               <a href="#" className="text-blue-600">Payments</a>
//               <ul className="ml-4 mt-2">
//                 <li className="py-1">
//                   <a href="#" className="text-blue-600">Gift Cards</a>
//                 </li>
//                 <li className="py-1">
//                   <a href="#" className="text-blue-600">Saved UPI</a>
//                 </li>
//                 <li className="py-1">
//                   <a href="#" className="text-blue-600">Saved Cards</a>
//                 </li>
//               </ul>
//             </li>
//           </ul>
//         </nav>
//       </div> */}
//       <div className="w-3/4 p-6">
//         <div className="bg-white p-4 rounded-lg shadow">
//           {isEditing ? (
//             <>
//               <h3 className="text-xl font-semibold mb-4">Edit Personal Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="col-span-1">
//                   <label className="block text-gray-700">Name</label>
//                   <input type="text" name="name" value={editedUser.name} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" />
//                 </div>
//                 <div className="col-span-1">
//                   <label className="block text-gray-700">Email Address</label>
//                   <input type="email" name="email" value={editedUser.email} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" />
//                 </div>
//                 <div className="col-span-1">
//                   <label className="block text-gray-700">Mobile Number</label>
//                   <input type="text" name="phonenumber" value={editedUser.phonenumber} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" />
//                 </div>
//                 <div className="col-span-1">
//                   <label className="block text-gray-700">User Role</label>
//                   <div className="flex">
//                     <label className="inline-flex items-center">
//                       <input type="radio" name="role" value="buyer" checked={role === 'buyer'} onChange={() => setRole('buyer')} className="form-radio h-4 w-4 text-blue-500" />
//                       <span className="ml-2 text-gray-700">Buyer</span>
//                     </label>
//                     <label className="inline-flex items-center ml-4">
//                       <input type="radio" name="role" value="seller" checked={role === 'seller'} onChange={() => setRole('seller')} className="form-radio h-4 w-4 text-blue-500" />
//                       <span className="ml-2 text-gray-700">Seller</span>
//                     </label>
//                   </div>
//                 </div>
//                 <div className="col-span-1">
//                   <label className="block text-gray-700">Address</label>
//                   <input type="text" name="address" value={editedUser.address} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" />
//                 </div>
//               </div>
//               <div className="mt-4">
//                 <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save</button>
//                 <button onClick={() => setIsEditing(false)} className="ml-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
//               </div>
//             </>
//           ) : (
//             <>
//               <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="col-span-1">
//                   <label className="block text-gray-700">Name</label>
//                   <input type="text" value={user.name} disabled className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" />
                 
//                 </div>
//                 <div className="col-span-1">
//                   <label className="block text-gray-700">Email Address</label>
//                   <input type="email" value={user.email} disabled className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" />
//                 </div>
//                 <div className="col-span-1">
//                   <label className="block text-gray-700">Mobile Number</label>
//                   <input type="text" value={user.phonenumber} disabled className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" />
//                 </div>
//                 <div className="col-span-1">
//                   <label className="block text-gray-700">User Role</label>
//                   <input type="text" value={user.role} disabled className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" />
//                 </div>
//                 <div className="col-span-1">
//                   <label className="block text-gray-700">Address</label>
//                   <input type="text" value={user.address} disabled className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" />
//                 </div>
//                 {/* Add more fields for displaying */}
//               </div>
//               <div className="mt-4">
//                 <button onClick={handleEdit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Edit</button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default UserProfile;
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BASE_URL from '../Api-handler/Baseurl';
import axios from 'axios';

function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/viewuser/${id}`);
        setUser(response.data.data);
        setRole(response.data.data.role); // Set role when fetching user data
        console.log(response)
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };
    
    fetchUser();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedUser(user);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`${BASE_URL}/update/${id}`, editedUser);
      setUser(response.data.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-3xl p-8">
        <div className="bg-white p-8 rounded-xl shadow-xl">
          {isEditing ? (
            <>
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Edit Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="col-span-1">
                  <label className="block text-gray-700 font-semibold">Name</label>
                  <input type="text" name="name" value={editedUser.name} onChange={handleInputChange} className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="col-span-1">
                  <label className="block text-gray-700 font-semibold">Email Address</label>
                  <input type="email" name="email" value={editedUser.email} onChange={handleInputChange} className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="col-span-1">
                  <label className="block text-gray-700 font-semibold">Mobile Number</label>
                  <input type="text" name="phonenumber" value={editedUser.phonenumber} onChange={handleInputChange} className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="col-span-1">
                  <label className="block text-gray-700 font-semibold">User Role</label>
                  <div className="flex mt-2">
                    <label className="inline-flex items-center">
                      <input type="radio" name="role" value="buyer" checked={role === 'buyer'} onChange={() => setRole('buyer')} className="form-radio h-4 w-4 text-blue-600" />
                      <span className="ml-2 text-gray-700">Buyer</span>
                    </label>
                    <label className="inline-flex items-center ml-6">
                      <input type="radio" name="role" value="seller" checked={role === 'seller'} onChange={() => setRole('seller')} className="form-radio h-4 w-4 text-blue-600" />
                      <span className="ml-2 text-gray-700">Seller</span>
                    </label>
                  </div>
                </div>
                <div className="col-span-1">
                  <label className="block text-gray-700 font-semibold">Address</label>
                  <input type="text" name="address" value={editedUser.Address} onChange={handleInputChange} className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">Save</button>
                <button onClick={() => setIsEditing(false)} className="ml-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg">Cancel</button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="col-span-1">
                  <label className="block text-gray-700 font-semibold">Name</label>
                  <input type="text" value={user.name} disabled className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm bg-gray-100" />
                </div>
                <div className="col-span-1">
                  <label className="block text-gray-700 font-semibold">Email Address</label>
                  <input type="email" value={user.email} disabled className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm bg-gray-100" />
                </div>
                <div className="col-span-1">
                  <label className="block text-gray-700 font-semibold">Mobile Number</label>
                  <input type="text" value={user.phonenumber} disabled className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm bg-gray-100" />
                </div>
                <div className="col-span-1">
                  <label className="block text-gray-700 font-semibold">User Role</label>
                  <input type="text" value={user.role} disabled className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm bg-gray-100" />
                </div>
                <div className="col-span-1">
                  <label className="block text-gray-700 font-semibold">Address</label>
                  <input type="text" value={user.Address} disabled className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm bg-gray-100" />
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">Edit</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;

