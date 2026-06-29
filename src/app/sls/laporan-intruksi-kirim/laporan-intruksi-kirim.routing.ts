import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';

export const LaporanIntruksiKirimRoutes: Routes = [
   {
      path: '',
      children: [ {
        path: '',
        component: ListComponent
        }]
    }
];
