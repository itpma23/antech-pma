import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';


export const HrmsRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'tipe-karyawan',
      loadChildren: './tipe_karyawan/tipe-karyawan.module#TipeKaryawanModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'departemen',
      loadChildren: './departemen/departemen.module#DepartemenModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'jabatan',
      loadChildren: './jabatan/jabatan.module#JabatanModule',
      //  canActivate: [AuthGuard]
    },

    {
      path: 'golongan',
      loadChildren: './golongan/golongan.module#GolonganModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'pangkat',
      loadChildren: './pangkat/pangkat.module#PangkatModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'hrms-lokasi',
      loadChildren: './lokasi/hrms-lokasi.module#HrmsLokasiModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'komponen-gaji',
      loadChildren: './komponen_gaji/komponen-gaji.module#KomponenGajiModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'karyawan-gaji',
      loadChildren: './karyawan-gaji/karyawan-gaji.module#KaryawanGajiModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'periode-gaji',
      loadChildren: './periode-gaji/periode-gaji.module#PeriodeGajiModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'hrms-absensi',
      loadChildren: './absensi/absensi.module#HrmsAbsensiModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'hrms-lembur',
      loadChildren: './lembur/lembur.module#HrmsLemburModule',
      //  canActivate: [AuthGuard]
    }, {
      path: 'hrms-potongan',
      loadChildren: './potongan/potongan.module#HrmsPotonganModule',
      //  canActivate: [AuthGuard]
    }, {
      path: 'hrms-pendapatan',
      loadChildren: './pendapatan/pendapatan.module#HrmsPendapatanModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'laporan',
      loadChildren: './laporan/laporan-hrms.module#LaporanHrmsModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'laporan-karyawan',
      loadChildren: './laporan-karyawan/laporan-karyawan.module#LaporanKaryawanModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'laporan-saldo-cuti',
      loadChildren: './laporan-saldo-cuti/laporan-saldo-cuti.module#LaporanSaldoCutiModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'laporan-absensi',
      loadChildren: './laporan-absensi/laporan-absensi.module#LaporanAbsensiModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'laporan-lembur',
      loadChildren: './laporan-lembur/laporan-lembur.module#LaporanLemburModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'pengajuan-cuti',
      loadChildren: './pengajuan-cuti/pengajuan-cuti.module#PengajuanCutiModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'pengajuan-cuti-approval',
      loadChildren: './pengajuan-cuti-approval/pengajuan_cuti_approval.module#PengajuanCutiApprovalModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'approvall-setting-pengajuan-cuti',
      loadChildren: './approvall-setting-pengajuan-cuti/approvall-setting-pengajuan-cuti.module#ApprovallSettingPengajuanCutiModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'jenis-absensi',
      loadChildren: './jenis-absensi/jenis-absensi.module#JenisAbsensiModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'proses-payroll',
      loadChildren: './proses-payroll/proses-payroll.module#ProsesPayrollModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'unpost-payroll',
      loadChildren: './unpost-payroll/unpost-payroll.module#UnpostPayrollModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'proses-payroll-estate',
      loadChildren: './proses-payroll-estate/proses-payroll-estate.module#ProsesPayrollEstateModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'basis-lembur',
      loadChildren: './basis-lembur/basis-lembur.module#BasisLemburModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'libur',
      loadChildren: './libur/libur.module#LiburModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'catu-beras',
      loadChildren: './catu-beras/catu-beras.module#CatuBerasModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'cuti-saldo',
      loadChildren: './cuti-saldo/cuti-saldo.module#CutiSaldoModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'perjalanan-dinas',
      loadChildren: './perjalanan-dinas/perjalanan-dinas.module#PerjalananDinasModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'realisasi-perjalanan-dinas',
      loadChildren: './realisasi-perjalanan-dinas/realisasi-perjalanan-dinas.module#RealisasiPerjalananDinasModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'komponen-perjalanan',
      loadChildren: './komponen-perjalanan/komponen-perjalanan.module#KomponenPerjalananModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'absensi-scan',
      loadChildren: './absensi-scan/absensi-scan.module#AbsensiScanModule',
      //  canActivate: [AuthGuard]
    },


    ]
  }
];
