import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("user");
    navigate("/login");
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
                className={`admin-nav-link ${activeSection === "registrations" ? "active" : ""}`}
                onClick={() => setActiveSection("registrations")}
              >
                📝 Registrations
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
            <li className="admin-nav-item">
              <button
                className={`admin-nav-link ${activeSection === "complaints" ? "active" : ""}`}
                onClick={() => setActiveSection("complaints")}
              >
                🧾 Complaints
              </button>
            </li>
            <li className="admin-nav-item">
              <button
                className={`admin-nav-link ${activeSection === "reports" ? "active" : ""}`}
                onClick={() => setActiveSection("reports")}
              >
                📈 Reports
              </button>
            </li>
            <li className="admin-nav-item">
              <button
                className={`admin-nav-link ${activeSection === "notices" ? "active" : ""}`}
                onClick={() => setActiveSection("notices")}
              >
                📢 Notices
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
          <h1>🏥 Admin Dashboard</h1>
          <p>Manage hostel operations, students, and resources</p>
        </div>

        {/* Overview Section */}
        {activeSection === "overview" && (
          <div className="admin-section active">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
              <div className="section-card" style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>
                <h3 style={{ color: "white", margin: 0 }}>📝 7</h3>
                <p style={{ color: "white", margin: "0.5rem 0 0 0" }}>Pending Registrations</p>
              </div>
              <div className="section-card" style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
                <h3 style={{ color: "white", margin: 0 }}>👨‍🎓 125</h3>
                <p style={{ color: "white", margin: "0.5rem 0 0 0" }}>Total Students</p>
              </div>
              <div className="section-card" style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)" }}>
                <h3 style={{ color: "white", margin: 0 }}>🛏 48</h3>
                <p style={{ color: "white", margin: "0.5rem 0 0 0" }}>Total Rooms</p>
              </div>
              <div className="section-card" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
                <h3 style={{ color: "white", margin: 0 }}>💰 ₹18L</h3>
                <p style={{ color: "white", margin: "0.5rem 0 0 0" }}>Total Fees Collected</p>
              </div>
            </div>
          </div>
        )}

        {/* Registrations Section */}
        {activeSection === "registrations" && (
          <div className="admin-section active">
            <div className="section-card">
              <h3>📝 Manage Student Registrations</h3>
              <p>Approve or reject new student applications.</p>
              <button className="action-btn btn-approve" onClick={() => navigate("/admin/registrations")}>
                Manage Registrations →
              </button>
            </div>
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

        {/* Complaints Section */}
        {activeSection === "complaints" && (
          <div className="admin-section active">
            <div className="section-card">
              <h3>🧾 Complaint Management</h3>
              <p>View and resolve student or staff complaints.</p>
              <button className="action-btn btn-approve" onClick={() => navigate("/admin/complaints")}>
                Manage Complaints →
              </button>
            </div>
          </div>
        )}

        {/* Reports Section */}
        {activeSection === "reports" && (
          <div className="admin-section active">
            <div className="section-card">
              <h3>📈 Reports</h3>
              <p>Generate hostel, occupancy, and fee reports.</p>
              <button className="action-btn btn-approve" onClick={() => navigate("/admin/reports")}>
                View Reports →
              </button>
            </div>
          </div>
        )}

        {/* Notices Section */}
        {activeSection === "notices" && (
          <div className="admin-section active">
            <div className="section-card">
              <h3>📢 Notice Board</h3>
              <p>Create or update important hostel announcements.</p>
              <button className="action-btn btn-approve" onClick={() => navigate("/admin/notices")}>
                Manage Notices →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
