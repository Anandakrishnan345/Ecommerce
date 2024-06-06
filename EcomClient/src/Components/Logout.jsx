// Logout.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove access token from local storage
    localStorage.removeItem('token');

    // Navigate user to the login page

    navigate('/login');
    toast.success('Logout Successful', {
        position: 'top-center',
      });
    // Swal.fire({
    //     icon: 'success',
    //     title: 'Logout Successful',
    //     text: 'Redirecting...'
    // })

  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;