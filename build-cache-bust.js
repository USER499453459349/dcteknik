/**
 * DC TEKNİK - Cache Busting Script
 * Otomatik cache versiyon güncelleme
 */

const fs = require('fs');
const path = require('path');

// Get version from package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = packageJson.version;

// Update Service Worker cache version
function updateServiceWorker() {
    const swPath = path.join(__dirname, 'sw.js');
    let swContent = fs.readFileSync(swPath, 'utf8');
    
    // Update cache version - use package.json version
    const versionPattern = /const CACHE_VERSION = ['"]([^'"]+)['"]/;
    if (versionPattern.test(swContent)) {
        swContent = swContent.replace(
            versionPattern,
            `const CACHE_VERSION = 'v${version}'`
        );
    } else {
        // Add if doesn't exist
        swContent = swContent.replace(
            /\/\/ Cache versioning/,
            `// Cache versioning\nconst CACHE_VERSION = 'v${version}';`
        );
    }
    
    fs.writeFileSync(swPath, swContent, 'utf8');
    console.log('✅ Service Worker cache version updated:', `v${version}`);
}

// Update HTML cache version meta tag
function updateHTMLCacheVersion() {
    const indexPath = path.join(__dirname, 'index.html');
    let htmlContent = fs.readFileSync(indexPath, 'utf8');
    
    // Add or update cache version meta tag
    if (htmlContent.includes('cache-version')) {
        htmlContent = htmlContent.replace(
            /<meta name="cache-version" content="[^"]+">/,
            `<meta name="cache-version" content="${version}">`
        );
    } else {
        // Add after robots meta tag
        htmlContent = htmlContent.replace(
            /<meta name="robots"[^>]*>/,
            `$&\n    <meta name="cache-version" content="${version}">`
        );
    }
    
    fs.writeFileSync(indexPath, htmlContent, 'utf8');
    console.log('✅ HTML cache version updated:', version);
}

// Main execution
try {
    console.log(`🔄 Updating cache versions to ${version}...\n`);
    updateServiceWorker();
    updateHTMLCacheVersion();
    console.log(`\n✅ Cache busting completed for version ${version}`);
    console.log('📦 Ready to deploy! Run: git add . && git commit -m "Update: v' + version + '" && git push');
} catch (error) {
    console.error('❌ Cache busting failed:', error);
    process.exit(1);
}

