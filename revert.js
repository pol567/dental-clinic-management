const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      content = content.replace(/rounded-2xl(.*?)p-(4|5|6|8)/g, 'rounded-none$1p-$2');
      content = content.replace(/bg-white(.*?)border(.*?)rounded-2xl/g, 'bg-white$1border$2rounded-none');
      content = content.replace(/bg-slate-50(.*?)rounded-xl/g, 'bg-slate-50$1rounded-none');
      content = content.replace(/bg-slate-50\/50(.*?)rounded-2xl/g, 'bg-slate-50/50$1rounded-none');
      content = content.replace(/bg-red-50(.*?)rounded-xl/g, 'bg-red-50$1rounded-none');
      content = content.replace(/bg-amber-50(.*?)rounded-xl/g, 'bg-amber-50$1rounded-none');
      content = content.replace(/bg-emerald-50(.*?)rounded-xl/g, 'bg-emerald-50$1rounded-none');
      
      content = content.replace(/rounded-xl/g, 'rounded-none');
      content = content.replace(/shadow-sm/g, 'shadow-none');
      content = content.replace(/font-mono tabular-nums/g, 'font-mono');

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir('./app');
processDir('./components');
console.log('Revert complete.');
