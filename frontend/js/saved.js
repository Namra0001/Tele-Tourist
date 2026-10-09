$(document).ready(function() {
    loadSavedStories();
});

async function loadSavedStories() {
    const listContainer = $('#savedStoriesList');
    listContainer.html('<p class="text-muted">Loading saved stories...</p>');
    
    const statsContainer = $('#whereToGoStats');
    statsContainer.empty();

    if (!localStorage.getItem('token')) {
        listContainer.html('<p class="text-muted">Please log in to view your saved stories.</p>');
        return;
    }

    try {
        const response = await apiCall('/users/me/saved', 'GET');
        
        let savedStories = [];
        if (response && response.stories) {
            savedStories = response.stories;
        } else if (Array.isArray(response)) {
            savedStories = response;
        }
        
        listContainer.empty();

        if (savedStories.length === 0) {
            listContainer.append('<p class="text-muted">You have no saved stories.</p>');
        } else {
            // Aggregate locations for stats
            const locationCounts = {};
            
            savedStories.forEach(story => {
                const img = (story.images && story.images.length > 0) ? story.images[0] : 'https://via.placeholder.com/300x200';
                const authorName = story.author ? story.author.name : 'Unknown';
                const date = new Date(story.created_at).toLocaleDateString();
                const excerpt = story.description ? (story.description.length > 100 ? story.description.substring(0, 100) + '...' : story.description) : '';
                const loc = story.location || 'Unknown';
                
                // Track location stats
                if (loc !== 'Unknown') {
                    // Extract country if there's a comma (e.g. "Paris, France" -> "France")
                    const parts = loc.split(',');
                    const country = parts[parts.length - 1].trim();
                    locationCounts[country] = (locationCounts[country] || 0) + 1;
                }

                const item = `
                    <div class="card border-0 shadow-sm saved-list-item mb-3" data-id="${story.id}">
                        <div class="card-body p-3 d-flex flex-column flex-sm-row gap-3">
                            <a href="story.html#id=${story.id}" class="flex-shrink-0 text-decoration-none">
                                <img src="${img}" alt="${story.title}" class="story-thumb rounded" style="width: 150px; height: 120px; object-fit: cover;">
                            </a>
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-start mb-1">
                                    <div>
                                        <span class="badge bg-secondary mb-2">${story.category || 'General'}</span>
                                        <a href="story.html#id=${story.id}" class="text-decoration-none text-dark">
                                            <h5 class="card-title mb-1">${story.title}</h5>
                                        </a>
                                    </div>
                                    <button class="btn btn-light btn-sm text-danger remove-bookmark" data-id="${story.id}" title="Remove from saved">
                                        <i class="bi bi-bookmark-fill" style="color: var(--saffron);"></i>
                                    </button>
                                </div>
                                <p class="card-text text-muted excerpt mb-2">${excerpt}</p>
                                <div class="d-flex flex-wrap gap-3 small text-muted">
                                    <span><i class="bi bi-geo-alt-fill"></i> ${loc}</span>
                                    <span><i class="bi bi-person-fill"></i> ${authorName}</span>
                                    <span><i class="bi bi-clock"></i> ${date}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                listContainer.append(item);
            });
            
            // Build Stats
            const totalLocs = Object.values(locationCounts).reduce((a, b) => a + b, 0);
            const stats = Object.keys(locationCounts).map(name => {
                return { name, count: locationCounts[name], percent: Math.round((locationCounts[name] / totalLocs) * 100) };
            }).sort((a, b) => b.count - a.count).slice(0, 5); // top 5
            
            if (stats.length > 0) {
                stats.forEach(stat => {
                    const bar = `
                        <div class="mb-3">
                            <div class="d-flex justify-content-between small mb-1">
                                <span>${stat.name}</span>
                                <span class="text-muted">${stat.count} saved</span>
                            </div>
                            <div class="progress" style="height: 8px;">
                                <div class="progress-bar" role="progressbar" style="background-color: var(--saffron); width: ${stat.percent}%" aria-valuenow="${stat.percent}" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
                    `;
                    statsContainer.append(bar);
                });
            } else {
                statsContainer.html('<p class="text-muted small">No location data available.</p>');
            }

            // Add click listener for remove buttons
            $('.remove-bookmark').on('click', async function() {
                const btn = $(this);
                const id = btn.data('id');
                try {
                    await apiCall('/stories/' + id + '/save', 'DELETE');
                    btn.closest('.saved-list-item').fadeOut(300, function() {
                        $(this).remove();
                        if ($('.saved-list-item').length === 0) {
                            $('#savedStoriesList').html('<p class="text-muted">You have no saved stories.</p>');
                            $('#whereToGoStats').empty();
                        }
                    });
                } catch (err) {
                    console.error("Failed to remove saved story", err);
                }
            });
        }
    } catch (err) {
        console.error("Error loading saved stories:", err);
        listContainer.html('<p class="text-danger">Failed to load saved stories. Please try again later.</p>');
    }
}
