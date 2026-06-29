import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';

export const LaporanPermintaanBarangRoutes: Routes = [
   {
      path: '',
      children: [ {
        path: '',
        component: ListComponent
        }]
    }
];
