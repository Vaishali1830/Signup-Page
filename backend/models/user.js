const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String },
  email: { type: String, unique: true },
  password: { type: String},
  phone :{ type: String},
  dob : { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

module.exports = mongoose.model('User', userSchema);
