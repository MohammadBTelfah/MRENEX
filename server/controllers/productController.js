const Product = require('../models/Products');
const path = require('path');


// create a new product
exports.createProduct = async (req, res) => {
  try {
    const { prodName,  prodPrice, prodDescription, prodCategory } = req.body;
    const prodImage = req.file ? req.file.path : ''; // Assuming you're using multer for file uploads
    const newProduct = new Product({
      prodName,
      prodImage,
      prodPrice,
      prodDescription,
      prodCategory
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
}

// get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('prodCategory', 'name');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
}

// get a single product by id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('prodCategory', 'name');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
}

// update a product by id
exports.updateProduct = async (req, res) => {
  try {
    const { prodName, prodPrice, prodDescription, prodCategory } = req.body;

    const updateData = {
      prodName,
      prodPrice,
      prodDescription,
      prodCategory,
    };

    // إذا فيه صورة جديدة مرفوعة، أضفها للتحديث
    if (req.file) {
      updateData.prodImage = req.file.filename;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// delete a product by id
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
}

//