/**
 * 開啟專案彈窗
 * @param {string} url - 專案的連結網址
 */
function openProject(url) {
    const header = document.getElementById('main-header');
    const overlay = document.getElementById('project-overlay');
    const iframe = document.getElementById('project-iframe');
    
    // 計算彈窗相對於頁首的位置
    const headerRect = header.getBoundingClientRect();
    const headerBottom = headerRect.bottom + window.scrollY + 20; 
    
    overlay.style.top = headerBottom + 'px';
    
    iframe.src = url;
    overlay.classList.add('active');
    document.body.classList.add('no-scroll');
}

/**
 * 關閉專案彈窗
 */
function closeProject() {
    const overlay = document.getElementById('project-overlay');
    const iframe = document.getElementById('project-iframe');
    overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
    
    // 延遲清空 src 以確保動畫流暢
    setTimeout(() => { 
        iframe.src = ''; 
    }, 700);
}

/**
 * 初始化作品網格與延遲載入效果
 */
function initGallery() {
    const cards = document.querySelectorAll('.project-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                card.classList.add('is-visible');
                
                const img = card.querySelector('.auto-thumb');
                const thumbUrl = card.getAttribute('data-thumb');
                const shimmer = card.querySelector('.loading-shimmer');
                
                // 執行圖片延遲載入
                if (img && thumbUrl && !img.src) {
                    img.src = thumbUrl;
                    img.onload = () => {
                        img.classList.add('loaded');
                        if (shimmer) shimmer.style.opacity = '0';
                    };
                }
                observer.unobserve(card);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    cards.forEach(card => {
        observer.observe(card);
        // 如果是連結，攔截點擊事件以顯示彈窗
        if (card.tagName === 'A') {
            card.onclick = (e) => {
                e.preventDefault();
                openProject(card.getAttribute('href'));
            };
        }
    });
}

// 監聽視窗調整大小，更新彈窗位置
window.addEventListener('resize', () => {
    const overlay = document.getElementById('project-overlay');
    if (overlay.classList.contains('active')) {
        const header = document.getElementById('main-header');
        const headerRect = header.getBoundingClientRect();
        overlay.style.top = (headerRect.bottom + window.scrollY + 20) + 'px';
    }
});

// 當 DOM 載入完成後執行初始化
window.addEventListener('DOMContentLoaded', initGallery);
