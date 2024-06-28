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
        const userData = response.data.data;
        setUser(userData);
        setRole(userData.role);
        setEditedUser(userData); // Initialize editedUser with fetched data
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUser();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setEditedUser({ ...editedUser, role: newRole });
  };

  const handleSave = async () => {
    try {
      const updatedData = { ...editedUser, role }; // Include updated role
      const response = await axios.put(`${BASE_URL}/update/${id}`, updatedData);
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
                  <input
                    type="text"
                    name="name"
                    value={editedUser.name}
                    onChange={handleInputChange}
                    className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-gray-700 font-semibold">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={editedUser.email}
                    onChange={handleInputChange}
                    className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-gray-700 font-semibold">Mobile Number</label>
                  <input
                    type="text"
                    name="phonenumber"
                    value={editedUser.phonenumber}
                    onChange={handleInputChange}
                    className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-gray-700 font-semibold">Join As</label>
                  <div className="flex mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="role"
                        value="buyer"
                        checked={role === 'buyer'}
                        onChange={() => handleRoleChange('buyer')}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-gray-700">Buyer</span>
                    </label>
                    <label className="inline-flex items-center ml-6">
                      <input
                        type="radio"
                        name="role"
                        value="seller"
                        checked={role === 'seller'}
                        onChange={() => handleRoleChange('seller')}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-gray-700">Seller</span>
                    </label>
                  </div>
                </div>
                <div className="col-span-1">
                  <label className="block text-gray-700 font-semibold">Address</label>
                  <input
                    type="text"
                    name="Address"
                    value={editedUser.Address || ''}
                    onChange={handleInputChange}
                    className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 ease-in-out">Save</button>
                <button onClick={() => setIsEditing(false)} className="ml-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 ease-in-out">Cancel</button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="col-span-1">
                  <label className="block text-gray-700 font-semibold">Name</label>
                  <input
                    type="text"
                    value={user.name}
                    disabled
                    className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm bg-gray-100"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-gray-700 font-semibold">Email Address</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm bg-gray-100"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-gray-700 font-semibold">Mobile Number</label>
                  <input
                    type="text"
                    value={user.phonenumber}
                    disabled
                    className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm bg-gray-100"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-gray-700 font-semibold">Joined As</label>
                  <input
                    type="text"
                    value={user.role}
                    disabled
                    className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm bg-gray-100"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-gray-700 font-semibold">Address</label>
                  <input
                    type="text"
                    value={user.Address || ''}
                    disabled
                    className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm bg-gray-100"
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 ease-in-out">Edit</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;


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
//         setRole(response.data.data.role); // Set role when fetching user data
//         console.log(response)
//       } catch (error) {
//         console.error("Error fetching user data", error);
//       }
//     };
    
//     fetchUser();
//   }, [id]);

//   const handleEdit = () => {
//     setIsEditing(true);
//     setEditedUser(user);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
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
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
//       <div className="w-full max-w-3xl p-8">
//         <div className="bg-white p-8 rounded-xl shadow-xl">
//           {isEditing ? (
//             <>
//               <h3 className="text-3xl font-bold text-gray-900 mb-8">Edit Personal Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <div className="col-span-1">
//                   <label className="block text-gray-700 font-semibold">Name</label>
//                   <input type="text" name="name" value={editedUser.name} onChange={handleInputChange} className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
//                 </div>
//                 <div className="col-span-1">
//                   <label className="block text-gray-700 font-semibold">Email Address</label>
//                   <input type="email" name="email" value={editedUser.email} onChange={handleInputChange} className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
//                 </div>
//                 <div className="col-span-1">
//                   <label className="block text-gray-700 font-semibold">Mobile Number</label>
//                   <input type="text" name="phonenumber" value={editedUser.phonenumber} onChange={handleInputChange} className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
//                 </div>
//                 <div className="col-span-1">
//                   <label className="block text-gray-700 font-semibold">User Role</label>
//                   <div className="flex mt-2">
//                     <label className="inline-flex items-center">
//                       <input type="radio" name="role" value="buyer" checked={role === 'buyer'} onChange={() => setRole('buyer')} className="form-radio h-4 w-4 text-blue-600" />
//                       <span className="ml-2 text-gray-700">Buyer</span>
//                     </label>
//                     <label className="inline-flex items-center ml-6">
//                       <input type="radio" name="role" value="seller" checked={role === 'seller'} onChange={() => setRole('seller')} className="form-radio h-4 w-4 text-blue-600" />
//                       <span className="ml-2 text-gray-700">Seller</span>
//                     </label>
//                   </div>
//                 </div>
//                 <div className="col-span-1">
//                   <label className="block text-gray-700 font-semibold">Address</label>
//                   <input type="text" name="address" value={editedUser.Address} onChange={handleInputChange} className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
//                 </div>
//               </div>
//               <div className="mt-8 flex justify-end">
//                 <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">Save</button>
//                 <button onClick={() => setIsEditing(false)} className="ml-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg">Cancel</button>
//               </div>
//             </>
//           ) : (
//             <>
//               <h3 className="text-3xl font-bold text-gray-900 mb-8">Personal Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <div className="col-span-1">
//                   <label className="block text-gray-700 font-semibold">Name</label>
//                   <input type="text" value={user.name} disabled className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm bg-gray-100" />
//                 </div>
//                 <div className="col-span-1">
//                   <label className="block text-gray-700 font-semibold">Email Address</label>
//                   <input type="email" value={user.email} disabled className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm bg-gray-100" />
//                 </div>
//                 <div className="col-span-1">
//                   <label className="block text-gray-700 font-semibold">Mobile Number</label>
//                   <input type="text" value={user.phonenumber} disabled className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm bg-gray-100" />
//                 </div>
//                 <div className="col-span-1">
//                   <label className="block text-gray-700 font-semibold">User Role</label>
//                   <input type="text" value={user.role} disabled className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm bg-gray-100" />
//                 </div>
//                 <div className="col-span-1">
//                   <label className="block text-gray-700 font-semibold">Address</label>
//                   <input type="text" value={user.Address} disabled className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm bg-gray-100" />
//                 </div>
//               </div>
//               <div className="mt-8 flex justify-end">
//                 <button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">Edit</button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default UserProfile;

