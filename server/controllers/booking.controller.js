import Booking from '../models/Booking.js';
import whatsappService from '../services/whatsappService.js';

// Validate phone number format
const validatePhoneNumber = (phoneNumber) => {
  // Remove spaces, dashes, parentheses but keep + sign
  const cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');
  
  // Check if it matches international format or local format
  const phoneRegex = /^[\+]?[1-9]\d{8,14}$/;
  
  return phoneRegex.test(cleaned);
};

// Validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Create new booking
const createBooking = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, city, country, date, time } = req.body;

    // Validation
    if (!fullName || !email || !phoneNumber || !city || !country || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid phone number (10-15 digits)'
      });
    }

    // Validate date is in the future
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Booking date must be in the future'
      });
    }

    // Check for duplicate booking (same email and date)
    const existingBooking = await Booking.findOne({
      email: email.toLowerCase(),
      date: bookingDate
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: 'You already have a booking for this date'
      });
    }

    // Create booking
    const bookingData = {
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phoneNumber: phoneNumber.trim(),
      city: city.trim(),
      country: country.trim(),
      date: bookingDate,
      time: time.trim()
    };

    const booking = new Booking(bookingData);
    await booking.save();

    // Send WhatsApp notifications
    let whatsappResults = { admin: { success: false }, user: { success: false } };
    
    try {
      whatsappResults = await whatsappService.sendBookingNotifications(bookingData);
      
      // Update booking with WhatsApp status
      booking.whatsappSent.admin = whatsappResults.admin.success;
      booking.whatsappSent.user = whatsappResults.user.success;
      await booking.save();
    } catch (whatsappError) {
      console.error('WhatsApp notification error:', whatsappError);
      // Don't fail the booking if WhatsApp fails
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        bookingId: booking._id,
        fullName: booking.fullName,
        email: booking.email,
        date: booking.date,
        time: booking.time,
        status: booking.status,
        whatsappStatus: {
          adminNotified: whatsappResults.admin.success,
          userNotified: whatsappResults.user.success
        }
      }
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
};

// Get all bookings (admin only)
const getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, date } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (date) {
      const searchDate = new Date(date);
      query.date = {
        $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
        $lt: new Date(searchDate.setHours(23, 59, 59, 999))
      };
    }

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalBookings: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, confirmed, or cancelled'
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });

  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus
};
