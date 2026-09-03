import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const navigate = useNavigate();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const totalItems = cart.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  );

  const placeOrder = async () => {
    setError("");

    if (!customerName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!address.trim()) {
      setError("Please enter your delivery address.");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/orders/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_name: customerName.trim(),
            phone: phone,
            address: address.trim(),
            total_amount: total,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to place order"
        );
      }

      setOrderId(data.order.id);
      setOrderPlaced(true);

      localStorage.removeItem("cart");
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Unable to place order. Please make sure the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div style={styles.page}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>✓</div>

          <h1 style={styles.successTitle}>
            Order Placed Successfully!
          </h1>

          <p style={styles.successText}>
            Thank you for shopping with us.
            Your order has been received successfully.
          </p>

          <div style={styles.orderBox}>
            <span>Order ID</span>
            <strong>#{orderId}</strong>
          </div>

          <p style={styles.status}>
            📦 Order Status: <strong>Pending</strong>
          </p>

          <button
            onClick={() => navigate("/products")}
            style={styles.shopButton}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <button
            onClick={() => navigate("/cart")}
            style={styles.backButton}
          >
            ← Back to Cart
          </button>

          <div style={styles.secure}>
            🔒 Secure Checkout
          </div>
        </div>

        <h1 style={styles.title}>Checkout</h1>

        <p style={styles.subtitle}>
          Complete your delivery details to place your order.
        </p>

        <div style={styles.layout}>
          {/* Delivery Details */}
          <div style={styles.formCard}>
            <h2 style={styles.sectionTitle}>
              Delivery Details
            </h2>

            <p style={styles.sectionText}>
              Where should we deliver your order?
            </p>

            <label style={styles.label}>
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={customerName}
              onChange={(e) =>
                setCustomerName(e.target.value)
              }
              style={styles.input}
            />

            <label style={styles.label}>
              Phone Number
            </label>

            <input
              type="tel"
              placeholder="10-digit phone number"
              value={phone}
              maxLength="10"
              onChange={(e) =>
                setPhone(
                  e.target.value.replace(/\D/g, "")
                )
              }
              style={styles.input}
            />

            <label style={styles.label}>
              Delivery Address
            </label>

            <textarea
              placeholder="Enter your complete delivery address"
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              rows="5"
              style={styles.textarea}
            />

            {error && (
              <div style={styles.error}>
                ⚠️ {error}
              </div>
            )}

            <button
              onClick={placeOrder}
              disabled={loading}
              style={{
                ...styles.placeButton,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading
                ? "Placing Order..."
                : "Place Order →"}
            </button>
          </div>

          {/* Order Summary */}
          <div style={styles.summary}>
            <h2 style={styles.sectionTitle}>
              Order Summary
            </h2>

            <div style={styles.itemCount}>
              {totalItems}{" "}
              {totalItems === 1 ? "item" : "items"}
            </div>

            <div style={styles.items}>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={styles.item}
                >
                  <div style={styles.itemIcon}>
                    🛍️
                  </div>

                  <div style={styles.itemInfo}>
                    <strong>{item.name}</strong>

                    <span>
                      ₹
                      {Number(item.price).toLocaleString(
                        "en-IN"
                      )}{" "}
                      × {item.quantity}
                    </span>
                  </div>

                  <strong>
                    ₹
                    {Number(
                      Number(item.price) *
                        Number(item.quantity)
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>
              ))}
            </div>

            <hr style={styles.divider} />

            <div style={styles.row}>
              <span>Subtotal</span>

              <span>
                ₹{Number(total).toLocaleString("en-IN")}
              </span>
            </div>

            <div style={styles.row}>
              <span>Delivery</span>

              <span style={styles.free}>
                FREE
              </span>
            </div>

            <hr style={styles.divider} />

            <div style={styles.totalRow}>
              <span>Total</span>

              <strong>
                ₹{Number(total).toLocaleString("en-IN")}
              </strong>
            </div>

            <div style={styles.trust}>
              ✓ Secure order processing
              <br />
              ✓ Fast delivery
              <br />
              ✓ AI-powered shopping experience
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    padding: "40px 8% 80px",
    fontFamily: "Arial, sans-serif",
    color: "#0f172a",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  backButton: {
    border: "none",
    background: "transparent",
    color: "#6366f1",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "15px",
  },

  secure: {
    color: "#16a34a",
    fontWeight: "700",
    fontSize: "14px",
  },

  title: {
    fontSize: "42px",
    margin: "35px 0 8px",
    fontWeight: "800",
  },

  subtitle: {
    color: "#64748b",
    marginBottom: "35px",
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 380px",
    gap: "30px",
    alignItems: "start",
  },

  formCard: {
    background: "#ffffff",
    padding: "35px",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
  },

  summary: {
    background: "#ffffff",
    padding: "28px",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
    position: "sticky",
    top: "90px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "24px",
  },

  sectionText: {
    color: "#64748b",
    marginTop: "8px",
    marginBottom: "28px",
  },

  label: {
    display: "block",
    fontWeight: "700",
    fontSize: "14px",
    marginBottom: "8px",
    marginTop: "20px",
  },

  input: {
    width: "100%",
    padding: "14px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "15px",
    boxSizing: "border-box",
    outline: "none",
  },

  textarea: {
    width: "100%",
    padding: "14px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "15px",
    boxSizing: "border-box",
    resize: "vertical",
    fontFamily: "Arial, sans-serif",
    outline: "none",
  },

  error: {
    marginTop: "20px",
    padding: "13px",
    borderRadius: "10px",
    background: "#fef2f2",
    color: "#dc2626",
    fontWeight: "600",
    fontSize: "14px",
  },

  placeButton: {
    width: "100%",
    marginTop: "25px",
    padding: "16px",
    border: "none",
    borderRadius: "11px",
    background: "#6366f1",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
  },

  itemCount: {
    color: "#64748b",
    marginTop: "8px",
    fontSize: "14px",
  },

  items: {
    marginTop: "22px",
  },

  item: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "18px",
    fontSize: "14px",
  },

  itemIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "10px",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
  },

  itemInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  divider: {
    border: 0,
    borderTop: "1px solid #e2e8f0",
    margin: "22px 0",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
    color: "#64748b",
  },

  free: {
    color: "#16a34a",
    fontWeight: "800",
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "20px",
  },

  trust: {
    marginTop: "25px",
    padding: "15px",
    background: "#f8fafc",
    borderRadius: "10px",
    color: "#64748b",
    lineHeight: "1.9",
    fontSize: "13px",
  },

  successCard: {
    maxWidth: "600px",
    margin: "80px auto",
    padding: "55px 35px",
    background: "#ffffff",
    borderRadius: "25px",
    textAlign: "center",
    boxShadow: "0 15px 40px rgba(15,23,42,0.08)",
  },

  successIcon: {
    width: "80px",
    height: "80px",
    margin: "0 auto 25px",
    borderRadius: "50%",
    background: "#dcfce7",
    color: "#16a34a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "45px",
    fontWeight: "800",
  },

  successTitle: {
    fontSize: "32px",
    marginBottom: "12px",
  },

  successText: {
    color: "#64748b",
    lineHeight: "1.6",
  },

  orderBox: {
    margin: "25px auto 15px",
    padding: "18px",
    maxWidth: "300px",
    background: "#eef2ff",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
  },

  status: {
    color: "#64748b",
  },

  shopButton: {
    marginTop: "20px",
    padding: "14px 25px",
    border: "none",
    borderRadius: "10px",
    background: "#6366f1",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default Checkout;