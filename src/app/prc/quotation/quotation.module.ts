import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxYoutubePlayerModule } from 'ngx-youtube-player';
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

import { QuotationRoutes } from './quotation.routing';


import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LSelect2Module } from 'ngx-select2';
import { QuillModule } from 'ngx-quill'
import { DetailComponent } from './detail/detail.component';
import { MatRadioModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(QuotationRoutes),
    FormsModule,ReactiveFormsModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    DatepickerModule,
    ExportAsModule,
    DataTablesModule,
    LSelect2Module,
    QuillModule.forRoot(),
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,NgxYoutubePlayerModule.forRoot()
  ],
  declarations: [
      ListComponent,
      AddComponent,
      EditComponent,
      DetailComponent

  ],entryComponents:[
    AddComponent,
    EditComponent,]
})

export class QuotationModule {}
