
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../App.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(location.state?.message || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://restaurant-booking-server-a5ez.onrender.com/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed.");
        return;
      }

      if (data.user.role !== "customer") {
        setMessage("Please use the admin login page.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/book");
    } catch (error) {
      setMessage("Cannot connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dine-auth-page">
      <header className="dine-auth-nav">
        <Link to="/" className="dine-auth-brand">
          <span className="dine-auth-brand-icon">D</span>
          <span>Dine<span>Ease</span></span>
        </Link>

        <Link to="/" className="dine-auth-home-link">
          ← Back to Home
        </Link>
      </header>

      <main className="dine-auth-main">
        <section className="dine-auth-visual">
          <div className="dine-auth-visual-overlay">
            <span className="dine-auth-eyebrow">
              THE ART OF FINE DINING
            </span>

            <h1>
              Good food.
              <br />
              Great moments.
              <br />
              <span>Beautiful memories.</span>
            </h1>

            <p>
              Your table is waiting. Come in and enjoy
              an experience worth remembering.
            </p>

            <div className="dine-auth-visual-line" />
            <span className="dine-auth-visual-caption">
              DINE WITH ELEGANCE · DINE WITH EASE
            </span>
          </div>
        </section>

        <section className="dine-auth-form-section">
          <div className="dine-auth-form-card">
            <span className="dine-auth-small-label">
              WELCOME BACK
            </span>

            <h2>Sign in to DineEase</h2>

            <p className="dine-auth-description">
              Enter your details to continue your dining journey.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="dine-auth-field">
                <label htmlFor="login-email">Email Address</label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="dine-auth-field">
                <label htmlFor="login-password">Password</label>

                <div className="dine-auth-password-wrap">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="dine-auth-show-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {message && (
                <div className="dine-auth-message">
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="dine-auth-submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <span>→</span>}
              </button>
            </form>

            <div className="dine-auth-divider">
              <span />
              <span>NEW TO DINEEASE?</span>
              <span />
            </div>

            <p className="dine-auth-register">
              Don't have an account?
              <Link to="/register"> Create Account</Link>
            </p>

            <div className="dine-auth-footer">
              Crafted for memorable dining experiences.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Login;
