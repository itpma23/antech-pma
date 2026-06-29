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
  TimepickerModule,
} from 'ngx-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { ExportAsModule } from 'ngx-export-as';
import { AccPremintaanDanaRoutes } from './acc_permintaan_dana.routing';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LSelect2Module } from 'ngx-select2';
import { MatInputModule, MatRadioModule } from '@angular/material';
import { UploadComponent } from './upload/upload.component';
// import { AccessComponent } from './access/acces.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AccPremintaanDanaRoutes),
    FormsModule,ReactiveFormsModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    DatepickerModule,
    ExportAsModule,
    DataTablesModule,
    LSelect2Module,
    MatInputModule,MatRadioModule,
    TimepickerModule.forRoot(),

  ],
  declarations: [
      ListComponent,
      AddComponent,
      EditComponent,
      UploadComponent

  ],entryComponents:[
    AddComponent,
    EditComponent,UploadComponent]
})

export class AccPermintaanDanaModule {}
