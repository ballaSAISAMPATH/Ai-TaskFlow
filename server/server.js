const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); 
const cookieParser = require('cookie-parser');
const taskRoutes = require('./routes/taskRoutes');
const authRouter = require('./routes/auth-routes');
const feedbackRouter = require('./routes/feedback-routes')
const adminRouter = require('./routes/admin-routes')
const app = express();
const PORT=process.env.PORT

app.use(cors({
  origin: process.env.CLIENT_ORIGIN, 
  credentials: true,             
}));

app.use(cookieParser());
app.use(express.json());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRouter);
app.use('/api/feedback',feedbackRouter)
app.use('/api/admin',adminRouter)

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error(err);
  });
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
