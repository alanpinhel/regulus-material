import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { DEMO_APP_ROUTES } from './demo-app/routes';
import { DemoApp } from './demo-app/demo-app';
import { Home } from './home/home';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        RouterModule.forRoot(DEMO_APP_ROUTES, { useHash: true })
    ],
    declarations: [
        DemoApp,
        Home
    ],
    entryComponents: [
        DemoApp
    ]
})
export class DemoAppModule {
    constructor(private _appRef: ApplicationRef) { }

    ngDoBootstrap() {
        this._appRef.bootstrap(DemoApp);
    }
}