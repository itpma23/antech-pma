import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';

export const LaporanPenerimaanPoRoutes: Routes = [
   {
      path: '',
      children: [ {
        path: '',
        component: ListComponent
        }]
    }
];
