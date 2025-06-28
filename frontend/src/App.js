import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPages from "./pages/AuthPages";
import MyBookings from "./pages/MyBookings";
import RenterDashboard from "./pages/RenterDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPages />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/renter-dashboard" element={<RenterDashboard />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
