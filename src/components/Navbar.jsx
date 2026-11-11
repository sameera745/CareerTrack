
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = () => {
      const savedUser = localStorage.getItem("user");

      try {
        setUser(savedUser ? JSON.parse(savedUser) : null);
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("authChange"));

    navigate("/login");
  };

  const linkStyle = ({ isActive }) => ({
    color: isActive ? "#2563eb" : "#6b7280",
    fontWeight: isActive ? "600" : "500",
    textDecoration: "none",
  });

  return (
    <nav
      style={{
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        padding: "0 32px",
        minHeight: "70px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
      }}
    >
      <h2
        style={{
          margin: 0,
          color: "#2563eb",
          fontSize: "21px",
        }}
      >
        CareerTrack
      </h2>

      <div
        style={{
          display: "flex",
          gap: "24px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {user ? (
          <>
            <NavLink to="/" style={linkStyle}>
              Applications
            </NavLink>

            <NavLink to="/status" style={linkStyle}>
              Status
            </NavLink>

            <NavLink to="/certificates" style={linkStyle}>
              Certificates
            </NavLink>

            <span style={{ color: "#374151" }}>
              Hi, {user.name}
            </span>

            <button
              onClick={handleLogout}
              className="primary-button"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" style={linkStyle}>
              Login
            </NavLink>

            <NavLink to="/register" style={linkStyle}>
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
