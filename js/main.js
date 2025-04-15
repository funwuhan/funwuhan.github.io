// 工具函数
const utils = {
    // 防抖函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 格式化日期
    formatDate(date) {
        return new Date(date).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // 生成唯一ID
    generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }
};

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏滚动效果
    const nav = document.querySelector('.main-nav');
    if (nav) {
        window.addEventListener('scroll', utils.debounce(() => {
            if (window.scrollY > 100) {
                nav.classList.add('nav-scrolled');
            } else {
                nav.classList.remove('nav-scrolled');
            }
        }, 100));
    }

    // 图片懒加载
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// 消息提示组件
class Toast {
    static show(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            }, 3000);
        }, 100);
    }
}

// 导出工具函数和组件
window.utils = utils;
window.Toast = Toast;

// 留言板功能
class MessageBoard {
    constructor() {
        this.messages = JSON.parse(localStorage.getItem('messages')) || [];
    }

    addMessage(message) {
        this.messages.push({
            content: message,
            date: new Date().toISOString(),
            id: Date.now()
        });
        this.saveMessages();
        this.displayMessages();
    }

    saveMessages() {
        localStorage.setItem('messages', JSON.stringify(this.messages));
    }

    displayMessages() {
        const container = document.querySelector('#message-list');
        if (!container) return;
        
        container.innerHTML = this.messages
            .map(msg => `
                <div class="message-card">
                    <p>${msg.content}</p>
                    <small>${new Date(msg.date).toLocaleDateString()}</small>
                </div>
            `)
            .join('');
    }
}

// 初始化留言板
const messageBoard = new MessageBoard();

// 浮动导航拖拽功能
class FloatNav {
    constructor() {
        this.nav = document.querySelector('.float-nav');
        if (!this.nav) return;

        // 检查浮动导航状态
        this.checkNavStatus();
        
        const savedPosition = JSON.parse(localStorage.getItem('floatNavPosition')) || {
            right: '20px',
            bottom: '20px'
        };
        
        Object.assign(this.nav.style, savedPosition);
        
        this.initDrag();
        this.initTouch();
        this.initToggle();
    }

    checkNavStatus() {
        console.log('浮动导航状态检查：', {
            '是否存在': !!this.nav,
            '当前页面': window.location.pathname,
            'z-index': getComputedStyle(this.nav).zIndex,
            '可见性': getComputedStyle(this.nav).display
        });
    }

    initToggle() {
        const toggle = this.nav.querySelector('.float-nav-toggle');
        const menu = this.nav.querySelector('.float-nav-menu');
        
        if (toggle && menu) {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation(); // 防止触发拖动
                menu.style.transform = menu.style.transform === 'scale(1)' ? 'scale(0)' : 'scale(1)';
                toggle.classList.toggle('active');
            });
        }
    }

    initDrag() {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        this.nav.addEventListener('mousedown', (e) => {
            isDragging = true;
            initialX = e.clientX - this.nav.offsetLeft;
            initialY = e.clientY - this.nav.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            // 确保不超出视窗范围
            const maxX = window.innerWidth - this.nav.offsetWidth;
            const maxY = window.innerHeight - this.nav.offsetHeight;
            
            currentX = Math.min(Math.max(0, currentX), maxX);
            currentY = Math.min(Math.max(0, currentY), maxY);

            // 更新位置
            const right = `${window.innerWidth - currentX - this.nav.offsetWidth}px`;
            const bottom = `${window.innerHeight - currentY - this.nav.offsetHeight}px`;
            
            Object.assign(this.nav.style, { right, bottom });
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;

            // 保存位置到localStorage
            localStorage.setItem('floatNavPosition', JSON.stringify({
                right: this.nav.style.right,
                bottom: this.nav.style.bottom
            }));
        });
    }

    initTouch() {
        let initialX;
        let initialY;
        let initialRight;
        let initialBottom;

        this.nav.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                initialX = touch.clientX;
                initialY = touch.clientY;
                initialRight = parseInt(this.nav.style.right);
                initialBottom = parseInt(this.nav.style.bottom);
                
                e.preventDefault(); // 防止滚动
            }
        }, { passive: false });

        this.nav.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                const deltaX = initialX - touch.clientX;
                const deltaY = initialY - touch.clientY;

                const newRight = Math.max(0, initialRight + deltaX);
                const newBottom = Math.max(0, initialBottom + deltaY);

                // 确保不超出视窗范围
                const maxRight = window.innerWidth - this.nav.offsetWidth;
                const maxBottom = window.innerHeight - this.nav.offsetHeight;

                this.nav.style.right = `${Math.min(newRight, maxRight)}px`;
                this.nav.style.bottom = `${Math.min(newBottom, maxBottom)}px`;

                e.preventDefault(); // 防止滚动
            }
        }, { passive: false });

        this.nav.addEventListener('touchend', () => {
            // 保存最终位置
            localStorage.setItem('floatNavPosition', JSON.stringify({
                right: this.nav.style.right,
                bottom: this.nav.style.bottom
            }));
        });
    }
}

// 页面加载完成后初始化浮动导航
document.addEventListener('DOMContentLoaded', function() {
    const floatNav = new FloatNav();
});