class PhotoService {
    constructor() {
        this.portfolioItems = this.loadPortfolio();
        this.init();
    }

    loadPortfolio() {
        return [
            {
                id: 1,
                title: '老街风情',
                category: 'street',
                thumbnail: '../images/portfolio/street1-thumb.jpg',
                description: '记录昙华林的日常街景'
            },
            {
                id: 2,
                title: '文创店铺',
                category: 'shop',
                thumbnail: '../images/portfolio/shop1-thumb.jpg',
                description: '展现特色店铺的独特魅力'
            }
        ];
    }

    init() {
        this.renderPortfolio();
        this.initBookingForm();
    }

    renderPortfolio() {
        const portfolioGrid = document.querySelector('.portfolio-grid');
        if (!portfolioGrid) return;

        portfolioGrid.innerHTML = this.portfolioItems.map(item => `
            <div class="portfolio-item" data-category="${item.category}">
                <img src="${item.thumbnail}" alt="${item.title}" class="portfolio-img">
                <div class="portfolio-overlay">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            </div>
        `).join('');
    }

    initBookingForm() {
        const form = document.getElementById('booking-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            
            // 这里可以添加实际的表单提交逻辑
            Toast.show('预约成功！我们会尽快联系您确认详情', 'success');
            form.reset();
        });
    }
}

// 初始化摄影服务
const photoService = new PhotoService();