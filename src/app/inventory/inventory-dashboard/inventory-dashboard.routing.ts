import { Routes } from '@angular/router';

import {AuthGuard}from '../../auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';



export const InventoryDashboardRoutes: Routes = [
   {
      path: '',
      // redirectTo: '/pengajar/list',
      // pathMatch: 'full',
      children: [ {
        path: '',
        component:DashboardComponent,
        canActivate: [AuthGuard]
        },
       ]
    }
];
