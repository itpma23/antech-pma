import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';

export const LaporanCostWorkshopRoutes: Routes = [
   {
      path: '',
      children: [ {
        path: '',
        component: ListComponent
        }]
    }
];
