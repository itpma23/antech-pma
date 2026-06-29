import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';


export const SlsRoutes: Routes = [
  {
    path: '',
    children: [

    {
      path: 'kontrak-penjualan',
      loadChildren: './kontrak-penjualan/kontrak-penjualan.module#KontrakModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'intruksi-kirim',
      loadChildren: './intruksi-kirim/intruksi-kirim.module#IntruksiModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'rekap-pengiriman',
      loadChildren: './rekap-pengiriman/rekap-pengiriman.module#RekapModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'invoice',
      loadChildren: './invoice/invoice.module#InvoiceModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'laporan-kontrak',
      loadChildren: './laporan-kontrak/laporan-kontrak.module#LaporanKontrakModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'laporan-rekap-pengiriman',
      loadChildren: './laporan-rekap-pengiriman/laporan-rekap-pengiriman.module#LaporanRekapPengirimanModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'laporan-intruksi-kirim',
      loadChildren: './laporan-intruksi-kirim/laporan-intruksi-kirim.module#LaporanIntruksiKirimModule',
      //  canActivate: [AuthGuard]
    }



    ]
  }
];
