import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StudentDashboard.css";

const API_BASE = "https://hmsback-production.up.railway.app";

const StudentDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [notices, setNotices] = useState([]);
  const [room, setRoom] = useState(null);
  const [fees, setFees] = useState({ amount: "", status: "" });
  const [formData, setFormData] = useState({ roomNumber: "", message: "" });
  const [requests, setRequests] = useState([]);
  const [roomChange, setRoomChange] = useState({
    currentRoom: "",
    requestedRoom: "",
    reason: "",
  });
  const [activeSection, setActiveSection] = useState("overview");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchComplaints();
    fetchNotices();
    fetchRoom();
    fetchFees();
    fetchRoomRequests();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/student/complaints`, { headers });
      setComplaints(res.data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

  const fetchNotices = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/student/notices`, { headers });
      setNotices(res.data);
    } catch (err) {
      console.error("Error fetching notices:", err);
    }
  };

  const fetchRoom = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/student/room`, { headers });
      setRoom(res.data);
    } catch (err) {
      console.error("Error fetching room details:", err);
    }
  };

  const fetchFees = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/student/fees`, { headers });
      setFees(res.data);
    } catch (err) {
      console.error("Error fetching fee details:", err);
    }
  };

  const fetchRoomRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/student/room-change`, { headers });
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching room change requests:", err);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        studentName: user.username,
        roomNumber: formData.roomNumber,
        message: formData.message,
      };
      await axios.post(`${API_BASE}/api/student/complaints`, payload, { headers });
      setFormData({ roomNumber: "", message: "" });
      fetchComplaints();
    } catch (err) {
      console.error("Error submitting complaint:", err);
    }
  };

  const handlePayment = async () => {
    try {
      await axios.post(`${API_BASE}/api/student/fees/pay`, {}, { headers });
      alert("✅ Payment Successful!");
      fetchFees();
    } catch (err) {
      console.error("Payment failed:", err);
      alert("Payment failed. Try again.");
    }
  };

  const deleteComplaint = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/student/complaints/${id}`, { headers });
      fetchComplaints();
    } catch (err) {
      console.error("Error deleting complaint:", err);
    }
  };

  const handleRoomChangeSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        studentName: user.username,
        currentRoom: roomChange.currentRoom,
        requestedRoom: roomChange.requestedRoom,
        reason: roomChange.reason,
      };
      await axios.post(`${API_BASE}/api/student/room-change`, payload, { headers });
      alert("Request submitted successfully!");
      setRoomChange({ currentRoom: "", requestedRoom: "", reason: "" });
      fetchRoomRequests();
    } catch (err) {
      console.error("Error submitting room change request:", err);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  return (
    <div className="student-dashboard">
      {/* Navigation Bar */}
      <nav className="student-navbar">
        <div className="student-navbar-container">
          <a className="student-brand" href="/dashboard">
            🏢 Student Portal
          </a>
          <ul className="student-nav-menu">
            <li className="student-nav-item">
              <button
                className={`student-nav-link ${activeSection === "overview" ? "active" : ""}`}
                onClick={() => {
                  setActiveSection("overview");
                  // Refresh data when switching to overview
                  fetchComplaints();
                  fetchNotices();
                  fetchRoom();
                  fetchFees();
                  fetchRoomRequests();
                }}
              >
                📊 Overview
              </button>
            </li>
            <li className="student-nav-item">
              <button
                className={`student-nav-link ${activeSection === "room" ? "active" : ""}`}
                onClick={() => setActiveSection("room")}
              >
                🏠 Room
              </button>
            </li>
            <li className="student-nav-item">
              <button
                className={`student-nav-link ${activeSection === "fees" ? "active" : ""}`}
                onClick={() => setActiveSection("fees")}
              >
                💰 Fees
              </button>
            </li>
            <li className="student-nav-item">
              <button
                className={`student-nav-link ${activeSection === "complaints" ? "active" : ""}`}
                onClick={() => setActiveSection("complaints")}
              >
                🗣 Complaints
              </button>
            </li>
            <li className="student-nav-item">
              <button
                className={`student-nav-link ${activeSection === "room-requests" ? "active" : ""}`}
                onClick={() => setActiveSection("room-requests")}
              >
                🔁 Room Requests
              </button>
            </li>
            <li className="student-nav-item">
              <button
                className={`student-nav-link ${activeSection === "notices" ? "active" : ""}`}
                onClick={() => setActiveSection("notices")}
              >
                📢 Notices
              </button>
            </li>
          </ul>
          <div className="student-nav-actions">
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="student-main-content">
        {/* Header */}
        <div className="student-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1>🎓 Student Dashboard</h1>
            <p>Manage your room and complaints</p>
          </div>
          <div style={{ textAlign: "right", color: "white" }}>
            <p style={{ margin: "0.5rem 0", fontSize: "0.95rem" }}>Welcome, <strong>{user?.name || user?.username || "Student"}</strong></p>
          </div>
        </div>

        {/* Overview Section */}
        {activeSection === "overview" && (
          <div className="student-section active">
            <div style={{ marginBottom: "1.5rem", textAlign: "right" }}>
              <button
                className="btn btn-primary"
                onClick={() => {
                  fetchComplaints();
                  fetchNotices();
                  fetchRoom();
                  fetchFees();
                  fetchRoomRequests();
                }}
                style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
              >
                🔄 Refresh Data
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
              <div className="section-card" style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>
                <h3 style={{ color: "white", margin: 0 }}>🏠 {room ? room.roomNo : "N/A"}</h3>
                <p style={{ color: "white", margin: "0.5rem 0 0 0" }}>Current Room</p>
              </div>
              <div className="section-card" style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
                <h3 style={{ color: "white", margin: 0 }}>💰 ₹{fees.amount || "0"}</h3>
                <p style={{ color: "white", margin: "0.5rem 0 0 0" }}>Hostel Fees</p>
              </div>
              <div className="section-card" style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)" }}>
                <h3 style={{ color: "white", margin: 0 }}>🗣 {complaints.length}</h3>
                <p style={{ color: "white", margin: "0.5rem 0 0 0" }}>Complaints</p>
              </div>
              <div className="section-card" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
                <h3 style={{ color: "white", margin: 0 }}>🔁 {requests.length}</h3>
                <p style={{ color: "white", margin: "0.5rem 0 0 0" }}>Room Requests</p>
              </div>
            </div>
          </div>
        )}

        {/* Room Section */}
        {activeSection === "room" && (
          <div className="student-section active">
            <div className="section-card">
              <h3>🏠 Room Allotment</h3>
              {room ? (
                <div className="info-block">
                  <div className="info-item">
                    <label>Room Number:</label>
                    <span>{room.roomNo}</span>
                  </div>
                  <div className="info-item">
                    <label>Capacity:</label>
                    <span>{room.capacity} students</span>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <p>❌ No room allotted yet. Contact the warden for allocation.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Fees Section */}
        {activeSection === "fees" && (
          <div className="student-section active">
            <div className="section-card">
              <h3>💰 Hostel Fees</h3>
              {fees.amount ? (
                <div className="info-block">
                  <div className="info-item">
                    <label>Amount:</label>
                    <span>₹{fees.amount}</span>
                  </div>
                  <div className="info-item">
                    <label>Status:</label>
                    <span className={`status-badge status-${fees.status?.toLowerCase()}`}>
                      {fees.status}
                    </span>
                  </div>
                  {fees.status !== "PAID" && (
                    <button className="action-btn btn-approve" onClick={handlePayment} style={{ marginTop: "1rem" }}>
                      💳 Pay Now
                    </button>
                  )}
                </div>
              ) : (
                <div className="empty-state">
                  <p>Fee details not available.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Complaints Section */}
        {activeSection === "complaints" && (
          <div className="student-section active">
            <div className="section-card">
              <h3>🗣 Submit & Track Complaints</h3>
              <form onSubmit={handleSubmit} className="form-section">
                <div className="form-row">
                  <input
                    type="text"
                    name="roomNumber"
                    className="form-input"
                    placeholder="Room Number"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="message"
                    className="form-input"
                    placeholder="Describe your complaint..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                  <button type="submit" className="action-btn btn-approve">
                    Submit
                  </button>
                </div>
              </form>

              {complaints.length > 0 ? (
                <div className="table-wrapper">
                  <table className="responsive-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Room</th>
                        <th>Complaint</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.map((c) => (
                        <tr key={c.id}>
                          <td>#{c.id}</td>
                          <td>{c.roomNumber}</td>
                          <td>{c.message}</td>
                          <td>
                            <span className={`status-badge status-${c.status?.toLowerCase()}`}>
                              {c.status}
                            </span>
                          </td>
                          <td>
                            <button
                              className="action-btn btn-reject"
                              onClick={() => deleteComplaint(c.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <p>No complaints yet. Great! 🎉</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Room Requests Section */}
        {activeSection === "room-requests" && (
          <div className="student-section active">
            <div className="section-card">
              <h3>🔁 Room Change Requests</h3>
              <form onSubmit={handleRoomChangeSubmit} className="form-section">
                <div className="form-row">
                  <input
                    type="text"
                    name="currentRoom"
                    placeholder="Current Room"
                    className="form-input"
                    value={roomChange.currentRoom}
                    onChange={(e) => setRoomChange({ ...roomChange, currentRoom: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    name="requestedRoom"
                    placeholder="Requested Room"
                    className="form-input"
                    value={roomChange.requestedRoom}
                    onChange={(e) => setRoomChange({ ...roomChange, requestedRoom: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    name="reason"
                    placeholder="Reason for change..."
                    className="form-input"
                    value={roomChange.reason}
                    onChange={(e) => setRoomChange({ ...roomChange, reason: e.target.value })}
                    required
                  />
                  <button type="submit" className="action-btn btn-approve">
                    Submit
                  </button>
                </div>
              </form>

              {requests.length > 0 ? (
                <div className="table-wrapper">
                  <table className="responsive-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Current Room</th>
                        <th>Requested Room</th>
                        <th>Reason</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((r) => (
                        <tr key={r.id}>
                          <td>#{r.id}</td>
                          <td>{r.currentRoom}</td>
                          <td>{r.requestedRoom}</td>
                          <td>{r.reason}</td>
                          <td>
                            <span className={`status-badge status-${r.status?.toLowerCase()}`}>
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <p>No room change requests yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notices Section */}
        {activeSection === "notices" && (
          <div className="student-section active">
            <div className="section-card">
              <h3>📢 Hostel Notices</h3>
              {notices.length > 0 ? (
                <div className="notice-list">
                  {notices.map((n) => (
                    <div key={n.id} className="notice-item-card">
                      <div className="notice-icon">📌</div>
                      <div className="notice-content">
                        <p className="notice-text">{n.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No notices available at the moment.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
