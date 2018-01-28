declare const System: any;

System.config({
  map: {
    'rxjs': 'libs/rxjs',
    'main': 'main.js',
    '@angular/core': 'libs/@angular/core/bundles/core.umd.js',
    '@angular/common': 'libs/@angular/common/bundles/common.umd.js',
    '@angular/compiler': 'libs/@angular/compiler/bundles/compiler.umd.js',
    '@angular/http': 'libs/@angular/http/bundles/http.umd.js',
    '@angular/forms': 'libs/@angular/forms/bundles/forms.umd.js',
    '@angular/router': 'libs/@angular/router/bundles/router.umd.js',
    '@angular/animations': 'libs/@angular/animations/bundles/animations.umd.js',
    '@angular/animations/browser': 'libs/@angular/animations/bundles/animations-browser.umd.js',
    '@angular/platform-browser': 'libs/@angular/platform-browser/bundles/platform-browser.umd.js',
    '@angular/platform-browser/animations': 'libs/@angular/platform-browser/bundles/platform-browser-animations.umd.js',
    '@angular/platform-browser-dynamic': 'libs/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
    'regulus-material': 'regulus-material/bundles/regulus-material.umd.js'
  },
  packages: {
    'rxjs': { main: 'index' },
    '.': {
      defaultExtension: 'js'
    }
  }
});
