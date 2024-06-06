import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../../../Api-handler/Baseurl";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import Newnavbar from "../../Newnavbar";

// StarRating component to display and manage star rating selection
const StarRating = ({ value, onClick }) => {
  const starIcons = Array.from({ length: 5 }, (_, index) => index + 1); // Array representing star values

  return (
    <div className="flex">
      {starIcons.map((starValue) => (
        <span
          key={starValue}
          className={`cursor-pointer text-2xl ${
            starValue <= value ? "text-yellow-500" : "text-gray-300"
          }`}
          onClick={() => onClick(starValue)}
        >
          &#9733; {/* Star character */}
        </span>
      ))}
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams(); // Extract the 'id' parameter from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false); // State to manage review form visibility
  const [reviewRating, setReviewRating] = useState(0); // State to hold review rating
  const [reviewComment, setReviewComment] = useState(""); // State to hold review comment
  const [reviews, setReviews] = useState([]); // State to hold reviews
  const [averageRating, setAverageRating] = useState(0);
  const [isInCart, setIsInCart] = useState(false); // State to hold if product is in cart
  const navigate = useNavigate();

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products/${id}/getreviews`);
      // Sort reviews
      const sortedReviews = response.data.reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setReviews(sortedReviews);

      // Calculate average rating
      if (sortedReviews.length > 0) {
        const totalRating = sortedReviews.reduce((acc, curr) => acc + curr.rating, 0);
        const avgRating = totalRating / sortedReviews.length;
        setAverageRating(avgRating);
      }

    } catch (error) {
      console.error("Failed to fetch reviews:", error.message);
      toast.error("Failed to fetch reviews. Please try again.");
    }
  };

  useEffect(() => {
    const fetchProductById = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Unauthorised login please");
          return;
        }

        const response = await axios.get(`${BASE_URL}/getProductById/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProduct(response.data.product);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch product:", error.message);
        setError("Failed to fetch product. Please try again.");
        setLoading(false);
      }
    };

    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Authentication token not found. Please log in.");
          return;
        }

        const response = await axios.get(`${BASE_URL}/getcart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const cartItems = response.data.cartItems;
        const productInCart = cartItems.some(item => item.product._id === id);
        setIsInCart(productInCart);
      } catch (error) {
        console.error("Failed to fetch cart items:", error.message);
      }
    };

    fetchProductById();
    fetchReviews();
    fetchCartItems();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Authentication token not found. Please log in.");
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.user_id;

      const response = await axios.post(
        `${BASE_URL}/addToCart`,
        { productId: id, userId: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      console.log("Product added to cart:", response.data.message);
      toast.success("Product added to cart successfully");
      setIsInCart(true); // Set the state to indicate the product is now in the cart
      navigate(`/getcart`);
    } catch (error) {
      console.error("Failed to add product to cart:", error.response);
      toast.error("Failed to add product to cart.");
    }
  };

  const handleBuyNow = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Authentication token not found. Please log in.");
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.user_id;

      if (!isInCart) {
        await axios.post(
          `${BASE_URL}/addToCart`,
          { productId: id, userId: userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsInCart(true); // Set the state to indicate the product is now in the cart
      }

      navigate(`/ordersummary/${id}`);
    } catch (error) {
      console.error("Failed to proceed to order summary:", error.response);
      toast.error("Failed to proceed to order summary.");
    }
  };

  const handleReport = () => {
    navigate(`/report/${id}`);
  };

  const toggleReviewForm = () => {
    setShowReviewForm(!showReviewForm); // Toggle review form visibility
  };

  const handleReviewSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Authentication token not found. Please log in.");
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/products/${id}/reviews`,
        { rating: reviewRating, comment: reviewComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Review added:", response.data.review);
      toast.success("Review added successfully");
      // Optionally, update state or perform other actions after adding review
      setReviewRating(0); // Reset review rating after submission
      setReviewComment(""); // Reset review comment after submission
      fetchReviews();
    } catch (error) {
      console.error("Failed to add review:", error.message);
      toast.error("Failed to add review. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading product...</p>;
  }

  if (error) {
    return <p className="text-red-600">Product not found.</p>;
  }

  return (
    <>
    <Newnavbar />
    <div className="container mx-auto px-4 py-8 h-screen">
      {product ? (
        <div className="flex flex-col md:flex-row md:space-x-8 bg-white rounded-lg shadow-xl shadow-indigo-500/60 p-6">
          <div className="md:w-1/3">
            <img src={`${BASE_URL}/${product.image}`} alt={product.productName} className="rounded-lg shadow-lg" />
          </div>
          <div className="md:w-2/3">
            <h2 className="text-3xl font-bold mb-4 uppercase">{product.productName}</h2>
            <div className="text-gray-600 mb-4">Category: {product.category}</div>
            <div className="text-lg font-bold text-blue-600 mb-4">Price: ${product.price}</div>
            <div className="flex">
              <div className="text-gray-800 mb-4">
                Average Rating: <StarRating value={averageRating} />
              </div>
              <p className="text-gray-800 mb-4">, {averageRating.toFixed(1)}</p>
            </div>
            <p className="text-gray-800 mb-4">{product.description}</p>

            <div className="flex flex-col space-y-4 mt-4">
              {isInCart ? (
                <button
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg shadow-lg shadow-gray-600/60 focus:outline-none cursor-not-allowed"
                  disabled
                >
                  Added to Cart
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg shadow-blue-600/60 focus:outline-none"
                >
                  Add to Cart
                </button>
              )}
              <button
                onClick={handleBuyNow}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg shadow-green-600/60 focus:outline-none"
              >
                Buy Now
              </button>
              <button
                onClick={handleReport}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-lg shadow-red-600/60 focus:outline-none"
              >
                Report
              </button>
              <button
                onClick={toggleReviewForm} // Toggle review form visibility
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg shadow-lg shadow-yellow-600/60 focus:outline-none"
              >
                Review
              </button>
              {showReviewForm && (
                <div className="flex flex-col space-y-4 mt-4">
                  <StarRating value={reviewRating} onClick={setReviewRating} />
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Write your review..."
                    rows={4}
                    className="border rounded-md p-2 mb-2"
                  />
                  <button
                    onClick={handleReviewSubmit}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg shadow-blue-600/60 focus:outline-none"
                  >
                    Submit Review
                  </button>
                </div>
              )}
              <div className="uppercase text-center p-8 sm:text-lg text-lg shadow-md shadow-blue-600/60 mt-24">
                Reviews
              </div>
              {reviews.map((review) => (
                <div key={review._id} className="border p-4 rounded-md shadow-md ">
                  <div className=" ">
                    <div>Reviewer: {review.reviewerName}</div>
                  </div>
                  <p className="font-bold">Rating: {review.rating}</p>
                  <p>{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-red-600">Product not found.</p>
      )}
    </div>
    </>
  );
};

export default ProductDetails;






// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import BASE_URL from "../../../Api-handler/Baseurl";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { jwtDecode } from "jwt-decode";

// // StarRating component to display and manage star rating selection
// const StarRating = ({ value, onClick }) => {
//   const starIcons = Array.from({ length: 5 }, (_, index) => index + 1); // Array representing star values

//   return (
//     <div className="flex">
//       {starIcons.map((starValue) => (
//         <span
//           key={starValue}
//           className={`cursor-pointer text-2xl ${
//             starValue <= value ? "text-yellow-500" : "text-gray-300"
//           }`}
//           onClick={() => onClick(starValue)}
//         >
//           &#9733; {/* Star character */}
//         </span>
//       ))}
//     </div>
//   );
// };

// const ProductDetails = () => {
//   const { id } = useParams(); // Extract the 'id' parameter from the URL
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showReviewForm, setShowReviewForm] = useState(false); // State to manage review form visibility
//   const [reviewRating, setReviewRating] = useState(0); // State to hold review rating
//   const [reviewComment, setReviewComment] = useState(""); // State to hold review comment
//   const [reviews, setReviews] = useState([]); // State to hold reviews
//   const [averageRating, setAverageRating] = useState(0); 
//   const navigate = useNavigate();

//  const fetchReviews = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/products/${id}/getreviews`);
//       // Sort reviews 
//       const sortedReviews = response.data.reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//       setReviews(sortedReviews);

//         // Calculate average rating
//     if (sortedReviews.length > 0) {
//       const totalRating = sortedReviews.reduce((acc, curr) => acc + curr.rating, 0);
//       const avgRating = totalRating / sortedReviews.length;
//       setAverageRating(avgRating);
//     }

//     } catch (error) {
//       console.error("Failed to fetch reviews:", error.message);
//       toast.error("Failed to fetch reviews. Please try again.");
//     }
//   };

//   useEffect(() => {
//     const fetchProductById = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         if (!token) {
//           console.error("Unauthorised login please");
//           return;
//         }

//         const response = await axios.get(`${BASE_URL}/getProductById/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setProduct(response.data.product);
//         setLoading(false);
//       } catch (error) {
//         console.error("Failed to fetch product:", error.message);
//         setError("Failed to fetch product. Please try again.");
//         setLoading(false);
//       }
//     };

  

//     fetchProductById();
//     fetchReviews();
//   }, [id, navigate,]);

//   const handleAddToCart = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.error("Authentication token not found. Please log in.");
//         return;
//       }

//       const decodedToken = jwtDecode(token);
//       const userId = decodedToken.user_id;

//       const response = await axios.post(
//         `${BASE_URL}/addToCart`,
//         { productId: id, userId: userId },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//   console.log(response)
//       console.log("Product added to cart:", response.data.message);
//       toast.success("Product added to cart successfully");
//       navigate(`/getcart`);
//     } catch (error) {
//       console.error("Failed to add product to cart:", error.response);
//       toast.error("Failed to add product to cart.");
//     }
//   };

//   const handleBuyNow = () => {
//     if (product) {
//       console.log(`Buying product "${product.productName}".`);
//     }
//   };

//   const handleReport = () => {
//     navigate(`/report/${id}`);
//   };

//   const toggleReviewForm = () => {
//     setShowReviewForm(!showReviewForm); // Toggle review form visibility
//   };

//   const handleReviewSubmit = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.error("Authentication token not found. Please log in.");
//         return;
//       }

//       const response = await axios.post(
//         `${BASE_URL}/products/${id}/reviews`,
//         { rating: reviewRating, comment: reviewComment },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       console.log("Review added:", response.data.review);
//       toast.success("Review added successfully");
//       // Optionally, update state or perform other actions after adding review
//       setReviewRating(0); // Reset review rating after submission
//       setReviewComment(""); // Reset review comment after submission
//       fetchReviews();
//     } catch (error) {
//       console.error("Failed to add review:", error.message);
//       toast.error("Failed to add review. Please try again.");
//     }
//   };

//   if (loading) {
//     return <p>Loading product...</p>;
//   }

//   if (error) {
//     return <p className="text-red-600">Product not found.</p>;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 h-screen">
//       {product ? (
//         <div className="flex flex-col md:flex-row md:space-x-8  bg-white rounded-lg shadow-xl shadow-indigo-500/60 p-6">
//           <div className="md:w-1/3">
//             <img src={`${BASE_URL}/${product.image}`} alt={product.productName} className="rounded-lg shadow-lg" />
//           </div>
//           <div className="md:w-2/3">
//             <h2 className="text-3xl font-bold mb-4 uppercase">{product.productName}</h2>
//             <div className="text-gray-600 mb-4">Category: {product.category}</div>
//             <div className="text-lg font-bold text-blue-600 mb-4">Price: ${product.price}</div>
//             <div className="flex ">
              
               
//             <div className="text-gray-800 mb-4"> Average Rating: <StarRating value={averageRating} /></div>

// <p className="text-gray-800 mb-4">, {averageRating.toFixed(1)}</p>
// </div>
           

            
//             <p className="text-gray-800 mb-4">{product.description}</p>

//             <div className="flex flex-col space-y-4 mt-4">
//               <button
//                 onClick={handleAddToCart}
//                 className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg shadow-blue-600/60 focus:outline-none"
//               >
//                 Add to Cart
//               </button>
//               <button
//                 onClick={handleBuyNow}
//                 className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg shadow-green-600/60 focus:outline-none"
//               >
//                 Buy Now
//               </button>
//               <button
//                 onClick={handleReport}
//                 className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-lg shadow-red-600/60 focus:outline-none"
//               >
//                 Report
//               </button>
//               <button
//                 onClick={toggleReviewForm} // Toggle review form visibility
//                 className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg shadow-lg shadow-yellow-600/60 focus:outline-none"
//               >
//                 Review
//               </button>
//               {/* <button
//                 onClick={getReviews}
//                 className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg shadow-lg shadow-gray-600/60 focus:outline-none"
//               >
//                 Get Reviews
//               </button> */}

// {showReviewForm && (
//               <div className="flex flex-col space-y-4 mt-4">
//               <StarRating value={reviewRating} onClick={setReviewRating} />
//               <textarea
//                 value={reviewComment}
//                 onChange={(e) => setReviewComment(e.target.value)}
//                 placeholder="Write your review..."
//                 rows={4}
//                 className="border rounded-md p-2 mb-2"
//               />
//               <button
//                 onClick={handleReviewSubmit}
//                 className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg shadow-blue-600/60 focus:outline-none"
//               >
//                 Submit Review
//               </button>
//             </div>
//             )}
//                  <div className="uppercase text-center p-8 sm:text-lg text-lg shadow-md shadow-blue-600/60 mt=24">reviews</div>
//               {reviews.map((review) => (
                
//                 <div key={review._id} className="border p-4 rounded-md shadow-md ">
                  
//                   <div className=" ">
//                     <div>Reviewer:{review.reviewerName}</div>
//                   </div>
//                   <p className="font-bold">Rating: {review.rating}</p>
//                   <p>{review.comment}</p>
//                 </div>
//               ))}
//             </div>
            
//           </div>
//         </div>
//       ) : (
//         <p className="text-red-600">Product not found.</p>
//       )}
//     </div>
//   );
// };

// export default ProductDetails;

