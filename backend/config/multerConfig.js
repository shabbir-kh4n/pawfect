const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Secure multer configuration for file uploads
 * - Prevents path traversal attacks
 * - Validates file type (MIME type + extension)
 * - Limits file size
 * - Generates random filenames
 */

// Configure multer disk storage with enhanced security
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir); // Use absolute path to prevent traversal
  },
  filename: function (req, file, cb) {
    // Generate random name to prevent path traversal attacks
    // Format: timestamp-randomstring.ext
    const randomSuffix = Math.random().toString(36).substring(2, 15);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, Date.now() + '-' + randomSuffix + ext);
  }
});

// File filter with strict validation
const imageFileFilter = (req, file, cb) => {
  // Allowed MIME types for images
  const allowedMimes = /^image\/(jpeg|jpg|png|gif)$/i;
  const mimeType = allowedMimes.test(file.mimetype);
  
  // Validate file extension matches allowed types
  const allowedExtensions = /\.(jpeg|jpg|png|gif)$/i;
  const extname = allowedExtensions.test(path.extname(file.originalname));
  
  // Both MIME type and extension must match (defense in depth)
  if (mimeType && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, PNG, and GIF files are allowed!'), false);
  }
};

// Create multer upload middleware for images
const uploadImage = multer({
  storage: storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

// Create multer upload middleware for single image
const uploadSingleImage = uploadImage.single('image');

// Create multer upload middleware for multiple images (up to 5)
const uploadMultipleImages = uploadImage.array('photos', 5);

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle multer-specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size exceeds 5MB limit' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Maximum 5 files allowed' });
    }
    return res.status(400).json({ message: 'File upload error: ' + err.message });
  } else if (err) {
    // Handle custom errors from fileFilter
    return res.status(400).json({ message: err.message });
  }
  next();
};

module.exports = {
  uploadSingleImage,
  uploadMultipleImages,
  handleMulterError,
  storage,
  imageFileFilter
};
