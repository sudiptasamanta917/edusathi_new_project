import axios from 'axios';

class WhatsAppService {
  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL;
    this.token = process.env.WHATSAPP_TOKEN;
    this.adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER;
  }

  // Format phone number to ensure it has country code
  formatPhoneNumber(phoneNumber) {
    // Remove all non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // Add country code if not present (assuming Indian numbers)
    if (!cleaned.startsWith('91') && cleaned.length === 10) {
      cleaned = '91' + cleaned;
    }
    
    return cleaned;
  }

  // Send WhatsApp message using msgwapi.com
  async sendMessage(to, message) {
    try {
      const formattedNumber = this.formatPhoneNumber(to);
      
      const params = new URLSearchParams({
        receiver: formattedNumber,
        msgtext: message,
        token: this.token
      });

      const response = await axios.get(`${this.apiUrl}?${params.toString()}`);

      console.log('WhatsApp message sent successfully:', response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error sending WhatsApp message:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  // Send booking notification to admin
  async sendAdminNotification(bookingData) {
    const { fullName, phoneNumber, email, city, country, date, time } = bookingData;
    const formattedDate = new Date(date).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const message = `🎯 *New Investment Seminar Booking*

👤 *Name:* ${fullName}
📧 *Email:* ${email}
📱 *Phone:* ${phoneNumber}
🏙️ *City:* ${city}
🌍 *Country:* ${country}
📅 *Date:* ${formattedDate}
⏰ *Time:* ${time}

💼 *Platform:* EDUSATHI.NET Investment Seminar
🔗 *Source:* Investment Landing Page
📝 *Status:* New Booking

Please contact this person to confirm their investment seminar slot.`;

    return await this.sendMessage(this.adminPhoneNumber, message);
  }

  // Send confirmation message to user
  async sendUserConfirmation(bookingData) {
    const { fullName, phoneNumber, date, time } = bookingData;
    const formattedDate = new Date(date).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const message = `✅ *Investment Seminar Booking Confirmed*

Hi ${fullName}! 👋

Your booking for the EDUSATHI.NET Investment Seminar has been successfully registered.

📋 *Booking Details:*
📅 Date: ${formattedDate}
⏰ Time: ${time}

🎯 *What's Next?*
• Our team will contact you within 24 hours
• You'll receive joining instructions via email
• Prepare your questions about investment opportunities

💡 *About the Seminar:*
• Learn about EDUSATHI.NET's growth potential
• Understand investment opportunities
• Network with other potential investors

Thank you for your interest in EDUSATHI.NET! 🚀

For any queries, reply to this message or call our support team.

Best regards,
EDUSATHI.NET Team`;

    return await this.sendMessage(phoneNumber, message);
  }

  // Send both admin and user messages
  async sendBookingNotifications(bookingData) {
    const results = {
      admin: { success: false },
      user: { success: false }
    };

    try {
      // Send admin notification
      const adminResult = await this.sendAdminNotification(bookingData);
      results.admin = adminResult;

      // Send user confirmation
      const userResult = await this.sendUserConfirmation(bookingData);
      results.user = userResult;

      return results;
    } catch (error) {
      console.error('Error sending booking notifications:', error);
      return results;
    }
  }
}

export default new WhatsAppService();
