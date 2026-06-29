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

import { AccKasbankRoutes } from './acc_kasbank.routing';


import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LSelect2Module } from 'ngx-select2';
import { QuillModule } from 'ngx-quill'
import {MatInputModule}from '@angular/material/input';
import {MatRadioModule}from '@angular/material/radio';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../shared/shared.module';
import { HttpClient } from '@angular/common/http';

import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { MatSelect, MatSelectModule } from '@angular/material';
import { LookupInvoiceSupplierComponent } from './lookup-invoice-supplier/lookup-invoice-supplier.component';
import { LookupInvoiceCustomerComponent } from './lookup-invoice-customer/lookup-invoice-customer.component';
import { UploadComponent } from './upload/upload.component';
import { LookupBappComponent } from './lookup-bapp/lookup-bapp.component';
import { LookupBappKebunComponent } from './lookup-bapp-kebun/lookup-bapp-kebun.component';
import { LookupInvoiceTbsComponent } from './lookup-invoice-tbs/lookup-invoice-tbs.component';
import { LookupInvoiceAngkutCpoComponent } from './lookup-invoice-angkut-cpo/lookup-invoice-angkut-cpo.component';
import { ImportComponent } from './import/import.component';
import { LookupKuitansiTbsComponent } from './lookup-kuitansi-tbs/lookup-kuitansi-tbs.component';
import { LookupPermintaanDanaComponent } from './lookup-permintaan-dana/lookup-permintaan-dana.component';
import { LookupUangMukaComponent } from './lookup-uang-muka/lookup-uang-muka.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgSelectModule } from '@ng-select/ng-select';
import { LookupPermohonanComponent } from './lookup-permohonan-pembayaran/lookup-permohonan-pembayaran.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AccKasbankRoutes),
    FormsModule,ReactiveFormsModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    DatepickerModule,
    TimepickerModule.forRoot(),
    ExportAsModule,
    DataTablesModule,
    NgSelectModule,
    MultiSelectModule,
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
  ],
  declarations: [
      ListComponent,
      AddComponent,
      EditComponent,
      LookupInvoiceSupplierComponent,
      LookupInvoiceCustomerComponent,
      LookupPermohonanComponent,
      UploadComponent,
      LookupBappComponent,LookupKuitansiTbsComponent,LookupPermintaanDanaComponent, LookupUangMukaComponent,
      LookupInvoiceTbsComponent,LookupBappKebunComponent,LookupInvoiceAngkutCpoComponent, ImportComponent

  ],entryComponents:[
    AddComponent,
    EditComponent,
    LookupInvoiceSupplierComponent,
    LookupPermohonanComponent,
    LookupInvoiceCustomerComponent,
    UploadComponent,
    LookupBappComponent,LookupKuitansiTbsComponent, LookupPermintaanDanaComponent, LookupUangMukaComponent,
    LookupInvoiceTbsComponent,LookupBappKebunComponent,LookupInvoiceAngkutCpoComponent, ImportComponent]
})

export class AccKasbankModule {}
