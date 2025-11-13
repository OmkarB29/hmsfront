import React, { useEffect, useState } from "react";
import axios from "axios";

const NoticeManagement = () => {
  const [notices, setNotices] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const fetchNotices = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/notices", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotices(res.data);
    } catch (err) {
      console.error("Error fetching notices:", err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8080/api/admin/notices",
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("");
      fetchNotices();
    } catch (err) {
      console.error("Error adding notice:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/notices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotices();
    } catch (err) {
      console.error("Error deleting notice:", err);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Manage Notices</h2>
      <form onSubmit={handleAdd} style={{ maxWidth: 500 }}>
        <textarea
          className="form-control mb-2"
          rows="3"
          placeholder="Enter notice message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        ></textarea>
        <button className="btn btn-primary">Add Notice</button>
      </form>

      <ul className="list-group mt-3">
        {notices.map((n) => (
          <li
            key={n.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {n.message}
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDelete(n.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NoticeManagement;
