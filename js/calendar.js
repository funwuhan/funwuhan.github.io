class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.events = this.loadEvents();
        this.init();
    }

    init() {
        this.updateCalendarHeader();
        this.renderCalendar();
        this.bindEvents();
    }

    loadEvents() {
        return [
            {
                id: 1,
                title: '新年集市',
                date: '2025-01-15',
                time: '10:00-18:00',
                location: '昙华林步行街',
                description: '传统手工艺品展示与售卖'
            },
            {
                id: 2,
                title: '老街摄影展',
                date: '2025-01-20',
                time: '09:00-17:00',
                location: '昙华林文创园',
                description: '展示昙华林百年变迁的影像记录'
            }
        ];
    }

    updateCalendarHeader() {
        const monthYearElement = document.getElementById('currentMonth');
        if (monthYearElement) {
            monthYearElement.textContent = this.currentDate.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long'
            });
        }
    }

    renderCalendar() {
        const calendarGrid = document.getElementById('calendar');
        if (!calendarGrid) return;

        calendarGrid.innerHTML = '';
        
        // 添加星期头部
        const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
        weekDays.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-weekday';
            dayElement.textContent = day;
            calendarGrid.appendChild(dayElement);
        });

        // 获取当月的天数
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        // 填充日历格子
        for (let i = 0; i < firstDay.getDay(); i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyDay);
        }

        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;

            // 检查是否有活动
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = this.events.filter(event => event.date === dateStr);
            
            if (dayEvents.length > 0) {
                dayElement.classList.add('has-event');
                dayElement.addEventListener('click', () => this.showEventDetails(dayEvents));
            }

            calendarGrid.appendChild(dayElement);
        }
    }

    showEventDetails(events) {
        const eventsList = document.querySelector('.upcoming-events .event-list');
        if (!eventsList) return;

        eventsList.innerHTML = events.map(event => `
            <article class="event-card">
                <div class="event-date">
                    <span class="day">${new Date(event.date).getDate()}</span>
                    <span class="month">${new Date(event.date).toLocaleDateString('zh-CN', {month: 'short'})}</span>
                </div>
                <div class="event-details">
                    <h3>${event.title}</h3>
                    <p>${event.description}</p>
                    <span class="event-time"><i class="far fa-clock"></i> ${event.time}</span>
                    <span class="event-location"><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                </div>
                <button class="btn-register" onclick="calendar.registerEvent(${event.id})">报名参加</button>
            </article>
        `).join('');
    }

    registerEvent(eventId) {
        // 这里可以添加实际的报名逻辑
        Toast.show('报名成功！我们会通过微信通知您活动详情', 'success');
    }

    bindEvents() {
        const prevButton = document.getElementById('prevMonth');
        const nextButton = document.getElementById('nextMonth');

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.updateCalendarHeader();
                this.renderCalendar();
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.updateCalendarHeader();
                this.renderCalendar();
            });
        }
    }
}

// 初始化日历
const calendar = new Calendar();