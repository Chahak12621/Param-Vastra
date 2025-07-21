const express = require('express');
const cors = require('cors');
const connectDB = require('./database');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

// Test Route
app.get('/', (req, res) => {
  res.send("API is working");
});

// Use your actual route file
app.use('/api/notes', require('./routes/route'));

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

