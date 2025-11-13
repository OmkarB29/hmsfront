import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const token = localStorage.getItem("token");

  const fetchComplaints = useCallback(async () => {
    const res = await axios.get("http://localhost:8080/api/complaints", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setComplaints(res.data);
  }, [token]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const updateStatus = async (id, status) => {
    await axios.put(
      `http://localhost:8080/api/complaints/${id}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchComplaints();
  };

  const deleteComplaint = async (id) => {
    await axios.delete(`http://localhost:8080/api/complaints/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchComplaints();
  };

  return (
    <div className="p-4">
      <h2>📋 Complaint Management</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th>
            <th>Student</th>
            <th>Room</th>
            <th>Issue</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.studentName}</td>
              <td>{c.roomNo}</td>
              <td>{c.issue}</td>
              <td>{c.status}</td>
              <td>
                <button onClick={() => updateStatus(c.id, "Resolved")}>✅ Resolve</button>
                <button onClick={() => deleteComplaint(c.id)}>🗑 Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComplaintManagement;
