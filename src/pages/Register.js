import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState("");
  const [batch, setBatch] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        branch,
        batch,
        uid: user.uid,
        role: "student",
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>
          Start tracking your placement journey!
        </p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleRegister} style={styles.form}>
          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          {/* ✅ FIXED PASSWORD FIELD */}
          <div style={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.passwordInput}
              required
              minLength={6}
            />
            <span
              style={styles.showBtn}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <input
            placeholder="Branch (e.g., CSE)"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="number"
            placeholder="Batch (e.g., 2026)"
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            style={styles.input}
            required
          />

          <button
            type="submit"
            style={{
              ...styles.button,
              background: loading
                ? "#888"
                : "linear-gradient(90deg,#0f766e,#1e3a8a)",
            }}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#eae2eb",
    fontFamily: "Inter, sans-serif",
  },
  card: {
    background: "white",
    padding: "45px",
    borderRadius: "16px",
    width: "420px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
    textAlign: "center",
  },
  title: {
    marginBottom: "5px",
    fontSize: "24px",
    fontWeight: "600",
  },
  subtitle: {
    marginBottom: "20px",
    color: "#666",
    fontSize: "14px",
  },
  error: {
    color: "red",
    fontSize: "13px",
    marginBottom: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  passwordWrapper: {
    position: "relative",
    width: "100%",
  },
  passwordInput: {
    width: "100%",
    padding: "12px 60px 12px 12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  showBtn: {
    position: "absolute",
    right: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "13px",
    cursor: "pointer",
    color: "#0f766e",
    fontWeight: "600",
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
  },
  footerText: {
    marginTop: "20px",
    fontSize: "14px",
  },
  link: {
    color: "#0f766e",
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default Register;