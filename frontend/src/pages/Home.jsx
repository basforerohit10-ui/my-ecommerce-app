import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.badge}>
            ✨ AI-Powered Commerce
          </div>

          <h1 style={styles.heroTitle}>
            Smarter Shopping.
            <br />
            <span style={styles.highlight}>
              Powered by AI.
            </span>
          </h1>

          <p style={styles.heroText}>
            Discover products, get intelligent recommendations,
            and experience the future of agentic commerce.
          </p>

          <div style={styles.buttons}>
            <button
              onClick={() => navigate("/products")}
              style={styles.primaryButton}
            >
              Explore Products →
            </button>

            <button
              onClick={() => navigate("/register")}
              style={styles.secondaryButton}
            >
              Get Started
            </button>
          </div>

          <div style={styles.trust}>
            <span>✓ AI Recommendations</span>
            <span>✓ Secure Shopping</span>
            <span>✓ Fast Checkout</span>
          </div>
        </div>

        {/* AI Card */}
        <div style={styles.aiCard}>
          <div style={styles.aiHeader}>
            <div style={styles.aiLogo}>AI</div>

            <div>
              <strong>AI Shopping Agent</strong>
              <p style={styles.online}>● Online</p>
            </div>
          </div>

          <div style={styles.message}>
            👋 Hello! I can help you find the perfect product.
          </div>

          <div style={styles.recommendation}>
            <p style={styles.smallText}>
              Recommended for you
            </p>

            <h3>Smartphone</h3>

            <p style={styles.price}>₹24,999</p>

            <button
              onClick={() => navigate("/products")}
              style={styles.viewButton}
            >
              View Product
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={styles.features}>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>🤖</div>
          <h3>AI Recommendations</h3>
          <p>
            Intelligent product suggestions based on your
            shopping needs.
          </p>
        </div>

        <div style={styles.feature}>
          <div style={styles.featureIcon}>🛒</div>
          <h3>Easy Shopping</h3>
          <p>
            Simple product discovery and seamless cart
            experience.
          </p>
        </div>

        <div style={styles.feature}>
          <div style={styles.featureIcon}>⚡</div>
          <h3>Fast Checkout</h3>
          <p>
            Complete your order quickly with our simple
            checkout system.
          </p>
        </div>

        <div style={styles.feature}>
          <div style={styles.featureIcon}>📊</div>
          <h3>Growth Analytics</h3>
          <p>
            Monitor orders, revenue and business performance
            from your dashboard.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={styles.cta}>
        <h2>Ready to experience smarter commerce?</h2>

        <p>
          Start exploring products powered by AI.
        </p>

        <button
          onClick={() => navigate("/products")}
          style={styles.primaryButton}
        >
          Start Shopping →
        </button>
      </section>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "Inter, Arial, Helvetica, sans-serif",
  },

  hero: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "90px 30px 70px",
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.2fr) minmax(320px, 0.8fr)",
    gap: "70px",
    alignItems: "center",
  },

  heroContent: {
    maxWidth: "680px",
  },

  badge: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "30px",
    background: "#eef2ff",
    color: "#4f46e5",
    fontSize: "13px",
    fontWeight: "800",
    marginBottom: "20px",
  },

  heroTitle: {
    margin: 0,
    fontSize: "58px",
    lineHeight: "1.08",
    letterSpacing: "-2px",
    color: "#0f172a",
    fontWeight: "900",
  },

  highlight: {
    color: "#6366f1",
  },

  heroText: {
    marginTop: "25px",
    maxWidth: "600px",
    color: "#64748b",
    fontSize: "18px",
    lineHeight: "1.7",
  },

  buttons: {
    display: "flex",
    gap: "12px",
    marginTop: "30px",
  },

  primaryButton: {
    padding: "14px 22px",
    border: "none",
    borderRadius: "11px",
    background: "#6366f1",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer",
  },

  secondaryButton: {
    padding: "14px 22px",
    border: "1px solid #cbd5e1",
    borderRadius: "11px",
    background: "#ffffff",
    color: "#334155",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer",
  },

  trust: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    marginTop: "30px",
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "600",
  },

  aiCard: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "25px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 25px 60px rgba(15,23,42,0.10)",
  },

  aiHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  aiLogo: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "#6366f1",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
  },

  online: {
    margin: "4px 0 0",
    color: "#16a34a",
    fontSize: "12px",
  },

  message: {
    marginTop: "25px",
    padding: "16px",
    borderRadius: "14px",
    background: "#f8fafc",
    color: "#475569",
    lineHeight: "1.5",
    fontSize: "14px",
  },

  recommendation: {
    marginTop: "15px",
    padding: "20px",
    borderRadius: "16px",
    background: "#eef2ff",
  },

  smallText: {
    margin: 0,
    color: "#6366f1",
    fontSize: "12px",
    fontWeight: "800",
  },

  price: {
    fontSize: "20px",
    fontWeight: "900",
    color: "#0f172a",
  },

  viewButton: {
    width: "100%",
    padding: "11px",
    border: "none",
    borderRadius: "9px",
    background: "#ffffff",
    color: "#4f46e5",
    fontWeight: "800",
    cursor: "pointer",
  },

  features: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px 30px 70px",
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },

  feature: {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
  },

  featureIcon: {
    fontSize: "28px",
    marginBottom: "15px",
  },

  cta: {
    maxWidth: "1200px",
    margin: "0 auto 50px",
    padding: "55px 30px",
    textAlign: "center",
    borderRadius: "24px",
    background: "#eef2ff",
    border: "1px solid #c7d2fe",
  },
};

export default Home;