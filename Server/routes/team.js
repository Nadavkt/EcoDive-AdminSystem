import express from 'express';
import db from '../db.js';

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

export default router;