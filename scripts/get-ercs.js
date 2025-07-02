const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Clone the repository
console.log('Cloning ERCs repository...');
execSync('git clone https://github.com/ethereum/ercs.git ercs-temp', { stdio: 'inherit' });

// Source and destination directories
const sourceDir = path.join('ercs-temp', 'ERCS');
const destDir = 'EIPS';

// Ensure destination directory exists
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

// Copy and rename files
console.log('Copying and renaming files...');
const files = fs.readdirSync(sourceDir);
files.forEach(file => {
    if (file.endsWith('.md')) {
        const sourcePath = path.join(sourceDir, file);
        let destFileName = file;
        
        // Rename erc-*.md to eip-*.md
        if (file.startsWith('erc-')) {
            destFileName = file.replace('erc-', 'eip-');
        }
        
        const destPath = path.join(destDir, destFileName);
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied: ${file} -> ${destFileName}`);
    }
});

// Clean up
console.log('Cleaning up...');
fs.rmSync('ercs-temp', { recursive: true, force: true });
if (fs.existsSync('_site')) {
    fs.rmSync('_site', { recursive: true, force: true });
    console.log('Removed _site directory');
}

console.log('Done!');