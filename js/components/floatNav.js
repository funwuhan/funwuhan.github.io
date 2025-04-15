class FloatNav {
    constructor() {
        // 判断当前是否在首页
        const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
        const prefix = isHomePage ? 'pages/' : '../pages/';
        
        this.navItems = [
            { icon: 'fa-home', text: '返回首页', url: isHomePage ? '#' : '../index.html' },
            { icon: 'fa-landmark', text: '风土人情', url: `${prefix}cultural.html` },
            { icon: 'fa-book-open', text: '奇闻趣事', url: `${prefix}stories.html` },
            { icon: 'fa-store', text: '创业经历', url: `${prefix}business.html` },
            { icon: 'fa-calendar-alt', text: '最新活动', url: `${prefix}events.html` },
            { icon: 'fa-camera', text: '摄影服务', url: `${prefix}photo.html` },
            { icon: 'fa-comments', text: '留言墙', url: `${prefix}messages.html` },
            { icon: 'fa-video', text: '视频专区', url: `${prefix}video.html` }
        ];
        this.init();
    }

    init() {
        this.createNavElement();
        this.bindEvents();
    }

    createNavElement() {
        const nav = document.createElement('div');
        nav.className = 'float-nav';
        const currentPath = window.location.pathname;
        
        nav.innerHTML = `
            <button class="float-nav-toggle">
                <i class="fas fa-compass"></i>
            </button>
            <div class="float-nav-menu">
                ${this.navItems
                    .filter(item => item.url !== '#')
                    .map(item => {
                        const isActive = currentPath.includes(item.url.split('/').pop());
                        return `
                            <a href="${item.url}" 
                               class="float-nav-item ${isActive ? 'active' : ''}" 
                               title="${item.text}">
                                <i class="fas ${item.icon}"></i>
                                <span>${item.text}</span>
                            </a>
                        `;
                    }).join('')}
            </div>
        `;
        document.body.appendChild(nav);
    }

    bindEvents() {
        const toggle = document.querySelector('.float-nav-toggle');
        const menu = document.querySelector('.float-nav-menu');
        let isOpen = false;

        toggle.addEventListener('click', () => {
            isOpen = !isOpen;
            menu.style.transform = isOpen ? 'scale(1)' : 'scale(0)';
            toggle.classList.toggle('active');
        });

        // 点击页面其他区域关闭导航
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.float-nav') && isOpen) {
                isOpen = false;
                menu.style.transform = 'scale(0)';
                toggle.classList.remove('active');
            }
        });
    }
}