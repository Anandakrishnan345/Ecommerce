const jwt = require('jsonwebtoken');
const User = require('../db/models/users');
const dotenv = require('dotenv');
dotenv.config();

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      console.log('Unauthorized')
      return res.status(401).json({ message: 'Authorization token missing or invalid' });
    }

    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    const user = await User.findOne({ _id: decoded.user_id });

    if (!user) {
      console.log('Unauthorized')
      return res.status(401).json({ message: 'Unauthorized' });
      
    }

    req.user = user; // Attach user data to the request object for subsequent routes
    next();
  } catch (error) {
    console.error('Authentication failed:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = authenticateUser;
