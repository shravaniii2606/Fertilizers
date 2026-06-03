const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, '.env'),
  override: true,
});

const express = require('express');
const cors = require('cors');
const batchRoutes = require('./routes/batchRoutes');
const farmerRecordRoutes = require('./routes/farmerRecordRoutes');
const qrRoutes = require('./routes/qrRoutes');
const farmerRoutes = require('./routes/farmerRoutes');
const scanRecordRoutes = require('./routes/scanRecordRoutes');
const bagRoutes = require('./routes/bagRoutes');
const farmerTransactionRoutes = require('./routes/farmerTransactionRoutes');
const aiAnalysisRoutes = require('./routes/aiAnalysisRoutes');
const otpRoutes = require('./routes/otpRoutes');


const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'https://dealer-dashboard.vercel.app',
    'https://gov-dashboard.vercel.app'
  ],
  credentials: true,
}));

app.use(express.json()); // ← must be before all routes

app.get('/', (req, res) => {
  res.send('Backend running');
});

app.use('/api/batches', batchRoutes);
app.use('/api/farmer-records', farmerRecordRoutes);
app.use('/api/qrcodes', qrRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/scan-records', scanRecordRoutes);
app.use('/api/bags', bagRoutes);
app.use('/api/farmer-transactions', farmerTransactionRoutes); // ← after express.json()
app.use('/api/ai', aiAnalysisRoutes);
app.use('/api/otp', otpRoutes);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
