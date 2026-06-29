import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';
import {AuthGuard}from '../../auth/auth.guard';


export const DashboardSettingRoutes: Routes = [
   {
      path: '',
      children: [ {
        path: '',
        component: ListComponent,
        // canActivate:[AuthGuard]
        }]
    }
];
