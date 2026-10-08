const { Client } = require('pg');

const connectionString = 'postgres://postgres:Tele-Tourist@2026@db.pocqdjtzkzdcaxutpzdl.supabase.co:5432/postgres';

const client = new Client({
  connectionString,
});

async function seed() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL successfully!");

    // Insert 50 dummy users for likes
    console.log("Creating 50 dummy users...");
    const userIds = [];
    for(let i=0; i<50; i++) {
        const res = await client.query(`INSERT INTO public.users (name, email, password_hash) VALUES ($1, $2, 'hash') RETURNING id`, [`Liker ${i}`, `liker${i}@test.com`]);
        userIds.push(res.rows[0].id);
    }
    const authorId = userIds[0];

    // Get categories
    const res = await client.query(`SELECT id, name FROM public.categories`);
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
