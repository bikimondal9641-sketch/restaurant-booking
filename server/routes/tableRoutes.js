
const express = require("express");
const Table = require("../models/Table");
const Booking = require("../models/Booking");

const router = express.Router();

// Create a table
router.post("/", async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;

    const table = new Table({
      tableNumber,
      capacity,
    });

    const savedTable = await table.save();

    res.status(201).json({
      message: "Table created successfully!",
      table: savedTable,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create table",
      error: error.message,
    });
  }
});

// Get all tables
router.get("/", async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get tables",
      error: error.message,
    });
  }
});

// Get available tables for a 60-minute booking slot
router.get("/available", async (req, res) => {
  try {
    const { date, time, guests } = req.query;
    const guestCount = Number(guests);

    // Validate inputs
    if (
      !date ||
      !time ||
      !guests ||
      !Number.isInteger(guestCount) ||
      guestCount < 1
    ) {
      return res.status(400).json({
        message: "Please provide a valid date, time, and number of guests.",
      });
    }

    // Booking starts on the hour.
    // Allow start times from 00:00 through 22:00.
    if (!/^(?:[01]\d|2[0-2]):00$/.test(time)) {
      return res.status(400).json({
        message: "Choose a booking time on the hour, from 00:00 to 22:00.",
      });
    }

    // Calculate the end time: 60 minutes after the start
    const [hours, minutes] = time.split(":").map(Number);
    const endDate = new Date(2000, 0, 1, hours, minutes + 60);

    const endTime =
      String(endDate.getHours()).padStart(2, "0") +
      ":" +
      String(endDate.getMinutes()).padStart(2, "0");

    // Find tables with enough seats
    const suitableTables = await Table.find({
      capacity: { $gte: guestCount },
      status: "available",
    }).sort({ capacity: 1 });

    // Find bookings that overlap the requested 60-minute slot
    const bookings = await Booking.find({
      date,
      time: { $lt: endTime },
      endTime: { $gt: time },
    });

    // Collect table IDs that are already booked
    const bookedTableIds = bookings
      .filter((booking) => booking.table)
      .map((booking) => booking.table.toString());

    // Return tables that are not already booked
    const availableTables = suitableTables.filter(
      (table) => !bookedTableIds.includes(table._id.toString())
    );

    res.json(availableTables);
  } catch (error) {
    res.status(500).json({
      message: "Failed to check available tables",
      error: error.message,
    });
  }
});

module.exports = router;
