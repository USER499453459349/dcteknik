/**
 * DC TEKNİK - Version Management System
 * Otomatik versiyon yönetimi ve changelog
 */

const fs = require('fs');
const path = require('path');

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

/**
 * Get current version
 */
function getCurrentVersion() {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    return packageJson.version;
}

/**
 * Increment version
 */
function incrementVersion(version, type) {
    const parts = version.split('.').map(Number);
    
    switch (type) {
        case 'major':
            parts[0]++;
            parts[1] = 0;
            parts[2] = 0;
            break;
        case 'minor':
            parts[1]++;
            parts[2] = 0;
            break;
        case 'patch':
            parts[2]++;
            break;
        default:
            parts[2]++; // Default to patch
    }
    
    return parts.join('.');
}

/**
 * Update version in files
 */
function updateVersion(newVersion) {
    // Update package.json
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    packageJson.version = newVersion;
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + '\n');
    
    // Update sw.js
    if (fs.existsSync('sw.js')) {
        let swContent = fs.readFileSync('sw.js', 'utf8');
        swContent = swContent.replace(
            /const CACHE_VERSION = ['"]([^'"]+)['"]/,
            `const CACHE_VERSION = 'v${newVersion}'`
        );
        fs.writeFileSync('sw.js', swContent);
    }
    
    // Update index.html meta tag
    if (fs.existsSync('index.html')) {
        let htmlContent = fs.readFileSync('index.html', 'utf8');
        htmlContent = htmlContent.replace(
            /<meta name="cache-version" content="[^"]+">/,
            `<meta name="cache-version" content="${newVersion}">`
        );
        fs.writeFileSync('index.html', htmlContent);
    }
    
    console.log(colors.green + `✅ Version updated to v${newVersion}` + colors.reset);
}

/**
 * Generate changelog entry
 */
function generateChangelogEntry(version, type, notes) {
    const date = new Date().toISOString().split('T')[0];
    
    let entry = `\n## [${version}] - ${date}\n\n`;
    
    switch (type) {
        case 'major':
            entry += '### ⚠️ BREAKING CHANGES\n';
            break;
        case 'minor':
            entry += '### ✨ Added\n';
            break;
        case 'patch':
            entry += '### 🐛 Fixed\n';
            break;
    }
    
    if (notes && notes.length > 0) {
        notes.forEach(note => {
            entry += `- ${note}\n`;
        });
    } else {
        entry += '- Updates and improvements\n';
    }
    
    entry += '\n### 🔧 Technical\n';
    entry += `- Version bump to ${version}\n`;
    entry += `- Cache version updated\n`;
    
    return entry;
}

/**
 * Update CHANGELOG.md
 */
function updateChangelog(entry) {
    const changelogPath = 'CHANGELOG.md';
    
    let changelog = '';
    if (fs.existsSync(changelogPath)) {
        changelog = fs.readFileSync(changelogPath, 'utf8');
    } else {
        changelog = `# Changelog\n\nAll notable changes to DC TEKNİK website will be documented in this file.\n\nThe format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),\nand this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).\n`;
    }
    
    // Insert after first heading
    const lines = changelog.split('\n');
    const insertIndex = lines.findIndex(line => line.startsWith('## [')) || lines.length;
    
    lines.splice(insertIndex, 0, entry);
    
    fs.writeFileSync(changelogPath, lines.join('\n'));
    console.log(colors.green + '✅ Changelog updated' + colors.reset);
}

/**
 * Create release notes
 */
function createReleaseNotes(version, type, notes) {
    const releaseNotes = {
        version: version,
        type: type,
        date: new Date().toISOString(),
        notes: notes || [],
        files: []
    };
    
    // Get changed files
    try {
        const { execSync } = require('child_process');
        const files = execSync('git diff --name-only HEAD', { encoding: 'utf8' }).trim().split('\n');
        releaseNotes.files = files.filter(f => f);
    } catch (e) {
        // Ignore if git not available
    }
    
    fs.writeFileSync(`release-notes-${version}.json`, JSON.stringify(releaseNotes, null, 2));
    console.log(colors.green + `✅ Release notes created: release-notes-${version}.json` + colors.reset);
    
    return releaseNotes;
}

/**
 * Main version bump function
 */
function bumpVersion(type = 'patch', notes = []) {
    console.log('\n' + colors.blue + '═══════════════════════════════════════════════════════' + colors.reset);
    console.log(colors.blue + '  DC TEKNİK - Version Manager' + colors.reset);
    console.log(colors.blue + '═══════════════════════════════════════════════════════' + colors.reset + '\n');
    
    const currentVersion = getCurrentVersion();
    console.log(colors.cyan + `📌 Current version: v${currentVersion}` + colors.reset);
    
    const newVersion = incrementVersion(currentVersion, type);
    console.log(colors.cyan + `📌 New version: v${newVersion}` + colors.reset + '\n');
    
    // Update version in files
    updateVersion(newVersion);
    
    // Update changelog
    const changelogEntry = generateChangelogEntry(newVersion, type, notes);
    updateChangelog(changelogEntry);
    
    // Create release notes
    createReleaseNotes(newVersion, type, notes);
    
    // Update cache
    console.log('\n' + colors.cyan + '🔄 Updating cache version...' + colors.reset);
    try {
        const { execSync } = require('child_process');
        execSync('npm run cache-bust', { stdio: 'inherit' });
    } catch (e) {
        console.log(colors.yellow + '⚠️  Cache bust failed, continuing...' + colors.reset);
    }
    
    console.log('\n' + colors.green + '✅ Version bump complete!' + colors.reset);
    console.log(colors.cyan + `📦 Ready to commit: v${currentVersion} → v${newVersion}` + colors.reset);
    console.log(colors.blue + '\n💡 Next steps:' + colors.reset);
    console.log(`   1. Review changes`);
    console.log(`   2. Commit: node git-commit.js "Release v${newVersion}" --type ${type}`);
    console.log(`   3. Tag: git tag -a v${newVersion} -m "Release v${newVersion}"`);
    console.log(`   4. Push: git push origin main --tags\n`);
}

// CLI Interface
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
    console.log(`
${colors.blue}DC TEKNİK - Version Manager${colors.reset}

Usage:
  node version-manager.js [type] [--notes "note1" "note2"]

Types:
  patch    - Bug fixes (default) - v1.7.1 → v1.7.2
  minor    - New features        - v1.7.1 → v1.8.0
  major    - Breaking changes    - v1.7.1 → v2.0.0

Options:
  --notes  - Release notes (multiple allowed)
  --current - Show current version
  
Examples:
  node version-manager.js patch
  node version-manager.js minor --notes "Added new feature" "Fixed bug"
  node version-manager.js --current
`);
    process.exit(0);
}

if (args.includes('--current')) {
    console.log(getCurrentVersion());
    process.exit(0);
}

const type = args[0] || 'patch';
const notesIndex = args.indexOf('--notes');
const notes = notesIndex !== -1 ? args.slice(notesIndex + 1) : [];

if (!['major', 'minor', 'patch'].includes(type)) {
    console.log(colors.red + `❌ Invalid version type: ${type}` + colors.reset);
    console.log(colors.yellow + '💡 Use: major, minor, or patch' + colors.reset);
    process.exit(1);
}

bumpVersion(type, notes);

