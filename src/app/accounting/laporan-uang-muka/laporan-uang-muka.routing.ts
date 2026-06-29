import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';

export const LaporanUangMukaRoutes: Routes = [
   {
      path: '',
      children: [ {
        path: '',
        component: ListComponent
        }]
    }
];
