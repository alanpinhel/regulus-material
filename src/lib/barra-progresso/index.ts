import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RmBarraProgresso } from './barra-progresso';

export * from './barra-progresso';

@NgModule({
  imports: [CommonModule],
  exports: [RmBarraProgresso],
  declarations: [RmBarraProgresso],
})
export class RmBarraProgressoModule { }
