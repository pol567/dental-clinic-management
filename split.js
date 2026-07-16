const fs = require('fs');
const path = require('path');

const file = 'components/workspace-panels.tsx';
const content = fs.readFileSync(file, 'utf8');

// Find all imports
const headerEnd = content.indexOf('export function ');
const header = content.substring(0, headerEnd);

// Find all export functions
const regex = /export function (\w+)\(\) \{[\s\S]*?(?=\nexport function |$)/g;
let match;

if (!fs.existsSync('components/workspace')) {
    fs.mkdirSync('components/workspace');
}

const components = [];

while ((match = regex.exec(content)) !== null) {
    const componentName = match[1];
    const componentBody = match[0];
    
    // Convert CamelCase to kebab-case
    const fileName = componentName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase() + '.tsx';
    
    let fileContent = header + '\n' + componentBody;
    
    fs.writeFileSync(path.join('components/workspace', fileName), fileContent);
    components.push({ name: componentName, file: fileName });
}

// Create index.ts
let indexTs = components.map(c => `export * from './${c.file.replace('.tsx', '')}';`).join('\n');
fs.writeFileSync('components/workspace/index.ts', indexTs);

console.log('Successfully split panels.');
