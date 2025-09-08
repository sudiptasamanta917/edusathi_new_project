# Investment Booking System with WhatsApp Business API

A full-stack booking application with WhatsApp Business API integration for investment seminar bookings.

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **WhatsApp Integration**: Meta WhatsApp Business API
- **Environment Management**: dotenv

## Features

### Frontend (React)
- Investment booking form with validation
- Fields: Name, Phone Number (international format), Email, Date & Time
- Real-time validation for phone numbers (+91XXXXXXXXXX format)
- Responsive design with Tailwind CSS

### Backend (Express)
- RESTful API with `/book` endpoint
- MongoDB integration for booking storage
- WhatsApp Business API integration
- Automatic notifications to admin and users

### WhatsApp Integration
- **Admin Notifications**: New booking alerts with booking details
- **User Confirmations**: Booking confirmation messages with images
- Uses Meta WhatsApp Business API v20.0
- Supports image messages with captions

## Environment Setup

### Required Environment Variables

Create a `.env` file in the server directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/edusathi_bookings

# JWT Auth
JWT_ACCESS_SECRET=super_secret_access
JWT_REFRESH_SECRET=super_secret_refresh
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# WhatsApp Business API Configuration (Meta)
META_PHONE_NUMBER_ID=your_business_phone_number_id
META_ACCESS_TOKEN=your_long_lived_access_token
ADMIN_PHONE_NUMBER=919733140877
ADMIN_IMAGE_URL=https://example.com/admin-booking.png
CONFIRMATION_IMAGE_URL=https://example.com/booking-confirmation.jpg
```

### WhatsApp Business API Setup

1. **Create Meta Business Account**: Go to [Meta Business](https://business.facebook.com/)
2. **Set up WhatsApp Business API**: Follow [Meta's documentation](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started)
3. **Get Phone Number ID**: From your WhatsApp Business API dashboard
4. **Generate Access Token**: Create a long-lived access token
5. **Add webhook URL**: Configure webhook for message delivery status (optional)

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- WhatsApp Business API credentials

### Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file with your credentials
cp .env.example .env
# Edit .env with your actual values

# Start the server
npm run dev
```

### Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

## API Endpoints

### POST /api/book
Creates a new booking and sends WhatsApp notifications.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "phoneNumber": "+919876543210",
  "email": "john@example.com",
  "city": "Mumbai",
  "country": "India",
  "date": "2024-01-15",
  "time": "10:00 AM"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "booking": {
    "_id": "...",
    "fullName": "John Doe",
    "phoneNumber": "+919876543210",
    "email": "john@example.com",
    "date": "2024-01-15",
    "time": "10:00 AM",
    "createdAt": "2024-01-10T10:00:00.000Z"
  },
  "whatsapp": {
    "admin": { "success": true },
    "user": { "success": true }
  }
}
```

## WhatsApp Message Format

### Admin Notification
```
📢 New Booking!
👤 Name: John Doe
📱 Phone: +919876543210
✉️ Email: john@example.com
📅 Date: 2024-01-15
```

### User Confirmation
```
✅ Hi John Doe, your booking for 2024-01-15 is confirmed!
We will contact you shortly.
```

## Project Structure

```
edusathi_new_project/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── investment/
│   │   │       └── SeminarBookingDialog.tsx
│   │   ├── pages/
│   │   │   └── Investment/
│   │   │       └── invest.tsx
│   │   └── App.tsx
│   ├── public/
│   │   └── Edusathi-sent.jpeg      # Confirmation image
│   └── package.json
├── server/                          # Express backend
│   ├── controllers/
│   │   └── booking.controller.js
│   ├── models/
│   │   └── Booking.js
│   ├── routes/
│   │   └── booking.routes.js
│   ├── services/
│   │   └── whatsappService.js
│   ├── .env
│   └── package.json
└── README.md
```

## Development Workflow

1. **Start MongoDB**: Ensure MongoDB is running
2. **Start Backend**: `cd server && npm run dev`
3. **Start Frontend**: `cd client && npm run dev`
4. **Test Booking**: Fill out the form and submit
5. **Check WhatsApp**: Verify admin and user receive messages

## Troubleshooting

### Common Issues

1. **WhatsApp messages not sending**
   - Verify Meta API credentials in .env
   - Check phone number format (+country_code + number)
   - Ensure webhook is properly configured

2. **Database connection errors**
   - Check MongoDB URI in .env
   - Ensure MongoDB service is running

3. **Frontend API calls failing**
   - Verify backend server is running on correct port
   - Check CORS configuration

### Phone Number Format
- Must include country code: `+91XXXXXXXXXX`
- Remove spaces, dashes, or parentheses
- Example: `+919876543210` (correct), `9876543210` (incorrect)

## Production Deployment

### Environment Variables for Production
- Use production MongoDB URI
- Generate secure JWT secrets
- Use production WhatsApp Business API credentials
- Set proper CORS origins

### Security Considerations
- Never commit .env files to version control
- Use environment-specific configurations
- Implement rate limiting for API endpoints
- Validate and sanitize all user inputs

## Support

For issues related to:
- **WhatsApp Business API**: [Meta Developer Docs](https://developers.facebook.com/docs/whatsapp)
- **MongoDB**: [MongoDB Documentation](https://docs.mongodb.com/)
- **React**: [React Documentation](https://react.dev/)

## License

This project is licensed under the MIT License.
