module.exports = (storyRow, userId = null) => {
  return {
    id: storyRow.id,
    title: storyRow.title,
    description: storyRow.description,
    location: storyRow.location,
    rating: storyRow.rating || 5,
    category: storyRow.categories?.name,
    images: storyRow.story_images ? storyRow.story_images.map(img => img.url || img.image_url).filter(Boolean) : [],
    author: {
      id: storyRow.users?.id,
      name: storyRow.users?.name,
      avatar_url: storyRow.users?.avatar_url
    },
    likes_count: storyRow.likes ? storyRow.likes[0]?.count || 0 : 0,
    comment_count: storyRow.comments ? storyRow.comments[0]?.count || 0 : 0,
    liked_by_me: userId && storyRow.likes_me && storyRow.likes_me.length > 0 ? true : false,
    saved_by_me: userId && storyRow.saved_me && storyRow.saved_me.length > 0 ? true : false,
    created_at: storyRow.created_at
  };
};