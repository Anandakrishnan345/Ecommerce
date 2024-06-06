// import React, { useState } from 'react';

// import { Link, useNavigate } from 'react-router-dom';

// import axios from 'axios';
// import { validateEmail, validatePassword } from './ValidationRules';
// import BASE_URL from '../Api-handler/Baseurl';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';



// function Login() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [errors, setErrors] = useState({});
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const newErrors = {
//             email: validateEmail(email),
//             password: validatePassword(password)
//         };

//         if (newErrors.email || newErrors.password) {
//             setErrors(newErrors);
//             return;
//         }

//         try {
//             const response = await axios.post(`${BASE_URL}/login`, {
//                 email: email,
//                 password: password,
                
//             });
//             console.log('34response',response.data.message)
           
            

//             if (response.data.success) {
//                 console.log('successresponse',response)
//                 const { access_token, user } = response.data.data;
//                 localStorage.setItem('token', access_token);

//                 toast.success('User added successfully! Password is sent to your mail.', {
//                     position: 'top-center',
//                   }).then(()=>{
                    
//                     const userTypeMap = {
//                         '65eecb8e18357aefe2c8f15b': 'admin',
//                         '65eecbcb18357aefe2c8f15c': 'employee'
//                     };
    
//                     const userType = userTypeMap[user.user_type];
    
//                     if (userType === 'admin') {
//                         navigate(`/admin/${user._id}`);
    
//                     } else if (userType === 'employee') {
//                         if (!response.data.data.lastLogin) {
//                             navigate(`/employee/${user._id}/changepassword`);
//                         } else {
//                             navigate(`/employee/${user._id}`);
                            
                            
//                         }
//                     }
                   
//                      else {
//                         console.error('Unknown user role:', userType);
//                     }
    
//                     })

//                 // Swal.fire({
//                 //     icon: 'success',
//                 //     title: 'Login Successful',
//                 //     text: 'Redirecting...'
//                 // }).then(()=>{
                    
//                 // const userTypeMap = {
//                 //     '65eecb8e18357aefe2c8f15b': 'admin',
//                 //     '65eecbcb18357aefe2c8f15c': 'employee'
//                 // };

//                 // const userType = userTypeMap[user.user_type];

//                 // if (userType === 'admin') {
//                 //     navigate(`/admin/${user._id}`);

//                 // } else if (userType === 'employee') {
//                 //     if (!response.data.data.lastLogin) {
//                 //         navigate(`/employee/${user._id}/changepassword`);
//                 //     } else {
//                 //         navigate(`/employee/${user._id}`);
                        
                        
//                 //     }
//                 // }
//                 // // else if (userType === 'employee'&& response.data.data.user.password_token===null) {
//                 // //     navigate(`/employee/${user._id}`);
//                 // //  }
//                 // //  else if(userType==='employee'&&
//                 // // response.data.data.requiresPasswordChange){
//                 // //     navigate(`/employee/${user._id}/changepassword`)

//                 // // }
//                 //  else {
//                 //     console.error('Unknown user role:', userType);
//                 // }

//                 // })


//             } else {
               
             
                
//                 Swal.fire({
                   
//                     icon: 'error',
//                     text: response.data.message
//                 });
//             }
//         } catch (error) {
//            console.log('catch error',error)

//            toast.error( error.response.data.message, {
//             position: 'top-center',
//           })
            
//             // Swal.fire({
                
//             //     icon: 'error',
//             //     text: error.response.data.message
//             // });
//         }
//     };

//     return (
//         <div className="flex justify-center items-center h-screen bg-gray-100">
//         <div className="w-full max-w-md px-6 py-8 bg-white rounded-lg shadow-lg">
//           <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
//           <form onSubmit={handleSubmit}>
//             <div className="mb-4">
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                 Enter your email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
//                 placeholder="Email"
//               />
//               <span className="text-red-500 text-sm">{errors.email}</span>
//             </div>
//             <div className="mb-4">
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                 Enter your password
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
//                 placeholder="Password"
//               />
//               <span className="text-red-500 text-sm">{errors.password}</span>
//             </div>
//             <div className="mb-6">
//               <button
//                 type="submit"
//                 className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               >
//                 Login
//               </button>
//             </div>
//             <div className="text-center">
//               <p>
//                 Don't remember? <Link to="/forgotpassword" className="text-indigo-600">Forgot Password</Link>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     );
// }

// export default Login;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { validateEmail, validatePassword } from './ValidationRules';
import BASE_URL from '../Api-handler/Baseurl';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

 

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newErrors = {
      email: validateEmail(email),
      password: validatePassword(password)
    };
  
    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      return;
    }
  
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        email: email,
        password: password
      });
      console.log('loginresponse',response)
      if (response.data.success) {
        const { access_token, user } = response.data.data;
        localStorage.setItem('token', access_token);
  
        toast.success('User logged in successfully!', {
          position: 'top-center',
          onClose: () => {
            const userTypeMap = {
              '65eecb8e18357aefe2c8f15b': 'admin',
              '65eecbcb18357aefe2c8f15c': 'employee'
            };
  
            const userType = userTypeMap[user.user_type];
  
            if (userType === 'admin') {
              navigate(`/admin/${user._id}`);
            } else if (userType === 'employee') {
              // if (!user.lastLogin) {
              //   // New employee, prompt to change password
              //   navigate(`/employee/${user._id}/changepassword`);
              // } 
                // Check user role for further navigation
                const { role } = user;
                if (role === 'seller') {
                  navigate(`/seller/${user._id}`);
                } else {
                  navigate(`/buyer/${user._id}`);
                }
              
            } else {
              console.error('Unknown user role:', userType);
            }
          }
        });
      } else {
        toast.error(response.data.message, {
          position: 'top-center'
        });
      }
    } catch (error) {
      toast.error(error.response.data.message, {
        position: 'top-center'
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md px-6 py-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Enter your email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
              placeholder="Email"
            />
            <span className="text-red-500 text-sm">{errors.email}</span>
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Enter your password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
              placeholder="Password"
            />
            <span className="text-red-500 text-sm">{errors.password}</span>
          </div>
          <div className="mb-6">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>
          <div className="text-center">
            
            <p className="mt-4">
              Don't have an account? <Link to="/signup" className="text-indigo-600 font-medium">Sign Up</Link>
            </p>
            <p>
              Don't remember? <Link to="/forgotpassword" className="text-indigo-600">Forgot Password</Link>
            </p>
           
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
