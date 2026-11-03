
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://restaurant-booking-server-a5ez.onrender.com/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Registration failed.");
        return;
      }

      navigate("/login", {
        state: { message: data.message },
      });
    } catch (error) {
      setMessage("Cannot connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dine-auth-page">
      <header className="dine-auth-nav">
        <Link to="/" className="dine-auth-brand">
          <span className="dine-auth-brand-icon">D</span>
          <span>
            Dine<span>Ease</span>
          </span>
        </Link>

        <Link to="/" className="dine-auth-home-link">
          ← Back to Home
        </Link>
      </header>

      <main className="dine-auth-main">
        <section className="dine-auth-visual">
          <div className="dine-auth-visual-overlay">
            <span className="dine-auth-eyebrow">
              YOUR TABLE AWAITS
            </span>

            <h1>
              Discover.
              <br />
              Experience.
              <br />
              <span>Enjoy every moment.</span>
            </h1>

            <p>
              Join DineEase and make every dining
              experience a little more special.
            </p>

            <div className="dine-auth-visual-line" />

            <span className="dine-auth-visual-caption">
              GOOD TASTE · GREAT COMPANY
            </span>
          </div>
        </section>

        <section className="dine-auth-form-section">
          <div className="dine-auth-form-card">
            <span className="dine-auth-small-label">
              JOIN OUR TABLE
            </span>

            <h2>Create your account</h2>

            <p className="dine-auth-description">
              Sign up to discover a more effortless way
              to enjoy your favourite dining experiences.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="dine-auth-field">
                <label htmlFor="register-name">
                  Full Name
                </label>

                <input
                  id="register-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="dine-auth-field">
                <label htmlFor="register-email">
                  Email Address
                </label>

                <input
                  id="register-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="dine-auth-field">
                <label htmlFor="register-password">
                  Password
                </label>

                <div className="dine-auth-password-wrap">
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 8 characters"
                    minLength={8}
                    autoComplete="new-password"
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
                {loading ? "Creating Account..." : "Create Account"}
                {!loading && <span>→</span>}
              </button>
            </form>

            <div className="dine-auth-divider">
              <span />
              <span>ALREADY A MEMBER?</span>
              <span />
            </div>

            <p className="dine-auth-register">
              Already have an account?
              <Link to="/login"> Sign In</Link>
            </p>

            <div className="dine-auth-footer">
              A better dining experience begins here.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Register;
