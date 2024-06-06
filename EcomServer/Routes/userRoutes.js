const express=require('express');
const router=express.Router();
const userController=require("../controllers/usercontroller");
// const checkLogin=require('../Utils/checklogin').checkLogin;
// const accessControl =require('../Utils/access-control').accessControl;


// const setAccessControl = (access_type) => {
//     return (req, res, next) => {
//         accessControl(access_type, req, res, next)
//     }
// };
router.post('/signup',userController.signup);
router.get('/getuser',userController.getuser);
router.get('/viewuser/:id', userController.viewuser);
router.put('/update/:id',userController.updateUser);
router.delete('/delete/:id',userController.deleteUser);
router.post('/forgotPassword', userController.forgotPassword);
router.post('/resetpassword', userController.resetPassword);
module.exports=router;