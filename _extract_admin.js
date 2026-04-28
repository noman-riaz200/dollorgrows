const fs = require('fs');
const raw = fs.readFileSync('_build_admin.js', 'utf8');
const start = raw.indexOf('`') + 1;
const end = raw.lastIndexOf('`;');
const jsx = raw.slice(start, end).replace(/\\\`/g, '`').replace(/\\\$/g, '$');
fs.writeFileSync('app/admin/page.tsx', jsx, 'utf8');
console.log('Wrote', jsx.length, 'chars');
