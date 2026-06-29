import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';

export const LaporanPenerimaanTanpaPoRoutes: Routes = [
   {
      path: '',
      children: [ {
        path: '',
        component: ListComponent
        }]
    }
];
