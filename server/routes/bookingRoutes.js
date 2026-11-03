
const express = require("express");
const Booking = require("../models/Booking");
const Table = require("../models/Table");

const {
  protect,
  customerOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE BOOKING - Logged-in customers only
router.post("/", protect, customerOnly, async (req, res) => {
  try {
    const { name, phone, date, time, guests, tableId } = req.body;
    const guestCount = Number(guests);

    // Validate required fields
    if (
      !name ||
      !phone ||
      !date ||
      !time ||
      !tableId ||
      !Number.isInteger(guestCount) ||
      guestCount < 1
    ) {
      return res.status(400).json({
        message: "Please provide all booking details correctly.",
      });
    }

    // Validate hourly booking time
    if (!/^(?:[01]\d|2[0-2]):00$/.test(time)) {
      return res.status(400).json({
        message: "Choose a booking time on the hour, from 00:00 to 22:00.",
      });
    }

    // Calculate booking end time (60 minutes)
    const [hours, minutes] = time.split(":").map(Number);
    const endDate = new Date(2000, 0, 1, hours, minutes + 60);

    const endTime =
      String(endDate.getHours()).padStart(2, "0") +
      ":" +
      String(endDate.getMinutes()).padStart(2, "0");

    // Find selected table
    const selectedTable = await Table.findById(tableId);

    if (!selectedTable) {
      return res.status(400).json({
        message: "Selected table does not exist.",
      });
    }

    // Check table capacity
    if (selectedTable.capacity < guestCount) {
      return res.status(400).json({
        message: "Selected table cannot accommodate these guests.",
      });
    }

    // Check table status
    if (selectedTable.status !== "available") {
      return res.status(400).json({
        message: "Selected table is unavailable.",
      });
    }

    // Check overlapping bookings
    const overlappingBookings = await Booking.find({
      date,
      status: { $ne: "cancelled" },
      table: selectedTable._id,
      time: { $lt: endTime },
      endTime: { $gt: time },
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({
        message: "This table is already booked for that time slot.",
      });
    }

    // Create booking linked to the logged-in customer
    const booking = new Booking({
      name,
      phone,
      date,
      time,
      endTime,
      guests: guestCount,
      table: selectedTable._id,

      // Get customer ID from verified JWT token
      user: req.user.userId,
    });

    const savedBooking = await booking.save();

    res.status(201).json({
      message: "Booking created successfully!",
      booking: savedBooking,
      assignedTable: selectedTable.tableNumber,
    });

  } catch (error) {
    console.error("Booking creation error:", error);

    res.status(500).json({
      message: "Failed to create booking.",
    });
  }
});


 // GET BOOKINGS OF THE LOGGED-IN CUSTOMER
router.get("/my", protect, customerOnly, async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.userId,
    })
      .populate("table", "tableNumber capacity")
      .sort({ date: -1, time: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Fetch customer bookings error:", error);

    res.status(500).json({
      message: "Failed to retrieve your bookings.",
    });
  }
});

// CANCEL A CUSTOMER'S OWN BOOKING
router.patch("/:id/cancel", protect, customerOnly, async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        message: "Invalid booking ID.",
      });
    }

    const booking = await Booking.findOne({
      _id: id,
      user: req.user.userId,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found or you are not authorized to cancel it.",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        message: "This booking has already been cancelled.",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    return res.status(200).json({
      message: "Booking cancelled successfully.",
      booking,
    });
  } catch (error) {
    console.error("Booking cancellation error:", error);

    return res.status(500).json({
      message: "Failed to cancel booking.",
    });
  }
});


module.exports = router;
