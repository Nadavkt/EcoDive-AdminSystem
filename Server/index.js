import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import teamRoutes from './routes/team.js';
import clubsRoutes from './routes/diveClubs.js';
import usersRoutes from './routes/users.js';
import dashboardRoutes from './routes/dashboard.js';
import calendarRoutes from './routes/calendar.js';
import activityRoutes from './routes/activity.js';
import supportRoutes from './routes/support.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// const allowedOrigins = ['https://adminsys-ecodive.netlify.app'];

// app.use(cors({
//   origin: allowedOrigins,
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true
// }));

app.use(cors())

app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use('/api', dashboardRoutes);
app.use('/api', teamRoutes);
app.use('/api', clubsRoutes);
app.use('/api', usersRoutes);
app.use('/api', calendarRoutes);
app.use('/api', activityRoutes);
app.use('/api', supportRoutes);


// Health check endpoint for Render
app.get('/healthz', (req, res) => {
  res.status(200).send('ok');
});

// Serve static files from React build (if they exist)
app.use(express.static(path.join(__dirname, '../Client/dist')));

// Catch-all handler: send back React's index.html for any non-API route
app.get('*', (req, res) => {
  // Don't interfere with API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // Serve React app for all other routes
  res.sendFile(path.join(__dirname, '../Client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});