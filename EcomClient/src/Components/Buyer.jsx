


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
 
    {/* Main Content */}
    {/* <div className="flex-1  overflow-y-auto">
      {/* Navigation Bar */}
      {/* <nav className="bg-gray-800 text-white p-4 flex justify-between items-center ">
        <div>
          <Logout />
        </div>
        <div className="text-xl font-bold">MERN STORE</div>
        <div> */}
          {/* Conditional Rendering of Menu or Close Icon */}
          {/* <button className="text-white focus:outline-none" onClick={toggleActions}>
            {showActions ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </nav> */}

      {/* Slide-in Navbar for Actions */}
      {/* <div
        className={`fixed top-0 right-0 h-screen bg-gray-800 text-white p-4 transform transition-transform duration-300 ${
          showActions ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: "300px", zIndex: 20 }}
      >
        <div className="flex flex-col"> */}
          {/* Close Icon */}
          {/* <button className="text-white focus:outline-none px-auto flex justify-end" onClick={toggleActions}>
            {showActions ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button> */}
          {/* User Info */}
          {/* <div className="flex flex-col mb-4 p-5">
            Welcome: {user.name}
            <div className="">Account type: {user.role}</div>
          </div> */}
          {/* Navigation Links */}
          {/* <Link to={`/Update/${user._id}`} className="button mb-4 p-5">
            Update User
          </Link>
          <Link to={"changepassword"} className="button mb-4 p-5">
            Change Password
          </Link>
          <Link to={"/getcart"} className="button mb-4 p-5">
            Cart
          </Link>
          <Link to={"/myorders"} className="button mb-4 p-5">
            My Orders
          </Link>
        </div>
      </div> */}

      {/* Main Content Area */}
     
    {/* </div> */}
    
    {/* <div>
      <Newnavbar/>
    </div>
    <div className="p-4"> */}
        {/* Display Products */}
        {/* <GetproductasBuyer />
      </div> */}

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
