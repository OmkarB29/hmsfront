import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // optional: set a base URL for axios so you can use relative paths
  axios.defaults.baseURL = "http://localhost:8080";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🚫 make sure there’s no newline, space, or typo here
      const response = await axios.post("/api/auth/login", formData);

      // ✅ save token & user details
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // ✅ set default header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;

      // ✅ redirect by role
      const userRole = response.data.user.role;
      if (userRole === "ADMIN") navigate("/admin");
      else if (userRole === "WARDEN") navigate("/warden");
      else navigate("/student");

    } catch (err) {
      console.error("Login Error:", err);
      setError("Login failed. Please check your username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 p-4 rounded shadow bg-light" style={{ maxWidth: "500px" }}>
      <h2 className="text-center mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <div className="alert alert-danger text-center">{error}</div>}

        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
