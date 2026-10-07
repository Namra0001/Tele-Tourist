function renderNavbar() {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  let userName = 'AK';
  if (userStr) {
    try {
      const parsed = JSON.parse(userStr);
      userName = parsed.name || parsed.username || 'AK';
    } catch(e) {
      userName = userStr;
    }
  }

  const html = `
    <nav class="navbar navbar-expand-lg bg-white border-bottom" style="position: sticky; top: 0; min-height: 80px; z-index: 1020;">
      <div class="container px-0">
        <a class="navbar-brand d-flex align-items-center gap-2" href="index.html">
          <div class="logo-box text-white rounded d-flex align-items-center justify-content-center" style="width: 32px; height: 32px; background-color: var(--lagoon);">
            <i class="bi bi-compass"></i>
          </div>
          <span class="logo-text text-ink fw-bold fs-5" style="color: var(--ink); font-family: 'Bricolage Grotesque', sans-serif;">Tele Tourist</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-4 ms-4">
            <li class="nav-item"><a class="nav-link text-secondary fw-medium px-0 pb-1" href="explore.html">Explore</a></li>
            <li class="nav-item"><a class="nav-link text-secondary fw-medium px-0 pb-1" href="destinations.html">Destinations</a></li>
            <li class="nav-item"><a class="nav-link text-secondary fw-medium px-0 pb-1" href="saved.html">Saved</a></li>
            <li class="nav-item"><a class="nav-link text-secondary fw-medium px-0 pb-1" href="community.html">Community</a></li>
          </ul>
          <div class="d-flex align-items-center gap-3 flex-nowrap">
            <div class="input-group search-pill bg-field rounded-pill px-3 py-2 align-items-center" style="background-color: var(--surface-field); border: none; width: 320px;">
              <i class="bi bi-search text-muted me-2 small"></i>
              <input type="text" class="form-control border-0 bg-transparent shadow-none p-0 small" placeholder="Search stories or places" style="font-size: 14px;">
            </div>
            <a href="create-story.html" class="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 text-nowrap" style="background-color: var(--lagoon); color: white; border-radius: 8px; font-weight: 500;">
              <i class="bi bi-plus-lg"></i> Write a story
            </a>
            ${token ? `
              <a href="profile.html?id=1" class="d-flex align-items-center justify-content-center text-decoration-none flex-shrink-0" style="width: 38px; height: 38px;">
                  <img src="assets/img/profile-icon.png" alt="Profile" style="width: 32px; height: 32px; object-fit: contain;">
                </a>
            ` : `
              <a href="profile.html?id=1" class="d-flex align-items-center justify-content-center text-decoration-none flex-shrink-0" style="width: 38px; height: 38px;">
                <img src="assets/img/profile-icon.png" alt="Profile" style="width: 32px; height: 32px; object-fit: contain;">
              </a>
            `}
          </div>
        </div>
      </div>
    </nav>
  `;
  $('#navbar-placeholder').html(html);
  
  // set active link
  const currentPath = window.location.pathname;
  $('.navbar-nav .nav-link').each(function() {
    const href = $(this).attr('href');
    if (href && href !== '#') {
      const hrefBase = href.split('.html')[0];
      if (currentPath.includes(hrefBase)) {
        $(this).removeClass('text-secondary').addClass('active text-ink fw-bold');
        $(this).css('border-bottom', '2px solid var(--saffron)');
      }
    } else if (currentPath === '/' && href === 'index.html') {
      $(this).removeClass('text-secondary').addClass('active text-ink fw-bold');
      $(this).css('border-bottom', '2px solid var(--saffron)');
    }
  });
}

function renderFooter() {
  const html = `
    <footer class="mt-auto py-5" style="background-color: var(--ink); color: #C6D3DB;">
      <div class="container">
        <div class="row mb-4">
          <div class="col-md-3 mb-4 mb-md-0">
            <a class="navbar-brand d-flex align-items-center gap-2 mb-3 text-white text-decoration-none" href="index.html">
              <div class="logo-box text-white rounded d-flex align-items-center justify-content-center" style="width: 32px; height: 32px; background-color: var(--lagoon);">
                <i class="bi bi-compass"></i>
              </div>
              <span class="logo-text fw-bold fs-5 text-white">Tele Tourist</span>
            </a>
            <p class="small">Real trips, told by the people who took them.</p>
          </div>
          <div class="col-md-3 mb-4 mb-md-0">
            <h6 class="text-white mb-3 fw-bold">Discover</h6>
            <ul class="list-unstyled small d-flex flex-column gap-2">
              <li><a href="explore.html" class="text-decoration-none text-white opacity-75">Explore stories</a></li>
              <li><a href="destinations.html" class="text-decoration-none text-white opacity-75">Destinations</a></li>
              <li><a href="#" class="text-decoration-none text-white opacity-75">Categories</a></li>
            </ul>
          </div>
          <div class="col-md-3 mb-4 mb-md-0">
            <h6 class="text-white mb-3 fw-bold">Community</h6>
            <ul class="list-unstyled small d-flex flex-column gap-2">
              <li><a href="create-story.html" class="text-decoration-none text-white opacity-75">Write a story</a></li>
              <li><a href="#" class="text-decoration-none text-white opacity-75">Top travelers</a></li>
              <li><a href="#" class="text-decoration-none text-white opacity-75">Guidelines</a></li>
            </ul>
          </div>
          <div class="col-md-3">
            <h6 class="text-white mb-3 fw-bold">Account</h6>
            <ul class="list-unstyled small d-flex flex-column gap-2">
              <li><a href="profile.html" class="text-decoration-none text-white opacity-75">Profile</a></li>
              <li><a href="saved.html" class="text-decoration-none text-white opacity-75">Saved stories</a></li>
              <li><a href="#" onclick="logout(); return false;" class="text-decoration-none text-white opacity-75">Log out</a></li>
            </ul>
          </div>
        </div>
        <div class="pt-4 border-top" style="border-color: rgba(255,255,255,0.1) !important;">
          <p class="small mb-0">&copy; 2026 Tele Tourist. A college project.</p>
        </div>
      </div>
    </footer>
  `;
  $('#footer-placeholder').html(html);
}

function createStoryCard(story) {
  const isSaved = story.saved_by_me ? 'bi-bookmark-fill text-saffron' : 'bi-bookmark';
  const avatarCol = story.author && story.author.name ? story.author.name.charCodeAt(0) % 6 + 1 : 1;
  const imgUrl = (story.images && story.images.length > 0) ? story.images[0] : '';
  const authorName = story.author ? story.author.name : 'Unknown';
  
  return `
    <div class="card h-100 story-card text-decoration-none" style="border-radius: var(--radius-card); border: 1px solid var(--border-card);">
      <div class="position-relative">
        <div class="story-card-img w-100" style="height: 200px; background-color: var(--sky); border-radius: var(--radius-card) var(--radius-card) 0 0; background-image: url('${imgUrl}'); background-size: cover; background-position: center;"></div>
        <div class="position-absolute top-0 start-0 m-3">
          <span class="chip bg-white border-0 py-1 px-2 small fw-bold" style="border-radius: var(--radius-chip);">${story.category || 'General'}</span>
        </div>
        <div class="position-absolute top-0 end-0 m-3">
          <button class="btn btn-light bg-white rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center save-btn border-0" data-id="${story.id}" style="width: 32px; height: 32px;">
            <i class="bi ${isSaved}"></i>
          </button>
        </div>
      </div>
      <div class="card-body p-3 d-flex flex-column">
        <a href="story.html?id=${story.id}" class="text-decoration-none">
          <h5 class="card-title text-ink fw-bold mb-2 story-title" style="font-family: 'Bricolage Grotesque', sans-serif; color: var(--ink);">${story.title}</h5>
        </a>
        <p class="text-white opacity-75 small mb-3"><i class="bi bi-geo-alt"></i> ${story.location}</p>
        
        <div class="mt-auto d-flex align-items-center justify-content-between pt-3 border-top" style="border-color: var(--border-divider);">
          <div class="d-flex align-items-center gap-2">
            <div class="rounded-circle d-flex align-items-center justify-content-center text-white small" style="width: 24px; height: 24px; background-color: var(--avatar-${avatarCol}); font-size: 10px;">
              ${authorName.substring(0, 2).toUpperCase()}
            </div>
            <span class="small text-secondary">${authorName}</span>
          </div>
          <div class="d-flex gap-3 text-white opacity-75 small">
            <span class="d-flex align-items-center gap-1 like-btn ${story.liked_by_me ? 'text-danger' : ''}" data-id="${story.id}" style="cursor:pointer; color: ${story.liked_by_me ? 'var(--like-red)' : ''};">
              <i class="bi ${story.liked_by_me ? 'bi-heart-fill' : 'bi-heart'}"></i> ${story.like_count || 0}
            </span>
            <span class="d-flex align-items-center gap-1"><i class="bi bi-chat"></i> ${story.comment_count || 0}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function formatDate(dateString) {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

function showToast(message) {
  alert(message);
}

$(document).ready(function() {
  if ($('#navbar-placeholder').length) renderNavbar();
  if ($('#footer-placeholder').length) renderFooter();
});
