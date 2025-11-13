import React, { useState } from "react";
import axios from "axios";

const ComplaintForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post("/api/complaints", { title, description });
      setStatus("Complaint submitted!");
      setTitle(""); setDescription("");
    } catch {
      setStatus("Failed to submit complaint.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <input className="form-control mb-2" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
      <textarea className="form-control mb-2" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required />
      <button className="btn btn-primary">Submit Complaint</button>
      {status && <div>{status}</div>}
    </form>
  );
};

export default ComplaintForm;
