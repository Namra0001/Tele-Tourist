const supabase = require('../config/supabase');
const ApiError = require('../utils/ApiError');
const formatStory = require('../utils/formatStory');

exports.getDestinations = async (query = {}) => {
  const { data, error } = await supabase
    .from('stories')
    .select('*, categories(name), users!stories_user_id_fkey(id, name, avatar_url), story_images(*), likes(count)')
    .order('created_at', { ascending: false });

  if (error) throw new ApiError(500, error.message);

  const destMap = {};
  const allStories = data || [];

  const allImages = [];

  allStories.forEach(s => {
    const rawLoc = (s.location || '').trim();
    if (!rawLoc) return;

    if (!destMap[rawLoc]) {
      const parts = rawLoc.split(',').map(p => p.trim());
      destMap[rawLoc] = {
        name: rawLoc,
        title: parts[0],
        state: parts.length > 1 ? parts.slice(1).join(', ') : parts[0],
        description: s.description || '',
        storiesCount: 0,
        photosCount: 0,
        likesCount: 0,
        travelersMap: {},
        categoryCounts: {},
        images: [],
        stories: []
      };
    }

    const d = destMap[rawLoc];
    d.storiesCount += 1;
    const photoCount = (s.story_images && Array.isArray(s.story_images)) ? s.story_images.length : 0;
    d.photosCount += photoCount;
    const lkCount = (s.likes && s.likes[0] && s.likes[0].count) || 0;
    d.likesCount += lkCount;

    if (s.story_images && Array.isArray(s.story_images)) {
      s.story_images.forEach(img => {
        const url = img.url || img.image_url;
        if (url) {
          d.images.push(url);
          allImages.push({
            url,
            storyTitle: s.title,
            location: s.location,
            author: s.users?.name || 'Traveler'
          });
        }
      });
    }

    if (s.users && s.users.id) {
      d.travelersMap[s.users.id] = {
        id: s.users.id,
        name: s.users.name || 'Traveler',
        avatar_url: s.users.avatar_url
      };
    }

    const cat = s.categories?.name || 'General';
    d.categoryCounts[cat] = (d.categoryCounts[cat] || 0) + 1;

    d.stories.push({
      id: s.id,
      title: s.title,
      description: s.description,
      likes_count: lkCount,
      author: s.users ? { name: s.users.name, avatar_url: s.users.avatar_url } : null,
      created_at: s.created_at
    });
  });

  const allDestinations = Object.values(destMap).map(d => {
    let topCat = 'General';
    let maxCatCnt = 0;
    for (const [c, cnt] of Object.entries(d.categoryCounts)) {
      if (cnt > maxCatCnt) {
        maxCatCnt = cnt;
        topCat = c;
      }
    }
    const travelers = Object.values(d.travelersMap);
    return {
      name: d.name,
      title: d.title,
      state: d.state,
      description: d.description,
      storiesCount: d.storiesCount,
      photosCount: d.photosCount,
      likesCount: d.likesCount,
      travelersCount: travelers.length,
      travelers: travelers.slice(0, 4),
      category: topCat,
      images: d.images,
      topStory: d.stories[0]
    };
  });

  // Sort by most stories posted, then popularity (likes)
  allDestinations.sort((a, b) => b.storiesCount - a.storiesCount || b.likesCount - a.likesCount);

  const featured = allDestinations.length > 0 ? allDestinations[0] : null;
  const trending = allDestinations.slice(0, 5);

  const topStories = [...allStories]
    .sort((a, b) => ((b.likes && b.likes[0] && b.likes[0].count) || 0) - ((a.likes && a.likes[0] && a.likes[0].count) || 0))
    .slice(0, 5)
    .map(s => ({
      id: s.id,
      title: s.title,
      location: s.location,
      likes_count: (s.likes && s.likes[0] && s.likes[0].count) || 0,
      image: (s.story_images && s.story_images[0]) ? (s.story_images[0].url || s.story_images[0].image_url) : null
    }));

  return {
    featured,
    trending,
    topStories,
    allImages,
    destinations: allDestinations,
    total: allDestinations.length
  };
};

exports.getDestinationStories = async (location) => {
  const { data, error } = await supabase
    .from('stories')
    .select('*, categories(name), users!stories_user_id_fkey(id, name, avatar_url), story_images(*), likes(count), comments(count)')
    .ilike('location', `%${location}%`);

  if (error) throw new ApiError(500, error.message);
  return (data || []).map(d => formatStory(d));
};