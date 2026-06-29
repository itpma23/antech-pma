import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';
import {AuthGuard}from '../../auth/auth.guard';
import { DetailComponent } from './detail/detail.component';



export const SpkBappRoutes: Routes = [
   {
      path: '',
      // redirectTo: '/pengajar/list',
      // pathMatch: 'full',
      children: [
         {
            path: '',
            component: ListComponent,
            canActivate: [AuthGuard]
         },
         {
            path: 'detail/:spk_id',
            component: DetailComponent,
            // canActivate:[AuthGuard]
         }
       ]
    }
];
