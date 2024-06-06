


import React, { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../Api-handler/Baseurl';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phonenumber: '',
    Address: '',
    country: '',
    state: '',
    role: 'buyer', // Default user type is buyer
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BASE_URL}/signup`, formData);

      toast.success('User added successfully! Password is sent to your mail.', {
        position: 'top-center',
      });

      // Reset form data after successful submission
      setFormData({
        name: '',
        email: '',
        password: '',
        phonenumber: '',
        Address: '',
        country: '',
        state: '',
        role: 'buyer', // Reset to default role
      });
      navigate('/login');

    } catch (error) {
      console.error('Error adding user:', error.response.data.message);
      toast.error( error.response.data.message, {
        position: 'top-center',
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Signup Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
           <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label> 
           <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          /> 
        </div>
        <div className="mb-4">
          <label htmlFor="phonenumber" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            id="phonenumber"
            name="phonenumber"
            value={formData.phonenumber}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="Address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <textarea
            id="Address"
            name="Address"
            value={formData.Address}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows={3}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <span className="block text-sm font-medium text-gray-700">Signup as:</span>
          <div className="mt-1">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="role"
                value="buyer"
                checked={formData.role === 'buyer'}
                onChange={handleInputChange}
                className="form-radio h-4 w-4 text-indigo-600"
              />
              <span className="ml-2">Buyer</span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input
                type="radio"
                name="role"
                value="seller"
                checked={formData.role === 'seller'}
                onChange={handleInputChange}
                className="form-radio h-4 w-4 text-indigo-600"
              />
              <span className="ml-2">Seller</span>
            </label>
          </div>
        </div>
       
        
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
