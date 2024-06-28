import React, { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../Api-handler/Baseurl';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
const Addproduct = () => {
    const { id } = useParams();
    console.log('id', id)
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        productName: '',
        price: '',
        category: '',
        sellerName: '',
        contactEmail: '',
        image: null,
        stock: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, image: file });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { productName, price, category, sellerName, contactEmail, image, stock } = formData;

        const formDataToSend = new FormData();
        formDataToSend.append('productName', productName);
        formDataToSend.append('price', price);
        formDataToSend.append('category', category);
        formDataToSend.append('sellerName', sellerName);
        formDataToSend.append('contactEmail', contactEmail);
        formDataToSend.append('image', image);
        formDataToSend.append('stock', stock); 

        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        console.log("token", token)

        if (!token) {
            console.error('Authentication token not found. Please log in.');
            // Handle not having a token, e.g., redirect to login page
            return;
        }

        try {
            const response = await axios.post(`${BASE_URL}/addproduct`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}` // Include your token here
                }
            });


            console.log('Product added successfully:', response.data);
            // alert('Product added successfully!');

            toast.success('Product added successfully!', {
                position: 'top-center',
                onClose: () => {
                    navigate(`/seller/${id}`);

                }
            });
            setFormData({
                productName: '',
                price: '',
                category: '',
                sellerName: '',
                contactEmail: '',
                image: null
            });
        } catch (error) {
            console.error('Error adding product:', error.message);


            alert('Failed to add product. Please try again.');
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-center">Add Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Product Name:</label>
                    <input
                        type="text"
                        id="productName"
                        name="productName"
                        value={formData.productName}
                        onChange={handleInputChange}
                        required
                        className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price:</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        step="0.01"
                        required
                        className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category:</label>
                    <input
                        type="text"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock:</label>
                    <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                        className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <div>
                    <label htmlFor="sellerName" className="block text-sm font-medium text-gray-700">Seller Name:</label>
                    <input
                        type="text"
                        id="sellerName"
                        name="sellerName"
                        value={formData.sellerName}
                        onChange={handleInputChange}
                        required
                        className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">Contact Email:</label>
                    <input
                        type="email"
                        id="contactEmail"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        required
                        className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image:</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                        className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Add Product
                </button>
            </form>
        </div>

    );
};

export default Addproduct;
