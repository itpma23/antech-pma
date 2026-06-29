import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';

export const LaporanArRoutes: Routes = [
   {
      path: '',
      children: [ {
        path: '',
        component: ListComponent
        }]
    }
];
