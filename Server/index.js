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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5001;

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


// // Simple test route
// app.get('/', (req, res) => {
//   res.send('Backend is running!');
// });

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});