// viewproduct as seller



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../Api-handler/Baseurl';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Newnavbar from '../Newnavbar';

const Viewproduct = () => {
  const { addedByUserId } = useParams(); // Get `addedByUserId` from URL params
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('Authentication token not found. Please log in.');
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Fetch products by `addedByUserId`
        const response = await axios.get(`${BASE_URL}/viewproducts/bySeller/${addedByUserId}`, {
          headers: headers,
        });

        // Check if products are retrieved successfully
        if (response.data && response.data.product) {
          const products = response.data.product;
          const categorizedProducts = {};

          // Group products by category
          products.forEach((product) => {
            const { category } = product;
            if (!categorizedProducts[category]) {
              categorizedProducts[category] = [];
            }
            categorizedProducts[category].push(product);
          });

          setProductsByCategory(categorizedProducts);
          setLoading(false);
        } else {
          setError('No products found.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error.message);
        setError('Failed to fetch products. Please try again.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [addedByUserId]);

  const handleViewDetails = (productId) => {
    // Navigate to product details page based on the productId
    // Replace `YOUR_PRODUCT_DETAILS_ROUTE` with the actual route for product details
    // Example: history.push(`/products/${productId}`);
  };

  const handleUpdateProduct = (productId) => {
    // Navigate to product update page based on the productId
    console.log('productid',productId);
    navigate(`/updateproduct/asSeller/${productId}`);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Authentication token not found. Please log in.');
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Perform delete request to delete the product
      await axios.delete(`${BASE_URL}/deleteproduct/${productId}`, {
        headers: headers,
      });

      // Update products list after deletion (optional)
      // You can fetch products again or update state to remove the deleted product

      // Display success message or handle further actions
    } catch (error) {
      console.error('Failed to delete product:', error.message);
      // Handle error and display appropriate message to the user
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (Object.keys(productsByCategory).length === 0) {
    return <p>No products found.</p>;
  }


  return (
    <>
    <Newnavbar />
    <div className="p-8 space-y-8">
      {Object.entries(productsByCategory).map(([category, products]) => (
        <div key={category}>
          <h2 className="text-xl font-semibold mb-4">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product._id} className="bg-white shadow-md rounded overflow-hidden">
                <Link to={`/viewproductdetailsbuyer/${product._id}`} >
                <div className="h-48  flex items-center justify-center">
                  <img
                    src={`${BASE_URL}/${product.image}`}
                    alt={product.productName}
                    className="h-full w-auto max-w-full"
                  />
                  
                </div>
                </Link>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.productName}</h3>
                  <p className="text-sm text-gray-600 mb-4"><strong>Price:</strong> ${product.price}</p>
                  <div className="flex justify-between">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none"
                      onClick={() => handleUpdateProduct(product._id)}
                    >
                      Update
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded focus:outline-none"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    </>
  );
  
};

export default Viewproduct;
