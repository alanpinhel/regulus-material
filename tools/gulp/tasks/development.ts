import * as path from 'path';
import { task, watch } from 'gulp';
import { distRoot, sourceRoot } from '../constants';
import { sassBuildTask, tsBuildTask, copyTask, buildAppTask, vendorTask, serverTask, sequenceTask, triggerLivereload } from '../util/task-helpers';

const appDir = path.join(sourceRoot, 'app');
const outDir = distRoot;
const tsconfigPath = path.join(appDir, 'tsconfig.json');

task(':watch:devapp', () => {
  watch(path.join(appDir, '**/*.ts'), [':build:devapp:ts', triggerLivereload]);
  watch(path.join(appDir, '**/*.scss'), [':build:devapp:scss', triggerLivereload]);
  watch(path.join(appDir, '**/*.html'), [':build:devapp:assets', triggerLivereload]);
});

task(':build:devapp:vendor', vendorTask());
task(':build:devapp:ts', tsBuildTask(tsconfigPath));
task(':build:devapp:scss', sassBuildTask(outDir, appDir));
task(':build:devapp:assets', copyTask(appDir, outDir));
task('build:devapp', buildAppTask('devapp'));
task(':serve:devapp', serverTask(true));
task('serve:devapp', ['build:devapp'], sequenceTask([':serve:devapp', ':watch:components', ':watch:devapp']));
