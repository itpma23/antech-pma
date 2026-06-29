import { Routes } from '@angular/router';
import {AuthGuard}from '../auth/auth.guard';


export const PrcRoutes: Routes = [
   {
      path: '',
      children: [
        {
          path: 'approvall-setting',
          loadChildren: './approvall-setting/approvall-setting.module#ApprovallSettingModule',
        },
        {
          path: 'approvall-setting-po',
          loadChildren: './approvall-setting-po/approvall-setting-po.module#ApprovallSettingPoModule',
        },
        {
          path: 'franco',
          loadChildren: './franco/franco.module#FrancoModule',
        },
        {
          path: 'syarat-bayar',
          loadChildren: './syarat-bayar/syarat-bayar.module#SyaratBayarModule',
        },
        {
          path: 'pp',
          loadChildren: './pp/pp.module#PpModule',
        },
        {
          path: 'pp-closing',
          loadChildren: './pp-closing/pp-closing.module#PpClosingModule',
        },
        {
          path: 'pp-approval',
          loadChildren: './pp-approval/pp_approval.module#PpApprovalModule',
        },
        {
          path: 'po',
          loadChildren: './po/po.module#PoModule',
        },
        {
          path: 'po-revisi',
          loadChildren: './po-revisi/po-revisi.module#PoRevisiModule',
        },
        {
          path: 'po-closing',
          loadChildren: './po-closing/po-closing.module#PoClosingModule',
        },
        {
          path: 'quotation',
          loadChildren: './quotation/quotation.module#QuotationModule',
        },
        {
          path: 'po-approval',
          loadChildren: './po-approval/po_approval.module#PoApprovalModule',
        },
        {
          path: 'kontrak-pembelian',
          loadChildren: './kontrak-pembelian/kontrak-pembelian.module#KontrakPembelianModule',
        },
        {
          path: 'kontrak-angkut',
          loadChildren: './kontrak-angkut/kontrak-angkut.module#KontrakAngkutModule',
        },
        {
          path: 'rekap-angkut',
          loadChildren: './rekap-angkut/rekap-angkut.module#RekapAngkutModule',
        },
        {
          path: 'rekap-penerimaan',
          loadChildren: './rekap-penerimaan/rekap-penerimaan.module#RekapPenerimaanModule',
        },
        {
          path: 'laporan-pp',
          loadChildren: './laporan-pp/laporan-pp.module#LaporanPPModule',
        },
        {
          path: 'laporan-po',
          loadChildren: './laporan-po/laporan-po.module#LaporanPOModule',
        },
        {
          path: 'ttd',
          loadChildren: './ttd/ttd.module#TtdModule',
        },
        {
          path: 'approvall-pb',
          loadChildren: './pp-approval/pp_approval.module#PpApprovalModule',
        },
      ]
    }
];
