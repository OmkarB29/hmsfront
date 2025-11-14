import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axiosInstance";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [dashboardData, setDashboardData] = useState({
    pendingRegistrations: 0,
    totalStudents: 0,
    totalRooms: 0,
    totalFeesCollected: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch total students
      const studentsRes = await axios.get("/api/admin/all-students", { headers });
      const totalStudents = studentsRes.data.length;

      // Fetch total rooms
      const roomsRes = await axios.get("/api/admin/all-rooms", { headers });
      const totalRooms = roomsRes.data.length;

      // Fetch fees
      const feesRes = await axios.get("/api/admin/all-fees", { headers });
      const totalFeesCollected = feesRes.data.reduce((sum, fee) => sum + (fee.amount || 0), 0);

      // Fetch pending registrations (if endpoint exists)
      let pendingRegistrations = 0;
      try {
        const registrationsRes = await axios.get("/api/admin/pending-registrations", { headers });
        pendingRegistrations = registrationsRes.data.length;
      } catch (e) {
        // Endpoint might not exist, use default
        pendingRegistrations = 0;
      }

      setDashboardData({
        pendingRegistrations,
        totalStudents,
        totalRooms,
        totalFeesCollected
      });
      setError("");
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Navigation Bar */}
      <nav className="admin-navbar">
        <div className="admin-navbar-container">
          <a className="admin-brand" href="/dashboard">
            🏢 Admin Portal
          </a>
          <ul className="admin-nav-menu">
            <li className="admin-nav-item">
              <button
                className={`admin-nav-link ${activeSection === "overview" ? "active" : ""}`}
                onClick={() => setActiveSection("overview")}
              >
                📊 Overview
              </button>
            </li>
            <li className="admin-nav-item">
              <button
                className={`admin-nav-link ${activeSection === "students" ? "active" : ""}`}
                onClick={() => setActiveSection("students")}
              >
                👨‍🎓 Students
              </button>
            </li>
            <li className="admin-nav-item">
              <button
                className={`admin-nav-link ${activeSection === "rooms" ? "active" : ""}`}
                onClick={() => setActiveSection("rooms")}
              >
                🛏 Rooms
              </button>
            </li>
            <li className="admin-nav-item">
              <button
                className={`admin-nav-link ${activeSection === "fees" ? "active" : ""}`}
                onClick={() => setActiveSection("fees")}
              >
                💰 Fees
              </button>
            </li>
          </ul>
          <div className="admin-nav-actions">
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="admin-main-content">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1>🏥 Admin Dashboard</h1>
            <p>Manage hostel operations, students, and resources</p>
          </div>
          <div style={{ textAlign: "right", color: "white" }}>
            <p style={{ margin: "0.5rem 0", fontSize: "0.95rem" }}>Welcome, <strong>{user?.name || user?.username || "Admin"}</strong></p>
          </div>
        </div>

        {/* Overview Section */}
        {activeSection === "overview" && (
          <div className="admin-section active">
            <div style={{ marginBottom: "1.5rem", textAlign: "right" }}>
              <button
                className="btn btn-primary"
                onClick={fetchDashboardData}
                style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
              >
                🔄 Refresh Data
              </button>
            </div>
            {error && <div className="alert alert-danger" style={{ marginBottom: "1.5rem" }}>{error}</div>}
            {loading ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <p>Loading dashboard data...</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
                <div className="section-card" style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>
                  <h3 style={{ color: "white", margin: 0 }}>📝 {dashboardData.pendingRegistrations}</h3>
                  <p style={{ color: "white", margin: "0.5rem 0 0 0" }}>Pending Registrations</p>
                </div>
                <div className="section-card" style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
                  <h3 style={{ color: "white", margin: 0 }}>👨‍🎓 {dashboardData.totalStudents}</h3>
                  <p style={{ color: "white", margin: "0.5rem 0 0 0" }}>Total Students</p>
                </div>
                <div className="section-card" style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)" }}>
                  <h3 style={{ color: "white", margin: 0 }}>🛏 {dashboardData.totalRooms}</h3>
                  <p style={{ color: "white", margin: "0.5rem 0 0 0" }}>Total Rooms</p>
                </div>
                <div className="section-card" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
                  <h3 style={{ color: "white", margin: 0 }}>💰 ₹{(dashboardData.totalFeesCollected / 100000).toFixed(1)}L</h3>
                  <p style={{ color: "white", margin: "0.5rem 0 0 0" }}>Total Fees Collected</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Students Section */}
        {activeSection === "students" && (
          <div className="admin-section active">
            <div className="section-card">
              <h3>👨‍🎓 Student Management</h3>
              <p>View, edit, or remove registered students.</p>
              <button className="action-btn btn-approve" onClick={() => navigate("/admin/students")}>
                Manage Students →
              </button>
            </div>
          </div>
        )}

        {/* Rooms Section */}
        {activeSection === "rooms" && (
          <div className="admin-section active">
            <div className="section-card">
              <h3>🛏 Room Management</h3>
              <p>Assign and manage hostel room allocations.</p>
              <button className="action-btn btn-approve" onClick={() => navigate("/admin/rooms")}>
                Manage Rooms →
              </button>
            </div>
          </div>
        )}

        {/* Fees Section */}
        {activeSection === "fees" && (
          <div className="admin-section active">
            <div className="section-card">
              <h3>💰 Fee Management</h3>
              <p>Track and update student hostel fee payments.</p>
              <button className="action-btn btn-approve" onClick={() => navigate("/admin/fees")}>
                Manage Fees →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;
