/**
 * DC TEKNİK - Safe Deployment Script
 * Güvenli ve hızlı deployment için tüm adımları otomatik yapar
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

/**
 * Step 1: Pre-deployment validation
 */
function step1_Validate() {
    console.log('\n' + colors.blue + 'STEP 1: Running Pre-Deployment Validation...' + colors.reset);
    
    try {
        execSync('node pre-deploy-check.js', { stdio: 'inherit' });
        console.log(colors.green + '✅ Validation passed!' + colors.reset);
        return true;
    } catch (error) {
        console.log(colors.red + '❌ Validation failed! Fix errors before deploying.' + colors.reset);
        return false;
    }
}

/**
 * Step 2: Update cache version
 */
function step2_UpdateCache() {
    console.log('\n' + colors.blue + 'STEP 2: Updating Cache Version...' + colors.reset);
    
    try {
        execSync('npm run cache-bust', { stdio: 'inherit' });
        console.log(colors.green + '✅ Cache version updated!' + colors.reset);
        return true;
    } catch (error) {
        console.log(colors.yellow + '⚠️  Cache busting failed, continuing...' + colors.reset);
        return true; // Non-critical
    }
}

/**
 * Step 3: Create deployment package
 */
function step3_CreatePackage() {
    console.log('\n' + colors.blue + 'STEP 3: Creating Deployment Package...' + colors.reset);
    
    const files = [
        'index.html',
        'style.css',
        'script.js',
        'sw.js',
        'manifest.webmanifest',
        'package.json',
        'netlify.toml',
        '_headers',
        '.well-known/security.txt',
        'build-cache-bust.js',
        'js/',
        '.well-known/'
    ];
    
    const packageInfo = {
        timestamp: new Date().toISOString(),
        version: require('./package.json').version,
        files: [],
        checklist: []
    };
    
    files.forEach(file => {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            if (stats.isDirectory()) {
                packageInfo.files.push(`${file}/* (directory)`);
            } else {
                packageInfo.files.push(`${file} (${(stats.size / 1024).toFixed(2)} KB)`);
            }
        } else {
            console.log(colors.yellow + `⚠️  File not found: ${file}` + colors.reset);
        }
    });
    
    fs.writeFileSync('deployment-package.json', JSON.stringify(packageInfo, null, 2));
    console.log(colors.green + '✅ Deployment package created!' + colors.reset);
    console.log(colors.blue + '📋 Package info saved to: deployment-package.json' + colors.reset);
    
    return true;
}

/**
 * Step 4: Generate transfer instructions
 */
function step4_GenerateInstructions() {
    console.log('\n' + colors.blue + 'STEP 4: Generating Transfer Instructions...' + colors.reset);
    
    const instructions = `# DC TEKNİK - Deployment Transfer Instructions
**Generated**: ${new Date().toISOString()}
**Version**: ${require('./package.json').version}

## 📦 Files to Transfer

Transfer ALL of the following files/directories to your deployment location:

### Core Files
- index.html
- style.css
- script.js
- sw.js
- manifest.webmanifest

### Configuration Files
- package.json
- netlify.toml (if deploying to Netlify)
- _headers
- build-cache-bust.js

### Directories (Transfer Entire Folder)
- js/ (all files inside)
- .well-known/ (all files inside)

## 🚀 Deployment Steps

### For Netlify:
1. Zip all files
2. Upload to Netlify
3. Or use Git push (if connected)
4. Verify deployment in Netlify dashboard

### For FTP/Manual Upload:
1. Connect to your server
2. Upload all files maintaining directory structure
3. Ensure .well-known/ directory has correct permissions (755)
4. Ensure all files have correct permissions (644 for files, 755 for directories)

### For Git:
\`\`\`bash
git add .
git commit -m "Deploy: v${require('./package.json').version}"
git push origin main
\`\`\`

## ✅ Post-Deployment Checklist

After deployment, verify:

- [ ] Site loads without errors
- [ ] Console shows no errors (F12 → Console)
- [ ] Service Worker is active (Application tab → Service Workers)
- [ ] Forms work correctly
- [ ] Security headers are present (Network tab → Headers)
- [ ] HTTPS is enforced
- [ ] Mobile responsive design works
- [ ] Analytics tracking works
- [ ] PWA features work (if applicable)

## 🔍 Quick Health Check

Open browser console and run:
\`\`\`javascript
// Check error handler
console.log('Error Handler:', typeof window.safeLog !== 'undefined');

// Check security systems
console.log('Security Firewall:', typeof window.SecurityFirewall !== 'undefined');
console.log('Security Logger:', typeof window.SecurityLogger !== 'undefined');

// Check Service Worker
navigator.serviceWorker.getRegistrations().then(regs => {
    console.log('Service Workers:', regs.length);
});
\`\`\`

## 📊 File Size Summary

See deployment-package.json for complete file list and sizes.

## ⚠️ Important Notes

1. **Preserve Directory Structure**: js/ and .well-known/ must maintain their structure
2. **File Permissions**: Ensure .well-known/ is accessible (755)
3. **Cache**: After deployment, clear browser cache to see updates
4. **Service Worker**: May take a few minutes to update after deployment
5. **HTTPS**: Ensure site is served over HTTPS for security features

## 🆘 Troubleshooting

**If site doesn't load:**
- Check file permissions
- Verify .htaccess or server config (if needed)
- Check console for errors

**If Service Worker doesn't work:**
- Clear browser cache
- Check sw.js file is accessible
- Verify HTTPS is enabled

**If forms don't work:**
- Check console for JavaScript errors
- Verify all js/ files are loaded
- Check network tab for failed requests

## 📞 Support

For issues, check:
- HATA_IYILESTIRME_RAPORU.md
- DEPLOYMENT_CHECKLIST.md
- deployment-package.json
`;

    fs.writeFileSync('DEPLOYMENT_INSTRUCTIONS.md', instructions);
    console.log(colors.green + '✅ Transfer instructions generated!' + colors.reset);
    console.log(colors.blue + '📋 Instructions saved to: DEPLOYMENT_INSTRUCTIONS.md' + colors.reset);
    
    return true;
}

/**
 * Step 5: Create health check script
 */
function step5_HealthCheck() {
    console.log('\n' + colors.blue + 'STEP 5: Creating Health Check Script...' + colors.reset);
    
    const healthCheck = `/**
 * DC TEKNİK - Post-Deployment Health Check
 * Run this in browser console after deployment to verify everything works
 */

(function() {
    console.log('%c🔍 DC TEKNİK - Health Check Started', 'font-size: 16px; font-weight: bold; color: #2563eb');
    
    const checks = {
        passed: 0,
        failed: 0,
        warnings: 0
    };
    
    function check(name, condition, critical = true) {
        if (condition) {
            console.log('%c✅ ' + name, 'color: #10b981');
            checks.passed++;
        } else {
            const msg = critical ? '❌ ' : '⚠️ ';
            const style = critical ? 'color: #ef4444' : 'color: #f59e0b';
            console.log('%c' + msg + name, style);
            if (critical) {
                checks.failed++;
            } else {
                checks.warnings++;
            }
        }
    }
    
    // Check Error Handler
    check('Error Handler Loaded', typeof window.safeLog !== 'undefined', true);
    check('Safe Error Function', typeof window.safeError !== 'undefined', true);
    check('Safe Execute Function', typeof window.safeExecute !== 'undefined', true);
    
    // Check Security Systems
    check('Security Firewall', typeof window.SecurityFirewall !== 'undefined', true);
    check('Security Logger', typeof window.SecurityLogger !== 'undefined', true);
    check('Security Monitor', typeof window.securityMonitor !== 'undefined', false);
    
    // Check Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(regs => {
            check('Service Worker Registered', regs.length > 0, false);
            
            // Check cache
            if ('caches' in window) {
                caches.keys().then(keys => {
                    check('Cache Available', keys.length > 0, false);
                });
            }
        });
    } else {
        check('Service Worker Support', false, false);
    }
    
    // Check Analytics
    check('Google Analytics', typeof gtag !== 'undefined', false);
    
    // Check DOM
    check('Main HTML Loaded', document.querySelector('body') !== null, true);
    check('Header Exists', document.querySelector('.header') !== null, false);
    
    // Check Forms
    const forms = document.querySelectorAll('form');
    check('Forms Present', forms.length > 0, false);
    
    // Check for console errors (basic)
    const originalError = console.error;
    let errorCount = 0;
    console.error = function(...args) {
        errorCount++;
        originalError.apply(console, args);
    };
    
    setTimeout(() => {
        check('No Console Errors', errorCount === 0, false);
        console.error = originalError;
        
        // Summary
        console.log('\\n%c📊 Health Check Summary', 'font-size: 14px; font-weight: bold; color: #2563eb');
        console.log('✅ Passed:', checks.passed);
        console.log('❌ Failed:', checks.failed);
        console.log('⚠️  Warnings:', checks.warnings);
        
        if (checks.failed === 0) {
            console.log('%c✅ Site is healthy!', 'font-size: 16px; font-weight: bold; color: #10b981');
        } else {
            console.log('%c❌ Some critical checks failed. Please review.', 'font-size: 16px; font-weight: bold; color: #ef4444');
        }
    }, 2000);
})();
`;

    fs.writeFileSync('health-check.js', healthCheck);
    console.log(colors.green + '✅ Health check script created!' + colors.reset);
    console.log(colors.blue + '📋 Run health-check.js in browser console after deployment' + colors.reset);
    
    return true;
}

/**
 * Main deployment process
 */
function main() {
    console.log('\n' + colors.blue + '═══════════════════════════════════════════════════════' + colors.reset);
    console.log(colors.blue + '  DC TEKNİK - Safe Deployment Process' + colors.reset);
    console.log(colors.blue + '═══════════════════════════════════════════════════════' + colors.reset);
    
    const steps = [
        { name: 'Validation', fn: step1_Validate, critical: true },
        { name: 'Cache Update', fn: step2_UpdateCache, critical: false },
        { name: 'Package Creation', fn: step3_CreatePackage, critical: true },
        { name: 'Instructions', fn: step4_GenerateInstructions, critical: true },
        { name: 'Health Check', fn: step5_HealthCheck, critical: true }
    ];
    
    let success = true;
    
    steps.forEach((step, index) => {
        console.log(`\n[${index + 1}/${steps.length}] ${step.name}...`);
        
        try {
            const result = step.fn();
            if (!result && step.critical) {
                success = false;
                console.log(colors.red + `\n❌ Critical step failed: ${step.name}` + colors.reset);
                console.log(colors.red + 'Deployment aborted!' + colors.reset);
                process.exit(1);
            }
        } catch (error) {
            if (step.critical) {
                console.log(colors.red + `\n❌ Error in ${step.name}: ${error.message}` + colors.reset);
                success = false;
                process.exit(1);
            }
        }
    });
    
    if (success) {
        console.log('\n' + colors.green + '═══════════════════════════════════════════════════════' + colors.reset);
        console.log(colors.green + '  ✅ DEPLOYMENT READY!' + colors.reset);
        console.log(colors.green + '═══════════════════════════════════════════════════════' + colors.reset);
        console.log('\n📋 Next Steps:');
        console.log('1. Review DEPLOYMENT_INSTRUCTIONS.md');
        console.log('2. Check DEPLOYMENT_CHECKLIST.md');
        console.log('3. Transfer files according to instructions');
        console.log('4. Run health-check.js in browser console after deployment');
        console.log('\n');
    }
}

// Run deployment process
main();

