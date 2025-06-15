import express from 'express';
import db from '../db.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// GET /team-members
router.get('/team-members', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM team_members ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching team members:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login route for team members
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt:', { email }); // Debug log

    // Validate required fields
    if (!email || !password) {
        console.log('Missing credentials'); // Debug log
        return res.status(400).json({ 
            error: 'Email and password are required.' 
        });
    }

    try {
        // Find team member by email
        const result = await db.query(
            'SELECT * FROM team_members WHERE email = $1',
            [email]
        );
        console.log('User found:', result.rows.length > 0); // Debug log

        if (result.rows.length === 0) {
            return res.status(401).json({ 
                error: 'Invalid email or password.' 
            });
        }

        const teamMember = result.rows[0];
        console.log('Attempting password comparison'); // Debug log

        // Compare password with hashed password
        const passwordMatch = await bcrypt.compare(password, teamMember.password);
        console.log('Password match:', passwordMatch); // Debug log

        if (!passwordMatch) {
            return res.status(401).json({ 
                error: 'Invalid email or password.' 
            });
        }

        // Don't send the password back to the client
        const { password: _, ...teamMemberWithoutPassword } = teamMember;

        res.json({
            message: 'Login successful',
            user: teamMemberWithoutPassword
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;