import axios from 'axios';

class WhatsAppService {
  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL;
    this.apiToken = process.env.WHATSAPP_API_TOKEN;
    this.adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER;
    this.adminImageUrl = process.env.ADMIN_IMAGE_URL;
    this.confirmationImageUrl = process.env.CONFIRMATION_IMAGE_URL;
  }

  // Format phone number for WhatsApp (international format)
  formatPhoneNumber(phoneNumber) {
    // Remove spaces, dashes, parentheses but keep + and digits
    let cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    // If it already starts with +, return as is
    if (cleaned.startsWith('+')) {
      return cleaned.substring(1); // Remove + for WhatsApp API
    }
    
    // Remove any leading zeros
    cleaned = cleaned.replace(/^0+/, '');
    
    // Add country code if not present (assuming Indian numbers for 10-digit numbers)
    if (cleaned.length === 10 && !cleaned.startsWith('91')) {
      cleaned = '91' + cleaned;
    }
    
    return cleaned;
  }

  // Send WhatsApp message with image using msgwapi.com
  async sendWhatsAppMessage(to, caption, imageUrl) {
    try {
      const formattedNumber = this.formatPhoneNumber(to);
      
      const params = new URLSearchParams({
        receiver: formattedNumber,
        msgtext: caption,
        token: this.apiToken,
        mediaurl: imageUrl
      });

      const fullUrl = `${this.apiUrl}?${params.toString()}`;

      console.log('Sending WhatsApp message via msgwapi:', {
        to: formattedNumber,
        caption: caption.substring(0, 100) + '...',
        imageUrl: imageUrl
      });

      const response = await axios.get(fullUrl);

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
    const { fullName, phoneNumber, email, date } = bookingData;

    const caption = `📢 New Booking!
👤 Name: ${fullName}
📱 Phone: ${phoneNumber}
✉️ Email: ${email}
📅 Date: ${date}`;

    return await this.sendWhatsAppMessage(this.adminPhoneNumber, caption, this.adminImageUrl);
  }

  // Send confirmation message to user
  async sendUserConfirmation(bookingData) {
    const { fullName, phoneNumber, date } = bookingData;

    const caption = `✅ Hi ${fullName}, your booking for ${date} is confirmed!
We will contact you shortly.

📞 Contact: Giri Dutta
📱 Phone: 919733140877
🌐 Website: edusathi.net`;

    console.log('Sending user confirmation with image:', {
      phoneNumber,
      imageUrl: this.confirmationImageUrl,
      caption: caption.substring(0, 50) + '...'
    });

    const result = await this.sendWhatsAppMessage(phoneNumber, caption, this.confirmationImageUrl);
    
    if (!result.success) {
      console.error('Failed to send image message to user, trying text-only fallback');
      // Fallback: send text message with image URL
      const textMessage = `${caption}\n\n📸 View confirmation image: ${this.confirmationImageUrl}`;
      return await this.sendTextMessage(phoneNumber, textMessage);
    }
    
    return result;
  }

  // Send text-only message as fallback
  async sendTextMessage(to, message) {
    try {
      const formattedNumber = this.formatPhoneNumber(to);
      
      const params = new URLSearchParams({
        receiver: formattedNumber,
        msgtext: message,
        token: this.apiToken
      });

      const fullUrl = `${this.apiUrl}?${params.toString()}`;

      console.log('Sending text-only WhatsApp message:', {
        to: formattedNumber,
        message: message.substring(0, 100) + '...'
      });

      const response = await axios.get(fullUrl);

      console.log('Text message sent successfully:', response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error sending text message:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
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