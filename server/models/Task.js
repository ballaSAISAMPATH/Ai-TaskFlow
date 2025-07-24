const mongoose = require('mongoose');

const taskGroupSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true
  },
  tasks: {
    type: [String],
    required: true
  },
  status: {
    type: Boolean,
    default: false
  }
});

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
  }
}, {
  timestamps: true
});

// FIX: Create the model properly
const Goal = mongoose.model('Goal', goalSchema);
module.exports = Goal;