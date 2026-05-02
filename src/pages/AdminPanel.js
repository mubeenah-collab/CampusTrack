import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const AdminPanel = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const querySnapshot = await getDocs(collection(db, "applications"));

      const apps = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      setApplications(apps);
    };

    fetchApplications();
  }, []);

  const updateStatus = async (id, newStatus) => {
    const appRef = doc(db, "applications", id);

    await updateDoc(appRef, {
      status: newStatus.toLowerCase(),
    });

    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: newStatus.toLowerCase() } : app
      )
    );
  };

  return (
    <div style={{ padding: "40px", background: "#f4f6f9", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: "30px" }}>Admin Panel - Manage Applications</h2>

      {applications.length === 0 && (
        <p style={{ color: "#555" }}>No applications found.</p>
      )}

      {applications.map((app) => (
        <div
          key={app.id}
          style={{
            background: "white",
            padding: "20px",
            marginBottom: "15px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            borderLeft: "5px solid teal",
          }}
        >
          <p>
            <strong>Student:</strong> {app.studentName || "N/A"}
          </p>

          <p>
            <strong>Reg No:</strong> {app.regNo || "N/A"}
          </p>

          <p>
            <strong>Company:</strong> {app.companyName}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            <span style={{ fontWeight: "bold", textTransform: "capitalize" }}>
              {app.status}
            </span>
          </p>

          <select
            value={app.status?.toLowerCase() || "pending"}
            onChange={(e) => updateStatus(app.id, e.target.value)}
            style={{
              padding: "8px",
              marginTop: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            <option value="pending">Pending</option>
            <option value="test">Test</option>
            <option value="technical">Technical</option>
            <option value="hr">HR</option>
            <option value="offer">Offer</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;