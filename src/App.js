import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CompanyList from "./pages/CompanyList";
import Applications from "./pages/Applications";
import AddCompany from "./pages/AddCompany";   // ✅ ADDED
import Navbar from "./components/Navbar";

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const docSnap = await getDoc(doc(db, "users", currentUser.uid));
        if (docSnap.exists()) {
          setRole(docSnap.data().role);
        }
      } else {
        setUser(null);
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <>
      {user && <Navbar role={role} />}

      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" /> : <Register />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/companies"
          element={user ? <CompanyList /> : <Navigate to="/" />}
        />
        <Route
          path="/add-company"   // ✅ ADDED ROUTE
          element={user ? <AddCompany /> : <Navigate to="/" />}
        />
        <Route
          path="/applications"
          element={user ? <Applications /> : <Navigate to="/" />}
        />

        {/* Admin Route */}
        <Route
          path="/admin"
          element={user ? <AdminDashboard /> : <Navigate to="/" />}
        />

        {/* Catch All */}
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/"} />}
        />
      </Routes>
    </>
  );
}

export default App;