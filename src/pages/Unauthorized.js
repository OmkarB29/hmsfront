import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => (
  <div className="container mt-5 text-center">
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h2 className="text-danger">Access Denied</h2>
            <p className="lead">You don't have permission to access this page.</p>
            <p>Please contact the administrator if you believe this is an error.</p>
            <Link to="/" className="btn btn-primary me-2">Go Home</Link>
            <Link to="/login" className="btn btn-outline-primary">Login</Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Unauthorized;
