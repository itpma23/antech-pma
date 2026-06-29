import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';

export const LaporanCostMillRoutes: Routes = [
   {
      path: '',
      children: [ {
        path: '',
        component: ListComponent
        }]
    }
];
