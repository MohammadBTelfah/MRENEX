const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryControllers');
const auth = require('../middleware/adminAuth');

// Create a new category
router.post('/create', auth, categoryController.createCategory);

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get a single category by ID
router.get('/:id', categoryController.getCategoryById);

// Update a category by ID
router.put('/:id', auth, categoryController.updateCategory);

// Delete a category by ID
router.delete('/:id', auth, categoryController.deleteCategory);

// Export the router
module.exports = router;
