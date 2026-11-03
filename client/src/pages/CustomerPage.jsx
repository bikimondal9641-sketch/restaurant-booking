
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "../App.css";

function CustomerPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [showBooking, setShowBooking] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    phone: "",
    date: "",
    time: "",
    guests: 2,
  });

  const [message, setMessage] = useState("");
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setAvailableTables([]);
    setSelectedTable(null);
    setMessage("");
  };

  const checkAvailability = async () => {
    if (!formData.date || !formData.time || !formData.guests) {
      setMessage("Please select a date, time and number of guests.");
      return;
    }

    setChecking(true);
    setMessage("");
    setAvailableTables([]);
    setSelectedTable(null);

    try {
      const response = await fetch(
        `https://restaurant-booking-server-a5ez.onrender.com/api/tables/available?date=${formData.date}&time=${formData.time}&guests=${formData.guests}`
      );

      const data = await response.json();

      if (response.ok) {
        setAvailableTables(data);
        if (data.length === 0) {
          setMessage("No tables are available for this time. Try another slot.");
        }
      } else {
        setMessage(data.message || "Failed to check availability.");
      }
    } catch (error) {
      setMessage("Cannot connect to the server. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTable) {
      setMessage("Please select an available table first.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(
        `https://restaurant-booking-server-a5ez.onrender.com/api/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            tableId: selectedTable._id,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Your table has been reserved successfully!");
        setFormData({
          name: user.name || "",
          phone: "",
          date: "",
          time: "",
          guests: 2,
        });
        setSelectedTable(null);
        setAvailableTables([]);
      } else {
        setMessage(data.message || "Booking failed. Please try again.");
      }
    } catch (error) {
      setMessage("Cannot connect to the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dine-customer">
      <header className="dine-navbar">
        <Link to="/" className="dine-brand">
          <span className="dine-brand-icon">✦</span>
          DineEase<span className="brand-dot">.</span>
        </Link>

        <nav className="dine-nav-links">
          <Link to="/" className="dine-nav-link">Home</Link>
          <Link to="/my-bookings" className="dine-nav-link">My Bookings</Link>
          <button className="dine-logout" onClick={handleLogout}>
            Log out
          </button>
        </nav>
      </header>

      <main className="dine-main">
        {!showBooking ? (
          <>
            <section className="dine-hero">
              <div className="dine-hero-content">
                <span className="dine-eyebrow">
                  ✦ YOUR TABLE, YOUR MOMENT
                </span>

                <h1>
                  Good food.
                  <br />
                  <span>Great moments.</span>
                </h1>

                <p className="dine-hero-description">
                  Welcome{user.name ? `, ${user.name}` : ""}! Discover a
                  beautiful dining experience and reserve your perfect table
                  in just a few clicks.
                </p>

                <div className="dine-hero-actions">
                  <button
                    className="dine-primary-btn"
                    onClick={() => {
                      setMessage("");
                      setShowBooking(true);
                    }}
                  >
                    Reserve a Table <span>↗</span>
                  </button>

                  <Link to="/my-bookings" className="dine-secondary-link">
                    View my bookings →
                  </Link>
                </div>

                <div className="dine-trust">
                  <span>✦ Easy reservations</span>
                  <span>✦ Instant confirmation</span>
                  <span>✦ No waiting in line</span>
                </div>
              </div>

              <div className="dine-hero-visual">
                <div className="dine-image-frame">
                  <img
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1100&q=85"
                    alt="Elegant restaurant dining table"
                  />
                  <div className="dine-image-label">
                    <span>THE ART OF DINING</span>
                    <strong>Make it memorable.</strong>
                  </div>
                </div>
                <div className="dine-floating-note">
                  <span className="dine-note-icon">✦</span>
                  <div>
                    <strong>Your evening, elevated</strong>
                    <small>Every detail matters.</small>
                  </div>
                </div>
              </div>
            </section>

            <section className="dine-feature-row">
              <div className="dine-feature">
                <span>01</span>
                <div>
                  <h3>Choose your time</h3>
                  <p>Find a slot that works for you.</p>
                </div>
              </div>

              <div className="dine-feature">
                <span>02</span>
                <div>
                  <h3>Select your table</h3>
                  <p>Choose from available tables.</p>
                </div>
              </div>

              <div className="dine-feature">
                <span>03</span>
                <div>
                  <h3>Enjoy your meal</h3>
                  <p>Arrive and enjoy the experience.</p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="dine-booking-section">
            <button
              className="dine-back-link"
              onClick={() => {
                setShowBooking(false);
                setMessage("");
              }}
            >
              ← Back to home
            </button>

            <div className="dine-booking-heading">
              <span className="dine-eyebrow">✦ MAKE A RESERVATION</span>
              <h1>Reserve your <span>table.</span></h1>
              <p>Tell us a little about your visit. We'll find the right table.</p>
            </div>

            <div className="dine-booking-layout">
              <form className="dine-booking-card" onSubmit={handleSubmit}>
                <h2>Your reservation details</h2>
                <p className="dine-form-subtitle">
                  Fill in your details to find available tables.
                </p>

                <div className="dine-form-grid">
                  <div className="dine-field dine-full">
                    <label>Your name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="dine-field dine-full">
                    <label>Phone number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  <div className="dine-field">
                    <label>Reservation date</label>
                    <input
                      type="date"
                      name="date"
                      min={new Date().toLocaleDateString("en-CA")}
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="dine-field">
                    <label>Reservation time</label>
                    <input
                      type="time"
                      name="time"
                      min="00:00"
                      max="22:00"
                      step="3600"
                      value={formData.time}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="dine-field dine-full">
                    <label>Number of guests</label>
                    <select
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                    >
                      {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? "Guest" : "Guests"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  className="dine-check-btn"
                  onClick={checkAvailability}
                  disabled={checking}
                >
                  {checking ? "Checking tables..." : "Find available tables →"}
                </button>

                {message && (
                  <div className="dine-message" role="status">
                    {message}
                  </div>
                )}

                {availableTables.length > 0 && (
                  <div className="dine-table-selection">
                    <h3>Choose your table</h3>
                    <p>Select one of the available tables below.</p>

                    <div className="dine-table-grid">
                      {availableTables.map((table) => (
                        <button
                          type="button"
                          key={table._id}
                          className={`dine-table-option ${
                            selectedTable?._id === table._id ? "selected" : ""
                          }`}
                          onClick={() => setSelectedTable(table)}
                        >
                          <span>TABLE {table.tableNumber}</span>
                          <strong>{table.capacity} seats</strong>
                          <small>
                            {selectedTable?._id === table._id
                              ? "✓ Selected"
                              : "Select table"}
                          </small>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="dine-primary-btn dine-submit-btn"
                  disabled={submitting}
                >
                  {submitting ? "Reserving..." : "Confirm Reservation ↗"}
                </button>
              </form>

              <aside className="dine-booking-aside">
                <div className="dine-aside-image">
                  <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=85"
                    alt="Warm restaurant interior"
                  />
                </div>
                <span className="dine-eyebrow">A LITTLE SOMETHING SPECIAL</span>
                <h3>Good times start around the table.</h3>
                <p>
                  Plan your visit in advance and let us take care of your
                  reservation.
                </p>
                <div className="dine-aside-detail">
                  <span>✦</span> 60-minute reservation slots
                </div>
                <div className="dine-aside-detail">
                  <span>✦</span> Choose from available tables
                </div>
              </aside>
            </div>
          </section>
        )}
      </main>

      <footer className="dine-footer">
        <Link to="/" className="dine-brand">
          <span className="dine-brand-icon">✦</span>
          DineEase<span className="brand-dot">.</span>
        </Link>
        <p>Made for good food and even better moments.</p>
        <span>© {new Date().getFullYear()} DineEase</span>
      </footer>
    </div>
  );
}

export default CustomerPage;
