const { Client } = require('pg');

const connectionString = 'postgres://postgres:Tele-Tourist@2026@db.pocqdjtzkzdcaxutpzdl.supabase.co:5432/postgres';

const client = new Client({
  connectionString,
});

async function seed() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL successfully!");

    // Create Tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT UNIQUE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS public.stories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        location TEXT,
        user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
        category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS public.story_images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
        url TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS public.likes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
        user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
        UNIQUE(story_id, user_id)
      );

      CREATE TABLE IF NOT EXISTS public.comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
        user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `);
    
    console.log("Tables created!");

    // Insert Categories
    const categories = ['Mountains', 'Beaches', 'Heritage', 'Food trails', 'Road trips', 'Solo & budget', 'Nature'];
    for (const cat of categories) {
      await client.query(`INSERT INTO public.categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`, [cat]);
    }

    // Insert 50 dummy users for likes
    console.log("Creating 50 dummy users...");
    const userIds = [];
    for(let i=0; i<50; i++) {
        // use ON CONFLICT DO NOTHING for email
        let res = await client.query(`INSERT INTO public.users (name, email, password_hash) VALUES ($1, $2, 'hash') ON CONFLICT(email) DO NOTHING RETURNING id`, [`Liker ${i}`, `liker${i}@test.com`]);
        if (res.rows.length === 0) {
           res = await client.query(`SELECT id FROM public.users WHERE email=$1`, [`liker${i}@test.com`]);
        }
        userIds.push(res.rows[0].id);
    }
    const authorId = userIds[0];

    // Get categories
    let res = await client.query(`SELECT id, name FROM public.categories`);
    const cats = res.rows;

    const locations = ['Spiti Valley', 'Gokarna', 'Jaisalmer', 'Hampi', 'Munnar', 'Goa', 'Rishikesh', 'Ladakh', 'Jaipur', 'Varanasi', 'Andaman', 'Darjeeling'];
    const adjectives = ['Beautiful', 'Amazing', 'Quiet', 'Stunning', 'Hidden', 'Magical', 'Unforgettable', 'Peaceful'];
    
    // Insert 50 dummy stories
    console.log("Inserting 50 dummy stories...");
    for (let i = 0; i < 50; i++) {
      const loc = locations[Math.floor(Math.random() * locations.length)];
      const cat = cats[Math.floor(Math.random() * cats.length)];
      const title = `${adjectives[Math.floor(Math.random() * adjectives.length)]} trip to ${loc}`;
      
      const storyRes = await client.query(`
        INSERT INTO public.stories (title, description, location, user_id, category_id)
        VALUES ($1, $2, $3, $4, $5) RETURNING id
      `, [title, `This is a dummy story description for ${loc}. We had a great time discovering the culture and sights!`, loc, authorId, cat.id]);
      
      const storyId = storyRes.rows[0].id;
      
      // Random likes (0 to 50)
      const numLikes = Math.floor(Math.random() * 50);
      for(let j = 0; j < numLikes; j++) {
         await client.query(`INSERT INTO public.likes (story_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [storyId, userIds[j]]);
      }
    }

    console.log("50 Dummy Stories inserted successfully!");

  } catch (err) {
    console.error("Database error", err);
  } finally {
    await client.end();
  }
}

seed();
