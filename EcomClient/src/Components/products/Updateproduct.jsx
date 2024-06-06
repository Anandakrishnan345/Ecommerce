

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import BASE_URL from '../../Api-handler/Baseurl';
// import { useParams } from 'react-router-dom';

// const UpdateProduct = () => {
//   const { productId } = useParams();
//   const [formData, setFormData] = useState({
//     productName: '',
//     price: '',
//     category: '',
//     contactEmail: '',
//     image: null // Will hold the updated image file
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProductDetails = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           throw new Error('Authentication token not found. Please log in.');
//         }

//         const headers = {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         };
//         const response = await axios.get(`${BASE_URL}/getProductById/${productId}`, { headers });
//         const productData = response.data.product;

//         // Set initial form data with existing product details
//         setFormData({
//           productName: productData.productName,
//           price: productData.price.toString(), // Ensure price is a string for input
//           category: productData.category,
//           contactEmail: productData.contactEmail,
//           image: productData.image // Set the existing image path
//         });

//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching product details:', error);
//         setError('Failed to fetch product details');
//         setLoading(false);
//       }
//     };

//     fetchProductDetails();
//   }, [productId]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setFormData({ ...formData, image: file });
    
//   };

//   const handleUpdateProduct = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('Authentication token not found. Please log in.');
//       }

//       const headers = {
//         Authorization: `Bearer ${token}`
//       };

//       const formDataToSend = new FormData();
//       formDataToSend.append('productName', formData.productName);
//       formDataToSend.append('price', formData.price);
//       formDataToSend.append('category', formData.category);
//       formDataToSend.append('contactEmail', formData.contactEmail);
//       if (formData.image) {
//         formDataToSend.append('image', formData.image);
//       }
      

//       const response = await axios.put(`${BASE_URL}/updateproduct/asSeller/${productId}`, formDataToSend, { headers });
//       console.log('formDataToSend',formDataToSend)
//       console.log('Product updated successfully:', response.data);
//       // Optionally handle success message or redirect

//     } catch (error) {
//       console.error('Error updating product:', error);
//       // Handle error
//     }
//   };

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (error) {
//     return <p>Error: {error}</p>;
//   }


//   return (
//     <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
//       <h2 className="text-2xl font-semibold mb-4 text-gray-800">Update Product</h2>
//       <form onSubmit={handleUpdateProduct} className="space-y-4">
//         <div>
//           <label htmlFor="productName" className="block text-sm font-medium text-gray-600">Product Name:</label>
//           <input
//             type="text"
//             id="productName"
//             name="productName"
//             value={formData.productName}
//             onChange={handleInputChange}
//             className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div>
//           <label htmlFor="price" className="block text-sm font-medium text-gray-600">Price:</label>
//           <input
//             type="text"
//             id="price"
//             name="price"
//             value={formData.price}
//             onChange={handleInputChange}
//             className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div>
//           <label htmlFor="category" className="block text-sm font-medium text-gray-600">Category:</label>
//           <input
//             type="text"
//             id="category"
//             name="category"
//             value={formData.category}
//             onChange={handleInputChange}
//             className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div>
//           <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-600">Contact Email:</label>
//           <input
//             type="text"
//             id="contactEmail"
//             name="contactEmail"
//             value={formData.contactEmail}
//             onChange={handleInputChange}
//             className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div>
//           <label htmlFor="image" className="block text-sm font-medium text-gray-600">Update Image:</label>
//           <input
//             type="file"
//             id="image"
//             name="image"
//             onChange={handleImageChange}
//             className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           Update Product
//         </button>
//       </form>
//     </div>
//   );
// };

// export default UpdateProduct;
  

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../Api-handler/Baseurl';
import { useParams } from 'react-router-dom';

const UpdateProduct = () => {
  const { productId } = useParams();
  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    category: '',
    contactEmail: '',
    image: null // Will hold the updated image file
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found. Please log in.');
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        };
        const response = await axios.get(`${BASE_URL}/getProductById/${productId}`, { headers });
        const productData = response.data.product;

        // Set initial form data with existing product details
        setFormData({
          productName: productData.productName,
          price: productData.price.toString(), // Ensure price is a string for input
          category: productData.category,
          contactEmail: productData.contactEmail,
          image: productData.image // Set the existing image path
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError('Failed to fetch product details');
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in.');
      }

      const headers = {
        Authorization: `Bearer ${token}`
      };

      const formDataToSend = new FormData();
      formDataToSend.append('productName', formData.productName);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('contactEmail', formData.contactEmail);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await axios.put(`${BASE_URL}/updateproduct/asSeller/${productId}`, formDataToSend, { headers });
      console.log('Product updated successfully:', response.data);
      // Optionally handle success message or redirect

    } catch (error) {
      console.error('Error updating product:', error);
      // Handle error
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Update Product</h2>
      <form onSubmit={handleUpdateProduct} className="space-y-4">
        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-gray-600">Product Name:</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
            className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-600">Price:</label>
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-600">Category:</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-600">Contact Email:</label>
          <input
            type="text"
            id="contactEmail"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleInputChange}
            className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
         {/* Display existing image if available */}
         {formData.image && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Existing Image:</label>
            <img src={`${BASE_URL}/${formData.image}`} alt="Existing Product" className="w-full h-auto rounded-md border border-gray-300" />
          </div>
        )}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-600">Update Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
       
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
