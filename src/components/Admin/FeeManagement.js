import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const FeeManagement = () => {
  const [fees, setFees] = useState([]);
  const [formData, setFormData] = useState({
    studentName: "",
    amount: "",
    status: "UNPAID",
  });

  const token = localStorage.getItem("token");

  // Fetch all fees on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/fees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFees(res.data);
    } catch (err) {
      console.error("Error fetching fees:", err);
    }
  };

  // Add Fee
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/admin/fees", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({ studentName: "", amount: "", status: "UNPAID" });
      fetchFees();
    } catch (err) {
      console.error("Error adding fee:", err);
    }
  };

  // Delete Fee
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/fees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFees();
    } catch (err) {
      console.error("Error deleting fee:", err);
    }
  };

  // Calculate summary for chart
  const paidCount = fees.filter((f) => f.status === "PAID").length;
  const unpaidCount = fees.filter((f) => f.status === "UNPAID").length;

  const chartData = [
    { name: "PAID", value: paidCount },
    { name: "UNPAID", value: unpaidCount },
  ];
  const COLORS = ["#4CAF50", "#F44336"];

  // Export as PDF
  const generatePDF = () => {
  const doc = new jsPDF();
  doc.text("Fee Management Report", 14, 15);

  const tableData = fees.map((f) => [
    f.id,
    f.studentName,
    f.amount,
    f.status,
  ]);

  autoTable(doc, {
    startY: 25,
    head: [["ID", "Student Name", "Amount", "Status"]],
    body: tableData,
  });

  doc.save("fee-report.pdf");
};


  return (
    <div className="container mt-4">
      <h2>💰 Fee Management</h2>

      {/* Fee Form */}
      <form onSubmit={handleAdd} className="mb-4" style={{ maxWidth: 500 }}>
        <input
          type="text"
          className="form-control mb-2"
          name="studentName"
          placeholder="Student Name"
          value={formData.studentName}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          required
        />
        <input
          type="number"
          className="form-control mb-2"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          required
        />
        <select
          className="form-control mb-2"
          name="status"
          value={formData.status}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
        >
          <option value="PAID">PAID</option>
          <option value="UNPAID">UNPAID</option>
        </select>
        <button className="btn btn-success w-100">Add Fee</button>
      </form>

      {/* Chart Section */}
      <div className="mb-4">
        <h5>📊 Fee Summary</h5>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Table Section */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5>🧾 Fee Records</h5>
        <button className="btn btn-outline-primary" onClick={generatePDF}>
          Export as PDF
        </button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Student</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {fees.map((f) => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td>{f.studentName}</td>
              <td>{f.amount}</td>
              <td>{f.status}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(f.id)}
                >
                  Delete
                </button>
                {f.status === "UNPAID" && (
                  <button
                    className="btn btn-success btn-sm ms-2"
                    onClick={async () => {
                      await axios.post(
                        "http://localhost:8080/api/admin/fees",
                        { ...f, status: "PAID" },
                        { headers: { Authorization: `Bearer ${token}` } }
                      );
                      fetchFees();
                    }}
                  >
                    Mark Paid
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeeManagement;
