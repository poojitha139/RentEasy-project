const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userController");
const User = require("../config/models/UserModel");
const authenticate = require("../middleware/authMiddleware");
router.post("/register", registerUser);
router.post("/login", loginUser);

// Admin route to approve as owner
router.put("/approve-owner/:id", authenticate, async (req, res) => {
  try {
    const userId = req.params.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { type: "owner", isApproved: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User approved as owner", user: updatedUser });
  } catch (err) {
    console.error("Error approving owner:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
