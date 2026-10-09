const ApiError = require('./ApiError');

exports.validateRegister = (name, email, password) => {
  if (!name || !name.trim()) throw new ApiError(400, 'Name is required');
  if (!email || !email.trim()) throw new ApiError(400, 'Email is required');
  if (!password || password.length < 8) throw new ApiError(400, 'Password must be at least 8 characters');
};

exports.validateStory = (title, description, location, category_id) => {
  if (!title || !title.trim() || title.length > 150) throw new ApiError(400, 'Valid title is required (max 150 chars)');
  if (!description || !description.trim()) throw new ApiError(400, 'Description is required');
  if (!location || !location.trim()) throw new ApiError(400, 'Location is required');
  if (!category_id) throw new ApiError(400, 'Category is required');
};

exports.validateComment = (content) => {
  if (!content || !content.trim() || content.length > 1000) throw new ApiError(400, 'Valid comment is required (max 1000 chars)');
};