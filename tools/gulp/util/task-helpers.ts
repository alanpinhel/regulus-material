import * as child_process from 'child_process';
import * as fs from 'fs';
import * as gulp from 'gulp';
import * as path from 'path';
import { npmVendorFiles, projectRoot, distRoot } from '../constants';
import { CompilerOptions } from 'typescript';
import { compileProject } from './ts-compiler';

const gulpClean = require('gulp-clean');
const gulpMerge = require('merge2');
const gulpRunSequence = require('run-sequence');
const gulpSass = require('gulp-sass');
const gulpSourcemaps = require('gulp-sourcemaps');
const gulpConnect = require('gulp-connect');
const gulpIf = require('gulp-if');
const gulpCleanCss = require('gulp-clean-css');
const resolveBin = require('resolve-bin');

function _globify(maybeGlob: string, suffix = '**/*') {
  if (maybeGlob.indexOf('*') != -1) {
    return maybeGlob;
  }
  try {
    const stat = fs.statSync(maybeGlob);
    if (stat.isFile()) {
      return maybeGlob;
    }
  } catch (e) { }
  return path.join(maybeGlob, suffix);
}

export function tsBuildTask(tsConfigPath: string, extraOptions?: CompilerOptions) {
  return () => compileProject(tsConfigPath, extraOptions);
}

export function sassBuildTask(dest: string, root: string, minify = false) {
  return () => {
    return gulp.src(_globify(root, '**/*.scss'))
      .pipe(gulpSourcemaps.init({ loadMaps: true }))
      .pipe(gulpSass().on('error', gulpSass.logError))
      .pipe(gulpIf(minify, gulpCleanCss()))
      .pipe(gulpSourcemaps.write('.'))
      .pipe(gulp.dest(dest));
  };
}

export interface ExecTaskOptions {
  silent?: boolean;
  errMessage?: string;
}

export function execTask(binPath: string, args: string[], options: ExecTaskOptions = {}) {
  return (done: (err?: string) => void) => {
    const childProcess = child_process.spawn(binPath, args);

    if (!options.silent) {
      childProcess.stdout.on('data', (data: string) => {
        process.stdout.write(data);
      });

      childProcess.stderr.on('data', (data: string) => {
        process.stderr.write(data);
      });
    }

    childProcess.on('close', (code: number) => {
      if (code != 0) {
        if (options.errMessage === undefined) {
          done('Process failed with code ' + code);
        } else {
          done(options.errMessage);
        }
      } else {
        done();
      }
    });
  };
}

export function execNodeTask(packageName: string, executable: string | string[], args?: string[],
  options: ExecTaskOptions = {}) {
  if (!args) {
    args = <string[]>executable;
    executable = undefined;
  }

  return (done: (err: any) => void) => {
    resolveBin(packageName, { executable: executable }, (err: any, binPath: string) => {
      if (err) {
        done(err);
      } else {
        execTask('node', [binPath].concat(args), options)(done);
      }
    });
  };
}

export function copyTask(srcGlobOrDir: string | string[], outRoot: string) {
  if (typeof srcGlobOrDir === 'string') {
    return () => gulp.src(_globify(srcGlobOrDir)).pipe(gulp.dest(outRoot));
  } else {
    return () => gulp.src(srcGlobOrDir.map(name => _globify(name))).pipe(gulp.dest(outRoot));
  }
}

export function cleanTask(glob: string) {
  return () => gulp.src(glob, { read: false }).pipe(gulpClean(null));
}

export function buildAppTask(appName: string) {
  const buildTasks = ['vendor', 'ts', 'scss', 'assets']
    .map(taskName => `:build:${appName}:${taskName}`)
    .filter(taskName => gulp.hasTask(taskName));

  return (done: () => void) => {
    gulpRunSequence(
      'clean',
      'build:components',
      [...buildTasks],
      done
    );
  };
}

export function vendorTask() {
  return () => gulpMerge(
    npmVendorFiles.map(root => {
      const glob = path.join(projectRoot, 'node_modules', root, '**/*.+(js|js.map)');
      return gulp.src(glob).pipe(gulp.dest(path.join(distRoot, 'libs', root)));
    }));
}

export function serverTask(livereload = true) {
  return () => {
    gulpConnect.server({
      root: 'dist/',
      livereload: livereload,
      port: 3200,
      fallback: 'dist/index.html'
    });
  };
}

export function triggerLivereload() {
  gulp.src('dist').pipe(gulpConnect.reload());
}

export function sequenceTask(...args: any[]) {
  return (done: any) => {
    gulpRunSequence(
      ...args,
      done
    );
  };
}
