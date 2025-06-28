const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, enum: ["renter", "owner", "admin"], default: "renter" },
  isApproved: { type: Boolean, default: false }, //Only for owner users
});

module.exports = mongoose.model("User", userSchema);
