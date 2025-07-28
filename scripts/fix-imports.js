#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to convert @/ imports to relative paths
function fixImports(content, filePath) {
  const dir = path.dirname(filePath);
  const srcDir = path.resolve('./src');
  
  return content.replace(/from ['"]@\/([^'"]+)['"]/g, (match, importPath) => {
    const targetPath = path.resolve(srcDir, importPath);
    const relativePath = path.relative(dir, targetPath);
    
    // Add .js extension for ES modules
    const relativePathWithExt = relativePath.startsWith('.') 
      ? relativePath + '.js' 
      : './' + relativePath + '.js';
    
    return `from '${relativePathWithExt}'`;
  });
}

// Find all TypeScript files
const files = glob.sync('src/**/*.ts', { ignore: ['node_modules/**'] });

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const fixedContent = fixImports(content, file);
  
  if (content !== fixedContent) {
    fs.writeFileSync(file, fixedContent);
    console.log(`Fixed imports in ${file}`);
  }
});

console.log('Import path fixing completed!'); 