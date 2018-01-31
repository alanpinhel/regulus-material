import { NgModule } from '@angular/core';

import { RmBarraProgressoModule } from './barra-progresso/index';
import { RmTabelaModule } from './tabela/index';

@NgModule({
  imports: [
    RmBarraProgressoModule,
    RmTabelaModule
  ],
  exports: [
    RmBarraProgressoModule,
    RmTabelaModule
  ]
})
export class RmModule { }