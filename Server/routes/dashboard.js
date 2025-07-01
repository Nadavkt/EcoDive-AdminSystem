import express from 'express';
import db from '../db.js'; 

const router = express.Router();

router.get('/dashboard', async (req, res) => {
  try {
        // Basic dashboard stats
    // const totalDives = await db.query('SELECT COUNT(*) FROM dives');
    const totalUsers = await db.query('SELECT COUNT(*) FROM users');
    // const emailsSent = await db.query('SELECT COUNT(*) FROM emails'); // if you log emails
    // const activeSessions = await db.query('SELECT COUNT(*) FROM sessions WHERE is_active = true'); // if you track sessions

    // Insights Box
    const adminCount = await db.query("SELECT COUNT(*) FROM team_members WHERE role = 'admin' ");
    const viewerCount = await db.query("SELECT COUNT(*) FROM team_members WHERE role = 'Viewer' ")
    const clubsCount = await db.query("SELECT COUNT(*) FROM dive_clubs")
    // const clubsWithoutDives = await db.query(`SELECT COUNT(*) FROM dive_clubs WHERE id NOT IN (SELECT DISTINCT club_id FROM dives)`);

    const newUsersThisMonth = await db.query(`
      SELECT COUNT(*) FROM users 
      WHERE created_at >= date_trunc('month', CURRENT_DATE)
    `);

    const newUsersLastMonth = await db.query(`
      SELECT COUNT(*) FROM users 
      WHERE created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month') 
        AND created_at < date_trunc('month', CURRENT_DATE)
    `);

    const growth =
    ((newUsersThisMonth.rows[0].count - newUsersLastMonth.rows[0].count) /
      Math.max(1, newUsersLastMonth.rows[0].count)
    ) * 100;
      
    const insights = [
      `There are ${totalUsers.rows[0].count} Users. `,
      `There are ${adminCount.rows[0].count} admins and ${viewerCount.rows[0].count} viewers in this Team. `,
      `There are ${clubsCount.rows[0].count} Dive Clubs in the system. `,
      // `${clubsWithoutDives.rows[0].count} dive clubs haven’t added any dives yet.`,
      `This month you had ${newUsersThisMonth.rows[0].count} new users, ${
        growth > 0 ? `${growth}% more` : `${Math.abs(growth)}% less`
      } than last month.`
    ];



    res.json({
      totalUsers: totalUsers.rows[0].count,
      // emailsSent: emailsSent.rows[0].count,
      // activeSessions: activeSessions.rows[0].count,
      // totalDives: totalDives.rows[0].count,
      insights
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
});

export default router;