import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import BASE_URL from "../../Api-handler/Baseurl";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Getproduct = ({ searchTerm }) => {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/getproducts`, {
          params: { search: searchTerm },
        });

        if (response.data && response.data.products) {
          const products = response.data.products;

          // Fetch reviews for each product
          const reviewsResponses = await Promise.all(
            products.map(product =>
              axios.get(`${BASE_URL}/products/${product._id}/getreviews`, {
                headers: { Authorization: `Bearer ${token}` },
              })
            )
          );

          // Calculate average rating for each product
          const productsWithRatings = products.map((product, index) => {
            const reviews = reviewsResponses[index].data.reviews;
            const totalStars = reviews.reduce((total, review) => total + review.rating, 0);
            const averageRating = reviews.length > 0 ? totalStars / reviews.length : 0;

            return { ...product, averageRating };
          });

          // Categorize products by category
          const categorizedProducts = {};
          productsWithRatings.forEach((product) => {
            const { category } = product;
            if (!categorizedProducts[category]) {
              categorizedProducts[category] = [];
            }
            categorizedProducts[category].push(product);
          });

          setProductsByCategory(categorizedProducts);
        } else {
          setError("No products found.");
        }
      } catch (error) {
        console.error("Failed to fetch products:", error.message);
        setError("Failed to fetch products. Please try again.");
      }
      setLoading(false);
    };

    const fetchWishlist = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/getwishlist`, {
          headers: { Authorization: `Bearer ${token}` },
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
  }, [searchTerm, token]);

  const handleFavoriteClick = async (productId) => {
    if (!token) {
      toast.error("Please login to continue.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/wishlist`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
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
    const handleProductLink = (productId) => {
    if (token) {
      navigate(`/viewproductdetailsbuyer/${productId}`);
    } else {
      toast.error("Please login to continue.");
      navigate("/login");
    }
  };

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
        <p className="text-gray-600 text-lg">No products found.</p>
      ) : (
        <div>
          {Object.entries(productsByCategory).map(([category, products]) => (
            <div key={category} className="mb-8">
              <h3 className="text-2xl font-semibold mb-6 uppercase">{category}</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </button>
<div
onClick={() => handleProductLink(product._id)}
className="cursor-pointer"
>
<div className="flex justify-center p-4 sm:h-56 md:h-72 lg:h-80">
  <img
    src={`${BASE_URL}/${product.image}`}
    alt={product.productName}
    className="rounded-lg"
    style={{ maxWidth: "100%" }}
  />
</div>
</div>
                    </div>
                    <div className="p-4">
                      <Link to={`/viewproductdetailsbuyer/${product._id}`}>
                        <h4 className="text-lg font-semibold ">{product.productName}</h4>
                      </Link>
                      <div className="mt-2 ">
                        <span className="text-xl font-semibold">${product.price}</span>
                        <span className="text-gray-500 line-through ml-2">$899.00</span>
                      </div>
                      <div className="mt-2 ">
                        {product.averageRating ? (
                          <span className="text-yellow-400">{renderStarRating(product.averageRating)}</span>
                        ) : (
                          <span className="text-yellow-400">No ratings</span>
                        )}
                      </div>
                     <div className="mt-4 flex justify-center">
<button
onClick={() => handleProductLink(product._id)}
className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-lg"
>
View Product {`->`}
</button>
</div>
                    </div>
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


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import BASE_URL from "../../Api-handler/Baseurl";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Getproduct = () => {
//   const [productsByCategory, setProductsByCategory] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [favorites, setFavorites] = useState({});
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/getproducts`);
//         if (response.data && response.data.products) {
//           const products = response.data.products;

//           // Group products by category
//           const categorizedProducts = {};
//           products.forEach((product) => {
//             const { category } = product;
//             if (!categorizedProducts[category]) {
//               categorizedProducts[category] = [];
//             }
//             categorizedProducts[category].push(product);
//           });

//           setProductsByCategory(categorizedProducts);
//           setLoading(false);
//         } else {
//           setError("No products found.");
//           setLoading(false);
//         }
//       } catch (error) {
//         console.error("Failed to fetch products:", error.message);
//         setError("Failed to fetch products. Please try again.");
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleProductLink = (productId) => {
//     if (token) {
//       navigate(`/viewproductdetailsbuyer/${productId}`);
//     } else {
//       toast.error("Please login to continue.");
//       navigate("/login");
//     }
//   };

//   const handleFavoriteClick = (productId) => {
//     if (token) {
//       setFavorites((prevFavorites) => ({
//         ...prevFavorites,
//         [productId]: !prevFavorites[productId],
//       }));
//     } else {
//       toast.error("Please login to continue.");
//       navigate("/login");
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
//     <div className="container mx-auto py-8">
//       {Object.keys(productsByCategory).length === 0 ? (
//         <p className="text-gray-600 text-lg shadow-xl">No products found.</p>
//       ) : (
//         <div>
//           {Object.entries(productsByCategory).map(([category, products]) => (
//             <div key={category} className="mb-8">
//               <h3 className="text-2xl font-semibold mb-6 uppercase">
//                 {category}
//               </h3>
//               <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {products.map((product) => (
//                   <li
//                     key={product._id}
//                     className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out overflow-hidden p-4"
//                   >
//                     <div className="relative">
//                       <button
//                         className={`absolute top-2 right-2 text-gray-500 hover:text-red-500 focus:outline-none ${
//                           favorites[product._id]
//                             ? "text-red-500"
//                             : "text-gray-500"
//                         }`}
//                         onClick={() => handleFavoriteClick(product._id)}
//                       >
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-6 w-6"
//                           fill={favorites[product._id] ? "currentColor" : "none"}
//                           viewBox="0 0 24 24"
//                           stroke={
//                             favorites[product._id] ? "none" : "currentColor"
//                           }
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M5 13l4 4L19 7"
//                           />
//                           <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
//                         </svg>
//                       </button>
//                       <div
//                         onClick={() => handleProductLink(product._id)}
//                         className="cursor-pointer"
//                       >
//                         <div className="flex justify-center p-4 sm:h-56 md:h-72 lg:h-80 h-40">
//                           <img
//                             src={`${BASE_URL}/${product.image}`}
//                             alt={product.productName}
//                             className="rounded-lg"
//                             style={{ maxWidth: "100%" }}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                     <div className="p-4">
//                       <h4 className="text-lg font-semibold text-center">
//                         {product.productName}
//                       </h4>
//                       <div className="mt-2 text-center">
//                         <span className="text-xl font-semibold">
//                           ${product.price}
//                         </span>
//                         <span className="text-gray-500 line-through ml-2">
//                           $899.00
//                         </span>
//                       </div>
//                       <div className="mt-4 flex justify-center">
//                         <button
//                           onClick={() => handleProductLink(product._id)}
//                           className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-lg"
//                         >
//                           View Product {`->`}
//                         </button>
//                       </div>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Getproduct;

