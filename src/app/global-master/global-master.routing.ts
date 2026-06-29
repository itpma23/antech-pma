import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';


export const SetupRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'organisasi',
      loadChildren: './organisasi/organisasi.module#OrganisasiModule',
      //  canActivate: [AuthGuard]
    },

    {
      path: 'blok',
      loadChildren: './blok/blok.module#BlokModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'supplier',
      loadChildren: './supplier/supplier.module#SupplierModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'customer',
      loadChildren: './customer/customer.module#CustomerModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'uom',
      loadChildren: './uom/uom.module#UomModule',
      //  canActivate: [AuthGuard]
    },

    ]
  }
];
