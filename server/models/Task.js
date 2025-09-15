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
    type: [{
      title: String,
      type: String,
      url: String,
      description: String
    }],
    default: []
  }
});

module.exports = taskGroupSchema;
