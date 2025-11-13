import React, { useState, useEffect } from "react";
import axios from "axios";

function ComplaintForm() {
  const [complaints, setComplaints] = useState([]);
  const [formData, setFormData] = useState({
    studentName: "",
    roomNumber: "",
    message: ""
  });

  const token = localStorage.getItem("token");

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/student/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(res.data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/student/complaints", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Complaint submitted!");
      setFormData({ studentName: "", roomNumber: "", message: "" });
      fetchComplaints();
    } catch (err) {
      console.error("Error submitting complaint:", err);
    }
  };

  return (
    <div className="p-4">
      <h2>🗣 Submit a Complaint</h2>
      <form onSubmit={handleSubmit} className="mb-3">
        <input
          type="text"
          name="studentName"
          placeholder="Your Name"
          value={formData.studentName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="roomNumber"
          placeholder="Room No"
          value={formData.roomNumber}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Describe your issue"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit">Submit</button>
      </form>

      <h3>📋 Your Complaints</h3>
      <table border="1" cellPadding="8" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Room No</th>
            <th>Complaint</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.roomNumber}</td>
              <td>{c.message}</td>
              <td>{c.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ComplaintForm;
