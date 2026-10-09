require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const xlsx = require('xlsx');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const workbook = xlsx.readFile('../travel_stories_50_dummy_data.xlsx');
  const sheetName = workbook.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  console.log('Fetching users...');
  const { data: users } = await supabase.from('users').select('id');
  
  console.log('Fetching categories...');
  const { data: cats } = await supabase.from('categories').select('*');
  const catMap = {};
  cats.forEach(c => catMap[c.name.toLowerCase()] = c.id);

  console.log('Deleting old stories...');
  await supabase.from('stories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('story_images').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  console.log('Inserting new stories...');
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const catId = catMap[(row.Category || 'General').toLowerCase()] || cats[0].id;
    const userId = users[i % users.length].id;

    const { data: story, error } = await supabase.from('stories').insert([{
      user_id: userId,
      category_id: catId,
      title: row.Title,
      description: row.Description,
      location: row.Location
    }]).select().single();
    
    if (error) {
      console.error('Error inserting story:', error);
      continue;
    }
    
    if (row.Image) {
        await supabase.from('story_images').insert([{
            story_id: story.id,
            image_url: row.Image
        }]);
    }
  }
  console.log('Done!');
}
run();
