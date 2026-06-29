import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';
import {AuthGuard}from '../../auth/auth.guard';


export const UserActivityRoutes: Routes = [
   {
      path: '',
      children: [ {
        path: '',
        component: ListComponent,
        canActivate:[AuthGuard]
        }]
    }
];
