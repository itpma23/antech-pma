import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';

export const LaporanSaldoCutiRoutes: Routes = [
   {
      path: '',
      children: [ {
        path: '',
        component: ListComponent
        }]
    }
];
