import { Routes } from '@angular/router';
import {AuthGuard}from '../auth/auth.guard';


export const AccountingRoutes: Routes = [
   {
      path: '',
      children: [ {
        path: 'akun',
         loadChildren: './akun/akun.module#AkunModule',
        //  canActivate: [AuthGuard]
        },
        {
          path: 'kegiatan-kelompok',
           loadChildren: './kegiatan-kelompok/kegiatan-kelompok.module#KegiatanKelompokModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'periode-akunting',
           loadChildren: './periode-akunting/periode-akunting.module#PeriodeAkuntingModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'uangmuka',
           loadChildren: './acc_uang_muka/acc-uang-muka.module#AccUangMukaModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'permintaan-dana',
           loadChildren: './acc_permintaan_dana/acc_permintaan_dana.module#AccPermintaanDanaModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'kegiatan',
           loadChildren: './kegiatan/kegiatan.module#KegiatanModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'jurnal',
           loadChildren: './acc_jurnal/acc_jurnal.module#AccJurnalModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'auto-jurnal',
           loadChildren: './acc_auto_jurnal/acc_auto_jurnal.module#AccAutoJurnalModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'inter-unit',
           loadChildren: './acc_inter_unit/acc_inter_unit.module#AccInterUnitModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'kasbank',
           loadChildren: './acc_kasbank/acc_kasbank.module#AccKasbankModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'sales-invoice',
           loadChildren: './acc_sales_invoice/acc_sales_invoice.module#AccSalesInvoiceModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'sales-invoice-new',
           loadChildren: './acc_sales_invoice_new/acc_sales_invoice_new.module#AccSalesInvoiceNewModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'permohonan-bayar',
           loadChildren: './permohonan-bayar/permohonan-bayar.module#PermohonanBayarModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'permohonan-bayar-v2',
          loadChildren: './permohonan-bayar-v2/permohonan-bayar-v2.module#PermohonanBayarV2Module',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'tbs-invoice',
           loadChildren: './acc_tbs_invoice/acc_tbs_invoice.module#AccTbsInvoiceModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'kuitansi-pembelian-tbs',
          loadChildren: './acc_kuitansi_pembelian_tbs/acc_kuitansi_pembelian_tbs.module#AccKuitansiPembelianTbs'
        },
        {
          path: 'angkut-invoice',
           loadChildren: './acc_angkut_invoice/acc_angkut_invoice.module#AccAngkutInvoiceModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'sales-performa',
           loadChildren: './acc_sales_performa/acc_sales_performa.module#AccSalesPerformaModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'ap-invoice',
           loadChildren: './acc_ap_invoice/acc_ap_invoice.module#AccApInvoiceModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'uangmuka-realisasi',
           loadChildren: './acc_uang_muka_realisasi/acc_uang_muka_realisasi.module#AccUangMukaRealisasiModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'laporan-kasbank',
           loadChildren: './laporan-kasbank/laporan-kasbank.module#LaporanKasbankModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'laporan-asset',
           loadChildren: './laporan-asset/laporan-asset.module#LaporanAssetModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'laporan-uang-muka',
           loadChildren: './laporan-uang-muka/laporan-uang-muka.module#LaporanUangMukaModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'laporan-uang-muka-realisasi',
           loadChildren: './laporan-uang-muka-realisasi/laporan-uang-muka-realisasi.module#LaporanUangMukaRealisasiModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'laporan-ap',
           loadChildren: './laporan-ap/laporan-ap.module#LaporanApModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'laporan-tbs-invoice',
           loadChildren: './laporan-tbs-invoice/laporan-tbs-invoice.module#LaporanTbsInvoiceModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'laporan-ar',
           loadChildren: './laporan-ar/laporan-ar.module#LaporanArModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'laporan-ar',
           loadChildren: './laporan-ar/laporan-ar.module#LaporanArModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'acc_asset',
           loadChildren: './acc_asset/acc_asset.module#AccAssetModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'acc_asset_tipe',
           loadChildren: './acc_asset_tipe/acc_asset_tipe.module#AccAssetTipeModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'laporan-keuangan',
           loadChildren: './laporan-keuangan/laporan-keuangan.module#LaporanKeuanganModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'laporan-keuangan-inti',
           loadChildren: './laporan-keuangan-inti/laporan-keuangan-inti.module#LaporanKeuanganIntiModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'laporan-cashflow',
           loadChildren: './laporan-cashflow/laporan-cashflow.module#LaporanCashflowModule',
          //  canActivate: [AuthGuard]
        },
        {
          path: 'laporan-pembelian-tbs',
          loadChildren: './laporan-pembelian-tbs/laporan-pembelian-tbs.module#LaporanPembelianTbsModule'
        },
      //   {path: 'piutang-setting',
      //    loadChildren: './piutang-setting/piutang-setting.module#PiutangSettingModule',
      //   //  canActivate: [AuthGuard]
      //   },
      //   {path: 'daftar-piutang',
      //    loadChildren: './daftar-piutang/daftar-piutang.module#DaftarPiutangModule',
      //   //  canActivate: [AuthGuard]
      //   },
      //   {path: 'bayar-piutang',
      //    loadChildren: './bayar-piutang/bayar-piutang.module#BayarPiutangModule',
      //   //  canActivate: [AuthGuard]
      //   },
      //   {path: 'kasbank',
      //    loadChildren: './kasbank/kasbank.module#KasBankModule',
      //   //  canActivate: [AuthGuard]
      //   },
      //   {path: 'proses-piutang',
      //    loadChildren: './proses-piutang/proses-piutang.module#ProsesPiutangModule',
      //   //  canActivate: [AuthGuard]
      //   },{path: 'laporan',
      //   loadChildren: './laporan/laporan.module#LaporanModule',
      //  //  canActivate: [AuthGuard]
      //  },

        ]
    }
];
