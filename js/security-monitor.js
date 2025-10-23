// Security Monitor - DC TEKNİK
(function() {
    'use strict';
    
    class SecurityMonitor {
        constructor() {
            this.securityEvents = [];
            this.vulnerabilities = [];
            this.init();
        }
        
        init() {
            this.monitorXSS();
            this.monitorCSRF();
            this.monitorClickjacking();
            this.monitorDataLeaks();
            this.monitorInsecureConnections();
            this.monitorMaliciousScripts();
            this.setupSecurityReporting();
        }
        
        monitorXSS() {
            // Monitor for XSS attempts
            const originalInnerHTML = Element.prototype.innerHTML;
            const originalOuterHTML = Element.prototype.outerHTML;
            
            Element.prototype.innerHTML = function(value) {
                if (value && this.isXSSAttempt(value)) {
                    this.logSecurityEvent('xss_attempt', {
                        element: this.tagName,
                        content: value.substring(0, 100),
                        url: window.location.href,
                        userAgent: navigator.userAgent
                    });
                }
                return originalInnerHTML.call(this, value);
            }.bind(this);
            
            Element.prototype.outerHTML = function(value) {
                if (value && this.isXSSAttempt(value)) {
                    this.logSecurityEvent('xss_attempt', {
                        element: this.tagName,
                        content: value.substring(0, 100),
                        url: window.location.href,
                        userAgent: navigator.userAgent
                    });
                }
                return originalOuterHTML.call(this, value);
            }.bind(this);
        }
        
        isXSSAttempt(content) {
            const xssPatterns = [
                /<script[^>]*>/i,
                /javascript:/i,
                /on\w+\s*=/i,
                /<iframe[^>]*>/i,
                /<object[^>]*>/i,
                /<embed[^>]*>/i,
                /<link[^>]*>/i,
                /<meta[^>]*>/i,
                /<style[^>]*>/i,
                /<form[^>]*>/i
            ];
            
            return xssPatterns.some(pattern => pattern.test(content));
        }
        
        monitorCSRF() {
            // Monitor for CSRF attempts
            const originalFetch = window.fetch;
            const originalXMLHttpRequest = window.XMLHttpRequest;
            
            window.fetch = function(url, options = {}) {
                if (this.isCSRFAttempt(url, options)) {
                    this.logSecurityEvent('csrf_attempt', {
                        url: url,
                        method: options.method || 'GET',
                        headers: options.headers,
                        referrer: document.referrer
                    });
                }
                return originalFetch.call(this, url, options);
            }.bind(this);
            
            window.XMLHttpRequest = function() {
                const xhr = new originalXMLHttpRequest();
                const originalOpen = xhr.open;
                const originalSend = xhr.send;
                
                xhr.open = function(method, url, async, user, password) {
                    if (this.isCSRFAttempt(url, { method: method })) {
                        this.logSecurityEvent('csrf_attempt', {
                            url: url,
                            method: method,
                            referrer: document.referrer
                        });
                    }
                    return originalOpen.call(this, method, url, async, user, password);
                }.bind(this);
                
                return xhr;
            }.bind(this);
        }
        
        isCSRFAttempt(url, options) {
            // Check for suspicious cross-origin requests
            if (url.startsWith('http') && !url.startsWith(window.location.origin)) {
                const method = options.method || 'GET';
                if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
                    return true;
                }
            }
            return false;
        }
        
        monitorClickjacking() {
            // Monitor for clickjacking attempts
            if (window.top !== window.self) {
                this.logSecurityEvent('clickjacking_attempt', {
                    url: window.location.href,
                    referrer: document.referrer,
                    userAgent: navigator.userAgent
                });
                
                // Prevent clickjacking
                if (window.top !== window.self) {
                    window.top.location = window.self.location;
                }
            }
        }
        
        monitorDataLeaks() {
            // Monitor for potential data leaks
            const sensitiveDataPatterns = [
                /password/i,
                /secret/i,
                /token/i,
                /key/i,
                /credit.?card/i,
                /ssn/i,
                /social.?security/i
            ];
            
            // Monitor console logs
            const originalConsoleLog = console.log;
            console.log = function(...args) {
                const message = args.join(' ');
                if (sensitiveDataPatterns.some(pattern => pattern.test(message))) {
                    this.logSecurityEvent('potential_data_leak', {
                        message: message.substring(0, 100),
                        url: window.location.href
                    });
                }
                return originalConsoleLog.apply(console, args);
            }.bind(this);
            
            // Monitor localStorage and sessionStorage
            this.monitorStorage();
        }
        
        monitorStorage() {
            const originalSetItem = Storage.prototype.setItem;
            const sensitiveKeys = ['password', 'secret', 'token', 'key', 'auth'];
            
            Storage.prototype.setItem = function(key, value) {
                if (sensitiveKeys.some(sensitiveKey => key.toLowerCase().includes(sensitiveKey))) {
                    this.logSecurityEvent('sensitive_data_storage', {
                        key: key,
                        valueLength: value.length,
                        storage: this === localStorage ? 'localStorage' : 'sessionStorage'
                    });
                }
                return originalSetItem.call(this, key, value);
            }.bind(this);
        }
        
        monitorInsecureConnections() {
            // Monitor for insecure connections
            if (location.protocol === 'http:' && location.hostname !== 'localhost') {
                this.logSecurityEvent('insecure_connection', {
                    protocol: location.protocol,
                    hostname: location.hostname,
                    url: window.location.href
                });
            }
            
            // Monitor for mixed content
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                if (img.src && img.src.startsWith('http:') && location.protocol === 'https:') {
                    this.logSecurityEvent('mixed_content', {
                        type: 'image',
                        url: img.src,
                        page: window.location.href
                    });
                }
            });
        }
        
        monitorMaliciousScripts() {
            // Monitor for malicious script injections
            const scripts = document.querySelectorAll('script');
            scripts.forEach(script => {
                if (script.src && !this.isTrustedScript(script.src)) {
                    this.logSecurityEvent('untrusted_script', {
                        src: script.src,
                        page: window.location.href
                    });
                }
            });
            
            // Monitor for eval usage
            const originalEval = window.eval;
            window.eval = function(code) {
                this.logSecurityEvent('eval_usage', {
                    code: code.substring(0, 100),
                    url: window.location.href
                });
                return originalEval.call(this, code);
            }.bind(this);
        }
        
        isTrustedScript(src) {
            const trustedDomains = [
                'dctenık.com',
                'googletagmanager.com',
                'google-analytics.com',
                'maps.googleapis.com',
                'cdnjs.cloudflare.com',
                'cdn.jsdelivr.net',
                'unpkg.com'
            ];
            
            return trustedDomains.some(domain => src.includes(domain));
        }
        
        setupSecurityReporting() {
            // Setup CSP violation reporting
            document.addEventListener('securitypolicyviolation', (e) => {
                this.logSecurityEvent('csp_violation', {
                    violatedDirective: e.violatedDirective,
                    blockedURI: e.blockedURI,
                    sourceFile: e.sourceFile,
                    lineNumber: e.lineNumber,
                    columnNumber: e.columnNumber
                });
            });
            
            // Setup error reporting
            window.addEventListener('error', (e) => {
                if (this.isSecurityError(e.error)) {
                    this.logSecurityEvent('security_error', {
                        message: e.message,
                        filename: e.filename,
                        lineno: e.lineno,
                        colno: e.colno,
                        error: e.error ? e.error.toString() : 'Unknown error'
                    });
                }
            });
        }
        
        isSecurityError(error) {
            const securityErrorPatterns = [
                /xss/i,
                /csrf/i,
                /clickjacking/i,
                /injection/i,
                /malware/i,
                /virus/i,
                /trojan/i
            ];
            
            const errorString = error ? error.toString() : '';
            return securityErrorPatterns.some(pattern => pattern.test(errorString));
        }
        
        logSecurityEvent(eventType, data) {
            const event = {
                type: eventType,
                timestamp: new Date().toISOString(),
                data: data,
                url: window.location.href,
                userAgent: navigator.userAgent,
                referrer: document.referrer
            };
            
            this.securityEvents.push(event);
            
            // Send to analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'security_event', {
                    event_category: 'security',
                    event_label: eventType,
                    custom_map: data
                });
            }
            
            // Send to security endpoint
            this.sendSecurityReport(event);
            
            console.warn('Security Event:', event);
        }
        
        sendSecurityReport(event) {
            // Send security report to monitoring endpoint
            if (navigator.sendBeacon) {
                const reportData = JSON.stringify(event);
                navigator.sendBeacon('/security-report', reportData);
            } else {
                // Fallback for older browsers
                fetch('/security-report', {
                    method: 'POST',
                    body: JSON.stringify(event),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).catch(err => console.warn('Failed to send security report:', err));
            }
        }
        
        // Public methods
        getSecurityEvents() {
            return this.securityEvents;
        }
        
        getSecuritySummary() {
            const summary = {
                totalEvents: this.securityEvents.length,
                eventTypes: {},
                recentEvents: this.securityEvents.slice(-10)
            };
            
            this.securityEvents.forEach(event => {
                summary.eventTypes[event.type] = (summary.eventTypes[event.type] || 0) + 1;
            });
            
            return summary;
        }
        
        clearSecurityEvents() {
            this.securityEvents = [];
        }
    }
    
    // Initialize security monitoring
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.securityMonitor = new SecurityMonitor();
        });
    } else {
        window.securityMonitor = new SecurityMonitor();
    }
})();

