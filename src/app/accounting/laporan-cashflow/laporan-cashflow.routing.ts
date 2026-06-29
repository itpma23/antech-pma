import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';

export const LaporanCashflowRoutes: Routes = [
   {
      path: '',
      children: [ {
        path: '',
        component: ListComponent
        }]
    }
];
