
import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Buyer from './Components/Buyer';
import Home from './Components/Home';
import Seller from './Components/Seller';
import NavigationMenu from './Components/NavigationMenu';
import Signup from './Components/Signup';
import Login from './Components/Login';
// import NotFound from './Components/NotFound';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import User from './Components/User';
import Admin from './Components/EcomAdmin';
import Addproduct from './Components/products/Addproduct';
import Getproduct from './Components/products/Getproduct';
import Viewproduct from './Components/products/Viewproduct';
import ProductDetails from './Components/products/Buyer/Viewproductbuyer';
import Cart from './Components/Cart/Getcartitem';
import UpdateProduct from './Components/products/Updateproduct';
import Ordersummary from './Components/Orders/Getordersummary';
import GetOrder from './Components/Orders/Getorderitems';
import Wishlist from './Components/Whishlist/Getwishlist';
import SearchResults from './Components/products/Searchresult';
import ForgotPassword from './Components/Forgotpassword';
import ResetPassword from './Components/Resetpassword';
import UserProfile from './Components/Profile';
// import Newnavbar from './Components/Newnavbar';




function App() {
  return (
    <Router>
      <div>
        {/* Route Components inside Routes */}
        <ToastContainer position="top-center"
        autoClose={200} 
        /> 
        <Routes>
        {/* <Route path="/navbar" element={<Newnavbar/>} /> */}
          <Route path="/" element={<NavigationMenu/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/forgotpassword" element={<ForgotPassword/>} />
          <Route path='/reset-password/:resetToken' element={<ResetPassword/>} />

          {/* <Route path='/employee/:id' exact element={<User/>}/> */}
          <Route path='/admin/:id' element ={<Admin/>}/>
          <Route path='/addproduct/:id' element ={<Addproduct/>}/>
          <Route path='/getproduct' element ={<Getproduct/>}/>
          <Route path='/viewproducts/bySeller/:addedByUserId' element ={<Viewproduct/>}/>
          
          <Route path="/home" element={<Home />} />
          <Route path="/buyer/:id" element={<Buyer />} />
          <Route path='/profile/:id' element ={<UserProfile/>}/>
          <Route path='/viewproductdetailsbuyer/:id' element={<ProductDetails/>}/>
          <Route path="/search" element={<SearchResults />} />
          <Route path='/getcart' element={<Cart/>}/>
          <Route path="/getwishlist" element={<Wishlist/>} />
          <Route path='/ordersummary/:productId' element={<Ordersummary/>}/>
          <Route path="/order" element={<GetOrder/>} />
          <Route path="/seller/:id" element={<Seller />} />
          <Route path='/updateproduct/asSeller/:productId' element={<UpdateProduct/>}/>
         
          {/* <Route path="*" element={<NotFound />} />  */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

