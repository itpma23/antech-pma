import { Routes } from '@angular/router';
import {AuthGuard}from '../auth/auth.guard';


export const WorkshopRoutes: Routes = [
   {
      path: '',
      children: [

        // {
        // path: 'akun',
        //  loadChildren: './akun/akun.module#AkunModule',
        // //  canActivate: [AuthGuard]
        // },
        {
          path: 'kegiatan',
           loadChildren: './wrk_kegiatan/wrk_kegiatan.module#WrkKegiatanModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'kegiatan-mill',
           loadChildren: './wrk_kegiatan_mill/wrk_kegiatan_mill.module#WrkKegiatanMillModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'laporan-kegiatan',
          loadChildren: './laporan-wrk-kegiatan/laporan-wrk-kegiatan.module#LaporanWrkKegiatanModule',
         //  canActivate: [AuthGuard]
        },
        {
          path: 'laporan-cost-workshop',
          loadChildren: './laporan-cost-workshop/laporan-cost-workshop.module#LaporanCostWorkshopModule',
         //  canActivate: [AuthGuard]
        },
        {
          path: 'proses-workshop-alokasi',
           loadChildren: './proses-workshop-alokasi/proses-workshop-alokasi.module#ProsesWorkshopAlokasiModule',
                   //  canActivate: [AuthGuard]
        },
        ]
    }
];
