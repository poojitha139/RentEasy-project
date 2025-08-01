import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Card,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import axios from "axios";
import { BsBell } from "react-icons/bs";
import { MdAddBusiness } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import "./OwnerDashboard.css";

const OwnerDashboard = () => {
  const [myProperties, setMyProperties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    Type: "",
    Address: "",
    Amt: "",
    ownerContact: "",
    addInfo: "",
    image: null,
  });

  const [notifications, setNotifications] = useState([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "Owner";

  // ✅ Fixed: fetchBookings wrapped with useCallback
  const fetchBookings = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/bookings/owner-bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formatted = res.data.map((booking) => ({
        id: booking._id,
        message: `Booking request from ${booking.username} for ${booking.propertyId?.prop?.Type || "property"}`,
        status: booking.status,
      }));

      setNotifications(formatted);
    } catch (err) {
      console.error("❌ Error fetching owner bookings", err);
    }
  }, [token]);

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 3000);
    return () => clearInterval(interval);
  }, [fetchBookings]);

  useEffect(() => {
    const fetchMyProps = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/properties/my-properties", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyProperties(res.data);
      } catch (err) {
        console.error("❌ Error fetching owner properties", err);
      }
    };
    fetchMyProps();
  }, [token]);

  const handleAddProperty = async () => {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    try {
      const res = await axios.post("http://localhost:3000/api/properties/add", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMyProperties((prev) => [...prev, res.data]);
      setShowModal(false);
      setFormData({
        Type: "",
        Address: "",
        Amt: "",
        ownerContact: "",
        addInfo: "",
        image: null,
      });
    } catch (err) {
      console.error("Failed to add property", err);
      alert("Error adding property");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/properties/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyProperties((prev) => prev.filter((prop) => prop._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete property");
    }
  };

  const handleBookingAction = async (id, action) => {
    try {
      await axios.put(
        `http://localhost:3000/api/bookings/update-booking/${id}`,
        { status: action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBookings();
    } catch (err) {
      console.error("Failed to update booking status", err);
    }
  };

  const dismissNotification = async (id) => {
    try {
      await axios.put(
        `http://localhost:3000/api/bookings/update-booking/${id}`,
        { dismissed: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("❌ Failed to dismiss", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/";
  };

  const openEditModal = (property) => {
    setEditForm({
      id: property._id,
      Type: property.prop.Type,
      Address: property.prop.Address,
      Amt: property.prop.Amt,
      ownerContact: property.prop.ownerContact,
      addInfo: property.prop.addInfo,
    });
    setEditModalShow(true);
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(
        `http://localhost:3000/api/properties/update/${editForm.id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMyProperties((prev) =>
        prev.map((prop) =>
          prop._id === editForm.id
            ? {
                ...prop,
                prop: {
                  ...prop.prop,
                  ...editForm,
                },
              }
            : prop
        )
      );
      setEditModalShow(false);
    } catch (err) {
      console.error("❌ Failed to update property", err);
      alert("Update failed");
    }
  };

  return (
    <>
      {/* Header */}
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
      <div className={`owner-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-icon" onClick={() => setShowNotificationModal(true)} title="Notifications">
          <BsBell size={24} /> <span>Notifications</span>
        </div>
        <div className="sidebar-icon" onClick={() => setShowModal(true)} title="Add Property">
          <MdAddBusiness size={24} /> <span>Add Property</span>
        </div>
        <div className="sidebar-icon" onClick={handleLogout} title="Logout">
          <BiLogOut size={24} /> <span>Logout</span>
        </div>
      </div>

      {/* Dashboard */}
      <div className={`dashboard-bg-wrapper ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="dashboard-content">
          <Container className="text-center mb-4">
            <h2 className="dashboard-title">Your Properties</h2>
          </Container>
          <Container>
            <Row>
              {myProperties.map((prop) => (
                <Col md={4} key={prop._id} className="mb-4">
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
                    />
                    <Card.Body>
                      <Card.Title>{prop.prop.Type}</Card.Title>
                      <Card.Text>₹{prop.prop.Amt} / month</Card.Text>
                      <Card.Text>📍 {prop.prop.Address}</Card.Text>
                      <div className="d-flex justify-content-between">
                        <Button size="sm" variant="outline-info" onClick={() => openEditModal(prop)}>✏️ Edit</Button>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(prop._id)}>🗑️ Delete</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </div>
      </div>

      {/* Add Property Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Property</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {["Type", "Address", "Amt", "ownerContact", "addInfo"].map((field) => (
              <Form.Group key={field}>
                <Form.Label>{field}</Form.Label>
                <Form.Control
                  type={field === "Amt" ? "number" : "text"}
                  value={formData[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                />
              </Form.Group>
            ))}
            <Form.Group>
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="success" onClick={handleAddProperty}>Add</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Property Modal */}
      <Modal show={editModalShow} onHide={() => setEditModalShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Property</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {["Type", "Address", "Amt", "ownerContact", "addInfo"].map((field) => (
              <Form.Group key={field}>
                <Form.Label>{field}</Form.Label>
                <Form.Control
                  type={field === "Amt" ? "number" : "text"}
                  value={editForm?.[field] || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, [field]: e.target.value })
                  }
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditModalShow(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleEditSubmit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      {/* Notifications Modal */}
      <Modal show={showNotificationModal} onHide={() => setShowNotificationModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>📬 Booking Requests</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {notifications.length === 0 ? (
            <p>No new requests.</p>
          ) : (
            notifications.map((noti) => (
              <Card key={noti.id} className="mb-2">
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{noti.message}</strong>
                    <div className="mt-2 d-flex gap-2">
                      {noti.status === "pending" && (
                        <>
                          <Button size="sm" variant="success" onClick={() => handleBookingAction(noti.id, "approved")}>Accept</Button>
                          <Button size="sm" variant="danger" onClick={() => handleBookingAction(noti.id, "rejected")}>Reject</Button>
                        </>
                      )}
                      {noti.status === "approved" && <Badge bg="success">Approved</Badge>}
                      {noti.status === "rejected" && <Badge bg="danger">Rejected</Badge>}
                    </div>
                  </div>
                  <Button size="sm" variant="outline-secondary" onClick={() => dismissNotification(noti.id)}>✖</Button>
                </Card.Body>
              </Card>
            ))
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNotificationModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OwnerDashboard;
