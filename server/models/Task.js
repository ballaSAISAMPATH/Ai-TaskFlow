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
  },
  resources: {
    type: [String]   
  }
});

module.exports = taskGroupSchema;
