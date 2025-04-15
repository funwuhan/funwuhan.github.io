class MessageWall {
    constructor() {
        this.messages = this.loadMessages();
        this.currentMood = 'all';
        this.init();
    }

    loadMessages() {
        return JSON.parse(localStorage.getItem('wall-messages')) || [
            {
                id: 1,
                content: '昙华林的小吃真是太棒了！',
                mood: 'happy',
                date: '2025-01-15',
                likes: 23
            },
            {
                id: 2,
                content: '在这里拍照太有感觉了，每个角落都是景',
                mood: 'love',
                date: '2025-01-14',
                likes: 15
            }
        ];
    }

    init() {
        this.initForm();
        this.initFilters();
        this.displayMessages();
    }

    initForm() {
        const form = document.getElementById('message-form');
        const moodButtons = document.querySelectorAll('.mood-btn');
        let selectedMood = '';

        moodButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                moodButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedMood = btn.dataset.mood;
            });
        });

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const content = form.querySelector('textarea').value.trim();
                
                if (!content) {
                    Toast.show('请输入留言内容', 'error');
                    return;
                }

                if (!selectedMood) {
                    Toast.show('请选择心情', 'error');
                    return;
                }

                this.addMessage(content, selectedMood);
                form.reset();
                moodButtons.forEach(btn => btn.classList.remove('active'));
            });
        }
    }

    initFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentMood = btn.dataset.filter;
                this.displayMessages();
            });
        });
    }

    addMessage(content, mood) {
        const message = {
            id: Date.now(),
            content,
            mood,
            date: new Date().toISOString(),
            likes: 0
        };

        this.messages.unshift(message);
        this.saveMessages();
        this.displayMessages();
        Toast.show('留言发布成功！', 'success');
    }

    saveMessages() {
        localStorage.setItem('wall-messages', JSON.stringify(this.messages));
    }

    displayMessages() {
        const container = document.getElementById('messages-container');
        if (!container) return;

        const filteredMessages = this.currentMood === 'all' 
            ? this.messages 
            : this.messages.filter(msg => msg.mood === this.currentMood);

        container.innerHTML = filteredMessages.map(msg => `
            <div class="message-card" data-mood="${msg.mood}">
                <div class="message-content">
                    <p>${msg.content}</p>
                    <div class="message-meta">
                        <span class="message-date">${utils.formatDate(msg.date)}</span>
                        <button class="like-btn" onclick="messageWall.likeMessage(${msg.id})">
                            <i class="fas fa-heart"></i>
                            <span>${msg.likes}</span>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    likeMessage(messageId) {
        const message = this.messages.find(msg => msg.id === messageId);
        if (message) {
            message.likes++;
            this.saveMessages();
            this.displayMessages();
        }
    }
}

// 初始化留言墙
const messageWall = new MessageWall();