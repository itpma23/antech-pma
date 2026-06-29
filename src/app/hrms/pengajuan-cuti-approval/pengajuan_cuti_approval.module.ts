import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ModalModule,
  TooltipModule,
  DatepickerModule,
  BsDatepickerModule,
  TabsModule,
  BsDropdownModule,

} from 'ngx-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { ExportAsModule } from 'ngx-export-as';

import { PengajuanCutiApprovalRoutes } from './pengajuan_cuti_approval.routing';


import { ListComponent } from './list/list.component';
import { ApprovalComponent } from './approval/approval.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LSelect2Module } from 'ngx-select2';
import { QuillModule } from 'ngx-quill'
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../shared/shared.module';
import { HttpClient } from '@angular/common/http';

import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { MatSelect, MatSelectModule } from '@angular/material';
import { ApprovalLastComponent } from './approval_last/approval_last.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PengajuanCutiApprovalRoutes),
    FormsModule, ReactiveFormsModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    DatepickerModule,
    TimepickerModule.forRoot(),
    ExportAsModule,
    DataTablesModule,
    LSelect2Module,
    QuillModule.forRoot(),
    MatInputModule, MatRadioModule, MatSelectModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [
    ListComponent,
    ApprovalComponent, ApprovalLastComponent


  ], entryComponents: [
    ApprovalComponent,ApprovalLastComponent
  ]
})

export class PengajuanCutiApprovalModule { }
