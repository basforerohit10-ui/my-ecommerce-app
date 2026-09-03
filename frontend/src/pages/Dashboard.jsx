import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getUser = () => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  };

  const user = getUser();

  // Protect Dashboard
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, []);

  // Load orders
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://127.0.0.1:8000/orders/"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();

        setOrders(data.orders || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (sum, order) =>
      sum + Number(order.total_amount || 0),
    0
  );

  const pendingOrders = orders.filter(
    (order) =>
      String(order.status || "pending").toLowerCase() ===
      "pending"
  ).length;

  const completedOrders = orders.filter(
    (order) =>
      String(order.status || "").toLowerCase() ===
      "completed"
  ).length;

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.loader}>🤖</div>
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.center}>
        <h2>{error}</h2>

        <button
          style={styles.primaryButton}
          onClick={handleRefresh}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.badge}>
            ✨ AI Commerce
          </div>

          <h1 style={styles.title}>
            AI Commerce Dashboard
          </h1>

          <p style={styles.subtitle}>
            Welcome back, <strong>{user.name}</strong> 👋
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={styles.logoutButton}
        >
          Logout
        </button>
      </div>

      <p style={styles.description}>
        Monitor your business growth and commerce
        performance from one place.
      </p>

      {/* Quick Actions */}
      <div style={styles.quickActions}>
        <button
          style={styles.actionButton}
          onClick={() => navigate("/products")}
        >
          🛍️ Browse Products
        </button>

        <button
          style={styles.actionButton}
          onClick={() => navigate("/cart")}
        >
          🛒 View Cart
        </button>

        <button
          style={styles.actionButton}
          onClick={handleRefresh}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Statistics */}
      <div style={styles.statsGrid}>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>📦</div>

          <p style={styles.statTitle}>
            Total Orders
          </p>

          <h2 style={styles.statValue}>
            {totalOrders}
          </h2>

          <span style={styles.statText}>
            All orders
          </span>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>💰</div>

          <p style={styles.statTitle}>
            Total Revenue
          </p>

          <h2 style={styles.statValue}>
            ₹{totalRevenue.toLocaleString("en-IN")}
          </h2>

          <span style={styles.statText}>
            Order revenue
          </span>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>⏳</div>

          <p style={styles.statTitle}>
            Pending Orders
          </p>

          <h2 style={styles.statValue}>
            {pendingOrders}
          </h2>

          <span style={styles.statText}>
            Need attention
          </span>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>✅</div>

          <p style={styles.statTitle}>
            Completed Orders
          </p>

          <h2 style={styles.statValue}>
            {completedOrders}
          </h2>

          <span style={styles.statText}>
            Successfully completed
          </span>
        </div>

      </div>

      {/* Recent Orders */}
      <div style={styles.section}>

        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>
              Recent Orders
            </h2>

            <p style={styles.sectionSubtitle}>
              Latest customer orders
            </p>
          </div>

          <button
            style={styles.secondaryButton}
            onClick={handleRefresh}
          >
            🔄 Refresh
          </button>
        </div>

        {orders.length === 0 ? (
          <div style={styles.empty}>

            <div style={styles.emptyIcon}>
              📦
            </div>

            <h3>No orders found</h3>

            <p>
              Orders will appear here after customers
              place them.
            </p>

            <button
              style={styles.primaryButton}
              onClick={() => navigate("/products")}
            >
              Start Shopping
            </button>

          </div>
        ) : (
          <div style={styles.ordersContainer}>

            {orders.map((order) => (
              <div
                key={order.id}
                style={styles.orderCard}
              >

                <div style={styles.orderLeft}>

                  <h3 style={styles.orderTitle}>
                    Order #{order.id}
                  </h3>

                  <p style={styles.customer}>
                    Customer:{" "}
                    <strong>
                      {order.customer_name ||
                        user.name ||
                        "Customer"}
                    </strong>
                  </p>

                  <p style={styles.orderAmount}>
                    ₹
                    {Number(
                      order.total_amount || 0
                    ).toLocaleString("en-IN")}
                  </p>

                </div>

                <div style={styles.orderRight}>

                  <span
                    style={{
                      ...styles.status,
                      ...(String(
                        order.status || "pending"
                      ).toLowerCase() === "completed"
                        ? styles.completed
                        : styles.pending),
                    }}
                  >
                    {order.status || "Pending"}
                  </span>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* User Information */}
      <div style={styles.userSection}>

        <div style={styles.userIcon}>
          👤
        </div>

        <div>
          <h2 style={styles.userTitle}>
            Account Information
          </h2>

          <p style={styles.userText}>
            <strong>Name:</strong> {user.name}
          </p>

          <p style={styles.userText}>
            <strong>Email:</strong> {user.email}
          </p>
        </div>

      </div>

      {/* AI Insights */}
      <div style={styles.aiSection}>

        <div style={styles.aiIcon}>
          AI
        </div>

        <div>
          <h2 style={styles.aiTitle}>
            AI Growth Insights
          </h2>

          <p style={styles.aiText}>
            Your sales performance, product activity
            and customer engagement can be analyzed
            by the AI Growth Agent.
          </p>
        </div>

      </div>

    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    padding: "40px 30px 70px",
    fontFamily: "Inter, Arial, Helvetica, sans-serif",
    boxSizing: "border-box",
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#f8fafc",
    fontFamily: "Arial, sans-serif",
  },

  loader: {
    fontSize: "45px",
    marginBottom: "10px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },

  badge: {
    display: "inline-block",
    padding: "7px 12px",
    borderRadius: "20px",
    background: "#eef2ff",
    color: "#6366f1",
    fontSize: "12px",
    fontWeight: "800",
    marginBottom: "10px",
  },

  title: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "800",
    color: "#0f172a",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#64748b",
    fontSize: "16px",
  },

  description: {
    maxWidth: "1200px",
    margin: "10px auto 20px",
    color: "#64748b",
    fontSize: "15px",
  },

  logoutButton: {
    padding: "11px 20px",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#dc2626",
    fontWeight: "700",
    cursor: "pointer",
  },

  quickActions: {
    maxWidth: "1200px",
    margin: "0 auto 25px",
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  actionButton: {
    padding: "11px 16px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#334155",
    fontWeight: "700",
    cursor: "pointer",
  },

  statsGrid: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },

  statCard: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 8px 25px rgba(15, 23, 42, 0.05)",
  },

  statIcon: {
    fontSize: "25px",
    marginBottom: "10px",
  },

  statTitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "700",
  },

  statValue: {
    margin: "12px 0 6px",
    fontSize: "28px",
    color: "#0f172a",
  },

  statText: {
    color: "#94a3b8",
    fontSize: "13px",
  },

  section: {
    maxWidth: "1200px",
    margin: "35px auto 0",
    background: "#ffffff",
    borderRadius: "18px",
    border: "1px solid #e2e8f0",
    padding: "28px",
    boxSizing: "border-box",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "20px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "22px",
    color: "#0f172a",
  },

  sectionSubtitle: {
    margin: "5px 0 0",
    color: "#94a3b8",
    fontSize: "14px",
  },

  secondaryButton: {
    padding: "10px 16px",
    border: "1px solid #cbd5e1",
    borderRadius: "9px",
    background: "#ffffff",
    cursor: "pointer",
    fontWeight: "600",
  },

  ordersContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  orderCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    padding: "18px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
  },

  orderLeft: {
    flex: 1,
  },

  orderTitle: {
    margin: 0,
    fontSize: "16px",
    color: "#0f172a",
  },

  customer: {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },

  orderAmount: {
    margin: "8px 0 0",
    fontWeight: "800",
    color: "#0f172a",
  },

  orderRight: {
    display: "flex",
    alignItems: "center",
  },

  status: {
    padding: "7px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "800",
  },

  pending: {
    background: "#fff7ed",
    color: "#c2410c",
  },

  completed: {
    background: "#f0fdf4",
    color: "#15803d",
  },

  empty: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#64748b",
  },

  emptyIcon: {
    fontSize: "45px",
  },

  userSection: {
    maxWidth: "1200px",
    margin: "25px auto 0",
    padding: "25px",
    borderRadius: "18px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    gap: "18px",
    boxSizing: "border-box",
  },

  userIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "14px",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
  },

  userTitle: {
    margin: "0 0 8px",
    color: "#0f172a",
    fontSize: "19px",
  },

  userText: {
    margin: "4px 0",
    color: "#64748b",
    fontSize: "14px",
  },

  aiSection: {
    maxWidth: "1200px",
    margin: "25px auto 0",
    padding: "25px",
    borderRadius: "18px",
    background: "#eef2ff",
    border: "1px solid #c7d2fe",
    display: "flex",
    alignItems: "flex-start",
    gap: "18px",
    boxSizing: "border-box",
  },

  aiIcon: {
    width: "48px",
    height: "48px",
    minWidth: "48px",
    borderRadius: "13px",
    background: "#6366f1",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },

  aiTitle: {
    margin: "0 0 7px",
    color: "#312e81",
    fontSize: "20px",
  },

  aiText: {
    margin: 0,
    color: "#4338ca",
    lineHeight: "1.6",
  },

  primaryButton: {
    marginTop: "15px",
    padding: "12px 20px",
    border: "none",
    borderRadius: "9px",
    background: "#6366f1",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default Dashboard;