import { useState } from "react";
import "./App.css";

function App() {
  const [showBooking, setShowBooking] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: 1,
  });

  const [message, setMessage] = useState("");
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const checkAvailability = async () => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/tables/available?date=${formData.date}&time=${formData.time}&guests=${formData.guests}`
    );

    const data = await response.json();

    if (response.ok) {
      setAvailableTables(data);
      setMessage("");
    } else {
      setMessage("❌ Failed to check availability.");
    }
  } catch (error) {
    setMessage("❌ Cannot connect to the server.");
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTable) {
      setMessage("❌ Please select a table first.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tableId: selectedTable._id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Booking created successfully!");

        setFormData({
          name: "",
          phone: "",
          date: "",
          time: "",
          guests: 1,
        });
        setSelectedTable(null);
        setAvailableTables([]);
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (error) {
      setMessage("❌ Cannot connect to the server.");
    }
  };

  return (
    <div>
      <nav>
        <h2>🍽️ DineEase</h2>

        <div>
          <button>Home</button>
          <button>Login</button>
        </div>
      </nav>

      <main>
        {!showBooking ? (
          <>
            <h1>Reserve Your Table</h1>

            <p>
              Enjoy delicious food without waiting for a table.
            </p>

            <button onClick={() => setShowBooking(true)}>
              Book a Table
            </button>
          </>
        ) : (
          <div className="booking-container">
            <h1>Book Your Table</h1>

            <form onSubmit={handleSubmit}>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />

              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />

              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />

              <label>Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />

              <label>Number of Guests</label>
              <input
                type="number"
                name="guests"
                min="1"
                max="20"
                value={formData.guests}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={checkAvailability}
              >
                Check Available Tables
              </button>
              <button type="submit">
                Reserve Table
              </button>
              {message && <p>{message}</p>}
            </form>

            {availableTables.length > 0 && (
              <div>
                <h2>Available Tables</h2>

                {availableTables.map((table) => (
                  <button
                    type="button"
                    key={table._id}
                    onClick={() => setSelectedTable(table)}
                    style={{
                      backgroundColor:
                        selectedTable?._id === table._id ? "green" : "white",
                      color:
                        selectedTable?._id === table._id ? "white" : "black",
                      border: "2px solid green",
                      padding: "15px",
                      margin: "5px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Table {table.tableNumber} — {table.capacity} seats
                  </button>
                ))}
              </div>
            )}

            {selectedTable && (
              <p>
                Selected Table: {selectedTable.tableNumber}
              </p>
            )}
            <button
              className="back-button"
              onClick={() => setShowBooking(false)}
            >
              ← Back
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;