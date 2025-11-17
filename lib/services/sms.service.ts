import twilio from 'twilio';

// Initialize Twilio client (will be configured when credentials are provided)
let twilioClient: any = null;

// Initialize Twilio if credentials are available
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  } catch (error) {
    console.log('Twilio initialization skipped - credentials not configured');
  }
}

// Format phone number for Indian numbers
function formatPhoneNumber(phone: string): string {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Add +91 if not present
  if (cleaned.startsWith('91')) {
    return `+${cleaned}`;
  } else if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }

  return `+${cleaned}`;
}

// Send OTP via SMS
export async function sendOTP(phone: string, otp: string): Promise<boolean> {
  try {
    const formattedPhone = formatPhoneNumber(phone);

    // In development, just log the OTP
    if (process.env.NODE_ENV === 'development' || !twilioClient) {
      console.log(`
        ========================================
        📱 SMS OTP (Development Mode)
        ========================================
        To: ${formattedPhone}
        OTP Code: ${otp}
        Valid for: 10 minutes
        ========================================
      `);
      return true;
    }

    // In production, send actual SMS
    const message = await twilioClient.messages.create({
      body: `Your BLR Transit verification code is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    console.log(`SMS sent successfully: ${message.sid}`);
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    // In case of error, log OTP for development
    console.log(`Failed to send SMS. OTP for ${phone}: ${otp}`);
    return false;
  }
}

// Verify OTP (this is handled in auth.service.ts, but we can have a utility here)
export function verifyOTP(inputOTP: string, storedOTP: string, expiry: Date): boolean {
  // Check if OTP matches
  if (inputOTP !== storedOTP) {
    return false;
  }

  // Check if OTP is expired
  if (new Date() > expiry) {
    return false;
  }

  return true;
}

// Send general SMS notification
export async function sendSMS(phone: string, message: string): Promise<boolean> {
  try {
    const formattedPhone = formatPhoneNumber(phone);

    // In development, just log the message
    if (process.env.NODE_ENV === 'development' || !twilioClient) {
      console.log(`
        ========================================
        📱 SMS Notification (Development Mode)
        ========================================
        To: ${formattedPhone}
        Message: ${message}
        ========================================
      `);
      return true;
    }

    // In production, send actual SMS
    const smsMessage = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    console.log(`SMS sent successfully: ${smsMessage.sid}`);
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
}

// Send booking confirmation SMS
export async function sendBookingConfirmation(
  phone: string,
  bookingCode: string,
  route: string,
  time: string
): Promise<boolean> {
  const message = `BLR Transit Booking Confirmed!
Booking ID: ${bookingCode}
Route: ${route}
Time: ${time}
Show this SMS to the driver.`;

  return sendSMS(phone, message);
}

// Send trip reminder SMS
export async function sendTripReminder(
  phone: string,
  bookingCode: string,
  time: string
): Promise<boolean> {
  const message = `BLR Transit Reminder: Your bus departs at ${time}.
Booking ID: ${bookingCode}
Please arrive 10 minutes early.`;

  return sendSMS(phone, message);
}

// Send cancellation SMS
export async function sendCancellationSMS(
  phone: string,
  bookingCode: string,
  refundAmount?: number
): Promise<boolean> {
  let message = `BLR Transit: Booking ${bookingCode} has been cancelled.`;

  if (refundAmount) {
    message += ` Refund of ₹${refundAmount} will be processed within 3-5 business days.`;
  }

  return sendSMS(phone, message);
}