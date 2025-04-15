class VideoGallery {
    constructor() {
        this.videos = this.loadVideos();
        this.currentCategory = 'all';
        this.page = 1;
        this.perPage = 6;
        this.init();
    }

    loadVideos() {
        return [
            {
                id: 1,
                title: '昙华林街区导览',
                description: '跟随我们的镜头，探索昙华林的每个角落',
                category: 'guide',
                thumbnail: '../images/video-thumb1.jpg',
                duration: '05:30',
                views: 12000,
                likes: 856,
                url: 'https://your-video-platform.com/video1'
            },
            {
                id: 2,
                title: '老街美食探店',
                description: '带你品尝昙华林特色小吃',
                category: 'food',
                thumbnail: '../images/video-thumb2.jpg',
                duration: '08:45',
                views: 8500,
                likes: 623,
                url: 'https://your-video-platform.com/video2'
            }
        ];
    }

    init() {
        this.initCategoryFilter();
        this.initLoadMore();
        this.displayVideos();
    }

    initCategoryFilter() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentCategory = btn.dataset.category;
                this.page = 1;
                this.displayVideos();
            });
        });
    }

    initLoadMore() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.page++;
                this.displayVideos(true);
            });
        }
    }

    displayVideos(append = false) {
        const container = document.querySelector('.video-grid');
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (!container) return;

        const filteredVideos = this.currentCategory === 'all'
            ? this.videos
            : this.videos.filter(video => video.category === this.currentCategory);

        const start = 0;
        const end = this.page * this.perPage;
        const videosToShow = filteredVideos.slice(start, end);

        const videoHTML = videosToShow.map(video => `
            <article class="video-card" data-category="${video.category}">
                <div class="video-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <span class="video-duration">${video.duration}</span>
                </div>
                <div class="video-info">
                    <h3>${video.title}</h3>
                    <p>${video.description}</p>
                    <div class="video-meta">
                        <span><i class="fas fa-eye"></i> ${(video.views/10000).toFixed(1)}万</span>
                        <span><i class="fas fa-thumbs-up"></i> ${video.likes}</span>
                    </div>
                </div>
            </article>
        `).join('');

        if (append) {
            container.insertAdjacentHTML('beforeend', videoHTML);
        } else {
            container.innerHTML = videoHTML;
        }

        if (loadMoreBtn) {
            loadMoreBtn.style.display = videosToShow.length < filteredVideos.length ? 'block' : 'none';
        }
    }
}

// 初始化视频画廊
const videoGallery = new VideoGallery();