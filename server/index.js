const express = require('express');
const cors = require('cors');
const jsonRoutes = require('./routes/jsonRoutes');
const base64Routes = require('./routes/base64Routes');
const urlRoutes = require('./routes/urlRoutes');
const hashRoutes = require('./routes/hashRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Use this for any origin:
app.use(cors({
  origin: '*', // Allow all origins
  credentials: true
}));

app.use(express.json());

app.use('/api/json', jsonRoutes);
app.use('/api/base64', base64Routes);
app.use('/api/url', urlRoutes);
app.use('/api/hash', hashRoutes);

app.get('/', (req, res) => {
  res.send('JSON Formatter API is running!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`✅ CORS: Allowing requests from ANY origin`);
});
