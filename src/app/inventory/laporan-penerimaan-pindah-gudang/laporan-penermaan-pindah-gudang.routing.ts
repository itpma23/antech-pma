import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';

export const LaporanPenerimaanPindahGudangRoutes: Routes = [
   {
      path: '',
      children: [ {
        path: '',
        component: ListComponent
        }]
    }
];
