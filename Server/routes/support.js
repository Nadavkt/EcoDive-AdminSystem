import express from 'express';
import nodemailer from 'nodemailer';
import db from '../db.js';

const router = express.Router();

// Create nodemailer transporter (you'll need to configure this with your email service)
const createTransporter = () => {
  // For now, using a placeholder configuration
  // You'll need to replace this with your actual email service credentials
  return nodemailer.createTransporter({
    service: 'gmail', // or your preferred email service
    auth: {
      user: process.env.SUPPORT_EMAIL || 'your-support-email@gmail.com',
      pass: process.env.SUPPORT_EMAIL_PASSWORD || 'your-app-password'
    }
  });
};

// Send support message
router.post('/support/send-message', async (req, res) => {
  try {
    const {
      category,
      priority,
      subject,
      message,
      email,
      timestamp,
      userAgent,
      currentPage
    } = req.body;

    // Validate required fields
    if (!category || !priority || !subject || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    // Store the support message in database
    const result = await db.query(
      `INSERT INTO support_messages 
       (category, priority, subject, message, user_email, timestamp, user_agent, current_page, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING id`,
      [category, priority, subject, message, email || null, timestamp, userAgent, currentPage, 'pending']
    );

    const messageId = result.rows[0].id;

    // Prepare email content
    const emailSubject = `[${priority.toUpperCase()}] Support Request: ${subject}`;
    const emailBody = `
      <h2>New Support Message</h2>
      <p><strong>Message ID:</strong> ${messageId}</p>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Priority:</strong> ${priority}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
        ${message.replace(/\n/g, '<br>')}
      </div>
      ${email ? `<p><strong>User Email:</strong> ${email}</p>` : ''}
      <p><strong>Timestamp:</strong> ${new Date(timestamp).toLocaleString()}</p>
      <p><strong>Current Page:</strong> ${currentPage}</p>
      <p><strong>User Agent:</strong> ${userAgent}</p>
      <hr>
      <p><em>This message was sent from the admin system support form.</em></p>
    `;

    // Send email (commented out until you configure email credentials)
    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: process.env.SUPPORT_EMAIL || 'your-support-email@gmail.com',
        to: process.env.SUPPORT_EMAIL || 'your-support-email@gmail.com', // You can change this to your desired support email
        subject: emailSubject,
        html: emailBody
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails, just log it
    }

    res.status(201).json({ 
      message: 'Support message sent successfully',
      messageId: messageId
    });

  } catch (err) {
    console.error('Error sending support message:', err);
    res.status(500).json({ 
      error: 'Failed to send support message' 
    });
  }
});

// Get all support messages (for admin dashboard)
router.get('/support/messages', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT * FROM support_messages 
      ORDER BY timestamp DESC 
      LIMIT 50
    `);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching support messages:', err);
    res.status(500).json({ 
      error: 'Failed to fetch support messages' 
    });
  }
});

// Update support message status
router.put('/support/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_response } = req.body;

    const result = await db.query(
      'UPDATE support_messages SET status = $1, admin_response = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [status, admin_response, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Support message not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating support message:', err);
    res.status(500).json({ 
      error: 'Failed to update support message' 
    });
  }
});

export default router;
