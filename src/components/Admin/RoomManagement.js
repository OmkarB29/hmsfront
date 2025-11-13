import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [roomNo, setRoomNo] = useState("");
  const [capacity, setCapacity] = useState("");
  const token = localStorage.getItem("token");

  const fetchRooms = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/rooms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(res.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8080/api/admin/rooms",
        { roomNo, capacity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRoomNo("");
      setCapacity("");
      fetchRooms();
    } catch (err) {
      console.error("Error adding room:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/rooms/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRooms();
    } catch (err) {
      console.error("Error deleting room:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Allocate / Deallocate Rooms</h2>

      <form onSubmit={handleAdd} className="mb-3" style={{ maxWidth: 500 }}>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Room No"
          value={roomNo}
          onChange={(e) => setRoomNo(e.target.value)}
          required
        />
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          required
        />
        <button className="btn btn-primary">Add Room</button>
      </form>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Room No</th>
            <th>Capacity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.roomNo}</td>
              <td>{r.capacity}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(r.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomManagement;
