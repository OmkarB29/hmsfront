import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

const Profile = () => {
  const stored = JSON.parse(localStorage.getItem("user") || "null") || {};
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const [form, setForm] = useState({
    name: stored.name || stored.username || "",
    email: stored.email || "",
    phone: stored.phone || ""
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // try to load fresh profile from backend
    const fetchProfile = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/api/student/profile`, { headers });
        if (res?.data) {
          setForm({
            name: res.data.name || res.data.username || "",
            email: res.data.email || "",
            phone: res.data.phone || ""
          });
          // sync localStorage
          const merged = { ...stored, ...res.data };
          localStorage.setItem("user", JSON.stringify(merged));
        }
      } catch (err) {
        // keep local data if backend not reachable
        console.warn("Could not fetch profile:", err?.message || err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setMsg("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      // send update to backend (expects PUT)
      const res = await axios.put(`${API_BASE}/api/student/profile`, form, { headers });
      // if backend returns updated user, use it; otherwise merge local
      const updatedUser = res?.data && typeof res.data === "object" ? { ...stored, ...res.data } : { ...stored, ...form };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setMsg("Profile saved successfully.");
    } catch (err) {
      console.error("Profile save failed:", err);
      // fallback: persist locally so UI reflects change
      const updatedLocal = { ...stored, ...form };
      localStorage.setItem("user", JSON.stringify(updatedLocal));
      setMsg("Saved locally (server update failed).");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container my-4">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: 720 }}>
        <div className="card-body">
          <h4 className="card-title mb-3">My Profile</h4>

          {loading ? (
            <div className="text-center py-4">Loading profile...</div>
          ) : (
            <form onSubmit={handleSave}>
              <div className="mb-3">
                <label className="form-label">Full name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              {msg && <div className="alert alert-success py-2">{msg}</div>}

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;