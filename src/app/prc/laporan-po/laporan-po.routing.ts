import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';

export const LaporanPORoutes: Routes = [
   {
      path: '',
      children: [ {
        path: '',
        component: ListComponent
        }]
    }
];
