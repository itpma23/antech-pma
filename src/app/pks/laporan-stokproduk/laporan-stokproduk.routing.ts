import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';

export const LaporanStokProdukRoutes: Routes = [
   {
      path: '',
      children: [ {
        path: '',
        component: ListComponent
        }]
    }
];
