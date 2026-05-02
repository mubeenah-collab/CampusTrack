import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const AdminDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [selectedCount, setSelectedCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const companySnapshot = await getDocs(collection(db, "companies"));
      setCompanies(companySnapshot.docs.map((doc) => doc.data()));

      const appSnapshot = await getDocs(collection(db, "applications"));

      // 🔥 Remove empty / invalid applications
      const appData = appSnapshot.docs
        .map((doc) => doc.data())
        .filter((a) => a.companyName && a.regNo);

      setApplications(appData);

      setPendingCount(
        appData.filter((a) => a.status?.toLowerCase() === "pending").length
      );

      setSelectedCount(
        appData.filter((a) => a.status?.toLowerCase() === "selected").length
      );
    };

    fetchData();
  }, []);

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Admin Dashboard</h2>

      {/* Stats Section */}
      <div style={styles.statsRow}>
        <div style={styles.statBox}>
          <h4 style={styles.statTitle}>Total Companies</h4>
          <p style={styles.count}>{companies.length}</p>
        </div>

        <div style={styles.statBox}>
          <h4 style={styles.statTitle}>Total Students Applied</h4>
          <p style={styles.count}>{applications.length}</p>
        </div>

        <div style={styles.statBox}>
          <h4 style={styles.statTitle}>Pending Applications</h4>
          <p style={styles.count}>{pendingCount}</p>
        </div>

        <div style={styles.statBox}>
          <h4 style={styles.statTitle}>Selected Students</h4>
          <p style={styles.count}>{selectedCount}</p>
        </div>
      </div>

      {/* Applications List */}
      <h3 style={{ marginTop: 40 }}>Applications</h3>

      {applications.map((app, index) => (
        <div key={index} style={styles.card}>
          <h3>{app.companyName}</h3>

          <p>
            <strong>Status:</strong> {app.status}
          </p>

          <p>
            <strong>Package:</strong> {app.package}
          </p>

          {/* ✅ Changed Student ID → Reg No */}
          <p>
            <strong>Reg No:</strong> {app.regNo}
          </p>
        </div>
      ))}
    </div>
  );
};

const styles = {
  page: {
    background: "#f4f6f9",
    minHeight: "100vh",
    padding: "40px",
  },

  heading: {
    marginBottom: "30px",
    fontSize: "28px",
  },

  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "25px",
    width: "100%",
  },

  statBox: {
    background: "#ffffff",
    padding: "35px",
    borderRadius: "14px",
    textAlign: "center",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
    borderLeft: "8px solid #0f766e",
  },

  statTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "12px",
  },

  count: {
    fontSize: "34px",
    fontWeight: "bold",
    marginTop: "10px",
    color: "#0f766e",
  },

  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    marginTop: "20px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
  },
};

export default AdminDashboard;