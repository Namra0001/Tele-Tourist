$(document).ready(function() {
    loadTopLikedStories();
    loadCategories();
});

async function loadTopLikedStories() {
    try {
        const response = await (typeof apiCall === 'function' ? apiCall('/stories') : Promise.resolve({ data: [] }));
        
        let stories = [];
        if (response && response.stories) {
            stories = response.stories;
        } else if (Array.isArray(response)) {
            stories = response;
        }

        // Sort by likes descending
        stories.sort((a, b) => {
            const likesA = a.likes_count || a.like_count || 0;
            const likesB = b.likes_count || b.like_count || 0;
            return likesB - likesA;
        });

        // Top 4 stories
        const top4 = stories.slice(0, 4);

        if (top4.length > 0) {
            // Populate #1 (Featured)
            const featured = top4[0];
            const fCard = $('#featured-story');
            fCard.attr('href', 'story.html#id=' + featured.id);
            fCard.css('background-image', `linear-gradient(to top, rgba(0,0,0,0.8), transparent), url('${featured.images && featured.images[0] ? featured.images[0] : ''}')`);
            fCard.find('h2').text(featured.title).addClass('text-white'); // Make description/title font colour white
            fCard.find('.text-white:last').html(`<img src="assets/img/heart.png" style="width: 14px; filter: brightness(0) invert(1);"> ${featured.likes_count || featured.like_count || 0}`);
            
            const fAuthor = featured.author ? featured.author.name : 'Unknown';
            fCard.find('.d-flex.align-items-center.gap-2 span').text(fAuthor);
            
            const fInitials = fAuthor.substring(0, 2).toUpperCase();
            fCard.find('.rounded-circle').text(fInitials).removeClass('text-lagoon').addClass('text-dark').show(); // Make avatar black colour font
            
            if (featured.category) {
                fCard.find('.chip').text(featured.category).show();
            }

            // Add #1 Badge side-by-side with category
            const topBadgeContainer = fCard.find('.position-absolute.top-0.start-0');
            topBadgeContainer.removeClass('m-4').addClass('m-3 d-flex align-items-center gap-2');
            if (topBadgeContainer.find('.rank-badge').length === 0) {
                topBadgeContainer.prepend('<div class="rank-badge badge bg-warning text-dark fw-bold rounded-2 d-flex align-items-center justify-content-center" style="padding: 4px 10px; font-size:1rem; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">#1</div>');
            }

            // Populate #2, #3, #4
            for (let i = 1; i < 4; i++) {
                if (top4[i]) {
                    const story = top4[i];
                    const sCard = $('#story-card-' + (i + 1));
                    sCard.attr('href', 'story.html#id=' + story.id);
                    
                    const imgUrl = story.images && story.images[0] ? story.images[0] : '';
                    const imgContainer = sCard.find('.img-container');
                    imgContainer.css({
                        'background-image': `url('${imgUrl}')`,
                        'background-size': 'cover',
                        'background-position': 'center',
                        'position': 'relative'
                    });
                    
                    if (imgContainer.find('.rank-badge').length === 0) {
                        imgContainer.append('<div class="rank-badge position-absolute top-0 start-0 m-2 badge bg-warning text-dark fw-bold rounded-1 d-flex align-items-center justify-content-center" style="padding: 2px 8px; z-index:5;font-size:0.85rem; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">#' + (i + 1) + '</div>');
                    }
                    
                    if (story.category) {
                        sCard.find('.chip').text(story.category);
                    }
                    sCard.find('h6').text(story.title);
                    
                    const loc = story.location || 'Unknown location';
                    sCard.find('p.text-muted').html(`<img src="assets/img/location.png" style="width: 12px; margin-top: -3px;"> ${loc}`);
                    
                    const sAuthor = story.author ? story.author.name : 'Unknown';
                    
                    // Restore user avatar
                    const sInitials = sAuthor.substring(0, 2).toUpperCase();
                    const badge = sCard.find('.rounded-circle');
                    badge.text(sInitials);
                    badge.removeClass('text-dark fw-bold').addClass('text-white');
                    badge.css({
                        'background-color': '', // Clear the yellow background, let the HTML class fallback take over or assign one
                        'font-size': '9px'
                    });
                    
                    // Assign a nice random background color for the avatar if it lost its class
                    const colorIndex = (sAuthor.charCodeAt(0) % 6) + 1;
                    badge.css('background-color', 'var(--avatar-' + colorIndex + ')');
                    
                    sCard.find('.text-secondary').text(sAuthor);
                    
                    const likes = story.likes_count || story.like_count || 0;
                    sCard.find('span.text-muted:last').html(`<img src="assets/img/heart.png" style="width: 14px;"> ${likes}`);
                }
            }
        }
    } catch (error) {
        console.error("Error loading top liked stories:", error);
    }
}

function loadCategories() {
    //
}
