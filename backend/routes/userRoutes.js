const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userController");
const authenticate = require("../middleware/authMiddleware");

// Public endpoimts
router.post("/register", registerUser);
router.post("/login", loginUser);

// Check auth route (user info from tokken)
router.get("/me", authenticate, (req, res) => {
  res.json({
    message: "User authenticated",
    user: req.user, // contains userId and type from the jwt
  });
});

module.exports = router;
