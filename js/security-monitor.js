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
            // Monitor for XSS attempts using MutationObserver instead of prototype override
            // Prototype override causes "Illegal invocation" error with getter/setter properties
            
            // Use MutationObserver to detect DOM changes that might be XSS attempts
            if (typeof MutationObserver !== 'undefined') {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'childList' || mutation.type === 'attributes') {
                            mutation.addedNodes.forEach((node) => {
                                if (node.nodeType === 1) { // Element node
                                    // Skip legitimate HTML elements that are safe
                                    const safeTags = ['LINK', 'META', 'STYLE', 'NOSCRIPT', 'TITLE'];
                                    const tagName = node.tagName || '';
                                    
                                    // Only check innerHTML/outerHTML if it's not a safe tag
                                    if (!safeTags.includes(tagName)) {
                                        const nodeContent = node.innerHTML || node.outerHTML || '';
                                        if (nodeContent && this.isXSSAttempt(nodeContent)) {
                                            // Additional check: ignore if it's from our own scripts
                                            const isFromOwnScript = node.getAttribute && (
                                                node.getAttribute('data-safe') === 'true' ||
                                                node.closest('[data-safe="true"]') !== null
                                            );
                                            
                                            if (!isFromOwnScript) {
                                                this.logSecurityEvent('xss_attempt', {
                                                    element: tagName || 'Unknown',
                                                    content: nodeContent.substring(0, 100),
                                                    url: window.location.href,
                                                    userAgent: navigator.userAgent
                                                });
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    });
                });
                
                // Delay observation significantly to avoid false positives from initial page load
                // Most legitimate content is added in first 2-3 seconds
                setTimeout(() => {
                    if (document.body || document.documentElement) {
                        observer.observe(document.body || document.documentElement, {
                            childList: true,
                            subtree: true,
                            attributes: true
                        });
                        console.log('🔒 XSS monitoring started (delayed to avoid false positives)');
                    }
                }, 3000); // Wait 3 seconds - only monitor for real-time DOM changes after page is stable
            }
        }
        
        isXSSAttempt(content) {
            // Skip empty or very short content (likely not XSS)
            if (!content || content.length < 10) {
                return false;
            }
            
            // More specific XSS patterns - exclude legitimate HTML
            const xssPatterns = [
                // Script injection attempts (must have closing tag)
                /<script[^>]*>[\s\S]*?<\/script>/is,
                // javascript: protocol (not in safe attributes)
                /javascript\s*:\s*[^"']*\w/i,
                // Event handler injection with suspicious content
                /on\w+\s*=\s*["'](?!\s*['"])\s*(?:javascript\s*:|eval\s*\(|alert\s*\()/i,
                // Iframe injection (except from trusted sources)
                /<iframe[^>]*src\s*=\s*["'](?!https?:\/\/(www\.)?(google|youtube|maps\.google))\w/i,
                // Object/Embed injection with data
                /<object[^>]*data\s*=\s*["'](?!https?:\/\/)/i,
                /<embed[^>]*src\s*=\s*["'](?!https?:\/\/)/i,
                // Dangerous form injection to external domains
                /<form[^>]*action\s*=\s*["'](?!\/|#|https?:\/\/dcteknik)/i,
                // Eval/Function injection
                /<[^>]*>\s*eval\s*\(/i,
                /<[^>]*>\s*Function\s*\(/i,
                // Data URI script injection
                /data\s*:\s*text\/(html|javascript)/i,
                // SVG with script
                /<svg[^>]*>[\s\S]*?<script/is
            ];
            
            // Exclude legitimate content patterns (expanded)
            const safePatterns = [
                /<link[^>]*rel\s*=\s*["'](stylesheet|icon|manifest|canonical|preload)/i,
                /<meta[^>]*(charset|name|property|http-equiv|content)/i,
                /<style[^>]*>[\s\S]*?<\/style>/i,
                /<noscript[\s\S]*?<\/noscript>/i,
                /<!--[\s\S]*?-->/i,
                /^[\s\w\.,!?\-:;()]+$/i, // Plain text only
                /<div[^>]*>[\s\w\.,!?\-:;()]+<\/div>/i, // Simple divs with text
                /<span[^>]*>[\s\w\.,!?\-:;()]+<\/span>/i, // Simple spans with text
                /<p[^>]*>[\s\w\.,!?\-:;()]+<\/p>/i, // Simple paragraphs
                /<h[1-6][^>]*>[\s\w\.,!?\-:;()]+<\/h[1-6]>/i // Simple headings
            ];
            
            // Check if content matches safe patterns first
            if (safePatterns.some(pattern => pattern.test(content))) {
                return false;
            }
            
            // Additional check: if content is mostly plain text, ignore
            const textContent = content.replace(/<[^>]+>/g, '').trim();
            if (textContent.length > content.length * 0.8 && /^[\s\w\.,!?\-:;()]+$/i.test(textContent)) {
                return false;
            }
            
            // Then check for XSS patterns
            return xssPatterns.some(pattern => pattern.test(content));
        }
        
        monitorCSRF() {
            // Monitor for CSRF attempts
            const originalFetch = window.fetch;
            const originalXMLHttpRequest = window.XMLHttpRequest;
            const self = this; // Store reference to SecurityMonitor instance
            
            window.fetch = function(url, options = {}) {
                // Convert to string if URL object
                const urlString = typeof url === 'string' ? url : url.url || url.toString();
                if (self.isCSRFAttempt(urlString, options || {})) {
                    self.logSecurityEvent('csrf_attempt', {
                        url: urlString,
                        method: (options && options.method) || 'GET',
                        headers: options && options.headers,
                        referrer: document.referrer
                    });
                }
                return originalFetch.apply(this, arguments);
            };
            
            window.XMLHttpRequest = function() {
                const xhr = new originalXMLHttpRequest();
                const originalOpen = xhr.open;
                
                xhr.open = function(method, url, async, user, password) {
                    if (self.isCSRFAttempt(url, { method: method })) {
                        self.logSecurityEvent('csrf_attempt', {
                            url: url,
                            method: method,
                            referrer: document.referrer
                        });
                    }
                    return originalOpen.apply(this, arguments);
                };
                
                return xhr;
            };
        }
        
        isCSRFAttempt(url, options) {
            // Check for suspicious cross-origin requests
            // Whitelist trusted domains (Google Analytics, EmailJS, etc.)
            const trustedDomains = [
                'google-analytics.com',
                'googletagmanager.com',
                'googleapis.com',
                'gstatic.com',
                'emailjs.com',
                'maps.googleapis.com',
                'cdnjs.cloudflare.com',
                'cdn.jsdelivr.net'
            ];
            
            if (url.startsWith('http') && !url.startsWith(window.location.origin)) {
                // Skip trusted domains
                if (trustedDomains.some(domain => url.includes(domain))) {
                    return false;
                }
                
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
            const self = this; // Store reference to SecurityMonitor instance
            
            Storage.prototype.setItem = function(key, value) {
                if (sensitiveKeys.some(sensitiveKey => key.toLowerCase().includes(sensitiveKey))) {
                    self.logSecurityEvent('sensitive_data_storage', {
                        key: key,
                        valueLength: value.length,
                        storage: this === localStorage ? 'localStorage' : 'sessionStorage'
                    });
                }
                // Call original method with correct context (this = Storage instance)
                return originalSetItem.call(this, key, value);
            };
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
            // Static sites don't have backend endpoints - only send to analytics
            // Don't send to /security-report (causes 404 errors)
            
            // Send to Google Analytics if available
            if (typeof gtag !== 'undefined') {
                try {
                    gtag('event', 'security_event', {
                        event_category: 'security',
                        event_label: event.type || 'unknown',
                        value: 1,
                        custom_map: event.data || {}
                    });
                } catch (err) {
                    // Silently fail - analytics not critical
                }
            }
            
            // Security events are logged locally only
            // No backend endpoint for static sites
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


