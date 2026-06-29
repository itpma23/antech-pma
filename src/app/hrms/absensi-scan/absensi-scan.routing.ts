import { Routes } from '@angular/router';
import {AbsensiScanComponent } from './absensi-scan/absensi-scan.component';



export const AbsensiScanRoutes: Routes = [
  {
    path: '',
    // redirectTo: '/pengajar/list',
    // pathMatch: 'full',
    children: [
    {
      path: '',
      component: AbsensiScanComponent,
      // canActivate: [AuthGuard]
    },
    ]
  }
];
