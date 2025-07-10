const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');
const auth= require('../middleware/authMiddleware');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// User registration route
router.post('/register', upload.single('profileImage'), userController.register);
// User login route
router.post('/login', userController.login);
// Get user profile route
router.get('/profile', auth, userController.getProfile);
// Update user profile route
router.put('/updateProfile', auth, upload.single('profileImage'), userController.updateProfile);
// Delete user account route
router.delete('/account', auth, userController.deleteAccount);
// Get all users route (for admin)
router.get('/users', auth, userController.getAllUsers);

module.exports = router;