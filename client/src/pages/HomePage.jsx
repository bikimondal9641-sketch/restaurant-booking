
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="home-page">
      {/* Navigation */}
      <header className="home-navbar">
        <Link to="/" className="home-logo">
          <span className="home-logo-star">✦</span>
          DineEase<span className="home-logo-dot">.</span>
        </Link>

        <nav className="home-nav-links">
          <Link to="/" className="home-nav-active">Home</Link>
          <a href="#about">Our Story</a>
          <a href="#features">Experience</a>
          <Link to="/login">Login</Link>
          <Link to="/register" className="nav-register">
            Get Started <span>↗</span>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="home-hero">
        <div className="hero-content">
          <span className="hero-tag">✦ WELCOME TO DINEEASE</span>

          <h1>
            Good food.
            <br />
            <em>Great moments.</em>
            <br />
            Made memorable.
          </h1>

          <p>
            Every great evening begins with the perfect table.
            Discover a more effortless way to dine, gather and
            make memories worth sharing.
          </p>

          <div className="hero-buttons">
            <Link to="/book" className="primary-btn">
              Reserve Your Table <span>↗</span>
            </Link>

            <Link to="/register" className="secondary-btn">
              Create an Account
            </Link>
          </div>

          <div className="home-hero-note">
            <span>✦</span>
            Thoughtful dining begins here.
          </div>
        </div>

        <div className="home-hero-visual">
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85"
              alt="Elegant restaurant dining experience"
            />

            <div className="hero-image-content">
              <span>THE ART OF DINING</span>
              <h2>Make every meal special.</h2>
            </div>
          </div>

          <div className="home-floating-card">
            <span>✦</span>
            <div>
              <strong>Your evening, elevated.</strong>
              <small>Every detail matters.</small>
            </div>
          </div>
        </div>
      </section>

      {/* Intro strip */}
      <section className="home-intro-strip">
        <span>GOOD FOOD</span>
        <span>✦</span>
        <span>GOOD COMPANY</span>
        <span>✦</span>
        <span>GREAT MEMORIES</span>
      </section>

      {/* Features */}
      <section className="home-features" id="features">
        <div className="section-heading">
          <span>✦ THE DINEEASE EXPERIENCE</span>
          <h2>Dining, made <em>effortless.</em></h2>
          <p>
            From finding your table to enjoying your evening,
            we make every step simple.
          </p>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <span className="feature-number">01</span>
            <div className="feature-icon">✦</div>
            <h3>Easy Reservations</h3>
            <p>
              Plan your visit in a few simple steps.
              Your next dining experience is just a booking away.
            </p>
            <Link to="/book">Book your table ↗</Link>
          </article>

          <article className="feature-card">
            <span className="feature-number">02</span>
            <div className="feature-icon">♧</div>
            <h3>Your Perfect Table</h3>
            <p>
              Find a table that suits your group.
              Choose from available seating with ease.
            </p>
            <Link to="/book">Explore tables ↗</Link>
          </article>

          <article className="feature-card">
            <span className="feature-number">03</span>
            <div className="feature-icon">◷</div>
            <h3>More Time to Enjoy</h3>
            <p>
              Check availability ahead of time and
              spend less time waiting.
            </p>
            <Link to="/register">Get started ↗</Link>
          </article>
        </div>
      </section>

      {/* About */}
      <section className="home-about" id="about">
        <div className="about-visual">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85"
            alt="Beautiful restaurant interior"
          />
          <div className="about-image-label">
            <span>THE DINEEASE PROMISE</span>
            <strong>Every moment deserves a place.</strong>
          </div>
        </div>

        <div className="about-content">
          <span>✦ OUR STORY</span>
          <h2>
            A simpler way to
            <br />
            <em>enjoy the moment.</em>
          </h2>

          <p>
            We believe dining is about more than just food.
            It is about conversations, celebrations and
            the people around your table.
          </p>

          <p>
            DineEase brings convenience to restaurant
            reservations. Explore available tables, choose
            your preferred time and manage your bookings
            all in one place.
          </p>

          <Link to="/book" className="about-link">
            Discover the experience ↗
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <span>✦ YOUR TABLE IS WAITING</span>
        <h2>
          Make room for
          <br />
          <em>great moments.</em>
        </h2>
        <p>Your next memorable dining experience starts here.</p>

        <Link to="/book" className="primary-btn">
          Reserve Your Table ↗
        </Link>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-main">
          <div>
            <Link to="/" className="home-logo">
              <span className="home-logo-star">✦</span>
              DineEase<span className="home-logo-dot">.</span>
            </Link>
            <p>Made for good food and even better moments.</p>
          </div>

          <div className="footer-links">
            <Link to="/">Home</Link>
            <a href="#about">Our Story</a>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} DineEase. All rights reserved.</span>
          <span>Made with care for every dining moment. ✦</span>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
