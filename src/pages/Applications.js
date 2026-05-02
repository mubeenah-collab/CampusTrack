import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import StatusTimeline from "../components/StatusTimeline";

const stages = ["pending", "test", "technical", "hr", "offer"];

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      // ✅ Get user role directly using UID
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        console.error("User document not found");
        setLoading(false);
        return;
      }

      const userData = userDoc.data();
      const role = userData.role || "student";

      let q;

      if (role === "admin") {
        setIsAdmin(true);
        q = query(collection(db, "applications"));
      } else {
        q = query(
          collection(db, "applications"),
          where("userId", "==", user.uid)
        );
      }

      const snapshot = await getDocs(q);

      const apps = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      setApplications(apps);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (app) => {
    try {
      const currentIndex = stages.indexOf(app.status);

      if (currentIndex < stages.length - 1) {
        const newStatus = stages[currentIndex + 1];

        await updateDoc(doc(db, "applications", app.id), {
          status: newStatus,
          roundsCleared: currentIndex + 1,
        });

        fetchApplications();
      } else {
        alert("Application already completed all stages!");
      }
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
        <div
          style={{
            width: 40,
            height: 40,
            border: "4px solid teal",
            borderTop: "4px solid #ccc",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>
          {`@keyframes spin {0% {transform: rotate(0deg);} 100% {transform: rotate(360deg);}}`}
        </style>
      </div>
    );
  }

  const cardStyle = {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: 320,
  };

  const buttonStyle = {
    padding: "10px",
    backgroundColor: "teal",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    marginTop: "auto",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 20,
  };

  const statusTextStyle = (status) => {
    const colors = {
      pending: "#F59E0B",
      test: "#3B82F6",
      technical: "#8B5CF6",
      hr: "#6366F1",
      offer: "#10B981",
    };

    return {
      color: colors[status] || "#555",
      fontWeight: "bold",
      textTransform: "capitalize",
    };
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ fontSize: 24, marginBottom: 20 }}>
        {isAdmin ? "All Applications" : "Your Applications"}
      </h2>

      {applications.length === 0 && (
        <p style={{ color: "#555" }}>No applications yet.</p>
      )}

      <div style={gridStyle}>
        {applications
          .filter((app) => app.companyName && app.role)
          .map((app) => (
            <div key={app.id} style={cardStyle}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: "bold" }}>
                  {app.companyName}
                </h3>

                <p>
                  <strong>Role:</strong> {app.role}
                </p>

                {isAdmin && (
                  <>
                    <p>
                      <strong>Student:</strong> {app.studentName || "N/A"}
                    </p>
                    <p>
                      <strong>Reg No:</strong> {app.regNo || "N/A"}
                    </p>
                  </>
                )}

                <p>
                  <strong>Status:</strong>{" "}
                  <span style={statusTextStyle(app.status)}>
                    {app.status}
                  </span>
                </p>

                <StatusTimeline currentStatus={app.status} />
              </div>

              {isAdmin && (
                <button
                  style={buttonStyle}
                  onClick={() => updateStatus(app)}
                >
                  Move to Next Stage
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Applications;