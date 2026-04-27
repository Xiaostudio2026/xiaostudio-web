/**
 * 專案腳本邏輯 - 支援彈窗控制與圖片延遲載入
 */

/**
 * 開啟專案彈窗
 * @param {string} url - 專案的連結網址
 */
function openProject(url) {
    const header = document.getElementById('main-header');
    const overlay = document.getElementById('project-overlay');
    const iframe = document.getElementById('project-iframe');
    
    if (!header || !overlay || !iframe) return;

    // 計算彈窗位置，使其緊接在頁首下方
    const headerRect = header.getBoundingClientRect();
    const headerBottom = headerRect.bottom + window.scrollY + 20; 
    
    overlay.style.top = headerBottom + 'px';
    iframe.src = url;
    
    // 顯示彈窗並禁止背景滾動
    overlay.classList.add('active');
    document.body.classList.add('no-scroll');
}

/**
 * 關閉專案彈窗
 */
function closeProject() {
    const overlay = document.getElementById('project-overlay');
    const iframe = document.getElementById('project-iframe');
    
    if (overlay) overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
    
    // 延遲清空 src 以確保動畫過程流暢
    setTimeout(() => { 
        if (iframe) iframe.src = ''; 
    }, 700);
}

/**
 * 核心圖片載入函數
 * @param {HTMLElement} card - 專案卡片元素
 */
function loadImage(card) {
    const img = card.querySelector('.auto-thumb');
    const thumbUrl = card.getAttribute('data-thumb');
    const shimmer = card.querySelector('.loading-shimmer');
    
    if (img && thumbUrl && !img.src) {
        img.src = thumbUrl;
        img.onload = () => {
            img.classList.add('loaded');
            if (shimmer) shimmer.style.opacity = '0';
        };
        // 錯誤處理
        img.onerror = () => {
            console.error("圖片載入失敗，請檢查 Cloudinary 網址或網路狀態:", thumbUrl);
            if (shimmer) shimmer.style.background = '#eee';
        };
    }
}

/**
 * 初始化作品網格
 */
function initGallery() {
    const cards = document.querySelectorAll('.project-card');
    
    // 檢查是否為本機檔案環境 (file://)
    // 在本機環境下，IntersectionObserver 有時會受到瀏覽器安全性限制
    const isLocalFile = window.location.protocol === 'file:';

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                card.classList.add('is-visible');
                loadImage(card);
                observer.unobserve(card);
            }
        });
    }, { 
        threshold: 0,
        rootMargin: '200px' // 提前 200px 開始載入
    });

    cards.forEach((card, index) => {
        // 如果是在本機開啟，直接顯示並載入以避開安全性限制
        if (isLocalFile) {
            card.classList.add('is-visible');
            loadImage(card);
        } else {
            observer.observe(card);
        }
        
        // 點擊事件處理
        if (card.tagName === 'A') {
            card.onclick = (e) => {
                e.preventDefault();
                openProject(card.getAttribute('href'));
            };
        }
    });

    // 保險機制：確保即使 Observer 失效，圖片也會在數秒後顯示
    setTimeout(() => {
        document.querySelectorAll('.project-card:not(.is-visible)').forEach(card => {
            card.classList.add('is-visible');
            loadImage(card);
        });
    }, 2500);
}

// 監聽視窗調整，即時修正開啟中的彈窗位置
window.addEventListener('resize', () => {
    const overlay = document.getElementById('project-overlay');
    if (overlay && overlay.classList.contains('active')) {
        const header = document.getElementById('main-header');
        if (header) {
            const headerRect = header.getBoundingClientRect();
            overlay.style.top = (headerRect.bottom + window.scrollY + 20) + 'px';
        }
    }
});

// 當 DOM 載入完成後執行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGallery);
} else {
    initGallery();
}
