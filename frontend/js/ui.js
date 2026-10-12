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
            <li class="nav-item"><a class="nav-link text-secondary fw-medium px-0 pb-1" href="explore.html">Stories</a></li>
            <li class="nav-item"><a class="nav-link text-secondary fw-medium px-0 pb-1" href="destinations.html">Destinations</a></li>
            <li class="nav-item"><a class="nav-link text-secondary fw-medium px-0 pb-1" href="saved.html">Saved</a></li>
            <li class="nav-item"><a class="nav-link text-secondary fw-medium px-0 pb-1" href="community.html">Community</a></li>
          </ul>
          <div class="d-flex align-items-center gap-3 flex-nowrap">
            <div class="input-group search-pill bg-field rounded-pill px-3 py-2 align-items-center" style="background-color: var(--surface-field); border: none; width: 320px;">
              <i class="bi bi-search text-muted me-3 small"></i>
              <input type="text" class="form-control border-0 bg-transparent shadow-none p-0 small" placeholder="Search stories or places" style="font-size: 14px;">
            </div>
            <a href="create-story.html" class="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 text-nowrap" style="background-color: var(--lagoon); color: white; border-radius: 8px; font-weight: 500;">
              <i class="bi bi-plus-lg"></i> Write a story
            </a>
            <button type="button" id="navChatBtn" class="btn position-relative d-flex align-items-center justify-content-center p-0 rounded-circle flex-shrink-0" style="width: 38px; height: 38px; background-color: var(--surface-field); border: 1px solid rgba(32, 85, 107, 0.25); color: var(--lagoon);" title="Messages">
              <i class="bi bi-chat-dots fs-5" style="color: var(--lagoon);"></i>
              <span id="navChatBadge" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" style="display: none; font-size: 10px; padding: 3px 6px;">
                0
              </span>
            </button>
            <a href="profile.html" class="d-flex align-items-center justify-content-center text-decoration-none flex-shrink-0" style="width: 38px; height: 38px;" title="Profile">
              <img src="assets/img/profile-icon.png" alt="Profile" style="width: 32px; height: 32px; object-fit: contain;">
            </a>
            <button type="button" id="navLogoutBtn" class="btn position-relative d-flex align-items-center justify-content-center p-0 rounded-circle flex-shrink-0" style="width: 38px; height: 38px; background-color: var(--surface-field); border: 1px solid var(--border-card);" title="Log out">
              <img src="assets/img/logout.png" alt="Log out" style="width: 22px; height: 22px; object-fit: contain;">
            </button>
          </div>
        </div>
      </div>
    </nav>
  `;
  $('#navbar-placeholder').html(html);
  initGlobalChatSystem();
  
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
          <p class="small mb-0">&copy; 2026 Tele Tourist.</p>
        </div>
      </div>
    </footer>
  `;
  $('#footer-placeholder').html(html);
}

function createStoryCard(story, rank) {
  const isSaved = story.saved_by_me ? 'bi-bookmark-fill text-saffron' : 'bi-bookmark';
  const avatarCol = story.author && story.author.name ? story.author.name.charCodeAt(0) % 6 + 1 : 1;
  let imgUrl = (story.images && story.images.length > 0) ? story.images[0] : '';
    if (imgUrl && imgUrl.includes('sourcesplash')) {
        const fallbacks = ['assets/img/hampi.jpg', 'assets/img/spiti.jpg', 'assets/img/udaipur.jpg'];
        imgUrl = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
  const authorName = story.author ? story.author.name : 'Unknown';
  
    const isVideo = imgUrl && (imgUrl.endsWith('.mp4') || imgUrl.endsWith('.webm') || imgUrl.endsWith('.mov'));
    const bgStyle = (!isVideo && imgUrl) ? "background-image: url('" + imgUrl + "');" : '';

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

/**
 * Real-time User-to-User Chat & Notifications System
 */
let activeChatContact = null;
let threadPollTimer = null;
let unreadBadgeTimer = null;

function getCurrentUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function updateNavChatBadge() {
  const token = localStorage.getItem('token');
  const badge = $('#navChatBadge');
  if (!token) {
    badge.hide();
    return;
  }

  apiCall('/messages/unread-count')
    .then(res => {
      const count = res.unread_count || 0;
      if (count > 0) {
        badge.text(count > 99 ? '99+' : count).show();
      } else {
        badge.hide();
      }
    })
    .catch(() => {
      badge.hide();
    });
}

function formatChatTime(dateStr) {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMin = Math.round((now - d) / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return diffMin + 'm ago';
    const diffHours = Math.round(diffMin / 60);
    if (diffHours < 24) return diffHours + 'h ago';
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch (e) {
    return 'Recently';
  }
}

function initGlobalChatSystem() {
  updateNavChatBadge();
  if (!unreadBadgeTimer) {
    unreadBadgeTimer = setInterval(updateNavChatBadge, 5000);
  }

  if ($('#globalChatDrawer').length === 0) {
    const drawerHtml = `
      <div class="offcanvas offcanvas-end border-0 shadow-lg" tabindex="-1" id="globalChatDrawer" aria-labelledby="globalChatDrawerLabel" style="width: 420px; z-index: 1060; border-radius: 20px 0 0 20px; overflow: hidden;">
        <!-- Header -->
        <div class="offcanvas-header py-3 px-4 border-bottom bg-white d-flex align-items-center justify-content-between" style="min-height: 70px;">
          <div id="chatDrawerHeaderDefault" class="d-flex align-items-center gap-2">
            <i class="bi bi-chat-dots-fill fs-5" style="color: var(--lagoon);"></i>
            <h5 class="offcanvas-title fw-bold text-ink mb-0" id="globalChatDrawerLabel" style="font-family: 'Bricolage Grotesque', sans-serif;">Messages</h5>
          </div>
          
          <div id="chatDrawerHeaderThread" class="d-none align-items-center gap-2 flex-grow-1 overflow-hidden me-2">
            <button type="button" class="btn btn-sm btn-light border-0 rounded-circle d-flex align-items-center justify-content-center p-0 flex-shrink-0" id="btnBackToChatList" style="width: 32px; height: 32px;" title="Back to conversations">
              <i class="bi bi-chevron-left fs-6"></i>
            </button>
            <div id="drawerRecipientAvatar" class="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold overflow-hidden flex-shrink-0" style="width: 38px; height: 38px; background-color: var(--lagoon); font-size: 13px;">
              TR
            </div>
            <div class="overflow-hidden flex-grow-1">
              <h6 class="fw-bold text-ink mb-0 text-truncate" id="drawerRecipientName" style="font-size: 15px;">Traveler</h6>
              <div class="small text-success d-flex align-items-center gap-1" style="font-size: 11px;">
                <span style="width: 6px; height: 6px; background-color: #28a745; border-radius: 50%; display: inline-block;"></span> Active traveler
              </div>
            </div>
          </div>

          <button type="button" class="btn-close shadow-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>

        <!-- Body -->
        <div class="offcanvas-body p-0 d-flex flex-column bg-light" style="position: relative; height: calc(100vh - 70px);">
          
          <!-- View 1: Conversations List -->
          <div id="chatListView" class="d-flex flex-column h-100 p-3 overflow-y-auto">
            <div class="input-group mb-3 bg-white rounded-pill px-3 py-1 border shadow-sm">
              <i class="bi bi-search text-muted me-2 align-self-center small"></i>
              <input type="text" id="chatSearchInput" class="form-control border-0 bg-transparent shadow-none p-0 small" placeholder="Search conversations...">
            </div>

            <div class="d-flex justify-content-between align-items-center mb-2 px-1">
              <span class="text-secondary small fw-bold text-uppercase" style="font-size: 11px; letter-spacing: 0.5px;">Recent Conversations</span>
            </div>

            <div id="chatConversationsList" class="d-flex flex-column gap-2 mb-4">
              <!-- Rendered via JS -->
            </div>

            <div class="mt-auto pt-3 border-top px-1">
              <span class="text-secondary small fw-bold text-uppercase d-block mb-2" style="font-size: 11px; letter-spacing: 0.5px;">Quick Connect with Travelers</span>
              <div class="d-flex gap-2 flex-wrap">
                <button type="button" class="btn btn-sm btn-white bg-white border rounded-pill px-3 py-1 quick-traveler-btn shadow-sm" data-id="a4608179-982d-4308-b1a8-d8d0757bd3b4" data-name="Vatsal Sukhadiya" style="font-size: 12px;">
                  <span class="me-1">🧭</span> Vatsal Sukhadiya
                </button>
                <button type="button" class="btn btn-sm btn-white bg-white border rounded-pill px-3 py-1 quick-traveler-btn shadow-sm" data-id="bd327182-ce1d-43b0-a201-a729070cbf6b" data-name="Aarav Kapadia" style="font-size: 12px;">
                  <span class="me-1">⛰️</span> Aarav Kapadia
                </button>
                <button type="button" class="btn btn-sm btn-white bg-white border rounded-pill px-3 py-1 quick-traveler-btn shadow-sm" data-id="e2f518c9-c108-4922-936a-e1535a6b51a2" data-name="Meera Shah" style="font-size: 12px;">
                  <span class="me-1">🌊</span> Meera Shah
                </button>
                <button type="button" class="btn btn-sm btn-white bg-white border rounded-pill px-3 py-1 quick-traveler-btn shadow-sm" data-id="d8bf942c-bf51-48f1-a27c-270989c74f23" data-name="Dev Patel" style="font-size: 12px;">
                  <span class="me-1">🏜️</span> Dev Patel
                </button>
              </div>
            </div>
          </div>

          <!-- View 2: Active Chat Thread -->
          <div id="chatThreadView" class="d-none flex-column h-100 bg-white">
            <div id="drawerChatMessages" class="p-3 flex-grow-1 overflow-y-auto d-flex flex-column gap-2" style="background-color: #f8fafc;">
              <!-- Message bubbles -->
            </div>
            
            <div class="p-2 border-top bg-white">
              <form id="drawerChatForm" class="d-flex gap-2 align-items-center m-0">
                <input type="text" id="drawerChatInput" class="form-control border shadow-none" placeholder="Type your reply..." style="border-radius: 24px; font-size: 14px; padding: 10px 16px;" autocomplete="off" required>
                <button type="submit" id="btnDrawerChatSend" class="btn text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style="width: 42px; height: 42px; background-color: var(--lagoon); border: none;">
                  <i class="bi bi-send-fill" style="font-size: 14px; margin-left: 2px;"></i>
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    `;
    $('body').append(drawerHtml);

    // Stop thread polling when offcanvas is closed
    const drawerEl = document.getElementById('globalChatDrawer');
    if (drawerEl) {
      drawerEl.addEventListener('hidden.bs.offcanvas', function () {
        stopThreadPolling();
        activeChatContact = null;
      });
    }
  }
}

let cachedConversations = [];

function renderChatConversationsList(filterTerm = '') {
  const container = $('#chatConversationsList');
  const token = localStorage.getItem('token');
  if (!token) {
    container.html(`
      <div class="text-center py-5 text-secondary">
        <i class="bi bi-lock display-5 d-block mb-2 opacity-50"></i>
        <p class="small mb-2">Please log in to chat with other travelers.</p>
        <a href="login.html" class="btn btn-sm btn-primary rounded-pill px-3" style="background-color: var(--lagoon); border: none;">Log In</a>
      </div>
    `);
    return;
  }

  container.html(`
    <div class="text-center py-4 text-muted">
      <div class="spinner-border spinner-border-sm text-secondary me-2"></div> Loading messages...
    </div>
  `);

  apiCall('/messages/conversations')
    .then(res => {
      cachedConversations = res.conversations || [];
      displayConversationsList(filterTerm);
    })
    .catch(err => {
      container.html(`
        <div class="text-center py-4 text-secondary small">
          <p class="mb-0">Unable to load conversations.</p>
        </div>
      `);
    });
}

function displayConversationsList(filterTerm = '') {
  const container = $('#chatConversationsList');
  container.empty();

  let filtered = cachedConversations;
  if (filterTerm) {
    const term = filterTerm.toLowerCase();
    filtered = filtered.filter(item => {
      const name = item.contact?.name || '';
      const text = item.lastMessage?.content || '';
      return name.toLowerCase().includes(term) || text.toLowerCase().includes(term);
    });
  }

  if (filtered.length === 0) {
    container.html(`
      <div class="text-center py-5 text-secondary">
        <i class="bi bi-chat-square-text display-5 d-block mb-2 opacity-50"></i>
        <p class="small mb-1 fw-medium">No messages yet</p>
        <p class="small text-muted mb-0">Select a traveler below or visit Community to start a real conversation!</p>
      </div>
    `);
    return;
  }

  const currentUser = getCurrentUser();
  const currentUserId = currentUser?.id;

  filtered.forEach(item => {
    const contact = item.contact || {};
    const lastMsg = item.lastMessage || {};
    const isUnread = item.unreadCount > 0;

    const avatarHtml = contact.avatar_url
      ? `<img src="${contact.avatar_url}" style="width:100%;height:100%;object-fit:cover;">`
      : getInitials(contact.name || 'Traveler');

    const unreadDot = isUnread
      ? `<span class="badge rounded-pill bg-danger px-2 py-1" style="font-size: 10px;">${item.unreadCount} new</span>`
      : '';

    const activeBg = isUnread ? 'bg-white border-start border-4 border-primary' : 'bg-white';
    const isFromMe = lastMsg.sender_id === currentUserId;

    const itemHtml = `
      <div class="card border-0 p-3 rounded-3 shadow-sm conversation-item ${activeBg}" data-id="${contact.id}" data-name="${contact.name || 'Traveler'}" data-avatar="${contact.avatar_url || ''}" style="cursor: pointer; transition: transform 0.15s ease;">
        <div class="d-flex align-items-center gap-3">
          <div class="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold overflow-hidden flex-shrink-0" style="width: 44px; height: 44px; background-color: var(--lagoon); font-size: 14px;">
            ${avatarHtml}
          </div>
          <div class="overflow-hidden flex-grow-1">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <h6 class="fw-bold text-ink mb-0 text-truncate" style="font-size: 14px;">${contact.name || 'Traveler'}</h6>
              <span class="text-muted small" style="font-size: 11px;">${formatChatTime(lastMsg.created_at)}</span>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <p class="text-secondary small mb-0 text-truncate ${isUnread ? 'fw-bold text-ink' : ''}" style="max-width: 230px; font-size: 12px;">
                ${isFromMe ? '<span class="text-muted">You: </span>' : ''}${lastMsg.content || ''}
              </p>
              ${unreadDot}
            </div>
          </div>
        </div>
      </div>
    `;
    container.append(itemHtml);
  });
}

function startThreadPolling(contactId) {
  stopThreadPolling();
  threadPollTimer = setInterval(() => {
    if (activeChatContact && activeChatContact.id === contactId) {
      refreshActiveThreadMessages(true);
    }
  }, 3500);
}

function stopThreadPolling() {
  if (threadPollTimer) {
    clearInterval(threadPollTimer);
    threadPollTimer = null;
  }
}

function refreshActiveThreadMessages(isBackgroundPoll = false) {
  if (!activeChatContact || !activeChatContact.id) return;
  const contactId = activeChatContact.id;
  const msgContainer = $('#drawerChatMessages');

  apiCall('/messages/thread/' + contactId)
    .then(res => {
      const messages = res.messages || [];
      const contact = res.contact || activeChatContact;
      const currentUser = getCurrentUser();
      const currentUserId = currentUser?.id;

      // Update header details
      $('#drawerRecipientName').text(contact.name || 'Traveler');
      if (contact.avatar_url) {
        $('#drawerRecipientAvatar').html(`<img src="${contact.avatar_url}" style="width:100%;height:100%;object-fit:cover;">`);
      } else {
        $('#drawerRecipientAvatar').css('background-color', 'var(--lagoon)').text(getInitials(contact.name || 'Traveler'));
      }

      // Check if we need to update DOM (avoid flickering if same length on poll)
      const currentBubbleCount = msgContainer.find('.chat-bubble-item').length;
      if (isBackgroundPoll && currentBubbleCount === messages.length) {
        return;
      }

      msgContainer.empty();

      if (messages.length === 0) {
        msgContainer.html(`
          <div class="text-center py-5 my-auto">
            <div class="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 text-white fw-bold shadow-sm" style="width: 52px; height: 52px; background-color: var(--lagoon); font-size: 16px;">
              ${contact.avatar_url ? `<img src="${contact.avatar_url}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">` : getInitials(contact.name || 'Traveler')}
            </div>
            <h6 class="fw-bold text-ink mb-1">Chat with ${contact.name || 'Traveler'}</h6>
            <p class="text-secondary small mb-0 px-4">Send a message to discuss journeys, routes, homestays, and recommendations!</p>
          </div>
        `);
      } else {
        messages.forEach(msg => {
          const isMe = msg.sender_id === currentUserId;
          const bubble = isMe ? `
            <div class="d-flex justify-content-end mb-2 chat-bubble-item">
              <div class="p-3 text-white shadow-sm" style="background-color: var(--lagoon); border-radius: 18px 18px 4px 18px; max-width: 82%; font-size: 13px; line-height: 1.45;">
                <div>${msg.content}</div>
                <div class="text-end text-white-50 mt-1" style="font-size: 10px;">${formatChatTime(msg.created_at)}</div>
              </div>
            </div>
          ` : `
            <div class="d-flex justify-content-start mb-2 chat-bubble-item">
              <div class="p-3 text-ink shadow-sm bg-white" style="border: 1px solid var(--border-card); border-radius: 18px 18px 18px 4px; max-width: 82%; font-size: 13px; line-height: 1.45;">
                <div>${msg.content}</div>
                <div class="text-muted mt-1" style="font-size: 10px;">${formatChatTime(msg.created_at)}</div>
              </div>
            </div>
          `;
          msgContainer.append(bubble);
        });
      }

      msgContainer.scrollTop(msgContainer[0].scrollHeight);
      updateNavChatBadge();
    })
    .catch(err => {
      console.error('Error fetching chat thread:', err);
    });
}

function openChatThread(contactId, contactName = '', contactAvatar = '') {
  if (!contactId) return;

  activeChatContact = {
    id: contactId,
    name: contactName || 'Traveler',
    avatar: contactAvatar || null
  };

  // Header update
  $('#chatDrawerHeaderDefault').addClass('d-none');
  $('#chatDrawerHeaderThread').removeClass('d-none').addClass('d-flex');
  $('#drawerRecipientName').text(activeChatContact.name);
  if (activeChatContact.avatar) {
    $('#drawerRecipientAvatar').html(`<img src="${activeChatContact.avatar}" style="width:100%;height:100%;object-fit:cover;">`);
  } else {
    $('#drawerRecipientAvatar').css('background-color', 'var(--lagoon)').text(getInitials(activeChatContact.name));
  }

  // View switch
  $('#chatListView').addClass('d-none');
  $('#chatThreadView').removeClass('d-none').addClass('d-flex');

  // Loading state
  $('#drawerChatMessages').html(`
    <div class="text-center py-5 my-auto text-muted">
      <div class="spinner-border spinner-border-sm text-secondary me-2"></div> Loading messages...
    </div>
  `);

  refreshActiveThreadMessages(false);
  startThreadPolling(contactId);

  setTimeout(() => $('#drawerChatInput').focus(), 250);
}

// Global hook to open chat with any user
window.openChatWithUser = function(user) {
  if (!user || !user.id) return;

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please log in to message travelers.');
    window.location.href = 'login.html';
    return;
  }

  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === user.id) {
    alert('You cannot chat with yourself.');
    return;
  }

  const drawerEl = document.getElementById('globalChatDrawer');
  if (drawerEl) {
    const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(drawerEl);
    offcanvas.show();
    openChatThread(user.id, user.name, user.avatar_url);
  }
};

$(document).on('click', '#navChatBtn', function() {
  const drawerEl = document.getElementById('globalChatDrawer');
  if (drawerEl) {
    const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(drawerEl);
    offcanvas.show();
    // Default to conversations list
    stopThreadPolling();
    activeChatContact = null;
    $('#chatDrawerHeaderThread').addClass('d-none').removeClass('d-flex');
    $('#chatDrawerHeaderDefault').removeClass('d-none');
    $('#chatThreadView').addClass('d-none').removeClass('d-flex');
    $('#chatListView').removeClass('d-none');
    renderChatConversationsList();
  }
});

$(document).on('click', '.conversation-item', function() {
  const id = $(this).data('id');
  const name = $(this).data('name');
  const avatar = $(this).data('avatar');
  if (id) openChatThread(id, name, avatar);
});

$(document).on('click', '#btnBackToChatList', function() {
  stopThreadPolling();
  activeChatContact = null;
  $('#chatDrawerHeaderThread').addClass('d-none').removeClass('d-flex');
  $('#chatDrawerHeaderDefault').removeClass('d-none');
  $('#chatThreadView').addClass('d-none').removeClass('d-flex');
  $('#chatListView').removeClass('d-none');
  renderChatConversationsList();
});

$(document).on('input', '#chatSearchInput', function() {
  const val = $(this).val().trim();
  displayConversationsList(val);
});

$(document).on('click', '.quick-traveler-btn', function() {
  const id = $(this).data('id');
  const name = $(this).data('name');
  window.openChatWithUser({ id, name });
});

$(document).on('submit', '#drawerChatForm', function(e) {
  e.preventDefault();
  if (!activeChatContact || !activeChatContact.id) return;
  const input = $('#drawerChatInput');
  const text = input.val().trim();
  if (!text) return;

  const btn = $('#btnDrawerChatSend');
  btn.prop('disabled', true);

  apiCall('/messages', 'POST', {
    recipient_id: activeChatContact.id,
    content: text
  })
    .then(res => {
      input.val('');
      btn.prop('disabled', false);
      // Immediately refresh thread to show sent message
      refreshActiveThreadMessages(false);
    })
    .catch(err => {
      btn.prop('disabled', false);
      alert(err?.responseJSON?.message || 'Failed to send message. Please try again.');
    });
});

$(document).on('click', '#navLogoutBtn', function() {
  if (typeof logout === 'function') {
    logout();
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
  }
});


