import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';

export const LaporanMaintenanceRoutes: Routes = [
   {
      path: '',
      children: [ {
        path: '',
        component: ListComponent
        }]
    }
];
