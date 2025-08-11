import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all activities for dashboard
router.get('/activities', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        id,
        user_id,
        user_name,
        action,
        details,
        created_at
      FROM user_activities 
      ORDER BY created_at DESC 
      LIMIT 20
    `);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching activities:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get activities by user ID
router.get('/activities/user/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const result = await db.query(`
      SELECT 
        id,
        user_id,
        user_name,
        action,
        details,
        created_at
      FROM user_activities 
      WHERE user_id = $1
      ORDER BY created_at DESC
    `, [userId]);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching user activities:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
