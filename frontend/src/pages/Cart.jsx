import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const updateCart = (items) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const increaseQuantity = (id) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    updateCart(updatedItems);
  };

  const decreaseQuantity = (id) => {
    const updatedItems = cartItems
      .map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    updateCart(updatedItems);
  };

  const removeItem = (id) => {
    const updatedItems = cartItems.filter(
      (item) => item.id !== id
    );

    updateCart(updatedItems);
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Shopping Cart</h1>
            <p style={styles.subtitle}>
              {totalItems}{" "}
              {totalItems === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          <button
            onClick={() => navigate("/products")}
            style={styles.continueButton}
          >
            ← Continue Shopping
          </button>
        </div>

        {/* Empty Cart */}
        {cartItems.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>🛒</div>

            <h2>Your cart is empty</h2>

            <p>
              Looks like you haven't added anything to your
              cart yet.
            </p>

            <button
              onClick={() => navigate("/products")}
              style={styles.shopButton}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div style={styles.layout}>
            {/* Cart Items */}
            <div style={styles.items}>
              {cartItems.map((item) => (
                <div key={item.id} style={styles.card}>
                  <div style={styles.productImage}>
                    🛍️
                  </div>

                  <div style={styles.productInfo}>
                    <span style={styles.label}>
                      PRODUCT
                    </span>

                    <h2 style={styles.productName}>
                      {item.name}
                    </h2>

                    <p style={styles.price}>
                      ₹{Number(item.price).toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    <div style={styles.bottomRow}>
                      <div style={styles.quantityBox}>
                        <button
                          onClick={() =>
                            decreaseQuantity(item.id)
                          }
                          style={styles.quantityButton}
                        >
                          −
                        </button>

                        <span style={styles.quantity}>
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            increaseQuantity(item.id)
                          }
                          style={styles.quantityButton}
                        >
                          +
                        </button>
                      </div>

                      <strong style={styles.subtotal}>
                        ₹
                        {Number(
                          item.price * item.quantity
                        ).toLocaleString("en-IN")}
                      </strong>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      style={styles.removeButton}
                    >
                      🗑 Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div style={styles.summary}>
              <h2 style={styles.summaryTitle}>
                Order Summary
              </h2>

              <div style={styles.summaryRow}>
                <span>Items</span>
                <span>{totalItems}</span>
              </div>

              <div style={styles.summaryRow}>
                <span>Subtotal</span>
                <span>
                  ₹{Number(total).toLocaleString("en-IN")}
                </span>
              </div>

              <div style={styles.summaryRow}>
                <span>Delivery</span>
                <span style={styles.free}>FREE</span>
              </div>

              <hr style={styles.divider} />

              <div style={styles.totalRow}>
                <span>Total</span>
                <strong>
                  ₹{Number(total).toLocaleString("en-IN")}
                </strong>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                style={styles.checkoutButton}
              >
                Proceed to Checkout →
              </button>

              <div style={styles.secure}>
                🔒 Secure checkout
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    padding: "50px 8% 80px",
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
    marginBottom: "35px",
  },

  title: {
    fontSize: "42px",
    margin: 0,
    fontWeight: "800",
  },

  subtitle: {
    color: "#64748b",
    marginTop: "8px",
    fontSize: "16px",
  },

  continueButton: {
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    color: "#334155",
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 360px",
    gap: "30px",
    alignItems: "start",
  },

  items: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  card: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "22px",
    display: "flex",
    gap: "22px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 8px 25px rgba(15,23,42,0.05)",
  },

  productImage: {
    width: "130px",
    height: "130px",
    minWidth: "130px",
    borderRadius: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #eef2ff, #e0f2fe)",
    fontSize: "48px",
  },

  productInfo: {
    flex: 1,
  },

  label: {
    fontSize: "11px",
    color: "#6366f1",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  productName: {
    margin: "7px 0",
    fontSize: "22px",
  },

  price: {
    margin: "5px 0 18px",
    color: "#475569",
  },

  bottomRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  quantityBox: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #cbd5e1",
    borderRadius: "9px",
    overflow: "hidden",
  },

  quantityButton: {
    width: "35px",
    height: "35px",
    border: "none",
    background: "#f8fafc",
    cursor: "pointer",
    fontSize: "20px",
  },

  quantity: {
    width: "38px",
    textAlign: "center",
    fontWeight: "700",
  },

  subtotal: {
    fontSize: "19px",
  },

  removeButton: {
    marginTop: "15px",
    border: "none",
    background: "transparent",
    color: "#ef4444",
    cursor: "pointer",
    fontWeight: "600",
    padding: 0,
  },

  summary: {
    background: "#ffffff",
    padding: "28px",
    borderRadius: "18px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 8px 25px rgba(15,23,42,0.05)",
    position: "sticky",
    top: "95px",
  },

  summaryTitle: {
    marginTop: 0,
    marginBottom: "25px",
    fontSize: "22px",
  },

  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "16px",
    color: "#64748b",
  },

  free: {
    color: "#16a34a",
    fontWeight: "800",
  },

  divider: {
    border: 0,
    borderTop: "1px solid #e2e8f0",
    margin: "22px 0",
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "19px",
    marginBottom: "25px",
  },

  checkoutButton: {
    width: "100%",
    padding: "15px",
    border: "none",
    borderRadius: "11px",
    background: "#6366f1",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer",
  },

  secure: {
    textAlign: "center",
    marginTop: "15px",
    color: "#94a3b8",
    fontSize: "13px",
  },

  empty: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "100px 20px",
    textAlign: "center",
    border: "1px solid #e2e8f0",
  },

  emptyIcon: {
    fontSize: "70px",
  },

  shopButton: {
    marginTop: "15px",
    padding: "13px 25px",
    border: "none",
    borderRadius: "10px",
    background: "#6366f1",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default Cart;