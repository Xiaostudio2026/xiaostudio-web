 function openProject(url) {
            const header = document.getElementById('main-header');
            const overlay = document.getElementById('project-overlay');
            const iframe = document.getElementById('project-iframe');
            
            const headerRect = header.getBoundingClientRect();
            const headerBottom = headerRect.bottom + 20; 
            
            overlay.style.top = headerBottom + 'px';
            
            iframe.src = url;
            overlay.classList.add('active');
            document.body.classList.add('no-scroll');
        }

        function closeProject() {
            const overlay = document.getElementById('project-overlay');
            const iframe = document.getElementById('project-iframe');
            overlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
            setTimeout(() => { iframe.src = ''; }, 600);
        }

        function initGallery() {
            const cards = document.querySelectorAll('.project-card');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        const img = entry.target.querySelector('.auto-thumb');
                        const thumbUrl = entry.target.getAttribute('data-thumb');
                        if (img && thumbUrl && !img.src) {
                            img.src = thumbUrl;
                            img.onload = () => {
                                img.classList.add('loaded');
                                entry.target.querySelector('.loading-shimmer').style.opacity = '0';
                            };
                        }
                    }
                });
            }, { threshold: 0.1 });

            cards.forEach(card => {
                observer.observe(card);
                if (card.tagName === 'A') {
                    card.onclick = (e) => {
                        e.preventDefault();
                        openProject(card.getAttribute('href'));
                    };
                }
            });
        }

        window.addEventListener('DOMContentLoaded', initGallery);
        window.addEventListener('resize', () => {
            const overlay = document.getElementById('project-overlay');
            if (overlay.classList.contains('active')) {
                const header = document.getElementById('main-header');
                const headerRect = header.getBoundingClientRect();
                overlay.style.top = (headerRect.bottom + 20) + 'px';
            }
        });
