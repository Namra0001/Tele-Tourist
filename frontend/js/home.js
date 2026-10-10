$(document).ready(function() {
    loadTopLikedStories();
    
});

function mlCard(s, i) {
    var cover = s.images && s.images[0] ? "background-image:url('" + s.images[0] + "')" : "background-color: var(--mist);";
    var authorName = s.author ? s.author.name : 'Admin User';
    var avatarInitials = authorName.substring(0, 2).toUpperCase();
    var likesCount = s.likes_count || s.like_count || 0;
    var location = s.location || 'Unknown location';
    var category = s.category || 'Story';
    
    return '<div class="ml-item">' +
      '<span class="ml-num" aria-hidden="true">' + (i + 1) + '</span>' +
      '<a class="ml-card" href="story.html?id=' + s.id + '" aria-label="' + s.title + ', ' + likesCount + ' likes">' +
        '<span class="ml-img" style="' + cover + '"></span><span class="ml-shade"></span>' +
        '<span class="ml-cat ml-glass">' + category + '</span>' +
        // (i === 0 ? '<span class="ml-badge">&#9733; Top story</span>' : '') +
        '<span class="ml-likes ml-glass"><svg width="15" height="15" viewBox="0 0 24 24" stroke-width="1.8" stroke-linejoin="round"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/></svg>' + likesCount + '</span>' +
        '<span class="ml-body">' +
          '<h3 class="ml-title">' + s.title + '</h3>' +
          '<span class="ml-loc"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>' + location + '</span>' +
          '<span class="ml-foot">' +
            '<span class="ml-by"><span class="ml-av">' + avatarInitials + '</span><span class="n">' + authorName + '</span></span>' +
            '<span class="ml-go"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>' +
          '</span>' +
        '</span>' +
      '</a></div>';
}

async function loadTopLikedStories() {
    try {
        const response = await (typeof apiCall === 'function' ? apiCall('/stories') : Promise.resolve({ data: [] }));
        

        let stories = [];
        if (response && response.stories) {
            stories = response.stories;
        } else if (Array.isArray(response)) {
            stories = response;
        }

        // --- DYNAMIC STATS LOGIC ---
        try {
            const usersResponse = await (typeof apiCall === 'function' ? apiCall('/users') : Promise.resolve([]));
            const users = Array.isArray(usersResponse) ? usersResponse : (usersResponse.users || []);
            
            const totalStories = response && response.total ? response.total : stories.length;
            let totalUsers = users.length;
            
            const uniqueAuthors = new Set();
            stories.forEach(s => {
                if (s.author && s.author.name) uniqueAuthors.add(s.author.name);
            });
            
            if (totalUsers === 0) {
                totalUsers = uniqueAuthors.size || 1;
                // Since users array is empty, populate it with unique authors for the avatars
                uniqueAuthors.forEach(name => users.push({ name }));
            }
            
            $('#stats-text').html(`<b>${totalUsers} travelers</b> have shared ${totalStories} stories`);
            
            let displayUsers = [];
            if (users.length >= 4) {
                // Shuffle users array and pick 4
                displayUsers = users.sort(() => 0.5 - Math.random()).slice(0, 4);
            } else {
                displayUsers = [...users];
                while (displayUsers.length < 4) {
                    displayUsers.push({ name: 'Admin User' });
                }
            }
            
            let avatarsHtml = '';
            displayUsers.forEach((user, idx) => {
                const name = user.name || 'Admin User';
                const initials = name.substring(0, 2).toUpperCase();
                const zIndex = 4 - idx;
                const marginRight = idx < 3 ? '-10px' : '0';
                const colorIndex = (name.charCodeAt(0) % 6) + 1;
                
                avatarsHtml += `<div class="rounded-circle text-white d-flex align-items-center justify-content-center border border-white" style="width: 32px; height: 32px; margin-right: ${marginRight}; background-color: var(--avatar-${colorIndex}); font-size: 10px; z-index: ${zIndex};">${initials}</div>`;
            });
            $('#stats-avatars').html(avatarsHtml);
            
        } catch(e) {
            console.error("Error loading stats:", e);
        }
        // --- END DYNAMIC STATS LOGIC ---


        // Sort by likes descending
        stories.sort((a, b) => {
            const likesA = a.likes_count || a.like_count || 0;
            const likesB = b.likes_count || b.like_count || 0;
            return likesB - likesA;
        });

        // Top 6 stories (the snippet usually fits 6 or more for scrolling)
        const topStories = stories.slice(0, 6);

        if (topStories.length > 0) {
            var $track = $('#mlTrack');
            $track.html(topStories.map(mlCard).join(''));
            $('#mlDots').html(topStories.map(function(){ return '<i></i>'; }).join(''));
            
            function update(){
                if (!$track[0]) return;
                var el = $track[0], max = el.scrollWidth - el.clientWidth;
                $('#mlPrev').prop('disabled', el.scrollLeft <= 4);
                $('#mlNext').prop('disabled', el.scrollLeft >= max - 4);
                var step = $track.find('.ml-item').first().outerWidth(true) || 0;
                if (step > 0) {
                    var active = Math.min(topStories.length - 1, Math.round(el.scrollLeft / step));
                    $('#mlDots i').removeClass('on').eq(active).addClass('on');
                }
            }
            function scrollByCards(dir){
                var step = $track.find('.ml-item').first().outerWidth(true) + 18;
                var visible = Math.max(1, Math.floor($track[0].clientWidth / step));
                $track[0].scrollBy({ left: dir * step * visible, behavior: 'smooth' });
            }
            $('#mlPrev').off('click').on('click', function(){ scrollByCards(-1); });
            $('#mlNext').off('click').on('click', function(){ scrollByCards(1); });
            $track.off('scroll').on('scroll', update);
            $(window).off('resize').on('resize', update);
            setTimeout(update, 100); // initial update
        }
    } catch (error) {
        console.error("Error loading top liked stories:", error);
    }
}

