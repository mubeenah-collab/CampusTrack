import React, { useState } from "react";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const AddCompany = () => {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [pkg, setPkg] = useState("");
  const [driveDate, setDriveDate] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      const user = auth.currentUser;

      if (!user) {
        setSuccess("You must be logged in ❌");
        setLoading(false);
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists() || userDoc.data().role !== "admin") {
        setSuccess("Only admin can add company ❌");
        setLoading(false);
        return;
      }

      await addDoc(collection(db, "companies"), {
        companyName,
        role,
        package: pkg,
        driveDate,
        location,
        createdAt: new Date(),
      });

      setSuccess("Company added successfully 🎉");

      setCompanyName("");
      setRole("");
      setPkg("");
      setDriveDate("");
      setLocation("");

      setTimeout(() => {
        navigate("/companies");
      }, 1000);

    } catch (error) {
      console.error("Error adding company:", error);
      setSuccess("Error adding company ❌");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Add New Company</h2>

        {success && <p style={styles.message}>{success}</p>}

        <form onSubmit={handleAdd} style={styles.form}>
          <div style={styles.grid}>
            <input
              type="text"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              style={styles.input}
            />

            <input
              type="text"
              placeholder="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              style={styles.input}
            />

            <input
              type="text"
              placeholder="Package (e.g. 6 LPA)"
              value={pkg}
              onChange={(e) => setPkg(e.target.value)}
              required
              style={styles.input}
            />

            <input
              type="date"
              value={driveDate}
              onChange={(e) => setDriveDate(e.target.value)}
              required
              style={styles.input}
            />

            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              background: loading
                ? "#888"
                : "linear-gradient(90deg,#0f766e,#1e3a8a)",
            }}
          >
            {loading ? "Adding..." : "Add Company"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "92vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f1f5f9", // soft dashboard background
    padding: "40px",
  },
  card: {
    background: "white",
    padding: "60px",
    width: "1000px",
    maxWidth: "95%",
    borderRadius: "20px",
    boxShadow: "0 30px 60px rgba(0,0,0,0.12)",
    borderLeft: "8px solid #0f766e", // 🔥 green left border
  },
  title: {
    marginBottom: "30px",
    fontSize: "26px",
    fontWeight: "700",
    color: "#1e293b",
  },
  message: {
    marginBottom: "20px",
    fontSize: "15px",
    color: "#0f766e",
    fontWeight: "500",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "25px",
  },
  input: {
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "15px",
    outline: "none",
  },
  button: {
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    color: "white",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default AddCompany;