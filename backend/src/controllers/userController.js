const userService = require('../services/userService');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers(req.query);
    res.json(users);
  } catch (error) { next(error); }
};

exports.getCommunityUsers = async (req, res, next) => {
  try {
    const data = await userService.getCommunityUsers(req.query);
    res.json(data);
  } catch (error) { next(error); }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const profile = await userService.getUserProfile(req.params.id, req.user?.id);
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
    const avatarFile = req.files?.avatar?.[0] || req.file;
    const bannerFile = req.files?.banner?.[0];
    const user = await userService.updateMe(req.user.id, req.body, { avatar: avatarFile, banner: bannerFile });
    res.json(user);
  } catch (error) { next(error); }
};