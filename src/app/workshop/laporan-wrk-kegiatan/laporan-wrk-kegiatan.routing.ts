import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';

export const LaporanWrkKegiatanRoutes: Routes = [
   {
      path: '',
      children: [ {
        path: '',
        component: ListComponent
        }]
    }
];
