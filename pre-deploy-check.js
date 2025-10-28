/**
 * DC TEKNİK - Pre-Deployment Validation Script
 * Deployment öncesi tüm dosyaları ve yapılandırmaları kontrol eder
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

let errors = [];
let warnings = [];
let success = [];

/**
 * Check if file exists
 */
function checkFile(filePath, description) {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        if (stats.size > 0) {
            success.push(`✅ ${description}: EXISTS (${(stats.size / 1024).toFixed(2)} KB)`);
            return true;
        } else {
            errors.push(`❌ ${description}: EMPTY FILE`);
            return false;
        }
    } else {
        errors.push(`❌ ${description}: MISSING`);
        return false;
    }
}

/**
 * Check required files
 */
function checkRequiredFiles() {
    console.log('\n📁 Checking Required Files...\n');
    
    const requiredFiles = [
        ['index.html', 'Main HTML File'],
        ['style.css', 'Main Stylesheet'],
        ['script.js', 'Main JavaScript'],
        ['sw.js', 'Service Worker'],
        ['manifest.webmanifest', 'PWA Manifest'],
        ['package.json', 'Package Configuration'],
        ['netlify.toml', 'Netlify Configuration'],
        ['_headers', 'Security Headers'],
        ['.well-known/security.txt', 'Security Contact Info'],
        ['js/error-handler.js', 'Error Handler'],
        ['js/security-logger.js', 'Security Logger'],
        ['js/security-firewall.js', 'Security Firewall'],
        ['js/advanced-security.js', 'Advanced Security'],
        ['js/security-monitor.js', 'Security Monitor'],
        ['build-cache-bust.js', 'Cache Busting Script']
    ];
    
    let allExist = true;
    requiredFiles.forEach(([file, desc]) => {
        if (!checkFile(file, desc)) {
            allExist = false;
        }
    });
    
    return allExist;
}

/**
 * Validate HTML structure
 */
function validateHTML() {
    console.log('\n🔍 Validating HTML Structure...\n');
    
    try {
        const htmlPath = path.join(__dirname, 'index.html');
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        
        // Check for required meta tags
        const checks = [
            {
                pattern: /<meta\s+charset=["']UTF-8["']/i,
                name: 'UTF-8 Charset Meta Tag',
                required: true
            },
            {
                pattern: /<meta\s+name=["']viewport["']/i,
                name: 'Viewport Meta Tag',
                required: true
            },
            {
                pattern: /<title>/i,
                name: 'Title Tag',
                required: true
            },
            {
                pattern: /<meta\s+name=["']description["']/i,
                name: 'Meta Description',
                required: true
            },
            {
                pattern: /error-handler\.js/i,
                name: 'Error Handler Script',
                required: true
            },
            {
                pattern: /Content-Security-Policy/i,
                name: 'CSP Header Reference',
                required: true
            }
        ];
        
        checks.forEach(check => {
            if (check.pattern.test(htmlContent)) {
                success.push(`✅ ${check.name}: FOUND`);
            } else {
                if (check.required) {
                    errors.push(`❌ ${check.name}: MISSING (REQUIRED)`);
                } else {
                    warnings.push(`⚠️  ${check.name}: MISSING (RECOMMENDED)`);
                }
            }
        });
        
        // Check for closing tags
        const openTags = (htmlContent.match(/<[^/][^>]*>/g) || []).length;
        const closeTags = (htmlContent.match(/<\/[^>]+>/g) || []).length;
        
        if (Math.abs(openTags - closeTags) < 10) {
            success.push('✅ HTML Structure: BALANCED');
        } else {
            warnings.push(`⚠️  HTML Structure: Possible unclosed tags (${openTags} open, ${closeTags} close)`);
        }
        
    } catch (error) {
        errors.push(`❌ HTML Validation: ${error.message}`);
        return false;
    }
    
    return errors.length === 0;
}

/**
 * Validate JavaScript
 */
function validateJavaScript() {
    console.log('\n🔍 Validating JavaScript Files...\n');
    
    try {
        const jsFiles = [
            'script.js',
            'js/error-handler.js',
            'sw.js'
        ];
        
        jsFiles.forEach(file => {
            const filePath = path.join(__dirname, file);
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
                
                // Check for common issues
                if (content.includes('console.error') && !content.includes('safeError')) {
                    warnings.push(`⚠️  ${file}: Uses console.error (consider safeError)`);
                }
                
                if (content.includes('eval(')) {
                    warnings.push(`⚠️  ${file}: Contains eval() - security risk`);
                }
                
                // Check for error handling
                if (content.includes('try') && content.includes('catch')) {
                    success.push(`✅ ${file}: Has error handling`);
                } else {
                    warnings.push(`⚠️  ${file}: Missing error handling`);
                }
                
                // Check for undefined/null checks
                if (content.includes('typeof') || content.includes('!== undefined')) {
                    success.push(`✅ ${file}: Has null/undefined checks`);
                }
            }
        });
        
    } catch (error) {
        errors.push(`❌ JavaScript Validation: ${error.message}`);
        return false;
    }
    
    return true;
}

/**
 * Check configuration files
 */
function validateConfiguration() {
    console.log('\n⚙️  Validating Configuration...\n');
    
    try {
        // Check package.json
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        
        if (packageJson.name) {
            success.push(`✅ Package Name: ${packageJson.name}`);
        }
        
        if (packageJson.version) {
            success.push(`✅ Package Version: ${packageJson.version}`);
        }
        
        if (packageJson.scripts && packageJson.scripts.build) {
            success.push('✅ Build Script: CONFIGURED');
        } else {
            errors.push('❌ Build Script: MISSING');
        }
        
        // Check netlify.toml
        if (fs.existsSync('netlify.toml')) {
            const netlify = fs.readFileSync('netlify.toml', 'utf8');
            
            if (netlify.includes('Content-Security-Policy')) {
                success.push('✅ Netlify Security Headers: CONFIGURED');
            } else {
                warnings.push('⚠️  Netlify Security Headers: MISSING');
            }
        }
        
        // Check _headers
        if (fs.existsSync('_headers')) {
            const headers = fs.readFileSync('_headers', 'utf8');
            
            if (headers.includes('Content-Security-Policy')) {
                success.push('✅ Security Headers File: CONFIGURED');
            } else {
                warnings.push('⚠️  Security Headers: MISSING');
            }
        }
        
    } catch (error) {
        errors.push(`❌ Configuration Validation: ${error.message}`);
        return false;
    }
    
    return true;
}

/**
 * Check security files
 */
function validateSecurity() {
    console.log('\n🛡️  Validating Security Configuration...\n');
    
    const securityChecks = [
        ['js/error-handler.js', 'Error Handler'],
        ['js/security-firewall.js', 'Security Firewall'],
        ['js/security-logger.js', 'Security Logger'],
        ['js/advanced-security.js', 'Advanced Security'],
        ['.well-known/security.txt', 'Security Contact']
    ];
    
    let allGood = true;
    securityChecks.forEach(([file, desc]) => {
        if (checkFile(file, desc)) {
            allGood = true;
        } else {
            allGood = false;
        }
    });
    
    // Check for CSP in headers
    if (fs.existsSync('_headers')) {
        const headers = fs.readFileSync('_headers', 'utf8');
        if (headers.includes("Content-Security-Policy")) {
            success.push('✅ CSP: CONFIGURED');
        } else {
            warnings.push('⚠️  CSP: MISSING');
        }
    }
    
    return allGood;
}

/**
 * Check file sizes
 */
function checkFileSizes() {
    console.log('\n📊 Checking File Sizes...\n');
    
    const files = [
        ['index.html', 200],
        ['style.css', 100],
        ['script.js', 100]
    ];
    
    files.forEach(([file, maxSize]) => {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            const sizeKB = stats.size / 1024;
            
            if (sizeKB > maxSize) {
                warnings.push(`⚠️  ${file}: ${sizeKB.toFixed(2)} KB (over ${maxSize} KB)`);
            } else {
                success.push(`✅ ${file}: ${sizeKB.toFixed(2)} KB (under ${maxSize} KB)`);
            }
        }
    });
}

/**
 * Generate deployment package checklist
 */
function generateDeploymentChecklist() {
    console.log('\n📋 Generating Deployment Checklist...\n');
    
    const checklist = `
# DC TEKNİK - Deployment Checklist

## Pre-Deployment
- [ ] Run pre-deploy-check.js
- [ ] All files validated
- [ ] Cache version updated (npm run cache-bust)
- [ ] Version number updated in package.json
- [ ] Test locally (npm start)

## Files to Transfer
- [ ] index.html
- [ ] style.css
- [ ] script.js
- [ ] sw.js
- [ ] manifest.webmanifest
- [ ] All files in /js/ directory
- [ ] .well-known/security.txt
- [ ] _headers
- [ ] netlify.toml (if deploying to Netlify)
- [ ] package.json
- [ ] build-cache-bust.js

## Post-Deployment
- [ ] Test live site
- [ ] Check console for errors
- [ ] Verify Service Worker active
- [ ] Test forms
- [ ] Verify security headers
- [ ] Test on mobile device
- [ ] Check analytics tracking

## Security Verification
- [ ] CSP headers active
- [ ] Security scripts loaded
- [ ] HTTPS enforced
- [ ] No console errors
- [ ] Error handler active
`;
    
    fs.writeFileSync('DEPLOYMENT_CHECKLIST.md', checklist);
    success.push('✅ Deployment Checklist: GENERATED (DEPLOYMENT_CHECKLIST.md)');
}

/**
 * Create backup list
 */
function createBackupList() {
    console.log('\n💾 Creating Backup File List...\n');
    
    const backupFiles = [
        'index.html',
        'style.css',
        'script.js',
        'sw.js',
        'manifest.webmanifest',
        'package.json',
        'netlify.toml',
        '_headers',
        '.well-known/security.txt',
        'js/error-handler.js',
        'js/security-firewall.js',
        'js/security-logger.js',
        'js/advanced-security.js',
        'js/security-monitor.js',
        'build-cache-bust.js'
    ];
    
    const backupList = {
        timestamp: new Date().toISOString(),
        version: require('./package.json').version,
        files: backupFiles.map(file => ({
            path: file,
            exists: fs.existsSync(path.join(__dirname, file)),
            size: fs.existsSync(path.join(__dirname, file)) 
                ? fs.statSync(path.join(__dirname, file)).size : 0
        }))
    };
    
    fs.writeFileSync('backup-list.json', JSON.stringify(backupList, null, 2));
    success.push('✅ Backup List: CREATED (backup-list.json)');
}

/**
 * Main validation function
 */
function runValidation() {
    console.log('\n' + colors.blue + '═══════════════════════════════════════════════════════' + colors.reset);
    console.log(colors.blue + '  DC TEKNİK - Pre-Deployment Validation' + colors.reset);
    console.log(colors.blue + '═══════════════════════════════════════════════════════' + colors.reset + '\n');
    
    // Run all checks
    checkRequiredFiles();
    validateHTML();
    validateJavaScript();
    validateConfiguration();
    validateSecurity();
    checkFileSizes();
    generateDeploymentChecklist();
    createBackupList();
    
    // Print results
    console.log('\n' + colors.green + '═══════════════════════════════════════════════════════' + colors.reset);
    console.log(colors.green + '  SUCCESSES' + colors.reset);
    console.log(colors.green + '═══════════════════════════════════════════════════════' + colors.reset);
    success.forEach(msg => console.log(colors.green + msg + colors.reset));
    
    if (warnings.length > 0) {
        console.log('\n' + colors.yellow + '═══════════════════════════════════════════════════════' + colors.reset);
        console.log(colors.yellow + '  WARNINGS' + colors.reset);
        console.log(colors.yellow + '═══════════════════════════════════════════════════════' + colors.reset);
        warnings.forEach(msg => console.log(colors.yellow + msg + colors.reset));
    }
    
    if (errors.length > 0) {
        console.log('\n' + colors.red + '═══════════════════════════════════════════════════════' + colors.reset);
        console.log(colors.red + '  ERRORS (MUST FIX BEFORE DEPLOYMENT)' + colors.reset);
        console.log(colors.red + '═══════════════════════════════════════════════════════' + colors.reset);
        errors.forEach(msg => console.log(colors.red + msg + colors.reset));
    }
    
    // Final summary
    console.log('\n' + colors.blue + '═══════════════════════════════════════════════════════' + colors.reset);
    console.log(colors.blue + '  SUMMARY' + colors.reset);
    console.log(colors.blue + '═══════════════════════════════════════════════════════' + colors.reset);
    console.log(`✅ Successes: ${success.length}`);
    console.log(`⚠️  Warnings: ${warnings.length}`);
    console.log(`❌ Errors: ${errors.length}`);
    
    if (errors.length === 0) {
        console.log('\n' + colors.green + '✅ READY FOR DEPLOYMENT!' + colors.reset + '\n');
        process.exit(0);
    } else {
        console.log('\n' + colors.red + '❌ NOT READY - FIX ERRORS FIRST!' + colors.reset + '\n');
        process.exit(1);
    }
}

// Run validation
runValidation();

