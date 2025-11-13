import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminRegistrationManagement = () => {
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [adminKeys, setAdminKeys] = useState([]);
  const [newKey, setNewKey] = useState({ key: "", description: "", expiryDate: "", maxUses: 1 });
  const [showKeyForm, setShowKeyForm] = useState(false);

  useEffect(() => {
    fetchPendingRegistrations();
    fetchAdminKeys();
  }, []);

  const fetchPendingRegistrations = async () => {
    try {
      const response = await axios.get("/api/admin/pending-registrations");
      setPendingRegistrations(response.data);
    } catch (error) {
      console.error("Error fetching pending registrations:", error);
    }
  };

  const fetchAdminKeys = async () => {
    try {
      const response = await axios.get("/api/admin/registration-keys");
      setAdminKeys(response.data);
    } catch (error) {
      console.error("Error fetching admin keys:", error);
    }
  };

  const approveRegistration = async (registrationId) => {
    try {
      await axios.put(`/api/admin/approve-registration/${registrationId}`);
      fetchPendingRegistrations();
      alert("Registration approved successfully!");
    } catch (error) {
      alert("Error approving registration");
    }
  };

  const rejectRegistration = async (registrationId) => {
    if (window.confirm("Are you sure you want to reject this registration?")) {
      try {
        await axios.delete(`/api/admin/reject-registration/${registrationId}`);
        fetchPendingRegistrations();
        alert("Registration rejected!");
      } catch (error) {
        alert("Error rejecting registration");
      }
    }
  };

  const generateAdminKey = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/admin/generate-key", newKey);
      setNewKey({ key: "", description: "", expiryDate: "", maxUses: 1 });
      setShowKeyForm(false);
      fetchAdminKeys();
      alert("Admin key generated successfully!");
    } catch (error) {
      alert("Error generating admin key");
    }
  };

  const deactivateKey = async (keyId) => {
    if (window.confirm("Are you sure you want to deactivate this key?")) {
      try {
        await axios.put(`/api/admin/deactivate-key/${keyId}`);
        fetchAdminKeys();
        alert("Key deactivated successfully!");
      } catch (error) {
        alert("Error deactivating key");
      }
    }
  };

  return (
    <div className="container-fluid mt-4">
      <h3>Admin Registration Management</h3>

      {/* Admin Key Management */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5>Registration Keys</h5>
          <button className="btn btn-primary" onClick={() => setShowKeyForm(!showKeyForm)}>
            Generate New Key
          </button>
        </div>
        <div className="card-body">
          {showKeyForm && (
            <form onSubmit={generateAdminKey} className="mb-4 p-3 border rounded">
              <h6>Generate New Registration Key</h6>
              <div className="row g-3">
                <div className="col-md-4">
                  <input type="text" className="form-control" placeholder="Key (auto-generated if empty)" 
                         value={newKey.key} onChange={(e) => setNewKey({...newKey, key: e.target.value})} />
                </div>
                <div className="col-md-4">
                  <input type="text" className="form-control" placeholder="Description" 
                         value={newKey.description} onChange={(e) => setNewKey({...newKey, description: e.target.value})} required />
                </div>
                <div className="col-md-2">
                  <input type="date" className="form-control" 
                         value={newKey.expiryDate} onChange={(e) => setNewKey({...newKey, expiryDate: e.target.value})} />
                </div>
                <div className="col-md-2">
                  <input type="number" className="form-control" placeholder="Max Uses" min="1" 
                         value={newKey.maxUses} onChange={(e) => setNewKey({...newKey, maxUses: parseInt(e.target.value || '1')})} />
                </div>
              </div>
              <div className="mt-3">
                <button type="submit" className="btn btn-success me-2">Generate</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowKeyForm(false)}>Cancel</button>
              </div>
            </form>
          )}

          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Description</th>
                  <th>Created</th>
                  <th>Expires</th>
                  <th>Uses</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {adminKeys.map(key => (
                  <tr key={key.id}>
                    <td><code>{key.keyValue}</code></td>
                    <td>{key.description}</td>
                    <td>{key.createdDate}</td>
                    <td>{key.expiryDate || "No expiry"}</td>
                    <td>{key.usedCount}/{key.maxUses}</td>
                    <td>
                      <span className={`badge bg-${key.status === "ACTIVE" ? "success" : "danger"}`}>
                        {key.status}
                      </span>
                    </td>
                    <td>
                      {key.status === "ACTIVE" && (
                        <button className="btn btn-sm btn-danger" onClick={() => deactivateKey(key.id)}>
                          Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pending Registrations */}
      <div className="card">
        <div className="card-header">
          <h5>Pending Admin/Warden Registrations</h5>
        </div>
        <div className="card-body">
          {pendingRegistrations.length === 0 ? (
            <p className="text-muted">No pending registrations</p>
          ) : (
            <div className="row">
              {pendingRegistrations.map(registration => (
                <div key={registration.id} className="col-md-6 mb-3">
                  <div className="card">
                    <div className="card-header d-flex justify-content-between">
                      <span><strong>{registration.name}</strong></span>
                      <span className={`badge bg-${registration.role === "ADMIN" ? "primary" : "info"}`}>
                        {registration.role}
                      </span>
                    </div>
                    <div className="card-body">
                      <p><strong>Username:</strong> {registration.username}</p>
                      <p><strong>Email:</strong> {registration.email}</p>
                      <p><strong>Phone:</strong> {registration.phone}</p>
                      <p><strong>Employee ID:</strong> {registration.employeeId}</p>
                      <p><strong>Department:</strong> {registration.department}</p>
                      <p><strong>Applied:</strong> {registration.createdDate}</p>
                      
                      <div className="d-flex gap-2 mt-3">
                        <button className="btn btn-success btn-sm" onClick={() => approveRegistration(registration.id)}>
                          Approve
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => rejectRegistration(registration.id)}>
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRegistrationManagement;
