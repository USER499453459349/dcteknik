/**
 * DC TEKNİK Modern Intro Animation
 * Etkileyici açılış animasyonu ve giriş sistemi
 * 
 * Features:
 * - Particle animation
 * - Text reveal effects
 * - Loading animations
 * - Smooth transitions
 * - Interactive elements
 * - Sound effects
 * - Progress indicators
 * - Brand showcase
 */

class ModernIntro {
    constructor() {
        this.introConfig = {
            duration: 5000, // 5 seconds
            particleCount: 100,
            animationSpeed: 1,
            soundEnabled: true,
            autoSkip: false,
            skipDelay: 3000 // 3 seconds before skip button appears
        };
        
        this.animationElements = {
            particles: [],
            textElements: [],
            progressBar: null,
            skipButton: null,
            logo: null,
            background: null
        };
        
        this.animationState = {
            isPlaying: false,
            isComplete: false,
            currentStep: 0,
            progress: 0
        };
        
        this.init();
    }
    
    init() {
        console.log('🎨 Modern Intro initialized');
        this.createIntroHTML();
        this.setupEventListeners();
        this.startIntro();
    }
    
    createIntroHTML() {
        // Create intro overlay
        const introOverlay = document.createElement('div');
        introOverlay.id = 'modern-intro-overlay';
        introOverlay.innerHTML = `
            <div class="intro-background">
                <canvas id="particle-canvas"></canvas>
                <div class="intro-gradient"></div>
            </div>
            
            <div class="intro-content">
                <div class="intro-logo">
                    <div class="logo-container">
                        <div class="logo-icon">⚡</div>
                        <div class="logo-text">
                            <span class="logo-main">DC TEKNİK</span>
                            <span class="logo-subtitle">Dinamo Uzmanı</span>
                        </div>
                    </div>
                </div>
                
                <div class="intro-text">
                    <h1 class="intro-title">
                        <span class="title-line">İstanbul Anadolu Yakası'nın</span>
                        <span class="title-line">En Güvenilir</span>
                        <span class="title-line highlight">Dinamo Uzmanı</span>
                    </h1>
                    
                    <p class="intro-description">
                        15+ yıllık deneyimimizle dinamo tamiri, alternatör bakımı ve marş motoru onarımı konusunda profesyonel hizmet.
                    </p>
                </div>
                
                <div class="intro-features">
                    <div class="feature-item">
                        <div class="feature-icon">⚡</div>
                        <div class="feature-text">Hızlı Teşhis</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">🛡️</div>
                        <div class="feature-text">%100 Garanti</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">💰</div>
                        <div class="feature-text">Şeffaf Fiyat</div>
                    </div>
                </div>
                
                <div class="intro-progress">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <div class="progress-text">Yükleniyor...</div>
                </div>
                
                <div class="intro-actions">
                    <button class="skip-button" id="skip-intro">
                        <span class="skip-text">Geç</span>
                        <span class="skip-icon">→</span>
                    </button>
                </div>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(introOverlay);
        
        // Store references
        this.animationElements.particles = document.getElementById('particle-canvas');
        this.animationElements.progressBar = introOverlay.querySelector('.progress-fill');
        this.animationElements.skipButton = document.getElementById('skip-intro');
        this.animationElements.logo = introOverlay.querySelector('.intro-logo');
        this.animationElements.background = introOverlay.querySelector('.intro-background');
        
        // Add CSS
        this.addIntroCSS();
    }
    
    addIntroCSS() {
        const style = document.createElement('style');
        style.textContent = `
            #modern-intro-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
            }
            
            .intro-background {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
            }
            
            #particle-canvas {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2;
            }
            
            .intro-gradient {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%);
                z-index: 3;
            }
            
            .intro-content {
                position: relative;
                z-index: 10;
                text-align: center;
                color: white;
                max-width: 800px;
                padding: 40px;
                animation: fadeInUp 1s ease-out;
            }
            
            .intro-logo {
                margin-bottom: 40px;
                animation: logoReveal 1.5s ease-out;
            }
            
            .logo-container {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 20px;
                margin-bottom: 20px;
            }
            
            .logo-icon {
                font-size: 4rem;
                animation: logoSpin 2s ease-in-out infinite;
            }
            
            .logo-text {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
            }
            
            .logo-main {
                font-size: 3rem;
                font-weight: 700;
                line-height: 1;
                background: linear-gradient(45deg, #fff, #f0f0f0);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .logo-subtitle {
                font-size: 1.2rem;
                opacity: 0.8;
                font-weight: 300;
            }
            
            .intro-text {
                margin-bottom: 40px;
                animation: textReveal 2s ease-out 0.5s both;
            }
            
            .intro-title {
                font-size: 3.5rem;
                font-weight: 700;
                line-height: 1.2;
                margin-bottom: 20px;
            }
            
            .title-line {
                display: block;
                animation: titleSlideIn 1s ease-out both;
            }
            
            .title-line:nth-child(1) { animation-delay: 0.5s; }
            .title-line:nth-child(2) { animation-delay: 0.7s; }
            .title-line:nth-child(3) { animation-delay: 0.9s; }
            
            .title-line.highlight {
                background: linear-gradient(45deg, #ffd700, #ffed4e);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: highlightPulse 2s ease-in-out infinite;
            }
            
            .intro-description {
                font-size: 1.3rem;
                opacity: 0.9;
                line-height: 1.6;
                max-width: 600px;
                margin: 0 auto;
            }
            
            .intro-features {
                display: flex;
                justify-content: center;
                gap: 40px;
                margin-bottom: 40px;
                animation: featuresReveal 1.5s ease-out 1s both;
            }
            
            .feature-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
                opacity: 0;
                animation: featureFadeIn 1s ease-out both;
            }
            
            .feature-item:nth-child(1) { animation-delay: 1.2s; }
            .feature-item:nth-child(2) { animation-delay: 1.4s; }
            .feature-item:nth-child(3) { animation-delay: 1.6s; }
            
            .feature-icon {
                font-size: 2.5rem;
                animation: featureBounce 2s ease-in-out infinite;
            }
            
            .feature-text {
                font-size: 1rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .intro-progress {
                margin-bottom: 30px;
                animation: progressReveal 1s ease-out 2s both;
            }
            
            .progress-bar {
                width: 300px;
                height: 4px;
                background: rgba(255,255,255,0.2);
                border-radius: 2px;
                overflow: hidden;
                margin: 0 auto 15px;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #ffd700, #ffed4e);
                width: 0%;
                transition: width 0.3s ease;
                border-radius: 2px;
            }
            
            .progress-text {
                font-size: 0.9rem;
                opacity: 0.8;
            }
            
            .intro-actions {
                animation: actionsReveal 1s ease-out 2.5s both;
            }
            
            .skip-button {
                background: rgba(255,255,255,0.1);
                border: 2px solid rgba(255,255,255,0.3);
                color: white;
                padding: 12px 24px;
                border-radius: 25px;
                cursor: pointer;
                font-size: 1rem;
                font-weight: 600;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 10px;
                opacity: 0;
                animation: skipButtonFadeIn 1s ease-out 3s both;
            }
            
            .skip-button:hover {
                background: rgba(255,255,255,0.2);
                border-color: rgba(255,255,255,0.5);
                transform: translateY(-2px);
            }
            
            .skip-icon {
                transition: transform 0.3s ease;
            }
            
            .skip-button:hover .skip-icon {
                transform: translateX(5px);
            }
            
            /* Animations */
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(50px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes logoReveal {
                from {
                    opacity: 0;
                    transform: scale(0.5) rotate(-180deg);
                }
                to {
                    opacity: 1;
                    transform: scale(1) rotate(0deg);
                }
            }
            
            @keyframes logoSpin {
                0%, 100% { transform: rotate(0deg); }
                50% { transform: rotate(180deg); }
            }
            
            @keyframes textReveal {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes titleSlideIn {
                from {
                    opacity: 0;
                    transform: translateX(-50px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes highlightPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            @keyframes featuresReveal {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes featureFadeIn {
                from {
                    opacity: 0;
                    transform: scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            
            @keyframes featureBounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            
            @keyframes progressReveal {
                from {
                    opacity: 0;
                    transform: scaleX(0);
                }
                to {
                    opacity: 1;
                    transform: scaleX(1);
                }
            }
            
            @keyframes actionsReveal {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes skipButtonFadeIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* Responsive Design */
            @media (max-width: 768px) {
                .intro-content {
                    padding: 20px;
                }
                
                .logo-container {
                    flex-direction: column;
                    gap: 15px;
                }
                
                .logo-main {
                    font-size: 2.5rem;
                }
                
                .intro-title {
                    font-size: 2.5rem;
                }
                
                .intro-features {
                    flex-direction: column;
                    gap: 20px;
                }
                
                .progress-bar {
                    width: 250px;
                }
            }
            
            @media (max-width: 480px) {
                .logo-main {
                    font-size: 2rem;
                }
                
                .intro-title {
                    font-size: 2rem;
                }
                
                .intro-description {
                    font-size: 1.1rem;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    setupEventListeners() {
        // Skip button
        this.animationElements.skipButton.addEventListener('click', () => {
            this.skipIntro();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' || event.key === ' ') {
                this.skipIntro();
            }
        });
        
        // Touch events for mobile
        document.addEventListener('touchstart', () => {
            if (this.animationState.isPlaying) {
                this.skipIntro();
            }
        });
    }
    
    startIntro() {
        console.log('🎨 Starting modern intro...');
        
        this.animationState.isPlaying = true;
        this.animationState.isComplete = false;
        
        // Start particle animation
        this.startParticleAnimation();
        
        // Start progress animation
        this.startProgressAnimation();
        
        // Start sound effects
        if (this.introConfig.soundEnabled) {
            this.playIntroSound();
        }
        
        // Auto-complete after duration
        setTimeout(() => {
            if (this.animationState.isPlaying) {
                this.completeIntro();
            }
        }, this.introConfig.duration);
    }
    
    startParticleAnimation() {
        const canvas = this.animationElements.particles;
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Create particles
        this.particles = [];
        for (let i = 0; i < this.introConfig.particleCount; i++) {
            this.particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
        
        // Animation loop
        const animate = () => {
            if (!this.animationState.isPlaying) return;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            this.particles.forEach(particle => {
                // Update position
                particle.x += particle.vx * this.introConfig.animationSpeed;
                particle.y += particle.vy * this.introConfig.animationSpeed;
                
                // Wrap around screen
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    startProgressAnimation() {
        let progress = 0;
        const progressStep = 100 / (this.introConfig.duration / 50); // Update every 50ms
        
        const updateProgress = () => {
            if (!this.animationState.isPlaying) return;
            
            progress += progressStep;
            if (progress > 100) progress = 100;
            
            this.animationElements.progressBar.style.width = progress + '%';
            this.animationState.progress = progress;
            
            if (progress < 100) {
                setTimeout(updateProgress, 50);
            } else {
                this.completeIntro();
            }
        };
        
        updateProgress();
    }
    
    playIntroSound() {
        // Create audio context for sound effects
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Play subtle intro sound
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.5);
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 1);
        } catch (error) {
            console.log('Sound not available:', error);
        }
    }
    
    skipIntro() {
        console.log('⏭️ Skipping intro...');
        this.completeIntro();
    }
    
    completeIntro() {
        if (this.animationState.isComplete) return;
        
        console.log('✅ Intro completed');
        
        this.animationState.isPlaying = false;
        this.animationState.isComplete = true;
        
        // Fade out animation
        const overlay = document.getElementById('modern-intro-overlay');
        overlay.style.transition = 'opacity 0.5s ease-out';
        overlay.style.opacity = '0';
        
        // Remove overlay after fade
        setTimeout(() => {
            overlay.remove();
            this.onIntroComplete();
        }, 500);
    }
    
    onIntroComplete() {
        // Trigger intro complete event
        const event = new CustomEvent('intro:complete', {
            detail: {
                duration: this.introConfig.duration,
                progress: this.animationState.progress
            }
        });
        
        document.dispatchEvent(event);
        
        console.log('🎉 Modern intro completed successfully');
    }
    
    // Public API
    getIntroState() {
        return {
            isPlaying: this.animationState.isPlaying,
            isComplete: this.animationState.isComplete,
            progress: this.animationState.progress,
            config: this.introConfig
        };
    }
    
    restartIntro() {
        // Remove existing overlay
        const existingOverlay = document.getElementById('modern-intro-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        // Reset state
        this.animationState.isPlaying = false;
        this.animationState.isComplete = false;
        this.animationState.progress = 0;
        
        // Restart
        this.createIntroHTML();
        this.setupEventListeners();
        this.startIntro();
    }
    
    updateConfig(newConfig) {
        this.introConfig = { ...this.introConfig, ...newConfig };
        console.log('⚙️ Intro config updated:', this.introConfig);
    }
}

// Initialize modern intro when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const modernIntro = new ModernIntro();
    
    // Export for external use
    window.modernIntro = modernIntro;
    
    console.log('✅ Modern Intro ready!');
});

console.log('✅ Modern Intro script loaded!');
