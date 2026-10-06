const express = require("express");
const Booking = require("../models/Booking");
const Table = require("../models/Table");

const router = express.Router();

// Create a new booking
router.post("/", async (req, res) => {
  try {
    const { name, phone, date, time, guests, tableId } = req.body;

    // Find tables that can accommodate the number of guests
    const suitableTables = await Table.find({
      capacity: { $gte: Number(guests) },
      status: "available",
    }).sort({ capacity: 1 });

    // Find bookings for the same date and time
    const existingBookings = await Booking.find({
      date: date,
      time: time,
    });

    // Get IDs of tables already booked for this slot
    const bookedTableIds = existingBookings
      .filter((booking) => booking.table)
      .map((booking) => booking.table.toString());

    // Check whether the selected table exists
    const selectedTable = await Table.findById(tableId);

    if (!selectedTable) {
      return res.status(400).json({
        message: "Selected table does not exist.",
      });
    }

    // Check table capacity
    if (selectedTable.capacity < Number(guests)) {
      return res.status(400).json({
        message: "Selected table cannot accommodate this number of guests.",
      });
    }

    // Check whether the selected table is physically available
    if (selectedTable.status !== "available") {
      return res.status(400).json({
        message: "Selected table is unavailable.",
      });
    }

    // Check whether the selected table is already booked
    if (bookedTableIds.includes(selectedTable._id.toString())) {
      return res.status(400).json({
        message: "Selected table is already booked for this date and time.",
      });
    }

    // Create booking with assigned table
    const booking = new Booking({
      name,
      phone,
      date,
      time,
      guests,
      table: selectedTable._id,
    });

    const savedBooking = await booking.save();

    res.status(201).json({
      message: "Booking created successfully!",
      booking: savedBooking,
      assignedTable: selectedTable.tableNumber,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create booking",
      error: error.message,
    });
  }
});

module.exports = router;