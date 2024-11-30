const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT;
const dbURL = process.env.DB_URL;
// console.log("DB_URL:", process.env.DB_URL);

mongoose
  .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

app.use('/api/auth', authRoutes);

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
