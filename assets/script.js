
      /**
         * XIAOSTUDIO Portfolio Core Logic
         */
        const Portfolio = {
            elements: {
                header: document.getElementById('main-header'),
                overlay: document.getElementById('project-overlay'),
                iframe: document.getElementById('project-iframe'),
                cards: document.querySelectorAll('.project-card')
            },

            init() {
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
                            
                            const placeholder = card.querySelector('.auto-thumb');
                            const assetUrl = card.getAttribute('data-thumb');
                            
                            if (placeholder && assetUrl && !placeholder.dataset.loaded) {
                                this.loadAsset(placeholder, assetUrl, card);
                            }
                        }
                    });
                }, options);

                this.elements.cards.forEach(card => observer.observe(card));
            },

            /**
             * 資源加載處理：自動偵測圖片或影片
             */
            loadAsset(placeholder, url, card) {
                const isVideo = url.match(/\.(mp4|webm|ogg)$/i);
                
                if (isVideo) {
                    const video = document.createElement('video');
                    video.className = placeholder.className;
                    video.src = url;
                    video.autoplay = true;
                    video.loop = true;
                    video.muted = true;
                    video.playsInline = true;
                    video.setAttribute('muted', '');
                    
                    // --- 修復 AbortError 的 5秒循環邏輯 ---
                    let playPromise = null;
                    
                    video.addEventListener('timeupdate', function() {
                        // 只有當影片播放超過 5 秒，且目前的 playPromise 已經處理完畢時才執行重設
                        if (this.currentTime >= 5) {
                            if (playPromise !== null) {
                                playPromise.then(() => {
                                    this.currentTime = 0;
                                    playPromise = this.play();
                                }).catch(error => {
                                    // 忽略中斷錯誤
                                });
                            } else {
                                this.currentTime = 0;
                                playPromise = this.play();
                            }
                        }
                    });
                    
                    video.oncanplay = () => {
                        playPromise = video.play();
                        this.finalizeLoading(placeholder, video, card);
                    };
                    
                    video.onerror = () => this.handleError(card);
                    
                    placeholder.parentNode.replaceChild(video, placeholder);
                } else {
                    placeholder.src = url;
                    placeholder.onload = () => {
                        this.finalizeLoading(null, placeholder, card);
                    };
                    placeholder.onerror = () => this.handleError(card);
                }
            },

            finalizeLoading(oldEl, newEl, card) {
                newEl.classList.add('loaded');
                newEl.dataset.loaded = "true";
                const shimmer = card.querySelector('.loading-shimmer');
                if (shimmer) shimmer.style.display = 'none';
            },

            handleError(card) {
                const shimmer = card.querySelector('.loading-shimmer');
                if (shimmer) shimmer.style.background = '#e0e0e0';
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
   
