import express from 'express';
import db from '../db.js';
import { logActivity } from '../utils/activityLogger.js';

const router = express.Router();

// Get all events
router.get('/calendar', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM calendar ORDER BY start_time');
        res.json(result.rows);
    } catch (err) {
        console.error('Error in /calendar route:', err);
        res.status(500).json({ 
            error: 'Server error', 
            details: err.message
        });
    }
});

// Get events for current month
router.get('/calendar/current-month', async (req, res) => {
    try {
        const result = await db.query(
            `SELECT * FROM calendar 
             WHERE EXTRACT(MONTH FROM event_date) = EXTRACT(MONTH FROM CURRENT_DATE)
             AND EXTRACT(YEAR FROM event_date) = EXTRACT(YEAR FROM CURRENT_DATE)
             ORDER BY start_time`
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error in /calendar/current-month route:', err);
        res.status(500).json({ 
            error: 'Server error', 
            details: err.message
        });
    }
});

// Create new event
router.post('/calendar', async (req, res) => {
    const { title, description, start_time, end_time, location, status } = req.body;

    try {
        const result = await db.query(
            'INSERT INTO calendar (title, description, start_time, end_time, location, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, description, start_time, end_time, location, status]
        );
        // Log the activity
        await logActivity(
            1, // Assuming admin user ID is 1
            'Nadav Kan Tor',
            'Created Event',
            `Created new event: ${title}`
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating calendar event:', err);
        res.status(500).json({ 
            error: 'Server error', 
            details: err.message
        });
    }
});

// Update event
router.put('/calendar/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, start_time, end_time, location, status } = req.body;

    try {
        const result = await db.query(
            'UPDATE calendar SET title = $1, description = $2, start_time = $3, end_time = $4, location = $5, status = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
            [title, description, start_time, end_time, location, status, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Log the activity
        await logActivity(
            1, // Assuming admin user ID is 1
            'Nadav Kan Tor',
            'Updated Event',
            `Updated event: ${title}`
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating calendar event:', err);
        res.status(500).json({ 
            error: 'Server error', 
            details: err.message
        });
    }
});

// Delete event
router.delete('/calendar/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('DELETE FROM calendar WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Log the activity
        await logActivity(
            1, // Assuming admin user ID is 1
            'Nadav Kan Tor',
            'Deleted Event',
            `Deleted event: ${result.rows[0].title}`
        );

        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        console.error('Error deleting calendar event:', err);
        res.status(500).json({ 
            error: 'Server error', 
            details: err.message
        });
    }
});

export default router; 