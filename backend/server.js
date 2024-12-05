const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
require('dotenv').config();
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Serve the reset password HTML page
app.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'reset.html'));
});


const port = process.env.PORT;
const dbURL = process.env.DB_URL;

mongoose
  .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

app.use('/api/auth', authRoutes);

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
