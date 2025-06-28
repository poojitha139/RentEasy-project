const express = require("express");
const router = express.Router();

const {
  bookProperty,
  getMyBookings,
  getBookingsForOwner,
  updateBookingStatus,
} = require("../controllers/bookingController");

const {
  getAllAvailableProperties,
} = require("../controllers/propertyController");

const authenticate = require("../middleware/authMiddleware");

// Book a propperty by renter
router.post("/book", authenticate, bookProperty);

// Get renters own booking list
router.get("/my-bookings", authenticate, getMyBookings);

// Fetch all booking for onwer
router.get("/owner-bookings", authenticate, getBookingsForOwner);

// Get all avilable propeties for renters
router.get("/properties", authenticate, getAllAvailableProperties);

// Update booking status (approve or reject or dismiss)
router.put("/update-booking/:id", authenticate, updateBookingStatus);

module.exports = router;
