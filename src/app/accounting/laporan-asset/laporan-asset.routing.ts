import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';

export const LaporanAssetRoutes: Routes = [
   {
      path: '',
      children: [ {
        path: '',
        component: ListComponent
        }]
    }
];
