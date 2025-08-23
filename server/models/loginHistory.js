const mongoose = require('mongoose');

const loginHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Nullable in case user deletes their account later
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
  },
  isUserDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient querying of recent logins
loginHistorySchema.index({ email: 1, loginTime: -1 });
loginHistorySchema.index({ loginTime: -1 });

const LoginHistory = mongoose.model('LoginHistory', loginHistorySchema);

module.exports = LoginHistory;