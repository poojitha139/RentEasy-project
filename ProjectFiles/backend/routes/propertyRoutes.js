// routes/propertyRoutes.js
const express = require("express");
const router = express.Router();

const Property = require("../config/models/PropertyModel");
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const {
  addProperty,
  getMyProperties,
  updateProperty,
  deleteProperty,
  getAllAvailableProperties,
} = require("../controllers/propertyController");

// Add new property by owner including image upload
router.post("/add", verifyToken, upload.single("image"), addProperty);

// Get all properties created by loged in user
router.get("/my-properties", verifyToken, getMyProperties);

//Update existing property by id
router.put("/update/:id", verifyToken, updateProperty);

//Delete propety from system
router.delete("/delete/:id", verifyToken, deleteProperty);

//Fetch all avilable propeties for renters
router.get("/available", getAllAvailableProperties);

//Fetch single propety by id
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
