const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const auth = require('../middleware/adminAuth');

// Upload config
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Create a new product
router.post('/create', auth, upload.single('prodImage'), productController.createProduct);
// Get all products
router.get('/getallproducts', productController.getAllProducts);
// Get a single product by ID
router.get('/:id', productController.getProductById);
// Update a product by ID
router.put('/:id', auth, upload.single('prodImage'), productController.updateProduct);
// Delete a product by ID
router.delete('/:id', auth, productController.deleteProduct);
// Export the router
module.exports = router;