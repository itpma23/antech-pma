import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';
import {AuthGuard}from '../../auth/auth.guard';


export const KaryawanRoutes: Routes = [
   {
      path: '',
      // redirectTo: '/karyawan/list',
      // pathMatch: 'full',
      children: [ {
        path: '',
        component: ListComponent,
        canActivate: [AuthGuard]
        },
        {
          path: 'detail/:karyawan_id',
          canActivate: [AuthGuard]
          }]
    }
];
