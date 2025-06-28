const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  prop: {
    Type: { type: String, required: true },
    AdType: { type: String, required: true },
    Address: { type: String, required: true },
    Amt: { type: Number, required: true },
    images: [{ type: String }],
  },
  ownerContact: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  addInfo: { type: String }
});

module.exports = mongoose.model("Property", propertySchema);
