const jwt = require('jsonwebtoken');

const http = require('http');
const { Server } = require('socket.io');
const app = require('./app'); // existing Express app
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });

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