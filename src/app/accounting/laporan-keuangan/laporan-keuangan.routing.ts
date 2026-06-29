import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';

export const LaporanKeuanganRoutes: Routes = [
   {
      path: '',
      children: [ {
        path: '',
        component: ListComponent
        }]
    }
];
