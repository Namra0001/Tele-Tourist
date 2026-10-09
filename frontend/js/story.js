$(document).ready(function() {
    $('#navbar-placeholder').load('components/navbar.html');
    $('#footer-placeholder').load('components/footer.html');

    // PRIMARY: check hash (e.g. story.html#id=abc) - server can never strip hash
    let storyId = null;
    if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
        storyId = hashParams.get('id');
    }

    // FALLBACK: check query params (e.g. story.html?id=abc)
    if (!storyId) {
        const urlParams = new URLSearchParams(window.location.search);
        storyId = urlParams.get('id');
    }

    let currentStory = null;

    if (storyId) {
        fetchStory(storyId);
    } else {
        $('#story-content').html('<div class="alert alert-warning m-4">Story not found. Please go back to <a href="explore.html">Explore</a> and select a story.</div>');
    }

    function mapBackendStory(data) {
        return {
            id: data.id,
            title: data.title,
            category: data.category || "Uncategorized",
            author: { 
                name: data.author?.name || "Unknown", 
                avatar: data.author?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.author?.name || 'U')}` 
            },
            date: new Date(data.created_at).toLocaleDateString(),
            content: data.description ? `<p>${data.description}</p>` : "",
            location: { name: data.location || "Unknown Location", address: "" },
            rating: data.rating || 5,
            photos: data.images || [],
            likes: data.likes_count || 0,
            comments: data.comments || [],
            liked_by_me: data.liked_by_me || false,
            saved_by_me: data.saved_by_me || false
        };
    }

    const mockData = {
        id: 1,
        title: "Mock Data Fallback - Story not found",
        category: "Nature",
        author: { name: "Jane Doe", avatar: "https://i.pravatar.cc/150?u=jane" },
        date: "Oct 12, 2023",
        content: "<p>The journey was breathtaking...</p><div class=\"pull-quote\">Nature is not a place to visit. It is home.</div><p>More details about the trip.</p>",
        location: { name: "Eagle Peak", address: "Mountain Range, Country" },
        photos: [
            "https://images.unsplash.com/photo-1506905925224-1843b0c61858",
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
            "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d",
            "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
            "https://images.unsplash.com/photo-1472214103451-9374bd1c798e"
        ],
        likes: 124,
        comments: [
            { author: "John Smith", text: "Looks amazing!", date: "Oct 13, 2023" },
            { author: "Emma Wilson", text: "I've been there last summer, it's absolutely stunning.", date: "Oct 14, 2023" },
            { author: "Michael Brown", text: "Great photos! What camera did you use?", date: "Oct 15, 2023" }
        ]
    };

    function loadFirstRealStory() {
        if (typeof apiCall === 'function') {
            apiCall('/stories', 'GET')
                .then(data => {
                    if (data && data.stories && data.stories.length > 0) {
                        storyId = data.stories[0].id;
                        fetchStory(storyId, true);
                    } else {
                        renderStory(mockData);
                    }
                })
                .catch((err) => {
                    console.error("loadFirstRealStory failed", err);
                    alert("Failed to load real story from API. Status: " + (err.status || 'unknown'));
                    renderStory(mockData);
                });
        } else {
            renderStory(mockData);
        }
    }

    function fetchStory(id, isRetry = false) {
        if (typeof apiCall === 'function') {
            apiCall(`/stories/${id}`, 'GET')
                .then(data => {
                    if (data && data.title) {
                        apiCall(`/stories/${id}/comments`, 'GET').then(commentsData => {
                            data.comments = commentsData;
                            renderStory(mapBackendStory(data));
                        }).catch(() => {
                            data.comments = [];
                            renderStory(mapBackendStory(data));
                        });
                    } else {
                        if (!isRetry) loadFirstRealStory();
                        else renderStory(mockData);
                    }
                })
                .catch(err => {
                    console.error('Error fetching story:', err);
                    if (!isRetry) {
                        loadFirstRealStory();
                    }
                    else {
                        alert("fetchStory retry failed. Status: " + (err.status || 'unknown'));
                        renderStory(mockData);
                    }
                });
        } else {
            renderStory(mockData);
        }
    }

    // Initial load
    if (storyId) {
        fetchStory(storyId);
    } else {
        loadFirstRealStory();
    }

    function renderStory(story) {
        currentStory = story;
        $('#story-title').text(story.title);
        $('#story-category').text(story.category);
        $('#author-name').text(story.author.name);
        $('#author-avatar').attr('src', story.author.avatar);
        $('#story-date').text(story.date);
        $('#story-content').html(story.content);
        
        let starsHtml = '';
        const rating = story.rating || 5;
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                starsHtml += '<i class="bi bi-star-fill me-1"></i>';
            } else {
                starsHtml += '<i class="bi bi-star me-1 text-muted"></i>';
            }
        }
        $('#story-rating').html(starsHtml);

        $('#story-location-name').text(story.location.name);
        $('#story-location').text(story.location.address);
        $('#stat-category').text(story.category);
        $('#stat-photos').text(story.photos.length);
        $('#stat-likes').text(story.likes);

        if (story.liked_by_me) {
            $('#btn-like').addClass('btn-danger text-white').removeClass('btn-outline-dark');
            $('#btn-like img').css('filter', 'brightness(0) invert(1)');
        } else {
            $('#btn-like').removeClass('btn-danger text-white').addClass('btn-outline-dark');
            $('#btn-like img').css('filter', 'none');
        }

        if (story.saved_by_me) {
            $('#btn-save').addClass('btn-dark text-white').removeClass('btn-outline-dark');
            $('#btn-save img').css('filter', 'brightness(0) invert(1)');
        } else {
            $('#btn-save').removeClass('btn-dark text-white').addClass('btn-outline-dark');
            $('#btn-save img').css('filter', 'none');
        }

        if (story.photos && story.photos.length > 0) {
            let len = story.photos.length;
            if (len === 1) {
                $('#photo-mosaic').attr('style', 'grid-template-columns: 1fr; grid-template-rows: 400px;');
            } else if (len === 2) {
                $('#photo-mosaic').attr('style', 'grid-template-columns: 1fr 1fr; grid-template-rows: 400px;');
            } else if (len === 3) {
                $('#photo-mosaic').attr('style', 'grid-template-columns: 2fr 1fr; grid-template-rows: repeat(2, 200px);');
            } else if (len === 4) {
                $('#photo-mosaic').attr('style', 'grid-template-columns: 1fr 1fr; grid-template-rows: repeat(2, 200px);');
            } else {
                $('#photo-mosaic').attr('style', 'grid-template-columns: 2fr 1fr 1fr; grid-template-rows: repeat(2, 200px);');
            }

            let mosaicHtml = '';
            let galleryHtml = '';
            story.photos.forEach((photo, index) => {
                if (index < 5) {
                    let mainClass = (index === 0 && (len === 3 || len >= 5)) ? 'mosaic-item-main' : '';
                    mosaicHtml += `<img src="${photo}" class="mosaic-item ${mainClass}" alt="Photo ${index + 1}">`;
                }
                
                let activeClass = index === 0 ? 'active' : '';
                galleryHtml += `
                    <div class="carousel-item ${activeClass}">
                        <img src="${photo}" class="d-block w-100" alt="Gallery Photo ${index + 1}" style="max-height: 80vh; object-fit: contain;">
                    </div>
                `;
            });
            if (story.photos.length > 5) {
                mosaicHtml += `<button class="btn btn-sm btn-see-all" data-bs-toggle="modal" data-bs-target="#galleryModal"><i class="bi bi-grid-3x3-gap-fill me-1"></i> See all ${story.photos.length} photos</button>`;
            } else if (story.photos.length > 0) {
                 mosaicHtml += `<button class="btn btn-sm btn-see-all" data-bs-toggle="modal" data-bs-target="#galleryModal"><i class="bi bi-grid-3x3-gap-fill me-1"></i> See all photos</button>`;
            }
            $('#photo-mosaic').html(mosaicHtml);
            $('#gallery-carousel-inner').html(galleryHtml);
        } else {
            $('#photo-mosaic').hide();
        }

        renderComments(story.comments || []);
    }

    function renderComments(comments) {
        $('#comment-count').text(comments.length);
        let html = '';
        comments.forEach(c => {
            html += `
                <div class="d-flex mb-3 pb-3 border-bottom">
                    <img src="${c.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.author || 'User')}&background=random`}" class="rounded-circle me-3" style="width:40px;height:40px;" alt="avatar">
                    <div>
                        <div class="fw-bold">${c.author || 'Anonymous'} <span class="text-muted small fw-normal ms-2">${c.date || 'Just now'}</span></div>
                        <p class="mb-0 mt-1">${c.text}</p>
                    </div>
                </div>
            `;
        });
        $('#comments-list').html(html);
    }

    $('#btn-like').click(function() {
        if (!currentStory) return;
        $(this).toggleClass('btn-outline-dark btn-danger text-white');
        const img = $(this).find('img');
        
        let likes = parseInt($('#stat-likes').text());
        if ($(this).hasClass('btn-danger')) {
            img.css('filter', 'brightness(0) invert(1)');
            likes++;
            if(typeof apiCall === 'function') apiCall(`/stories/${storyId}/like`, 'POST');
        } else {
            img.css('filter', 'none');
            likes--;
            if(typeof apiCall === 'function') apiCall(`/stories/${storyId}/like`, 'DELETE');
        }
        $('#stat-likes').text(likes);
    });

    $('#btn-save').click(function() {
        if (!currentStory) return;
        $(this).toggleClass('btn-outline-dark btn-dark text-white');
        const img = $(this).find('img');
        
        if ($(this).hasClass('btn-dark')) {
            img.css('filter', 'brightness(0) invert(1)');
            if(typeof apiCall === 'function') apiCall(`/stories/${storyId}/save`, 'POST');
        } else {
            img.css('filter', 'none');
            if(typeof apiCall === 'function') apiCall(`/stories/${storyId}/save`, 'DELETE');
        }
    });

    $('#btn-share').click(function() {
        if (navigator.share) {
            navigator.share({
                title: currentStory?.title || 'Tele Tourist Story',
                url: window.location.href
            }).catch(console.error);
        } else {
            alert('Sharing not supported on this browser.');
        }
    });

    $('#comment-form').submit(function(e) {
        e.preventDefault();
        const text = $('#comment-text').val().trim();
        if (!text) return;

        const newComment = {
            author: "You",
            text: text,
            date: "Just now"
        };
        
        if(typeof apiCall === 'function') {
            apiCall(`/stories/${storyId}/comments`, 'POST', { content: text })
                .then((savedComment) => {
                    // Update newComment with backend details if available
                    if (savedComment && savedComment.id) {
                        newComment.author = savedComment.author || "You";
                        newComment.avatar = savedComment.avatar;
                        newComment.date = savedComment.date || "Just now";
                    }
                    currentStory.comments.unshift(newComment); // Add to top
                    renderComments(currentStory.comments);
                    $('#comment-text').val('');
                })
                .catch(err => {
                    console.error('Failed to post comment', err);
                    if (err && err.status === 401) {
                        alert('Please log in to post a comment.');
                        window.location.href = 'login.html';
                    } else {
                        alert('Failed to post comment.');
                    }
                });
        } else {
            currentStory.comments.unshift(newComment);
            renderComments(currentStory.comments);
            $('#comment-text').val('');
        }
    });
});
