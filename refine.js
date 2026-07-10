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
      
      // Remove decorative gradients
      content = content.replace(/bg-gradient-to-tr from-cyan-600 to-cyan-800/g, 'bg-cyan-700');
      
      // Replace radiuses based on context
      // Cards / Panels (usually have p-4, p-5, p-6, or bg-white border)
      content = content.replace(/rounded-none(.*?)p-(4|5|6|8)/g, 'rounded-2xl$1p-$2');
      content = content.replace(/bg-white(.*?)border(.*?)rounded-none/g, 'bg-white$1border$2rounded-2xl');
      content = content.replace(/bg-slate-50(.*?)rounded-none/g, 'bg-slate-50$1rounded-xl');
      content = content.replace(/bg-slate-50\/50(.*?)rounded-none/g, 'bg-slate-50/50$1rounded-2xl');
      content = content.replace(/bg-red-50(.*?)rounded-none/g, 'bg-red-50$1rounded-xl');
      content = content.replace(/bg-amber-50(.*?)rounded-none/g, 'bg-amber-50$1rounded-xl');
      content = content.replace(/bg-emerald-50(.*?)rounded-none/g, 'bg-emerald-50$1rounded-xl');
      
      // All other rounded-none (inputs, buttons, badges) to rounded-xl
      content = content.replace(/rounded-none/g, 'rounded-xl');
      
      // Shadows
      content = content.replace(/shadow-none/g, 'shadow-sm');

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir('./app');
processDir('./components');
console.log('Refinement complete.');
