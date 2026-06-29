import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';


export const AdministratorRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'menu-manager',
      loadChildren: './menu-manager/menu-manager.module#MenuManagerModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'menu-acces',
      loadChildren: './menu-acces/menu-acces.module#MenuAccesModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'user',
      loadChildren: './user/user.module#UserModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'unposting',
      loadChildren: './unposting/unposting.module#UnpostingModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'posting',
      loadChildren: './posting_transaksi/posting_transaksi.module#PostingTransaksiModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'user-audit',
      loadChildren: './user-audit/user-audit.module#UserAuditModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'user-log-login',
      loadChildren: './user-log-login/user-log-login.module#UserLogLoginModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'user-activity',
      loadChildren: './user-activity/user-activity.module#UserActivityModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'monitoring-harian',
      loadChildren: './monitoring-harian/monitoring-harian.module#MonitoringHarianModule',
      //  canActivate: [AuthGuard]
    },
    {
      path: 'dashboard-setting',
      loadChildren: './dashboard-setting/dashboard-setting.module#DashboardSettingModule',
      //  canActivate: [AuthGuard]
    },

    ]
  }
];
