/**
 * DC TEKNİK - Security Event Logger
 * Güvenlik olaylarını kaydetme ve raporlama sistemi
 */

const SecurityLogger = {
    logs: [],
    maxLogs: 1000,
    enabled: true,
    
    // Log security event
    log(type, severity, data = {}) {
        if (!this.enabled) return;
        
        const logEntry = {
            id: this.generateId(),
            type: type,
            severity: severity, // 'low', 'medium', 'high', 'critical'
            timestamp: new Date().toISOString(),
            data: data,
            url: window.location.href,
            userAgent: navigator.userAgent,
            referrer: document.referrer
        };
        
        this.logs.push(logEntry);
        
        // Keep only last N logs
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
        
        // Store in sessionStorage for persistence
        try {
            const recentLogs = this.logs.slice(-100); // Store last 100
            sessionStorage.setItem('security_logs', JSON.stringify(recentLogs));
        } catch (e) {
            console.error('Failed to store security logs:', e);
        }
        
        // Send to analytics
        this.sendToAnalytics(logEntry);
        
        // Console output based on severity
        const emoji = this.getSeverityEmoji(severity);
        const message = `${emoji} [${severity.toUpperCase()}] ${type}`;
        
        if (severity === 'critical' || severity === 'high') {
            console.error(message, logEntry);
        } else if (severity === 'medium') {
            console.warn(message, logEntry);
        } else {
            console.log(message, logEntry);
        }
        
        return logEntry;
    },
    
    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    },
    
    // Get severity emoji
    getSeverityEmoji(severity) {
        const emojis = {
            'low': 'ℹ️',
            'medium': '⚠️',
            'high': '🔴',
            'critical': '🚨'
        };
        return emojis[severity] || '⚪';
    },
    
    // Send to Google Analytics
    sendToAnalytics(logEntry) {
        if (typeof gtag === 'undefined') return;
        
        gtag('event', 'security_event', {
            'event_category': 'security',
            'event_label': logEntry.type,
            'value': this.getSeverityValue(logEntry.severity),
            'custom_parameter_1': logEntry.severity,
            'custom_parameter_2': logEntry.url,
            'non_interaction': true
        });
    },
    
    // Get severity numeric value
    getSeverityValue(severity) {
        const values = {
            'low': 1,
            'medium': 2,
            'high': 3,
            'critical': 4
        };
        return values[severity] || 0;
    },
    
    // Get logs by type
    getLogsByType(type) {
        return this.logs.filter(log => log.type === type);
    },
    
    // Get logs by severity
    getLogsBySeverity(severity) {
        return this.logs.filter(log => log.severity === severity);
    },
    
    // Get recent logs
    getRecentLogs(limit = 10) {
        return this.logs.slice(-limit).reverse();
    },
    
    // Get security summary
    getSummary() {
        const summary = {
            total: this.logs.length,
            byType: {},
            bySeverity: {
                low: 0,
                medium: 0,
                high: 0,
                critical: 0
            },
            recent: this.getRecentLogs(10),
            last24Hours: this.getLogsLast24Hours()
        };
        
        this.logs.forEach(log => {
            summary.byType[log.type] = (summary.byType[log.type] || 0) + 1;
            summary.bySeverity[log.severity] = (summary.bySeverity[log.severity] || 0) + 1;
        });
        
        return summary;
    },
    
    // Get logs from last 24 hours
    getLogsLast24Hours() {
        const now = Date.now();
        const oneDayAgo = now - (24 * 60 * 60 * 1000);
        
        return this.logs.filter(log => {
            const logTime = new Date(log.timestamp).getTime();
            return logTime > oneDayAgo;
        });
    },
    
    // Clear logs
    clear() {
        this.logs = [];
        try {
            sessionStorage.removeItem('security_logs');
        } catch (e) {
            console.error('Failed to clear security logs:', e);
        }
    },
    
    // Export logs
    export(format = 'json') {
        if (format === 'json') {
            return JSON.stringify(this.logs, null, 2);
        } else if (format === 'csv') {
            return this.toCSV();
        }
        return this.logs;
    },
    
    // Convert to CSV
    toCSV() {
        if (this.logs.length === 0) return '';
        
        const headers = ['ID', 'Type', 'Severity', 'Timestamp', 'URL', 'User Agent'];
        const rows = this.logs.map(log => [
            log.id,
            log.type,
            log.severity,
            log.timestamp,
            log.url,
            log.userAgent
        ]);
        
        const csv = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
        return csv;
    }
};

// Initialize logger
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Load persisted logs
        try {
            const storedLogs = sessionStorage.getItem('security_logs');
            if (storedLogs) {
                SecurityLogger.logs = JSON.parse(storedLogs);
            }
        } catch (e) {
            console.error('Failed to load security logs:', e);
        }
        
        // Log system initialization
        SecurityLogger.log('security_system_initialized', 'low', {
            version: '1.7.1',
            timestamp: new Date().toISOString()
        });
    });
}

// Export globally
window.SecurityLogger = SecurityLogger;

