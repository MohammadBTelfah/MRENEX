const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  prodName: { type: String, required: true },
  prodImage: { type: String, required: true },
  prodPrice: { type: Number, required: true },
  prodDescription: { type: String, required: true },
//   replace the prodCategory as string with Category model 
//  that will help if we delete any category this will delete all the products 
//  that belong to this category
  prodCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
//   prodCategory: { type: String, required: true },
//   prodStock: { type: Number, required: true, default: 0 },
//   prodRating: { type: Number, default: 0 },
//   prodReviews: { type: Number, default: 0 },
}, { timestamps: true });   

module.exports = mongoose.model('Product', productSchema);