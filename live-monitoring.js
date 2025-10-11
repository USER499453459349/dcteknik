// Live Development Monitoring System for DC TEKNİK
// Real-time monitoring of site updates and changes

class LiveMonitoring {
    constructor() {
        this.siteUrl = 'https://dcteknik.com';
        this.checkInterval = 30000; // 30 seconds
        this.isMonitoring = false;
        this.lastContent = '';
        this.changes = [];
    }

    // Start monitoring
    start() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        console.log('🚀 Live monitoring started for', this.siteUrl);
        
        // Initial check
        this.checkForUpdates();
        
        // Set interval
        this.interval = setInterval(() => {
            this.checkForUpdates();
        }, this.checkInterval);
    }

    // Stop monitoring
    stop() {
        if (!this.isMonitoring) return;
        
        this.isMonitoring = false;
        clearInterval(this.interval);
        console.log('⏹️ Live monitoring stopped');
    }

    // Check for updates
    async checkForUpdates() {
        try {
            const response = await fetch(this.siteUrl, {
                method: 'GET',
                cache: 'no-cache',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });

            if (!response.ok) {
                console.error('❌ Failed to fetch site:', response.status);
                return;
            }

            const content = await response.text();
            const timestamp = new Date().toLocaleTimeString();

            // Check for updates section
            if (content.includes('Son Güncellemeler')) {
                console.log('✅ Updates section found at', timestamp);
            } else {
                console.log('❌ Updates section not found at', timestamp);
            }

            // Check for changes
            if (this.lastContent && this.lastContent !== content) {
                console.log('🔄 Site content changed at', timestamp);
                this.changes.push({
                    timestamp,
                    type: 'content_change'
                });
            }

            this.lastContent = content;

        } catch (error) {
            console.error('❌ Monitoring error:', error);
        }
    }

    // Get monitoring status
    getStatus() {
        return {
            isMonitoring: this.isMonitoring,
            siteUrl: this.siteUrl,
            checkInterval: this.checkInterval,
            changesCount: this.changes.length,
            lastCheck: new Date().toLocaleTimeString()
        };
    }

    // Get changes log
    getChanges() {
        return this.changes;
    }
}

// Initialize monitoring
const liveMonitor = new LiveMonitoring();

// Auto-start monitoring
liveMonitor.start();

// Export for use
window.liveMonitor = liveMonitor;

console.log('🎯 Live Development Monitoring System Ready!');
console.log('📊 Use liveMonitor.getStatus() to check status');
console.log('📋 Use liveMonitor.getChanges() to see changes');
console.log('⏹️ Use liveMonitor.stop() to stop monitoring');
