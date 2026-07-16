const fs = require('fs');
const path = require('path');

fs.readdirSync('components/workspace').forEach(f => {
  if(!f.endsWith('.tsx')) return;
  let p = path.join('components/workspace', f);
  let c = fs.readFileSync(p, 'utf8');
  c = c.replace(/from '\.\/odontogram-chart'/g, "from '../odontogram-chart'");
  fs.writeFileSync(p, c);
});
console.log('Fixed imports.');
