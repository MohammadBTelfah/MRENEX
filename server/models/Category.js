//  create categry model that contain the name as schema 
const mongoose = require('mongoose');
const Product = require('./Products'); // Assuming you have a Product model
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
}, { timestamps: true });

categorySchema.pre('findOneAndDelete', async function (next) {
  const categoryId = this.getQuery()["_id"];
  await Product.deleteMany({ prodCategory: categoryId });
  next();
});
module.exports = mongoose.model('Category', categorySchema);