
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="home-page">

      {/* Navigation */}
      <nav className="home-navbar">
        <Link to="/" className="home-logo">
          🍽️ DineEase
        </Link>

        <div className="home-nav-links">
          <Link to="/">Home</Link>
          <a href="#about">About</a>
          <a href="#features">Why DineEase</a>
          <Link to="/login">Login</Link>
          <Link to="/register" className="nav-register">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-content">
          <span className="hero-tag">
            WELCOME TO DINEEASE
          </span>

          <h1>
            Good Food.
            <br />
            Great Moments.
            <br />
            <span>Reserved for You.</span>
          </h1>

          <p>
            Discover a better dining experience.
            Reserve your perfect table in just a few clicks
            and enjoy every moment without waiting.
          </p>

          <div className="hero-buttons">
            <Link to="/book" className="primary-btn">
              Book a Table →
            </Link>

            <Link to="/register" className="secondary-btn">
              Create Account
            </Link>
          </div>
        </div>

        <div className="hero-image">
          <div className="hero-image-content">
            <span>YOUR TABLE IS WAITING</span>
            <h2>Make Every Meal Special</h2>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="home-features" id="features">
        <div className="section-heading">
          <span>WHY CHOOSE US</span>
          <h2>Dining Made Easier</h2>
          <p>Everything you need for a comfortable dining experience.</p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Easy Reservations</h3>
            <p>Book your table online in just a few simple steps.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🪑</div>
            <h3>Choose Your Table</h3>
            <p>Find a suitable table based on your group size.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⏰</div>
            <h3>Save Your Time</h3>
            <p>Check table availability before arriving at the restaurant.</p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="home-about" id="about">
        <div>
          <span>ABOUT DINEEASE</span>
          <h2>A Simpler Way to Enjoy Dining</h2>
        </div>

        <p>
          DineEase makes restaurant reservations convenient.
          Explore available tables, select your preferred time,
          and manage your bookings from one place.
          Spend less time waiting and more time enjoying.
        </p>
      </section>

      {/* Call to Action */}
      <section className="home-cta">
        <h2>Ready for Your Next Dining Experience?</h2>
        <p>Reserve your table today with DineEase.</p>

        <Link to="/book" className="primary-btn">
          Reserve Your Table →
        </Link>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <h3>🍽️ DineEase</h3>
        <p>Making every dining experience easier.</p>
        <p>© {new Date().getFullYear()} DineEase. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default HomePage;
