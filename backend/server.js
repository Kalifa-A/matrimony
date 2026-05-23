require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const { server } = require('./socket');

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
  .then(() => {
    console.log('✅ Connected to MongoDB');
    server.listen(PORT, () => console.log(`🚀 Server listening on ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });