import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DemoAppModuleNgFactory } from './demo-app-module.ngfactory';

platformBrowserDynamic().bootstrapModuleFactory(DemoAppModuleNgFactory);
