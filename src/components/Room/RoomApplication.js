import React, { useState, useEffect } from "react";
import axios from "axios";

const RoomApplication = ({ studentId, onClose }) => {
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [preferences, setPreferences] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAvailableRooms();
  }, []);

  const fetchAvailableRooms = async () => {
    try {
      const response = await axios.get("/api/rooms/available");
      setAvailableRooms(response.data);
    } catch (error) {
      setStatus("Error fetching available rooms");
    }
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus("");
    try {
      await axios.post(`/api/students/${studentId}/apply-room`, {
        roomId: selectedRoom,
        preferences
      });
      setStatus("Room application submitted successfully!");
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      setStatus("Error submitting application");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.3)'}}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5>Apply for Room</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={submitApplication}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Select Room</label>
                <select className="form-select" value={selectedRoom} onChange={e => setSelectedRoom(e.target.value)} required>
                  <option value="">Choose a room</option>
                  {availableRooms.map(room => (
                    <option key={room.id} value={room.id}>
                      {room.roomNumber} — Floor {room.floor} — {room.type} (Capacity: {room.capacity})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Special Preferences (Optional)</label>
                <textarea className="form-control" value={preferences} 
                         onChange={e => setPreferences(e.target.value)} 
                         placeholder="Any special requirements or preferences..." />
              </div>
              {status && <div className={`alert alert-${status.includes("success") ? "success" : "danger"}`}>{status}</div>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoomApplication;
