import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Table,
  Badge,
  Button,
  Modal,
} from "react-bootstrap";
import { GiHamburgerMenu } from "react-icons/gi";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const approveOwner = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/admin/approve-owner/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ User approved as owner!");
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, type: "owner", isApproved: true } : u
        )
      );
    } catch (err) {
      console.error("❌ Failed to approve owner:", err);
      alert("❌ Failed to approve owner");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/";
  };

  const ownerRequests = users.filter(
    (u) => u.type === "owner" && !u.isApproved
  );

  return (
    <div className={`admin-wrapper ${sidebarOpen ? "sidebar-open" : ""}`}>
      <div className="top-header">
        <div className="brand">
          <GiHamburgerMenu
            className="hamburger"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
          <span>🛡️ ADMIN PANEL</span>
        </div>
      </div>

      <div className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-item" onClick={() => setSidebarOpen(false)}>
          📋 Users List
        </div>
        <div className="sidebar-item" onClick={() => setShowRequestModal(true)}>
          📨 Requests ({ownerRequests.length})
        </div>
        <div className="sidebar-item" onClick={handleLogout}>
          🚪 Logout
        </div>
      </div>

      <div className="admin-content">
        <Container className="mt-5 pt-4">
          <h2 className="dashboard-title text-center mb-4">
            👥 Users Management
          </h2>

          {loading ? (
            <p className="text-center">Loading users...</p>
          ) : (
            <div className="table-wrapper">
              <Table responsive bordered hover className="glow-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user, index) => (
                      <tr key={user._id}>
                        <td>{index + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.type}</td>
                        <td>
                          {user.type === "owner" && user.isApproved ? (
                            <Badge bg="success">Approved</Badge>
                          ) : user.type === "owner" ? (
                            <Badge bg="warning text-dark">Pending</Badge>
                          ) : (
                            <Badge bg="info">Renter</Badge>
                          )}
                        </td>
                        <td>
                          {user.type === "owner" && !user.isApproved ? (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => approveOwner(user._id)}
                            >
                              Approve
                            </Button>
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Container>
      </div>

      <Modal
        show={showRequestModal}
        onHide={() => setShowRequestModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>📨 Owner Requests</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {ownerRequests.length === 0 ? (
            <p>No pending requests.</p>
          ) : (
            ownerRequests.map((user, i) => (
              <div
                key={user._id}
                className="d-flex justify-content-between align-items-center mb-2"
              >
                <div>
                  <strong>{i + 1}. {user.name}</strong> — {user.email}
                </div>
                <Button
                  size="sm"
                  variant="outline-success"
                  onClick={() => approveOwner(user._id)}
                >
                  ✅ Approve
                </Button>
              </div>
            ))
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRequestModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
