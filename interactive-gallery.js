// ========================================
// DC TEKNİK - Interactive Gallery
// Version: v1.0.0 - ULTIMATE ENHANCEMENT
// ========================================

class InteractiveGallery {
    constructor() {
        this.galleryData = [
            {
                id: 1,
                category: 'dinamo',
                title: 'Dinamo Tamiri',
                description: 'Profesyonel dinamo tamiri ve yenileme hizmeti. Tüm marka araçlar için kaliteli çözümler.',
                image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop',
                stats: { completed: 150, rating: 4.9 }
            },
            {
                id: 2,
                category: 'alternator',
                title: 'Alternatör Servisi',
                description: 'Alternatör arıza tespiti, tamiri ve yenileme. Uzman ekibimizle güvenilir hizmet.',
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
                stats: { completed: 120, rating: 4.8 }
            },
            {
                id: 3,
                category: 'starter',
                title: 'Marş Motoru',
                description: 'Marş motoru tamiri ve bakımı. Hızlı çözüm ve uzun ömürlü garantili hizmet.',
                image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop',
                stats: { completed: 95, rating: 4.9 }
            },
            {
                id: 4,
                category: 'electrical',
                title: 'Elektrik Sistemi',
                description: 'Araç elektrik sistemi tamiri ve bakımı. Modern cihazlarla profesyonel hizmet.',
                image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop',
                stats: { completed: 200, rating: 4.7 }
            },
            {
                id: 5,
                category: 'workshop',
                title: 'Atölye Çalışması',
                description: 'Modern atölye ortamında profesyonel çalışma. Temiz ve düzenli çalışma alanı.',
                image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop',
                stats: { completed: 300, rating: 4.9 }
            },
            {
                id: 6,
                category: 'tools',
                title: 'Profesyonel Araçlar',
                description: 'En son teknoloji araçlar ve ekipmanlar. Kaliteli işçilik için modern cihazlar.',
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
                stats: { completed: 500, rating: 4.8 }
            }
        ];

        this.currentCategory = 'all';
        this.init();
    }

    init() {
        this.createGalleryHTML();
        this.bindEvents();
        this.createModal();
        this.animateOnScroll();
    }

    createGalleryHTML() {
        const gallerySection = document.createElement('section');
        gallerySection.className = 'interactive-gallery';
        gallerySection.id = 'interactive-gallery';

        gallerySection.innerHTML = `
            <div class="gallery-container">
                <div class="gallery-header">
                    <h2 class="gallery-title">Çalışmalarımız</h2>
                    <p class="gallery-subtitle">15 yıllık deneyimimizle gerçekleştirdiğimiz başarılı projeler ve hizmetlerimiz</p>
                </div>

                <div class="gallery-categories">
                    <button class="category-btn active" data-category="all">Tümü</button>
                    <button class="category-btn" data-category="dinamo">Dinamo</button>
                    <button class="category-btn" data-category="alternator">Alternatör</button>
                    <button class="category-btn" data-category="starter">Marş Motoru</button>
                    <button class="category-btn" data-category="electrical">Elektrik</button>
                    <button class="category-btn" data-category="workshop">Atölye</button>
                </div>

                <div class="gallery-grid" id="galleryGrid">
                    <!-- Gallery items will be inserted here -->
                </div>

                <div class="gallery-stats">
                    <div class="stat-card">
                        <span class="stat-number" data-count="1000">0</span>
                        <span class="stat-label">Tamamlanan Proje</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-number" data-count="4.9">0</span>
                        <span class="stat-label">Müşteri Puanı</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-number" data-count="15">0</span>
                        <span class="stat-label">Yıllık Deneyim</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-number" data-count="98">0</span>
                        <span class="stat-label">Memnuniyet Oranı</span>
                    </div>
                </div>
            </div>
        `;

        // Insert after hero section
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.insertAdjacentElement('afterend', gallerySection);
        }

        this.renderGallery();
        this.animateStats();
    }

    renderGallery() {
        const galleryGrid = document.getElementById('galleryGrid');
        if (!galleryGrid) return;

        const filteredData = this.currentCategory === 'all' 
            ? this.galleryData 
            : this.galleryData.filter(item => item.category === this.currentCategory);

        galleryGrid.innerHTML = filteredData.map(item => `
            <div class="gallery-item fade-in-up" data-category="${item.category}">
                <img src="${item.image}" alt="${item.title}" class="gallery-image" loading="lazy">
                <div class="gallery-overlay">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <button class="btn" onclick="gallery.openModal(${item.id})">Detayları Gör</button>
                </div>
            </div>
        `).join('');

        // Animate items
        setTimeout(() => {
            const items = galleryGrid.querySelectorAll('.gallery-item');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('visible');
                }, index * 100);
            });
        }, 100);
    }

    bindEvents() {
        // Category buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-btn')) {
                const category = e.target.dataset.category;
                this.filterByCategory(category);
                
                // Update active button
                document.querySelectorAll('.category-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
            }
        });

        // Gallery item clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.gallery-item')) {
                const item = e.target.closest('.gallery-item');
                const category = item.dataset.category;
                const items = this.galleryData.filter(data => data.category === category);
                if (items.length > 0) {
                    this.openModal(items[0].id);
                }
            }
        });
    }

    filterByCategory(category) {
        this.currentCategory = category;
        this.renderGallery();
        
        // Track analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'gallery_filter', {
                event_category: 'engagement',
                event_label: category,
                value: 1
            });
        }
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'gallery-modal';
        modal.id = 'galleryModal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="gallery.closeModal()">&times;</button>
                <img class="modal-image" src="" alt="">
                <div class="modal-info">
                    <h3 class="modal-title"></h3>
                    <p class="modal-description"></p>
                    <div class="modal-actions">
                        <a href="#contact" class="btn btn-primary">İletişime Geç</a>
                        <a href="https://wa.me/905353562469" class="btn btn-whatsapp" target="_blank">WhatsApp</a>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    openModal(itemId) {
        const item = this.galleryData.find(data => data.id === itemId);
        if (!item) return;

        const modal = document.getElementById('galleryModal');
        const modalImage = modal.querySelector('.modal-image');
        const modalTitle = modal.querySelector('.modal-title');
        const modalDescription = modal.querySelector('.modal-description');

        modalImage.src = item.image;
        modalImage.alt = item.title;
        modalTitle.textContent = item.title;
        modalDescription.textContent = item.description;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Track modal open
        if (typeof gtag !== 'undefined') {
            gtag('event', 'gallery_modal_open', {
                event_category: 'engagement',
                event_label: item.title,
                value: 1
            });
        }
    }

    closeModal() {
        const modal = document.getElementById('galleryModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateNumber(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => observer.observe(stat));
    }

    animateNumber(element) {
        const target = parseFloat(element.dataset.count);
        const duration = 2000;
        const start = performance.now();
        const isDecimal = target % 1 !== 0;

        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = target * easeOutQuart;
            
            element.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }

    animateOnScroll() {
        const elements = document.querySelectorAll('.fade-in-up');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => observer.observe(el));
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gallery = new InteractiveGallery();
    
    // Add CSS for interactive gallery
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'interactive-gallery.css?v=20250115v1';
    document.head.appendChild(link);
    
    console.log('🎨 Interactive Gallery initialized successfully!');
});

// Export for potential external use
window.InteractiveGallery = InteractiveGallery;
