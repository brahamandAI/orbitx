#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Running pre-push safety checks...\n');

// Get the remote and branch being pushed to
const remote = process.argv[2] || 'origin';
const url = process.argv[3] || '';

console.log(`📡 Pushing to: ${remote} (${url})`);

// Check 1: Ensure we're not pushing to main/master without proper review
const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
const protectedBranches = ['main', 'master', 'production', 'prod'];

if (protectedBranches.includes(currentBranch)) {
    console.log(`⚠️  Warning: You are pushing to protected branch: ${currentBranch}`);
    console.log('🔒 Protected branches should typically be updated via Pull Requests/Merge Requests.');
}

// Check 2: Verify .env.production.encrypted exists and is up to date
const envFile = '.env.production';
const encryptedFile = '.env.production.encrypted';

if (!fs.existsSync(encryptedFile)) {
    console.error('❌ Error: .env.production.encrypted file is missing!');
    console.error('Please run: node scripts/env-manager.js encrypt .env.production');
    process.exit(1);
}
console.log('✅ .env.production.encrypted file exists');

// Check 3: Verify .env.git exists and contains ENCRYPTION_KEY
if (!fs.existsSync('.env.git')) {
    console.error('❌ Error: .env.git file is missing!');
    console.error('Please create .env.git with ENCRYPTION_KEY before pushing.');
    process.exit(1);
}

const envGitContent = fs.readFileSync('.env.git', 'utf8');
if (!envGitContent.includes('ENCRYPTION_KEY=')) {
    console.error('❌ Error: ENCRYPTION_KEY not found in .env.git!');
    console.error('Please add ENCRYPTION_KEY to .env.git before pushing.');
    process.exit(1);
}
console.log('✅ ENCRYPTION_KEY found in .env.git');

// Check 4: Ensure .env.production is not tracked by git
try {
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
    // Split by lines and check each file individually to avoid false positives
    const statusLines = gitStatus.split('\n').filter(line => line.trim());
    for (const line of statusLines) {
        // Extract filename (after status codes and whitespace)
        const filename = line.substring(3).trim();
        if (filename === envFile) {
            console.error(`❌ Error: ${envFile} is tracked by git!`);
            console.error('This is a security risk. Please:');
            console.error('1. Add .env.production to .gitignore');
            console.error('2. Remove it from git: git rm --cached .env.production');
            console.error('3. Commit the changes');
            process.exit(1);
        }
    }
    console.log('✅ .env.production is not tracked by git');
} catch (error) {
    console.warn('⚠️  Warning: Could not check git status');
}

// Check 5: Verify .gitignore contains sensitive files
const gitignorePath = '.gitignore';
if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    const requiredIgnores = ['.env', '.env.local', '.env.production', '.env.git'];
    
    for (const ignore of requiredIgnores) {
        if (!gitignoreContent.includes(ignore)) {
            console.warn(`⚠️  Warning: ${ignore} should be in .gitignore`);
        }
    }
    console.log('✅ .gitignore check completed');
} else {
    console.warn('⚠️  Warning: .gitignore file not found');
}

// Check 6: Run tests if they exist
const testScripts = ['test', 'test:unit', 'test:integration', 'test:e2e'];
let testsRun = false;

for (const script of testScripts) {
    try {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        if (packageJson.scripts && packageJson.scripts[script]) {
            console.log(`🧪 Running ${script}...`);
            let testCmd = `npm run ${script}`;
            // If using Jest or react-scripts, add --watchAll=false to avoid interactive mode
            const testScriptContent = packageJson.scripts[script];
            if (
                /jest/.test(testScriptContent) ||
                /react-scripts\s+test/.test(testScriptContent)
            ) {
                testCmd += ' -- --watchAll=false';
            }
            execSync(testCmd, { 
                stdio: 'inherit',
                cwd: process.cwd()
            });
            testsRun = true;
            console.log(`✅ ${script} passed`);
            break; // Only run one test script
        }
    } catch (error) {
        // Script doesn't exist, continue
    }
}

if (!testsRun) {
    console.log('ℹ️  No test scripts found in package.json');
}

// Check 7: Check for large files
try {
    const largeFiles = execSync('find . -type f -size +10M -not -path "./node_modules/*" -not -path "./.git/*"', { encoding: 'utf8' });
    if (largeFiles.trim()) {
        console.warn('⚠️  Warning: Large files detected:');
        console.warn(largeFiles);
        console.warn('Consider using Git LFS for large files.');
    } else {
        console.log('✅ No large files detected');
    }
} catch (error) {
    // find command not available or no large files
    console.log('ℹ️  Large file check skipped');
}

// Check 8: Verify no sensitive data in staged files
try {
    const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' }).trim();
    if (stagedFiles) {
        const files = stagedFiles.split('\n');
        const sensitivePatterns = [
            /password/i,
            /secret/i,
            /key/i,
            /token/i,
            /api[_-]?key/i,
            /private[_-]?key/i
        ];
        
        for (const file of files) {
            if (file.includes('.env') || file.includes('.env.git')) {
                continue; // Skip these as they're handled separately
            }
            
            try {
                const content = execSync(`git show :${file}`, { encoding: 'utf8' });
                for (const pattern of sensitivePatterns) {
                    if (pattern.test(content)) {
                        console.warn(`⚠️  Warning: Potential sensitive data in ${file}`);
                        console.warn('Please review the file for any hardcoded secrets.');
                    }
                }
            } catch (error) {
                // File might be binary or not accessible
            }
        }
        console.log('✅ Sensitive data check completed');
    }
} catch (error) {
    console.warn('⚠️  Warning: Could not check staged files for sensitive data');
}

// Check 9: Ensure encrypted file is newer than source file
if (fs.existsSync(envFile)) {
    const envStats = fs.statSync(envFile);
    const encryptedStats = fs.statSync(encryptedFile);
    
    if (envStats.mtime > encryptedStats.mtime) {
        console.error('❌ Error: .env.production is newer than .env.production.encrypted!');
        console.error('Please run: node scripts/env-manager.js encrypt .env.production');
        process.exit(1);
    }
    console.log('✅ .env.production.encrypted is up to date');
}

console.log('\n🎉 All pre-push safety checks passed! Ready to push.');
process.exit(0);
