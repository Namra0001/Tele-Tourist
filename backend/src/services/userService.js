const fs = require('fs');
const path = require('path');
const supabase = require('../config/supabase');
const ApiError = require('../utils/ApiError');
const formatStory = require('../utils/formatStory');

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const BANNER_MAP_FILE = path.join(__dirname, '../../../uploads/user_banners.json');
const LOCATION_MAP_FILE = path.join(__dirname, '../../../uploads/user_locations.json');

function getUserBanner(userId) {
  try {
    if (fs.existsSync(BANNER_MAP_FILE)) {
      const data = JSON.parse(fs.readFileSync(BANNER_MAP_FILE, 'utf8'));
      return data[userId] || null;
    }
  } catch(e) {}
  return null;
}

function setUserBanner(userId, bannerUrl) {
  try {
    const uploadDir = path.join(__dirname, '../../../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    let data = {};
    if (fs.existsSync(BANNER_MAP_FILE)) {
      data = JSON.parse(fs.readFileSync(BANNER_MAP_FILE, 'utf8'));
    }
    data[userId] = bannerUrl;
    fs.writeFileSync(BANNER_MAP_FILE, JSON.stringify(data, null, 2));
  } catch(e) {
    console.error('Error saving user banner:', e);
  }
}

function getUserLocation(userId) {
  try {
    if (fs.existsSync(LOCATION_MAP_FILE)) {
      const data = JSON.parse(fs.readFileSync(LOCATION_MAP_FILE, 'utf8'));
      return data[userId] || null;
    }
  } catch(e) {}
  return null;
}

function setUserLocation(userId, location) {
  try {
    const uploadDir = path.join(__dirname, '../../../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    let data = {};
    if (fs.existsSync(LOCATION_MAP_FILE)) {
      data = JSON.parse(fs.readFileSync(LOCATION_MAP_FILE, 'utf8'));
    }
    data[userId] = location;
    fs.writeFileSync(LOCATION_MAP_FILE, JSON.stringify(data, null, 2));
  } catch(e) {
    console.error('Error saving user location:', e);
  }
}

exports.getUsers = async (query = {}) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, bio, avatar_url, created_at')
    .order('created_at', { ascending: false });
  if (error) throw new ApiError(500, error.message);
  return data || [];
};

exports.getCommunityUsers = async (query = {}) => {
  const filter = query.filter || 'most_stories';
  const search = (query.search || '').trim().toLowerCase();

  const { data: users, error: uErr } = await supabase
    .from('users')
    .select('id, name, email, bio, avatar_url, created_at');

  if (uErr) throw new ApiError(500, uErr.message);

  const { data: stories, error: sErr } = await supabase
    .from('stories')
    .select('id, title, user_id, location, created_at, categories(name), story_images(url)')
    .order('created_at', { ascending: false });

  if (sErr) throw new ApiError(500, sErr.message);

  const { data: likes, error: lErr } = await supabase
    .from('likes')
    .select('id, story_id, user_id');

  if (lErr) throw new ApiError(500, lErr.message);

  const likesCountByStory = {};
  (likes || []).forEach(l => {
    likesCountByStory[l.story_id] = (likesCountByStory[l.story_id] || 0) + 1;
  });

  const storiesByUser = {};
  (stories || []).forEach(s => {
    if (!storiesByUser[s.user_id]) storiesByUser[s.user_id] = [];
    storiesByUser[s.user_id].push(s);
  });

  const avatarColors = [
    '#20556B', '#7B68EE', '#8B6508', '#B22222', '#9C6615',
    '#5C7A99', '#B4532A', '#A0522D', '#2E8B57', '#4682B4'
  ];
  const coverGradients = [
    'linear-gradient(180deg, #2D4059 0%, #1A2639 100%)',
    'linear-gradient(180deg, #F9D4A8 0%, #3B7A57 100%)',
    'linear-gradient(180deg, #FDE8D3 0%, #D95A97 100%)',
    'linear-gradient(180deg, #E8F4F8 0%, #20556B 100%)',
    'linear-gradient(180deg, #FFE8D6 0%, #B4532A 100%)'
  ];

  const travelers = [];

  for (let i = 0; i < (users || []).length; i++) {
    const u = users[i];
    if (u.name === 'Admin User') continue;

    const userStories = storiesByUser[u.id] || [];
    const storiesCount = userStories.length;

    let likesCount = 0;
    userStories.forEach(s => {
      likesCount += (likesCountByStory[s.id] || 0);
    });

    let latestStory = null;
    if (userStories.length > 0) {
      const ls = userStories[0];
      const img = ls.story_images && ls.story_images.length > 0 ? ls.story_images[0].url : null;
      latestStory = {
        id: ls.id,
        title: ls.title,
        location: ls.location,
        image_url: img,
        category: ls.categories?.name || 'Travel'
      };
    }

    const customLoc = getUserLocation(u.id);
    let location = customLoc || (userStories.length > 0 ? (userStories[0].location || 'India') : 'India');
    let category = 'Exploring';
    if (userStories.length > 0) {
      category = userStories[0].categories?.name || 'Travel';
    }

    const nameParts = (u.name || 'Traveler').trim().split(/\s+/);
    const initials = nameParts.length > 1
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
      : nameParts[0].substring(0, 2).toUpperCase();

    const colorIdx = travelers.length % avatarColors.length;
    const bannerUrl = getUserBanner(u.id);

    travelers.push({
      id: u.id,
      name: u.name,
      email: u.email,
      bio: u.bio || 'Passionate traveler sharing journeys and hidden gems.',
      avatar_url: u.avatar_url,
      banner_url: bannerUrl,
      initials,
      avatar_color: avatarColors[colorIdx],
      cover_gradient: coverGradients[colorIdx % coverGradients.length],
      location,
      category,
      stories_count: storiesCount,
      likes_count: likesCount,
      latest_story: latestStory,
      created_at: u.created_at
    });
  }

  let filtered = travelers;
  if (search) {
    filtered = filtered.filter(t => 
      (t.name && t.name.toLowerCase().includes(search)) ||
      (t.location && t.location.toLowerCase().includes(search)) ||
      (t.bio && t.bio.toLowerCase().includes(search)) ||
      (t.latest_story?.title && t.latest_story.title.toLowerCase().includes(search))
    );
  }

  if (filter === 'most_stories') {
    filtered.sort((a, b) => b.stories_count - a.stories_count || b.likes_count - a.likes_count || new Date(b.created_at) - new Date(a.created_at));
  } else if (filter === 'most_liked') {
    filtered.sort((a, b) => b.likes_count - a.likes_count || b.stories_count - a.stories_count || new Date(b.created_at) - new Date(a.created_at));
  } else if (filter === 'newest') {
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  const top = filtered.slice(0, 3);
  const others = filtered.slice(3);

  return {
    filter,
    total: filtered.length,
    top,
    others,
    users: filtered
  };
};

exports.getUserProfile = async (id, currentUserId) => {
  let targetId = id;
  if ((!targetId || targetId === 'me' || !UUID_REGEX.test(targetId)) && currentUserId && UUID_REGEX.test(currentUserId)) {
    targetId = currentUserId;
  }

  let user = null;
  if (targetId && UUID_REGEX.test(targetId)) {
    const { data } = await supabase
      .from('users')
      .select('id, name, email, bio, avatar_url, created_at')
      .eq('id', targetId)
      .maybeSingle();
    user = data;
  }

  if (!user && currentUserId && UUID_REGEX.test(currentUserId)) {
    const { data } = await supabase
      .from('users')
      .select('id, name, email, bio, avatar_url, created_at')
      .eq('id', currentUserId)
      .maybeSingle();
    user = data;
  }

  // Fallback to latest user if invalid id or not found
  if (!user) {
    const { data } = await supabase
      .from('users')
      .select('id, name, email, bio, avatar_url, created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    user = data;
  }

  if (!user) throw new ApiError(404, 'User not found');

  // Compute user stats
  const { data: userStories } = await supabase
    .from('stories')
    .select('id, location')
    .eq('user_id', user.id);

  const storiesCount = userStories ? userStories.length : 0;
  const storyIds = (userStories || []).map(s => s.id);

  let likesCount = 0;
  let savedCount = 0;

  if (storyIds.length > 0) {
    const { count: lc } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .in('story_id', storyIds);
    likesCount = lc || 0;

    const { count: sc } = await supabase
      .from('saved_stories')
      .select('*', { count: 'exact', head: true })
      .in('story_id', storyIds);
    savedCount = sc || 0;
  }

  // Determine top/recent location from stories or custom saved location
  const customLoc = getUserLocation(user.id);
  const location = customLoc || ((userStories && userStories.length > 0) ? userStories[0].location : 'India');

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    bio: user.bio || '',
    avatar_url: user.avatar_url,
    banner_url: getUserBanner(user.id),
    location: location,
    created_at: user.created_at,
    stats: {
      stories: storiesCount,
      likes: likesCount,
      saved: savedCount
    }
  };
};

exports.getUserStories = async (id, currentUserId) => {
  let targetId = id;
  if (!targetId || !UUID_REGEX.test(targetId)) {
    const { data: fallbackUser } = await supabase
      .from('users')
      .select('id')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();
    targetId = fallbackUser?.id;
  }

  if (!targetId) return { stories: [] };

  const { data, error } = await supabase
    .from('stories')
    .select('*, categories(name), users!stories_user_id_fkey(id, name, avatar_url), story_images(*), likes(count), comments(count)')
    .eq('user_id', targetId)
    .order('created_at', { ascending: false });

  if (error) throw new ApiError(500, error.message);

  if (currentUserId && data && data.length > 0) {
    const storyIds = data.map(d => d.id);
    const { data: likes } = await supabase.from('likes').select('story_id').eq('user_id', currentUserId).in('story_id', storyIds);
    const { data: saves } = await supabase.from('saved_stories').select('story_id').eq('user_id', currentUserId).in('story_id', storyIds);
    const likedSet = new Set(likes ? likes.map(l => l.story_id) : []);
    const savedSet = new Set(saves ? saves.map(s => s.story_id) : []);
    data.forEach(d => {
      if (likedSet.has(d.id)) d.likes_me = [{}];
      if (savedSet.has(d.id)) d.saved_me = [{}];
    });
  }

  return { stories: (data || []).map(d => formatStory(d, currentUserId)) };
};

exports.getSavedStories = async (userId) => {
  const { data: saved, error: savedError } = await supabase
    .from('saved_stories')
    .select('story_id')
    .eq('user_id', userId);

  if (savedError) throw new ApiError(500, savedError.message);
  if (!saved || saved.length === 0) return { stories: [] };

  const storyIds = saved.map(s => s.story_id);

  const { data, error } = await supabase
    .from('stories')
    .select('*, categories(name), users!stories_user_id_fkey(id, name, avatar_url), story_images(*), likes(count), comments(count)')
    .in('id', storyIds);

  if (error) throw new ApiError(500, error.message);

  if (data && data.length > 0) {
    const { data: likes } = await supabase.from('likes').select('story_id').eq('user_id', userId).in('story_id', storyIds);
    const likedSet = new Set(likes ? likes.map(l => l.story_id) : []);
    data.forEach(d => {
      if (likedSet.has(d.id)) d.likes_me = [{}];
      d.saved_me = [{}];
    });
  }

  return { stories: (data || []).map(d => formatStory(d, userId)) };
};

exports.updateMe = async (userId, body, files = {}) => {
  const updates = {};
  if (body.name && body.name.trim()) updates.name = body.name.trim();
  if (body.bio !== undefined) updates.bio = body.bio;

  const uploadDir = path.join(__dirname, '../../../uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const avatarFile = files.avatar || (files.buffer ? files : null);
  if (avatarFile && avatarFile.buffer) {
    const ext = avatarFile.mimetype ? (avatarFile.mimetype.split('/')[1] || 'jpg') : 'jpg';
    const filename = `avatar_${userId}_${Date.now()}.${ext}`;
    fs.writeFileSync(path.join(uploadDir, filename), avatarFile.buffer);
    updates.avatar_url = `http://localhost:5000/uploads/${filename}`;
  }

  let bannerUrl = getUserBanner(userId);
  if (files.banner && files.banner.buffer) {
    const ext = files.banner.mimetype ? (files.banner.mimetype.split('/')[1] || 'jpg') : 'jpg';
    const filename = `banner_${userId}_${Date.now()}.${ext}`;
    fs.writeFileSync(path.join(uploadDir, filename), files.banner.buffer);
    bannerUrl = `http://localhost:5000/uploads/${filename}`;
    setUserBanner(userId, bannerUrl);
  }

  let data = null;
  if (Object.keys(updates).length > 0) {
    const { data: updated, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select('id, name, email, bio, avatar_url, created_at')
      .single();
    if (error) throw new ApiError(500, error.message);
    data = updated;
  } else {
    const { data: existing, error } = await supabase
      .from('users')
      .select('id, name, email, bio, avatar_url, created_at')
      .eq('id', userId)
      .single();
    if (error) throw new ApiError(500, error.message);
    data = existing;
  }

  if (body.location !== undefined) {
    setUserLocation(userId, body.location.trim());
  }

  return { ...data, banner_url: bannerUrl, location: getUserLocation(userId) };
};