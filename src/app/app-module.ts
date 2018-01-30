import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { RmModule } from 'regulus-material';

import { appRoutes } from './app/routes';
import { App } from './app/app';
import { Home } from './home/home';
import { BarraProgresso } from './barra-progresso/barra-progresso';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    RmModule
  ],
  declarations: [
    App,
    Home,
    BarraProgresso
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