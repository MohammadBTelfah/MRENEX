const Cart = require('../models/Cart');

exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const qty = Number(quantity) || 1;
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        const exitedItems = cart.items.find(item => item.product.toString() === productId.toString());

        if (exitedItems) {
            exitedItems.quantity += qty;
        } else {
            cart.items.push({ product: productId, quantity: qty });
        }

        await cart.save();
        res.status(200).json({ message: 'Item added to cart successfully', cart });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.getCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        res.status(200).json(cart || { message: 'Cart is empty' });

}
exports.removeFromCart = async (req, res) => {
    const { productId } = req.body;
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
        res.status(200).json({ message: 'Item removed from cart successfully', cart });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}