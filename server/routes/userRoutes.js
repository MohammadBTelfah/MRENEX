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
router.put("/update-profile", auth, upload.single("profileImage"), userController.updateProfile);
// Delete user account route
router.delete('/delete/:id', auth, userController.deleteAccount);
// Get all users route (for admin)
router.get('/getallusers', auth, userController.getAllUsers);
// Change password route
router.post('/change-password', auth, userController.changePassword);

module.exports = router;