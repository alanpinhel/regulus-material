import * as path from 'path';
import { task, watch, src, dest } from 'gulp';
import { ScriptTarget, ModuleKind } from 'typescript';
import { distComponentsRoot, projectRoot, componentsDir, htmlMinifierOptions } from '../constants';
import { sassBuildTask, tsBuildTask, execNodeTask, sequenceTask, triggerLivereload } from '../util/task-helpers';

const inlineResources = require('../../../scripts/release/inline-resources');
const gulpRollup = require('gulp-better-rollup');
const gulpMinifyHtml = require('gulp-htmlmin');
const gulpIf = require('gulp-if');
const tsconfigPath = path.join(componentsDir, 'tsconfig.json');

const assetFiles = [
  path.join(componentsDir, '**/*.html'),
  path.join(componentsDir, '**/*.scss'),
  path.join(componentsDir, 'package.json'),
  path.join(projectRoot, 'README.md'),
  path.join(projectRoot, 'LICENSE'),
];

task('build:components', [':build:components:bundle:umd']);

task(':build:components:release', sequenceTask(
  ':build:components:bundle:umd', ':build:components:bundle:esm', ':build:components:ngc'
));

task(':build:components:bundle:umd', sequenceTask(
  ':build:components:ts:es5', ':build:components:inline', ':build:components:rollup:umd'
));

task(':build:components:bundle:esm', sequenceTask(
  ':build:components:ts:es6', ':build:components:inline', ':build:components:rollup:esm'
));

task(':build:components:ts:es5', tsBuildTask(
  tsconfigPath, { target: ScriptTarget.ES5 }
));

task(':build:components:ts:es6', tsBuildTask(
  tsconfigPath, { target: ScriptTarget.ES2015 }
));

task(':build:components:ts:spec', tsBuildTask(tsconfigPath, {
  target: ScriptTarget.ES5, module: ModuleKind.CommonJS
}));

task(':build:components:assets', () => {
  return src(assetFiles)
    .pipe(gulpIf(/.html$/, gulpMinifyHtml(htmlMinifierOptions)))
    .pipe(dest(distComponentsRoot));
});

task(':build:components:scss', sassBuildTask(
  distComponentsRoot, componentsDir, true
));

task(':build:components:rollup:esm', () => {
  return src(path.join(distComponentsRoot, 'index.js'))
    .pipe(createRollupBundle('es', 'regulus-material.js'))
    .pipe(dest(path.join(distComponentsRoot, 'bundles')));
});

task(':build:components:rollup:umd', () => {
  return src(path.join(distComponentsRoot, 'index.js'))
    .pipe(createRollupBundle('umd', 'regulus-material.umd.js'))
    .pipe(dest(path.join(distComponentsRoot, 'bundles')));
});

task(':build:components:inline', sequenceTask(
  [':build:components:scss', ':build:components:assets'], ':inline-resources'
));

task(':inline-resources', () => inlineResources(distComponentsRoot));

task(':build:components:ngc', ['build:components'], execNodeTask(
  '@angular/compiler-cli', 'ngc', ['-p', tsconfigPath]
));

task(':watch:components', () => {
  watch(path.join(componentsDir, '**/*.ts'), ['build:components', triggerLivereload]);
  watch(path.join(componentsDir, '**/*.scss'), ['build:components', triggerLivereload]);
  watch(path.join(componentsDir, '**/*.html'), ['build:components', triggerLivereload]);
});

const rollupGlobals = {
  'tslib': 'tslib',
  '@angular/animations': 'ng.animations',
  '@angular/core': 'ng.core',
  '@angular/common': 'ng.common',
  '@angular/forms': 'ng.forms',
  '@angular/platform-browser': 'ng.platformBrowser',
  '@angular/platform-browser-dynamic': 'ng.platformBrowserDynamic',
  '@angular/platform-browser/animations': 'ng.platformBrowser.animations',
  'regulus-material': 'ng.regulus-material',
  'rxjs/BehaviorSubject': 'Rx',
  'rxjs/Observable': 'Rx',
  'rxjs/Subject': 'Rx',
  'rxjs/Subscription': 'Rx',
  'rxjs/add/observable/combineLatest': 'Rx.Observable',
  'rxjs/add/observable/forkJoin': 'Rx.Observable',
  'rxjs/add/observable/fromEvent': 'Rx.Observable',
  'rxjs/add/observable/merge': 'Rx.Observable',
  'rxjs/add/observable/of': 'Rx.Observable',
  'rxjs/add/observable/throw': 'Rx.Observable',
  'rxjs/add/operator/auditTime': 'Rx.Observable.prototype',
  'rxjs/add/operator/catch': 'Rx.Observable.prototype',
  'rxjs/add/operator/debounceTime': 'Rx.Observable.prototype',
  'rxjs/add/operator/do': 'Rx.Observable.prototype',
  'rxjs/add/operator/filter': 'Rx.Observable.prototype',
  'rxjs/add/operator/finally': 'Rx.Observable.prototype',
  'rxjs/add/operator/first': 'Rx.Observable.prototype',
  'rxjs/add/operator/let': 'Rx.Observable.prototype',
  'rxjs/add/operator/map': 'Rx.Observable.prototype',
  'rxjs/add/operator/share': 'Rx.Observable.prototype',
  'rxjs/add/operator/startWith': 'Rx.Observable.prototype',
  'rxjs/add/operator/switchMap': 'Rx.Observable.prototype',
  'rxjs/add/operator/takeUntil': 'Rx.Observable.prototype',
  'rxjs/add/operator/toPromise': 'Rx.Observable.prototype',
};

function createRollupBundle(format: string, outFile: string) {
  let rollupOptions = {
    context: 'this',
    external: Object.keys(rollupGlobals)
  };

  let rollupGenerateOptions = {
    moduleId: '',
    moduleName: 'ng.regulus-material',
    format: format,
    banner: '',
    dest: outFile,
    globals: rollupGlobals,
  };

  return gulpRollup(rollupOptions, rollupGenerateOptions);
}
