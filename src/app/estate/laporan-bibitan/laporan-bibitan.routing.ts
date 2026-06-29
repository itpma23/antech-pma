import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';

export const LaporanBibitanRoutes: Routes = [
   {
      path: '',
      children: [ {
        path: '',
        component: ListComponent
        }]
    }
];
