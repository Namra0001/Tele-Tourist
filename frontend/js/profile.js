$(document).ready(function() {
    let currentProfileUser = null;
    let loggedInUser = null;
    let isCurrentProfileOwn = false;

    // Helper for formatted dates
    function formatJoinedDate(dateStr) {
        if (!dateStr) return 'Joined Recently';
        try {
            const date = new Date(dateStr);
            const month = date.toLocaleString('en-US', { month: 'long' });
            const year = date.getFullYear();
            return `Joined ${month} ${year}`;
        } catch (e) {
            return 'Joined Recently';
        }
    }

    // Helper to get initials
    function getInitials(name) {
        if (!name) return 'TT';
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    }

    // Helper to render an individual story card
    function renderProfileStoryCard(story, isOwn) {
        const imgUrl = (story.images && story.images.length > 0) ? story.images[0] : '';
        const bgStyle = imgUrl 
            ? `background-image: url('${imgUrl}'); background-size: cover; background-position: center;`
            : `background: linear-gradient(180deg, #E8F4F8 0%, #20556B 100%);`;

        const category = story.category || (story.categories && story.categories.name) || 'Travel';
        const authorName = (story.author && story.author.name) || (story.users && story.users.name) || 'Author';
        const authorInitials = getInitials(authorName);
        const isSaved = story.saved_by_me ? 'bi-bookmark-fill text-warning' : 'bi-bookmark text-muted';
        const isLiked = story.liked_by_me ? 'text-danger' : '';
        const likedIcon = story.liked_by_me ? 'bi-heart-fill text-danger' : 'bi-heart';
        const likesCount = story.likes_count || story.like_count || 0;
        const commentsCount = story.comments_count || story.comment_count || 0;
        const locationText = story.location || 'India';

        const ownerButtons = isOwn ? `
            <div class="d-flex gap-2 mt-3 pt-2 border-top">
                <a href="create-story.html?id=${story.id}#id=${story.id}" class="btn btn-sm btn-edit-story" data-id="${story.id}" style="background-color: var(--surface-field); border-radius: 6px; font-size: 12px; font-weight: 600; color: var(--ink); text-decoration: none;">
                    <i class="bi bi-pencil me-1"></i> Edit
                </a>
                <button type="button" class="btn btn-sm btn-delete-story" data-id="${story.id}" style="background-color: var(--surface-field); border-radius: 6px; font-size: 12px; font-weight: 600; color: #dc3545;">
                    <i class="bi bi-trash me-1"></i> Delete
                </button>
            </div>
        ` : '';

        return `
            <div class="col-md-4 story-card-item" id="story-card-${story.id}">
                <div class="card border-0 preview-card h-100 text-decoration-none d-flex flex-column" style="border: 1px solid var(--border-card) !important; border-radius: 16px; overflow: hidden; background: white;">
                    <div class="preview-img position-relative" style="width: 100%; height: 180px; ${bgStyle}">
                        <div class="position-absolute top-0 start-0 m-2">
                            <span class="chip bg-white border-0 py-1 px-3 fw-bold text-ink" style="font-size: 11px; border-radius: 50rem;">${category}</span>
                        </div>
                        <div class="position-absolute top-0 end-0 m-2">
                            <button type="button" class="bg-white rounded-circle d-flex align-items-center justify-content-center save-btn border-0 shadow-sm" data-id="${story.id}" style="width: 30px; height: 30px; cursor: pointer;">
                                <i class="bi ${isSaved}" style="font-size: 14px;"></i>
                            </button>
                        </div>
                    </div>
                    <div class="p-3 bg-white d-flex flex-column flex-grow-1">
                        <a href="story.html#id=${story.id}" class="text-decoration-none">
                            <h5 class="fw-bold text-ink mb-1" style="font-family: 'Bricolage Grotesque', sans-serif;">${story.title || 'Untitled Story'}</h5>
                        </a>
                        <p class="text-muted small mb-3"><i class="bi bi-geo-alt"></i> ${locationText}</p>
                        
                        <div class="d-flex align-items-center justify-content-between mt-auto">
                            <div class="d-flex align-items-center gap-2">
                                <div class="avatar-circle rounded-circle d-flex align-items-center justify-content-center text-white" style="width: 24px; height: 24px; background-color: var(--lagoon); font-size: 10px; font-weight: 500;">${authorInitials}</div>
                                <span class="text-secondary small">${authorName}</span>
                            </div>
                            <div class="d-flex gap-3 text-muted small">
                                <span class="d-flex align-items-center gap-1 like-btn ${isLiked}" data-id="${story.id}" style="cursor: pointer;">
                                    <i class="bi ${likedIcon}"></i> <span class="like-count">${likesCount}</span>
                                </span>
                                <span class="d-flex align-items-center gap-1">
                                    <i class="bi bi-chat"></i> ${commentsCount}
                                </span>
                            </div>
                        </div>
                        ${ownerButtons}
                    </div>
                </div>
            </div>
        `;
    }

    // Determine current logged in user from localStorage / /api/auth/me
    function initUserAndProfile() {
        const token = localStorage.getItem('token');
        const stored = localStorage.getItem('user');

        if (stored) {
            try {
                loggedInUser = JSON.parse(stored);
                if (typeof loggedInUser === 'string') {
                    loggedInUser = { name: loggedInUser };
                }
            } catch (e) {
                loggedInUser = { name: stored };
            }
        }

        const urlParams = new URLSearchParams(window.location.search);
        let targetUserId = urlParams.get('id');
        if (!targetUserId && window.location.hash) {
            const cleanHash = window.location.hash.replace(/^#/, '');
            const hashParams = new URLSearchParams(cleanHash);
            targetUserId = hashParams.get('id') || (cleanHash.length > 20 ? cleanHash : null);
        }
        if (!targetUserId) {
            targetUserId = sessionStorage.getItem('viewProfileId');
            if (targetUserId) sessionStorage.removeItem('viewProfileId');
        }

        // If user is authenticated, refresh loggedInUser data from /auth/me
        if (token) {
            apiCall('/auth/me')
                .then(me => {
                    if (me && me.id) {
                        loggedInUser = me;
                        localStorage.setItem('user', JSON.stringify(me));
                    }
                    loadProfile(targetUserId || (loggedInUser && loggedInUser.id ? loggedInUser.id : 'me'));
                })
                .catch(() => {
                    loadProfile(targetUserId || (loggedInUser && loggedInUser.id ? loggedInUser.id : 'me'));
                });
        } else {
            loadProfile(targetUserId || 'me');
        }
    }

    // Load user profile
    function loadProfile(userId) {
        const endpoint = (userId && userId !== 'me') ? `/users/${userId}` : '/users/me';
        
        apiCall(endpoint)
            .then(res => {
                const user = (res && res.id) ? res : (Array.isArray(res) && res.length > 0 ? res[0] : null);
                if (!user) {
                    $('#profileName').text('User not found');
                    $('#storiesGrid').html('<div class="col-12 text-center text-muted py-5">Profile not found.</div>');
                    return;
                }

                currentProfileUser = user;
                isCurrentProfileOwn = Boolean(loggedInUser && loggedInUser.id && loggedInUser.id === user.id);
                document.title = (user.name || 'Traveler') + ' - TeleTourist';

                // Populate Header - Username in White font colour
                $('#profileName').text(user.name || 'Traveler');
                
                const locJoined = [];
                if (user.location) locJoined.push(user.location);
                locJoined.push(formatJoinedDate(user.created_at));
                $('#profileLocation').text(locJoined.join(' • '));

                $('#profileBio').text(user.bio || 'Exploring the world, one story at a time.');

                // Avatar display
                if (user.avatar_url) {
                    $('#profileAvatar').html(`<img src="${user.avatar_url}" alt="${user.name}" class="rounded-circle w-100 h-100" style="object-fit: cover;">`);
                } else {
                    $('#profileAvatar').text(getInitials(user.name));
                }

                // Banner display
                if (user.banner_url) {
                    $('#profileCover').css({
                        'background-image': `url('${user.banner_url}')`,
                        'background-size': 'cover',
                        'background-position': 'center'
                    });
                } else {
                    $('#profileCover').css({
                        'background-image': '',
                        'background': 'linear-gradient(180deg, #2D4059 0%, #1A2639 100%)'
                    });
                }

                // Stats: Stories, Likes received, Times saved
                const stats = user.stats || {};
                $('#statStories').text(stats.stories !== undefined ? stats.stories : 0);
                $('#statLikes').text(stats.likes !== undefined ? stats.likes : 0);
                $('#statSaved').text(stats.saved !== undefined ? stats.saved : 0);

                // Show/hide Edit button, Saved tab, and Chat button
                if (isCurrentProfileOwn) {
                    $('#btnEditProfile').show();
                    $('#saved-tab-li').show();
                    $('#btnChatUser').hide();
                } else {
                    $('#btnEditProfile').hide();
                    $('#saved-tab-li').hide();
                    $('#btnChatUser').show();
                    if ($('#saved-tab').hasClass('active')) {
                        $('#stories-tab').click();
                    }
                }

                // Populate About tab
                const aboutHtml = `
                    <div class="row g-4">
                        <div class="col-md-7">
                            <h5 class="fw-bold text-ink mb-3" style="font-family: 'Bricolage Grotesque', sans-serif;">About ${user.name}</h5>
                            <p class="text-secondary mb-4" style="line-height: 1.7;">${user.bio || 'This user has not added a bio yet.'}</p>
                            <div class="d-flex flex-column gap-2 text-muted small">
                                <div><i class="bi bi-geo-alt me-2 text-primary"></i> ${user.location || 'India'}</div>
                                <div><i class="bi bi-calendar3 me-2 text-primary"></i> ${formatJoinedDate(user.created_at)}</div>
                                ${isCurrentProfileOwn && user.email ? `<div><i class="bi bi-envelope me-2 text-primary"></i> ${user.email}</div>` : ''}
                            </div>
                        </div>
                        <div class="col-md-5">
                            <div class="p-3 bg-light rounded-3" style="border: 1px solid var(--border-card);">
                                <h6 class="fw-bold text-ink mb-3">Community Activity</h6>
                                <div class="d-flex justify-content-between py-2 border-bottom">
                                    <span class="text-secondary small">Stories Published</span>
                                    <span class="fw-bold text-ink small" id="aboutStatStories">${stats.stories || 0}</span>
                                </div>
                                <div class="d-flex justify-content-between py-2 border-bottom">
                                    <span class="text-secondary small">Total Likes Received</span>
                                    <span class="fw-bold text-ink small" id="aboutStatLikes">${stats.likes || 0}</span>
                                </div>
                                <div class="d-flex justify-content-between py-2">
                                    <span class="text-secondary small">Total Times Saved</span>
                                    <span class="fw-bold text-ink small" id="aboutStatSaved">${stats.saved || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                $('#aboutContent').html(aboutHtml);

                // Load Stories
                loadUserStories(user.id, isCurrentProfileOwn);

                // Pre-fill Edit Modal
                if (isCurrentProfileOwn) {
                    $('#editProfileName').val(user.name || '');
                    $('#editProfileLocation').val(user.location || '');
                    $('#editProfileBio').val(user.bio || '');
                }
            })
            .catch(err => {
                console.error('Failed to load profile:', err);
                $('#profileName').text('Traveler');
                $('#storiesGrid').html('<div class="col-12 text-center text-muted py-5">Unable to load profile data.</div>');
            });
    }

    // Load stories for user
    function loadUserStories(userId, isOwn) {
        $('#storiesGrid').html('<div class="col-12 py-5 text-center text-muted"><div class="spinner-border spinner-border-sm text-secondary me-2"></div> Loading stories...</div>');
        
        apiCall(`/users/${userId}/stories`)
            .then(res => {
                const stories = res.stories || res || [];
                const grid = $('#storiesGrid');
                grid.empty();

                // Compute exact story count and likes count from actual stories
                if (Array.isArray(stories)) {
                    $('#statStories').text(stories.length);
                    $('#aboutStatStories').text(stories.length);

                    let totalLikes = 0;
                    stories.forEach(s => {
                        totalLikes += (s.likes_count || s.like_count || 0);
                    });
                    if (totalLikes > 0 || parseInt($('#statLikes').text()) === 0) {
                        $('#statLikes').text(totalLikes);
                        $('#aboutStatLikes').text(totalLikes);
                    }
                }

                if (!stories || stories.length === 0) {
                    grid.html(`
                        <div class="col-12 py-5 text-center text-muted">
                            <i class="bi bi-journal-text display-4 d-block mb-3 opacity-50"></i>
                            <p class="mb-2">No stories published yet.</p>
                            ${isOwn ? '<a href="create-story.html" class="btn btn-sm text-white mt-2" style="background-color: var(--lagoon); border-radius: 8px;">Write your first story</a>' : ''}
                        </div>
                    `);
                    return;
                }

                stories.forEach(story => {
                    grid.append(renderProfileStoryCard(story, isOwn));
                });
            })
            .catch(err => {
                console.error('Failed to load stories:', err);
                $('#storiesGrid').html('<div class="col-12 text-center text-muted py-5">Failed to load stories.</div>');
            });
    }

    // Load saved stories
    function loadSavedStories() {
        const isOwn = Boolean(loggedInUser && currentProfileUser && loggedInUser.id === currentProfileUser.id);
        const grid = $('#savedGrid');

        if (!isOwn) {
            grid.html(`
                <div class="col-12 py-5 text-center text-muted">
                    <i class="bi bi-lock display-4 d-block mb-3 opacity-50"></i>
                    <p>Saved stories are private.</p>
                </div>
            `);
            return;
        }

        grid.html('<div class="col-12 py-5 text-center text-muted"><div class="spinner-border spinner-border-sm text-secondary me-2"></div> Loading saved stories...</div>');

        apiCall('/users/me/saved')
            .then(res => {
                const stories = res.stories || res || [];
                grid.empty();

                if (!stories || stories.length === 0) {
                    grid.html(`
                        <div class="col-12 py-5 text-center text-muted">
                            <i class="bi bi-bookmark display-4 d-block mb-3 opacity-50"></i>
                            <p class="mb-2">No saved stories yet.</p>
                            <a href="explore.html" class="btn btn-sm text-white mt-2" style="background-color: var(--lagoon); border-radius: 8px;">Explore stories to save</a>
                        </div>
                    `);
                    return;
                }

                stories.forEach(story => {
                    grid.append(renderProfileStoryCard(story, false));
                });
            })
            .catch(err => {
                console.error('Failed to load saved stories:', err);
                grid.html('<div class="col-12 text-center text-muted py-5">Failed to load saved stories.</div>');
            });
    }

    // Tab change event: load saved stories when switching to Saved tab
    $('#saved-tab').on('shown.bs.tab', function() {
        loadSavedStories();
    });

    // Share Profile button
    $('#btnShareProfile').on('click', function() {
        const profileUrl = window.location.origin + window.location.pathname + (currentProfileUser ? `?id=${currentProfileUser.id}` : '');
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(profileUrl).then(() => {
                alert('Profile link copied to clipboard!');
            }).catch(() => {
                prompt('Copy profile link:', profileUrl);
            });
        } else {
            prompt('Copy profile link:', profileUrl);
        }
    });

    // Chat with User feature
    function getChatStorageKey(recipientId) {
        const myId = loggedInUser && loggedInUser.id ? loggedInUser.id : 'guest';
        return `tele_chat_${myId}_${recipientId}`;
    }

    function formatTime(date) {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function renderChatMessages(recipient) {
        const key = getChatStorageKey(recipient.id);
        const container = $('#chatMessagesContainer');
        container.empty();

        let history = [];
        try {
            history = JSON.parse(localStorage.getItem(key)) || [];
            if (Array.isArray(history)) {
                const fakeReplies = [
                    "Thanks for your message! Absolutely, the local cafes and trails there are incredible.",
                    "Glad you reached out! Feel free to ask anytime about routes, stays or best times to visit.",
                    "Awesome! If you're heading that way, make sure to take the morning highway route for the best views.",
                    "Definitely! Safe travels and let me know how your journey goes!",
                    "Hey! Thanks for reaching out. Always happy to share notes and recommendations from my journeys!",
                    "Hi there! Great to connect with a fellow traveler. If you're planning a trip there soon, morning treks and local homestays are definitely the best way to experience it.",
                    "Hello! Feel free to ask anything about the route, budget or stays. Glad you enjoyed my travelogue!",
                    "Hey! The best season is definitely during early winter or just after the rains when the landscapes are lush and skies are clear."
                ];
                history = history.filter(m => !fakeReplies.includes(m.text));
            }
        } catch(e) {
            history = [];
        }

        if (history.length === 0) {
            const avatarHtml = recipient.avatar_url
                ? `<img src="${recipient.avatar_url}" style="width:100%;height:100%;object-fit:cover;">`
                : getInitials(recipient.name);

            container.html(`
                <div class="text-center py-4 my-auto" id="chatEmptyState">
                    <div class="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 text-white fw-bold shadow-sm overflow-hidden" style="width: 56px; height: 56px; background-color: var(--lagoon); font-size: 18px;">
                        ${avatarHtml}
                    </div>
                    <h6 class="fw-bold text-ink mb-1">Chat with ${recipient.name || 'Traveler'}</h6>
                    <p class="text-secondary small mb-3 px-3">Connect directly to ask about their travel recommendations, stays, itineraries, and stories!</p>
                    <div class="d-flex flex-column gap-2 px-2">
                        <button type="button" class="btn btn-sm btn-light border rounded-pill px-3 py-2 text-start chat-suggestion-btn text-truncate" style="font-size: 12px; background: white;">
                            <i class="bi bi-chat-quote me-1 text-primary"></i> Hey ${recipient.name ? recipient.name.split(' ')[0] : ''}, loved your stories! Any tips for first-timers?
                        </button>
                        <button type="button" class="btn btn-sm btn-light border rounded-pill px-3 py-2 text-start chat-suggestion-btn text-truncate" style="font-size: 12px; background: white;">
                            <i class="bi bi-compass me-1 text-primary"></i> Which season or month is best to visit?
                        </button>
                    </div>
                </div>
            `);
            return;
        }

        history.forEach(msg => {
            const isMe = msg.sender === 'me';
            const bubble = isMe ? `
                <div class="d-flex justify-content-end mb-2">
                    <div class="p-3 text-white shadow-sm" style="background-color: var(--lagoon); border-radius: 18px 18px 4px 18px; max-width: 82%; font-size: 14px; line-height: 1.45;">
                        <div>${msg.text}</div>
                        <div class="text-end text-white-50 mt-1" style="font-size: 10px;">${formatTime(msg.timestamp)}</div>
                    </div>
                </div>
            ` : `
                <div class="d-flex justify-content-start mb-2">
                    <div class="p-3 text-ink shadow-sm bg-white" style="border: 1px solid var(--border-card); border-radius: 18px 18px 18px 4px; max-width: 82%; font-size: 14px; line-height: 1.45;">
                        <div>${msg.text}</div>
                        <div class="text-muted mt-1" style="font-size: 10px;">${formatTime(msg.timestamp)}</div>
                    </div>
                </div>
            `;
            container.append(bubble);
        });

        container.scrollTop(container[0].scrollHeight);
    }

    $('#btnChatUser').on('click', function() {
        if (!currentProfileUser) return;
        if (typeof window.openChatWithUser === 'function') {
            window.openChatWithUser(currentProfileUser);
        }
    });

    // Chat suggestion quick click
    $(document).on('click', '.chat-suggestion-btn', function() {
        const text = $(this).text().trim();
        if (currentProfileUser && typeof window.openChatWithUser === 'function') {
            window.openChatWithUser(currentProfileUser);
            $('#drawerChatInput').val(text);
        }
    });

    // Edit Profile button
    $('#btnEditProfile').on('click', function() {
        if (!isCurrentProfileOwn || !currentProfileUser) return;
        $('#editProfileName').val(currentProfileUser.name || '');
        $('#editProfileLocation').val(currentProfileUser.location || '');
        $('#editProfileBio').val(currentProfileUser.bio || '');
        $('#editProfileError').addClass('d-none').text('');
        const modal = new bootstrap.Modal(document.getElementById('editProfileModal'));
        modal.show();
    });

    // Edit Profile form submit
    $('#editProfileForm').on('submit', function(e) {
        e.preventDefault();
        if (!isCurrentProfileOwn) {
            alert('You cannot edit another user\'s profile.');
            return;
        }

        const submitBtn = $('#btnSaveProfile');
        submitBtn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span> Saving...');
        $('#editProfileError').addClass('d-none').text('');

        const formData = new FormData();
        formData.append('name', $('#editProfileName').val());
        formData.append('location', $('#editProfileLocation').val());
        formData.append('bio', $('#editProfileBio').val());

        const fileInput = document.getElementById('editProfileAvatarFile');
        if (fileInput && fileInput.files.length > 0) {
            formData.append('avatar', fileInput.files[0]);
        }

        const bannerInput = document.getElementById('editProfileBannerFile');
        if (bannerInput && bannerInput.files.length > 0) {
            formData.append('banner', bannerInput.files[0]);
        }

        apiCall('/users/me', 'PUT', formData)
            .then(updated => {
                submitBtn.prop('disabled', false).text('Save Changes');
                bootstrap.Modal.getInstance(document.getElementById('editProfileModal')).hide();

                // Update current user in local storage
                if (loggedInUser) {
                    loggedInUser.name = updated.name;
                    loggedInUser.bio = updated.bio;
                    if (updated.location !== undefined) loggedInUser.location = updated.location;
                    if (updated.avatar_url) loggedInUser.avatar_url = updated.avatar_url;
                    if (updated.banner_url) loggedInUser.banner_url = updated.banner_url;
                    localStorage.setItem('user', JSON.stringify(loggedInUser));
                }

                // Immediately update banner if returned
                if (updated.banner_url) {
                    $('#profileCover').css({
                        'background-image': `url('${updated.banner_url}')`,
                        'background-size': 'cover',
                        'background-position': 'center'
                    });
                }

                // Refresh profile data on page
                initUserAndProfile();
            })
            .catch(err => {
                submitBtn.prop('disabled', false).text('Save Changes');
                const msg = (err && err.responseJSON && err.responseJSON.message) || 'Failed to update profile. Please try again.';
                $('#editProfileError').removeClass('d-none').text(msg);
            });
    });

    // Delete story handler
    $(document).on('click', '.btn-delete-story', function(e) {
        e.preventDefault();
        if (!isCurrentProfileOwn) {
            alert('You cannot delete another user\'s story.');
            return;
        }

        const storyId = $(this).data('id');
        if (!storyId) return;

        if (!confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
            return;
        }

        apiCall(`/stories/${storyId}`, 'DELETE')
            .then(() => {
                $(`#story-card-${storyId}`).fadeOut(300, function() {
                    $(this).remove();
                    // Update stories count stat
                    const countSpan = $('#statStories');
                    const currentCount = parseInt(countSpan.text()) || 0;
                    const newCount = Math.max(0, currentCount - 1);
                    countSpan.text(newCount);
                    $('#aboutStatStories').text(newCount);

                    if ($('#storiesGrid .story-card-item').length === 0) {
                        $('#storiesGrid').html(`
                            <div class="col-12 py-5 text-center text-muted">
                                <i class="bi bi-journal-text display-4 d-block mb-3 opacity-50"></i>
                                <p class="mb-2">No stories published yet.</p>
                                <a href="create-story.html" class="btn btn-sm text-white mt-2" style="background-color: var(--lagoon); border-radius: 8px;">Write your first story</a>
                            </div>
                        `);
                    }
                });
            })
            .catch(err => {
                alert((err && err.responseJSON && err.responseJSON.message) || 'Failed to delete story.');
            });
    });

    // Edit story navigation handler
    $(document).on('click', '.btn-edit-story', function(e) {
        if (!isCurrentProfileOwn) {
            e.preventDefault();
            alert('You cannot edit another user\'s story.');
            return false;
        }
        const storyId = $(this).data('id');
        if (storyId) {
            sessionStorage.setItem('editStoryId', storyId);
        }
    });

    // Initialize
    initUserAndProfile();
});
