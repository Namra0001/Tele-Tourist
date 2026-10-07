$(document).ready(function() {
    loadFreshStories();
    loadCategories();
});

async function loadFreshStories() {
    try {
        const response = await typeof apiCall === 'function' ? apiCall('/stories/fresh') : Promise.resolve({ data: null });
        let stories = response?.data || [];
        
        // Mock data if API is not yet returning data
        if (stories.length === 0) {
            stories = [
                { id: 1, title: 'Lost in Kyoto', author: 'Jane D.', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600', featured: true },
                { id: 2, title: 'Best Pasta in Rome', author: 'Mark T.', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=300' },
                { id: 3, title: 'Hiking the Alps', author: 'Sarah W.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=300' },
                { id: 4, title: 'Midnight in Paris', author: 'Alex B.', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=300' }
            ];
        }

        const container = $('#fresh-stories-container');
        container.empty();

        if (stories.length > 0) {
            const featured = stories[0];
            const featuredHtml = `
                <div class="col-lg-6 mb-4">
                    <div class="card text-white bg-dark h-100 border-0 overflow-hidden">
                        <img src="${featured.image}" class="card-img h-100" style="object-fit: cover; opacity: 0.6;" alt="${featured.title}">
                        <div class="card-img-overlay d-flex flex-column justify-content-end p-4" style="background: linear-gradient(transparent, rgba(0,0,0,0.8));">
                            <h3 class="card-title font-bricolage">${featured.title}</h3>
                            <p class="card-text">By ${featured.author}</p>
                        </div>
                    </div>
                </div>
            `;
            
            let sideCardsHtml = '<div class="col-lg-6 d-flex flex-column gap-3">';
            for(let i = 1; i < Math.min(stories.length, 4); i++) {
                const story = stories[i];
                let cardHtml = '';
                if (typeof createStoryCard === 'function') {
                    // Try to use globally defined createStoryCard, maybe overriding layout
                    try {
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = createStoryCard(story);
                        // Convert typical card to horizontal layout roughly
                        cardHtml = `
                            <div class="card flex-row border-0 shadow-sm overflow-hidden" style="height: 120px;">
                                <img src="${story.image}" style="width: 120px; object-fit: cover;" alt="${story.title}">
                                <div class="card-body">
                                    <h5 class="card-title">${story.title}</h5>
                                    <p class="card-text text-muted small">By ${story.author}</p>
                                </div>
                            </div>
                        `;
                    } catch (e) {}
                }
                
                if (!cardHtml) {
                    cardHtml = `
                        <div class="card flex-row border-0 shadow-sm overflow-hidden" style="height: 120px;">
                            <img src="${story.image}" style="width: 120px; object-fit: cover;" alt="${story.title}">
                            <div class="card-body">
                                <h5 class="card-title">${story.title}</h5>
                                <p class="card-text text-muted small">By ${story.author}</p>
                            </div>
                        </div>
                    `;
                }
                sideCardsHtml += cardHtml;
            }
            sideCardsHtml += '</div>';

            container.append(featuredHtml + sideCardsHtml);
        }
    } catch (error) {
        console.error("Error loading fresh stories:", error);
    }
}

function loadCategories() {
    const categories = ['Adventure', 'Food & Drink', 'Culture', 'Relaxation', 'Nightlife', 'Nature'];
    const container = $('#home-categories');
    
    categories.forEach(cat => {
        container.append(`<a href="#" class="category-chip">${cat}</a>`);
    });
}
