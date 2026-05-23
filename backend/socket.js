const jwt = require('jsonwebtoken');

const http = require('http');
const { Server } = require('socket.io');
const app = require('./app'); // existing Express app
const server = http.createServer(app);

// Use allowed origins for socket.io as well
const allowedOrigins = [
  process.env.FRONTEND_URL?.replace(/\/$/, ''),
  'http://localhost:3000',
  'https://alfattahnikkah.com',
  'https://www.alfattahnikkah.com',
  'https://matrimony-rose-delta.vercel.app'
].filter(Boolean);

const io = new Server(server, { 
  cors: { 
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  } 
});

// Middleware to verify admin token
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('unauthorized'));
  
  try { 
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (user.role !== 'admin' && user.role !== 'superadmin') {
       return next(new Error('unauthorized'));
    }
    socket.user = user; 
    next(); 
  }
  catch (err) { 
    next(new Error('unauthorized')); 
  }
});

io.on('connection', (socket) => {
  console.log('Admin connected', socket.id);
});

// Export the io instance for use in routes
module.exports = { io, server };