import bcrypt from 'bcrypt';
import db from '../db.js';

async function createAdminUser() {
    try {
        const password = 'Admin123!';
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const result = await db.query(
            `INSERT INTO team_members (first_name, last_name, email, password, role)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (email) DO UPDATE
             SET password = $4
             RETURNING id, first_name, last_name, email, role`,
            ['Admin', 'User', 'admin@ecodive.com', hashedPassword, 'Admin']
        );

        console.log('Admin user created/updated successfully:', result.rows[0]);
    } catch (err) {
        console.error('Error creating admin user:', err);
    } finally {
        process.exit();
    }
}

createAdminUser(); 