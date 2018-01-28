import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { DEMO_APP_ROUTES } from './app/routes';
import { App } from './app/app';
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
        App,
        Home
    ],
    entryComponents: [
        App
    ]
})
export class AppModule {
    constructor(private _appRef: ApplicationRef) { }

    ngDoBootstrap() {
        this._appRef.bootstrap(App);
    }
}