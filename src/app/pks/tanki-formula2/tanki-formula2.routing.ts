import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';
import {AuthGuard}from '../../auth/auth.guard';



export const TankiFormula2Routes: Routes = [
   {
      path: '',
      // redirectTo: '/pengajar/list',
      // pathMatch: 'full',
      children: [ {
        path: '',
        component: ListComponent,
        canActivate: [AuthGuard]
        },
       ]
    }
];
