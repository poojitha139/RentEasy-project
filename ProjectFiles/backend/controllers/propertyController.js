const Property = require("../config/models/PropertyModel");
const moment = require("moment");

// Add a property
const addProperty = async (req, res) => {
  try {
    // Validate token middleware
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized. Missing user data." });
    }

    // Validate required fields
    const { Type, Address, Amt, ownerContact, addInfo } = req.body;
    if (!Type || !Address || !Amt) {
      return res.status(400).json({ message: "Type, Address, and Amt are required." });
    }

    // Handle uploaded file
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const newProperty = new Property({
      userId: req.user.userId,
      prop: {
        Type,
        Address,
        Amt,
        AdType: "Rent",
        images: imagePath ? [imagePath] : [],
      },
      ownerContact,
      addInfo,
    });

    const savedProperty = await newProperty.save();
    res.status(201).json(savedProperty);
  } catch (error) {
    console.error("❌ Add Property Error:", error);
    res.status(500).json({ message: "Failed to add property", error: error.message });
  }
};

// Get properties for logged-in owner
const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ userId: req.user.userId });
    res.json(properties);
  } catch (error) {
    console.error("❌ Get My Properties Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a property
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    if (property.userId.toString() !== req.user.userId)
      return res.status(403).json({ message: "Not authorized" });

    const { Type, Address, Amt, ownerContact, addInfo } = req.body;

    property.prop.Type = Type || property.prop.Type;
    property.prop.Address = Address || property.prop.Address;
    property.prop.Amt = Amt || property.prop.Amt;
    property.ownerContact = ownerContact || property.ownerContact;
    property.addInfo = addInfo || property.addInfo;

    const updated = await property.save();
    res.json(updated);
  } catch (err) {
    console.error("❌ Update Property Error:", err);
    res.status(500).json({ message: "Update failed" });
  }
};

// Delete a property
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    if (property.userId.toString() !== req.user.userId)
      return res.status(403).json({ message: "Not authorized" });

    await property.deleteOne();
    res.json({ message: "Property deleted" });
  } catch (err) {
    console.error("❌ Delete Property Error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};

// Get all available properties (for users)
const getAllAvailableProperties = async (req, res) => {
  try {
    const availableProps = await Property.find({ isAvailable: true });
    res.json(availableProps);
  } catch (err) {
    console.error("❌ Get All Properties Error:", err);
    res.status(500).json({ message: "Failed to load properties" });
  }
};

module.exports = {
  addProperty,
  getMyProperties,
  updateProperty,
  deleteProperty,
  getAllAvailableProperties,
};
