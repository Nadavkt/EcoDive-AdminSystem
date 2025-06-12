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

// Create new user
router.post('/users', async (req, res) => {
  console.log('POST /users received data:', req.body); // Debug log
  
  const { firstName, lastName, email, idNumber, password } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !idNumber || !password) {
    console.log('Validation failed - missing fields:', { firstName, lastName, email, idNumber, password: password ? '[PROVIDED]' : '[MISSING]' });
    return res.status(400).json({ 
      error: 'Missing required fields. All fields are required.' 
    });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: 'Invalid email format.' 
    });
  }

  try {
    const result = await db.query(
      'INSERT INTO users (first_name, last_name, email, id_number, password, profile_image, license_front, license_back, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING id, first_name, last_name, email, id_number, created_at',
      [firstName, lastName, email, idNumber, password, null, null, null]
    );

    res.status(201).json({
      message: 'User created successfully',
      user: result.rows[0]
    });
  } catch (err) {
    console.error('Error creating user:', err.message);
    
    // Handle unique constraint violations
    if (err.code === '23505') {
      if (err.constraint && err.constraint.includes('email')) {
        return res.status(409).json({ 
          error: 'A user with this email already exists.' 
        });
      } else if (err.constraint && err.constraint.includes('id_number')) {
        return res.status(409).json({ 
          error: 'A user with this ID number already exists.' 
        });
      } else {
        return res.status(409).json({ 
          error: 'A user with this information already exists.' 
        });
      }
    }
    
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