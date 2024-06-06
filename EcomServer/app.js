const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

const connect = require('./db/models/config');
const userRoutes = require('./Routes/userRoutes');
const authRoutes = require('./Routes/authRoutes');
const productRoutes = require('./Routes/productRoutes');
const cartRoutes = require('./Routes/cartRoutes');
const orderRoutes = require('./Routes/orderRoutes');

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS
app.use(express.urlencoded({ extended: true })); //to parse URL-encoded data(incase of file-upload)

// Routes
app.use(userRoutes); 
app.use(authRoutes);
app.use(productRoutes);
app.use(cartRoutes);
app.use(orderRoutes);

// Database connection
connect();
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Start the server
app.listen(process.env.PORT, () => {
    console.log(`server listening at http://localhost:${process.env.PORT}`);
  })
