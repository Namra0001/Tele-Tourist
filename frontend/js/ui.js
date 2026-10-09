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
          <img src="assets/img/logo.png" alt="Tele Tourist Logo" style="height: 32px; width: auto; object-fit: contain;">
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
              <img src="assets/img/logo.png" alt="Tele Tourist Logo" style="height: 32px; width: auto; object-fit: contain;">
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

function createStoryCard(story, rank) {
  const isSaved = story.saved_by_me ? 'bi-bookmark-fill text-saffron' : 'bi-bookmark';
  const avatarCol = story.author && story.author.name ? story.author.name.charCodeAt(0) % 6 + 1 : 1;
  const imgUrl = (story.images && story.images.length > 0) ? story.images[0] : '';
  const authorName = story.author ? story.author.name : 'Unknown';
  const bgStyle = imgUrl ? "background-image: url('" + imgUrl + "');" : '';
  const likedFilter = story.liked_by_me ? 'filter: invert(34%) sepia(98%) saturate(1478%) hue-rotate(331deg) brightness(101%) contrast(104%);' : 'filter: brightness(0); opacity: 0.8;';
  const likedColor = story.liked_by_me ? 'var(--like-red)' : '#222';
  const likedClass = story.liked_by_me ? 'text-danger' : '';
  const likeCount = story.likes_count || story.like_count || 0;
  const commentCount = story.comments_count || story.comment_count || 0;
  const category = story.category || 'General';
  const initials = authorName.substring(0, 2).toUpperCase();
  const description = story.description || 'A wonderful travel story worth exploring...';
  const location = story.location || '';

  let h = '';
  h += '<div class="card h-100 story-card" style="border-radius: var(--radius-card); border: 1px solid var(--border-card);">';
  
  // Flip container
  h += '<div class="flip-container" style="height:200px;border-radius: var(--radius-card) var(--radius-card) 0 0;overflow:hidden;">';
  h += '<div class="flip-inner" style="height:100%;">';
  
  // Front face - image
  h += '<div class="flip-front position-relative" style="height:100%;">';
  h += '<div class="w-100 h-100" style="background-color: var(--sky); border-radius: var(--radius-card) var(--radius-card) 0 0; ' + bgStyle + ' background-size: cover; background-position: center;"></div>';
  
  // Top Left: Rank + Category
  h += '<div class="position-absolute top-0 start-0 m-3 d-flex align-items-center gap-2" style="z-index:5;">';
  if (rank) {
      h += '<div class="badge bg-warning text-dark fw-bold rounded-circle d-flex align-items-center justify-content-center" style="width:32px;height:32px;font-size:0.85rem;">#' + rank + '</div>';
  }
  h += '<span class="chip bg-white border-0 py-1 px-2 small fw-bold shadow-sm" style="border-radius: var(--radius-chip);">' + category + '</span>';
  h += '</div>';

  // Top Right: Save Button
  h += '<div class="position-absolute top-0 end-0 m-3" style="z-index:5;">';
  h += '<button class="btn btn-light bg-white rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center save-btn border-0" data-id="' + story.id + '" style="width: 32px; height: 32px;">';
  h += '<i class="bi ' + isSaved + '"></i>';
  h += '</button>';
  h += '</div>';

  h += '</div>';
  
  // Back face - description
  h += '<div class="flip-back d-flex align-items-center justify-content-center p-3" style="background:#fff;">';
  h += '<p class="story-desc-flip mb-0">' + description + '</p>';
  h += '</div>';
  
  h += '</div></div>'; // end flip-inner, flip-container

  // Card body
  h += '<div class="card-body p-3 d-flex flex-column">';
  h += '<a href="story.html#id=' + story.id + '" class="text-decoration-none">';
  h += '<h5 class="card-title text-ink fw-bold mb-1" style="font-family: Bricolage Grotesque, sans-serif; color: var(--ink);">' + story.title + '</h5>';
  h += '</a>';
  if (location) {
    h += '<p class="small text-secondary mb-0 mt-1 d-flex align-items-center gap-1"><img src="assets/img/location.png" style="width:11px;opacity:0.6;"> ' + location + '</p>';
  }
  h += '<div class="mt-auto d-flex align-items-center justify-content-between pt-3 border-top mt-3" style="border-color: var(--border-divider);">';
  h += '<div class="d-flex align-items-center gap-2">';
  h += '<div class="rounded-circle d-flex align-items-center justify-content-center text-white small" style="width:24px;height:24px;background-color:var(--avatar-' + avatarCol + ');font-size:10px;">' + initials + '</div>';
  h += '<span class="small text-secondary">' + authorName + '</span>';
  h += '</div>';
  h += '<div class="d-flex gap-3 text-dark small fw-medium">';
  h += '<span class="d-flex align-items-center gap-1 like-btn ' + likedClass + '" data-id="' + story.id + '" style="cursor:pointer;color:' + likedColor + ';">';
  h += '<img src="assets/img/heart.png" class="like-icon" style="width:14px;' + likedFilter + '">';
  h += '<span class="like-count">' + likeCount + '</span>';
  h += '</span>';
  h += '<span class="d-flex align-items-center gap-1 text-dark">';
  h += '<img src="assets/img/comment.png" style="width:14px;filter:brightness(0);opacity:0.8;"> ' + commentCount;
  h += '</span>';
  h += '</div></div></div></div>';

  return h;
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
  
    // Delegate save button clicks for grid cards
    $(document).on('click', '.save-btn', function(e) {
        e.preventDefault();
        const btn = $(this);
        const id = btn.data('id');
        const icon = btn.find('i');
        
        if (icon.hasClass('bi-bookmark-fill')) {
            // Unsave
            icon.removeClass('bi-bookmark-fill text-saffron').addClass('bi-bookmark');
            if (typeof apiCall === 'function') apiCall('/stories/' + id + '/save', 'DELETE');
        } else {
            // Save
            icon.removeClass('bi-bookmark').addClass('bi-bookmark-fill text-saffron');
            if (typeof apiCall === 'function') apiCall('/stories/' + id + '/save', 'POST');
        }
    });

    // Delegate like button clicks for grid cards
  $(document).on('click', '.like-btn', function(e) {
      e.preventDefault();
      const btn = $(this);
      const id = btn.data('id');
      const icon = btn.find('img.like-icon');
      const countSpan = btn.find('.like-count');
      let count = parseInt(countSpan.text()) || 0;
      
      const isLiked = btn.hasClass('text-danger');
      
      if (isLiked) {
          // Unlike
          btn.removeClass('text-danger');
          btn.css('color', '#222');
          icon.css('filter', 'brightness(0)');
          icon.css('opacity', '0.8');
          count = Math.max(0, count - 1);
          countSpan.text(count);
          if (typeof apiCall === 'function') apiCall('/stories/' + id + '/like', 'DELETE');
      } else {
          // Like
          btn.addClass('text-danger');
          btn.css('color', 'var(--like-red)');
          icon.css('filter', 'invert(34%) sepia(98%) saturate(1478%) hue-rotate(331deg) brightness(101%) contrast(104%)');
          icon.css('opacity', '1');
          count++;
          countSpan.text(count);
          if (typeof apiCall === 'function') apiCall('/stories/' + id + '/like', 'POST');
      }
  });

  if ($('#navbar-placeholder').length) renderNavbar();
  if ($('#footer-placeholder').length) renderFooter();
});



function createReelCard(story) {
  const authorName = story.author ? story.author.name : 'Unknown';
  const avatarCol = story.author && story.author.name ? story.author.name.charCodeAt(0) % 6 + 1 : 1;
  const avatarHtml = story.author && story.author.avatar_url 
    ? '<img src="' + story.author.avatar_url + '" class="rounded-circle me-2 border border-2 border-white" style="width: 32px; height: 32px; object-fit: cover;">'
    : '<div class="rounded-circle bg-avatar-' + avatarCol + ' text-white d-flex align-items-center justify-content-center me-2 fw-bold border border-2 border-white" style="width: 32px; height: 32px; font-size: 0.8rem;">' + getInitials(authorName) + '</div>';
  
  let carouselItems = '';
  if (story.images && story.images.length > 0) {
      story.images.forEach((img, i) => {
          carouselItems += '<div class="carousel-item ' + (i === 0 ? 'active' : '') + '" style="height: 100%;"><img src="' + img + '" class="d-block w-100" style="height: 100%; object-fit: cover;"></div>';
      });
  } else {
      carouselItems = '<div class="carousel-item active" style="height: 100%; background: #333;"></div>';
  }
  
  const likeOp = story.liked_by_me ? '' : 'opacity: 0.8;';
  const saveOp = story.saved_by_me ? '' : 'opacity: 0.8;';
  
  let h = '<div class="reel-item shadow-lg position-relative" data-story-id="' + story.id + '">';
  h += '<div class="carousel slide reel-carousel" data-bs-ride="carousel" data-bs-interval="3000" style="height: 100%;">';
  h += '<div class="carousel-inner" style="height: 100%;">' + carouselItems + '</div></div><div class="reel-overlay"></div>';
  
  h += '<div class="position-absolute top-0 end-0 m-3 d-flex align-items-center bg-dark bg-opacity-50 px-2 py-1 rounded-pill" style="z-index: 10;">';
  h += '<img src="assets/img/location.png" style="width: 14px; margin-right: 6px; filter: brightness(0) invert(1);">';
  h += '<span class="text-white small fw-medium">' + (story.location || 'Unknown') + '</span></div>';
  
  h += '<div class="position-absolute bottom-0 start-0 m-4 text-white" style="z-index: 10; width: 70%;">';
  h += '<div class="d-flex align-items-center mb-2">' + avatarHtml + '<span class="fw-bold">' + authorName + '</span></div>';
  h += '<h5 class="fw-bold mb-1 text-white" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;">' + story.title + '</h5></div>';
  
  h += '<div class="position-absolute bottom-0 end-0 m-4 d-flex flex-column align-items-center gap-4 text-white" style="z-index: 10;">';
  
  h += '<div class="text-center"><button class="btn btn-link text-white p-0 d-block reel-like-btn" onclick="toggleReelLike(\'' + story.id + '\', this)" style="text-decoration: none;">';
  h += '<img src="assets/img/heart.png" style="width: 28px; filter: brightness(0) invert(1); ' + likeOp + '"></button>';
  h += '<small class="d-block mt-1 fw-bold">' + (story.like_count || 0) + '</small></div>';
  
  h += '<div class="text-center"><a href="story.html#id=' + story.id + '" class="text-white text-decoration-none">';
  h += '<img src="assets/img/comment.png" style="width: 28px; filter: brightness(0) invert(1); opacity: 0.8;"></a>';
  h += '<small class="d-block mt-1 fw-bold">' + (story.comments_count || 0) + '</small></div>';
  
  let safeTitle = story.title.replace(/'/g, '');
  h += '<div class="text-center"><button class="btn btn-link text-white p-0 d-block" onclick="navigator.share({title:\'' + safeTitle + '\', url: window.location.origin+\'/story.html#id=' + story.id + '\'})" style="text-decoration: none;">';
  h += '<img src="assets/img/share.png" style="width: 28px; filter: brightness(0) invert(1); opacity: 0.8;"></button>';
  h += '<small class="d-block mt-1 fw-bold">Share</small></div>';
  
  h += '<div class="text-center"><button class="btn btn-link text-white p-0 d-block reel-save-btn" onclick="toggleReelSave(\'' + story.id + '\', this)" style="text-decoration: none;">';
  h += '<img src="assets/img/save-instagram.png" style="width: 28px; filter: brightness(0) invert(1); ' + saveOp + '"></button>';
  h += '<small class="d-block mt-1 fw-bold">Save</small></div>';
  
  h += '</div></div>';
  return h;
}

window.toggleReelLike = function(id, btn) {
    const img = $(btn).find('img');
    if (img.css('opacity') == '1' || img.css('opacity') === '1') {
        img.css('opacity', '0.8');
        if(typeof apiCall === 'function') apiCall('/stories/' + id + '/like', 'DELETE');
    } else {
        img.css('opacity', '1');
        if(typeof apiCall === 'function') apiCall('/stories/' + id + '/like', 'POST');
    }
};

window.toggleReelSave = function(id, btn) {
    const img = $(btn).find('img');
    if (img.css('opacity') == '1' || img.css('opacity') === '1') {
        img.css('opacity', '0.8');
        if(typeof apiCall === 'function') apiCall('/stories/' + id + '/save', 'DELETE');
    } else {
        img.css('opacity', '1');
        if(typeof apiCall === 'function') apiCall('/stories/' + id + '/save', 'POST');
    }
};


function getInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  } else if (name.length >= 2) {
    return name.substring(0, 2).toUpperCase();
  }
  return name[0].toUpperCase();
}
