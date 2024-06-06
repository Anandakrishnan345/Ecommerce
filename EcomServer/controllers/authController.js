let success_function = require("../Utils/responsehandler").success_function;
let error_function = require("../Utils/responsehandler").error_function;
const sendEmail = require("../Utils/sendEmail").sendEmail;
const resetPassword = require("../Utils/reset_password").resetPassword;
const users = require("../db/models/users");
let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");
let dotenv = require("dotenv");
dotenv.config();
const user_types = require("../db/models/user_types");

exports.login = async function (req, res) {
  try {
      const { email, password } = req.body;

      console.log('Login attempt for email:', email);

      if (!email || !password) {
          return res.status(400).json({ message: "Email and password are required" });
      }

      const user = await users.findOne({ email });
      if (!user) {
          console.log('Invalid email:', email);
          return res.status(400).json({ message: "Invalid Email" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
          console.log('Invalid password for email:', email);
          return res.status(401).json({ message: "Invalid Password" });
      }

      const firstLogin = !user.lastLogin;
      if (firstLogin) {
          await users.updateOne({ email }, { $set: { lastLogin: new Date() } });
      }

      const userType = await user_types.findById(user.user_type);
      if (!userType) {
          console.log('User type not found for email:', email);
          return res.status(400).json({ message: "User type not found" });
      }

      const access_token = jwt.sign(
          { user_id: user._id, user_type: userType.user_type },
          process.env.PRIVATE_KEY,
          { expiresIn: "1d" }
      );

      console.log('Login successful for email:', email);

      return res.status(200).json({
          success: true,
          statusCode: 200,
          data: { user, access_token, lastLogin: user.lastLogin },
          message: "Login successful",
      });
  } catch (error) {
      console.error("Login failed:", error);
      return res.status(500).json({ message: "Internal server error" });
  }
};

  