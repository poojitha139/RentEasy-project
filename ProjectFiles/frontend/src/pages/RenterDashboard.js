import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Modal,
  Badge
} from "react-bootstrap";
import axios from "axios";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsBell } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";
import "./RenterDashboard.css";

const RenterDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const username = localStorage.getItem("username") || "Renter";

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const res1 = await axios.get("http://localhost:3000/api/properties/available", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProperties(res1.data);

        const res2 = await axios.get("http://localhost:3000/api/bookings/my-bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const notif = res2.data.map((booking) => {
          const prop = booking.propertyId?.prop;
          const address = prop?.Address || "property";
          const type = prop?.Type || "Property";
          let message = "";

          if (booking.status === "pending") {
            message = `🕒 Your booking for ${type} in ${address} is pending.`;
          } else if (booking.status === "approved") {
            message = `✅ Approved! Contact owner at ${booking.ownerId?.ownerContact || "N/A"}`;
          } else {
            message = `❌ Your booking for ${type} in ${address} was rejected.`;
          }

          return {
            id: booking._id,
            message,
            status: booking.status,
          };
        });

        setNotifications(notif);
      } catch (err) {
        console.error("Fetch error", err);
      }
    };

    fetchData();
  }, []);

  const filtered = properties.filter((prop) =>
    prop.prop?.Address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

const removeNotification = async (id) => {
  try {
    const token = localStorage.getItem("token");
   await axios.put(
  `http://localhost:3000/api/bookings/update-booking/${id}`,
  { dismissed: true },
  { headers: { Authorization: `Bearer ${token}` } }
);

    setNotifications((prev) => prev.filter((n) => n.id !== id));
  } catch (err) {
    console.error("❌ Failed to dismiss notification", err);
    alert("Failed to dismiss notification");
  }
};


  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
{/* Top Header */}
<div className="top-header">
  <div className="brand">
    <GiHamburgerMenu className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)} />
    <span>🏠 RentEasy</span>
  </div>
  <div className="owner-name">
    Welcome, <span className="highlight-name">{username}</span>👋
  </div>
</div>

{/* Sidebar */}
<div className={`renter-sidebar ${sidebarOpen ? "open" : ""}`}>
  <div className="sidebar-icon" onClick={() => setShowNotificationModal(true)} title="Notifications">
    <BsBell size={24} /> <span>Notifications</span>
  </div>
  <div className="sidebar-icon" onClick={handleLogout} title="Logout">
    <BiLogOut size={24} /> <span>Logout</span>
  </div>
</div>

{/* Search Bar - moved inside wrapper for better spacing */}
<div className={`renter-dashboard-wrapper ${sidebarOpen ? "sidebar-open" : ""}`}>
  <Container className="text-center mt-3 mb-4">
    <input
      type="text"
      placeholder="🔍 Search by address..."
      className="form-control search-input mx-auto"
      style={{ maxWidth: "400px" }}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </Container>

  {/* Title */}
  <Container className="text-center mb-4">
    <h2 className="dashboard-title">✨ Available Properties ✨</h2>
  </Container>

  {/* Property Cards */}
  <Container>
    <Row>
      {filtered.map((prop) => (
        <Col key={prop._id} md={4} className="mb-4">
          <Card>
            <Card.Img
              variant="top"
              src={
                prop.prop.images?.[0]
                  ? prop.prop.images[0].startsWith("http")
                    ? prop.prop.images[0]
                    : `http://localhost:3000${prop.prop.images[0]}`
                  : "https://source.unsplash.com/400x300/?house"
              }
              className="card-img-top"
            />
            <Card.Body>
              <Card.Title>{prop.prop?.Type}</Card.Title>
              <Card.Text><strong>₹{prop.prop?.Amt}</strong> per month</Card.Text>
              <Card.Text><small>📍 {prop.prop?.Address}</small></Card.Text>
              <Button
                variant="primary"
                onClick={() => {
                  setSelectedProperty(prop);
                  setShowModal(true);
                }}
              >
                View More Info
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </Container>
</div>


      {/* More Info Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        {selectedProperty && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedProperty.prop?.Type}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <img
                src={
                  selectedProperty.prop.images?.[0]
                    ? selectedProperty.prop.images[0]
                    : "https://source.unsplash.com/400x300/?house"
                }
                alt="property"
                className="img-fluid mb-3"
              />
              <p><strong>Address:</strong> {selectedProperty.prop?.Address}</p>
              <p><strong>Price:</strong> ₹{selectedProperty.prop?.Amt}</p>
              <p><strong>Owner Contact:</strong> {selectedProperty.ownerContact}</p>
              <p><strong>More Info:</strong> {selectedProperty.addInfo || "No additional info."}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
              <Button
                variant="success"
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("token");
                    await axios.post(
                      "http://localhost:3000/api/bookings/book",
                      {
                        propertyId: selectedProperty._id,
                        ownerId: selectedProperty.userId,
                        username,
                      },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    alert("🏠 Booking request sent!");
                    setShowModal(false);
                  } catch (err) {
                    console.error("Booking failed:", err);
                    alert("❌ Failed to book property.");
                  }
                }}
              >
                Book Now
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* Notification Modal */}
      <Modal show={showNotificationModal} onHide={() => setShowNotificationModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>📬 Your Booking Updates</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {notifications.length === 0 ? (
            <p>No notifications yet.</p>
          ) : (
            notifications.map((noti) => (
              <Card key={noti.id} className="mb-2">
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <span
                    className={
                      noti.status === "approved"
                        ? "text-success"
                        : noti.status === "rejected"
                        ? "text-danger"
                        : "text-warning"
                    }
                  >
                    {noti.message}
                  </span>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => removeNotification(noti.id)}
                  >
                    ✖
                  </Button>
                </Card.Body>
              </Card>
            ))
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNotificationModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RenterDashboard;
