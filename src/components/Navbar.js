import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const Navbar = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchRole = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRole(docSnap.data().role);
        }
      }
    };
    fetchRole();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
    padding: "8px 12px",
    borderRadius: 5,
    transition: "0.3s",
  };

  const linkHoverColor = "rgba(255,255,255,0.2)";

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 30px",
        background: "teal",
        color: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        borderRadius: "0 0 10px 10px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Brand */}
      <div style={{ fontSize: 22, fontWeight: "bold", letterSpacing: 1.5 }}>
        <Link
          to={role === "admin" ? "/admin" : "/dashboard"}
          style={{ color: "white", textDecoration: "none" }}
        >
          CampusTrack
        </Link>
      </div>

      {/* Navigation Links */}
      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <Link
          to={role === "admin" ? "/admin" : "/dashboard"}
          style={linkStyle}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = linkHoverColor)
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = "transparent")
          }
        >
          Dashboard
        </Link>

        <Link
          to="/companies"
          style={linkStyle}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = linkHoverColor)
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = "transparent")
          }
        >
          Companies
        </Link>

        <Link
          to="/applications"
          style={linkStyle}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = linkHoverColor)
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = "transparent")
          }
        >
          Applications
        </Link>

        {role === "admin" && (
          <Link
            to="/add-company"
            style={linkStyle}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = linkHoverColor)
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            Add Company
          </Link>
        )}

        <button
          onClick={handleLogout}
          style={{
            padding: "6px 14px",
            background: "transparent",
            border: "2px solid white",
            borderRadius: 5,
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "white";
            e.target.style.color = "teal";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "white";
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;