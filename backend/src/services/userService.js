const supabase = require('../config/supabase');
const ApiError = require('../utils/ApiError');
const formatStory = require('../utils/formatStory');

exports.getUsers = async () => { return []; };
exports.getUserProfile = async () => { return {}; };
exports.getUserStories = async () => { return []; };

exports.getSavedStories = async (userId) => {
    // Get saved story IDs for user
    const { data: saved, error: savedError } = await supabase
        .from('saved_stories')
        .select('story_id')
        .eq('user_id', userId);
        
    if (savedError) throw new ApiError(500, savedError.message);
    if (!saved || saved.length === 0) return { stories: [] };
    
    const storyIds = saved.map(s => s.story_id);
    
    // Fetch stories with all relationships
    const { data, error } = await supabase
        .from('stories')
        .select('*, categories(name), users!stories_user_id_fkey(id, name, avatar_url), story_images(*), likes(count), comments(count)')
        .in('id', storyIds);
        
    if (error) throw new ApiError(500, error.message);
    
    // Add likes_me and saved_me logic for formatStory
    if (data && data.length > 0) {
        const { data: likes } = await supabase.from('likes').select('story_id').eq('user_id', userId).in('story_id', storyIds);
        const likedSet = new Set(likes ? likes.map(l => l.story_id) : []);
        data.forEach(d => {
            if (likedSet.has(d.id)) d.likes_me = [{}];
            d.saved_me = [{}]; // All of these are saved
        });
    }
    
    return { stories: data.map(d => formatStory(d, userId)) };
};

exports.updateMe = async () => { return {}; };