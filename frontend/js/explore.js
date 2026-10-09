let currentPage = 1;

$(document).ready(function() {
    loadExploreStories();

    $('#load-more-btn').on('click', function() {
        currentPage++;
        loadExploreStories();
    });

    $('#toggle-reel-mode').on('click', function() {
        const grid = $('#explore-grid');
        const reels = $('#explore-reels');
        const btn = $(this);
        if (grid.hasClass('d-none')) {
            grid.removeClass('d-none');
            reels.addClass('d-none');
            btn.html('<i class="bi bi-play-btn"></i> Reel Mode');
        } else {
            grid.addClass('d-none');
            reels.removeClass('d-none');
            btn.html('<i class="bi bi-grid"></i> Grid Mode');
        }
    });
});

async function loadExploreStories() {
    try {
        const response = await (typeof apiCall === 'function' ? apiCall(`/stories?page=${currentPage}`) : Promise.resolve({ data: null }));
        let stories = response?.stories || response?.data || [];
        
        // Mock data if no API
        if (stories.length === 0) {
            for(let i=0; i<8; i++) {
                stories.push({
                    id: i + currentPage * 10,
                    title: `Explorer Story ${i + currentPage * 10}`,
                    author: `Author ${i}`,
                    image: '',
                    excerpt: 'A wonderful journey full of surprises and new experiences...',
                    category: ['Food', 'Adventure', 'Culture'][i % 3]
                });
            }
        }

        // Sort by likes
        stories.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));

        const grid = $('#explore-grid');
        
        // Update count
        const currentCount = parseInt($('#result-count span').text());
        $('#result-count span').text(currentCount + stories.length);

        stories.forEach((story, index) => {
            let cardHtml = '';
            
            if (typeof createStoryCard === "function") {
                const rank = (currentPage === 1 && index < 3) ? index + 1 : null;
                cardHtml = createStoryCard(story, rank);
                if (typeof createReelCard === "function") {
                    $("#explore-reels").append(createReelCard(story));
                }
            } else {

                cardHtml = `
                    <div class="card shadow-sm border-0">
                        ${story.image ? `<img src="${story.image}" class="card-img-top" alt="${story.title}">` : `<div class="card-img-top bg-light" style="height: 150px;"></div>`}
                        <div class="card-body">
                            <span class="badge bg-light text-dark mb-2 border">${story.category || 'Travel'}</span>
                            <h5 class="card-title font-bricolage" style="font-family: 'Bricolage Grotesque', sans-serif;">${story.title}</h5>
                            <p class="card-text text-muted small">${story.excerpt}</p>
                            <p class="card-text"><small class="text-primary fw-bold">By ${story.author}</small></p>
                        </div>
                    </div>
                `;
            }
            grid.append(cardHtml);
        });

        if (response && response.totalPages && currentPage >= response.totalPages) {
            $('#load-more-btn').hide();
        }

    } catch (error) {
        console.error("Error loading explore stories:", error);
    }
}
