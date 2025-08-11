import express from 'express';
import db from '../db.js';
import { logActivity } from '../utils/activityLogger.js';

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

// Create new dive club
router.post('/dive-clubs', async (req, res) => {
  const { name, city, address, phone, website, description } = req.body;

  // Validate required fields
  if (!name || !city || !address || !phone) {
    return res.status(400).json({ 
      error: 'Missing required fields. Name, city, address, and phone are required.' 
    });
  }

  try {
    const result = await db.query(
      'INSERT INTO dive_clubs (name, city, address, phone, website, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, city, address, phone, website || null, description || null]
    );

    // Log the activity
    await logActivity(
      1, // Assuming admin user ID is 1
      'Nadav Kan Tor',
      'Added Dive Club',
      `Added new dive club: ${name} in ${city}`
    );

    res.status(201).json({
      message: 'Dive club created successfully',
      diveClub: result.rows[0]
    });
  } catch (err) {
    console.error('Error creating dive club:', err.message);
    
    // Handle unique constraint violations
    if (err.code === '23505') {
      return res.status(409).json({ 
        error: 'A dive club with this information already exists.' 
      });
    }
    
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

    // Log the activity
    await logActivity(
      1, // Assuming admin user ID is 1
      'Nadav Kan Tor',
      'Updated Dive Club',
      `Updated dive club: ${name}`
    );

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

    // Log the activity
    await logActivity(
      1, // Assuming admin user ID is 1
      'Nadav Kan Tor',
      'Deleted Dive Club',
      `Deleted dive club: ${result.rows[0].name}`
    );

    res.json({ message: 'Dive club deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});
  
export default router