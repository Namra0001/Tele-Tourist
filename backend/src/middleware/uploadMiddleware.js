const multer = require('multer');
const ApiError = require('../utils/ApiError');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only images and videos are allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 5 MB
  fileFilter
});

module.exports = upload;