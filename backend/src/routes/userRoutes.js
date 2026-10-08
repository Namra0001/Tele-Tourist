const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const optionalAuth = require('../middleware/optionalAuth');
const upload = require('../middleware/uploadMiddleware');

router.get('/', userController.getUsers);
router.get('/me/saved', auth, userController.getSavedStories);
router.put('/me', auth, upload.single('avatar'), userController.updateMe);
router.get('/:id', userController.getUserProfile);
router.get('/:id/stories', optionalAuth, userController.getUserStories);

module.exports = router;