import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);

  const updateCartCount = () => {
    const savedCart = localStorage.getItem("cart");
    const cart = savedCart ? JSON.parse(savedCart) : [];

    const count = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );

    setCartCount(count);
  };

  const updateUser = () => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Invalid user data");
        localStorage.removeItem("user");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    updateCartCount();
    updateUser();
  }, [location]);

  useEffect(() => {
    const handleStorageChange = () => {
      updateCartCount();
      updateUser();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");

    setUser(null);

    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav style={styles.navbar}>
      {/* Logo */}
      <Link to="/" style={styles.logo}>
        🤖 AI Commerce
      </Link>

      {/* Navigation */}
      <div style={styles.links}>

        <Link
          to="/"
          style={{
            ...styles.link,
            ...(isActive("/") ? styles.activeLink : {}),
          }}
        >
          Home
        </Link>

        <Link
          to="/products"
          style={{
            ...styles.link,
            ...(isActive("/products")
              ? styles.activeLink
              : {}),
          }}
        >
          Products
        </Link>

        <Link
          to="/dashboard"
          style={{
            ...styles.link,
            ...(isActive("/dashboard")
              ? styles.activeLink
              : {}),
          }}
        >
          Dashboard
        </Link>

        {/* User is NOT logged in */}
        {!user ? (
          <>
            <Link
              to="/login"
              style={{
                ...styles.link,
                ...(isActive("/login")
                  ? styles.activeLink
                  : {}),
              }}
            >
              Login
            </Link>

            <Link
              to="/register"
              style={styles.registerButton}
            >
              Register
            </Link>
          </>
        ) : (
          <>
            {/* Logged-in user */}
            <span style={styles.userName}>
              👤 {user.name}
            </span>

            <button
              onClick={handleLogout}
              style={styles.logoutButton}
            >
              Logout
            </button>
          </>
        )}

        {/* Cart */}
        <Link
          to="/cart"
          style={styles.cartButton}
        >
          🛒 Cart

          {cartCount > 0 && (
            <span style={styles.cartBadge}>
              {cartCount}
            </span>
          )}
        </Link>

      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    minHeight: "70px",
    padding: "0 6%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },

  logo: {
    textDecoration: "none",
    color: "#0f172a",
    fontSize: "21px",
    fontWeight: "900",
  },

  links: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  link: {
    textDecoration: "none",
    color: "#475569",
    fontSize: "14px",
    fontWeight: "700",
    padding: "8px 4px",
  },

  activeLink: {
    color: "#6366f1",
  },

  registerButton: {
    textDecoration: "none",
    padding: "10px 16px",
    borderRadius: "9px",
    background: "#6366f1",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "800",
  },

  userName: {
    color: "#334155",
    fontSize: "14px",
    fontWeight: "700",
    padding: "8px 4px",
  },

  logoutButton: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "9px",
    background: "#fee2e2",
    color: "#dc2626",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
  },

  cartButton: {
    position: "relative",
    textDecoration: "none",
    padding: "10px 15px",
    borderRadius: "9px",
    background: "#f1f5f9",
    color: "#0f172a",
    fontSize: "14px",
    fontWeight: "800",
  },

  cartBadge: {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    minWidth: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "#ef4444",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "800",
  },
};

export default Navbar;