import express from 'express';
import db from '../db.js';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG/PNG allowed.'));
    }
  }
});

// GET /team-members/me - Get current user info
router.get('/team-members/me', async (req, res) => {
    try {
        // For now, return a mock admin user
        // In a real application, this would get the user from the session/token
        res.json({
            id: 1,
            first_name: 'Nadav',
            last_name: 'Kan Tor',
            email: 'admin@ecodive.com',
            role: 'admin'  
        });
    } catch (err) {
        console.error('Error fetching current user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /team-members - Create new team member
router.post('/team-members', upload.single('profile_image'), async (req, res) => {
    console.log('🟡 Incoming request to /team-members');
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);
    const { first_name, last_name, email, password, role } = req.body;
    const profile_image = req.file ? req.file.path : null;

    // Validate required fields
    if (!first_name || !last_name || !email || !password || !role) {
        return res.status(400).json({
        error: 'First name, last name, email, password, and role are required.'
        });
    }

    try {
        // Check if email already exists
        const existingUser = await db.query(
        'SELECT * FROM team_members WHERE email = $1',
        [email]
        );

        if (existingUser.rows.length > 0) {
        return res.status(409).json({
            error: 'A team member with this email already exists.'
        });
    }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert new team member
        const result = await db.query(
            `INSERT INTO team_members 
            (first_name, last_name, email, password, role, profile_image) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING id, first_name, last_name, email, role, profile_image`,
            [first_name, last_name, email, hashedPassword, role, profile_image]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating team member:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

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

// PUT /team-members/:id - Update a team member by ID
router.put('/team-members/:id', upload.single('profile_image'), async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, role } = req.body;
    const profile_image = req.file ? req.file.path : req.body.profile_image;

    try {
        // Check if email already exists for other users
        if (email) {
            const existingUser = await db.query(
                'SELECT * FROM team_members WHERE email = $1 AND id != $2',
                [email, id]
            );

            if (existingUser.rows.length > 0) {
                return res.status(409).json({
                    error: 'A team member with this email already exists.'
                });
            }
        }

        // Update team member
        const result = await db.query(
            `UPDATE team_members 
             SET first_name = COALESCE($1, first_name),
                 last_name = COALESCE($2, last_name),
                 email = COALESCE($3, email),
                 role = COALESCE($4, role),
                 profile_image = COALESCE($5, profile_image)
             WHERE id = $6 
             RETURNING id, first_name, last_name, email, role, profile_image`,
            [first_name, last_name, email, role, profile_image, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Team member not found' });
        }

        console.log('🟡 Updated team member:', result.rows[0]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating team member:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /team-members/:id - Delete a team member by ID
router.delete('/team-members/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM team_members WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Team member not found' });
        }
        res.json({ message: 'Team member deleted successfully' });
    } catch (err) {
        console.error('Error deleting team member:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;