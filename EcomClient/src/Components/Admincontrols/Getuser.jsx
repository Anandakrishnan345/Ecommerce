

import React, { useState, useEffect } from 'react';
import { EyeIcon, TrashIcon } from '@heroicons/react/solid';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from '../../Api-handler/Baseurl';
import { useNavigate } from 'react-router-dom';

const UserTable = () => {
  // State to manage users, pagination, and filters
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [role, setRole] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Fetch users from the API with pagination and filters
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/getuser`, {
          params: { page, limit, role, search }
        });
        setUsers(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        console.log('res',response);
        // Display toast message if no users are found
        if (response.data.data.length === 0) {
          toast.info('No users found');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [page, limit, role, search]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Handle role filter change
  const handleRoleChange = (event) => {
    setRole(event.target.value);
    setPage(1); // Reset to first page on filter change
  };

  // Handle search change
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1); // Reset to first page on search
  };
  
  const handleViewUser = (id) => {

    navigate(`/profile/${id}`);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <div className="w-full max-w-6xl mb-4 flex flex-col sm:flex-row sm:justify-between">
        <div className="mb-2 sm:mb-0">
          <label htmlFor="roleFilter" className="block text-sm font-medium text-gray-700">
            Filter by Role
          </label>
          <select
            id="roleFilter"
            value={role}
            onChange={handleRoleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">All</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        </div>
        <div className="w-full sm:w-auto">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search
          </label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={handleSearchChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            placeholder="Search by name, email, or phone"
          />
        </div>
      </div>

      <div className="overflow-x-auto w-full max-w-6xl">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left border-b">First Name</th>
              <th className="px-4 py-2 text-left border-b">Location</th>
              <th className="px-4 py-2 text-left border-b">Address</th>
              <th className="px-4 py-2 text-left border-b">Email</th>
              <th className="px-4 py-2 text-left border-b">Contact</th>
              <th className="px-4 py-2 text-left border-b">View</th>
              <th className="px-4 py-2 text-left border-b">Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{user.name}</td>
                <td className="px-4 py-2 border-b">{user.country}, {user.state}</td>
                <td className="px-4 py-2 border-b">{user.Address}</td>
                <td className="px-4 py-2 border-b">{user.email}</td>
                <td className="px-4 py-2 border-b">{user.phonenumber}</td>
                <td className="px-4 py-2 border-b">
                <button className="text-blue-500 hover:text-blue-700" onClick={() => handleViewUser(user._id)}>
                    <EyeIcon className="h-5 w-5" />
                  </button>
                </td>
                <td className="px-4 py-2 border-b">
                  <button className="text-red-500 hover:text-red-700">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between w-full max-w-6xl">
        <button
          onClick={() => handlePageChange(page - 1)}
          className="p-2 rounded border bg-white text-gray-700 hover:bg-gray-200"
        >
          &lt;
        </button>
        <div className="flex space-x-1">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`p-2 rounded border ${
                index + 1 === page ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
              } hover:bg-gray-200`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() => handlePageChange(page + 1)}
          className="p-2 rounded border bg-white text-gray-700 hover:bg-gray-200"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default UserTable;




