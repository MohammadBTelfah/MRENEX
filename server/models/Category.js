//  create categry model that contain the name as schema 
const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
}, { timestamps: true });
module.exports = mongoose.model('Category', categorySchema);