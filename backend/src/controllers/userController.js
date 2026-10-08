const userService = require('../services/userService');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers(req.query);
    res.json(users);
  } catch (error) { next(error); }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const profile = await userService.getUserProfile(req.params.id);
    res.json(profile);
  } catch (error) { next(error); }
};

exports.getUserStories = async (req, res, next) => {
  try {
    const stories = await userService.getUserStories(req.params.id, req.user?.id);
    res.json(stories);
  } catch (error) { next(error); }
};

exports.getSavedStories = async (req, res, next) => {
  try {
    const stories = await userService.getSavedStories(req.user.id);
    res.json(stories);
  } catch (error) { next(error); }
};

exports.updateMe = async (req, res, next) => {
  try {
    const user = await userService.updateMe(req.user.id, req.body, req.file);
    res.json(user);
  } catch (error) { next(error); }
};