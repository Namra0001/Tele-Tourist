let allStories = [];

$(document).ready(function() {
    loadExploreStories();

    $('#explore-category-select, #explore-sort-select').on('change', function() {
        renderStories();
    });

    $('#toggle-reel-mode').on('change', function() {
        const grid = $('#explore-grid');
        const reels = $('#explore-reels');
        if ($(this).is(':checked')) {
            grid.addClass('d-none');
            reels.removeClass('d-none');
        } else {
            grid.removeClass('d-none');
            reels.addClass('d-none');
        }
    });
});

async function loadExploreStories() {
    try {
        const response = await (typeof apiCall === 'function' ? apiCall('/stories?limit=200') : Promise.resolve({ data: null }));
        allStories = response?.stories || response?.data || [];
        
        // Mock data if no API
        if (allStories.length === 0) {
            for(let i=0; i<8; i++) {
                allStories.push({
                    id: i + 10,
                    title: `Explorer Story ${i + 10}`,
                    author: {name: `Author ${i}`},
                    images: [''],
                    excerpt: 'A wonderful journey...',
                    category: {name: ['Food trails', 'Mountains', 'Heritage'][i % 3]},
                    created_at: new Date(Date.now() - i*10000).toISOString(),
                    likes_count: Math.floor(Math.random()*100)
                });
            }
        }
        
        // Hide load more btn since we do frontend filtering now
        $('#load-more-btn').hide();

        renderStories();
    } catch (error) {
        console.error("Error loading explore stories:", error);
    }
}

function renderStories() {
    const grid = $('#explore-grid');
    const reels = $('#explore-reels');
    grid.empty();
    if(reels.length) reels.empty();

    // 1. Filter
    const catVal = $('#explore-category-select').val();
    let filtered = [...allStories];
    
    if (catVal !== 'All Categories') {
        filtered = filtered.filter(s => {
             let catName = '';
             if (typeof s.category === 'string') {
                 catName = s.category;
             } else if (s.category && s.category.name) {
                 catName = s.category.name;
             }
             return catName.toLowerCase().includes(catVal.toLowerCase());
        });
    }

    // 2. Sort
    const sortVal = $('#explore-sort-select').val();
    if (sortVal === 'newest') {
        filtered.sort((a, b) => new Date(b.created_at || 0) < new Date(a.created_at || 0) ? 1 : -1);
    } else {
        // default popular
        filtered.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
    }

    // Update count
    $('#result-count span').text(filtered.length);

    // 3. Render
    filtered.forEach((story, index) => {
        let cardHtml = '';
        if (typeof createStoryCard === "function") {
            const rank = (sortVal === 'popular' && index < 3) ? index + 1 : null;
            cardHtml = createStoryCard(story, rank);
            if (typeof createReelCard === "function") {
                reels.append(createReelCard(story));
            }
        } else {
            cardHtml = `
                <div class="card shadow-sm border-0">
                    ${(story.images && story.images.length > 0) ? `<img src="${story.images[0].includes('sourcesplash') ? 'assets/img/hampi.jpg' : story.images[0]}" class="card-img-top" style="height: 150px; object-fit: cover;">` : `<div class="card-img-top bg-light" style="height: 150px;"></div>`}
                    <div class="card-body">
                        <span class="badge bg-light text-dark mb-2 border">\${typeof story.category === "string" ? story.category : (story.category?.name || "Travel")}</span>
                        <h5 class="card-title font-bricolage">${story.title}</h5>
                    </div>
                </div>
            `;
        }
        grid.append(cardHtml);
    });
}
