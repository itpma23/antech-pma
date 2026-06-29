import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';


export const EstateRoutes: Routes = [
  {
    path: '',
    children: [
      {
      path: 'spat',
      loadChildren: './spat/spat.module#SpatModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'spatv2',
      loadChildren: './spatv2/spatv2.module#SpatV2Module',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'spat_timbangan',
      loadChildren: './spat_timbangan/spat_timbangan.module#SpatTimbanganModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'rekap-panen',
      loadChildren: './rekap-panen/rekap-panen.module#RekapPanenModule',
      //  canActivate: [AuthGuard]
    },
  
    {
      path: 'produksi-panen',
      loadChildren: './produksi-panen/produksi-panen.module#ProduksiPanenModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'sensus-panen',
      loadChildren: './sensus-panen/sensus-panen.module#SensusPanenModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'laporan-produksi-panen',
      loadChildren: './laporan-produksi-panen/laporan-produksi-panen.module#LaporanProduksiPanenModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'bkm-pemeliharaan',
      loadChildren: './bkm_pemeliharaan/bkm_pemeliharaan.module#BkmPemeliharaanModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'bkm-umum',
      loadChildren: './bkm_umum/bkm_umum.module#BkmUmumModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'bkm-bibitan',
      loadChildren: './bkm_bibitan/bkm_bibitan.module#BkmBibitanModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'bkm-panen',
      loadChildren: './bkm_panen/bkm_panen.module#BkmPanenModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'denda-panen',
      loadChildren: './denda_panen/denda_panen.module#DendaPanenModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'kode-denda-panen',
      loadChildren: './kode_denda_panen/kode_denda_panen.module#KodeDendaPanenModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'kode-penalty-panen',
      loadChildren: './kode_penalty_panen/kode_penalty_panen.module#KodePenaltyPanenModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'spk',
      loadChildren: './spk/spk.module#SpkModule',
      //  canActivate: [AuthGuard]
    },
    // {
    //   path: 'spk-bapp',
    //   loadChildren: './spk-bapp/spk-bapp.module#SpkBappModule',
    //   //  canActivate: [AuthGuard]
    // },
    {
      path: 'spk-ba',
      loadChildren: './spk-ba/spk-ba.module#SpkBAModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'spk-kendaraan',
      loadChildren: './spk-kendaraan/spk-kendaraan.module#SpkKendaraanModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'spk-bapp-kendaraan',
      loadChildren: './spk-bapp-kendaraan/spk-bapp-kendaraan.module#SpkBappKenadaraanModule',
      //  canActivate: [AuthGuard]
    },

    {
      path: 'bjr',
      loadChildren: './bjr/bjr.module#BjrModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'bibit',
      loadChildren: './bibit/bibit.module#BibitModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'curah-hujan',
      loadChildren: './curah-hujan/curah-hujan.module#CurahHujanModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'taksasi',
      loadChildren: './taksasi/taksasi.module#TaksasiModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'premi-basis-panen',
      loadChildren: './premi-basis-panen/premi-basis-panen.module#BasisPanenModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'potongan-karyawan',
      loadChildren: './potongan-karyawan/potongan-karyawan.module#PotonganKaryawanModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'laporan-curah-hujan',
      loadChildren: './laporan-curah-hujan/laporan-curah-hujan.module#LaporanCurahHujanModule',
    },
    {
      path: 'laporan-umum',
      loadChildren: './laporan-umum/laporan-umum.module#LaporanUmumModule',
    },
    {
      path: 'laporan-panen',
      loadChildren: './laporan-panen/laporan-panen.module#LaporanPanenModule',
    },
    {
      path: 'laporan-bahan',
      loadChildren: './laporan-bahan/laporan-bahan.module#LaporanBahanModule',
    },
    {
      path: 'laporan-pemeliharaan',
      loadChildren: './laporan-pemeliharaan/laporan-pemeliharaan.module#LaporanPemeliharaanModule',
    },
    {
      path: 'laporan-bibitan',
      loadChildren: './laporan-bibitan/laporan-bibitan.module#LaporanBibitanModule',
    },
    {
      path: 'rekap-absensi-kebun',
      loadChildren: './rekap_absensi_kebun/rekap_absensi_kebun.module#RekapAbsensiKebunModule',
    },
    {
      path: 'laporan-cost',
      loadChildren: './laporan-cost/laporan-cost.module#LaporanCostBlokModule',
    },
    {
      path: 'laporan-cost-estate',
      loadChildren: './laporan-cost-estate/laporan-cost-estate.module#LaporanCostEstateModule',
    },
    {
      path: 'laporan-cost-estate-bgt',
      loadChildren: './laporan-cost-estate-bgt/laporan-cost-estate-bgt.module#LaporanCostEstateBgtModule',
    },
    {
      path: 'laporan-spk',
      loadChildren: './laporan-spk/laporan-spk.module#LaporanSpkModule',
    },
    {
      path: 'laporan-spk-bapp',
      loadChildren: './laporan-spk-bapp/laporan-spk-bapp.module#LaporanSpkBappModule',
    },
    {
      path: 'laporan-spk-kendaraan',
      loadChildren: './laporan-spk-kendaraan/laporan-spk-kendaraan.module#LaporanSpkKendaraanModule',
    },
    {
      path: 'laporan-spk-bapp-kendaraan',
      loadChildren: './laporan-spk-bapp-kendaraan/laporan-spk-bapp-kendaraan.module#LaporanSpkBappKendaraanModule',
    },
    {
      path: 'laporan-rekap-mandor-kerani',
      loadChildren: './laporan-rekap-mandor-kerani/laporan-rekap-mandor-kerani.module#LaporanRekapMandorKeraniModule',
    },
    {
      path: 'param-premi-mandor-kerani',
      loadChildren: './param-premi-mandor-kerani/param-premi-mandor-kerani.module#ParamPremiMandorKeraniModule',
      //  canActivate: [AuthGuard]
    },

    ]
  }
];
