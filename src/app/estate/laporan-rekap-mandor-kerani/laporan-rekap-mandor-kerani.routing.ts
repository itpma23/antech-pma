import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';

export const LaporanRekapRoutes: Routes = [
   {
      path: '',
      children: [ {
        path: '',
        component: ListComponent
        }]
    }
];
