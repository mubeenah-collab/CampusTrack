import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchApplications = async (user) => {
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (userDoc.exists() && userDoc.data().role === "admin") {
      setIsAdmin(true);

      // Admin sees all applications
      const snapshot = await getDocs(collection(db, "applications"));
      const apps = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setApplications(apps);
      setLoading(false);
    } else {
      // Student sees only their applications
      const q = query(
        collection(db, "applications"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);
      const apps = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setApplications(apps);
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) fetchApplications(user);
      else setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <h3>Loading...</h3>
      </div>
    );

  return (
    <div style={{ padding: 30, background: "#f4f6f8", minHeight: "100vh" }}>
      <h2 style={{ fontSize: 28, fontWeight: "bold", marginBottom: 25 }}>
        {isAdmin ? "Admin Dashboard" : "Student Dashboard"}
      </h2>

      {applications.map((app) => (
        <div
          key={app.id}
          style={{
            background: "#ffffff",
            padding: 20,
            marginBottom: 15,
            borderRadius: 10,
            boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
          }}
        >
          <h4>{app.companyName}</h4>
          <p>Status: {app.status}</p>
          <p>Package: {app.package}</p>
          {isAdmin && <p>Student ID: {app.userId}</p>}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;