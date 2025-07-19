const Mongoose = require('mongoose');


const CartSchema = new Mongoose.Schema({
    userId: { type: Mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        productId: { type: Mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 }
    }],
    totalPrice: { type: Number, required: true, min: 0 }
});


module.exports = Mongoose.model('Cart', CartSchema);