$(document).ready(function() {
    const profileData = {
        isOwnProfile: true,
        name: "Alex Wanderlust",
        location: "Kyoto, Japan",
        bio: "Exploring the world one cafe at a time. Photography enthusiast and slow travel advocate.",
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
        coverUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&h=250&fit=crop",
        stats: {
            stories: 12,
            likes: 840,
            saved: 45
        },
        stories: [
            { id: 1, title: "A Week in Kyoto", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=200&fit=crop", date: "Oct 12, 2023" },
            { id: 2, title: "Hidden Gems of Rome", img: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=200&fit=crop", date: "Sep 5, 2023" },
            { id: 3, title: "Hiking the Swiss Alps", img: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=400&h=200&fit=crop", date: "Aug 20, 2023" }
        ]
    };

    $('#profileName').text(profileData.name);
    $('#profileLocation').text(profileData.location);
    $('#profileBio').text(profileData.bio);
    $('#profileAvatar').attr('src', profileData.avatarUrl);
    $('#profileCover').css('background-image', `url('${profileData.coverUrl}')`);
    
    $('#statStories').text(profileData.stats.stories);
    $('#statLikes').text(profileData.stats.likes);
    $('#statSaved').text(profileData.stats.saved);

    if (!profileData.isOwnProfile) {
        $('#btnEditProfile').hide();
    }

    $('#aboutContent').text(profileData.bio);

    const grid = $('#storiesGrid');
    grid.empty();

    if (profileData.stories.length === 0) {
        grid.append('<div class="col-12"><p class="text-muted">No stories yet.</p></div>');
    } else {
        profileData.stories.forEach(story => {
            let actionBtns = '';
            if (profileData.isOwnProfile) {
                actionBtns = `
                    <div class="story-actions">
                        <button class="btn btn-sm btn-light border shadow-sm me-1" title="Edit"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-danger shadow-sm" title="Delete"><i class="bi bi-trash"></i></button>
                    </div>
                `;
            }

            const card = `
                <div class="col-md-4">
                    <div class="card h-100 story-card position-relative shadow-sm border-0">
                        ${actionBtns}
                        <img src="${story.img}" class="card-img-top" alt="${story.title}">
                        <div class="card-body">
                            <h5 class="card-title">${story.title}</h5>
                            <p class="card-text text-muted small">${story.date}</p>
                        </div>
                    </div>
                </div>
            `;
            grid.append(card);
        });
    }
});
