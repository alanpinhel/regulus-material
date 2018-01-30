import { NgModule } from '@angular/core';

import { RmBarraProgressoModule } from './barra-progresso/index';

@NgModule({
  imports: [RmBarraProgressoModule],
  exports: [RmBarraProgressoModule]
})
export class RmModule { }