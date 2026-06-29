import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';


export const TraksiRoutes: Routes = [
  {
    path: '',
    children: [

      // {
      // path: 'akun',
      //  loadChildren: './akun/akun.module#AkunModule',
      // //  canActivate: [AuthGuard]
      // },
      {
        path: 'jenis-traksi',
        loadChildren: './jenis-traksi/jenis-traksi.module#JenisTraksiModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'kendaraan',
        loadChildren: './kendaraan/kendaraan.module#KendaraanModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'kegiatan-kendaraan',
        loadChildren: './kegiatan_kendaraan/kegiatan_kendaraan.module#KegiatanKendaraanModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'laporan-kegiatan-kendaraan',
        loadChildren: './laporan-kegiatan-kendaraan/laporan-kegiatan-kendaraan.module#LaporanKegiatanKendaraanModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'laporan-cost-traksi',
        loadChildren: './laporan-cost-traksi/laporan-cost-traksi.module#LaporanCostTraksiModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'proses-alokasi',
        loadChildren: './proses-alokasi/proses-alokasi.module#ProsesAlokasiModule',
        //  canActivate: [AuthGuard]
      },
    ]
  }
];
