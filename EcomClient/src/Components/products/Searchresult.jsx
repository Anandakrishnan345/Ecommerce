// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';
// import BASE_URL from '../../Api-handler/Baseurl';
// import Newnavbar from '../Newnavbar';

// const SearchResults = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [favorites, setFavorites] = useState({});
//   const location = useLocation();
//   const [ratings, setRatings] = useState({});
//   // Function to convert a numerical rating to a star representation
//   const renderStarRating = (rating) => {
//     const filledStars = Math.floor(rating);
//     const decimalPart = rating - filledStars;
//     const hasHalfStar = decimalPart >= 0.5;
//     const emptyStars = 5 - filledStars - (hasHalfStar ? 1 : 0);
  
//     const starElements = [];
  
//     for (let i = 0; i < filledStars; i++) {
//       starElements.push(<span key={i} className="text-yellow-400">★</span>);
//     }
  
//     if (hasHalfStar) {
//       starElements.push(<span key="half" className="text-yellow-400"></span>);
//     }
  
//     for (let i = 0; i < emptyStars; i++) {
//       starElements.push(<span key={i + filledStars} className="text-gray-400">☆</span>);
//     }
  
//     return starElements;
//   };
  
//   useEffect(() => {
//     const searchParams = new URLSearchParams(location.search);
//     const query = searchParams.get('query');

//     const fetchProducts = async () => {
//         try {
//           const response = await axios.get(`${BASE_URL}/getproducts`, {
//             params: {
//               search: query,
//             },
//           });
//           if (response.data && response.data.products) {
//             const fetchedProducts = response.data.products;
      
//             // Fetch reviews for each product
//             const fetchReviewsPromises = fetchedProducts.map(product =>
//               axios.get(`${BASE_URL}/products/${product._id}/getreviews`)
//             );
//             const reviewsResponses = await Promise.all(fetchReviewsPromises);
      
//             const productsWithRatings = fetchedProducts.map((product, index) => {
//               const reviews = reviewsResponses[index].data.reviews;
//               const totalStars = reviews.reduce((total, review) => total + review.rating, 0);
//               const averageRating = reviews.length > 0 ? totalStars / reviews.length : 0;
      
//               return {
//                 ...product,
//                 averageRating,
//               };
//             });
      
//             setProducts(productsWithRatings);
//           } else {
//             setError('No products found.');
//           }
//         } catch (error) {
//           setError('Failed to fetch products. Please try again.');
//         } finally {
//           setLoading(false);
//         }
//       };
      
     

//     const fetchWishlist = async () => {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         console.error("Authentication token not found. Please log in.");
//         return;
//       }

//       try {
//         const response = await axios.get(`${BASE_URL}/getwishlist`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (response.data && response.data.wishlist) {
//           const wishlist = response.data.wishlist;
//           const initialFavorites = {};
//           wishlist.forEach((item) => {
//             initialFavorites[item.productId] = true;
//           });
//           setFavorites(initialFavorites);
//         }
//       } catch (error) {
//         console.error("Failed to fetch wishlist:", error.message);
//       }
//     };

//     fetchProducts();
//     fetchWishlist();
//   }, [location.search]);

//   const handleFavoriteClick = async (productId) => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       console.error("Authentication token not found. Please log in.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${BASE_URL}/wishlist`,
//         { productId },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data.success) {
//         setFavorites((prevFavorites) => ({
//           ...prevFavorites,
//           [productId]: !prevFavorites[productId],
//         }));
//       } else {
//         console.error("Failed to update wishlist.");
//       }
//     } catch (error) {
//       console.error("Failed to update wishlist:", error.message);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-gray-600 text-lg">Loading...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-red-600 text-lg">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <Newnavbar />
//       <div className="container mx-auto py-8">
//         {products.length === 0 ? (
//           <p className="text-gray-600 text-lg">No products found.</p>
//         ) : (
//           <div>
//             <h1 className="text-lg sm:text-2xl font-semibold mb-6 uppercase">Search Results</h1>
//             <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {products.map((product) => (
//                 <li
//                   key={product._id}
//                   className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out overflow-hidden p-4"
//                 >
//                   <div className="relative">
//                     <button
//                       className={`absolute top-2 right-2 text-gray-500 hover:text-red-500 focus:outline-none ${
//                         favorites[product._id] ? "text-red-500" : "text-gray-500"
//                       }`}
//                       onClick={() => handleFavoriteClick(product._id)}
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-6 w-6"
//                         fill={favorites[product._id] ? "currentColor" : "none"}
//                         viewBox="0 0 24 24"
//                         stroke={favorites[product._id] ? "none" : "currentColor"}
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M5 13l4 4L19 7"
//                         />
//                         <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
//                       </svg>
//                     </button>
//                     <a href={`/viewproductdetailsbuyer/${product._id}`}>
//                       <div className="flex justify-center p-4 sm:h-56 md:h-72 lg:h-80 ">
//                         <img
//                           src={`${BASE_URL}/${product.image}`}
//                           alt={product.productName}
//                           className="rounded-lg"
//                           style={{ maxWidth: "100%" }} // Allow width to adjust responsively
//                         />
//                       </div>
//                     </a>
//                   </div>
//                   <div className="p-4">
//                     <a href={`/viewproductdetailsbuyer/${product._id}`}>
//                       <h2 className="text-lg font-bold ">{product.productName}</h2>
//                     </a>
//                     <div className="mt-2 ">
//                       <span className="text-xl font-semibold">${product.price}</span>
//                       <span className="text-gray-500 line-through ml-2">$899.00</span>
//                     </div>
//                     {product.averageRating ? (
//   <span className="text-yellow-400">{renderStarRating(product.averageRating)}</span>
// ) : (
//   <span className="text-yellow-400">No ratings</span>
// )}

//                     <div className="mt-4 flex ">
//                       <a
//                         href={`/viewproductdetailsbuyer/${product._id}`}
//                         className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded rounded-lg"
//                       >
//                         View Product {`->`}
//                       </a>
//                     </div>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchResults;


import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../Api-handler/Baseurl';
import Newnavbar from '../Newnavbar';

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const location = useLocation();
  const [ratings, setRatings] = useState({});
  
  // Function to convert a numerical rating to a star representation
  const renderStarRating = (rating) => {
    const filledStars = Math.floor(rating);
    const decimalPart = rating - filledStars;
    const hasHalfStar = decimalPart >= 0.5;
    const emptyStars = 5 - filledStars - (hasHalfStar ? 1 : 0);
  
    const starElements = [];
  
    for (let i = 0; i < filledStars; i++) {
      starElements.push(<span key={i} className="text-yellow-400">★</span>);
    }
  
    if (hasHalfStar) {
      starElements.push(<span key="half" className="text-yellow-400">★</span>);
    }
  
    for (let i = 0; i < emptyStars; i++) {
      starElements.push(<span key={i + filledStars} className="text-gray-400">☆</span>);
    }
  
    return starElements;
  };
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query');

    const fetchProducts = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/getproducts`, {
            params: {
              search: query,
            },
          });
          if (response.data && response.data.products) {
            const fetchedProducts = response.data.products;
      
            // Fetch reviews for each product
            const fetchReviewsPromises = fetchedProducts.map(product =>
              axios.get(`${BASE_URL}/products/${product._id}/getreviews`)
            );
            const reviewsResponses = await Promise.all(fetchReviewsPromises);
      
            const productsWithRatings = fetchedProducts.map((product, index) => {
              const reviews = reviewsResponses[index].data.reviews;
              const totalStars = reviews.reduce((total, review) => total + review.rating, 0);
              const averageRating = reviews.length > 0 ? totalStars / reviews.length : 0;
      
              return {
                ...product,
                averageRating,
              };
            });
      
            setProducts(productsWithRatings);
            setFilteredProducts(productsWithRatings);
          } else {
            setError('No products found.');
          }
        } catch (error) {
          setError('Failed to fetch products. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      
     

    const fetchWishlist = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Authentication token not found. Please log in.");
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/getwishlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data && response.data.wishlist) {
          const wishlist = response.data.wishlist;
          const initialFavorites = {};
          wishlist.forEach((item) => {
            initialFavorites[item.productId] = true;
          });
          setFavorites(initialFavorites);
        }
      } catch (error) {
        console.error("Failed to fetch wishlist:", error.message);
      }
    };

    fetchProducts();
    fetchWishlist();
  }, [location.search]);

  const handleFavoriteClick = async (productId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Authentication token not found. Please log in.");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/wishlist`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setFavorites((prevFavorites) => ({
          ...prevFavorites,
          [productId]: !prevFavorites[productId],
        }));
      } else {
        console.error("Failed to update wishlist.");
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error.message);
    }
  };

  const handleFilterClick = () => {
    setFilterVisible(!filterVisible);
  };

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    applyFilter(filter);
    setFilterVisible(false);
  };

  const applyFilter = (filter) => {
    let filtered = products;

    if (filter === 'below1000') {
      filtered = products.filter(product => product.price < 1000);
    } else if (filter === 'below20000') {
      filtered = products.filter(product => product.price < 20000);
    } else if (filter === 'above50000') {
      filtered = products.filter(product => product.price > 50000);
    }

    setFilteredProducts(filtered);
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
    <div>
      <Newnavbar />
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg sm:text-2xl font-semibold uppercase">Search Results</h1>
          <div className="relative">
            <button onClick={handleFilterClick} className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-lg">
              Filter
            </button>
            {filterVisible && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                <ul>
                  <li
                    onClick={() => handleFilterSelect('below1000')}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  >
                    Below $1000
                  </li>
                  <li
                    onClick={() => handleFilterSelect('below20000')}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  >
                    Below $20000
                  </li>
                  <li
                    onClick={() => handleFilterSelect('above50000')}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  >
                    Above $50000
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        {filteredProducts.length === 0 ? (
          <p className="text-gray-600 text-lg">No products found.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <li
                key={product._id}
                className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out overflow-hidden p-4"
              >
                <div className="relative">
                  <button
                    className={`absolute top-2 right-2 text-gray-500 hover:text-red-500 focus:outline-none ${
                      favorites[product._id] ? "text-red-500" : "text-gray-500"
                    }`}
                    onClick={() => handleFavoriteClick(product._id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill={favorites[product._id] ? "currentColor" : "none"}
                      viewBox="0 0 24 24"
                      stroke={favorites[product._id] ? "none" : "currentColor"}
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
                  <a href={`/viewproductdetailsbuyer/${product._id}`}>
                    <div className="flex justify-center p-4 sm:h-56 md:h-72 lg:h-80 ">
                      <img
                        src={`${BASE_URL}/${product.image}`}
                        alt={product.productName}
                        className="rounded-lg"
                        style={{ maxWidth: "100%" }} // Allow width to adjust responsively
                      />
                    </div>
                  </a>
                </div>
                <div className="p-4">
                  <a href={`/viewproductdetailsbuyer/${product._id}`}>
                    <h2 className="text-lg font-bold ">{product.productName}</h2>
                  </a>
                  <div className="mt-2 ">
                    <span className="text-xl font-semibold">${product.price}</span>
                    <span className="text-gray-500 line-through ml-2">$899.00</span>
                  </div>
                  {product.averageRating ? (
                    <span className="text-yellow-400">{renderStarRating(product.averageRating)}</span>
                  ) : (
                    <span className="text-yellow-400">No ratings</span>
                  )}
                  <div className="mt-4 flex ">
                    <a
                      href={`/viewproductdetailsbuyer/${product._id}`}
                      className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded rounded-lg"
                    >
                      View Product {`->`}
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
