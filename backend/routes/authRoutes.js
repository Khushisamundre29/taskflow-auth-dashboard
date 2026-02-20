const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/authController");

// Auth Routes
router.post("/register", registerUser); // Register User
router.post("/login", loginUser);  // login user
router.post("/logout", logoutUser);   // logout user

module.exports = router;
