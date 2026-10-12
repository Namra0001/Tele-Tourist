$(document).ready(function() {
    // If not using dynamic ui.js navbar loader
    if ($('#navbar-placeholder').is(':empty')) {
        if (typeof renderNavbar === 'function') {
            renderNavbar();
        } else {
            $('#navbar-placeholder').load('components/navbar.html');
        }
    }
    if ($('#footer-placeholder').is(':empty')) {
        $('#footer-placeholder').load('components/footer.html');
    }

    function getEditStoryId() {
        // 1. Search param: ?id=...
        const urlParams = new URLSearchParams(window.location.search);
        let id = urlParams.get('id');
        if (id) return id;

        // 2. Hash param: #id=... or #<uuid>
        if (window.location.hash) {
            const cleanHash = window.location.hash.replace(/^#/, '');
            const hashParams = new URLSearchParams(cleanHash);
            id = hashParams.get('id');
            if (id) return id;
            if (cleanHash && cleanHash.length > 20) return cleanHash;
        }

        // 3. Storage fallbacks (set by clicking Edit in profile.html)
        const sessionStoryId = sessionStorage.getItem('editStoryId');
        if (sessionStoryId) return sessionStoryId;

        const localStoryId = localStorage.getItem('editStoryId');
        if (localStoryId) return localStoryId;

        return null;
    }

    const editId = getEditStoryId();
    
    let uploadedFiles = [];
    let existingImages = [];

    // Detailed ratings dictionary
    const ratings = {
        people: 0,
        food: 0,
        cleanliness: 0,
        safety: 0,
        value: 0
    };

    function updateOverallRating() {
        let total = 0;
        let count = 0;
        for (const key in ratings) {
            if (ratings[key] > 0) {
                total += ratings[key];
                count++;
            }
        }
        
        const avg = count > 0 ? (total / count) : 0;
        $('#overall-average-text').text(avg.toFixed(1) + ' / 5.0');
        $('#input-rating').val(avg.toFixed(1));
        
        let starsHtml = '';
        const fullStars = Math.round(avg);
        const emptyStars = Math.max(0, 5 - fullStars);
        for (let i = 0; i < fullStars; i++) starsHtml += '★';
        for (let i = 0; i < emptyStars; i++) starsHtml += '☆';
        $('#overall-stars').text(starsHtml);
    }

    $(document).on('click', '.rating-category i', function() {
        const val = parseInt($(this).data('val')) || 0;
        const categoryContainer = $(this).closest('.rating-category');
        const category = categoryContainer.data('category');
        
        ratings[category] = val;
        $('#input-rating-' + category).val(val);
        
        categoryContainer.find('i').each(function() {
            if (parseInt($(this).data('val')) <= val) {
                $(this).removeClass('text-muted').addClass('text-warning');
            } else {
                $(this).removeClass('text-warning').addClass('text-muted');
            }
        });
        
        updateOverallRating();
    });

    // Populate author in live preview
    let currentUserName = 'Traveler';
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const parsed = JSON.parse(userStr);
            currentUserName = parsed.name || parsed.username || 'Traveler';
        } catch(e) {
            currentUserName = userStr;
        }
    }
    $('#preview-author-name').text(currentUserName);
    
    let initials = 'TR';
    const parts = currentUserName.trim().split(/\s+/);
    if (parts.length >= 2) {
        initials = (parts[0][0] + parts[1][0]).toUpperCase();
    } else if (currentUserName.length >= 2) {
        initials = currentUserName.substring(0, 2).toUpperCase();
    } else if (currentUserName.length > 0) {
        initials = currentUserName[0].toUpperCase();
    }
    $('#preview-author-avatar').text(initials);

    // Live preview event bindings
    $('#input-title').on('input', function() {
        const val = $(this).val();
        $('#preview-title').text(val || 'Story Title');
    });

    $('#input-location').on('input', function() {
        const val = $(this).val();
        $('#preview-location').text(val || 'Location');
    });

    $('#input-description').on('input', function() {
        const val = $(this).val();
        $('#char-count').text(val.length);
        $('#preview-desc').text(val || 'Description will appear here...');
    });

    $('input[name="category"]').change(function() {
        $('#preview-category').text($(this).data('name'));
    });

    // File Upload logic
    const dropzone = $('#photo-dropzone');
    const fileInput = $('#file-input');

    dropzone.click(() => fileInput[0].click());
    $('#btn-add-more').click(() => fileInput[0].click());

    dropzone.on('dragover', function(e) {
        e.preventDefault();
        $(this).addClass('dragover');
    });

    dropzone.on('dragleave', function(e) {
        e.preventDefault();
        $(this).removeClass('dragover');
    });

    dropzone.on('drop', function(e) {
        e.preventDefault();
        $(this).removeClass('dragover');
        handleFiles(e.originalEvent.dataTransfer.files);
    });

    fileInput.change(function(e) {
        handleFiles(this.files);
    });

    function handleFiles(files) {
        if (files.length > 0) {
            dropzone.addClass('d-none');
            $('#btn-add-more').removeClass('d-none');
        }

        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) return;
            
            uploadedFiles.push(file);
            const fileIndex = uploadedFiles.length - 1;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const totalVisible = $('.thumb-container').length;
                const isFirst = (totalVisible === 0);

                if (isFirst) {
                    $('#preview-cover').attr('src', e.target.result).css('opacity', '1');
                }
                
                const thumbHtml = `
                    <div class="thumb-container new-thumb" data-index="${fileIndex}">
                        <img src="${e.target.result}" class="thumb-img" alt="thumbnail">
                        <button class="btn-remove btn-remove-thumb" type="button"><i class="bi bi-x"></i></button>
                        ${isFirst ? '<span class="badge-cover">COVER</span>' : ''}
                    </div>
                `;
                $(thumbHtml).insertBefore('#btn-add-more');
            };
            reader.readAsDataURL(file);
        });
    }

    $(document).on('click', '.btn-remove-thumb', function(e) {
        e.stopPropagation();
        const container = $(this).closest('.thumb-container');
        
        if (container.hasClass('new-thumb')) {
            const index = container.data('index');
            uploadedFiles[index] = null;
        } else if (container.hasClass('existing-thumb')) {
            const url = container.data('url');
            existingImages = existingImages.filter(img => img !== url);
        }

        container.remove();
        updateThumbnails();
    });

    function updateThumbnails() {
        const remainingContainers = $('.thumb-container');
        if (remainingContainers.length === 0) {
            dropzone.removeClass('d-none');
            $('#btn-add-more').addClass('d-none');
            $('#preview-cover').attr('src', 'https://via.placeholder.com/400x200?text=No+Photo');
            return;
        }
        
        remainingContainers.each(function(idx) {
            $(this).find('.badge-cover').remove();
            if (idx === 0) {
                $(this).append('<span class="badge-cover">COVER</span>');
                const firstSrc = $(this).find('img').attr('src');
                if (firstSrc) {
                    $('#preview-cover').attr('src', firstSrc).css('opacity', '1');
                }
            }
        });
    }

    // Load story for edit mode
    function loadStoryForEdit(id) {
        $('#btn-publish').prop('disabled', true).text('Loading story...');

        apiCall(`/stories/${id}`, 'GET')
            .then(data => {
                // Verify story ownership
                const storedUser = localStorage.getItem('user');
                let loggedInId = null;
                if (storedUser) {
                    try { loggedInId = JSON.parse(storedUser)?.id; } catch(e){}
                }
                const authorId = data.user_id || (data.author && data.author.id);
                if (authorId && loggedInId && authorId !== loggedInId) {
                    alert('You do not have permission to edit another traveler\'s story.');
                    window.location.href = 'community.html';
                    return;
                }

                $('#btn-publish').prop('disabled', false).text('Save changes');

                // 1. Title
                if (data.title) {
                    $('#input-title').val(data.title).trigger('input');
                }

                // 2. Location
                const locText = (data.location && typeof data.location === 'object') ? data.location.name : data.location;
                if (locText) {
                    $('#input-location').val(locText).trigger('input');
                }

                // 3. Description
                const descText = data.description || data.content || '';
                if (descText) {
                    $('#input-description').val(descText).trigger('input');
                }

                // 4. Category
                const catVal = String(data.category_id || '').toLowerCase();
                const catName = String(data.category || '').toLowerCase();
                $('input[name="category"]').each(function() {
                    const val = String($(this).val()).toLowerCase();
                    const name = String($(this).data('name')).toLowerCase();
                    if ((catVal && val === catVal) || (catName && name === catName) || (catVal && name === catVal)) {
                        $(this).prop('checked', true).trigger('change');
                    }
                });

                // Update live preview card
                $('#preview-title').text(data.title || 'Story Title');
                $('#preview-location').text(locText || 'Location');
                $('#preview-desc').text(descText || 'Description will appear here...');
                if (data.category) {
                    $('#preview-category').text(data.category);
                }

                // 5. Author info in preview
                if (data.author && data.author.name) {
                    $('#preview-author-name').text(data.author.name);
                    const authorInitials = data.author.name.trim().split(/\s+/).map(p => p[0]).join('').substring(0, 2).toUpperCase();
                    $('#preview-author-avatar').text(authorInitials);
                }

                // 6. Ratings
                const storyRating = Math.round(parseFloat(data.rating) || 5);
                ['people', 'food', 'cleanliness', 'safety', 'value'].forEach(cat => {
                    $(`.rating-category[data-category="${cat}"] i[data-val="${storyRating}"]`).click();
                });

                // 7. Existing Photos
                if (data.images && data.images.length > 0) {
                    existingImages = [...data.images];
                    dropzone.addClass('d-none');
                    $('#btn-add-more').removeClass('d-none');

                    data.images.forEach((imgUrl, idx) => {
                        const isCover = (idx === 0);
                        if (isCover) {
                            $('#preview-cover').attr('src', imgUrl).css('opacity', '1');
                        }

                        const thumbHtml = `
                            <div class="thumb-container existing-thumb" data-url="${imgUrl}">
                                <img src="${imgUrl}" class="thumb-img" alt="thumbnail">
                                <button class="btn-remove btn-remove-thumb" type="button"><i class="bi bi-x"></i></button>
                                ${isCover ? '<span class="badge-cover">COVER</span>' : ''}
                            </div>
                        `;
                        $(thumbHtml).insertBefore('#btn-add-more');
                    });
                }
            })
            .catch(err => {
                console.error('Failed to load story for edit:', err);
                alert('Could not load story data. You may not be authorized or story does not exist.');
                $('#btn-publish').prop('disabled', false).text('Publish story');
            });
    }

    // Check if in Edit Mode
    if (editId) {
        $('#page-title').text('Edit story');
        $('#btn-publish').text('Save changes');
        loadStoryForEdit(editId);
    }

    // Publish / Save Submission
    $('#btn-publish').click(function() {
        const title = $('#input-title').val().trim();
        const location = $('#input-location').val().trim();
        const category = $('input[name="category"]:checked').val();
        const description = $('#input-description').val().trim();
        const rating = $('#input-rating').val() || 5;
        
        if (!title || !location || !description) {
            alert('Please fill in all required fields (Title, Location, Description).');
            return;
        }

        const btn = $(this);
        const originalText = btn.text();
        btn.prop('disabled', true).text(editId ? 'Saving changes...' : 'Publishing...');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('location', location);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('rating', rating);
        
        const validFiles = uploadedFiles.filter(f => f !== null && f !== undefined);
        validFiles.forEach(file => {
            formData.append('images', file);
        });

        const method = editId ? 'PUT' : 'POST';
        const url = editId ? `/stories/${editId}` : '/stories';

        fetch(CONFIG.API_BASE_URL + url, {
            method: method,
            body: formData,
            headers: {
                'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
            }
        })
        .then(async res => {
            if (!res.ok) {
                const errBody = await res.json().catch(() => ({}));
                throw new Error(errBody.message || 'Failed to save story');
            }
            return res.json();
        })
        .then(data => {
            alert(editId ? 'Story updated successfully!' : 'Story published successfully!');
            const targetStoryId = (data && data.id) ? data.id : (editId || '');
            if (targetStoryId) {
                window.location.href = `story.html#id=${targetStoryId}`;
            } else {
                window.location.href = 'profile.html';
            }
        })
        .catch(err => {
            console.error(err);
            alert('Error: ' + err.message);
            btn.prop('disabled', false).text(originalText);
        });
    });
});
