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

// Update dive club by ID
router.put('/dive-clubs/:id', async (req, res) => {
  const { id } = req.params;
  const { name, city, address, phone, website, description } = req.body;

  try {
    const result = await db.query(
      'UPDATE dive_clubs SET name = $1, city = $2, address = $3, phone = $4, website = $5, description = $6 WHERE id = $7 RETURNING *',
      [name, city, address, phone, website, description, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Dive club not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete dive club by ID
router.delete('/dive-clubs/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM dive_clubs WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Dive club not found' });
    }

    res.json({ message: 'Dive club deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});
  
export default router