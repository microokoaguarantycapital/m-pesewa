// scripts/backup.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('💾 Creating backup of M-PESEWA project...');

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = `backups/m-pesewa-${timestamp}`;

// Create backup directory
if (!fs.existsSync('backups')) {
  fs.mkdirSync('backups', { recursive: true });
}

// Files and directories to backup
const toBackup = [
  'index.html',
  'manifest.json',
  'service-worker.js',
  'README.md',
  '.nojekyll',
  'assets/',
  'pages/',
  'data/',
  'package.json',
  'scripts/'
];

console.log(`📦 Creating backup: ${backupDir}`);

// Copy each item
toBackup.forEach(item => {
  const source = item;
  const destination = path.join(backupDir, item);
  
  try {
    if (fs.existsSync(source)) {
      if (fs.lstatSync(source).isDirectory()) {
        // Copy directory recursively
        execSync(`cp -r "${source}" "${destination}"`);
      } else {
        // Copy file
        fs.copyFileSync(source, destination);
      }
      console.log(`  ✓ ${source}`);
    }
  } catch (error) {
    console.log(`  ✗ ${source}: ${error.message}`);
  }
});

// Create backup info file
const info = {
  timestamp: new Date().toISOString(),
  version: require('../package.json').version,
  files: toBackup,
  size: getDirectorySize(backupDir)
};

fs.writeFileSync(
  path.join(backupDir, 'backup-info.json'),
  JSON.stringify(info, null, 2)
);

console.log(`✅ Backup created: ${backupDir}`);
console.log(`📊 Backup size: ${formatBytes(info.size)}`);

function getDirectorySize(dir) {
  let size = 0;
  
  function traverse(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    items.forEach(item => {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else {
        size += stat.size;
      }
    });
  }
  
  traverse(dir);
  return size;
}

function formatBytes(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`;
}