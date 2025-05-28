import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all users 
router.get('/users', async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM users ORDER BY id ASC;');
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
});

// Update user by ID
router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const {
    profile_image,
    first_name,
    last_name,
    email,
    id_number,
  } = req.body;

  try {
    const result = await db.query(
      `
        UPDATE users
        SET 
          profile_image = $1,
          first_name = $2,
          last_name = $3,
          email = $4,
          id_number = $5
        WHERE id = $6
        RETURNING *;
      `,
      [
        profile_image,
        first_name,
        last_name,
        email,
        id_number,
        id
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete user by ID
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('DELETE ERROR:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;