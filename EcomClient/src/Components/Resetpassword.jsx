import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams
import BASE_URL from '../Api-handler/Baseurl';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
    const { resetToken } = useParams(); // Extract the token from the URL
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
console.log('token',resetToken)
    const handleSubmit = async (e) => {
        e.preventDefault();
console.log('newpassword',newPassword)
        try {
            const response = await axios.post(`${BASE_URL}/resetpassword`, {
                resetToken: resetToken, // Use the extracted token from the URL
                newPassword
            });
            console.log('response',response)

            setMessage(response.data.message);
            toast.success(response.data.message);
        } catch (error) {
            console.error('Error resetting password:', error.response);
            setMessage('Failed to reset password. Please try again.');
            toast.error('Failed to reset password. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset Password</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="newPassword" className="sr-only">New Password</label>
                            <input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Reset Password
                        </button>
                    </div>
                </form>
                {message && <p className="mt-2 text-center text-sm text-gray-600">{message}</p>}
            </div>
        </div>
    );
};

export default ResetPassword;
