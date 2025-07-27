const mongoose = require('mongoose');
const OrdersSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, default: 1 },
    }
  ],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
}, { 
  timestamps: true,
  strictPopulate: false // ✅ أضف هذا السطر لحل المشكلة
});

const Orders = mongoose.model('Orders', OrdersSchema);
module.exports = Orders;