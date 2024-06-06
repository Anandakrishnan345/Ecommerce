import React, { useState, useEffect, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, ShoppingCartIcon, UserCircleIcon, HeartIcon, MenuIcon, XIcon, SearchIcon } from '@heroicons/react/solid';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';

import BASE_URL from '../Api-handler/Baseurl';
import Logout from './Logout';

const Newnavbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const Navigate = useNavigate(); // for navigating programmatically
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.user_id; // Assuming 'user_id' is the key in the token

        const response = await axios.get(`${BASE_URL}/viewuser/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (event) => {
    if ((event.key === 'Enter' || event.type === 'click') && searchTerm.trim() !== '') {
      Navigate(`/search?query=${searchTerm}`);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Loading...</div>;
  }

  return (
    <nav className="bg-white shadow-md py-2 lg:container-2xl">
      <div className="container-2xl mx-auto flex justify-between items-center px-4 md:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <span className="font-bold text-blue-500">MERN</span>
          <span className="text-yellow-500">STORE</span>
        </div>
        {/* Search Bar for Large Devices */}
        <div className="flex-grow max-w-lg mx-4 hidden lg:flex relative">
          <input
            type="text"
            placeholder="Search for Products, Brands and More"
            value={searchTerm}
            onChange={handleSearchInputChange}
            onKeyDown={handleSearch}
            className="w-full pl-4 pr-10 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 bg-indigo-100 transition-all duration-300 ease-in-out"
          />
          <SearchIcon 
            className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" 
            onClick={handleSearch}
          />
        </div>
        {/* Right Side Icons */}
        <div className="flex items-center space-x-4">
          {token && user ? (
            // User-specific Navbar
            <Menu as="div" className="relative hidden lg:flex">
              <Menu.Button className="flex items-center">
                <UserCircleIcon className="h-6 w-6 mr-1" />
                <span>{user.name}</span>
                <ChevronDownIcon className="h-4 w-4 ml-1" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                        to={`/profile/${user._id}`}
                          className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
                        >
                          Your Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/order"
                          className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
                        >
                          Orders
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <div
                          className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
                        >
                          <Logout />
                        </div>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            // Default Navbar for Landing Page
            <>
              <Link to="/login" className="text-gray-600 hover:bg-gray-200 hover:text-gray-800 block px-3 py-2 rounded-md text-base font-medium">Login</Link>
            </>
          )}
          {/* Cart */}
          <Link to="/getcart">
            <div className="flex items-center relative">
              <ShoppingCartIcon className="h-6 w-6" />
              <span className="ml-2">Cart</span>
            </div>
          </Link>
          {/* Become a Seller */}
          <Link to="/getwishlist">
            <div className="hidden md:flex items-center">
              <HeartIcon className="h-6 w-6 mr-1" />
              <span>Wishlist</span>
            </div>
          </Link> 
          {/* Menu Icon for Mobile */}
          <MenuIcon className="h-6 w-6 cursor-pointer" onClick={() => setSidebarOpen(true)} />
        </div>
      </div>
      {/* Search Bar for Small Devices */}
      <div className="lg:hidden flex-grow max-w-lg m-4 sm:mx-auto relative">
        <input
          type="text"
          placeholder="Search for Products, Brands and More"
          value={searchTerm}
          onChange={handleSearchInputChange}
          onKeyDown={handleSearch}
          className="w-full pl-4 pr-10 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 bg-indigo-100 transition-all duration-300 ease-in-out"
        />
        <SearchIcon 
          className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" 
          onClick={handleSearch}
        />
      </div>

      {/* Sidebar */}
      <Transition
        show={sidebarOpen}
        as={Fragment}
        enter="transition ease-out duration-300"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transition ease-in duration-300"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        <div className="fixed inset-0 flex z-40">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 pt-2 pr-2">
              <button
                className="flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:bg-gray-600"
                onClick={() => setSidebarOpen(false)}
              >
                <XIcon className="h-6 w-6 text-indigo-400" aria-hidden="true" />
              </button>
            </div>
            <div className="pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                {/* Logo in Sidebar */}
                <span className="font-bold text-blue-500">MERN</span>
                <span className="text-yellow-500">STORE</span>
              </div>
              <div className="mt-5 px-2 space-y-1">
                {/* Sidebar Menu Items */}
                <Link to={`/buyer/${user._id}`} className="text-gray-600 hover:bg-gray-200 hover:text-gray-800 block px-3 py-2 rounded-md text-base font-medium">Home</Link>
                {token && user ? (
                  <>
                    <Link to="/profile" className="text-gray-600 hover:bg-gray-200 hover:text-gray-800 block px-3 py-2 rounded-md text-base font-medium">Your Profile</Link>
                    <Link to="/order" className="text-gray-600 hover:bg-gray-200 hover:text-gray-800 block px-3 py-2 rounded-md text-base font-medium ">Orders</Link>
                    <div className="text-gray-600 hover:bg-gray-200 hover:text-gray-800 block px-3 py-2 rounded-md text-base font-medium lg:hidden"><Logout /></div>
                    <Link to="/getcart" className="text-gray-600 hover:bg-gray-200 hover:text-gray-800 block px-3 py-2 rounded-md text-base font-medium ">Cart</Link>
                    <Link to="/getwishlist" className="text-gray-600 hover:bg-gray-200 hover:text-gray-800 block px-3 py-2 rounded-md text-base font-medium ">Wishlist</Link>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-gray-600 hover:bg-gray-200 hover:text-gray-800 block px-3 py-2 rounded-md text-base font-medium">Login</Link>
                    <Link to="/register" className="text-gray-600 hover:bg-gray-200 hover:text-gray-800 block px-3 py-2 rounded-md text-base font-medium">Register</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </nav>
  );
};

export default Newnavbar;




// import React, { useState, useEffect, Fragment } from 'react';
// import { Menu, Transition } from '@headlessui/react';
// import { ChevronDownIcon, ShoppingCartIcon, UserCircleIcon, HeartIcon, MenuIcon, XIcon } from '@heroicons/react/solid';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';
// import { Link, useNavigate } from 'react-router-dom';

// import BASE_URL from '../Api-handler/Baseurl';
// import Logout from './Logout';

// const Newnavbar = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const Navigate = useNavigate(); // for navigating programmatically
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchUser = async () => {
//       if (!token) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const decodedToken = jwtDecode(token);
//         const userId = decodedToken.user_id; // Assuming 'user_id' is the key in the token

//         const response = await axios.get(`${BASE_URL}/viewuser/${userId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         setUser(response.data.data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Failed to fetch user:', error);
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [token]);

//   const handleSearchInputChange = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   const handleSearch = (event) => {
//     if ((event.key === 'Enter' || event.type === 'click') && searchTerm.trim() !== '') {
//       Navigate(`/search?query=${searchTerm}`);
//     }
//   };

//   if (loading) {
//     return <div className="flex justify-center items-center h-screen text-gray-600">Loading...</div>;
//   }

//   return (
//     <nav className="bg-white shadow-md py-2 lg:container-2xl">
//       <div className="container-2xl mx-auto flex justify-between items-center px-4 md:px-8">
//         {/* Logo */}
//         <div className="flex items-center">
//           <span className="font-bold text-blue-500">MERN</span>
//           <span className="text-yellow-500">STORE</span>
//         </div>
//         {/* Search Bar */}
//         <div className="flex-grow max-w-lg mx-4 hidden lg:flex">
//           <input
//             type="text"
//             placeholder="Search for Products, Brands and More"
//             value={searchTerm}
//             onChange={handleSearchInputChange}
//             onKeyDown={handleSearch}
//             className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 bg-indigo-100"
//           />
//           <button
//             onClick={handleSearch}
//             className="px-4 py-2 bg-blue-500 text-white rounded-md ml-2"
//           >
//             Search
//           </button>
//         </div>
//         {/* Right Side Icons */}
//         <div className="flex items-center space-x-4">
//           {token && user ? (
//             // User-specific Navbar
//             <Menu as="div" className="relative hidden lg:flex">
//               <Menu.Button className="flex items-center">
//                 <UserCircleIcon className="h-6 w-6 mr-1" />
//                 <span>{user.name}</span>
//                 <ChevronDownIcon className="h-4 w-4 ml-1" />
//               </Menu.Button>
//               <Transition
//                 as={Fragment}
//                 enter="transition ease-out duration-100"
//                 enterFrom="transform opacity-0 scale-95"
//                 enterTo="transform opacity-100 scale-100"
//                 leave="transition ease-in duration-75"
//                 leaveFrom="transform opacity-100 scale-100"
//                 leaveTo="transform opacity-0 scale-95"
//               >
//                 <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//                   <div className="py-1">
//                     <Menu.Item>
//                       {({ active }) => (
//                         <Link
//                           to="/profile"
//                           className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
//                         >
//                           Your Profile
//                         </Link>
//                       )}
//                     </Menu.Item>
//                     <Menu.Item>
//                       {({ active }) => (
//                         <Link
//                           to="/settings"
//                           className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
//                         >
//                           Settings
//                         </Link>
//                       )}
//                     </Menu.Item>
//                     <Menu.Item>
//                       {({ active }) => (
//                         <div
//                           className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
//                         >
//                           <Logout />
//                         </div>
//                       )}
//                     </Menu.Item>
//                   </div>
//                 </Menu.Items>
//               </Transition>
//             </Menu>
//           ) : (
//             // Default Navbar for Landing Page
//             <>
//               <Link to="/login" className="text-gray-600 hover:bg-gray-200 hover:text-gray-800 block px-3 py-2 rounded-md text-base font-medium">Login</Link>
//             </>
//           )}
//           {/* Cart */}
//           <Link to="/getcart">
//             <div className="flex items-center relative">
//               <ShoppingCartIcon className="h-6 w-6" />
//               <span className="ml-2">Cart</span>
//             </div>
//           </Link>
//           {/* Become a Seller */}
//           <Link to="/getwishlist">
//             <div className="hidden md:flex items-center">
//               <HeartIcon className="h-6 w-6 mr-1" />
//               <span>Wishlist</span>
//             </div>
//           </Link> 
//           {/* Menu Icon for Mobile */}
//           <MenuIcon className="h-6 w-6 cursor-pointer" onClick={() => setSidebarOpen(true)} />
//         </div>
//       </div>
//       {/* Search Bar for Small Devices */}
//       <div className="lg:hidden flex-grow max-w-lg m-4 sm:mx-auto">
//         <input
//           type="text"
//           placeholder="Search for Products, Brands and More"
//           value={searchTerm}
//           onChange={handleSearchInputChange}
//           onKeyDown={handleSearch}
//           className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 bg-indigo-100"
//         />
//         <button
//           onClick={handleSearch}
//           className="px-4 py-2 bg-blue-500 text-white rounded-md mt-2"
//         >
//           Search
//         </button>
//       </div>

//       {/* Sidebar */}
//       {/* <Transition
//         show={sidebarOpen}
//         as={Fragment}
//         enter="transition ease-out duration-300"
//         enterFrom="-translate-x-full"
//         enterTo="translate-x-0"
//         leave */}
//         <Transition
//               show={sidebarOpen}
//               as={Fragment}
//               enter="transition ease-out duration-300"
//               enterFrom="-translate-x-full"
//               enterTo="translate-x-0"
//               leave="transition ease-in duration-300"
//               leaveFrom="translate-x-0"
//               leaveTo="-translate-x-full"
//             >
//               <div className="fixed inset-0 flex z-40">
//                 <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setSidebarOpen(false)}></div>
//                 <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
//                   <div className="absolute top-0 right-0 pt-2 pr-2">
//                     <button
//                       className="flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:bg-gray-600"
//                       onClick={() => setSidebarOpen(false)}
//                     >
//                       <XIcon className="h-6 w-6 text-indigo-400" aria-hidden="true" />
//                     </button>
//                   </div>
//                   <div className="pt-5 pb-4 overflow-y-auto">
//                     <div className="flex-shrink-0 flex items-center px-4">
//                       {/* Logo in Sidebar */}
//                       <span className="font-bold text-blue-500">MERN</span>
//                       <span className="text-yellow-500">STORE</span>
//                     </div>
//                     <div className="mt-5 px-2 space-y-1">
//                       {/* Sidebar Menu Items */}
//                       <Link to={`/buyer/${user._id}`} className="text-gray-600 hover:bg-gray-200 hover:text-gray-800 block px-3 py-2 rounded-md text-base font-medium">Home</Link>
//                       {token && user ? (
//                         <>
//                           <Link to="/profile" className="text-gray-600 hover:bg-gray-200 hover:text-gray-800 block px-3 py-2 rounded-md text-base font-medium lg:hidden">Your Profile</Link>
//                           <Link to="/order" className="text-gray-600 hover:bg-gray-200 hover:text-gray-800 block px-3 py-2 rounded-md text-base font-medium lg:hidden">Orders</Link>
//                           <Link to="/logout" className="text-gray-600 hover:bg-gray-200 hover:text-gray-800 block px-3 py-2 rounded-md text-base font-medium lg:hidden">Sign out</Link>
//                           <Link to="/getcart" className="text-gray-600 hover:bg-gray-200 hover:text-gray-800 block px-3 py-2 rounded-md text-base font-medium lg:hidden">Cart</Link>
//                           <Link to="/signup" className="text-gray-600 hover:bg-gray-200 hover:text-gray-800 block px-3 py-2 rounded-md text-base font-medium lg:hidden">Become a Seller</Link>
//                         </>
//                       ) : (
//                         <>
//                           <Link to="/login" className="text-gray-600 hover:bg-gray-200 hover:text-gray-800 block px-3 py-2 rounded-md text-base font-medium">Login</Link>
//                           <Link to="/register" className="text-gray-600 hover:bg-gray-200 hover:text-gray-800 block px-3 py-2 rounded-md text-base font-medium">Register</Link>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </Transition>
//             </nav>
//           );
//         };
        
//         export default Newnavbar;