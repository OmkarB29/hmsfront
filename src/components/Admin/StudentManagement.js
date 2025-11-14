import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    roomNumber: "",
    department: ""
  });
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchStudents = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:8080/api/students/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditingId(null);
      } else {
        await axios.post("http://localhost:8080/api/students", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setFormData({ name: "", rollNumber: "", roomNumber: "", department: "" });
      fetchStudents();
    } catch (err) {
      console.error("Error saving student:", err);
    }
  };

  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      rollNumber: student.rollNumber,
      roomNumber: student.roomNumber,
      department: student.department,
    });
    setEditingId(student.id);
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStudents();
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  };

  const deleteAllStudents = async () => {
    if (!window.confirm("⚠️ Are you sure you want to delete ALL students? This action cannot be undone!")) {
      return;
    }
    if (!window.confirm("🚨 FINAL WARNING: This will permanently delete ALL student records. Type 'DELETE' to confirm.")) {
      return;
    }
    try {
      for (const student of students) {
        await axios.delete(`http://localhost:8080/api/students/${student.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      alert("✅ All students have been deleted!");
      fetchStudents();
    } catch (err) {
      console.error("Error deleting all students:", err);
      alert("❌ Error deleting students. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <h2>👨‍🎓 Student Management</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="text" name="rollNumber" placeholder="Roll No." value={formData.rollNumber} onChange={handleChange} required />
        <input type="text" name="roomNumber" placeholder="Room No." value={formData.roomNumber} onChange={handleChange} required />
        <input type="text" name="department" placeholder="Department" value={formData.department} onChange={handleChange} required />
        <button type="submit">{editingId ? "Update Student" : "Add Student"}</button>
      </form>

      <div style={{ marginBottom: "1rem" }}>
        <button 
          onClick={deleteAllStudents} 
          style={{ 
            backgroundColor: "#dc3545", 
            color: "white", 
            padding: "0.5rem 1rem", 
            border: "none", 
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.95rem"
          }}
        >
          🗑️ Delete All Students
        </button>
      </div>

      <table border="1" cellPadding="8" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Roll No</th>
            <th>Room No</th>
            <th>Department</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((st) => (
            <tr key={st.id}>
              <td>{st.id}</td>
              <td>{st.name}</td>
              <td>{st.rollNumber}</td>
              <td>{st.roomNumber}</td>
              <td>{st.department}</td>
              <td>
                <button onClick={() => handleEdit(st)}>✏️ Edit</button>
                <button onClick={() => deleteStudent(st.id)}>❌ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentManagement;
