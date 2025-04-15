class CulturalPage {
    constructor() {
        this.stories = this.loadStories();
        this.init();
    }

    loadStories() {
        return [
            {
                id: 1,
                title: '百年老茶馆',
                content: '位于昙华林街头的老四季茶馆，aceeñó武汉百年的变迁。这里不仅有地道的武汉茶点，更是老武汉人记忆中不可磨灭的一部分...',
                image: '../images/stories/teahouse.jpg',
                author: '老街坊 王大爷',
                date: '2025-01-15'
            },
            {
                id: 2,
                title: '匠人精神',
                content: '在昙华林深巷中，有一位坚守了40年的汉绣艺人。她的针线里，藏着武汉非遗文化的精髓，也藏着一位匠人的坚守与传承...',
                image: '../images/stories/craft.jpg',
                author: '手工艺人 李师傅',
                date: '2025-01-14'
            },
            {
                id: 3,
                title: '街巷记忆',
                content: '每一条小巷都有它的故事，每一面老墙都在诉说历史。跟随我们走进昙华林的深巷，聆听那些鲜为人知的老故事...',
                image: '../images/stories/alley.jpg',
                author: '文史工作者 张教授',
                date: '2025-01-13'
            },
            {
                id: 4,
                title: '美食传承',
                content: '从祖父到父亲，再到我，三代人在这条街上经营着同一家面馆。热干面的配方没有变，不变的还有那份对美食的执着...',
                image: '../images/stories/food.jpg',
                author: '老字号传人 陈师傅',
                date: '2025-01-12'
            }
        ];
    }

    init() {
        this.initMap();
        this.initStorySlider();
        this.initWechatLinks();
    }

    initMap() {
        const mapContainer = document.getElementById('map-container');
        if (!mapContainer) return;

        // 使用高德地图API
        const mapScript = document.createElement('script');
        mapScript.src = 'https://webapi.amap.com/maps?v=2.0&key=your-key-here';
        mapScript.async = true;
        mapScript.onload = () => {
            this.loadMap(mapContainer);
        };
        document.head.appendChild(mapScript);
    }

    loadMap(container) {
        const map = new AMap.Map(container, {
            zoom: 15,
            center: [114.306, 30.554] // 昙华林的大致坐标
        });

        const marker = new AMap.Marker({
            position: [114.306, 30.554],
            title: '昙华林'
        });

        map.add(marker);
    }

    initStorySlider() {
        const slider = document.querySelector('.story-slider');
        if (!slider) return;

        slider.innerHTML = this.stories.map(story => `
            <article class="story-card">
                <img src="${story.image}" alt="${story.title}" class="story-image">
                <div class="story-content">
                    <h3>${story.title}</h3>
                    <p>${story.content}</p>
                    <div class="story-meta">
                        <span class="author">${story.author}</span>
                        <span class="date">${Helpers.formatTime(story.date)}</span>
                    </div>
                </div>
            </article>
        `).join('');

        // 初始化滑动功能
        this.initSliderGestures(slider);
    }

    initSliderGestures(slider) {
        let startX, currentX;
        let isDragging = false;

        slider.addEventListener('mousedown', e => {
            isDragging = true;
            startX = e.pageX - slider.offsetLeft;
            slider.style.cursor = 'grabbing';
        });

        slider.addEventListener('mousemove', e => {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.pageX - slider.offsetLeft;
            const diff = currentX - startX;
            slider.scrollLeft -= diff;
            startX = currentX;
        });

        slider.addEventListener('mouseup', () => {
            isDragging = false;
            slider.style.cursor = 'grab';
        });

        slider.addEventListener('mouseleave', () => {
            isDragging = false;
            slider.style.cursor = 'grab';
        });
    }

    initWechatLinks() {
        document.querySelectorAll('.wechat-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const articleId = link.dataset.article;
                // 这里可以添加微信文章跳转逻辑
                Toast.show('正在跳转到微信文章...', 'info');
            });
        });
    }
}

// 初始化页面
const culturalPage = new CulturalPage();