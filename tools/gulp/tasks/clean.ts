import { task } from 'gulp';
import { distRoot } from '../constants';
import { cleanTask } from '../util/task-helpers';

task('clean', cleanTask(distRoot));
