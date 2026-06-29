import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';

export const LaporanSpkBappKendaraanRoutes: Routes = [
   {
      path: '',
      children: [ {
        path: '',
        component: ListComponent
        }]
    }
];
