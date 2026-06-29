import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';
// import {AuthGuard}from '../auth/auth.guard';
import { DetailComponent } from './detail/detail.component';


export const QuotationRoutes: Routes = [
   {
      path: '',
      children: [ {
        path: '',
        component: ListComponent,
        // canActivate:[AuthGuard]
        },
         {
            path: 'detail/:quotation_id',
            component: DetailComponent,
            // canActivate:[AuthGuard]
            },
        ]
    }
];
