import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => (
  <div className="home-container">
    <div className="background-overlay">
      <div className="container">
        <div className="row min-vh-100 align-items-center">
          <div className="col-md-8 mx-auto text-center">
            <div className="welcome-card">
              <h1 className="display-4 mb-4 text-primary fw-bold">
                Welcome to HMS
              </h1>
              <h2 className="h3 mb-4">Hostel Management System</h2>
              <p className="tagline mb-3 text-gradient">
                "Your Home Away From Home - Where Comfort Meets Community"
              </p>
              <p className="lead mb-5">
                Streamline your hostel experience with our comprehensive management system.
                Access your dashboard, manage rooms, and stay connected with your hostel community.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/login" className="btn btn-primary btn-lg px-4 py-2">
                  <i className="fas fa-sign-in-alt me-2"></i> Login
                </Link>
                <Link to="/register" className="btn btn-outline-primary btn-lg px-4 py-2">
                  <i className="fas fa-user-plus me-2"></i> Register
                </Link>
              </div>
              <div className="features mt-5">
                <div className="row g-4">
                  <div className="col-md-4">
                    <div className="feature-item">
                      <i className="fas fa-home mb-3"></i>
                      <h3>Room Management</h3>
                      <p>Easy room allocation and maintenance</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="feature-item">
                      <i className="fas fa-clock mb-3"></i>
                      <h3>24/7 Support</h3>
                      <p>Round-the-clock assistance</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="feature-item">
                      <i className="fas fa-shield-alt mb-3"></i>
                      <h3>Secure Access</h3>
                      <p>Protected user information</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Home;
