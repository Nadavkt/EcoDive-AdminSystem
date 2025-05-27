import express from 'express';
import db from '../db.js'; 

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await db.query('SELECT COUNT(*) FROM users');
    // const emailsSent = await db.query('SELECT COUNT(*) FROM emails'); // if you log emails
    // const activeSessions = await db.query('SELECT COUNT(*) FROM sessions WHERE is_active = true'); // if you track sessions

    res.json({
      totalUsers: totalUsers.rows[0].count,
    //   emailsSent: emailsSent.rows[0].count,
    //   activeSessions: activeSessions.rows[0].count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
});

export default router;