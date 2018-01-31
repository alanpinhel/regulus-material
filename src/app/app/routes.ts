import { Routes } from '@angular/router';

import { Home } from '../home/home';
import { BarraProgresso } from '../barra-progresso/barra-progresso';
import { Tabela } from 'tabela/tabela';

export const appRoutes: Routes = [
  { path: '', component: Home },
  { path: 'barra-progresso', component: BarraProgresso },
  { path: 'tabela', component: Tabela }
];
