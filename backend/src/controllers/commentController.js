const storyService = require('../services/storyService');

exports.deleteComment = async (req, res, next) => {
  try {
    await storyService.deleteComment(req.user.id, req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (error) { next(error); }
};