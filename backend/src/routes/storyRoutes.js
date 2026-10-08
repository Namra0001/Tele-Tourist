const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const auth = require('../middleware/authMiddleware');
const optionalAuth = require('../middleware/optionalAuth');
const upload = require('../middleware/uploadMiddleware');

router.get('/', optionalAuth, storyController.getStories);
router.post('/', auth, upload.array('images', 10), storyController.createStory);
router.get('/:id', optionalAuth, storyController.getStory);
router.put('/:id', auth, storyController.updateStory);
router.delete('/:id', auth, storyController.deleteStory);

router.post('/:id/like', auth, storyController.likeStory);
router.delete('/:id/like', auth, storyController.unlikeStory);

router.post('/:id/save', auth, storyController.saveStory);
router.delete('/:id/save', auth, storyController.unsaveStory);

router.get('/:id/comments', storyController.getComments);
router.post('/:id/comments', auth, storyController.addComment);

module.exports = router;