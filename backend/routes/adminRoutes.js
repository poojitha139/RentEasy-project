const express = require("express");
const router = express.Router();
const User = require("../config/models/UserModel");
const authenticate = require("../middleware/authMiddleware");

//Approve a user to become an owner
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
    res.status(500).json({ message: "Server error" });
  }
});

//Get all users
router.get("/users", authenticate, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
