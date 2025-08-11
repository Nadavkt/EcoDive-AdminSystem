import db from './db.js';

const setupActivitiesTable = async () => {
  try {
    console.log('Creating user_activities table...');
    
    // Create the table
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_activities (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        action VARCHAR(255) NOT NULL,
        details TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create indexes
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id)
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON user_activities(created_at)
    `);

    console.log('Table and indexes created successfully!');

    // Check if sample data already exists
    const existingData = await db.query('SELECT COUNT(*) FROM user_activities');
    
    if (parseInt(existingData.rows[0].count) === 0) {
      console.log('Adding sample data...');
      
      // Add sample data
      await db.query(`
        INSERT INTO user_activities (user_id, user_name, action, details) VALUES
        (1, 'Nadav Kan Tor', 'User Login', 'Admin user logged into the system'),
        (1, 'Nadav Kan Tor', 'Created Event', 'Created new diving event: "Coral Reef Exploration"'),
        (1, 'Nadav Kan Tor', 'Added Team Member', 'Added new team member: John Doe (Viewer)'),
        (1, 'Nadav Kan Tor', 'Updated User Profile', 'Updated profile information for user ID: 5'),
        (1, 'Nadav Kan Tor', 'Deleted Event', 'Deleted event: "Old Diving Trip"'),
        (1, 'Nadav Kan Tor', 'Added Dive Club', 'Added new dive club: "Ocean Explorers Club"'),
        (1, 'Nadav Kan Tor', 'User Login', 'Admin user logged into the system'),
        (1, 'Nadav Kan Tor', 'Created Event', 'Created new diving event: "Deep Sea Adventure"'),
        (1, 'Nadav Kan Tor', 'Updated Team Member', 'Updated role for team member: Jane Smith (Admin)'),
        (1, 'Nadav Kan Tor', 'Deleted User', 'Deleted user account: user@example.com')
      `);
      
      console.log('Sample data added successfully!');
    } else {
      console.log('Sample data already exists, skipping...');
    }

    console.log('Setup completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error setting up activities table:', err);
    process.exit(1);
  }
};

setupActivitiesTable();
