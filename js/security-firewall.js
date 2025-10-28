/**
 * DC TEKNİK - Advanced Security Firewall System
 * Aktif saldırı tespit ve koruma sistemi
 */

// Security Firewall Configuration
const SecurityFirewall = {
    // Attack detection patterns
    patterns: {
        // SQL Injection patterns
        sqlInjection: [
            /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION)\b)/i,
            /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
            /('|(\\')|(;|--|\*|\/\*|\*\/)|(xp_|sp_)|(\b(EXEC|EXECUTE)\b))/i,
            /(\b(UNION|SELECT|FROM|WHERE)\b)/i
        ],
        
        // XSS patterns
        xss: [
            /<script[^>]*>.*?<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=\s*["']/gi,
            /<iframe[^>]*>.*?<\/iframe>/gi,
            /<object[^>]*>.*?<\/object>/gi,
            /<embed[^>]*>/gi,
            /<link[^>]*>/gi,
            /<meta[^>]*>/gi,
            /eval\s*\(/gi,
            /expression\s*\(/gi,
            /vbscript:/gi,
            /data:text\/html/gi
        ],
        
        // Command injection
        commandInjection: [
            /[;&|`$(){}[\]]/,
            /\b(cat|ls|pwd|id|whoami|uname|ps|kill|rm|mv|cp)\b/i,
            /\b(powershell|cmd|bash|sh)\b/i
        ],
        
        // Path traversal
        pathTraversal: [
            /\.\.\//g,
            /\.\.\\/g,
            /\/etc\/passwd/i,
            /\/(windows|winnt)\/system32/i
        ],
        
        // CSRF indicators
        csrf: [
            /<img[^>]*src\s*=\s*["'][^"']*csrf/i,
            /fetch\([^)]*csrf/i
        ],
        
        // DDoS patterns
        ddos: {
            maxRequestsPerMinute: 30,
            maxRequestsPerSecond: 10,
            suspiciousActivityThreshold: 50
        },
        
        // Bot patterns
        bot: [
            /bot|spider|crawler|scraper/i,
            /headless|phantom|puppeteer|selenium/i
        ]
    },
    
    // Attack history
    attackHistory: [],
    blockedIPs: new Map(),
    suspiciousActivity: new Map(),
    
    // Rate limiting
    rateLimiter: {
        requests: new Map(),
        
        check(identifier, maxRequests = 10, windowMs = 60000) {
            const now = Date.now();
            const key = identifier;
            
            if (!this.requests.has(key)) {
                this.requests.set(key, { 
                    count: 1, 
                    resetTime: now + windowMs,
                    firstRequest: now
                });
                return true;
            }
            
            const record = this.requests.get(key);
            
            // Reset if window expired
            if (now > record.resetTime) {
                record.count = 1;
                record.resetTime = now + windowMs;
                record.firstRequest = now;
                return true;
            }
            
            // Check if limit exceeded
            if (record.count >= maxRequests) {
                // Check if this is a DDoS attempt
                const requestRate = record.count / ((now - record.firstRequest) / 1000);
                if (requestRate > 5) { // More than 5 requests per second
                    SecurityFirewall.detectAttack('ddos', {
                        identifier: key,
                        rate: requestRate,
                        count: record.count
                    });
                }
                return false;
            }
            
            record.count++;
            return true;
        },
        
        reset(identifier) {
            this.requests.delete(identifier);
        }
    },
    
        // Detect attack patterns
    detectAttack(type, data) {
        const timestamp = new Date().toISOString();
        const identifier = data.identifier || this.getUserIdentifier();
        
        // Determine severity
        const severity = this.getAttackSeverity(type);
        
        // Log attack using SecurityLogger
        if (window.SecurityLogger) {
            window.SecurityLogger.log(`attack_${type}`, severity, {
                identifier: identifier,
                ...data
            });
        }
        
        // Log attack
        const attack = {
            type: type,
            timestamp: timestamp,
            identifier: identifier,
            data: data,
            severity: severity,
            userAgent: navigator.userAgent,
            url: window.location.href,
            referrer: document.referrer
        };
        
        this.attackHistory.push(attack);
        
        // Keep only last 100 attacks
        if (this.attackHistory.length > 100) {
            this.attackHistory.shift();
        }
        
        // Increment suspicious activity counter
        const currentCount = this.suspiciousActivity.get(identifier) || 0;
        this.suspiciousActivity.set(identifier, currentCount + 1);
        
        // Block if too many suspicious activities
        if (currentCount >= 5) {
            this.blockIP(identifier, 'multiple_attacks');
        }
        
        // Send to analytics
        this.reportAttack(attack);
        
        // Log to console in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.warn('🚨 Security Alert:', attack);
        }
        
        return attack;
    },
    
    // Get attack severity
    getAttackSeverity(type) {
        const severityMap = {
            'sql_injection': 'critical',
            'xss': 'critical',
            'command_injection': 'critical',
            'path_traversal': 'high',
            'csrf': 'high',
            'ddos': 'high',
            'rate_limit': 'medium',
            'bot_behavior': 'medium',
            'bot_detected': 'low'
        };
        return severityMap[type] || 'medium';
    },
    
    // Scan input for attack patterns
    scanInput(input, type = 'general') {
        if (!input || typeof input !== 'string') return { safe: true };
        
        const threats = [];
        
        // SQL Injection scan
        this.patterns.sqlInjection.forEach((pattern, index) => {
            if (pattern.test(input)) {
                threats.push({
                    type: 'sql_injection',
                    pattern: index,
                    severity: 'high'
                });
            }
        });
        
        // XSS scan
        this.patterns.xss.forEach((pattern, index) => {
            if (pattern.test(input)) {
                threats.push({
                    type: 'xss',
                    pattern: index,
                    severity: 'high'
                });
            }
        });
        
        // Command injection scan
        if (type === 'command' || type === 'general') {
            this.patterns.commandInjection.forEach((pattern, index) => {
                if (pattern.test(input)) {
                    threats.push({
                        type: 'command_injection',
                        pattern: index,
                        severity: 'critical'
                    });
                }
            });
        }
        
        // Path traversal scan
        if (type === 'path' || type === 'general') {
            this.patterns.pathTraversal.forEach((pattern, index) => {
                if (pattern.test(input)) {
                    threats.push({
                        type: 'path_traversal',
                        pattern: index,
                        severity: 'high'
                    });
                }
            });
        }
        
        return {
            safe: threats.length === 0,
            threats: threats,
            blocked: threats.length > 0
        };
    },
    
    // Block IP/identifier
    blockIP(identifier, reason) {
        this.blockedIPs.set(identifier, {
            timestamp: Date.now(),
            reason: reason,
            duration: 3600000 // 1 hour
        });
        
        // Store in sessionStorage
        try {
            const blocked = Array.from(this.blockedIPs.entries()).map(([id, data]) => ({
                identifier: id,
                ...data
            }));
            sessionStorage.setItem('security_blocked', JSON.stringify(blocked));
        } catch (e) {
            console.error('Failed to store blocked IPs:', e);
        }
        
        console.warn('🚫 Blocked:', identifier, 'Reason:', reason);
    },
    
    // Check if blocked
    isBlocked(identifier) {
        const blockData = this.blockedIPs.get(identifier);
        if (!blockData) return false;
        
        // Check if block expired
        if (Date.now() - blockData.timestamp > blockData.duration) {
            this.blockedIPs.delete(identifier);
            return false;
        }
        
        return true;
    },
    
    // Get user identifier
    getUserIdentifier() {
        // Try to get from sessionStorage
        let identifier = sessionStorage.getItem('security_identifier');
        
        if (!identifier) {
            // Generate identifier based on available data
            const parts = [
                navigator.userAgent,
                navigator.language,
                screen.width + 'x' + screen.height,
                new Date().getTimezoneOffset()
            ];
            
            // Create hash-like identifier
            identifier = btoa(parts.join('|')).substring(0, 32);
            sessionStorage.setItem('security_identifier', identifier);
        }
        
        return identifier;
    },
    
    // Report attack to analytics
    reportAttack(attack) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'security_attack_detected', {
                'event_category': 'security',
                'event_label': attack.type,
                'value': 1,
                'custom_parameter_1': attack.identifier,
                'custom_parameter_2': attack.userAgent,
                'non_interaction': true
            });
        }
        
        // Send to server if endpoint exists (optional)
        // this.sendToServer(attack);
    },
    
    // Monitor all form submissions
    monitorForms() {
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (!form || form.tagName !== 'FORM') return;
            
            const identifier = this.getUserIdentifier();
            
            // Check if blocked
            if (this.isBlocked(identifier)) {
                e.preventDefault();
                alert('Güvenlik nedeniyle istek engellendi. Lütfen daha sonra tekrar deneyin.');
                return false;
            }
            
            // Rate limiting
            if (!this.rateLimiter.check(identifier, 5, 60000)) {
                e.preventDefault();
                this.detectAttack('rate_limit', { identifier });
                alert('Çok fazla istek gönderdiniz. Lütfen bekleyin.');
                return false;
            }
            
            // Scan form data
            const formData = new FormData(form);
            let hasThreat = false;
            
            for (const [key, value] of formData.entries()) {
                if (key === 'csrf_token' || key === 'password') continue;
                
                const scanResult = this.scanInput(String(value), 'general');
                if (!scanResult.safe) {
                    hasThreat = true;
                    this.detectAttack(scanResult.threats[0].type, {
                        identifier,
                        field: key,
                        value: String(value).substring(0, 100) // Limit logged value
                    });
                }
            }
            
            if (hasThreat) {
                e.preventDefault();
                alert('Güvenlik nedeniyle form gönderilemedi. Lütfen geçerli bilgiler girin.');
                return false;
            }
        }, true);
    },
    
    // Monitor URL parameters
    monitorURL() {
        const urlParams = new URLSearchParams(window.location.search);
        let hasThreat = false;
        
        for (const [key, value] of urlParams.entries()) {
            const scanResult = this.scanInput(value, 'general');
            if (!scanResult.safe) {
                hasThreat = true;
                this.detectAttack(scanResult.threats[0].type, {
                    identifier: this.getUserIdentifier(),
                    source: 'url_param',
                    param: key,
                    value: value.substring(0, 100)
                });
            }
        }
        
        if (hasThreat) {
            // Redirect to clean URL
            const cleanURL = window.location.pathname;
            window.history.replaceState({}, '', cleanURL);
        }
    },
    
    // Monitor fetch requests
    monitorFetch() {
        const originalFetch = window.fetch;
        
        window.fetch = async function(...args) {
            const url = args[0];
            
            // Check if blocked
            const identifier = SecurityFirewall.getUserIdentifier();
            if (SecurityFirewall.isBlocked(identifier)) {
                throw new Error('Request blocked by security firewall');
            }
            
            // Scan URL
            const scanResult = SecurityFirewall.scanInput(String(url), 'path');
            if (!scanResult.safe) {
                SecurityFirewall.detectAttack(scanResult.threats[0].type, {
                    identifier,
                    source: 'fetch',
                    url: String(url).substring(0, 200)
                });
                throw new Error('Security threat detected in request');
            }
            
            // Rate limiting for API calls
            if (!SecurityFirewall.rateLimiter.check(identifier, 20, 60000)) {
                SecurityFirewall.detectAttack('rate_limit', { identifier, source: 'fetch' });
                throw new Error('Rate limit exceeded');
            }
            
            return originalFetch.apply(this, args);
        };
    },
    
    // Initialize security firewall
    init() {
        console.log('🛡️ Security Firewall initializing...');
        
        // Check if blocked
        const identifier = this.getUserIdentifier();
        if (this.isBlocked(identifier)) {
            document.body.innerHTML = '<h1>Access Denied</h1><p>Güvenlik nedeniyle erişim engellendi.</p>';
            return;
        }
        
        // Monitor forms
        this.monitorForms();
        
        // Monitor URL
        this.monitorURL();
        
        // Monitor fetch
        this.monitorFetch();
        
        // Monitor user behavior
        this.monitorBehavior();
        
        // Honeypot fields
        this.initHoneypots();
        
        console.log('✅ Security Firewall active');
    },
    
    // Monitor suspicious behavior
    monitorBehavior() {
        let clickCount = 0;
        let lastClickTime = Date.now();
        
        document.addEventListener('click', (e) => {
            const now = Date.now();
            clickCount++;
            
            // Detect rapid clicking (bot behavior)
            if (now - lastClickTime < 50 && clickCount > 10) {
                this.detectAttack('bot_behavior', {
                    identifier: this.getUserIdentifier(),
                    type: 'rapid_clicking',
                    count: clickCount
                });
            }
            
            if (now - lastClickTime > 1000) {
                clickCount = 0;
            }
            
            lastClickTime = now;
        });
        
        // Monitor keyboard events
        let keyPressCount = 0;
        let lastKeyPressTime = Date.now();
        
        document.addEventListener('keypress', (e) => {
            const now = Date.now();
            keyPressCount++;
            
            // Detect rapid typing (bot behavior)
            if (now - lastKeyPressTime < 20 && keyPressCount > 50) {
                this.detectAttack('bot_behavior', {
                    identifier: this.getUserIdentifier(),
                    type: 'rapid_typing',
                    count: keyPressCount
                });
            }
            
            if (now - lastKeyPressTime > 1000) {
                keyPressCount = 0;
            }
            
            lastKeyPressTime = now;
        });
    },
    
    // Initialize honeypot fields
    initHoneypots() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach((form, index) => {
            // Create hidden honeypot field
            const honeypot = document.createElement('input');
            honeypot.type = 'text';
            honeypot.name = `website_${index}`;
            honeypot.style.cssText = 'position:absolute;left:-9999px;opacity:0;';
            honeypot.tabIndex = -1;
            honeypot.setAttribute('autocomplete', 'off');
            
            form.appendChild(honeypot);
            
            // Check honeypot on submit
            form.addEventListener('submit', (e) => {
                if (honeypot.value !== '') {
                    e.preventDefault();
                    this.detectAttack('bot_detected', {
                        identifier: this.getUserIdentifier(),
                        type: 'honeypot',
                        form: form.id || 'unknown'
                    });
                    return false;
                }
            }, true);
        });
    },
    
    // Get security report
    getReport() {
        return {
            attacks: this.attackHistory.length,
            blocked: this.blockedIPs.size,
            suspicious: this.suspiciousActivity.size,
            recentAttacks: this.attackHistory.slice(-10)
        };
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SecurityFirewall.init());
} else {
    SecurityFirewall.init();
}

// Export for global access
window.SecurityFirewall = SecurityFirewall;

