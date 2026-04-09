const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoute = require('./routes/auth');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL).then(() => console.log('DB Connection Successfull'))
  .catch((err) => console.log(err));

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const listRoute = require('./routes/lists');

// Routes
app.use('/api/auth', authRoute);
app.use('/api/lists', listRoute);

app.get('/', (req, res) => {
  res.send('Movie App Backend is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}!`);
});
