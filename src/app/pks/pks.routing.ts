import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';


export const PksRoutes: Routes = [
  {
    path: '',
    children: [
    {
      path: 'timbangan',
      loadChildren: './timbangan/timbangan.module#TimbanganModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'timbangan-kirim',
      loadChildren: './timbangan-kirim/timbangan-kirim.module#TimbanganKirimModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'timbangan-customer',
      loadChildren: './timbangan-customer/timbangan-customer.module#TimbanganCustomerModule',
      //  canActivate: [AuthGuard]
    },

    {
      path: 'tangki',
      loadChildren: './tangki/tangki.module#TangkiModule',
      //  canActivate: [AuthGuard]
    },
      {
        path: 'shift',
        loadChildren: './shift/shift.module#ShiftModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'sounding',
        loadChildren: './sounding/sounding.module#SoundingModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'pengolahan',
        loadChildren: './pengolahan/pengolahan.module#PengolahanModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'lab',
        loadChildren: './lab/lab.module#LabModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'sjpp',
        loadChildren: './sjpp/sjpp.module#SjppModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'vsjt',
        loadChildren: './vsjt/vsjt.module#VsjtModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'transport',
        loadChildren: './transport/transport.module#TransportModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'laporan-pengiriman',
        loadChildren: './laporan-pengiriman/laporan-pengiriman.module#LaporanPengirimanModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'laporan-produksi',
        loadChildren: './laporan-produksi/laporan-produksi.module#LaporanProduksiModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'laporan-penerimaantbs',
        loadChildren: './laporan-penerimaantbs/laporan-penerimaantbs.module#LaporanPenerimaanTbsModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'laporan-stokproduk',
        loadChildren: './laporan-stokproduk/laporan-stokproduk.module#LaporanStokProdukModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'laporan-pengolahan',
        loadChildren: './laporan-pengolahan/laporan-pengolahan.module#LaporanPengolahanModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'harga-tbs',
        loadChildren: './harga-tbs/harga-tbs.module#HargaModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'harga-angkut',
        loadChildren: './harga-angkut/harga-angkut.module#HargaAngkutModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'tangki',
        loadChildren: './tangki/tangki.module#TangkiModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'tanki-formula1',
        loadChildren: './tanki-formula1/tanki-formula1.module#TankiFormula1Module',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'tanki-formula2',
        loadChildren: './tanki-formula2/tanki-formula2.module#TankiFormula2Module',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'tanki-formula3',
        loadChildren: './tanki-formula3/tanki-formula3.module#TankiFormula3Module',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'produksi-harian',
        loadChildren: './produksi-harian/produksi-harian.module#ProduksiHarianModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'lab-pengolahan',
        loadChildren: './lab-pengolahan/lab-pengolahan.module#LabPengolahanModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'jenis-maintenance',
        loadChildren: './jenis-maintenance/jenis-maintenance.module#JenisMaintenanceModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'maintenance-mesin',
        loadChildren: './maintenance-mesin/maintenance-mesin.module#MaintenanceMesinModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'maintenance-log',
        loadChildren: './maintenance-log/maintenance-log.module#MaintenanceLogModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'mesin-log',
        loadChildren: './mesin-log/mesin-log.module#MesinLogModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'lhp',
        loadChildren: './lhp/lhp.module#LhpModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'laporan-lhp-rekap',
        loadChildren: './laporan-lhp/laporan-lhp.module#LaporanLhpModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'sounding-kernel',
        loadChildren: './sounding-kernel/sounding-kernel.module#SoundingKernelModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'laporan-cost-stasiun',
        loadChildren: './laporan-cost-stasiun/laporan-cost-stasiun.module#LaporanCostStasiunModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'laporan-cost-mill',
        loadChildren: './laporan-cost-mill/laporan-cost-mill.module#LaporanCostMillModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'laporan-maintenance',
        loadChildren: './laporan-maintenance/laporan-maintenance.module#LaporanMaintenanceModule',
        //  canActivate: [AuthGuard]
      },
    ]
  }
];
