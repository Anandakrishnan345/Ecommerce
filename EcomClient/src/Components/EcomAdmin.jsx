import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode
import Logout from './Logout';
import BASE_URL from '../Api-handler/Baseurl';

function Admin() {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Decode token to access user ID
      const decodedToken = jwtDecode(token);
      if (decodedToken && decodedToken.user_id) {
        setUserId(decodedToken.user_id);
      }
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Fetch user details using user ID
        const response = await axios.get(`${BASE_URL}/viewuser/${userId}`);
        setUser(response.data); // Assuming response contains user details
        console.log('response',response.data)
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-3xl font-bold mt-8">Admin Dashboard</h2>

      {user ? (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg text-gray-800 font-semibold">Welcome, {user.data.name}</p>
          <p className="text-md text-gray-600">Email: {user.data.email}</p>
        </div>
      ) : (
        <p className="mt-8 text-gray-600">Loading user details...</p>
      )}

      <div className="mt-8 flex flex-col gap-4">
        <Link to="/adduser" className="btn-primary">
          Add User
        </Link>
        <Link to="/getuser" className="btn-primary">
          Get User
        </Link>
        <Link to="/getproduct" className="btn-primary">
          Get Product
        </Link>
        <Logout />
      </div>
    </div>
  );
}

export default Admin;
