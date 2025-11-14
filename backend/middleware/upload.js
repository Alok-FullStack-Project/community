const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/family/'; // Default path

    if (req.baseUrl.includes('/advertise')) {
      uploadPath = 'uploads/advertise/';
    } else if (req.baseUrl.includes('/events')) {
      uploadPath = 'uploads/events/';
    } else if (req.baseUrl.includes('/add-family')) {
      uploadPath = 'uploads/family/';
    }

    // Ensure the folder exists (recursive ensures nested paths)
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}-${Date.now()}${ext}`);
  },
});

// Allow only image files (jpg, png, jpeg, webp)
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('❌ Only JPG, PNG, and WEBP image files are allowed!'), false);
  }
};

// Max file size 5 MB (optional but recommended)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

module.exports = upload;
