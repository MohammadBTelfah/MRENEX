const  Orders = require('../models/Order');

const Cart = require('../models/Cart');

exports.PlaceOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      return res.status(400).json({ message: 'Cart not found' });
    }

    const total = cart.items.reduce((sum, item) => {
      return sum + (parseFloat(item.product.prodPrice) * item.quantity);
    }, 0);

    const order = new Orders({
      user: req.user,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      })),
      total,
      status: 'completed'
    });

    await order.save();

    // ✅ populate the product data again after saving
    const populatedOrder = await Orders.findById(order._id).populate('items.product');

    // ✅ clear the cart
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json({ message: 'Order placed successfully', order: populatedOrder });

  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: 'Server error placing order' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Orders.find({ user: req.user._id })
      .populate('items.product')
      .populate('user');

    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Server error fetching orders" });
  }
};
