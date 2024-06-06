// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import "react-toastify/dist/ReactToastify.css";
// import BASE_URL from '../../Api-handler/Baseurl';

// const Wishlist = () => {
//   const [wishlist, setWishlist] = useState([]);

//   useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           console.error('Authentication token not found. Please log in.');
//           return;
//         }

//         const response = await axios.get(`${BASE_URL}/getwishlist`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         console.log('response', response);
//         setWishlist(response.data.wishlist);
//       } catch (error) {
//         console.error('Error fetching wishlist:', error.message);
//         toast.error('Failed to fetch wishlist. Please try again.');
//       }
//     };

//     fetchWishlist();
//   }, []);

//   return (
   
//     <div className="container mx-auto px-4 py-8 ">
//       <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
//       {wishlist.length === 0 ? (
//         <p className="text-gray-500">Your wishlist is empty.</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
//           {wishlist.map((item) => (
//             <div key={item.productId} className="bg-white shadow-md rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 w-80 mx-auto pt-4 border border-4">
//               <img src={`${BASE_URL}/${item.imageUrl}`} alt={item.productName} className="w-full h-64 object-contain"/>
//               <div className="mx-12 p-4">
//                 <h3 className="text-xl font-semibold mb-2">{item.productName}</h3>
//                 <p className="text-gray-700 mb-4">price:${item.price}</p>
//                 <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300">Remove</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Wishlist;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from '../../Api-handler/Baseurl';
import Newnavbar from '../Newnavbar';


const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [favorites, setFavorites] = useState({});
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
      starElements.push(<span key="half" className="text-yellow-400"></span>);
    }
  
    for (let i = 0; i < emptyStars; i++) {
      starElements.push(<span key={i + filledStars} className="text-gray-400">☆</span>);
    }
  
    return starElements;
  };
  

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Authentication token not found. Please log in.');
          return;
        }

        const response = await axios.get(`${BASE_URL}/getwishlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const wishlistItems = response.data.wishlist;

        // Fetch reviews for each product to get average ratings
        const fetchReviewsPromises = wishlistItems.map(item =>
          axios.get(`${BASE_URL}/products/${item.productId}/getreviews`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        );
        const reviewsResponses = await Promise.all(fetchReviewsPromises);

        const wishlistWithRatings = wishlistItems.map((item, index) => {
          const reviews = reviewsResponses[index].data.reviews;
          const totalStars = reviews.reduce((total, review) => total + review.rating, 0);
          const averageRating = reviews.length > 0 ? totalStars / reviews.length : 0;

          return {
            ...item,
            averageRating,
          };
        });

        setWishlist(wishlistWithRatings);

        // Set initial favorites
        const initialFavorites = {};
        wishlistWithRatings.forEach((item) => {
          initialFavorites[item.productId] = true;
        });
        setFavorites(initialFavorites);

      } catch (error) {
        console.error('Error fetching wishlist:', error.message);
        toast.error('Failed to fetch wishlist. Please try again.');
      }
    };

    fetchWishlist();
  }, []);

  const handleFavoriteClick = async (productId) => {
    try {
      const token = localStorage.getItem("token");
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
        setWishlist(prevWishlist =>
          prevWishlist.filter(item => item.productId !== productId)
        );
        toast.success('Removed from wishlist.');
      } else {
        console.error("Failed to update wishlist.");
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error.message);
    }
  };

  return (
    <div className="container mx-auto ">
      <Newnavbar />
      <h2 className="text-2xl font-semibold mb-6">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p className="text-gray-600 text-lg">Your wishlist is empty.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <li
              key={item.productId}
              className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out overflow-hidden p-4"
            >
              <div className="relative">
                <button
                  className={`absolute top-2 right-2 text-gray-500 hover:text-red-500 focus:outline-none ${
                    favorites[item.productId] ? "text-red-500" : "text-gray-500"
                  }`}
                  onClick={() => handleFavoriteClick(item.productId)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill={favorites[item.productId] ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke={favorites[item.productId] ? "none" : "currentColor"}
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
                <a href={`/viewproductdetailsbuyer/${item.productId}`}>
                  <div className="flex justify-center p-4 sm:h-56 md:h-72 lg:h-80 h-72">
                    <img
                      src={`${BASE_URL}/${item.imageUrl}`}
                      alt={item.productName}
                      className="rounded-lg"
                      style={{ maxWidth: "100%" }} // Allow width to adjust responsively
                    />
                  </div>
                </a>
              </div>
              <div className="p-4">
                <a href={`/viewproductdetailsbuyer/${item.productId}`}>
                  <h4 className="text-lg font-semibold ">
                    {item.productName}
                  </h4>
                </a>
                <div className="mt-2 ">
                  <span className="text-xl font-semibold">
                    ${item.price}
                  </span>
                  <span className="text-gray-500 line-through ml-2">
                    $899.00
                  </span>
                </div>
                <div className="mt-2 ">
                  {item.averageRating ? (
                    <span className="text-yellow-400">
                      {renderStarRating(item.averageRating)}
                    </span>
                  ) : (
                    <span className="text-yellow-400">No ratings</span>
                  )}
                </div>
                <div className="mt-4 flex ">
                  <a
                    href={`/viewproductdetailsbuyer/${item.productId}`}
                    className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-lg"
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
  );
};

export default Wishlist;
