const error_function = require('./responsehandler').error_function;
const users = require('../db/models/users');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const checkLogin = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      const response = error_function({
        statusCode: 400,
        message: 'Token is required',
      });
      return res.status(response.statusCode).json(response);
    }

    const tokenString = authorizationHeader.split(' ')[1];
    const decoded = jwt.verify(tokenString, process.env.PRIVATE_KEY);

    const user_id = decoded.user_id;
    const user = await users.findOne({ _id: user_id });

    if (!user) {
      const response = error_function({
        statusCode: 404,
        message: 'Login User not found',
      });
      return res.status(response.statusCode).json(response);
    }

    req.user_id = user_id; // Attach user_id to the request for subsequent middleware/routes
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    const response = error_function({
      statusCode: 500,
      message: 'Internal server error',
    });
    return res.status(response.statusCode).json(response);
  }
};

module.exports = checkLogin;
