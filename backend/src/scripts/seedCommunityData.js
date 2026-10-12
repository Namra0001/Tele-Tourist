require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const supabase = require('../config/supabase');

const TRAVELERS = [
  {
    emailMatch: 'liker0@test.com',
    name: 'Aarav Kapadia',
    bio: 'Weekend trekker and slow-travel convert. Writes about places that never reach page one.',
    location: 'Pune, Maharashtra',
    storiesTarget: 10,
    likesTarget: 18
  },
  {
    emailMatch: 'liker1@test.com',
    name: 'Meera Shah',
    bio: 'Coastlines, cheap buses and long walks. Always carries a notebook and a film camera.',
    location: 'Bengaluru, Karnataka',
    storiesTarget: 6,
    likesTarget: 40 // #1 Most liked!
  },
  {
    emailMatch: 'liker2@test.com',
    name: 'Dev Patel',
    bio: 'Desert nights, road trips and honest reviews of camps and homestays.',
    location: 'Ahmedabad, Gujarat',
    storiesTarget: 5,
    likesTarget: 32 // #2 Most liked!
  },
  {
    emailMatch: 'liker3@test.com',
    name: 'Zoya Ansari',
    bio: 'Food trails, heritage alleys and discovering authentic local flavors across India.',
    location: 'Mumbai, Maharashtra',
    storiesTarget: 4,
    likesTarget: 26 // #3 Most liked!
  },
  {
    emailMatch: 'liker4@test.com',
    name: 'Rohan Mehta',
    bio: 'Architectural historian on wheels. Documenting forgotten forts and stepwells.',
    location: 'Hyderabad, Telangana',
    storiesTarget: 3,
    likesTarget: 15
  },
  {
    emailMatch: 'liker5@test.com',
    name: 'Isha Trivedi',
    bio: 'Lakes, palatial ruins and vibrant Rajasthani culture. Solo travel advocate.',
    location: 'Udaipur, Rajasthan',
    storiesTarget: 3,
    likesTarget: 12
  },
  {
    emailMatch: 'liker6@test.com',
    name: 'Tanvi Gandhi',
    bio: 'Solo budget explorer, craft bazaars, Himalayan trails and train journeys.',
    location: 'Jaipur, Rajasthan',
    storiesTarget: 3,
    likesTarget: 10
  },
  {
    emailMatch: 'liker7@test.com',
    name: 'Nikhil Rao',
    bio: 'Backwaters, spice plantations, monsoon drives and south Indian filter coffee.',
    location: 'Kochi, Kerala',
    storiesTarget: 2,
    likesTarget: 8
  },
  {
    emailMatch: 'liker8@test.com',
    name: 'Kabir Soni',
    bio: 'Motorcycle tours across Himalayan passes and high-altitude mountain trails.',
    location: 'Delhi',
    storiesTarget: 2,
    likesTarget: 7
  },
  {
    emailMatch: 'liker9@test.com',
    name: 'Ananya Sen',
    bio: 'Colonial architecture, tea estates of Darjeeling, and cultural walks.',
    location: 'Kolkata, West Bengal',
    storiesTarget: 2,
    likesTarget: 6
  },
  {
    emailMatch: 'liker10@test.com',
    name: 'Arjun Nair',
    bio: 'Western Ghats biodiversity, coastal highways and ancient temple trails.',
    location: 'Chennai, Tamil Nadu',
    storiesTarget: 2,
    likesTarget: 5
  },
  {
    emailMatch: 'liker11@test.com',
    name: 'Riya Sharma',
    bio: 'Pine forests, apple orchards and off-grid mountain cabins in Himachal.',
    location: 'Shimla, Himachal Pradesh',
    storiesTarget: 1,
    likesTarget: 4
  }
];

async function seed() {
  console.log('Seeding realistic community data...');
  const { data: users, error: uErr } = await supabase.from('users').select('*');
  if (uErr) {
    console.error('Failed to get users:', uErr);
    return;
  }
  const userByEmail = {};
  users.forEach(u => userByEmail[u.email] = u);

  // 1. Update traveler names and bios
  for (const t of TRAVELERS) {
    const user = userByEmail[t.emailMatch];
    if (user) {
      await supabase.from('users').update({
        name: t.name,
        bio: t.bio
      }).eq('id', user.id);
      t.id = user.id;
    }
  }

  // Also enhance Namra Dabhi if bio is null
  const namra = userByEmail['namradabhi1613@gmail.com'];
  if (namra && !namra.bio) {
    await supabase.from('users').update({
      bio: 'Exploring heritage sites, hidden stepwells and local cultures.'
    }).eq('id', namra.id);
  }

  // 2. Distribute stories among travelers
  const { data: allStories } = await supabase.from('stories').select('id, title, user_id, location, created_at').order('created_at', { ascending: false });
  console.log(`Total stories available: ${allStories.length}`);

  // We keep Sky Wood's stories intact (Sky Wood currently has stories, let's keep them and maybe add 2 more so Sky Wood has 8 stories and is #2 Most stories!)
  const skyWood = userByEmail['namradabhi0001@gmail.com'];
  
  // Collect stories not belonging to Sky Wood or TestUser
  const availableStories = allStories.filter(s => s.user_id !== skyWood?.id && s.user_id !== userByEmail['test1791624713977@example.com']?.id);

  let storyIdx = 0;
  // Aarav Kapadia gets storiesTarget = 10
  // Sky Wood gets ~8 stories
  // Meera Shah gets 6 stories
  // Dev Patel gets 5 stories, etc.
  for (const t of TRAVELERS) {
    if (!t.id) continue;
    const count = t.storiesTarget;
    for (let i = 0; i < count && storyIdx < availableStories.length; i++) {
      const s = availableStories[storyIdx++];
      await supabase.from('stories').update({ user_id: t.id }).eq('id', s.id);
    }
  }

  // Make Sky Wood have 8 stories (#2 in most stories)
  if (skyWood) {
    for (let i = 0; i < 6 && storyIdx < availableStories.length; i++) {
      const s = availableStories[storyIdx++];
      await supabase.from('stories').update({ user_id: skyWood.id }).eq('id', s.id);
    }
  }

  // 3. Clear and generate realistic likes in `likes` table
  console.log('Distributing likes...');
  // All user IDs to act as likers
  const allUserIds = users.map(u => u.id);

  // For each traveler, find their assigned stories and add likes
  const { data: updatedStories } = await supabase.from('stories').select('id, user_id');
  
  const storiesByAuthor = {};
  updatedStories.forEach(s => {
    if (!storiesByAuthor[s.user_id]) storiesByAuthor[s.user_id] = [];
    storiesByAuthor[s.user_id].push(s.id);
  });

  // Clear existing likes
  await supabase.from('likes').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // Insert likes target for each traveler
  const likesToInsert = [];
  const addedSet = new Set();

  function addLike(storyId, likerId) {
    const key = `${storyId}_${likerId}`;
    if (!addedSet.has(key)) {
      addedSet.add(key);
      likesToInsert.push({ story_id: storyId, user_id: likerId });
    }
  }

  for (const t of TRAVELERS) {
    if (!t.id) continue;
    const authorStories = storiesByAuthor[t.id] || [];
    if (authorStories.length === 0) continue;

    let target = t.likesTarget || 5;
    let likerIdx = 0;
    while (target > 0 && likerIdx < allUserIds.length * authorStories.length) {
      const storyId = authorStories[likerIdx % authorStories.length];
      const likerId = allUserIds[(likerIdx + 3) % allUserIds.length];
      if (likerId !== t.id) {
        addLike(storyId, likerId);
        target--;
      }
      likerIdx++;
    }
  }

  // Also give Sky Wood ~20 likes
  if (skyWood && storiesByAuthor[skyWood.id]) {
    const swStories = storiesByAuthor[skyWood.id];
    for (let i = 0; i < 20 && i < allUserIds.length; i++) {
      const storyId = swStories[i % swStories.length];
      const likerId = allUserIds[i];
      if (likerId !== skyWood.id) addLike(storyId, likerId);
    }
  }

  // Insert in chunks of 50
  for (let i = 0; i < likesToInsert.length; i += 50) {
    const chunk = likesToInsert.slice(i, i + 50);
    const { error: lErr } = await supabase.from('likes').insert(chunk);
    if (lErr) console.error('Insert likes chunk error:', lErr);
  }

  console.log(`Successfully seeded ${likesToInsert.length} likes across community travelers!`);
}

seed().then(() => {
  console.log('Seeding complete.');
  process.exit(0);
}).catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
