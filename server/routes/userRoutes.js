const express = require('express');
const multer = require('multer');
const { registerUser, loginUser, getUserById, updateUser, validatePassword, updatePassword, uploadProfileImage } = require('../controllers/userController');

const router = express.Router();
const { findEmail, resetPassword } = require('../controllers/userController'); // Import functions

// ✅ Configure Multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads/")); // Save files in the 'uploads' directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// ✅ File type filter to accept images only
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"), false);
    }
};

const upload = multer({ 
    storage, 
    limits: { fileSize: 2 * 1024 * 1024 }, // ✅ Limit to 2MB
    fileFilter 
});

// ✅ User authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', getUserById);
router.put('/update/:id', updateUser);
router.post('/validate-password/:id', validatePassword);
router.put('/update-password/:id', updatePassword);
router.post('/find-email', findEmail);
router.post('/reset-password', resetPassword);


// ✅ Route for uploading profile images
router.post('/upload-image/:id', upload.single("profileImage"), uploadProfileImage);

module.exports = router;
