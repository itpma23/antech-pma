import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';

export const LaporanUangMukaRealisasiRoutes: Routes = [
   {
      path: '',
      children: [ {
        path: '',
        component: ListComponent
        }]
    }
];
