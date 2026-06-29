import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';


export const InventoryRoutes: Routes = [
  {
    path: '',
    children: [

      {
        path: 'gudang',
        loadChildren: './gudang/gudang.module#GudangModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'kategori',
        loadChildren: './kategori/kategori.module#KategoriModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'approval-pb',
        loadChildren: './approval-pemakaian-barang/pemakaian-barang.module#PemakaianBrgModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'approvall-settings',
        loadChildren: './approvall-settings/approvall-setting.module#ApprovallSettingModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'pemakaian-barang',
        loadChildren: './pemakaian-barang/pemakaian-barang.module#PemakaianBrgModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'pemakaian-barang-online',
        loadChildren: './pemakaian-barang-online/pemakaian-barang.module#PemakaianBrgOnlineModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'pengeluaran-barang',
        loadChildren: './pengeluaran-barang/pengeluaran-barang.module#PengeluaranBarangModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'retur-pemakaian-barang',
        loadChildren: './retur-pemakaian-barang/retur-pemakaian-barang.module#ReturPemakaianBrgModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'laporan-penerimaan-po',
        loadChildren: './laporan-penerimaan-po/laporan-penerimaan-po.module#LaporanPenerimaanPoModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'laporan-pemakaian-barang',
        loadChildren: './laporan-pemakaian-barang/laporan-pemakaian-barang.module#LaporanPemakaianBarangModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'laporan-permintaan-barang',
        loadChildren: './laporan-permintaan-barang/laporan-permintaan-barang.module#LaporanPermintaanBarangModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'laporan-penerimaan-tanpa-po',
        loadChildren: './laporan-penerimaan-tanpa-po/laporan-penerimaan-tanpa-po.module#LaporanPenerimaanTanpaPoModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'laporan-permintaan-pindah-gudang',
        loadChildren: './laporan-permintaan-pindah-gudang/laporan-permintaan-pindah-gudang.module#LaporanPermintaanPindahGudangModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'laporan-pindah-gudang',
        loadChildren: './laporan-pindah-gudang/laporan-pindah-gudang.module#LaporanPindahGudangModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'laporan-penerimaan-pindah-gudang',
        loadChildren: './laporan-penerimaan-pindah-gudang/laporan-penerimaan-pindah-gudang.module#LaporanPenerimaanPindahGudangModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'laporan-retur-pemakaian-barang',
        loadChildren: './laporan-retur-pemakaian-barang/laporan-retur-pemakaian-barang.module#LaporanReturPemakaianBarangModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'item',
        loadChildren: './item/item.module#ItemModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'item-2',
        loadChildren: './item-2/item2.module#Item2Module',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'penerimaan-tanpa-po',
        loadChildren: './penerimaan-tanpa-po/penerimaan-tanpa-po.module#PenerimaanTanpaPoModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'adj',
        loadChildren: './adj/adj.module#AdjModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'penerimaan-po',
        loadChildren: './penerimaan-po/penerimaan-po.module#PenerimaanPoModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'laporan-stok',
        loadChildren: './laporan-stok/laporan-stok.module#LaporanStokModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'laporan-stok-harga',
        loadChildren: './laporan-stok-harga/laporan-stok-harga.module#LaporanStokHargaModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'permintaan-barang',
        loadChildren: './permintaan-barang/permintaan-barang.module#PermintaanModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'permintaan-pindah-gudang',
        loadChildren: './permintaan-pindah-gudang/permintaan_pindah_gudang.module#PermintaanPindahGudangModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'penerimaan-pindah-gudang',
        loadChildren: './penerimaan-pindah-gudang/penerimaan_pindah_gudang.module#PenerimaanPindahGudangModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'pindah-gudang',
        loadChildren: './pindah-gudang/pindah_gudang.module#PindahGudangModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'dashboard',
        loadChildren: './inventory-dashboard/inventory-dashboard.module#InventoryDashboardModule',
        //  canActivate: [AuthGuard]
      }

    ]
  }
];
