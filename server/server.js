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
  origin: 'http://localhost:5173', 
  credentials: true,             
}));

app.use(cookieParser());
app.use(express.json());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRouter);

mongoose
  .connect('mongodb://127.0.0.1:27017/taskDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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
