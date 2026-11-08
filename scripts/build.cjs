'use strict';

const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'public');

fs.mkdirSync(output, { recursive: true });
fs.cpSync(path.join(root, 'materiales'), path.join(output, 'materiales'), { recursive: true });
fs.copyFileSync(
  path.join(root, 'AnalisisComplejoUM-17deAgosto.pdf'),
  path.join(output, 'AnalisisComplejoUM-17deAgosto.pdf')
);
console.log('Static site prepared in public/');
