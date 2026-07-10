const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // We will look for <button ... className="..." ...> and insert min-h-[44px]
      content = content.replace(/(<button[^>]*?className="[^"]*?)"/g, (match, p1) => {
        if (!p1.includes('min-h-[44px]')) {
          return p1 + ' min-h-[44px]"';
        }
        return match;
      });

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir('./app');
processDir('./components');
console.log('Button touch targets updated.');
