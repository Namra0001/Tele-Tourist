const supabase = require('../config/supabase');
const ApiError = require('../utils/ApiError');
const { validateStory } = require('../utils/validators');
const formatStory = require('../utils/formatStory');

exports.getStories = async (query, userId) => {
  let sb = supabase.from('stories').select('*, categories(name), users!stories_user_id_fkey(id, name, avatar_url), story_images(*), likes(count), comments(count)').limit(query.limit || 100);
  
  const { data, error } = await sb;
  if (error) throw new ApiError(500, error.message);
  
  if (userId && data.length > 0) {
    const storyIds = data.map(d => d.id);
    const { data: likes } = await supabase.from('likes').select('story_id').eq('user_id', userId).in('story_id', storyIds);
    const { data: saves } = await supabase.from('saved_stories').select('story_id').eq('user_id', userId).in('story_id', storyIds);
    const likedSet = new Set(likes ? likes.map(l => l.story_id) : []);
    const savedSet = new Set(saves ? saves.map(s => s.story_id) : []);
    data.forEach(d => {
      if (likedSet.has(d.id)) d.likes_me = [{}];
      if (savedSet.has(d.id)) d.saved_me = [{}];
    });
  }
  return { stories: data.map(d => formatStory(d, userId)), total: data.length, page: 1, totalPages: 1 };
};

exports.getStoryById = async (id, userId) => {
  const { data, error } = await supabase.from('stories').select('*, categories(name), users!stories_user_id_fkey(id, name, avatar_url), story_images(*), likes(count), comments(count)').eq('id', id).single();
  if (error || !data) throw new ApiError(404, 'Story not found');
  if (userId) {
    const { data: likeData } = await supabase.from('likes').select('id').eq('story_id', id).eq('user_id', userId).maybeSingle();
    const { data: saveData } = await supabase.from('saved_stories').select('id').eq('story_id', id).eq('user_id', userId).maybeSingle();
    if (likeData) data.likes_me = [{}];
    if (saveData) data.saved_me = [{}];
  }
  return formatStory(data, userId);
};

exports.createStory = async (userId, body, files) => {
  validateStory(body.title, body.description, body.location, body.category);
  
  const { data: story, error: storyError } = await supabase.from('stories').insert([{
      user_id: userId,
      category_id: body.category,
      title: body.title,
      description: body.description,
      location: body.location,
      rating: body.rating || 5
    }]).select().single();
    
    if (storyError) throw new ApiError(500, storyError.message);
    
    if (files && files.length > 0) {
        const fs = require('fs');
        const path = require('path');
        const uploadDir = path.join(__dirname, '../../../uploads');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        
        const imageInserts = [];
        for (const file of files) {
            const ext = file.mimetype.split('/')[1];
            const filename = `story_${story.id}_${Date.now()}.${ext}`;
            fs.writeFileSync(path.join(uploadDir, filename), file.buffer);
            imageInserts.push({
                story_id: story.id,
                url: `http://localhost:5000/uploads/${filename}`
            });
        }
        
        const { error: imgError } = await supabase.from('story_images').insert(imageInserts);
        if (imgError) console.error("Error inserting images:", imgError);
    }
  
  return { id: story.id, title: story.title };
};

exports.updateStory = async () => { return {}; };
exports.deleteStory = async () => { return {}; };

exports.likeStory = async (userId, storyId) => {
  const { error } = await supabase.from('likes').insert([{ user_id: userId, story_id: storyId }]);
  if (error && error.code !== '23505') throw new ApiError(500, error.message);
  
  const { count } = await supabase.from('likes').select('*', { count: 'exact', head: true }).eq('story_id', storyId);
  return count;
};

exports.unlikeStory = async (userId, storyId) => {
  const { error } = await supabase.from('likes').delete().match({ user_id: userId, story_id: storyId });
  if (error) throw new ApiError(500, error.message);

  const { count } = await supabase.from('likes').select('*', { count: 'exact', head: true }).eq('story_id', storyId);
  return count;
};

exports.saveStory = async (userId, storyId) => {
  const { error } = await supabase.from('saved_stories').insert([{ user_id: userId, story_id: storyId }]);
  if (error && error.code !== '23505') throw new ApiError(500, error.message);
  return { message: 'Saved' };
};

exports.unsaveStory = async (userId, storyId) => {
  const { error } = await supabase.from('saved_stories').delete().match({ user_id: userId, story_id: storyId });
  if (error) throw new ApiError(500, error.message);
  return { message: 'Unsaved' };
};

exports.getComments = async (storyId) => {
  const { data, error } = await supabase.from('comments').select('id, content, created_at, users(name, avatar_url)').eq('story_id', storyId).order('created_at', { ascending: false });
  if (error) throw new ApiError(500, error.message);
  return data.map(c => ({
    id: c.id,
    author: c.users?.name,
    avatar: c.users?.avatar_url,
    text: c.content,
    date: new Date(c.created_at).toLocaleDateString()
  }));
};

exports.addComment = async (userId, storyId, content) => {
  if (!content) throw new ApiError(400, 'Content is required');
  const { data, error } = await supabase.from('comments').insert([{ user_id: userId, story_id: storyId, content }]).select('id, content, created_at, users(name, avatar_url)').single();
  if (error) throw new ApiError(500, error.message);
  return {
    id: data.id,
    author: data.users?.name,
    avatar: data.users?.avatar_url,
    text: data.content,
    date: new Date(data.created_at).toLocaleDateString()
  };
};

exports.deleteComment = async () => { return {}; };
