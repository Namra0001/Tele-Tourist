const storyService = require('../services/storyService');

exports.getStories = async (req, res, next) => {
  try {
    const result = await storyService.getStories(req.query, req.user?.id);
    res.json(result);
  } catch (error) { next(error); }
};

exports.getStory = async (req, res, next) => {
  try {
    const story = await storyService.getStoryById(req.params.id, req.user?.id);
    res.json(story);
  } catch (error) { next(error); }
};

exports.createStory = async (req, res, next) => {
  try {
    const story = await storyService.createStory(req.user.id, req.body, req.files);
    res.json(story);
  } catch (error) { next(error); }
};

exports.updateStory = async (req, res, next) => {
  try {
    const story = await storyService.updateStory(req.user.id, req.params.id, req.body);
    res.json(story);
  } catch (error) { next(error); }
};

exports.deleteStory = async (req, res, next) => {
  try {
    await storyService.deleteStory(req.user.id, req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) { next(error); }
};

exports.likeStory = async (req, res, next) => {
  try {
    const like_count = await storyService.likeStory(req.user.id, req.params.id);
    res.json({ like_count });
  } catch (error) { next(error); }
};

exports.unlikeStory = async (req, res, next) => {
  try {
    const like_count = await storyService.unlikeStory(req.user.id, req.params.id);
    res.json({ like_count });
  } catch (error) { next(error); }
};

exports.saveStory = async (req, res, next) => {
  try {
    await storyService.saveStory(req.user.id, req.params.id);
    res.json({ message: 'Saved' });
  } catch (error) { next(error); }
};

exports.unsaveStory = async (req, res, next) => {
  try {
    await storyService.unsaveStory(req.user.id, req.params.id);
    res.json({ message: 'Unsaved' });
  } catch (error) { next(error); }
};

exports.getComments = async (req, res, next) => {
  try {
    const comments = await storyService.getComments(req.params.id);
    res.json(comments);
  } catch (error) { next(error); }
};

exports.addComment = async (req, res, next) => {
  try {
    const comment = await storyService.addComment(req.user.id, req.params.id, req.body.content);
    res.json(comment);
  } catch (error) { next(error); }
};