let allDestinationsData = [];
let allTrendingData = [];
let featuredDestinationData = null;
let allStoryImagesData = [];
let currentCategoryFilter = 'All';
let currentSearchTerm = '';
let heroSlideshowTimer = null;
let cardSlideshowTimer = null;

const CARD_THEMES = [
  {
    bg: 'linear-gradient(180deg, #E8F4F8 0%, #20556B 100%)',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none"><polygon points="0,100 30,40 60,100" fill="#3A5776"/><polygon points="40,100 70,50 100,100" fill="#2A3F54"/><polygon points="-10,100 15,60 40,100" fill="#4A6A8A"/><circle cx="70" cy="30" r="15" fill="#F9D08B"/></svg>`
  },
  {
    bg: 'linear-gradient(180deg, #F9D4A8 0%, #F99871 100%)',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none"><rect x="0" y="60" width="100%" height="40" fill="#20556B"/><rect x="0" y="80" width="100%" height="20" fill="#D95A97"/><circle cx="70" cy="55" r="15" fill="#F9D08B"/></svg>`
  },
  {
    bg: 'linear-gradient(180deg, #E8F4F8 0%, #20556B 100%)',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none"><polygon points="-20,100 20,40 60,100" fill="#1A4D2E"/><polygon points="20,100 50,50 80,100" fill="#133C24"/><polygon points="50,100 80,30 110,100" fill="#21633B"/><rect x="0" y="85" width="100%" height="15" fill="#D95A97"/></svg>`
  },
  {
    bg: 'linear-gradient(180deg, #F9D08B 0%, #D95A97 100%)',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none"><polygon points="0,100 40,50 80,100" fill="#8A4A6A"/><polygon points="40,100 70,60 100,100" fill="#6A3A5A"/><circle cx="30" cy="50" r="10" fill="#FDE8D3"/></svg>`
  },
  {
    bg: 'linear-gradient(135deg, #FDE8D3 0%, #D95A97 100%)',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none"><circle cx="20" cy="40" r="25" fill="#F9D08B"/><polygon points="40,100 70,70 100,100" fill="#B3467A"/><polygon points="70,100 90,80 110,100" fill="#8A3660"/></svg>`
  },
  {
    bg: 'linear-gradient(180deg, #2A3F54 0%, #4A2B48 100%)',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none"><rect x="10" y="50" width="15" height="50" fill="#8A4A6A"/><rect x="35" y="40" width="15" height="60" fill="#6A3A5A"/><rect x="60" y="60" width="15" height="40" fill="#8A4A6A"/><circle cx="85" cy="30" r="8" fill="#FDE8D3"/></svg>`
  },
  {
    bg: 'linear-gradient(180deg, #F99871 0%, #392B4B 100%)',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none"><polygon points="0,100 40,60 80,100" fill="#2D2138"/><polygon points="40,100 70,70 100,100" fill="#1E1426"/><circle cx="60" cy="50" r="10" fill="#F9D08B"/><rect x="0" y="85" width="100%" height="15" fill="#D95A97"/></svg>`
  },
  {
    bg: 'linear-gradient(180deg, #2D4059 0%, #1A2639 100%)',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none"><polygon points="0,100 40,40 80,100" fill="#3A5776"/><polygon points="40,100 70,50 100,100" fill="#2A3F54"/><circle cx="75" cy="25" r="15" fill="#E8F4F8"/></svg>`
  },
  {
    bg: 'linear-gradient(180deg, #E8D3BD 0%, #D45B6B 100%)',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none"><rect x="15" y="50" width="70" height="50" fill="#B4532A"/><rect x="15" y="30" width="15" height="20" fill="#B4532A"/><rect x="42.5" y="30" width="15" height="20" fill="#B4532A"/><rect x="70" y="30" width="15" height="20" fill="#B4532A"/><path d="M40,100 A10,10 0 0,1 60,100" fill="#3D2B1F"/></svg>`
  }
];

const TRENDING_ICONS = [
  {
    bg: 'linear-gradient(180deg, #FDE8D3 0%, #7C4C24 100%)',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"><rect x="20" y="50" width="60" height="50" fill="#B4532A"/><rect x="20" y="30" width="15" height="20" fill="#B4532A"/><rect x="42.5" y="30" width="15" height="20" fill="#B4532A"/><rect x="65" y="30" width="15" height="20" fill="#B4532A"/><path d="M40,100 A10,10 0 0,1 60,100" fill="#3D2B1F"/></svg>`
  },
  {
    bg: 'linear-gradient(180deg, #E8F4F8 0%, #20556B 100%)',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points="-20,100 30,30 80,100" fill="#3A5776"/><polygon points="30,100 70,50 110,100" fill="#2A3F54"/></svg>`
  },
  {
    bg: 'linear-gradient(180deg, #F9D4A8 0%, #F99871 100%)',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"><rect x="0" y="70" width="100" height="30" fill="#20556B"/><rect x="0" y="85" width="100" height="15" fill="#E8D3BD"/><circle cx="50" cy="50" r="15" fill="#F9D08B"/></svg>`
  },
  {
    bg: 'linear-gradient(180deg, #F99871 0%, #392B4B 100%)',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points="0,100 50,60 100,100" fill="#2D2138"/><polygon points="20,100 60,70 100,100" fill="#1E1426"/><circle cx="70" cy="60" r="10" fill="#F9D08B"/></svg>`
  },
  {
    bg: 'linear-gradient(180deg, #2D4059 0%, #1A2639 100%)',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points="0,100 30,50 60,100" fill="#3A5776"/><polygon points="40,100 70,60 100,100" fill="#2A3F54"/><circle cx="80" cy="20" r="8" fill="#E8F4F8"/></svg>`
  }
];

const AVATAR_PALETTE = ['#0E7C86', '#7B68EE', '#B8860B', '#B22222', '#2F7D5B', '#8A5A9E', '#C2402A', '#2D4059'];

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getTravelerInitials(name) {
  if (!name) return 'TR';
  const clean = name.replace(/[^a-zA-Z\s]/g, '').trim();
  const parts = clean.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase() || 'TR';
}

function renderAvatarElement(traveler, size = 36, marginLeft = -12, fontSize = 12) {
  const name = traveler?.name || 'Traveler';
  const initials = getTravelerInitials(name);
  const colorIndex = (name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % AVATAR_PALETTE.length;
  const bgColor = AVATAR_PALETTE[colorIndex];
  const marginStyle = marginLeft !== 0 ? `margin-left: ${marginLeft}px;` : '';

  if (traveler?.avatar_url) {
    return `<img src="${escapeHtml(traveler.avatar_url)}" alt="${escapeHtml(name)}" title="${escapeHtml(name)}" class="avatar" style="width: ${size}px; height: ${size}px; border-radius: 50%; border: 2px solid white; object-fit: cover; ${marginStyle}">`;
  }

  return `<div class="avatar" title="${escapeHtml(name)}" style="background-color: ${bgColor}; width: ${size}px; height: ${size}px; font-size: ${fontSize}px; ${marginStyle} border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; font-weight: 700; color: white;">${initials}</div>`;
}

$(document).ready(function() {
  loadDestinationsPage();
  setupSearchAndFilters();
});

async function loadDestinationsPage() {
  try {
    let data = null;
    if (typeof apiCall === 'function') {
      try {
        data = await apiCall('/destinations');
      } catch (err) {
        console.warn('API call failed, attempting fallback to /stories:', err);
      }
    }

    // Fallback aggregation from stories if /destinations endpoint returned empty/failed
    if (!data || (!data.destinations && !Array.isArray(data))) {
      const storiesResp = await (typeof apiCall === 'function' ? apiCall('/stories?limit=200') : Promise.resolve([]));
      const stories = Array.isArray(storiesResp) ? storiesResp : (storiesResp.stories || []);
      data = aggregateDestinationsClientSide(stories);
    }

    const destinations = Array.isArray(data) ? data : (data.destinations || []);
    allDestinationsData = destinations;
    allTrendingData = data.trending || destinations.slice(0, 5);
    featuredDestinationData = data.featured || destinations[0] || null;

    // Collect all story images from all users across all stories
    allStoryImagesData = [];
    if (data.allImages && Array.isArray(data.allImages) && data.allImages.length > 0) {
      allStoryImagesData = data.allImages.map(img => (typeof img === 'string' ? img : img.url)).filter(Boolean);
    } else {
      // Fallback: extract from destinations or stories
      destinations.forEach(d => {
        if (d.images && Array.isArray(d.images)) {
          d.images.forEach(img => { if (img) allStoryImagesData.push(img); });
        }
      });
    }

    renderHeroBanner(featuredDestinationData);
    renderTrendingSection(allTrendingData);
    renderBrowseSection();
    initCardSlideshows();
  } catch (error) {
    console.error('Error loading destinations page:', error);
  }
}

function aggregateDestinationsClientSide(stories) {
  const destMap = {};
  const allImages = [];

  stories.forEach(s => {
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
    const imgs = s.images || (s.story_images ? s.story_images.map(img => img.url || img.image_url) : []);
    d.photosCount += imgs.length;
    imgs.forEach(url => {
      if (url) {
        d.images.push(url);
        allImages.push(url);
      }
    });

    const lkCnt = s.likes_count || s.like_count || 0;
    d.likesCount += lkCnt;
    if (s.author && s.author.name) {
      d.travelersMap[s.author.name] = { id: s.author.id, name: s.author.name, avatar_url: s.author.avatar_url };
    }
    const catName = typeof s.category === 'string' ? s.category : (s.category?.name || 'Nature');
    d.categoryCounts[catName] = (d.categoryCounts[catName] || 0) + 1;
    d.stories.push(s);
  });

  const destinations = Object.values(destMap).map(d => {
    let topCat = 'Nature';
    let maxCat = 0;
    for (const [c, cnt] of Object.entries(d.categoryCounts)) {
      if (cnt > maxCat) {
        maxCat = cnt;
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
      travelersCount: travelers.length || 1,
      travelers: travelers.slice(0, 4),
      category: topCat,
      images: d.images
    };
  });

  destinations.sort((a, b) => b.storiesCount - a.storiesCount || b.likesCount - a.likesCount);
  return {
    featured: destinations[0] || null,
    trending: destinations.slice(0, 5),
    allImages: allImages,
    destinations: destinations,
    total: destinations.length
  };
}

function renderHeroBanner(featured) {
  if (!featured) return;

  // Title: destination name instead of Spiti Valley
  $('#hero-dest-name').text(featured.title || featured.name);

  // Description
  const desc = featured.description || `Discover memories, photographs and stories from travelers visiting ${featured.title || featured.name}.`;
  $('#hero-dest-desc').text(desc);

  // Stats: stories, photos, travelers
  $('#hero-stories-count').text(featured.storiesCount || 0);
  $('#hero-photos-count').text(featured.photosCount || 0);
  $('#hero-travelers-count').text(featured.travelersCount || (featured.travelers ? featured.travelers.length : 0));

  // 4 avatars of users who posted stories on this destination
  const avatarsContainer = $('#hero-avatars-stack');
  avatarsContainer.empty();

  let travelers = featured.travelers || [];
  if (travelers.length === 0) {
    travelers = [{ name: 'Traveler' }];
  }

  const displayTravelers = travelers.slice(0, 4);
  displayTravelers.forEach((tr, idx) => {
    const ml = idx === 0 ? 0 : -12;
    avatarsContainer.append(renderAvatarElement(tr, 36, ml, 12));
  });

  // Only display images belonging to this specific destination
  initHeroSlideshow(featured.images || []);
}

function initHeroSlideshow(images) {
  const container = $('#hero-slideshow-container');
  container.empty();

  if (heroSlideshowTimer) {
    clearInterval(heroSlideshowTimer);
    heroSlideshowTimer = null;
  }

  if (!images || images.length === 0) return;

  // Render slides for all images
  images.forEach((imgUrl, index) => {
    const slide = $(`<div class="hero-slide ${index === 0 ? 'active' : ''}"></div>`);
    slide.css('background-image', `url('${imgUrl}')`);
    container.append(slide);
  });

  if (images.length <= 1) return;

  let currentIndex = 0;
  heroSlideshowTimer = setInterval(() => {
    const slides = container.find('.hero-slide');
    if (slides.length <= 1) return;
    slides.eq(currentIndex).removeClass('active');
    currentIndex = (currentIndex + 1) % slides.length;
    slides.eq(currentIndex).addClass('active');
  }, 3500);
}

function renderTrendingSection(trending) {
  const leftCol = $('#trending-col-left');
  const rightCol = $('#trending-col-right');
  leftCol.empty();
  rightCol.empty();

  if (!trending || trending.length === 0) return;

  const leftRanks = [0, 2, 4];
  const rightRanks = [1, 3];

  leftRanks.forEach((idx, i) => {
    if (trending[idx]) {
      const rankNumber = idx + 1;
      const isLast = (i === leftRanks.filter(ri => trending[ri]).length - 1);
      leftCol.append(createTrendingRowHtml(trending[idx], rankNumber, isLast));
    }
  });

  rightRanks.forEach((idx, i) => {
    if (trending[idx]) {
      const rankNumber = idx + 1;
      const isLast = (i === rightRanks.filter(ri => trending[ri]).length - 1);
      rightCol.append(createTrendingRowHtml(trending[idx], rankNumber, isLast));
    }
  });
}

function createTrendingRowHtml(dest, rankNumber, isLast) {
  const iconTheme = TRENDING_ICONS[(rankNumber - 1) % TRENDING_ICONS.length];
  const borderClass = isLast ? 'border-bottom-0' : '';
  const title = dest.title || dest.name;
  const subtitle = dest.state || 'India';
  const storiesCount = dest.storiesCount || 1;

  // Use destination image if available, else SVG artwork
  let thumbHtml = '';
  if (dest.images && dest.images.length > 0) {
    thumbHtml = `<div class="trending-thumb" style="background-image: url('${escapeHtml(dest.images[0])}'); background-size: cover; background-position: center;"></div>`;
  } else {
    thumbHtml = `<div class="trending-thumb" style="background: ${iconTheme.bg};">${iconTheme.svg}</div>`;
  }

  return `
    <div class="trending-row ${borderClass}" style="cursor: pointer;" onclick="handleSelectDestination('${escapeHtml(dest.name)}')">
        <div class="rank-number">${rankNumber}</div>
        ${thumbHtml}
        <div class="flex-grow-1 me-2">
            <h6 class="fw-bold text-ink mb-0">${escapeHtml(title)}</h6>
            <div class="text-secondary" style="font-size: 11px;">${escapeHtml(subtitle)}</div>
        </div>
        <div class="growth-pill">+${storiesCount} ${storiesCount === 1 ? 'story' : 'stories'}</div>
    </div>
  `;
}

function renderBrowseSection() {
  const grid = $('#browse-dest-grid');
  grid.empty();

  let filtered = [...allDestinationsData];

  // 1. Filter by category
  if (currentCategoryFilter && currentCategoryFilter !== 'All') {
    filtered = filtered.filter(d => {
      const cat = (d.category || '').toLowerCase();
      return cat.includes(currentCategoryFilter.toLowerCase());
    });
  }

  // 2. Filter by search input
  if (currentSearchTerm && currentSearchTerm.trim() !== '') {
    const term = currentSearchTerm.trim().toLowerCase();
    filtered = filtered.filter(d => {
      const name = (d.name || '').toLowerCase();
      const title = (d.title || '').toLowerCase();
      const state = (d.state || '').toLowerCase();
      return name.includes(term) || title.includes(term) || state.includes(term);
    });
  }

  // Update places count label
  $('#browse-places-count').text(`${filtered.length} of ${allDestinationsData.length} places`);

  if (filtered.length === 0) {
    grid.html(`
      <div class="w-100 py-5 text-center text-muted">
        <i class="bi bi-geo-alt fs-1 d-block mb-2 opacity-50"></i>
        <h5>No destinations found</h5>
        <p class="small">Try searching another destination or select "All" categories.</p>
      </div>
    `);
    return;
  }

  filtered.forEach((dest, index) => {
    grid.append(createDestCardHtml(dest, index));
  });

  initCardSlideshows();
}

function createDestCardHtml(dest, index) {
  const theme = CARD_THEMES[index % CARD_THEMES.length];
  const title = dest.title || dest.name;
  const state = dest.state || 'India';
  const count = dest.storiesCount || 1;
  const category = dest.category || 'Travel';
  const images = dest.images || [];

  let bgContent = '';
  if (images.length > 0) {
    let slidesHtml = '';
    images.forEach((imgUrl, i) => {
      slidesHtml += `<div class="dest-card-slide ${i === 0 ? 'active' : ''}" style="background-image: url('${escapeHtml(imgUrl)}');"></div>`;
    });
    bgContent = `
      <div class="dest-card-slides-box" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden;">
        ${slidesHtml}
      </div>
      <div class="dest-card-overlay"></div>
    `;
  } else {
    bgContent = `
      <div class="bg-layer" style="background: ${theme.bg};">
        ${theme.svg}
      </div>
    `;
  }

  let avatarsHtml = '';
  const travelers = dest.travelers || [];
  travelers.slice(0, 3).forEach((tr, idx) => {
    avatarsHtml += renderAvatarElement(tr, 28, idx === 0 ? 0 : -8, 10);
  });

  return `
    <div class="dest-card position-relative" style="cursor: pointer;" onclick="handleSelectDestination('${escapeHtml(dest.name)}')">
        ${bgContent}
        <div class="chip position-relative" style="z-index: 3;">${escapeHtml(category)}</div>
        <div class="content d-flex justify-content-between align-items-end mt-auto position-relative" style="z-index: 3;">
            <div>
                <h4 class="fw-bold mb-0 text-white">${escapeHtml(title)}</h4>
                <div class="small opacity-75">${escapeHtml(state)}, ${count} ${count === 1 ? 'story' : 'stories'}</div>
            </div>
            ${avatarsHtml ? `<div class="avatar-stack">${avatarsHtml}</div>` : ''}
        </div>
    </div>
  `;
}

function initCardSlideshows() {
  if (cardSlideshowTimer) {
    clearInterval(cardSlideshowTimer);
    cardSlideshowTimer = null;
  }

  const multiCards = $('.dest-card-slides-box').filter(function() {
    return $(this).find('.dest-card-slide').length > 1;
  });

  if (multiCards.length === 0) return;

  cardSlideshowTimer = setInterval(() => {
    multiCards.each(function() {
      const slides = $(this).find('.dest-card-slide');
      if (slides.length <= 1) return;
      const currentActive = slides.filter('.active');
      let nextIdx = (slides.index(currentActive) + 1) % slides.length;
      currentActive.removeClass('active');
      slides.eq(nextIdx).addClass('active');
    });
  }, 4000);
}

function setupSearchAndFilters() {
  // Category chip toggle
  $(document).on('click', '.category-chip-label', function() {
    $('.category-chip-label').removeClass('category-chip-active');
    $(this).addClass('category-chip-active');
    currentCategoryFilter = $(this).attr('data-category') || $(this).text().trim();
    renderBrowseSection();
  });

  // Search input and button
  $('#dest-search-btn').on('click', function() {
    currentSearchTerm = $('#dest-search-input').val();
    renderBrowseSection();
    scrollToBrowseSection();
  });

  $('#dest-search-input').on('keyup', function(e) {
    currentSearchTerm = $(this).val();
    renderBrowseSection();
    if (e.key === 'Enter') {
      scrollToBrowseSection();
    }
  });
}

function handleSelectDestination(destinationName) {
  if (!destinationName) return;
  const found = allDestinationsData.find(d => (d.name === destinationName || d.title === destinationName));
  if (found) {
    renderHeroBanner(found);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    window.location.href = `explore.html?location=${encodeURIComponent(destinationName)}`;
  }
}

function scrollToBrowseSection() {
  const browseElem = document.getElementById('browse-all-heading');
  if (browseElem) {
    browseElem.scrollIntoView({ behavior: 'smooth' });
  }
}
