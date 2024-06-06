import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link,  useNavigate } from "react-router-dom";
import BASE_URL from "../../Api-handler/Baseurl";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Getproduct = () => {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/getproducts`);
        if (response.data && response.data.products) {
          const products = response.data.products;

          // Group products by category
          const categorizedProducts = {};
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
          setError("No products found.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error.message);
        setError("Failed to fetch products. Please try again.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const token = localStorage.getItem("token");

  const handleProductLink = (product) => {
    if (token) {
      return `/viewproductdetailsbuyer/${product._id}`;
    } else {
      // Display alert and navigate to login
      toast.error("Please login.");
      navigate("/login");
      return null; // Return null if the link is not valid
    }
  };
  const handleFavoriteClick = (productId) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [productId]: !prevFavorites[productId],
    }));
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {Object.keys(productsByCategory).length === 0 ? (
        <p className="text-gray-600 text-lg shadow-xl">No products found.</p>
      ) : (
        <div>
          {Object.entries(productsByCategory).map(([category, products]) => (
            <div key={category}>
              <h3 className="text-xl font-semibold mb-4 mt-4 p-8 uppercase">{category}</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  
                  <li key={product._id} className="bg-white rounded-lg shadow-xl shadow-indigo-500/40 p-6">
                    {token ? (
                      <Link to={handleProductLink(product)}>
                        {/* <h4 className="text-lg font-semibold mb-2">{product.productName}</h4>
                        <p className="text-gray-700 mb-4">Price: ${product.price}</p>
                        <p className="text-gray-700 mb-4">Category: {product.category}</p>
                        <div className="flex items-center mb-4">
                          <img
                            src={`${BASE_URL}/${product.image}`}
                            alt={product.productName}
                            className="rounded-lg w-md-9 h-auto object-fit"
                            style={{ maxHeight: "300px" }} // Adjust max height as needed
                          />
                        </div>
                        <div className="flex items-center">
                          <div className="ml-2">
                            <span className="text-gray-600">Seller:</span>
                            <p className="text-blue-600 font-semibold">{product.sellerName}</p>
                            <p className="text-gray-600">{product.contactEmail}</p>
                          </div>
                        </div> */}

<div className="flex justify-center p-4 sm:h-56 md:h-72 lg:h-80 h-40">
    <img
      src={`${BASE_URL}/${product.image}`}
      alt={product.productName}
      className="rounded-lg    "
      style={{ maxWidth: '100%' }} // Allow width to adjust responsively
    />
  </div>
                      </Link>
                    ) : 
                    (
                      <div onClick={() => handleProductLink(product)}>
                        <div className="relative">
                      <button
                        className={`absolute top-2 right-2 text-gray-500 hover:text-red-500 focus:outline-none ${
                          favorites[product._id]
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                        onClick={() => handleFavoriteClick(product._id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill={
                            favorites[product._id] ? "currentColor" : "none"
                          }
                          viewBox="0 0 24 24"
                          stroke={
                            favorites[product._id] ? "none" : "currentColor"
                          }
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </button>
                      <Link to={`/viewproductdetailsbuyer/${product._id}`}>
                        <div className="flex justify-center p-4 sm:h-56 md:h-72 lg:h-80 h-40">
                          <img
                            src={`${BASE_URL}/${product.image}`}
                            alt={product.productName}
                            className="rounded-lg    "
                            style={{ maxWidth: "100%" }} // Allow width to adjust responsively
                          />
                        </div>
                      </Link>
                    </div>
                    <div className="p-4">
                      <Link to={`/viewproductdetailsbuyer/${product._id}`}>
                        <h2 className="text-lg font-bold text-center">
                          {product.productName}
                        </h2>
                      </Link>
                      <div className="mt-2 text-center">
                        <span className="text-xl font-semibold">
                          ${product.price}
                        </span>
                        <span className="text-gray-500 line-through ml-2">
                          $899.00
                        </span>
                      </div>
                      <div className="mt-4 flex justify-center">
                        <Link
                          to={`/viewproductdetailsbuyer/${product._id}`}
                          className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded rounded-lg"
                        >
                          View Product{`->`}
                        </Link>
                      </div>
                    </div>
                        {/* <button className="text-red-600 underline" onClick={() => handleProductLink(product)}>
                          Please login to view details
                        </button> */}
                      </div>
                    )
                    }
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Getproduct;
