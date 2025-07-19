const express = require('express');
const multer = require('multer');
const { 
    registerUser, 
    loginUser, 
    getUserById, 
    updateUser, 
    validatePassword, 
    updatePassword, 
    uploadProfileImage, 
    findEmail, 
    resetPassword 
} = require('../controllers/userController');

const router = express.Router();

// Cloudinary setup
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'userProfilePictures',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [{ width: 300, height: 300, crop: "limit" }]
    }
});

const upload = multer({ 
    storage
});

// Specific routes first
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/find-email', findEmail);
router.post('/reset-password', resetPassword);
router.post('/validate-password/:id', validatePassword);
router.put('/update-password/:id', updatePassword);
router.put('/update/:id', updateUser);
router.post('/upload-image/:id', upload.single("profileImage"), uploadProfileImage);

// Dynamic routes last
router.get('/:id', getUserById);

module.exports = router;
