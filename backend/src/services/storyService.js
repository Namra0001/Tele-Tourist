const supabase = require('../config/supabase');
const ApiError = require('../utils/ApiError');
const { validateStory } = require('../utils/validators');
const formatStory = require('../utils/formatStory');

exports.getStories = async (query, userId) => {
  let sb = supabase.from('stories').select('*, categories(name), users(id, name, avatar_url), story_images(*), likes(count), comments(count)').limit(query.limit || 100);
  
  const { data, error } = await sb;
  if (error) throw new ApiError(500, error.message);
  
  return { stories: data.map(d => formatStory(d, userId)), total: data.length, page: 1, totalPages: 1 };
};

exports.getStoryById = async (id, userId) => {
  const { data, error } = await supabase.from('stories').select('*, categories(name), users(id, name, avatar_url), story_images(*), likes(count), comments(count)').eq('id', id).single();
  if (error || !data) throw new ApiError(404, 'Story not found');
  return formatStory(data, userId);
};

exports.createStory = async (userId, body, files) => {
  validateStory(body.title, body.description, body.location, body.category);
  
  const { data: story, error: storyError } = await supabase.from('stories').insert([{
    user_id: userId,
    category_id: body.category,
    title: body.title,
    description: body.description,
    location: body.location
  }]).select().single();
  
  if (storyError) throw new ApiError(500, storyError.message);
  
  return { id: story.id, title: story.title };
};

exports.updateStory = async () => { return {}; };
exports.deleteStory = async () => { return {}; };
exports.likeStory = async () => { return 1; };
exports.unlikeStory = async () => { return 0; };
exports.saveStory = async () => { return {}; };
exports.unsaveStory = async () => { return {}; };
exports.getComments = async () => { return []; };
exports.addComment = async () => { return {}; };
exports.deleteComment = async () => { return {}; };
