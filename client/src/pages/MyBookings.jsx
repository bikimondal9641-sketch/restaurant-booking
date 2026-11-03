
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import "../App.css";

function MyBookings() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(
          `https://restaurant-booking-server-a5ez.onrender.com/api/bookings/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Unable to load your bookings.");
          return;
        }

        setBookings(data);
      } catch (error) {
        setMessage("Cannot connect to the server. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchBookings();
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
const handleCancelBooking = async (bookingId) => {
  const confirmed = window.confirm(
    "Are you sure you want to cancel this reservation?"
  );

  if (!confirmed) return;

  setCancellingId(bookingId);
  setMessage("");

  try {
    const response = await fetch(
      `https://restaurant-booking-server-a5ez.onrender.com/api/bookings/${bookingId}/cancel`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Failed to cancel booking.");
      return;
    }

    setBookings((previousBookings) =>
      previousBookings.map((booking) =>
        booking._id === bookingId
          ? { ...booking, status: "cancelled" }
          : booking
      )
    );

    setMessage("Reservation cancelled successfully.");
  } catch (error) {
    setMessage("Unable to connect to the server.");
  } finally {
    setCancellingId(null);
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
          <Link to="/book" className="dine-nav-link">Home</Link>
          <Link to="/my-bookings" className="dine-nav-link">My Bookings</Link>
          <button
            className="dine-logout"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
          >
            Log out
          </button>
        </nav>
      </header>

      <main className="my-bookings-main">
        <section className="my-bookings-intro">
          <span className="dine-eyebrow">✦ YOUR DINING JOURNEY</span>

          <h1>
            My <span>Reservations.</span>
          </h1>

          <p>
            Welcome back{user.name ? `, ${user.name}` : ""}. Here's where
            your dining plans come together.
          </p>

          <div className="my-bookings-actions">
            <Link to="/book" className="dine-primary-btn">
              + Make a Reservation
            </Link>
          </div>
        </section>

        <section className="my-bookings-summary">
          <div>
            <span className="summary-number">
              {loading ? "—" : bookings.length}
            </span>
            <span className="summary-label">Total Reservations</span>
          </div>

          <div>
            <span className="summary-symbol">✦</span>
            <span className="summary-label">Your personal booking history</span>
          </div>
        </section>

        <section className="my-bookings-list-section">
          <div className="my-bookings-section-heading">
            <div>
              <span className="dine-eyebrow">YOUR BOOKINGS</span>
              <h2>Reservation history</h2>
            </div>
          </div>

          {loading && (
            <div className="my-bookings-state">
              <p>Loading your reservations...</p>
            </div>
          )}

          {!loading && message && (
            <div className="my-bookings-state">
              <p>{message}</p>
            </div>
          )}

          {!loading && !message && bookings.length === 0 && (
            <div className="my-bookings-empty">
              <span>✦</span>
              <h2>Your table is waiting.</h2>
              <p>
                You haven't made a reservation yet. Start planning your
                next dining experience.
              </p>
              <Link to="/book" className="dine-primary-btn">
                Reserve Your First Table →
              </Link>
            </div>
          )}

          {!loading && !message && bookings.length > 0 && (
            <div className="my-bookings-grid">
              {bookings.map((booking) => (
                <article className="my-reservation-card" key={booking._id}>
                  <div className="reservation-card-top">
                    <span className="reservation-tag">
                      ✦ RESERVATION
                    </span>
                    <span className="reservation-id">
                      #{booking._id.slice(-6).toUpperCase()}
                    </span>
                  </div>

                  <div className="reservation-table">
                    <span className="reservation-table-icon">♧</span>
                    <div>
                      <small>YOUR TABLE</small>
                      <h3>Table {booking.table?.tableNumber || "N/A"}</h3>
                    </div>
                  </div>

                  <div className="reservation-details">
                    <div>
                      <small>DATE</small>
                      <strong>{booking.date}</strong>
                    </div>

                    <div>
                      <small>TIME</small>
                      <strong>
                        {booking.time} – {booking.endTime || "N/A"}
                      </strong>
                    </div>

                    <div>
                      <small>GUESTS</small>
                      <strong>
                        {booking.guests} {booking.guests === 1 ? "Guest" : "Guests"}
                      </strong>
                    </div>

                    <div>
                      <small>PHONE</small>
                      <strong>{booking.phone}</strong>
                    </div>
                  </div>

                  <div className="reservation-card-footer">
                    <span>Enjoy your dining experience.</span>
                    {booking.status === "cancelled" ? (
                    <span className="reservation-status cancelled">
                        Cancelled
                    </span>
                    ) : (
                    <button
                        type="button"
                        className="cancel-booking-btn"
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancellingId === booking._id}
                    >
                        {cancellingId === booking._id
                        ? "Cancelling..."
                        : "Cancel Booking"}
                    </button>
)}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
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

export default MyBookings;
