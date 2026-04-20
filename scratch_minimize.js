const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
       results = results.concat(walk(file));
    } else { 
       if (file.endsWith('.jsx')) results.push(file);
    }
  });
  return results;
};

const components = walk('c:/Users/ASUS/Desktop/college/Subjects/Sem6/IP/Stryve/client/src');
let changedFiles = 0;

components.forEach(file => {
   let content = fs.readFileSync(file, 'utf8');
   let original = content;

   // 1. Target RGBA opacity strings inside shadow components
   content = content.replace(/rgba\((\d+,\d+,\d+),([0-9.]+)\)/g, (match, rgb, alpha) => {
      const newAlpha = (parseFloat(alpha) / 2).toFixed(2).replace(/\.00$/, '');
      return `rgba(${rgb},${newAlpha})`;
   });

   // 2. Target Tailwind inline shadow opacities (e.g. shadow-cyan-500/20)
   content = content.replace(/shadow-([a-zA-Z]+)-(\d+)\/(\d+)/g, (match, color, weight, opacity) => {
      const newOpac = Math.max(5, Math.floor(parseInt(opacity) / 2));
      return `shadow-${color}-${weight}/${newOpac}`;
   });

   if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      changedFiles++;
   }
});

console.log(`Executed system-wide scale down of glow effects on ${changedFiles} UI files successfully.`);
