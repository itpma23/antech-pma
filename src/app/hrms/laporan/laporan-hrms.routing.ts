import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';

export const LaporanHrmsRoutes: Routes = [
   {
      path: '',
      children: [ {
        path: '',
        component: ListComponent
        }]
    }
];
