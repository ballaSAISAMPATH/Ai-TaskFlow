const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); 
const cookieParser = require('cookie-parser');
const taskRoutes = require('./routes/taskRoutes');
const authRouter = require('./routes/auth-routes');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN, 
  credentials: true,             
}));

app.use(cookieParser());
app.use(express.json());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRouter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
