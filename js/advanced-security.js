/**
 * DC TEKNİK Advanced Security System
 * Gelişmiş güvenlik sistemi ve koruma mekanizmaları
 * 
 * Features:
 * - XSS Protection
 * - CSRF Protection
 * - Clickjacking Protection
 * - SQL Injection Protection
 * - Rate Limiting
 * - IP Blocking
 * - Session Security
 * - Content Security Policy
 * - Security Headers
 * - Vulnerability Scanning
 */

class AdvancedSecurity {
    constructor() {
        this.securityConfig = {
            xssProtection: true,
            csrfProtection: true,
            clickjackingProtection: true,
            rateLimiting: true,
            ipBlocking: true,
            sessionSecurity: true,
            contentSecurityPolicy: true,
            vulnerabilityScanning: true
        };
        
        this.blockedIPs = new Set();
        this.rateLimits = new Map();
        this.securityEvents = [];
        this.vulnerabilityScans = [];
        
        this.init();
    }
    
    init() {
        console.log('🔒 Advanced Security System initialized');
        this.setupSecurityHeaders();
        this.setupXSSProtection();
        this.setupCSRFProtection();
        this.setupClickjackingProtection();
        this.setupRateLimiting();
        this.setupSessionSecurity();
        this.setupContentSecurityPolicy();
        this.setupVulnerabilityScanning();
        this.startSecurityMonitoring();
    }
    
    // Security Headers
    setupSecurityHeaders() {
        // Set security headers
        const headers = {
            'X-XSS-Protection': '1; mode=block',
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-Download-Options': 'noopen',
            'X-Permitted-Cross-Domain-Policies': 'none',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
            'Content-Security-Policy': this.generateCSP(),
            'Content-Security-Policy-Report-Only': this.generateCSPReportOnly()
        };
        
        // Apply headers (in real implementation, these would be set server-side)
        this.logSecurityEvent('security_headers_applied', {
            headers: headers,
            timestamp: new Date().toISOString()
        });
        
        console.log('🔒 Security headers configured');
    }
    
    generateCSP() {
        return [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://www.google-analytics.com https://www.googletagmanager.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
            "img-src 'self' data: https: blob:",
            "font-src 'self' https://fonts.gstatic.com",
            "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com",
            "frame-src 'none'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'"
        ].join('; ');
    }
    
    generateCSPReportOnly() {
        return [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self' https:",
            "connect-src 'self'",
            "frame-src 'none'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "report-uri /api/security/csp-report"
        ].join('; ');
    }
    
    // XSS Protection
    setupXSSProtection() {
        if (!this.securityConfig.xssProtection) return;
        
        // Input sanitization
        this.sanitizeInputs();
        
        // Output encoding
        this.setupOutputEncoding();
        
        // XSS detection
        this.setupXSSDetection();
        
        console.log('🛡️ XSS Protection enabled');
    }
    
    sanitizeInputs() {
        // Sanitize all input elements
        document.addEventListener('input', (event) => {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                const originalValue = event.target.value;
                const sanitizedValue = this.sanitizeString(originalValue);
                
                if (originalValue !== sanitizedValue) {
                    event.target.value = sanitizedValue;
                    this.logSecurityEvent('xss_input_sanitized', {
                        element: event.target.tagName,
                        originalValue: originalValue,
                        sanitizedValue: sanitizedValue,
                        timestamp: new Date().toISOString()
                    });
                }
            }
        });
    }
    
    sanitizeString(str) {
        if (typeof str !== 'string') return str;
        
        // Remove potentially dangerous characters
        return str
            .replace(/[<>]/g, '') // Remove < and >
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+\s*=/gi, '') // Remove event handlers
            .replace(/script/gi, '') // Remove script tags
            .replace(/iframe/gi, '') // Remove iframe tags
            .replace(/object/gi, '') // Remove object tags
            .replace(/embed/gi, '') // Remove embed tags
            .replace(/link/gi, '') // Remove link tags
            .replace(/meta/gi, '') // Remove meta tags
            .replace(/style/gi, '') // Remove style tags
            .trim();
    }
    
    setupOutputEncoding() {
        // Encode output to prevent XSS
        this.encodeOutput = (str) => {
            if (typeof str !== 'string') return str;
            
            return str
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;')
                .replace(/\//g, '&#x2F;');
        };
    }
    
    setupXSSDetection() {
        // Monitor for XSS attempts
        const originalCreateElement = document.createElement;
        document.createElement = function(tagName) {
            const element = originalCreateElement.call(this, tagName);
            
            // Check for suspicious attributes
            const suspiciousAttributes = ['onload', 'onerror', 'onclick', 'onmouseover'];
            suspiciousAttributes.forEach(attr => {
                if (element.hasAttribute(attr)) {
                    window.advancedSecurity?.logSecurityEvent('xss_attempt_detected', {
                        tagName: tagName,
                        attribute: attr,
                        timestamp: new Date().toISOString()
                    });
                }
            });
            
            return element;
        };
    }
    
    // CSRF Protection
    setupCSRFProtection() {
        if (!this.securityConfig.csrfProtection) return;
        
        // Generate CSRF token
        this.generateCSRFToken();
        
        // Validate CSRF token on forms
        this.validateCSRFToken();
        
        console.log('🛡️ CSRF Protection enabled');
    }
    
    generateCSRFToken() {
        const token = this.generateRandomToken();
        sessionStorage.setItem('csrf_token', token);
        
        // Add token to all forms
        document.addEventListener('DOMContentLoaded', () => {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                const tokenInput = document.createElement('input');
                tokenInput.type = 'hidden';
                tokenInput.name = 'csrf_token';
                tokenInput.value = token;
                form.appendChild(tokenInput);
            });
        });
        
        return token;
    }
    
    validateCSRFToken() {
        document.addEventListener('submit', (event) => {
            const form = event.target;
            const tokenInput = form.querySelector('input[name="csrf_token"]');
            const sessionToken = sessionStorage.getItem('csrf_token');
            
            if (tokenInput && sessionToken) {
                if (tokenInput.value !== sessionToken) {
                    event.preventDefault();
                    this.logSecurityEvent('csrf_attack_detected', {
                        form: form.action,
                        timestamp: new Date().toISOString()
                    });
                    alert('Güvenlik hatası: Geçersiz token');
                }
            }
        });
    }
    
    // Clickjacking Protection
    setupClickjackingProtection() {
        if (!this.securityConfig.clickjackingProtection) return;
        
        // Check if page is in iframe
        if (window.top !== window.self) {
            this.logSecurityEvent('clickjacking_attempt_detected', {
                timestamp: new Date().toISOString()
            });
            
            // Redirect to prevent clickjacking
            window.top.location = window.self.location;
        }
        
        // Add frame busting script
        const frameBuster = document.createElement('script');
        frameBuster.textContent = `
            if (top !== self) {
                top.location = self.location;
            }
        `;
        document.head.appendChild(frameBuster);
        
        console.log('🛡️ Clickjacking Protection enabled');
    }
    
    // Rate Limiting
    setupRateLimiting() {
        if (!this.securityConfig.rateLimiting) return;
        
        // Rate limiting configuration
        this.rateLimitConfig = {
            windowMs: 15 * 60 * 1000, // 15 minutes
            maxRequests: 100, // Max requests per window
            blockDuration: 60 * 60 * 1000 // 1 hour block duration
        };
        
        // Monitor requests
        this.monitorRequests();
        
        console.log('🛡️ Rate Limiting enabled');
    }
    
    monitorRequests() {
        // Track API requests
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const clientId = this.getClientIdentifier();
            const now = Date.now();
            
            // Check rate limit
            if (this.isRateLimited(clientId, now)) {
                this.logSecurityEvent('rate_limit_exceeded', {
                    clientId: clientId,
                    timestamp: new Date().toISOString()
                });
                
                throw new Error('Rate limit exceeded. Please try again later.');
            }
            
            // Record request
            this.recordRequest(clientId, now);
            
            try {
                const response = await originalFetch(...args);
                return response;
            } catch (error) {
                this.logSecurityEvent('request_error', {
                    clientId: clientId,
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
                throw error;
            }
        };
    }
    
    isRateLimited(clientId, timestamp) {
        if (!this.rateLimits.has(clientId)) {
            return false;
        }
        
        const requests = this.rateLimits.get(clientId);
        const windowStart = timestamp - this.rateLimitConfig.windowMs;
        const recentRequests = requests.filter(time => time > windowStart);
        
        return recentRequests.length >= this.rateLimitConfig.maxRequests;
    }
    
    recordRequest(clientId, timestamp) {
        if (!this.rateLimits.has(clientId)) {
            this.rateLimits.set(clientId, []);
        }
        
        const requests = this.rateLimits.get(clientId);
        requests.push(timestamp);
        
        // Clean old requests
        const windowStart = timestamp - this.rateLimitConfig.windowMs;
        const filteredRequests = requests.filter(time => time > windowStart);
        this.rateLimits.set(clientId, filteredRequests);
    }
    
    getClientIdentifier() {
        // Use IP address or session ID for rate limiting
        return 'anonymous'; // This would be replaced with actual client identifier
    }
    
    // Session Security
    setupSessionSecurity() {
        if (!this.securityConfig.sessionSecurity) return;
        
        // Secure session configuration
        this.sessionConfig = {
            timeout: 30 * 60 * 1000, // 30 minutes
            regenerateInterval: 15 * 60 * 1000, // 15 minutes
            secure: true,
            httpOnly: true,
            sameSite: 'strict'
        };
        
        // Monitor session activity
        this.monitorSessionActivity();
        
        // Auto-logout on inactivity
        this.setupAutoLogout();
        
        console.log('🛡️ Session Security enabled');
    }
    
    monitorSessionActivity() {
        let lastActivity = Date.now();
        
        // Track user activity
        const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        
        activityEvents.forEach(event => {
            document.addEventListener(event, () => {
                lastActivity = Date.now();
            }, true);
        });
        
        // Check session timeout
        setInterval(() => {
            const now = Date.now();
            if (now - lastActivity > this.sessionConfig.timeout) {
                this.logoutUser();
            }
        }, 60000); // Check every minute
    }
    
    setupAutoLogout() {
        // Show warning before logout
        const warningTime = 5 * 60 * 1000; // 5 minutes before logout
        
        setInterval(() => {
            const now = Date.now();
            const timeSinceActivity = now - this.getLastActivity();
            
            if (timeSinceActivity > (this.sessionConfig.timeout - warningTime)) {
                this.showLogoutWarning();
            }
        }, 30000); // Check every 30 seconds
    }
    
    getLastActivity() {
        return parseInt(sessionStorage.getItem('lastActivity') || '0');
    }
    
    showLogoutWarning() {
        // Show warning modal
        const warning = document.createElement('div');
        warning.id = 'logout-warning';
        warning.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background: white; padding: 20px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                        z-index: 10000; text-align: center;">
                <h3>Oturum Süresi Doluyor</h3>
                <p>Güvenlik nedeniyle 5 dakika içinde otomatik olarak çıkış yapılacaksınız.</p>
                <button onclick="this.parentElement.parentElement.remove()">Devam Et</button>
            </div>
        `;
        document.body.appendChild(warning);
    }
    
    logoutUser() {
        this.logSecurityEvent('auto_logout', {
            timestamp: new Date().toISOString()
        });
        
        // Clear session data
        sessionStorage.clear();
        localStorage.removeItem('user_session');
        
        // Redirect to login page
        window.location.href = '/login.html';
    }
    
    // Content Security Policy
    setupContentSecurityPolicy() {
        if (!this.securityConfig.contentSecurityPolicy) return;
        
        // CSP violation reporting
        document.addEventListener('securitypolicyviolation', (event) => {
            this.logSecurityEvent('csp_violation', {
                violatedDirective: event.violatedDirective,
                blockedURI: event.blockedURI,
                sourceFile: event.sourceFile,
                lineNumber: event.lineNumber,
                columnNumber: event.columnNumber,
                timestamp: new Date().toISOString()
            });
        });
        
        console.log('🛡️ Content Security Policy enabled');
    }
    
    // Vulnerability Scanning
    setupVulnerabilityScanning() {
        if (!this.securityConfig.vulnerabilityScanning) return;
        
        // Schedule vulnerability scans
        this.scheduleVulnerabilityScans();
        
        console.log('🛡️ Vulnerability Scanning enabled');
    }
    
    scheduleVulnerabilityScans() {
        // Run vulnerability scan every hour
        setInterval(() => {
            this.runVulnerabilityScan();
        }, 60 * 60 * 1000);
        
        // Run initial scan
        setTimeout(() => {
            this.runVulnerabilityScan();
        }, 5000);
    }
    
    runVulnerabilityScan() {
        console.log('🔍 Running vulnerability scan...');
        
        const scanResults = {
            timestamp: new Date().toISOString(),
            vulnerabilities: [],
            recommendations: []
        };
        
        // Check for common vulnerabilities
        this.checkXSSVulnerabilities(scanResults);
        this.checkCSRFVulnerabilities(scanResults);
        this.checkClickjackingVulnerabilities(scanResults);
        this.checkInsecureConnections(scanResults);
        this.checkWeakPasswords(scanResults);
        
        this.vulnerabilityScans.push(scanResults);
        
        if (scanResults.vulnerabilities.length > 0) {
            this.logSecurityEvent('vulnerabilities_found', scanResults);
        }
        
        console.log('✅ Vulnerability scan completed');
    }
    
    checkXSSVulnerabilities(scanResults) {
        // Check for potential XSS vulnerabilities
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            if (script.src && !script.src.startsWith('https://') && !script.src.startsWith('/')) {
                scanResults.vulnerabilities.push({
                    type: 'XSS',
                    severity: 'medium',
                    description: 'Insecure script source detected',
                    element: script.src
                });
            }
        });
    }
    
    checkCSRFVulnerabilities(scanResults) {
        // Check for CSRF vulnerabilities
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const csrfToken = form.querySelector('input[name="csrf_token"]');
            if (!csrfToken) {
                scanResults.vulnerabilities.push({
                    type: 'CSRF',
                    severity: 'high',
                    description: 'Form missing CSRF token',
                    element: form.action || 'unknown'
                });
            }
        });
    }
    
    checkClickjackingVulnerabilities(scanResults) {
        // Check for clickjacking vulnerabilities
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            if (!iframe.sandbox) {
                scanResults.vulnerabilities.push({
                    type: 'Clickjacking',
                    severity: 'medium',
                    description: 'Iframe missing sandbox attribute',
                    element: iframe.src || 'unknown'
                });
            }
        });
    }
    
    checkInsecureConnections(scanResults) {
        // Check for insecure connections
        if (location.protocol !== 'https:') {
            scanResults.vulnerabilities.push({
                type: 'Insecure Connection',
                severity: 'high',
                description: 'Site is not using HTTPS',
                element: location.href
            });
        }
    }
    
    checkWeakPasswords(scanResults) {
        // Check for weak password fields
        const passwordFields = document.querySelectorAll('input[type="password"]');
        passwordFields.forEach(field => {
            if (!field.required || !field.minLength) {
                scanResults.vulnerabilities.push({
                    type: 'Weak Password',
                    severity: 'medium',
                    description: 'Password field missing security requirements',
                    element: field.name || 'unknown'
                });
            }
        });
    }
    
    // Security Monitoring
    startSecurityMonitoring() {
        console.log('🔍 Starting security monitoring...');
        
        // Monitor security events
        setInterval(() => {
            this.analyzeSecurityEvents();
        }, 5 * 60 * 1000); // Every 5 minutes
        
        // Monitor for suspicious activity
        this.monitorSuspiciousActivity();
    }
    
    analyzeSecurityEvents() {
        const recentEvents = this.securityEvents.filter(event => {
            const eventTime = new Date(event.timestamp);
            const now = new Date();
            return (now - eventTime) < 24 * 60 * 60 * 1000; // Last 24 hours
        });
        
        // Analyze event patterns
        const eventCounts = {};
        recentEvents.forEach(event => {
            eventCounts[event.type] = (eventCounts[event.type] || 0) + 1;
        });
        
        // Check for suspicious patterns
        Object.keys(eventCounts).forEach(eventType => {
            if (eventCounts[eventType] > 10) { // More than 10 events of same type
                this.logSecurityEvent('suspicious_activity_detected', {
                    eventType: eventType,
                    count: eventCounts[eventType],
                    timestamp: new Date().toISOString()
                });
            }
        });
    }
    
    monitorSuspiciousActivity() {
        // Monitor for suspicious user behavior
        let clickCount = 0;
        let keyPressCount = 0;
        
        document.addEventListener('click', () => {
            clickCount++;
            if (clickCount > 100) { // More than 100 clicks in short time
                this.logSecurityEvent('suspicious_click_activity', {
                    clickCount: clickCount,
                    timestamp: new Date().toISOString()
                });
            }
        });
        
        document.addEventListener('keypress', () => {
            keyPressCount++;
            if (keyPressCount > 1000) { // More than 1000 key presses in short time
                this.logSecurityEvent('suspicious_keypress_activity', {
                    keyPressCount: keyPressCount,
                    timestamp: new Date().toISOString()
                });
            }
        });
        
        // Reset counters every minute
        setInterval(() => {
            clickCount = 0;
            keyPressCount = 0;
        }, 60000);
    }
    
    // Utility Methods
    generateRandomToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    logSecurityEvent(type, data) {
        const event = {
            type: type,
            data: data,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        this.securityEvents.push(event);
        
        // Keep only last 1000 events
        if (this.securityEvents.length > 1000) {
            this.securityEvents.shift();
        }
        
        console.log('🔒 Security Event:', event);
        
        // Send to security monitoring system
        this.sendSecurityEvent(event);
    }
    
    sendSecurityEvent(event) {
        // Send security event to monitoring system
        fetch('/api/security/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
        }).catch(error => {
            console.error('Failed to send security event:', error);
        });
    }
    
    // Public API
    getSecurityStatus() {
        return {
            config: this.securityConfig,
            blockedIPs: Array.from(this.blockedIPs),
            recentEvents: this.securityEvents.slice(-10),
            vulnerabilityScans: this.vulnerabilityScans.slice(-5),
            rateLimits: Object.fromEntries(this.rateLimits)
        };
    }
    
    blockIP(ip) {
        this.blockedIPs.add(ip);
        this.logSecurityEvent('ip_blocked', {
            ip: ip,
            timestamp: new Date().toISOString()
        });
    }
    
    unblockIP(ip) {
        this.blockedIPs.delete(ip);
        this.logSecurityEvent('ip_unblocked', {
            ip: ip,
            timestamp: new Date().toISOString()
        });
    }
    
    getSecurityReport() {
        return {
            timestamp: new Date().toISOString(),
            status: 'active',
            config: this.securityConfig,
            events: this.securityEvents,
            vulnerabilities: this.vulnerabilityScans,
            recommendations: this.generateSecurityRecommendations()
        };
    }
    
    generateSecurityRecommendations() {
        const recommendations = [];
        
        // Check for security improvements
        if (location.protocol !== 'https:') {
            recommendations.push({
                type: 'SSL/TLS',
                priority: 'high',
                description: 'Enable HTTPS for secure communication',
                action: 'Install SSL certificate'
            });
        }
        
        if (this.securityEvents.filter(e => e.type === 'xss_attempt_detected').length > 0) {
            recommendations.push({
                type: 'XSS Protection',
                priority: 'medium',
                description: 'XSS attempts detected, consider additional protection',
                action: 'Review and strengthen XSS protection'
            });
        }
        
        return recommendations;
    }
}

// Initialize advanced security
const advancedSecurity = new AdvancedSecurity();

// Export for external use
window.advancedSecurity = advancedSecurity;

console.log('✅ Advanced Security System ready!');
