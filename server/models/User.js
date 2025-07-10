const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String },
  fullName: { type: String },
  address: { type: String },
  phone: { type: String },
  role:{type: String, enum: ['user', 'admin'], default: 'user'  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
