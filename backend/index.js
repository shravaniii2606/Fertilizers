const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, '.env'),
  override: true,
});

const express = require('express');
const cors = require('cors');
const batchRoutes = require('./routes/batchRoutes');
const qrRoutes = require('./routes/qrRoutes');
const scanRecordRoutes = require('./routes/scanRecordRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend running');
});

app.use('/api/batches', batchRoutes);
app.use('/api/qrcodes', qrRoutes);
app.use('/api/scan-records', scanRecordRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
