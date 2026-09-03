import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Registration failed"
        );
      }

      setSuccess(
        "Account created successfully! Redirecting to login..."
      );

      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error(error);
      setError(
        error.message || "Unable to create account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <div style={styles.logo}>AI</div>

        <h1 style={styles.title}>
          Create Account
        </h1>

        <p style={styles.subtitle}>
          Join AI Growth & Agentic Commerce
        </p>

        <form onSubmit={handleRegister}>

          <label style={styles.label}>
            Full Name
          </label>

          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />

          <label style={styles.label}>
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <label style={styles.label}>
            Password
          </label>

          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          {error && (
            <div style={styles.error}>
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div style={styles.success}>
              ✓ {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        <p style={styles.loginText}>
          Already have an account?{" "}

          <button
            type="button"
            onClick={() => navigate("/login")}
            style={styles.link}
          >
            Login
          </button>
        </p>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f8fafc",
    padding: "30px",
    fontFamily: "Arial, sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: "430px",
    background: "#ffffff",
    padding: "40px",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 15px 40px rgba(15,23,42,0.08)",
  },

  logo: {
    width: "55px",
    height: "55px",
    borderRadius: "15px",
    background: "#6366f1",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "20px",
    marginBottom: "20px",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    color: "#0f172a",
  },

  subtitle: {
    color: "#64748b",
    marginBottom: "30px",
  },

  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "700",
    marginBottom: "8px",
    marginTop: "18px",
    color: "#334155",
  },

  input: {
    width: "100%",
    padding: "14px",
    boxSizing: "border-box",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none",
  },

  error: {
    marginTop: "18px",
    padding: "12px",
    borderRadius: "9px",
    background: "#fef2f2",
    color: "#dc2626",
    fontSize: "14px",
    fontWeight: "600",
  },

  success: {
    marginTop: "18px",
    padding: "12px",
    borderRadius: "9px",
    background: "#f0fdf4",
    color: "#16a34a",
    fontSize: "14px",
    fontWeight: "600",
  },

  button: {
    width: "100%",
    marginTop: "25px",
    padding: "15px",
    border: "none",
    borderRadius: "10px",
    background: "#6366f1",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer",
  },

  loginText: {
    textAlign: "center",
    color: "#64748b",
    marginTop: "25px",
  },

  link: {
    border: "none",
    background: "transparent",
    color: "#6366f1",
    fontWeight: "800",
    cursor: "pointer",
  },
};

export default Register;