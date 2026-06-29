import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule, MatRadioModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
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

import { LaporanPermintaanPindahGudangRoutes } from './laporan-permintaan-pindah-gudang.routing';


import { ListComponent } from './list/list.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LSelect2Module } from 'ngx-select2';
import { NestableModule } from 'ngx-nestable';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(LaporanPermintaanPindahGudangRoutes),
    FormsModule,ReactiveFormsModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    DatepickerModule,
    ExportAsModule,
    DataTablesModule,
    LSelect2Module,
    NestableModule,
    MatCheckboxModule,MatInputModule,MatRadioModule

  ],
  declarations: [
      ListComponent,


  ],entryComponents:[
    ]
})

export class LaporanPermintaanPindahGudangModule {}
