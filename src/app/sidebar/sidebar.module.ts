import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
    imports: [
      RouterModule,
       CommonModule,
      TranslateModule.forChild({
        loader: {
          provide: TranslateLoader,
          useFactory: (HttpLoaderFactory),
          deps: [HttpClient]
        }
      }),
      NgxPermissionsModule ],
    declarations: [ SidebarComponent ],
    exports: [ SidebarComponent ]
})

export class SidebarModule {}
