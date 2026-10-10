$(document).ready(function() {
    $('#navbar-placeholder').load('components/navbar.html');
    $('#footer-placeholder').load('components/footer.html');

    // Rating logic
    $(document).on('click', '#rating-container i', function() {
        const val = parseInt($(this).data('val'));
        $('#input-rating').val(val);
        $('#rating-container i').each(function() {
            if (parseInt($(this).data('val')) <= val) {
                $(this).removeClass('text-muted bi-star').addClass('text-warning bi-star-fill');
            } else {
                $(this).removeClass('text-warning bi-star-fill').addClass('text-muted bi-star');
            }
        });
    });

    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('id');
    
    let uploadedFiles = [];

    if (editId) {
        $('#page-title').text('Edit Story');
        $('#btn-publish').text('Save Changes');
        loadStoryForEdit(editId);
    }

        // Populate author
    const currentUserName = localStorage.getItem('user') || 'Anonymous';
    $('#preview-author-name').text(currentUserName);
    let initials = 'U';
    const parts = currentUserName.trim().split(' ');
    if (parts.length >= 2) {
        initials = (parts[0][0] + parts[1][0]).toUpperCase();
    } else if (currentUserName.length >= 2) {
        initials = currentUserName.substring(0, 2).toUpperCase();
    } else if (currentUserName.length > 0) {
        initials = currentUserName[0].toUpperCase();
    }
    $('#preview-author-avatar').text(initials);

    // Live preview logic
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
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const isFirst = uploadedFiles.length === 1;
                if (isFirst) {
                    const previewCover = $('#preview-cover');
                    if (file.type.startsWith('video/')) {
                        if (previewCover.is('img')) {
                            previewCover.replaceWith(`<video id="preview-cover" src="${e.target.result}" style="position:absolute; width:100%; height:100%; object-fit:cover; z-index:0;" controls></video>`);
                        } else {
                            previewCover.attr('src', e.target.result);
                        }
                    } else {
                        if (previewCover.is('video')) {
                            previewCover.replaceWith(`<img id="preview-cover" src="${e.target.result}" style="position:absolute; width:100%; height:100%; object-fit:cover; z-index:0;" alt="cover">`);
                        } else {
                            previewCover.attr('src', e.target.result);
                        }
                    }
                }
                
                const thumbHtml = `
                    <div class="thumb-container" data-index="${uploadedFiles.length - 1}">
                        <img src="${e.target.result}" alt="thumbnail">
                        <button class="btn-remove-thumb" type="button"><i class="bi bi-x"></i></button>
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
        const index = container.data('index');
        
        uploadedFiles[index] = null;
        container.remove();
        
        updateThumbnails();
    });

    function updateThumbnails() {
        const validFiles = uploadedFiles.filter(f => f !== null);
        if (validFiles.length === 0) {
            dropzone.removeClass('d-none');
            $('#btn-add-more').addClass('d-none');
            $('#preview-cover').attr('src', 'https://via.placeholder.com/400x200?text=No+Photo');
        }
        
        $('.thumb-container').each(function() { $(this).find('.badge-cover').remove(); });
        
        const firstThumb = $('.thumb-container').first();
        if (firstThumb.length) {
            firstThumb.append('<span class="badge-cover">COVER</span>');
            const imgSrc = firstThumb.find('img').attr('src');
            $('#preview-cover').attr('src', imgSrc);
        }
    }

    // Submission
    $('#btn-publish').click(function() {
        const title = $('#input-title').val().trim();
        const location = $('#input-location').val().trim();
        const category = $('input[name="category"]:checked').val();
        const description = $('#input-description').val().trim();
        
        if (!title || !location || !description) {
            alert('Please fill in all required fields (Title, Location, Description).');
            return;
        }

        const btn = $(this);
        const originalText = btn.text();
        btn.prop('disabled', true).text('Publishing...');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('location', location);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('rating', $('#input-rating').val());
        
        const validFiles = uploadedFiles.filter(f => f !== null);
        validFiles.forEach((file, index) => {
            formData.append('images', file);
        });

        const method = editId ? 'PUT' : 'POST';
        const url = editId ? `/stories/${editId}` : '/stories';

        if (typeof apiCall === 'function') {
            // Using fetch directly to let browser set multipart/form-data boundary
            fetch(CONFIG.API_BASE_URL + url, {
                method: method,
                body: formData,
                headers: {
                    'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
                }
            })
            .then(res => {
                if (!res.ok) throw new Error('Failed to publish');
                return res.json();
            })
            .then(data => {
                window.location.href = `story?id=${data.id || editId || 1}`;
            })
            .catch(err => {
                console.error(err);
                alert('Error publishing story.');
                btn.prop('disabled', false).text(originalText);
            });
        } else {
            setTimeout(() => {
                alert('Story published successfully!');
                window.location.href = 'explore.html';
            }, 1000);
        }
    });

    function loadStoryForEdit(id) {
        if (typeof apiCall === 'function') {
            apiCall(`/stories/${id}`, 'GET')
                .then(data => {
                    $('#input-title').val(data.title).trigger('input');
                    $('#input-location').val(data.location.name || data.location).trigger('input');
                    $('#input-description').val(data.content || data.description).trigger('input');
                    $(`input[name="category"][value="${data.category}"]`).prop('checked', true).trigger('change');
                    if (data.rating) {
                        $(`#rating-container i[data-val="${data.rating}"]`).click();
                    }
                })
                .catch(console.error);
        }
    }
});

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
        
        // Always calculate mean across all 5 even if some are 0?
        // Let's divide by 5 for the average as requested
        const avg = total / 5;
        $('#overall-average-text').text(avg.toFixed(1) + ' / 5.0');
        $('#input-rating').val(avg.toFixed(1)); // for backend compatibility
        
        let starsHtml = '';
        const fullStars = Math.floor(avg);
        const emptyStars = 5 - fullStars;
        for (let i = 0; i < fullStars; i++) starsHtml += '★';
        for (let i = 0; i < emptyStars; i++) starsHtml += '☆';
        $('#overall-stars').text(starsHtml);
    }

    $('.rating-category i').click(function() {
        const val = $(this).data('val');
        const categoryContainer = $(this).closest('.rating-category');
        const category = categoryContainer.data('category');
        
        ratings[category] = val;
        $('#input-rating-' + category).val(val);
        
        categoryContainer.find('i').each(function() {
            if ($(this).data('val') <= val) {
                $(this).removeClass('text-muted').addClass('text-warning');
            } else {
                $(this).removeClass('text-warning').addClass('text-muted');
            }
        });
        
        updateOverallRating();
    });
