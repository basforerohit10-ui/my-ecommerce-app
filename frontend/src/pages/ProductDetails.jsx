import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Load product
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/products/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Product not found");
        }

        return response.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load product");
        setLoading(false);
      });
  }, [id]);

  // Add to cart
  const addToCart = () => {
    const savedCart = localStorage.getItem("cart");
    const cart = savedCart ? JSON.parse(savedCart) : [];

    const existingProduct = cart.find(
      (item) => item.id === product.id
    );

    let updatedCart;

    if (existingProduct) {
      updatedCart = cart.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + quantity,
            }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
        },
      ];
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  // Buy Now
  const buyNow = () => {
    addToCart();
    navigate("/cart");
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <h2>Loading product...</h2>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={styles.center}>
        <h2>{error || "Product not found"}</h2>

        <button
          style={styles.primaryButton}
          onClick={() => navigate("/products")}
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* Back Button */}
      <div style={styles.backContainer}>
        <button
          onClick={() => navigate("/products")}
          style={styles.backButton}
        >
          ← Back to Products
        </button>
      </div>

      {/* Product Section */}
      <section style={styles.productSection}>

        {/* Product Visual */}
        <div style={styles.visual}>

          <div style={styles.productIcon}>
            🛍️
          </div>

          <div style={styles.aiBadge}>
            ✨ AI Recommended
          </div>

        </div>

        {/* Product Information */}
        <div style={styles.info}>

          <span style={styles.category}>
            {product.category}
          </span>

          <h1 style={styles.title}>
            {product.name}
          </h1>

          {/* Rating */}
          <div style={styles.rating}>
            ⭐ 4.5

            <span style={styles.review}>
              Excellent choice
            </span>
          </div>

          {/* Description */}
          <p style={styles.description}>
            {product.description ||
              "No description available."}
          </p>

          {/* Stock */}
          <div style={styles.stock}>
            <span style={styles.stockDot}></span>
            In Stock
          </div>

          {/* Price */}
          <div style={styles.priceBox}>

            <span style={styles.priceLabel}>
              Price
            </span>

            <div style={styles.price}>
              ₹
              {Number(product.price).toLocaleString(
                "en-IN"
              )}
            </div>

          </div>

          {/* Quantity */}
          <div style={styles.quantitySection}>

            <p style={styles.quantityLabel}>
              Quantity
            </p>

            <div style={styles.quantityBox}>

              <button
                style={styles.quantityButton}
                onClick={() =>
                  setQuantity(
                    Math.max(1, quantity - 1)
                  )
                }
              >
                −
              </button>

              <span style={styles.quantityValue}>
                {quantity}
              </span>

              <button
                style={styles.quantityButton}
                onClick={() =>
                  setQuantity(quantity + 1)
                }
              >
                +
              </button>

            </div>

          </div>

          {/* Selected Total */}
          <div style={styles.selectedTotal}>
            Total: ₹
            {(
              Number(product.price) * quantity
            ).toLocaleString("en-IN")}
          </div>

          {/* Actions */}
          <div style={styles.actions}>

            <button
              onClick={addToCart}
              style={styles.cartButton}
            >
              🛒{" "}
              {added
                ? "Added to Cart ✓"
                : "Add to Cart"}
            </button>

            <button
              onClick={buyNow}
              style={styles.buyButton}
            >
              ⚡ Buy Now
            </button>

          </div>

          {/* View Cart */}
          <button
            onClick={() => navigate("/cart")}
            style={styles.viewCartButton}
          >
            🛒 View Cart
          </button>

        </div>

      </section>

      {/* AI Recommendation */}
      <section style={styles.aiSection}>

        <div style={styles.aiIcon}>
          🤖
        </div>

        <div>
          <h2 style={styles.aiTitle}>
            AI Shopping Insight
          </h2>

          <p style={styles.aiText}>
            This product is recommended based on
            product category, popularity and shopping
            behaviour.
          </p>
        </div>

      </section>

    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    paddingBottom: "80px",
    fontFamily: "Arial, sans-serif",
    color: "#0f172a",
  },

  backContainer: {
    padding: "30px 8%",
  },

  backButton: {
    border: "none",
    background: "transparent",
    color: "#6366f1",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },

  productSection: {
    margin: "0 8%",
    padding: "45px",
    background: "#ffffff",
    borderRadius: "25px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "60px",
    boxShadow:
      "0 15px 40px rgba(15,23,42,0.07)",
  },

  visual: {
    minHeight: "450px",
    borderRadius: "20px",
    background:
      "linear-gradient(135deg, #eef2ff, #e0f2fe)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  productIcon: {
    fontSize: "130px",
  },

  aiBadge: {
    position: "absolute",
    top: "20px",
    left: "20px",
    padding: "10px 15px",
    background: "#ffffff",
    borderRadius: "20px",
    color: "#6366f1",
    fontWeight: "700",
    fontSize: "13px",
    boxShadow:
      "0 5px 15px rgba(0,0,0,0.08)",
  },

  info: {
    padding: "20px 0",
  },

  category: {
    color: "#6366f1",
    fontSize: "14px",
    fontWeight: "800",
    textTransform: "uppercase",
  },

  title: {
    fontSize: "48px",
    margin: "12px 0",
    lineHeight: "1.1",
  },

  rating: {
    fontSize: "17px",
    fontWeight: "700",
    margin: "20px 0",
  },

  review: {
    marginLeft: "10px",
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "500",
  },

  description: {
    fontSize: "18px",
    lineHeight: "1.7",
    color: "#64748b",
  },

  stock: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "25px",
    color: "#15803d",
    fontWeight: "700",
  },

  stockDot: {
    width: "9px",
    height: "9px",
    borderRadius: "50%",
    background: "#22c55e",
  },

  priceBox: {
    marginTop: "30px",
  },

  priceLabel: {
    color: "#94a3b8",
    fontSize: "14px",
  },

  price: {
    fontSize: "38px",
    fontWeight: "800",
    marginTop: "5px",
  },

  quantitySection: {
    marginTop: "25px",
  },

  quantityLabel: {
    margin: "0 0 10px",
    fontSize: "14px",
    fontWeight: "700",
    color: "#475569",
  },

  quantityBox: {
    display: "flex",
    alignItems: "center",
    width: "140px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    overflow: "hidden",
  },

  quantityButton: {
    width: "42px",
    height: "42px",
    border: "none",
    background: "#f1f5f9",
    fontSize: "20px",
    fontWeight: "700",
    cursor: "pointer",
  },

  quantityValue: {
    flex: 1,
    textAlign: "center",
    fontWeight: "800",
  },

  selectedTotal: {
    marginTop: "18px",
    fontSize: "18px",
    fontWeight: "800",
    color: "#0f172a",
  },

  actions: {
    display: "flex",
    gap: "12px",
    marginTop: "25px",
  },

  cartButton: {
    flex: 1,
    padding: "16px",
    border: "none",
    borderRadius: "12px",
    background: "#6366f1",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
  },

  buyButton: {
    flex: 1,
    padding: "16px",
    border: "none",
    borderRadius: "12px",
    background: "#0f172a",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
  },

  viewCartButton: {
    width: "100%",
    marginTop: "12px",
    padding: "14px",
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    background: "#ffffff",
    color: "#0f172a",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },

  aiSection: {
    margin: "30px 8% 0",
    padding: "30px",
    background: "#eef2ff",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  aiIcon: {
    fontSize: "40px",
  },

  aiTitle: {
    margin: "0 0 8px",
  },

  aiText: {
    margin: 0,
    color: "#64748b",
  },

  center: {
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButton: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "9px",
    background: "#6366f1",
    color: "#ffffff",
    fontWeight: "800",
    cursor: "pointer",
  },
};

export default ProductDetails;