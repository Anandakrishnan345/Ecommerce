import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Transition } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import Getproduct from './products/Getproduct';
import Newnavbar from './Newnavbar';

const NavigationMenu = () => {
  // const [isOpen, setIsOpen] = useState(false);

  // const toggleMenu = () => {
  //   setIsOpen(!isOpen);
  // };

  // const closeMenu = () => {
  //   setIsOpen(false);
  // };

  return (
    <div className="  bg-indigo-200   lg:container-2xl">
      {/* Sidebar */}
      {/* <div
        className={` rounded-lg fixed top-0 left-0 h-full w-60  overflow-y-auto transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: "300px", zIndex: 20 }}
      >
        <div className="rounded-lg text-white p-6 pt-8  shadow-lg border border-3-red-400 fixed top-0 left-0 h-full w-60 bg-gray-800 overflow-y-auto transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full">
          <ul>
            <li>
            <button
        className=" top-4 left-4 p-2 rounded-md bg-gray-700 text-white hover:bg-gray-600"
        onClick={toggleMenu}
      >
        {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
      </button>
            </li>
            <li>
              <Link to="/home" className="block py-2 hover:text-gray-300" onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/login" className="block py-2 hover:text-gray-300" onClick={closeMenu}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/signup" className="block py-2 hover:text-gray-300" onClick={closeMenu}>
                Signup
              </Link>
            </li>
            <li>
              <Link to="/order" className="block py-2 hover:text-gray-300" onClick={closeMenu}>
                orders
              </Link>
            </li>
          </ul>
        </div>
      </div> */}

      {/* Toggle Button */}
      {/* <div><nav>
      <button
        className=" top-4 left-4 p-2 rounded-md bg-gray-700 text-white hover:bg-gray-600"
        onClick={toggleMenu}
      >
        {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
      </button>
        </nav>
        
        </div> */}
      
      

      {/* Overlay (for closing sidebar on outside click) */}
      {/* <Transition
        show={isOpen}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-50"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-50"
        leaveTo="opacity-0"
        className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 ${
          isOpen ? 'block' : 'hidden'
        }`}
        onClick={toggleMenu}
      ></Transition> */}
      <Newnavbar/>
      <div className='p-4'>
        <Getproduct />
      </div>
    </div>

    
  );
};

export default NavigationMenu;
