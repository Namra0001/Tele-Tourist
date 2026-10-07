$(document).ready(function() {
    const savedStories = [
        {
            id: 101,
            title: "Cherry Blossoms in Kyoto",
            excerpt: "Experience the magic of spring in Japan's ancient capital. From temples to quiet streams, Kyoto transforms into a pink wonderland.",
            img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300&h=200&fit=crop",
            location: "Kyoto, Japan",
            author: "Sarah Jenkins",
            savedDate: "2 days ago",
            category: "Asia"
        },
        {
            id: 102,
            title: "A Weekend in Paris",
            excerpt: "Wander through the cobblestone streets of Montmartre, enjoy fresh croissants, and see the Eiffel Tower sparkle at night in this quick guide.",
            img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300&h=200&fit=crop",
            location: "Paris, France",
            author: "Michel Dubois",
            savedDate: "1 week ago",
            category: "Europe"
        },
        {
            id: 103,
            title: "Patagonia Trekking Guide",
            excerpt: "Everything you need to know about hiking the W Trek. Packing lists, weather tips, and the best viewpoints for the glaciers.",
            img: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=300&h=200&fit=crop",
            location: "Patagonia, Chile",
            author: "Alex Wanderlust",
            savedDate: "2 weeks ago",
            category: "Nature"
        }
    ];

    const locationStats = [
        { name: "Japan", count: 12, percent: 80 },
        { name: "France", count: 5, percent: 40 },
        { name: "Chile", count: 3, percent: 25 },
        { name: "Italy", count: 2, percent: 15 }
    ];

    const listContainer = $('#savedStoriesList');
    listContainer.empty();

    if (savedStories.length === 0) {
        listContainer.append('<p class="text-muted">You have no saved stories.</p>');
    } else {
        savedStories.forEach(story => {
            const item = `
                <div class="card border-0 shadow-sm saved-list-item">
                    <div class="card-body p-3 d-flex flex-column flex-sm-row gap-3">
                        <img src="${story.img}" alt="${story.title}" class="story-thumb flex-shrink-0">
                        <div class="flex-grow-1">
                            <div class="d-flex justify-content-between align-items-start mb-1">
                                <div>
                                    <span class="badge bg-secondary mb-2">${story.category}</span>
                                    <h5 class="card-title mb-1">${story.title}</h5>
                                </div>
                                <button class="btn btn-light btn-sm text-danger remove-bookmark" title="Remove from saved">
                                    <i class="bi bi-bookmark-fill"></i>
                                </button>
                            </div>
                            <p class="card-text text-muted excerpt mb-2">${story.excerpt}</p>
                            <div class="d-flex flex-wrap gap-3 small text-muted">
                                <span><i class="bi bi-geo-alt-fill"></i> ${story.location}</span>
                                <span><i class="bi bi-person-fill"></i> ${story.author}</span>
                                <span><i class="bi bi-clock"></i> Saved ${story.savedDate}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            listContainer.append(item);
        });
    }

    $('.remove-bookmark').on('click', function() {
        $(this).closest('.saved-list-item').fadeOut(300, function() {
            $(this).remove();
        });
    });

    const statsContainer = $('#whereToGoStats');
    statsContainer.empty();
    
    locationStats.forEach(stat => {
        const bar = `
            <div class="mb-3">
                <div class="d-flex justify-content-between small mb-1">
                    <span>${stat.name}</span>
                    <span class="text-muted">${stat.count} saved</span>
                </div>
                <div class="progress" style="height: 8px;">
                    <div class="progress-bar" role="progressbar" style="width: ${stat.percent}%" aria-valuenow="${stat.percent}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>
        `;
        statsContainer.append(bar);
    });

    $('.chip').on('click', function() {
        $('.chip').removeClass('active');
        $(this).addClass('active');
    });
});
