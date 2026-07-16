const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Flattening architecture (removing shadows and glassmorphism)
  content = content.replace(/shadow-[a-z]+/g, '');
  content = content.replace(/bg-opacity-\d+/g, '');
  content = content.replace(/backdrop-blur-[a-z]+/g, '');
  
  // Standardizing colors
  content = content.replace(/bg-white/g, 'bg-surface');
  content = content.replace(/bg-slate-50/g, 'bg-background');
  content = content.replace(/bg-slate-100/g, 'bg-background');
  content = content.replace(/bg-slate-150/g, 'bg-background');
  content = content.replace(/border-slate-\d+/g, 'border-border');
  content = content.replace(/text-slate-[789]00/g, 'text-text-primary');
  content = content.replace(/text-slate-500/g, 'text-text-secondary');
  content = content.replace(/text-slate-400/g, 'text-text-muted');
  
  // Primary brand color replacements
  content = content.replace(/bg-cyan-700/g, 'bg-primary');
  content = content.replace(/bg-cyan-600/g, 'bg-primary');
  content = content.replace(/text-cyan-700/g, 'text-primary');
  content = content.replace(/text-cyan-800/g, 'text-primary');
  content = content.replace(/hover:bg-cyan-[78]00/g, 'hover:bg-primary-hover');

  // Ensure touch targets
  content = content.replace(/h-8 w-8/g, 'h-11 w-11'); // Boost small touch targets

  // Remove generic AI copy
  content = content.replace(/Welcome to your dashboard!/g, 'Clinic Operations');
  content = content.replace(/Awesome!/g, '');
  content = content.replace(/Great job!/g, '');
  
  if (original !== content) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

['components', 'app'].forEach(dir => walkDir(dir, processFile));
console.log('Refactoring complete.');
