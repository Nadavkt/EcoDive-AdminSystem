import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/dive-clubs', async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM dive_clubs');
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
});
  
export default router