const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const optionalAuth = require('../middleware/optionalAuth');
const upload = require('../middleware/uploadMiddleware');

router.get('/', userController.getUsers);
router.get('/community', userController.getCommunityUsers);
router.get('/me/saved', auth, userController.getSavedStories);
router.put('/me', auth, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), userController.updateMe);
router.get('/:id', optionalAuth, userController.getUserProfile);
router.get('/:id/stories', optionalAuth, userController.getUserStories);

module.exports = router;