import { Routes } from "@angular/router";

export const TradingRoutes: Routes = [
    {
        path: '',
        children: [

            {
                path: 'pr',
                loadChildren: './pr/pr.module#PrModule',
                //  canActivate: [AuthGuard]
            },
            {
                path: 'pr-approval',
                loadChildren: './pr-approval/pr_approval.module#PrApprovalModule',
            },
            {
                path: 'pr-list',
                loadChildren: './pr-closing/pr-closing.module#PrClosingModule',
            },







            {
                path: 'po',
                loadChildren: './po/po-trading.module#PoTradingModule',
            },
            {
                path: 'po-revisi'
                , loadChildren: './po-revisi/trading-po-revisi.module#TradingPoRevisiModule',
            },
            {
                path: 'po-closing',
                loadChildren: './po-closing/trading-po-closing.module#TradingPoClosingModule',

            },
            {
                path: 'rc',
                loadChildren: './penerimaan-po/trading-penerimaan-po.module#TradingPenerimaanPoModule',
            },
            {
                path: 'timbangan-kirim',
                loadChildren: './timbangan-kirim/trading-timbangan-kirim.module#TradingTimbanganKirimModule',
            },
            {
                path: 'instruksi-kirim',
                loadChildren: './instruksi-kirim/trading-instruksi-kirim.module#TradingInstruksiKirimModule',
            },
            {
                path: 'kontrak',
                loadChildren: './kontrak-penjualan/trading-kontrak-penjualan.module#TradingKontrakModule',
            },
            {
                path: 'validasi',
                loadChildren: './vsjt/trading-vsjt.module#TradingVsjtModule',
            },
            {
                path: 'rekap-pengiriman',
                loadChildren: './rekap-pengiriman/trading-rekap-pengiriman.module#TradingRekapModule',
            },
            {
                path: 'proforma',
                loadChildren: './acc_sales_performa/trading-acc_sales_performa.module#TradingAccSalesPerformaModule',
            },
            {
                path: 'invoice',
                loadChildren: './acc_sales_invoice/trading-acc_sales_invoice.module#TradingAccSalesInvoiceModule',
            },
            {
                path: 'ap-invoice',
                loadChildren: './acc_ap_invoice/trading-acc_ap_invoice.module#TradingAccApInvoiceModule',
                //  canActivate: [AuthGuard]
            },
            // {
            // path: 'akun-new',
            //  loadChildren: './akun-new/akun-new.module#AkunNewModule',
            // //  canActivate: [AuthGuard]
            // },

            //         {
            // path: 'akun-new',
            //  loadChildren: './akun-new/akun-new.module#AkunNewModule',
            // //  canActivate: [AuthGuard]
            // },

            //         {
            // path: 'akun-new',
            //  loadChildren: './akun-new/akun-new.module#AkunNewModule',
            // //  canActivate: [AuthGuard]
            // },

            //         {
            // path: 'akun-new',
            //  loadChildren: './akun-new/akun-new.module#AkunNewModule',
            // //  canActivate: [AuthGuard]
            // },

            //         {
            // path: 'akun-new',
            //  loadChildren: './akun-new/akun-new.module#AkunNewModule',
            // //  canActivate: [AuthGuard]
            // },

            //         {
            // path: 'akun-new',
            //  loadChildren: './akun-new/akun-new.module#AkunNewModule',
            // //  canActivate: [AuthGuard]
            // },

            //         {
            // path: 'akun-new',
            //  loadChildren: './akun-new/akun-new.module#AkunNewModule',
            // //  canActivate: [AuthGuard]
            // },
            // {
            // path: 'akun-new',
            //  loadChildren: './akun-new/akun-new.module#AkunNewModule',
            // //  canActivate: [AuthGuard]
            // },

            // {
            // path: 'akun-new',
            //  loadChildren: './akun-new/akun-new.module#AkunNewModule',
            // //  canActivate: [AuthGuard]
            // },

            //         {
            // path: 'akun-new',
            //  loadChildren: './akun-new/akun-new.module#AkunNewModule',
            // //  canActivate: [AuthGuard]
            // },

            //         {
            // path: 'akun-new',
            //  loadChildren: './akun-new/akun-new.module#AkunNewModule',
            // //  canActivate: [AuthGuard]
            // },

            //         {
            // path: 'akun-new',
            //  loadChildren: './akun-new/akun-new.module#AkunNewModule',
            // //  canActivate: [AuthGuard]
            // },

            //         {
            // path: 'akun-new',
            //  loadChildren: './akun-new/akun-new.module#AkunNewModule',
            // //  canActivate: [AuthGuard]
            // },




        ]
    }
]