


import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../Api-handler/Baseurl';
import Logout from './Logout';
// import { MenuIcon, XIcon } from '@heroicons/react/outline'; 
import Getproduct from './products/Getproduct';
import GetproductasBuyer from './products/GetproductasBuyer';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronDownIcon, ShoppingCartIcon, UserCircleIcon, OfficeBuildingIcon, MenuIcon, XIcon } from '@heroicons/react/solid';
import Newnavbar from './Newnavbar';


function Buyer() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showActions, setShowActions] = useState(false); // Start with actions menu hidden

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
}

export default Buyer;
