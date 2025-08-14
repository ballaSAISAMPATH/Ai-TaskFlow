const mongoose = require('mongoose');
const taskGroupSchema = require('./Task.js');

const goalSchema = new mongoose.Schema({
  goalTitle: {
    type: String,
    required: true
  },
  totalDays: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    required: true 
  },
  monthlyTasks: {
    type: [taskGroupSchema],
    default: []
  },
  weeklyTasks: {
    type: [taskGroupSchema],
    default: []
  },
  dailyTasks: {
    type: [taskGroupSchema],
    default: []
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Goal = mongoose.model('Goal', goalSchema);
module.exports = Goal;
