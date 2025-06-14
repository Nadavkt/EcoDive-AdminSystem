import express from 'express';
import cors from 'cors';
import teamRoutes from './routes/team.js';
import clubsRoutes from './routes/diveClubs.js';
import usersRoutes from './routes/users.js';
import dashboardRoutes from './routes/dashboard.js';
import calendarRoutes from './routes/calendar.js';

const app = express();
const PORT = 5001;

app.use(cors());

app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use('/api/dashboard', dashboardRoutes);
app.use('/api', teamRoutes);
app.use('/api', clubsRoutes);
app.use('/api', usersRoutes);
app.use('/api', calendarRoutes);

// // Simple test route
// app.get('/', (req, res) => {
//   res.send('Backend is running!');
// });

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});