const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getMyProfile, updateMyProfile } = require("../controllers/userController");

// @route  GET /api/user/me
router.get("/me", protect, getMyProfile);

// @route  PUT /api/user/me
router.put("/me", protect, updateMyProfile);

module.exports = router;