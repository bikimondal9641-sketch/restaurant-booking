const express = require("express");
const Table = require("../models/Table");

const router = express.Router();


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

// Check available tables
router.get("/available", async (req, res) => {
  try {
    const { date, time, guests } = req.query;

    // Find tables that can accommodate the guests
    const suitableTables = await Table.find({
      capacity: { $gte: Number(guests) },
      status: "available",
    }).sort({ capacity: 1 });

    // Get bookings for the requested date and time
    const Booking = require("../models/Booking");

    const bookings = await Booking.find({
      date: date,
      time: time,
    });

    // Get table IDs that are already booked
    const bookedTableIds = bookings
      .filter((booking) => booking.table)
      .map((booking) => booking.table.toString());

    // Remove already-booked tables
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