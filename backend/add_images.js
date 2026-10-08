const { Client } = require('pg');

const connectionString = 'postgres://postgres:Tele-Tourist@2026@db.pocqdjtzkzdcaxutpzdl.supabase.co:5432/postgres';

const client = new Client({
  connectionString,
});

async function addImages() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL successfully!");

    // Get all stories
    const res = await client.query(`SELECT id, location FROM public.stories`);
    const stories = res.rows;
    
    console.log(`Found ${stories.length} stories. Adding images...`);

    let count = 0;
    for (const story of stories) {
      // Create a random image URL for travel
      const width = 600;
      const height = 400 + (count % 3) * 50; // Add some variation to aspect ratio
      const imgUrl = `https://picsum.photos/${width}/${height}?random=${count + 100}`;
      
      await client.query(`
        INSERT INTO public.story_images (story_id, url)
        VALUES ($1, $2)
      `, [story.id, imgUrl]);
      
      count++;
    }

    console.log(`Successfully added images to ${count} stories!`);

  } catch (err) {
    console.error("Database error", err);
  } finally {
    await client.end();
  }
}

addImages();
