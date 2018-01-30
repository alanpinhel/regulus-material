import { Routes } from '@angular/router';

import { Home } from '../home/home';
import { BarraProgresso } from '../barra-progresso/barra-progresso';

export const appRoutes: Routes = [
  { path: '', component: Home },
  { path: 'barra-progresso', component: BarraProgresso }
];
