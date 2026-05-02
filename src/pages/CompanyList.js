import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  deleteDoc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../firebase";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdmin = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists() && userDoc.data().role === "admin") {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error("Admin check failed:", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      setLoading(true);

      const snapshot = await getDocs(collection(db, "companies"));

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (auth.currentUser) {
      checkAdmin();
      fetchCompanies();
    }
  }, []);

  // ✅ FIXED APPLY FUNCTION
  const applyToCompany = async (company) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        alert("Please login first");
        return;
      }

      setApplyingId(company.id);

      // Get student profile
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        alert("User profile not found");
        return;
      }

      const userData = userDoc.data();

      // Prevent undefined values
      const studentName = userData?.name || "Student";
      const regNo = userData?.regNo || "N/A";

      // ✅ Prevent duplicate applications
      const q = query(
        collection(db, "applications"),
        where("userId", "==", user.uid),
        where("companyId", "==", company.id)
      );

      const existing = await getDocs(q);

      if (!existing.empty) {
        alert("You already applied to this company!");
        setApplyingId(null);
        return;
      }

      // Save application
      await addDoc(collection(db, "applications"), {
        userId: user.uid,
        studentName: studentName,
        regNo: regNo,

        companyId: company.id,
        companyName: company.companyName || "Unknown",
        role: company.role || "N/A",
        package: company.package || "N/A",

        status: "pending",
        roundsCleared: 0,
        appliedOn: serverTimestamp(),
      });

      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Application error:", error);
      alert("Application failed");
    }

    setApplyingId(null);
  };

  const deleteCompany = async (id) => {
    try {
      await deleteDoc(doc(db, "companies", id));
      alert("Company deleted!");
      fetchCompanies();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.loader}></div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Company Drives</h2>

      <div style={styles.grid}>
        {companies.map((company) => (
          <div key={company.id} style={styles.card}>
            <h3 style={styles.companyName}>{company.companyName}</h3>

            <p><strong>Role:</strong> {company.role}</p>
            <p><strong>Package:</strong> {company.package}</p>
            <p><strong>Date:</strong> {company.driveDate}</p>
            <p><strong>Location:</strong> {company.location}</p>

            {!isAdmin ? (
              <button
                onClick={() => applyToCompany(company)}
                disabled={applyingId === company.id}
                style={styles.applyBtn}
              >
                {applyingId === company.id ? "Applying..." : "Apply"}
              </button>
            ) : (
              <button
                onClick={() => deleteCompany(company.id)}
                style={styles.deleteBtn}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
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
    fontSize: "26px",
    marginBottom: "30px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "25px",
  },

  card: {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "14px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
    borderLeft: "6px solid #0f766e",
  },

  companyName: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "12px",
  },

  applyBtn: {
    marginTop: "15px",
    padding: "8px 16px",
    backgroundColor: "#0f766e",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  deleteBtn: {
    marginTop: "15px",
    padding: "8px 16px",
    backgroundColor: "red",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  loaderContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: 80,
  },

  loader: {
    width: 40,
    height: 40,
    border: "4px solid #0f766e",
    borderTop: "4px solid #ccc",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

export default CompanyList;