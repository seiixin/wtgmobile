const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
// Routes
const userRoutes = require('./routes/userRoutes');
const serviceRequestRoutes = require('./routes/serviceRequestRoutes');
const graveRoutes = require('./routes/graveRoutes');
const otpRoutes = require('./routes/otpRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const historyRoutes = require('./routes/historyRoutes');
const ttsRoutes = require('./routes/ttsRoutes');
const cemeteryInfoRoutes = require('./routes/cemeteryInfoRoutes');
const burialServiceRoutes = require('./routes/burialServiceRoutes');
const maintenanceServiceRoutes = require('./routes/maintenanceServiceRoutes');
const candleRoutes = require('./routes/candleRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const memoryRoutes = require('./routes/memoryRoutes');

dotenv.config();

const app = express();

// ✅ Middleware to parse JSON and handle CORS
app.use(express.json());
app.use(cors());

// ✅ Uploads folder setup
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://happytooou:cFI51B3bXpjMWem9@walktograve.tfqc8vj.mongodb.net/walktograve?retryWrites=true&w=majority')
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');

    // ✅ Start server AFTER connection
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Routes
app.use('/api/users', userRoutes);
app.use('/api/service-requests', serviceRequestRoutes);
app.use('/api/graves', graveRoutes);
app.use('/uploads', express.static(uploadDir));
app.use('/api/otp', otpRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/tts', ttsRoutes);
app.use('/api/cemeteryinfo', cemeteryInfoRoutes);
app.use('/api/burial-services', burialServiceRoutes);
app.use('/api/maintenance-services', maintenanceServiceRoutes);
app.use('/api/candles', candleRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/memories', memoryRoutes);