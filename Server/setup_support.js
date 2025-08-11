import db from './db.js';

const setupSupportTable = async () => {
  try {
    console.log('Creating support_messages table...');
    
    // Create the table
    await db.query(`
      CREATE TABLE IF NOT EXISTS support_messages (
        id SERIAL PRIMARY KEY,
        category VARCHAR(50) NOT NULL,
        priority VARCHAR(20) NOT NULL,
        subject VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        user_email VARCHAR(255),
        timestamp TIMESTAMP DEFAULT NOW(),
        user_agent TEXT,
        current_page VARCHAR(255),
        status VARCHAR(20) DEFAULT 'pending',
        admin_response TEXT,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create indexes
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_support_messages_status ON support_messages(status)
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_support_messages_timestamp ON support_messages(timestamp)
    `);

    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_support_messages_category ON support_messages(category)
    `);

    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_support_messages_priority ON support_messages(priority)
    `);

    console.log('Table and indexes created successfully!');

    // Check if sample data already exists
    const existingData = await db.query('SELECT COUNT(*) FROM support_messages');
    
    if (parseInt(existingData.rows[0].count) === 0) {
      console.log('Adding sample data...');
      
      // Add sample data
      await db.query(`
        INSERT INTO support_messages (category, priority, subject, message, user_email, status) VALUES
        ('bug', 'high', 'Calendar not loading events', 'The calendar page is not displaying any events. I can see the calendar interface but no events are shown.', 'user@example.com', 'pending'),
        ('feature', 'medium', 'Request for export functionality', 'It would be great to have an export feature for the user list to CSV format.', 'admin@example.com', 'pending'),
        ('help', 'low', 'How to add team members', 'I need help understanding how to add new team members to the system.', 'manager@example.com', 'pending')
      `);
      
      console.log('Sample data added successfully!');
    } else {
      console.log('Sample data already exists, skipping...');
    }

    console.log('Support table setup completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error setting up support table:', err);
    process.exit(1);
  }
};

setupSupportTable();
