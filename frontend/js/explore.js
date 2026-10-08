let currentPage = 1;

$(document).ready(function() {
    loadExploreStories();

    $('#load-more-btn').on('click', function() {
        currentPage++;
        loadExploreStories();
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

        const grid = $('#explore-grid');
        
        // Update count
        const currentCount = parseInt($('#result-count span').text());
        $('#result-count span').text(currentCount + stories.length);

        stories.forEach(story => {
            let cardHtml = '';
            if (typeof createStoryCard === 'function') {
                cardHtml = createStoryCard(story);
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

    } catch (error) {
        console.error("Error loading explore stories:", error);
    }
}
