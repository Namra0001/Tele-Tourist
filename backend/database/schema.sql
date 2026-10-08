-- Supabase schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  avatar_public_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id),
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE story_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  public_id TEXT NOT NULL,
  position INTEGER DEFAULT 0
);

CREATE TABLE likes (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, story_id)
);

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE saved_stories (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, story_id)
);

CREATE INDEX idx_stories_user_id ON stories(user_id);
CREATE INDEX idx_stories_category_id ON stories(category_id);
CREATE INDEX idx_stories_location ON stories(location);
CREATE INDEX idx_stories_created_at ON stories(created_at);
CREATE INDEX idx_story_images_story_id ON story_images(story_id);
CREATE INDEX idx_comments_story_id ON comments(story_id);

INSERT INTO categories (name, slug) VALUES 
('Mountains', 'mountains'),
('Beaches', 'beaches'),
('Heritage', 'heritage'),
('Food trails', 'food-trails'),
('Road trips', 'road-trips'),
('Solo & budget', 'solo-budget'),
('Nature', 'nature');

CREATE VIEW destination_stats AS
SELECT location, COUNT(*) as story_count,
       SUM(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 ELSE 0 END) as stories_last_30_days
FROM stories
GROUP BY location;

CREATE VIEW user_stats AS
SELECT u.id as user_id,
       (SELECT COUNT(*) FROM stories WHERE user_id = u.id) as story_count,
       (SELECT COUNT(*) FROM likes l JOIN stories s ON l.story_id = s.id WHERE s.user_id = u.id) as likes_received,
       (SELECT COUNT(*) FROM saved_stories s JOIN stories st ON s.story_id = st.id WHERE st.user_id = u.id) as times_saved
FROM users u;
