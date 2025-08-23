const mongoose = require('mongoose');

const loginHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null 
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  loginTime: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

loginHistorySchema.index({ email: 1, loginTime: -1 });
loginHistorySchema.index({ loginTime: -1 });

const LoginHistory = mongoose.model('LoginHistory', loginHistorySchema);

module.exports = LoginHistory;