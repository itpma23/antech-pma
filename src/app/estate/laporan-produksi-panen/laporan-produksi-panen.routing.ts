import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';

export const LaporanProduksiPanenRoutes: Routes = [
   {
      path: '',
      children: [ {
        path: '',
        component: ListComponent
        }]
    }
];
