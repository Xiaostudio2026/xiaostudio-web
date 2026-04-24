
/**
 * 開啟專案彈窗
 * @param {string} url - 專案頁面的連結
 */
function openProject(url) {
    const overlay = document.getElementById('project-overlay');
    const iframe = document.getElementById('project-iframe');
    iframe.src = url;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // 禁止背景滾動
}

/**
 * 關閉專案彈窗
 */
function closeProject() {
    const overlay = document.getElementById('project-overlay');
    const iframe = document.getElementById('project-iframe');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto'; // 恢復背景滾動
    setTimeout(() => { 
        iframe.src = ''; // 清空 iframe 以免背景繼續運行
    }, 600);
}

/**
 * 載入作品縮圖
 * 從 data-thumb 屬性讀取 URL 並處理載入狀態
 */
function loadProjectThumbnails() {
    const cards = document.querySelectorAll('.project-card[data-thumb]');
    cards.forEach(card => {
        const thumbUrl = card.getAttribute('data-thumb');
        const imgElement = card.querySelector('.auto-thumb');
        const shimmer = card.querySelector('.loading-shimmer');
        
        if (thumbUrl && imgElement) {
            imgElement.src = thumbUrl;
            imgElement.onload = () => {
                imgElement.classList.add('loaded');
                if (shimmer) shimmer.style.display = 'none';
            };
        }
    });
}

/**
 * 初始化專案卡片的點擊事件
 */
function initCardEvents() {
    document.querySelectorAll('a.project-card').forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const url = this.getAttribute('href');
            if (url && url !== '#') {
                openProject(url);
            }
        });
    });
}

/**
 * 滾動進場動畫觀察器 (Intersection Observer)
 */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, { threshold: 0.1 });

/**
 * 視窗載入完成後執行
 */
window.onload = () => {
    // 啟動進場動畫觀察
    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });
    
    // 初始化事件與縮圖
    initCardEvents();
    loadProjectThumbnails();
};
