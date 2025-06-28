const Property = require("../config/models/PropertyModel");
const moment = require("moment");

const addProperty = async (req, res) => {
  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const newProperty = new Property({
      userId: req.user.userId,
      prop: {
        Type: req.body.Type,
        Address: req.body.Address,
        Amt: req.body.Amt,
        AdType: "Rent",
        images: imagePath ? [imagePath] : [],
      },
      ownerContact: req.body.ownerContact,
      addInfo: req.body.addInfo,
    });

    const savedProperty = await newProperty.save();
    res.status(201).json(savedProperty);
  } catch (error) {
    res.status(500).json({ message: "Failed to add property" });
  }
};

const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ userId: req.user.userId });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    if (property.userId.toString() !== req.user.userId)
      return res.status(403).json({ message: "Not authorized" });

    property.prop.Type = req.body.Type || property.prop.Type;
    property.prop.Address = req.body.Address || property.prop.Address;
    property.prop.Amt = req.body.Amt || property.prop.Amt;
    property.ownerContact = req.body.ownerContact || property.ownerContact;
    property.addInfo = req.body.addInfo || property.addInfo;

    const updated = await property.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    if (property.userId.toString() !== req.user.userId)
      return res.status(403).json({ message: "Not authorized" });

    await property.deleteOne();
    res.json({ message: "Property deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

const getAllAvailableProperties = async (req, res) => {
  try {
    const availableProps = await Property.find({ isAvailable: true });
    res.json(availableProps);
  } catch (err) {
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
