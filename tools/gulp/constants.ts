import { join } from 'path';

export const materialVersion = require('../../package.json').version;
export const projectRoot = join(__dirname, '../..');
export const sourceRoot = join(projectRoot, 'src');
export const distRoot = join(projectRoot, 'dist');
export const distComponentsRoot = join(distRoot, 'regulus-material');
export const componentsDir = join(sourceRoot, 'lib');

export const htmlMinifierOptions = {
  collapseWhitespace: true,
  removeComments: true,
  caseSensitive: true,
  removeAttributeQuotes: false
};

export const npmVendorFiles = [
  '@angular',
  'core-js/client',
  'hammerjs',
  'rxjs',
  'systemjs/dist',
  'zone.js/dist',
  'reflect-metadata',
  'web-animations-js'
];
