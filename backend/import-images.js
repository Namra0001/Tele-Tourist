require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const xlsx = require('xlsx');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const workbook = xlsx.readFile('../travel_stories_50_dummy_data.xlsx');
  const sheetName = workbook.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  const { data: stories } = await supabase.from('stories').select('id, title');

  for (let row of data) {
    if (row.Image) {
      const story = stories.find(s => s.title === row.Title);
      if (story) {
        await supabase.from('story_images').insert([{
            story_id: story.id,
            url: row.Image
        }]);
      }
    }
  }
  console.log('Images imported!');
}
run();
