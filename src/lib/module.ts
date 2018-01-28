import { NgModule } from '@angular/core';

import { RmBarraProgresso } from './barra-progresso/index';

@NgModule({
  imports: [RmBarraProgresso],
  exports: [RmBarraProgresso]
})
export class RmModule { }