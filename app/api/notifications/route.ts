import { NextRequest } from 'next/server';
import { sendEmail } from '@/lib/email/service';

export async function POST(request: NextRequest) {
  try {
    const { type, recipient, data } = await request.json();

    if (!type || !recipient) {
      return Response.json(
        { error: 'Missing required fields: type and recipient' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'booking_confirmation':
        result = await handleBookingConfirmation(recipient, data);
        break;
      case 'booking_reminder':
        result = await handleBookingReminder(recipient, data);
        break;
      case 'cancellation_confirmation':
        result = await handleCancellationConfirmation(recipient, data);
        break;
      case 'review_request':
        result = await handleReviewRequest(recipient, data);
        break;
      case 'admin_notification':
        result = await handleAdminNotification(recipient, data);
        break;
      case 'pickup_reminder':
        result = await handlePickupReminder(recipient, data);
        break;
      case 'driver_contact':
        result = await handleDriverContact(recipient, data);
        break;
      default:
        return Response.json(
          { error: `Unknown notification type: ${type}` },
          { status: 400 }
        );
    }

    if (!result.success) {
      return Response.json(
        { error: (result as any).error || 'Failed to send notification' },
        { status: 500 }
      );
    }

    return Response.json({ 
      message: 'Notification sent successfully',
      notificationId: 'notification_' + Date.now()
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Handle booking confirmation (email only - all payments made upon arrival)
async function handleBookingConfirmation(recipient: any, data: any) {
  const { customerEmail, customerName, serviceTitle, bookingDate, bookingTime, bookingReference } = data;

  const promises = [];

  // Send email confirmation
  if (customerEmail) {
    const subject = `Your Booking Confirmation - ${bookingReference}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1A2332;">Booking Confirmation</h1>
        <p>Dear ${customerName},</p>
        <p>Thank you for booking with DR All Season Travel! Your booking has been confirmed.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #1A2332; margin-top: 0;">Booking Details</h2>
          <p><strong>Service:</strong> ${serviceTitle}</p>
          <p><strong>Date:</strong> ${bookingDate}</p>
          <p><strong>Time:</strong> ${bookingTime}</p>
          <p><strong>Booking Reference:</strong> ${bookingReference}</p>
        </div>
        
        <div style="background-color: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
          <h3 style="color: #2e7d32; margin-top: 0;">Payment Information</h3>
          <p style="margin: 0;"><strong>No upfront payment required!</strong></p>
          <p style="margin: 5px 0 0 0;">You can pay upon arrival using credit card (Visa, Mastercard, American Express) or cash.</p>
        </div>
        
        <p>If you have any questions or need to make changes to your booking, please contact us.</p>
        
        <p>Best regards,<br/>The DR All Season Travel Team</p>
      </div>
    `;

    promises.push(
      sendEmail({
        to: customerEmail,
        subject,
        html,
        type: 'booking_confirmation',
      })
    );
  }

  const results = await Promise.allSettled(promises);
  const hasSuccess = results.some(result => result.status === 'fulfilled' && result.value.success);
  
  return { success: hasSuccess, error: !hasSuccess ? 'Failed to send booking confirmation notifications' : undefined };
}

// Handle booking reminder (email only)
async function handleBookingReminder(recipient: any, data: any) {
  const { customerEmail, customerName, serviceTitle, bookingDate, bookingTime } = data;

  const promises = [];

  // Send email reminder
  if (customerEmail) {
    const subject = `Reminder: Your Booking Tomorrow - ${serviceTitle}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1A2332;">Booking Reminder</h1>
        <p>Dear ${customerName},</p>
        <p>This is a reminder that your booking for "${serviceTitle}" is tomorrow.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #1A2332; margin-top: 0;">Booking Details</h2>
          <p><strong>Service:</strong> ${serviceTitle}</p>
          <p><strong>Date:</strong> ${bookingDate}</p>
          <p><strong>Time:</strong> ${bookingTime}</p>
        </div>
        
        <p>Please be ready at the agreed pickup time. If you need to make changes, please contact us.</p>
      </div>
    `;

    promises.push(
      sendEmail({
        to: customerEmail,
        subject,
        html,
        type: 'booking_reminder',
      })
    );
  }

  const results = await Promise.allSettled(promises);
  const hasSuccess = results.some(result => result.status === 'fulfilled');
  
  return { success: hasSuccess };
}

// Handle cancellation confirmation
async function handleCancellationConfirmation(recipient: any, data: any) {
  const { customerEmail, customerName, serviceTitle, bookingDate, bookingReference } = data;

  if (!customerEmail) {
    return { success: false, error: 'Email is required for cancellation confirmation' };
  }

  const subject = `Booking Cancelled - ${bookingReference}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1A2332;">Booking Cancelled</h1>
      <p>Dear ${customerName},</p>
      <p>Your booking for "${serviceTitle}" on ${bookingDate} has been cancelled.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #1A2332; margin-top: 0;">Booking Details</h2>
        <p><strong>Service:</strong> ${serviceTitle}</p>
        <p><strong>Date:</strong> ${bookingDate}</p>
        <p><strong>Booking Reference:</strong> ${bookingReference}</p>
      </div>
      
      <p>If you need to make a new booking, please visit our website.</p>
    </div>
  `;

  return sendEmail({
    to: customerEmail,
    subject,
    html,
    type: 'cancellation_confirmation',
  });
}

// Handle review request
async function handleReviewRequest(recipient: any, data: any) {
  const { customerEmail, customerName, serviceTitle, bookingDate } = data;

  if (!customerEmail) {
    return { success: false, error: 'Email is required for review request' };
  }

  const subject = `How was your experience with ${serviceTitle}?`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1A2332;">We'd Love Your Feedback</h1>
      <p>Dear ${customerName},</p>
      <p>Thank you for choosing D.R All Season Travel for your "${serviceTitle}" on ${bookingDate}.</p>
      <p>We hope you enjoyed your experience and would love to hear your feedback.</p>
      
      <div style="text-align: center; margin: 20px 0;">
        <a href="#" style="background-color: #00B4D8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Leave a Review</a>
      </div>
      
      <p>Your feedback helps us improve our services for future customers.</p>
    </div>
  `;

  return sendEmail({
    to: customerEmail,
    subject,
    html,
    type: 'review_request',
  });
}

// Handle admin notification
async function handleAdminNotification(recipient: any, data: any) {
  const { adminEmail, subject, message } = data;

  if (!adminEmail) {
    return { success: false, error: 'Admin email is required for admin notification' };
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1A2332;">Admin Notification</h1>
      <p>${message}</p>
    </div>
  `;

  return sendEmail({
    to: adminEmail,
    subject,
    html,
    type: 'admin_notification',
  });
}

// Handle pickup reminder (email only)
async function handlePickupReminder(recipient: any, data: any) {
  const { customerEmail, customerName, serviceTitle, pickupTime, pickupLocation } = data;

  if (!customerEmail) {
    return { success: false, error: 'Email is required for pickup reminder' };
  }

  const subject = `Pickup Reminder - ${serviceTitle}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1A2332;">Pickup Reminder</h1>
      <p>Dear ${customerName},</p>
      <p>Your driver will arrive soon for your ${serviceTitle} experience.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #1A2332; margin-top: 0;">Pickup Details</h2>
        <p><strong>Time:</strong> ${pickupTime}</p>
        <p><strong>Location:</strong> ${pickupLocation}</p>
      </div>
      
      <p>Please be ready at the pickup location. Your driver will contact you upon arrival.</p>
    </div>
  `;

  return sendEmail({
    to: customerEmail,
    subject,
    html,
    type: 'pickup_reminder',
  });
}

// Handle driver contact info (email only)
async function handleDriverContact(recipient: any, data: any) {
  const { customerEmail, customerName, serviceTitle, driverName, driverPhone } = data;

  if (!customerEmail) {
    return { success: false, error: 'Email is required for driver contact info' };
  }

  const subject = `Your Driver Contact Information - ${serviceTitle}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1A2332;">Driver Contact Information</h1>
      <p>Dear ${customerName},</p>
      <p>Here is your driver's contact information for your ${serviceTitle} experience.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #1A2332; margin-top: 0;">Driver Details</h2>
        <p><strong>Name:</strong> ${driverName}</p>
        <p><strong>Phone:</strong> ${driverPhone}</p>
      </div>
      
      <p>If you need to contact your driver, please call or WhatsApp the number above.</p>
    </div>
  `;

  return sendEmail({
    to: customerEmail,
    subject,
    html,
    type: 'driver_contact',
  });
}