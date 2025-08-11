import db from '../db.js';

// Create activity log entry
export const logActivity = async (userId, userName, action, details = null) => {
  try {
    const result = await db.query(
      'INSERT INTO user_activities (user_id, user_name, action, details, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [userId, userName, action, details]
    );
    return result.rows[0];
  } catch (err) {
    console.error('Error logging activity:', err);
    throw err;
  }
};
