const express = require('express');
const router = express.Router();
const authenticateUser = require('../Utils/authenticateUser');
const productController = require('../controllers/productController');



const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Route to handle product creation, protected by authentication middleware
router.post('/addproduct', upload.single('image'), authenticateUser, productController.addProduct);

router.get('/getproducts', productController.getAllProducts);

router.get('/viewproducts/bySeller/:addedByUserId',authenticateUser, productController.viewProductSeller);

router.get('/getProductById/:id', authenticateUser,productController.getProductById);

router.put('/updateproduct/asSeller/:productId',upload.single('image'),authenticateUser,productController.updateProduct);

router.delete('/deleteproduct/:productId',upload.single('image'),authenticateUser,productController.deleteProduct);

router.post('/products/:productId/reviews', authenticateUser, productController.addReview);

router.get('/products/:productId/getreviews', productController.getAllReviewsForProduct);

router.post('/wishlist', authenticateUser,productController.addToWishlist);

router.get('/getwishlist', authenticateUser,productController.getWishlist);

module.exports = router;

