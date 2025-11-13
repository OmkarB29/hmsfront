import React from "react";
import "./App.css";
import "./index.css";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

import StudentDashboard from "./components/Dashboard/StudentDashboard";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import WardenDashboard from "./components/Dashboard/WardenDashboard";
import ReportGeneration from "./components/Admin/ReportGeneration";

import AdminRegistrationManagement from "./components/Admin/AdminRegistrationManagement";
import StudentManagement from "./components/Admin/StudentManagement";
import RoomManagement from "./components/Admin/RoomManagement";
import FeeManagement from "./components/Admin/FeeManagement";
import ComplaintManagement from "./components/Admin/ComplaintManagement";

import StudentComplaint from "./components/Student/StudentComplaint";
import Home from "./pages/Home";
import Unauthorized from "./pages/Unauthorized";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* 🔐 Protected Routes */}

        {/* Student */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/complaints"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentComplaint />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "WARDEN"]}>
              <StudentManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rooms"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <RoomManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/fees"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <FeeManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "WARDEN"]}>
              <ComplaintManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ReportGeneration />
            </ProtectedRoute>
          }
        />

        {/* Warden */}
        <Route
          path="/warden"
          element={
            <ProtectedRoute allowedRoles={["WARDEN"]}>
              <WardenDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/profile" element={<Profile />} />

        {/* Default */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
