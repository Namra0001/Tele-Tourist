/**
 * Community Page Dynamic Controller
 */

let currentFilter = 'most_stories';
let currentSearch = '';
let visibleOthersLimit = 6;
let cachedOthers = [];

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderTopTravelerCard(user, index) {
  const rank = index + 1;
  const rankLabel = currentFilter === 'most_stories' 
    ? `#${rank} in stories` 
    : (currentFilter === 'most_liked' ? `#${rank} most liked` : `#${rank} traveler`);

  const coverStyle = user.banner_url
    ? `background: url('${user.banner_url}') center/cover no-repeat;`
    : `background: ${user.cover_gradient || 'linear-gradient(180deg, #2D4059 0%, #1A2639 100%)'};`;

  const avatarHtml = user.avatar_url
    ? `<div class="tc-avatar p-0 overflow-hidden" style="border: 3px solid white;"><img src="${user.avatar_url}" style="width:100%;height:100%;object-fit:cover;" alt="${escapeHtml(user.name)}"></div>`
    : `<div class="tc-avatar" style="background-color: ${user.avatar_color || 'var(--lagoon)'};">${user.initials || 'TR'}</div>`;

  let footerHtml = '';
  if (user.latest_story) {
    const thumbContent = user.latest_story.image_url
      ? `<img src="${user.latest_story.image_url}" style="width:100%;height:100%;object-fit:cover;border-radius:6px;" alt="Story preview">`
      : `<div class="d-flex align-items-center justify-content-center h-100"><i class="bi bi-compass text-secondary fs-4"></i></div>`;

    footerHtml = `
      <div class="tc-footer">
        <a href="story.html#id=${user.latest_story.id}" class="d-flex align-items-center gap-3 text-decoration-none w-100 text-reset">
          <div class="thumb-sq flex-shrink-0" style="background: var(--sand-light); overflow: hidden;">
            ${thumbContent}
          </div>
          <div class="overflow-hidden">
            <div class="text-muted" style="font-size: 11px;">Latest story</div>
            <h6 class="fw-bold text-ink mb-0 text-truncate" style="font-size: 13px; line-height: 1.3;" title="${escapeHtml(user.latest_story.title)}">
              ${escapeHtml(user.latest_story.title)}
            </h6>
          </div>
        </a>
      </div>
    `;
  } else {
    footerHtml = `
      <div class="tc-footer">
        <div class="d-flex align-items-center gap-3 w-100 text-muted">
          <div class="thumb-sq flex-shrink-0 d-flex align-items-center justify-content-center" style="background: var(--sand-light); border-radius: 6px;">
            <i class="bi bi-pen text-secondary fs-5"></i>
          </div>
          <div>
            <div class="text-muted" style="font-size: 11px;">Community member</div>
            <h6 class="fw-semibold text-secondary mb-0" style="font-size: 13px;">Joined the travel circle</h6>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="col-md-4">
      <div class="traveler-card h-100 d-flex flex-column">
        <div class="tc-cover position-relative" style="${coverStyle}">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none" style="position:absolute;top:0;left:0;opacity:0.25;pointer-events:none;">
            <polygon points="0,100 30,50 60,100" fill="#ffffff"/>
            <polygon points="40,100 70,60 100,100" fill="#ffffff"/>
            <circle cx="80" cy="20" r="8" fill="#ffffff"/>
          </svg>
          <div class="tc-rank-pill">${rankLabel}</div>
          <a href="profile?id=${user.id}#id=${user.id}" class="text-decoration-none traveler-profile-link" data-id="${user.id}">
            ${avatarHtml}
          </a>
        </div>
        <div class="tc-body flex-grow-1">
          <h4 class="fw-bold text-ink mb-1">
            <a href="profile?id=${user.id}#id=${user.id}" class="text-decoration-none text-ink traveler-profile-link" data-id="${user.id}">${escapeHtml(user.name)}</a>
          </h4>
          <p class="text-secondary small mb-3"><i class="bi bi-geo-alt"></i> ${escapeHtml(user.location)}</p>
          <p class="text-secondary" style="font-size: 14px; line-height: 1.5; min-height: 42px;">${escapeHtml(user.bio)}</p>
          
          <div class="tc-stats mt-auto">
            <div>
              <h4 class="fw-bold text-ink mb-0">${user.stories_count}</h4>
              <div class="text-secondary small">Stories</div>
            </div>
            <div>
              <h4 class="fw-bold text-ink mb-0">${Number(user.likes_count).toLocaleString()}</h4>
              <div class="text-secondary small">Likes received</div>
            </div>
          </div>
        </div>
        ${footerHtml}
      </div>
    </div>
  `;
}

function renderSecondaryTravelerCard(user) {
  const avatarHtml = user.avatar_url
    ? `<div class="stc-avatar p-0 overflow-hidden"><img src="${user.avatar_url}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="${escapeHtml(user.name)}"></div>`
    : `<div class="stc-avatar" style="background-color: ${user.avatar_color || '#B22222'};">${user.initials || 'TR'}</div>`;

  const latestStoryChip = user.latest_story
    ? `<a href="story.html#id=${user.latest_story.id}" class="text-muted small text-truncate text-decoration-none" style="max-width: 140px;" title="${escapeHtml(user.latest_story.title)}"><i class="bi bi-compass me-1"></i>${escapeHtml(user.latest_story.title)}</a>`
    : '';

  return `
    <div class="col-md-6">
      <div class="small-traveler-card h-100">
        <div class="d-flex align-items-center gap-3 mb-3">
          <a href="profile?id=${user.id}#id=${user.id}" class="text-decoration-none traveler-profile-link" data-id="${user.id}">
            ${avatarHtml}
          </a>
          <div class="overflow-hidden">
            <h5 class="fw-bold text-ink mb-0 text-truncate" style="font-size: 16px;">
              <a href="profile?id=${user.id}#id=${user.id}" class="text-decoration-none text-ink traveler-profile-link" data-id="${user.id}">${escapeHtml(user.name)}</a>
            </h5>
            <div class="text-secondary small text-truncate"><i class="bi bi-geo-alt"></i> ${escapeHtml(user.location)}</div>
          </div>
        </div>
        <div class="d-flex align-items-center justify-content-between mb-3">
          <span class="chip-small">${escapeHtml(user.category || 'Traveler')}</span>
          ${latestStoryChip}
        </div>
        <div class="d-flex justify-content-between align-items-center text-ink fw-bold" style="font-size: 13px;">
          <span>${user.stories_count} ${user.stories_count === 1 ? 'story' : 'stories'}</span>
          <span><i class="bi bi-heart text-secondary me-1"></i> ${Number(user.likes_count).toLocaleString()}</span>
        </div>
      </div>
    </div>
  `;
}

function updateMoreTravelersView() {
  const slice = cachedOthers.slice(0, visibleOthersLimit);
  if (slice.length === 0) {
    if (cachedOthers.length === 0) {
      $('#more-travelers-grid').html('<div class="col-12 text-secondary py-3">No additional travelers matching filter.</div>');
    }
    $('#show-more-container').hide();
    return;
  }

  const html = slice.map(user => renderSecondaryTravelerCard(user)).join('');
  $('#more-travelers-grid').html(html);

  if (visibleOthersLimit < cachedOthers.length) {
    $('#show-more-container').show();
  } else {
    $('#show-more-container').hide();
  }
}

async function loadCommunityTravelers() {
  // Show loading skeleton / spinners
  $('#top-travelers-grid').html(`
    <div class="col-12 text-center py-5">
      <div class="spinner-border text-primary" role="status" style="color: var(--lagoon) !important;">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="text-secondary mt-2">Loading top travelers...</p>
    </div>
  `);

  $('#more-travelers-grid').html(`
    <div class="col-12 text-center py-4">
      <div class="spinner-border spinner-border-sm text-secondary" role="status"></div>
    </div>
  `);
  $('#show-more-container').hide();

  try {
    const query = new URLSearchParams({
      filter: currentFilter,
      search: currentSearch
    });

    const res = await apiCall(`/users/community?${query.toString()}`);
    const topTravelers = res.top || [];
    cachedOthers = res.others || [];
    visibleOthersLimit = 6;

    // Update top section heading depending on filter
    if (currentFilter === 'most_stories') {
      $('#top-travelers-heading').text('Top travelers by stories posted');
    } else if (currentFilter === 'most_liked') {
      $('#top-travelers-heading').text('Top travelers with most likes received');
    } else {
      $('#top-travelers-heading').text('Newest community members');
    }

    // Render top 3 travelers
    if (topTravelers.length === 0) {
      $('#top-travelers-grid').html(`
        <div class="col-12 text-center py-5">
          <i class="bi bi-people display-4 text-muted mb-3 d-block"></i>
          <h5 class="fw-bold text-ink">No travelers found</h5>
          <p class="text-secondary">Try searching with a different name or location.</p>
        </div>
      `);
      $('#more-travelers-grid').html('');
      return;
    }

    const topHtml = topTravelers.map((user, index) => renderTopTravelerCard(user, index)).join('');
    $('#top-travelers-grid').html(topHtml);

    // Render others
    updateMoreTravelersView();

  } catch (err) {
    console.error('Error loading community travelers:', err);
    $('#top-travelers-grid').html(`
      <div class="col-12 text-center py-4 text-danger">
        <i class="bi bi-exclamation-triangle fs-3 d-block mb-2"></i>
        Failed to load travelers. Please try again.
      </div>
    `);
    $('#more-travelers-grid').html('');
  }
}

$(document).ready(function() {
  // Filter button clicks
  $('.filter-btn').click(function() {
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');

    const filterVal = $(this).attr('data-filter') || 'most_stories';
    if (currentFilter !== filterVal) {
      currentFilter = filterVal;
      loadCommunityTravelers();
    }
  });

  // Search input and button
  $('#community-search-btn').click(function() {
    currentSearch = $('#community-search-input').val().trim();
    loadCommunityTravelers();
  });

  $('#community-search-input').on('keyup', function(e) {
    if (e.key === 'Enter') {
      currentSearch = $(this).val().trim();
      loadCommunityTravelers();
    }
  });

  // Show more button
  $('#show-more-btn').click(function() {
    visibleOthersLimit += 6;
    updateMoreTravelersView();
  });

  // Traveler profile link click handler
  $(document).on('click', '.traveler-profile-link', function() {
    const uid = $(this).data('id');
    if (uid) {
      sessionStorage.setItem('viewProfileId', uid);
    }
  });

  // Initial load
  loadCommunityTravelers();
});
