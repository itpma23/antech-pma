import { Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },

  {
    path: '',
    component: AdminLayoutComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'administrator',
        loadChildren: './administrator/administrator.module#AdministratorModule',

      },
      {
        path: 'global-master',
        loadChildren: './global-master/global-master.module#GlobalMasterModule',

      },
      {
        path: 'pks',
        loadChildren: './pks/pks.module#PksModule',

      },
      {
        path: 'workshop',
        loadChildren: './workshop/workshop.module#WorkshopModule',

      },
      {
        path: 'prc',
        loadChildren: './prc/prc.module#PrcModule',

      },
      {
        path: 'budget',
        loadChildren: './budget/budget.module#BudgetModule',

      },
      {
        path: 'sls',
        loadChildren: './sls/sls.module#SlsModule',

      },
      {
        path: 'karyawan',
        loadChildren: './master_data/karyawan/karyawan.module#KaryawanModule',

      },
      {
        path: 'estate',
        loadChildren: './estate/estate.module#EstateModule',

      },

      {
        path: 'profile',
        loadChildren: './profile/profile.module#ProfileModule'
      },
      {
        path: 'traksi',
        loadChildren: './traksi/traksi.module#TraksiModule'
        // loadChildren: () => import('./traksi/traksi.module').then(m => m.TraksiModule)
      },

      {
        path: 'accounting',
        loadChildren: './accounting/accounting.module#AccountingModule',
        // canLoad: [NgxPermissionsGuard],
        data: {
          title: "Accounting",
          breadcrumbs: {
            //text: "keuangan.announcements.text",
            icon: "fa fa-bullhorn",
            show: false,
            isHome: false
          },
          permissions: {
            only: ['ADMIN', 'AKUNTING']
          }
        },
      },
      {
        path: 'hrms',
        loadChildren: './hrms/hrms.module#HrmsModule',
        // canLoad: [NgxPermissionsGuard],
        data: {
          title: "HRMS",
          breadcrumbs: {
            text: "Hrms",
            icon: "fa fa-bullhorn",
            show: false,
            isHome: false
          },
          permissions: {
            only: ['ADMIN', 'PAYROLL']
          }
        },
      },
      {
        path: 'inventory',
        loadChildren: './inventory/inventory.module#InventoryModule',
        // canLoad: [NgxPermissionsGuard],
        data: {
          title: "Inventory",
          breadcrumbs: {
            text: "inventory",
            icon: "fa fa-bullhorn",
            show: false,
            isHome: false
          },
          permissions: {
            only: ['ADMIN', 'INVENTORY']
          }
        },
      },

      {
        path: 'components',
        loadChildren: './components/components.module#ComponentsModule'
      }, {
        path: 'forms',
        loadChildren: './forms/forms.module#Forms'
      }, {
        path: 'tables',
        loadChildren: './tables/tables.module#TablesModule'
      }, {
        path: 'maps',
        loadChildren: './maps/maps.module#MapsModule'
      }, {
        path: 'widgets',
        loadChildren: './widgets/widgets.module#WidgetsModule'
      }, {
        path: 'charts',
        loadChildren: './charts/charts.module#ChartsModule'
      }, {
        path: 'calendar',
        loadChildren: './calendar/calendar.module#CalendarModule'
      }, {
        path: '',
        loadChildren: './userpage/user.module#UserModule'
      }, {
        path: '',
        loadChildren: './timeline/timeline.module#TimelineModule'
      },
      {
        path: 'trading',
        loadChildren: './trading/trading.module#TradingModule'
      }
    ]
  },
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule',

  }
];
