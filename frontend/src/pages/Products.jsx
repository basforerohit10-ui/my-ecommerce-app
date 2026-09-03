import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cartCount, setCartCount] = useState(0);

  const loadProducts = () => {
    setLoading(true);
    setError("");

    fetch(`${API_BASE}/products/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })
      .then((data) => {
        const productList = data.products || [];
        setProducts(productList);
        setFilteredProducts(productList);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Product fetch error:", error);
        setError("Unable to load products");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    updateCartCount();
  }, []);

  const updateCartCount = () => {
    try {
      const savedCart = localStorage.getItem("cart");
      const cart = savedCart ? JSON.parse(savedCart) : [];

      const count = cart.reduce(
        (total, item) => total + (item.quantity || 0),
        0
      );

      setCartCount(count);
    } catch (error) {
      console.error("Cart error:", error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    let result = [...products];

    if (search.trim() !== "") {
      const searchText = search.toLowerCase().trim();

      result = result.filter((product) => {
        const name = String(product.name || "").toLowerCase();
        const categoryName = String(
          product.category || ""
        ).toLowerCase();
        const description = String(
          product.description || ""
        ).toLowerCase();

        return (
          name.includes(searchText) ||
          categoryName.includes(searchText) ||
          description.includes(searchText)
        );
      });
    }

    if (category !== "All") {
      result = result.filter(
        (product) => product.category === category
      );
    }

    setFilteredProducts(result);
  }, [search, category, products]);

  const categories = [
    "All",
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    ),
  ];

  // Dynamic search URL: Isse exact product ke naam ke hisab se image fetch hogi
  const getImageUrl = (imageUrl, name = "", category = "") => {
    if (
      imageUrl &&
      (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) &&
      !imageUrl.includes("unsplash.com/photo-") &&
      !imageUrl.includes("ui-avatars")
    ) {
      return imageUrl;
    }

    if (imageUrl && imageUrl.startsWith("/")) {
      return `${API_BASE}${imageUrl}`;
    }

    const query = encodeURIComponent(`${name} ${category}`.trim() || "product");
    return `https://source.unsplash.com/featured/500x400/?${query}`;
  };

  const addToCart = (product) => {
    try {
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
                quantity: item.quantity + 1,
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
            image_url: product.image_url,
            quantity: 1,
          },
        ];
      }

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );

      updateCartCount();

      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Cart error:", error);
      alert("Unable to add product to cart.");
    }
  };

  const clearSearch = () => {
    setSearch("");
    setCategory("All");
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <h2>Loading Products...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.center}>
        <h2>{error}</h2>

        <button
          style={styles.primaryButton}
          onClick={loadProducts}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <div style={styles.badge}>
            ✨ AI Recommended
          </div>

          <h1 style={styles.title}>
            Explore Products
          </h1>

          <p style={styles.subtitle}>
            Discover products selected for smarter shopping.
          </p>
        </div>

        <button
          style={styles.cartButton}
          onClick={() => navigate("/cart")}
        >
          🛒 Cart

          {cartCount > 0 && (
            <span style={styles.cartBadge}>
              {cartCount}
            </span>
          )}
        </button>
      </div>

      <div style={styles.controls}>
        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔎</span>

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              style={styles.clearButton}
            >
              ✕
            </button>
          )}
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.select}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.resultInfo}>
        <span>
          {filteredProducts.length} product
          {filteredProducts.length !== 1 ? "s" : ""}
        </span>

        {(search || category !== "All") && (
          <button
            onClick={clearSearch}
            style={styles.resetButton}
          >
            Clear filters
          </button>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>🔍</div>

          <h2>No products found</h2>

          <p>
            Try another product name or category.
          </p>

          <button
            onClick={clearSearch}
            style={styles.primaryButton}
          >
            Show All Products
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              style={styles.card}
            >
              <div style={styles.productVisual}>
                <img
                  src={getImageUrl(product.image_url, product.name, product.category)}
                  alt={product.name}
                  style={styles.productImage}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      product.name
                    )}&background=4f46e5&color=ffffff&size=500`;
                  }}
                />
              </div>

              <div style={styles.cardContent}>
                <span style={styles.category}>
                  {product.category}
                </span>

                <h2 style={styles.productName}>
                  {product.name}
                </h2>

                <p style={styles.description}>
                  {product.description ||
                    "Premium product with modern features."}
                </p>

                <div style={styles.rating}>
                  ⭐ 4.5
                  <span> • </span>

                  <span style={styles.stock}>
                    In Stock
                  </span>
                </div>

                <div style={styles.bottom}>
                  <div>
                    <p style={styles.priceLabel}>
                      Price
                    </p>

                    <h2 style={styles.price}>
                      ₹
                      {Number(
                        product.price
                      ).toLocaleString("en-IN")}
                    </h2>
                  </div>
                </div>

                <div style={styles.actions}>
                  <button
                    style={styles.detailsButton}
                    onClick={() =>
                      navigate(
                        `/product/${product.id}`
                      )
                    }
                  >
                    View Details
                  </button>

                  <button
                    style={styles.addButton}
                    onClick={() =>
                      addToCart(product)
                    }
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    width: "100%",
    minHeight: "100vh",
    background: "#f8fafc",
    padding: "45px 40px 70px",
    fontFamily: "Inter, Arial, Helvetica, sans-serif",
    boxSizing: "border-box",
  },

  header: {
    width: "100%",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "20px",
  },

  badge: {
    display: "inline-block",
    padding: "7px 12px",
    borderRadius: "20px",
    background: "#eef2ff",
    color: "#4f46e5",
    fontSize: "12px",
    fontWeight: "800",
    marginBottom: "12px",
  },

  title: {
    margin: 0,
    fontSize: "38px",
    fontWeight: "900",
    color: "#0f172a",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#64748b",
    fontSize: "16px",
  },

  cartButton: {
    position: "relative",
    padding: "12px 18px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#334155",
    fontWeight: "800",
    cursor: "pointer",
  },

  cartBadge: {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    minWidth: "20px",
    height: "20px",
    borderRadius: "20px",
    background: "#ef4444",
    color: "#ffffff",
    fontSize: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  controls: {
    width: "100%",
    margin: "35px auto 0",
    display: "flex",
    gap: "15px",
  },

  searchBox: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    padding: "0 15px",
  },

  searchIcon: {
    fontSize: "18px",
  },

  searchInput: {
    flex: 1,
    width: "100%",
    border: "none",
    outline: "none",
    padding: "14px 0",
    fontSize: "15px",
    background: "transparent",
    color: "#0f172a",
  },

  clearButton: {
    border: "none",
    background: "transparent",
    color: "#64748b",
    fontSize: "16px",
    cursor: "pointer",
  },

  select: {
    minWidth: "190px",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#334155",
    fontWeight: "600",
    outline: "none",
    cursor: "pointer",
  },

  resultInfo: {
    width: "100%",
    margin: "25px auto 15px",
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "600",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  resetButton: {
    border: "none",
    background: "transparent",
    color: "#4f46e5",
    fontWeight: "700",
    cursor: "pointer",
  },

  grid: {
    width: "100%",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "22px",
  },

  card: {
    background: "#ffffff",
    borderRadius: "18px",
    overflow: "hidden",
    border: "1px solid #e2e8f0",
    boxShadow:
      "0 8px 25px rgba(15,23,42,0.05)",
  },

  productVisual: {
    height: "190px",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  cardContent: {
    padding: "22px",
  },

  category: {
    display: "inline-block",
    padding: "5px 9px",
    borderRadius: "6px",
    background: "#f1f5f9",
    color: "#475569",
    fontSize: "11px",
    fontWeight: "800",
    textTransform: "uppercase",
  },

  productName: {
    margin: "12px 0 7px",
    color: "#0f172a",
    fontSize: "20px",
  },

  description: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
    lineHeight: "1.5",
    minHeight: "40px",
  },

  rating: {
    marginTop: "15px",
    fontSize: "13px",
    color: "#475569",
    fontWeight: "700",
  },

  stock: {
    color: "#16a34a",
  },

  bottom: {
    marginTop: "18px",
  },

  priceLabel: {
    margin: 0,
    fontSize: "11px",
    color: "#94a3b8",
  },

  price: {
    margin: "3px 0 0",
    fontSize: "23px",
    color: "#0f172a",
  },

  actions: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "9px",
    marginTop: "18px",
  },

  detailsButton: {
    padding: "11px",
    border: "1px solid #cbd5e1",
    borderRadius: "9px",
    background: "#ffffff",
    color: "#334155",
    fontWeight: "700",
    cursor: "pointer",
  },

  addButton: {
    padding: "11px",
    border: "none",
    borderRadius: "9px",
    background: "#6366f1",
    color: "#ffffff",
    fontWeight: "800",
    cursor: "pointer",
  },

  empty: {
    maxWidth: "600px",
    margin: "70px auto",
    textAlign: "center",
    padding: "50px",
    background: "#ffffff",
    borderRadius: "18px",
    border: "1px solid #e2e8f0",
  },

  emptyIcon: {
    fontSize: "45px",
  },

  center: {
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#475569",
  },

  primaryButton: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "9px",
    background: "#6366f1",
    color: "#ffffff",
    fontWeight: "800",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default Products;