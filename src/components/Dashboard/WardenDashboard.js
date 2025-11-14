import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import "./WardenDashboard.css";

const WardenDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [notices, setNotices] = useState([]);
  const [noticeText, setNoticeText] = useState("");
  const [students, setStudents] = useState([]);
  const [roomRequests, setRoomRequests] = useState([]);
  const [activeSection, setActiveSection] = useState("overview");

  const token = localStorage.getItem("token");
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  // Fetch Complaints
  const fetchComplaints = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/warden/complaints", { headers });
      setComplaints(res.data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  }, [headers]);

  // Fetch Notices
  const fetchNotices = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/warden/notices", { headers });
      setNotices(res.data);
    } catch (err) {
      console.error("Error fetching notices:", err);
    }
  }, [headers]);

  // Fetch Students
  const fetchStudents = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/warden/students", { headers });
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  }, [headers]);

  // Fetch Room Requests
  const fetchRoomRequests = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/warden/room-change", { headers });
      setRoomRequests(res.data);
    } catch (err) {
      console.error("Error fetching room change requests:", err);
    }
  }, [headers]);

  // Fetch all data on component mount and when user changes
  useEffect(() => {
    // Clear all state on user change
    setComplaints([]);
    setNotices([]);
    setStudents([]);
    setRoomRequests([]);
    
    fetchComplaints();
    fetchNotices();
    fetchStudents();
    fetchRoomRequests();
  }, [token, fetchComplaints, fetchNotices, fetchStudents, fetchRoomRequests]);

  // Resolve Complaint
  const resolveComplaint = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/warden/complaints/${id}/resolve`, {}, { headers });
      alert("✅ Complaint resolved!");
      fetchComplaints();
    } catch (err) {
      console.error("Error resolving complaint:", err);
      alert("❌ Failed to resolve complaint.");
    }
  };

  // Add Notice
  const addNotice = async (e) => {
    e.preventDefault();
    if (!noticeText.trim()) {
      alert("Please enter a notice");
      return;
    }
    try {
      await axios.post(
        "http://localhost:8080/api/warden/notices",
        { message: noticeText, postedBy: "WARDEN" },
        { headers }
      );
      setNoticeText("");
      alert("✅ Notice added successfully!");
      fetchNotices();
    } catch (err) {
      console.error("Error adding notice:", err);
      alert("❌ Failed to add notice.");
    }
  };

  // Delete Notice
  const deleteNotice = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/warden/notices/${id}`, { headers });
      alert("✅ Notice deleted!");
      fetchNotices();
    } catch (err) {
      console.error("Error deleting notice:", err);
      alert("❌ Failed to delete notice.");
    }
  };

  // Update Student Room
  const updateRoom = async (id) => {
    const newRoom = prompt("Enter new room number:");
    if (!newRoom) return;
    try {
      await axios.put(
        `http://localhost:8080/api/warden/students/${id}/room?roomNo=${newRoom}`,
        {},
        { headers }
      );
      alert("✅ Room updated successfully!");
      fetchStudents();
    } catch (err) {
      console.error("Error updating room:", err);
      alert("❌ Failed to update room.");
    }
  };

  // Approve Room Request
  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/warden/room-change/${id}/approve`, {}, { headers });
      alert("✅ Request approved!");
      fetchRoomRequests();
    } catch (err) {
      console.error("Error approving request:", err);
      alert("❌ Failed to approve request.");
    }
  };

  // Reject Room Request
  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/warden/room-change/${id}/reject`, {}, { headers });
      alert("✅ Request rejected!");
      fetchRoomRequests();
    } catch (err) {
      console.error("Error rejecting request:", err);
      alert("❌ Failed to reject request.");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];
      window.location.href = "/login";
    }
  };

  return (
    <div className="warden-dashboard">
      {/* Navigation Bar */}
      <nav className="warden-navbar">
        <div className="warden-navbar-container">
          <a className="warden-brand" href="/dashboard">
            🏢 Hostel Warden
          </a>
          <ul className="warden-nav-menu">
            <li className="warden-nav-item">
              <button
                className={`warden-nav-link ${activeSection === "overview" ? "active" : ""}`}
                onClick={() => setActiveSection("overview")}
              >
                📊 Overview
              </button>
            </li>
            <li className="warden-nav-item">
              <button
                className={`warden-nav-link ${activeSection === "notices" ? "active" : ""}`}
                onClick={() => setActiveSection("notices")}
              >
                📢 Notices
              </button>
            </li>
            <li className="warden-nav-item">
              <button
                className={`warden-nav-link ${activeSection === "complaints" ? "active" : ""}`}
                onClick={() => setActiveSection("complaints")}
              >
                🧾 Complaints
              </button>
            </li>
            <li className="warden-nav-item">
              <button
                className={`warden-nav-link ${activeSection === "room-requests" ? "active" : ""}`}
                onClick={() => setActiveSection("room-requests")}
              >
                🔁 Room Requests
              </button>
            </li>
            <li className="warden-nav-item">
              <button
                className={`warden-nav-link ${activeSection === "students" ? "active" : ""}`}
                onClick={() => setActiveSection("students")}
              >
                👨‍🎓 Students
              </button>
            </li>
          </ul>
          <div className="warden-nav-actions">
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="warden-main-content">
        {/* Header */}
        <div className="warden-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1>🏠 Warden Dashboard</h1>
            <p>Manage hostel operations and student records efficiently</p>
          </div>
          <div style={{ textAlign: "right", color: "white" }}>
            <p style={{ margin: "0.5rem 0", fontSize: "0.95rem" }}>Welcome, <strong>{JSON.parse(localStorage.getItem("user"))?.name || JSON.parse(localStorage.getItem("user"))?.username || "Warden"}</strong></p>
          </div>
        </div>

        {/* Overview Section */}
        {activeSection === "overview" && (
          <div className="warden-section active">
            <div style={{ marginBottom: "1.5rem", textAlign: "right" }}>
              <button
                className="btn btn-primary"
                onClick={() => {
                  fetchComplaints();
                  fetchNotices();
                  fetchStudents();
                  fetchRoomRequests();
                }}
                style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
              >
                🔄 Refresh Data
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
              <div className="section-card" style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>
                <h3 style={{ color: "white", margin: 0 }}>📝 {complaints.length}</h3>
                <p style={{ color: "white", margin: "0.5rem 0 0 0" }}>Complaints</p>
              </div>
              <div className="section-card" style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
                <h3 style={{ color: "white", margin: 0 }}>📢 {notices.length}</h3>
                <p style={{ color: "white", margin: "0.5rem 0 0 0" }}>Notices Posted</p>
              </div>
              <div className="section-card" style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)" }}>
                <h3 style={{ color: "white", margin: 0 }}>👨‍🎓 {students.length}</h3>
                <p style={{ color: "white", margin: "0.5rem 0 0 0" }}>Students</p>
              </div>
              <div className="section-card" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
                <h3 style={{ color: "white", margin: 0 }}>🔁 {roomRequests.length}</h3>
                <p style={{ color: "white", margin: "0.5rem 0 0 0" }}>Room Requests</p>
              </div>
            </div>
          </div>
        )}

        {/* Notices Section */}
        {activeSection === "notices" && (
          <div className="warden-section active">
            <div className="section-card">
              <h3>📢 Manage Notices</h3>
              <form onSubmit={addNotice} className="notice-form">
                <input
                  type="text"
                  placeholder="Enter new notice..."
                  value={noticeText}
                  onChange={(e) => setNoticeText(e.target.value)}
                  required
                />
                <button type="submit">Add Notice</button>
              </form>

              {notices.length > 0 ? (
                <ul className="notice-list">
                  {notices.map((n) => (
                    <li key={n.id} className="notice-item">
                      <span>{n.message}</span>
                      <button className="notice-delete-btn" onClick={() => deleteNotice(n.id)}>
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="empty-state">
                  <p>No notices posted yet. Create one to get started!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Complaints Section */}
        {activeSection === "complaints" && (
          <div className="warden-section active">
            <div className="section-card">
              <h3>🧾 Student Complaints</h3>
              {complaints.length > 0 ? (
                <div className="table-wrapper">
                  <table className="responsive-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Student</th>
                        <th>Room</th>
                        <th>Message</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.map((c) => (
                        <tr key={c.id}>
                          <td>#{c.id}</td>
                          <td>{c.studentName || "Unknown"}</td>
                          <td>{c.roomNumber || "N/A"}</td>
                          <td>{c.message}</td>
                          <td>
                            <span className={`status-badge status-${c.status?.toLowerCase()}`}>
                              {c.status}
                            </span>
                          </td>
                          <td>
                            {c.status === "PENDING" ? (
                              <button className="action-btn btn-resolve" onClick={() => resolveComplaint(c.id)}>
                                Resolve
                              </button>
                            ) : (
                              <span className="status-badge status-resolved">✓ Resolved</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <p>No complaints at the moment. Great job! 🎉</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Room Requests Section */}
        {activeSection === "room-requests" && (
          <div className="warden-section active">
            <div className="section-card">
              <h3>🔁 Room Change Requests</h3>
              {roomRequests.length > 0 ? (
                <div className="table-wrapper">
                  <table className="responsive-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Student</th>
                        <th>Current Room</th>
                        <th>Requested Room</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roomRequests.map((r) => (
                        <tr key={r.id}>
                          <td>#{r.id}</td>
                          <td>{r.studentName}</td>
                          <td>{r.currentRoom}</td>
                          <td>{r.requestedRoom}</td>
                          <td>{r.reason}</td>
                          <td>
                            <span className={`status-badge status-${r.status?.toLowerCase()}`}>
                              {r.status}
                            </span>
                          </td>
                          <td>
                            {r.status === "PENDING" && (
                              <div style={{ display: "flex", gap: "0.4rem" }}>
                                <button className="action-btn btn-approve" onClick={() => handleApprove(r.id)}>
                                  Approve
                                </button>
                                <button className="action-btn btn-reject" onClick={() => handleReject(r.id)}>
                                  Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <p>No room change requests at the moment.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Students Section */}
        {activeSection === "students" && (
          <div className="warden-section active">
            <div className="section-card">
              <h3>👨‍🎓 Student Directory</h3>
              {students.length > 0 ? (
                <div className="table-wrapper">
                  <table className="responsive-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Room</th>
                        <th>Fee Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s) => (
                        <tr key={s.id}>
                          <td>#{s.id}</td>
                          <td>{s.name || "N/A"}</td>
                          <td>{s.username || "N/A"}</td>
                          <td>{s.email || "N/A"}</td>
                          <td>{s.department || "N/A"}</td>
                          <td>
                            <button className="action-btn btn-update" onClick={() => updateRoom(s.id)}>
                              {s.roomNumber || "Assign Room"}
                            </button>
                          </td>
                          <td>
                            <span className={`status-badge status-paid`}>
                              PAID
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <p>No student records found.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WardenDashboard;
