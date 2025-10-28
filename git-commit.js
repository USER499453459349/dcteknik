/**
 * DC TEKNİK - Smart Git Commit System
 * Otomatik ve güvenli commit işlemleri
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
 * Get current branch
 */
function getCurrentBranch() {
    try {
        return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    } catch {
        return 'main';
    }
}

/**
 * Check if git is initialized
 */
function isGitInitialized() {
    try {
        execSync('git rev-parse --git-dir', { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

/**
 * Get git status
 */
function getGitStatus() {
    try {
        const status = execSync('git status --porcelain', { encoding: 'utf8' });
        return status.trim().split('\n').filter(line => line.trim());
    } catch {
        return [];
    }
}

/**
 * Get staged files
 */
function getStagedFiles() {
    try {
        const files = execSync('git diff --cached --name-only', { encoding: 'utf8' });
        return files.trim().split('\n').filter(line => line.trim());
    } catch {
        return [];
    }
}

/**
 * Validate files before commit
 */
function validateFiles(files) {
    const errors = [];
    const warnings = [];
    
    files.forEach(file => {
        if (!fs.existsSync(file)) {
            errors.push(`File not found: ${file}`);
            return;
        }
        
        // Check file size
        const stats = fs.statSync(file);
        if (stats.size === 0) {
            warnings.push(`Empty file: ${file}`);
        }
        
        // Check for common issues
        if (file.endsWith('.js')) {
            const content = fs.readFileSync(file, 'utf8');
            if (content.includes('console.log') && !content.includes('safeLog')) {
                warnings.push(`${file}: Contains console.log (consider safeLog)`);
            }
            if (content.includes('TODO') || content.includes('FIXME')) {
                warnings.push(`${file}: Contains TODO/FIXME`);
            }
        }
        
        if (file.endsWith('.html')) {
            const content = fs.readFileSync(file, 'utf8');
            if (!content.includes('<title>')) {
                errors.push(`${file}: Missing title tag`);
            }
        }
    });
    
    return { errors, warnings };
}

/**
 * Generate commit message based on changes
 */
function generateCommitMessage(files, type) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const version = packageJson.version;
    
    // Analyze file changes
    const features = [];
    const fixes = [];
    const security = [];
    const perf = [];
    const docs = [];
    
    files.forEach(file => {
        if (file.includes('security') || file.includes('firewall')) {
            security.push(file);
        } else if (file.includes('error') || file.includes('bug')) {
            fixes.push(file);
        } else if (file.includes('performance') || file.includes('optimize')) {
            perf.push(file);
        } else if (file.includes('.md') || file.includes('docs')) {
            docs.push(file);
        } else if (file !== 'package.json' && file !== 'package-lock.json') {
            features.push(file);
        }
    });
    
    let prefix = '';
    let message = '';
    
    if (type === 'feature' || features.length > 0) {
        prefix = 'feat';
        message = 'Add new features and improvements';
    } else if (type === 'fix' || fixes.length > 0) {
        prefix = 'fix';
        message = 'Fix bugs and issues';
    } else if (type === 'security' || security.length > 0) {
        prefix = 'security';
        message = 'Enhance security measures';
    } else if (type === 'perf' || perf.length > 0) {
        prefix = 'perf';
        message = 'Performance optimizations';
    } else if (type === 'docs' || docs.length > 0) {
        prefix = 'docs';
        message = 'Update documentation';
    } else if (type === 'refactor') {
        prefix = 'refactor';
        message = 'Code refactoring';
    } else {
        prefix = 'chore';
        message = 'Update project files';
    }
    
    // Generate detailed message
    let body = '';
    if (security.length > 0) {
        body += '\n\nSecurity:\n- ' + security.join('\n- ');
    }
    if (features.length > 0) {
        body += '\n\nFeatures:\n- ' + features.slice(0, 5).join('\n- ');
    }
    if (fixes.length > 0) {
        body += '\n\nFixes:\n- ' + fixes.slice(0, 5).join('\n- ');
    }
    if (perf.length > 0) {
        body += '\n\nPerformance:\n- ' + perf.join('\n- ');
    }
    
    const footer = `\n\nVersion: v${version}\nGenerated: ${new Date().toISOString()}`;
    
    return {
        short: `${prefix}: ${message}`,
        full: `${prefix}: ${message}${body}${footer}`
    };
}

/**
 * Smart commit function
 */
function smartCommit(message, type = 'auto', skipValidation = false) {
    console.log('\n' + colors.blue + '═══════════════════════════════════════════════════════' + colors.reset);
    console.log(colors.blue + '  DC TEKNİK - Smart Git Commit' + colors.reset);
    console.log(colors.blue + '═══════════════════════════════════════════════════════' + colors.reset + '\n');
    
    // Check git
    if (!isGitInitialized()) {
        console.log(colors.red + '❌ Git repository not initialized!' + colors.reset);
        console.log(colors.yellow + 'Run: git init' + colors.reset);
        process.exit(1);
    }
    
    // Get current branch
    const branch = getCurrentBranch();
    console.log(colors.cyan + `📌 Current branch: ${branch}` + colors.reset + '\n');
    
    // Get status
    const status = getGitStatus();
    if (status.length === 0) {
        console.log(colors.yellow + '⚠️  No changes to commit' + colors.reset);
        process.exit(0);
    }
    
    // Get staged files
    let stagedFiles = getStagedFiles();
    
    // If no staged files, stage all
    if (stagedFiles.length === 0) {
        console.log(colors.cyan + '📦 Staging all changes...' + colors.reset);
        try {
            execSync('git add .', { stdio: 'inherit' });
            stagedFiles = getStagedFiles();
        } catch (error) {
            console.log(colors.red + '❌ Failed to stage files' + colors.reset);
            process.exit(1);
        }
    }
    
    console.log(colors.green + `✅ Staged ${stagedFiles.length} files` + colors.reset + '\n');
    
    // Validate files
    if (!skipValidation) {
        console.log(colors.cyan + '🔍 Validating files...' + colors.reset);
        const validation = validateFiles(stagedFiles);
        
        if (validation.errors.length > 0) {
            console.log(colors.red + '\n❌ Validation errors:' + colors.reset);
            validation.errors.forEach(err => console.log(colors.red + `  - ${err}` + colors.reset));
            console.log(colors.yellow + '\n💡 Fix errors or use --no-validate to skip' + colors.reset);
            process.exit(1);
        }
        
        if (validation.warnings.length > 0) {
            console.log(colors.yellow + '\n⚠️  Warnings:' + colors.reset);
            validation.warnings.slice(0, 5).forEach(warn => console.log(colors.yellow + `  - ${warn}` + colors.reset));
            if (validation.warnings.length > 5) {
                console.log(colors.yellow + `  ... and ${validation.warnings.length - 5} more` + colors.reset);
            }
        }
        
        console.log(colors.green + '\n✅ Validation passed!' + colors.reset + '\n');
    }
    
    // Generate commit message
    const commitMsg = message 
        ? { short: message, full: message }
        : generateCommitMessage(stagedFiles, type);
    
    console.log(colors.cyan + '📝 Commit message:' + colors.reset);
    console.log(colors.blue + commitMsg.short + colors.reset + '\n');
    
    // Confirm (optional)
    if (process.argv.includes('--confirm')) {
        // In non-interactive mode, proceed
    }
    
    // Commit
    try {
        execSync(`git commit -m "${commitMsg.short.replace(/"/g, '\\"')}" -m "${commitMsg.full.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`, {
            stdio: 'inherit'
        });
        
        console.log('\n' + colors.green + '✅ Commit successful!' + colors.reset);
        console.log(colors.cyan + `📌 Branch: ${branch}` + colors.reset);
        console.log(colors.cyan + `📝 Message: ${commitMsg.short}` + colors.reset);
        console.log(colors.cyan + `📊 Files: ${stagedFiles.length}` + colors.reset + '\n');
        
    } catch (error) {
        console.log(colors.red + '\n❌ Commit failed!' + colors.reset);
        process.exit(1);
    }
}

/**
 * Commit and push
 */
function commitAndPush(message, type, skipValidation) {
    smartCommit(message, type, skipValidation);
    
    console.log(colors.cyan + '🚀 Pushing to remote...' + colors.reset);
    
    try {
        const branch = getCurrentBranch();
        execSync(`git push origin ${branch}`, { stdio: 'inherit' });
        console.log(colors.green + '\n✅ Push successful!' + colors.reset);
    } catch (error) {
        console.log(colors.yellow + '\n⚠️  Push failed (remote might not be configured)' + colors.reset);
        console.log(colors.cyan + '💡 Configure remote: git remote add origin <url>' + colors.reset);
    }
}

// CLI Interface
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
    console.log(`
${colors.blue}DC TEKNİK - Smart Git Commit${colors.reset}

Usage:
  node git-commit.js [message] [options]

Options:
  --type <type>       Commit type: feature, fix, security, perf, docs, refactor, chore
  --push              Commit and push to remote
  --no-validate       Skip file validation
  --confirm           Skip confirmation (for scripts)
  
Examples:
  node git-commit.js
  node git-commit.js "Fix login bug"
  node git-commit.js --type security --push
  node git-commit.js "Update docs" --type docs --push

Types:
  feature   - New features
  fix       - Bug fixes
  security  - Security improvements
  perf      - Performance optimizations
  docs      - Documentation updates
  refactor  - Code refactoring
  chore     - Maintenance tasks
`);
    process.exit(0);
}

const messageIndex = args.findIndex(arg => !arg.startsWith('--'));
const message = messageIndex !== -1 ? args[messageIndex] : null;

const typeIndex = args.indexOf('--type');
const type = typeIndex !== -1 ? args[typeIndex + 1] : 'auto';

const skipValidation = args.includes('--no-validate');
const push = args.includes('--push');

if (push) {
    commitAndPush(message, type, skipValidation);
} else {
    smartCommit(message, type, skipValidation);
}

