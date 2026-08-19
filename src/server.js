const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const setupTelemetrySocket = require('./sockets/telemetrySocket');

// Routes
const authRoutes = require('./routes/authRoutes');
const driverRoutes = require('./routes/driverRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const lapRoutes = require('./routes/lapRoutes');
const telemetryRoutes = require('./routes/telemetryRoutes');

const app = express();
const server = http.createServer(app);

// CORS Configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Setup Socket Handler
setupTelemetrySocket(io);

// Connect Database
connectDB();

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/laps', lapRoutes);
app.use('/api/telemetry', telemetryRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`[Motorsport Server] Running on http://localhost:${PORT}`);
});
