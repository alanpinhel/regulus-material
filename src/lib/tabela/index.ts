import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RmTabela } from './tabela';

export * from './tabela';

@NgModule({
  imports: [CommonModule],
  exports: [RmTabela],
  declarations: [RmTabela]
})
export class RmTabelaModule { }
