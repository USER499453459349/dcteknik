/**
 * DC TEKNİK - Release Management System
 * Tam otomatik release süreci
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

/**
 * Run release process
 */
function createRelease(type = 'patch', notes = [], autoCommit = false) {
    console.log('\n' + colors.blue + '═══════════════════════════════════════════════════════' + colors.reset);
    console.log(colors.blue + '  DC TEKNİK - Release Manager' + colors.reset);
    console.log(colors.blue + '═══════════════════════════════════════════════════════' + colors.reset + '\n');
    
    // Step 1: Validation
    console.log(colors.cyan + '[1/5] Running pre-deployment validation...' + colors.reset);
    try {
        execSync('node pre-deploy-check.js', { stdio: 'inherit' });
    } catch (error) {
        console.log(colors.red + '❌ Validation failed!' + colors.reset);
        process.exit(1);
    }
    
    // Step 2: Version bump
    console.log('\n' + colors.cyan + '[2/5] Bumping version...' + colors.reset);
    try {
        const notesArgs = notes.length > 0 ? ['--notes', ...notes] : [];
        execSync(`node version-manager.js ${type} ${notesArgs.join(' ')}`, { stdio: 'inherit' });
    } catch (error) {
        console.log(colors.red + '❌ Version bump failed!' + colors.reset);
        process.exit(1);
    }
    
    // Step 3: Update cache
    console.log('\n' + colors.cyan + '[3/5] Updating cache...' + colors.reset);
    try {
        execSync('npm run cache-bust', { stdio: 'inherit' });
    } catch (error) {
        console.log(colors.yellow + '⚠️  Cache update warning (non-critical)' + colors.reset);
    }
    
    // Step 4: Create deployment package
    console.log('\n' + colors.cyan + '[4/5] Creating deployment package...' + colors.reset);
    try {
        execSync('node deploy-safe.js', { stdio: 'inherit' });
    } catch (error) {
        console.log(colors.yellow + '⚠️  Package creation warning (non-critical)' + colors.reset);
    }
    
    // Step 5: Commit and tag
    if (autoCommit) {
        console.log('\n' + colors.cyan + '[5/5] Committing and tagging...' + colors.reset);
        
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const version = packageJson.version;
        
        try {
            // Commit
            const commitMsg = `Release v${version}`;
            execSync(`git add .`, { stdio: 'inherit' });
            execSync(`git commit -m "${commitMsg}"`, { stdio: 'inherit' });
            
            // Create tag
            const tagMsg = notes.length > 0 
                ? `Release v${version}\n\n${notes.join('\n')}`
                : `Release v${version}`;
            execSync(`git tag -a v${version} -m "${tagMsg}"`, { stdio: 'inherit' });
            
            console.log(colors.green + `✅ Committed and tagged v${version}` + colors.reset);
            
        } catch (error) {
            console.log(colors.yellow + '⚠️  Commit/tag failed (git might not be configured)' + colors.reset);
        }
    } else {
        console.log('\n' + colors.cyan + '[5/5] Ready for manual commit...' + colors.reset);
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const version = packageJson.version;
        
        console.log(colors.blue + '\n💡 Manual steps:' + colors.reset);
        console.log(`   1. git add .`);
        console.log(`   2. git commit -m "Release v${version}"`);
        console.log(`   3. git tag -a v${version} -m "Release v${version}"`);
        console.log(`   4. git push origin main --tags\n`);
    }
    
    console.log('\n' + colors.green + '═══════════════════════════════════════════════════════' + colors.reset);
    console.log(colors.green + '  ✅ RELEASE READY!' + colors.reset);
    console.log(colors.green + '═══════════════════════════════════════════════════════' + colors.reset + '\n');
    
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const version = packageJson.version;
    
    console.log(colors.cyan + '📋 Release Summary:' + colors.reset);
    console.log(`   Version: v${version}`);
    console.log(`   Type: ${type}`);
    console.log(`   Files: See deployment-package.json`);
    console.log(`   Notes: ${notes.length > 0 ? notes.join(', ') : 'None'}\n`);
    
    console.log(colors.blue + '📚 Documentation:' + colors.reset);
    console.log('   - DEPLOYMENT_GUIDE.md');
    console.log('   - DEPLOYMENT_INSTRUCTIONS.md');
    console.log('   - CHANGELOG.md');
    console.log(`   - release-notes-${version}.json\n`);
}

// CLI Interface
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
    console.log(`
${colors.blue}DC TEKNİK - Release Manager${colors.reset}

Usage:
  node release.js [type] [--notes "note1" "note2"] [--commit]

Types:
  patch    - Bug fixes (default)
  minor    - New features
  major    - Breaking changes

Options:
  --notes  - Release notes
  --commit - Auto commit and tag
  
Examples:
  node release.js patch
  node release.js minor --notes "New feature" "Bug fix" --commit
`);
    process.exit(0);
}

const type = args[0] || 'patch';
const notesIndex = args.indexOf('--notes');
const notes = notesIndex !== -1 ? args.slice(notesIndex + 1).filter(n => !n.startsWith('--')) : [];
const autoCommit = args.includes('--commit');

if (!['major', 'minor', 'patch'].includes(type)) {
    console.log(colors.red + `❌ Invalid release type: ${type}` + colors.reset);
    process.exit(1);
}

createRelease(type, notes, autoCommit);

