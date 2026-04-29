/**
 * XIAOSTUDIO Portfolio Core Logic
 * 用於處理圖片懶加載、滾動動畫與專案視窗彈出
 */

const Portfolio = {
    elements: {
        header: document.getElementById('main-header'),
        overlay: document.getElementById('project-overlay'),
        iframe: document.getElementById('project-iframe'),
        cards: document.querySelectorAll('.project-card')
    },

    init() {
        if (!this.elements.header) return; // 安全檢查
        this.bindEvents();
        this.setupIntersectionObserver();
    },

    bindEvents() {
        this.elements.cards.forEach(card => {
            if (card.tagName === 'A') {
                card.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.open(card.getAttribute('href'));
                });
            }
        });

        window.addEventListener('resize', () => {
            if (this.elements.overlay.classList.contains('active')) {
                this.updateOverlayPosition();
            }
        });
    },

    setupIntersectionObserver() {
        const options = {
            threshold: 0.01,
            rootMargin: '200px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    card.classList.add('is-visible');
                    
                    const img = card.querySelector('.auto-thumb');
                    const thumbUrl = card.getAttribute('data-thumb');
                    
                    if (img && thumbUrl && !img.getAttribute('src')) {
                        this.loadImage(img, thumbUrl, card);
                    }
                }
            });
        }, options);

        this.elements.cards.forEach(card => observer.observe(card));
    },

    loadImage(img, url, card) {
        img.src = url;
        img.onload = () => {
            img.classList.add('loaded');
            const shimmer = card.querySelector('.loading-shimmer');
            if (shimmer) shimmer.style.display = 'none';
        };
        img.onerror = () => {
            console.error("Image load failed:", url);
            const shimmer = card.querySelector('.loading-shimmer');
            if (shimmer) shimmer.style.background = '#e0e0e0';
        };
    },

    open(url) {
        this.updateOverlayPosition();
        this.elements.iframe.src = url;
        this.elements.overlay.classList.add('active');
        document.body.classList.add('no-scroll');
    },

    close() {
        this.elements.overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
        setTimeout(() => { this.elements.iframe.src = ''; }, 600);
    },

    updateOverlayPosition() {
        const headerRect = this.elements.header.getBoundingClientRect();
        this.elements.overlay.style.top = (headerRect.bottom + 20) + 'px';
    }
};

document.addEventListener('DOMContentLoaded', () => Portfolio.init());
