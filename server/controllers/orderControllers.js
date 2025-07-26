const  Orders = require('../models/Order');

const Cart = require('../models/Cart');

exports.PlaceOrder = async (req, res) => {
    const  cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart){
        return res.status(400).json({ message: 'Cart not found' });
    }
    const total = cart.items.reduce((sum, item) => sum + (parseFloat(item.product.prodPrice) * item.quantity), 0);
    const order = new Orders({
        user:req.user,
        items:cart.items.map(item=>({
            product: item.product._id,
            quantity: item.quantity
        })),
        total,
        status: 'completed'
    })
    await order.save();
    // Clear the cart after placing the order
    await Cart.findOneAndDelete({ user: req.user._id });
    res.status(201).json({ message: 'Order placed successfully', order });
}

exports.getAllOrders = async (req, res) => {
    const orders = await Orders.find({ user: req.user._id }).populate('items.product');
    res.status(200).json(orders);
}