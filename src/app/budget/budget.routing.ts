import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';


export const BudgetRoutes: Routes = [
  {
    path: '',
    children: [

      {
        path: 'kegiatan-cost-afd',
        loadChildren: './kegiatan-cost-afd/kegiatan-cost-afd.module#KegiatanCostAfdModule',
        //  canActivate: [AuthGuard]
      },
      {
        path: 'produksi-afd',
        loadChildren: './produksi-afd/produksi-afd.module#ProduksiAfdModule',
        //  canActivate: [AuthGuard]
      },
      
    ]
  }
];
