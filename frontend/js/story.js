$(document).ready(function() {
    $('#navbar-placeholder').load('components/navbar.html');
    $('#footer-placeholder').load('components/footer.html');

    const urlParams = new URLSearchParams(window.location.search);
    const storyId = urlParams.get('id');
    let currentStory = null;

    if (storyId) {
        fetchStory(storyId);
    } else {
        $('#story-title').text('Story not found');
    }

    function fetchStory(id) {
        if (typeof apiCall === 'function') {
            apiCall(`/api/stories/${id}`, 'GET')
                .then(data => renderStory(data))
                .catch(err => {
                    console.error('Error fetching story:', err);
                    $('#story-title').text('Failed to load story');
                });
        } else {
            const mockData = {
                id: id,
                title: "A Hidden Gem in the Mountains",
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
                    { author: "John Smith", text: "Looks amazing!", date: "Oct 13, 2023" }
                ]
            };
            renderStory(mockData);
        }
    }

    function renderStory(story) {
        currentStory = story;
        $('#story-title').text(story.title);
        $('#story-category').text(story.category);
        $('#author-name').text(story.author.name);
        $('#author-avatar').attr('src', story.author.avatar);
        $('#story-date').text(story.date);
        $('#story-content').html(story.content);
        
        $('#story-location-name').text(story.location.name);
        $('#story-location').text(story.location.address);
        $('#stat-category').text(story.category);
        $('#stat-photos').text(story.photos.length);
        $('#stat-likes').text(story.likes);

        if (story.photos && story.photos.length > 0) {
            let mosaicHtml = '';
            let galleryHtml = '';
            story.photos.forEach((photo, index) => {
                if (index < 5) {
                    let mainClass = index === 0 ? 'mosaic-item-main' : '';
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
            } else {
                 mosaicHtml += `<button class="btn btn-sm btn-see-all" data-bs-toggle="modal" data-bs-target="#galleryModal"><i class="bi bi-grid-3x3-gap-fill me-1"></i> See all photos</button>`;
            }
            $('#photo-mosaic').html(mosaicHtml);
            $('#gallery-carousel-inner').html(galleryHtml);
        }

        renderComments(story.comments || []);
    }

    function renderComments(comments) {
        $('#comment-count').text(comments.length);
        let html = '';
        comments.forEach(c => {
            html += `
                <div class="d-flex mb-3 pb-3 border-bottom">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(c.author)}&background=random" class="rounded-circle me-3" style="width:40px;height:40px;" alt="avatar">
                    <div>
                        <div class="fw-bold">${c.author} <span class="text-muted small fw-normal ms-2">${c.date}</span></div>
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
        const icon = $(this).find('i');
        icon.toggleClass('bi-heart bi-heart-fill');
        
        let likes = parseInt($('#stat-likes').text());
        if ($(this).hasClass('btn-danger')) {
            likes++;
            if(typeof apiCall === 'function') apiCall(`/api/stories/${storyId}/like`, 'POST');
        } else {
            likes--;
            if(typeof apiCall === 'function') apiCall(`/api/stories/${storyId}/like`, 'DELETE');
        }
        $('#stat-likes').text(likes);
    });

    $('#btn-save').click(function() {
        if (!currentStory) return;
        $(this).toggleClass('btn-outline-dark btn-dark');
        const icon = $(this).find('i');
        icon.toggleClass('bi-bookmark bi-bookmark-fill');
        
        if ($(this).hasClass('btn-dark')) {
            if(typeof apiCall === 'function') apiCall(`/api/stories/${storyId}/save`, 'POST');
        } else {
            if(typeof apiCall === 'function') apiCall(`/api/stories/${storyId}/save`, 'DELETE');
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
            apiCall(`/api/stories/${storyId}/comments`, 'POST', { text: text })
                .then(() => {
                    currentStory.comments.push(newComment);
                    renderComments(currentStory.comments);
                    $('#comment-text').val('');
                });
        } else {
            currentStory.comments.push(newComment);
            renderComments(currentStory.comments);
            $('#comment-text').val('');
        }
    });
});
