const mongoose = require('mongoose');

const emotionEntrySchema = new mongoose.Schema({
  emotion: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email:    { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  theme:    { type: String, default: 'light-mode' },
  emotionHistory: [emotionEntrySchema],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
