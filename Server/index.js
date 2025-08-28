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

// Health check endpoint for Render
app.get('/healthz', (req, res) => {
  res.status(200).send('ok');
});

app.use('/api', dashboardRoutes);
app.use('/api', teamRoutes);
app.use('/api', clubsRoutes);
app.use('/api', usersRoutes);
app.use('/api', calendarRoutes);
app.use('/api', activityRoutes);
app.use('/api', supportRoutes);

// Serve static files from React build (if they exist)
const clientDistPath = path.join(__dirname, '../Client/dist');
console.log('Client dist path:', clientDistPath);

app.use(express.static(clientDistPath));

// Handle React routes for SPA
app.get('/dashboard', (req, res) => {
  const indexPath = path.join(clientDistPath, 'index.html');
  console.log('Serving dashboard from:', indexPath);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving dashboard:', err);
      res.status(500).send('Error loading page');
    }
  });
});

app.get('/users', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

app.get('/team', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

app.get('/events', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

app.get('/dive-clubs', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});