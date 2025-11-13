import React, { useState } from "react";
import axios from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

// baseURL is configured in the shared axios instance (supports REACT_APP_API_BASE_URL)

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    email: "",
    phone: "",
    role: "STUDENT",
    enrollmentNo: "",
    address: "",
    employeeId: "",
    department: "",
    adminKey: ""
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    // Common validation
    if (!formData.username.trim()) {
      setError("Username is required");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    // Role-specific validation
    if (formData.role === "STUDENT") {
      if (!formData.name.trim()) {
        setError("Name is required for students");
        return false;
      }
      if (!formData.email.trim()) {
        setError("Email is required for students");
        return false;
      }
      if (!formData.enrollmentNo.trim()) {
        setError("Enrollment number is required for students");
        return false;
      }
    } else if (formData.role === "ADMIN" || formData.role === "WARDEN") {
      if (!formData.employeeId.trim()) {
        setError("Employee ID is required");
        return false;
      }
      if (!formData.department.trim()) {
        setError("Department is required");
        return false;
      }
      if (!formData.adminKey.trim()) {
        setError("Admin registration key is required");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!validateForm()) return;
    setLoading(true);
    try {
      const registrationData = {
        username: formData.username,
        password: formData.password,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
      };
      if (formData.role === "STUDENT") {
        registrationData.enrollmentNo = formData.enrollmentNo;
        registrationData.address = formData.address;
      } else {
        registrationData.employeeId = formData.employeeId;
        registrationData.department = formData.department;
        registrationData.adminKey = formData.adminKey;
      }
      await axios.post("/api/auth/register", registrationData);
      setSuccess(`${formData.role} registration successful! Please login.`);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("Registration failed. " + (err.response?.data?.message || ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="col-md-8 mx-auto">
        <h3 className="mb-4">Register</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Register as:</label>
            <select className="form-select" name="role" value={formData.role} onChange={handleChange}>
              <option value="STUDENT">Student</option>
              <option value="ADMIN">Admin</option>
              <option value="WARDEN">Warden</option>
            </select>
          </div>
          <div className="mb-3">
            <input type="text" className="form-control" name="username" placeholder="Username"
              value={formData.username} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input type="password" className="form-control" name="password" placeholder="Password"
              value={formData.password} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input type="password" className="form-control" name="confirmPassword" placeholder="Confirm Password"
              value={formData.confirmPassword} onChange={handleChange} required />
          </div>
          {formData.role === "STUDENT" && (
            <>
              <div className="mb-3">
                <input type="text" className="form-control" name="name" placeholder="Full Name"
                  value={formData.name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <input type="email" className="form-control" name="email" placeholder="Email"
                  value={formData.email} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <input type="tel" className="form-control" name="phone" placeholder="Phone"
                  value={formData.phone} onChange={handleChange} />
              </div>
            </>
          )}
          {(formData.role === "ADMIN" || formData.role === "WARDEN") && (
            <>
              <div className="mb-3">
                <input type="text" className="form-control" name="name" placeholder="Full Name"
                  value={formData.name} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <input type="email" className="form-control" name="email" placeholder="Email"
                  value={formData.email} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <input type="tel" className="form-control" name="phone" placeholder="Phone"
                  value={formData.phone} onChange={handleChange} />
              </div>
            </>
          )}
          {formData.role === "STUDENT" && (
            <>
              <div className="mb-3">
                <input type="text" className="form-control" name="enrollmentNo" placeholder="Enrollment No"
                  value={formData.enrollmentNo} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <input type="text" className="form-control" name="address" placeholder="Address"
                  value={formData.address} onChange={handleChange} />
              </div>
            </>
          )}
          {(formData.role === "ADMIN" || formData.role === "WARDEN") && (
            <>
              <div className="mb-3">
                <input type="text" className="form-control" name="employeeId" placeholder="Employee ID"
                  value={formData.employeeId} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <input type="text" className="form-control" name="department" placeholder="Department"
                  value={formData.department} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <input type="text" className="form-control" name="adminKey" placeholder="Admin Registration Key"
                  value={formData.adminKey} onChange={handleChange} required />
              </div>
            </>
          )}
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
