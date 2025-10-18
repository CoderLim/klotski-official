#!/usr/bin/env node

/**
 * 修复静态导出后的资源路径
 * 将所有绝对路径（/xxx）转换为相对路径（./xxx）
 */

const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../out');

function fixPaths(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // 替换所有以 / 开头但不是 // 或 http:// 或 https:// 的路径
  const fixed = content
    // 修复 href="/xxx"
    .replace(/href="\/(?!\/|http)/g, 'href="./')
    // 修复 src="/xxx"
    .replace(/src="\/(?!\/|http)/g, 'src="./')
    // 修复 JSON 中的路径 "href":"/xxx"
    .replace(/"href":"\/(?!\/|http)/g, '"href":"./')
    // 修复 JSON 中的路径 "src":"/xxx"
    .replace(/"src":"\/(?!\/|http)/g, '"src":"./');
  
  if (content !== fixed) {
    fs.writeFileSync(filePath, fixed, 'utf-8');
    console.log(`✅ Fixed: ${path.relative(outDir, filePath)}`);
    return true;
  }
  
  return false;
}

function processDirectory(dir) {
  let fixedCount = 0;
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixedCount += processDirectory(filePath);
    } else if (file.endsWith('.html') || file.endsWith('.txt')) {
      if (fixPaths(filePath)) {
        fixedCount++;
      }
    }
  }
  
  return fixedCount;
}

console.log('🔧 Fixing asset paths in out/ directory...\n');

const fixedCount = processDirectory(outDir);

console.log(`\n✨ Done! Fixed ${fixedCount} file(s).`);

