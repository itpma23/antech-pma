import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PengeluaranBarangRoutes } from './pengeluaran-barang.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule, BsDropdownModule, DatepickerModule, ModalModule, TimepickerModule } from 'ngx-bootstrap';
import { MatInputModule, MatRadioModule, MatSelectModule } from '@angular/material';
import { DataTablesModule } from 'angular-datatables';
import { ExportAsModule } from 'ngx-export-as';
import { QuillModule } from 'ngx-quill';
import { LSelect2Module } from 'ngx-select2';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/shared/shared.module';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [ListComponent, AddComponent, DetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(PengeluaranBarangRoutes),
    FormsModule,ReactiveFormsModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    DatepickerModule,
    TimepickerModule.forRoot(),
    ExportAsModule,
    DataTablesModule,
    ToastrModule,
    LSelect2Module,
    QuillModule.forRoot(),
    MatInputModule,MatRadioModule,MatSelectModule,
    TranslateModule.forChild({
      loader: {
          provide: TranslateLoader,
          useFactory: (HttpLoaderFactory),
          deps: [HttpClient]
       }
    }),
  ],entryComponents:[
    AddComponent,DetailComponent
  ]
})
export class PengeluaranBarangModule { }
